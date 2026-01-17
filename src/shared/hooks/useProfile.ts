"use client";

import type { User as AuthUser } from "@/shared/api/auth.service";
import { useAuthStore } from "@/shared/store/auth.store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";

const JWT_COOKIE_NAME = "auth_token";

// апдейт юзера через твой usersApi (upstream PATCH /users/:id)
import { usersApi, type UpdateUserRequest } from "@/shared/api/users.service";

// Маппинг из полей профиля в UpdateUserRequest (у тебя там name/email/role/birthDate/image)
type ProfileForm = {
  firstName: string;
  lastName: string;
  email: string;
  image?: string;
};

export const useUpdateProfile = () => {
  const qc = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);
  const user = useAuthStore((s) => s.user);

  return useMutation({
    mutationFn: async (data: ProfileForm) => {
      if (!user) throw new Error("No user");
      const req: UpdateUserRequest = {
        name: `${data.firstName} ${data.lastName}`.trim(),
        email: data.email,
        image: data.image,
      };
      return usersApi.updateUser(user.id, req);
    },

    onMutate: async (data) => {
      if (!user) return;

      await qc.cancelQueries({ queryKey: ["auth", "me"] });
      const prevMe = qc.getQueryData<AuthUser>([
        "auth",
        "me",
        Cookies.get(JWT_COOKIE_NAME) || null,
      ]);

      // оптимистично обновим store (чтобы хедер/виджет тоже обновился)
      const optimistic: AuthUser = {
        ...(user as any),
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        image: data.image ?? (user as any).image,
      };

      setUser(optimistic);
      qc.setQueryData(
        ["auth", "me", Cookies.get(JWT_COOKIE_NAME) || null],
        optimistic
      );

      return { prevMe };
    },

    onError: (_e, _vars, ctx) => {
      if (ctx?.prevMe) {
        setUser(ctx.prevMe);
        qc.setQueryData(
          ["auth", "me", Cookies.get(JWT_COOKIE_NAME) || null],
          ctx.prevMe
        );
      }
    },

    onSuccess: (updated) => {
      // usersApi.updateUser вернёт User из users.service,
      // надо привести к AuthUser формату (минимально)
      const current = useAuthStore.getState().user;
      if (!current) return;

      const next: AuthUser = {
        ...current,
        firstName: (updated as any).firstName ?? current.firstName,
        lastName: (updated as any).lastName ?? current.lastName,
        email: (updated as any).email ?? current.email,
        image: (updated as any).image ?? current.image,
      };

      setUser(next);
      qc.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });
};
