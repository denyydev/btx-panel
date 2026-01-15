import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CreateUserRequest,
  GetUsersParams,
  UpdateUserRequest,
  usersApi,
} from "../api/users.service";

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserRequest }) =>
      usersApi.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => usersApi.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useUsersWithMetricsQuery = (params?: GetUsersParams) => {
  return useQuery({
    queryKey: ["users", "metrics", params],
    queryFn: () => usersApi.getUsersWithMetrics(params),
    staleTime: 30 * 1000,
  });
};
