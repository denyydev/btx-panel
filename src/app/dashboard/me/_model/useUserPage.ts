"use client";

import { useAuthMe } from "@/shared/hooks/useAuth";
import { useUpdateProfile } from "@/shared/hooks/useProfile";
import { useAuthStore } from "@/shared/store/auth.store";
import { useEffect, useMemo, useState } from "react";
import type { UserFormState, UserPageVM } from "./types";
import { formatBirth, roleLabel } from "./utils";

export function useUserPage(): UserPageVM {
  useAuthMe();
  const me = useAuthStore((s) => s.user);
  const updateProfile = useUpdateProfile();

  const [form, setForm] = useState<UserFormState>({
    firstName: "",
    lastName: "",
    email: "",
    image: "",
  });

  useEffect(() => {
    if (!me) return;
    setForm({
      firstName: me.firstName || "",
      lastName: me.lastName || "",
      email: me.email || "",
      image: me.image || "",
    });
  }, [me?.id]);

  const fullName = useMemo(() => {
    const first = (form.firstName || "").trim();
    const last = (form.lastName || "").trim();
    return `${first} ${last}`.trim() || "User";
  }, [form.firstName, form.lastName]);

  const birth = formatBirth((me as any)?.birthDate);
  const roleText = roleLabel((me as any)?.role);

  const onSave = async () => {
    if (!me) return;
    await updateProfile.mutateAsync({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      image: form.image.trim() || undefined,
    });
  };

  return {
    me,
    form,
    setForm,
    fullName,
    birth,
    roleText,
    isSaving: updateProfile.isPending,
    onSave,
  };
}
