import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { socket } from "../../providers/socket-provider"; // поправь путь под свой проект
import type { GetUsersResponse, User } from "../api/users.service";
import {
  CreateUserRequest,
  GetUsersParams,
  UpdateUserRequest,
  usersApi,
} from "../api/users.service";

const updateAllUsersCaches = (
  queryClient: ReturnType<typeof useQueryClient>,
  updater: (prev: GetUsersResponse) => GetUsersResponse
) => {
  queryClient
    .getQueriesData<GetUsersResponse>({ queryKey: ["users"] })
    .forEach(([key, data]) => {
      if (!data) return;
      queryClient.setQueryData(key, updater(data));
    });
};

const splitName = (fullName: string) => {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  const firstName = parts[0] ?? "";
  const lastName = parts.slice(1).join(" ");
  return { firstName, lastName };
};

export const useUsersQuery = (params?: GetUsersParams) => {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => usersApi.getUsers(params),
    staleTime: 30 * 1000,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserRequest) => usersApi.createUser(data),

    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ["users"] });

      const previous = queryClient.getQueriesData<GetUsersResponse>({
        queryKey: ["users"],
      });

      const { firstName, lastName } = splitName(data.name);

      const optimisticUser: User = {
        id: Date.now(),
        firstName,
        lastName,
        email: data.email,
        birthDate: data.birthDate,
        role: data.role ?? "user",
        image: data.image,
      };

      updateAllUsersCaches(queryClient, (prev) => ({
        ...prev,
        users: [optimisticUser, ...prev.users],
        total: prev.total + 1,
      }));

      return { previous, optimisticId: optimisticUser.id };
    },

    onSuccess: (_createdUser, _data, ctx) => {
      socket.emit("entity:changed", {
        entity: "user",
        action: "create",
        id: ctx?.optimisticId,
      });
    },

    onError: (_err, _data, ctx) => {
      ctx?.previous?.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserRequest }) =>
      usersApi.updateUser(Number(id), data),

    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ["users"] });

      const previous = queryClient.getQueriesData<GetUsersResponse>({
        queryKey: ["users"],
      });

      const userId = Number(id);
      const nameParts = data.name ? splitName(data.name) : null;

      updateAllUsersCaches(queryClient, (prev) => ({
        ...prev,
        users: prev.users.map((u) =>
          u.id !== userId
            ? u
            : {
                ...u,
                ...(nameParts
                  ? {
                      firstName: nameParts.firstName,
                      lastName: nameParts.lastName,
                    }
                  : {}),
                ...(data.email != null ? { email: data.email } : {}),
                ...(data.birthDate != null
                  ? { birthDate: data.birthDate }
                  : {}),
                ...(data.role != null ? { role: data.role } : {}),
                ...(data.image != null ? { image: data.image } : {}),
              }
        ),
      }));

      return { previous, userId };
    },

    onSuccess: (_updatedUser, _vars, ctx) => {
      socket.emit("entity:changed", {
        entity: "user",
        action: "update",
        id: ctx?.userId,
      });
    },

    onError: (_err, _vars, ctx) => {
      ctx?.previous?.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => usersApi.deleteUser(Number(id)),

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["users"] });

      const previous = queryClient.getQueriesData<GetUsersResponse>({
        queryKey: ["users"],
      });

      const userId = Number(id);

      updateAllUsersCaches(queryClient, (prev) => ({
        ...prev,
        users: prev.users.filter((u) => u.id !== userId),
        total: Math.max(0, prev.total - 1),
      }));

      return { previous, userId };
    },

    onSuccess: (_data, _id, ctx) => {
      socket.emit("entity:changed", {
        entity: "user",
        action: "delete",
        id: ctx?.userId,
      });
    },

    onError: (_err, _id, ctx) => {
      ctx?.previous?.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
    },
  });
};

export const useUsersWithMetricsQuery = (params?: GetUsersParams) => {
  return useQuery({
    queryKey: ["users", "metrics", params],
    queryFn: () => usersApi.getUsersWithMetrics(params),
    staleTime: 30 * 1000,
    placeholderData: (prev) => prev,
  });
};
