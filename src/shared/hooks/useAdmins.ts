import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminsApi } from "../api/admins.service";
import {
  CreateUserRequest,
  GetUsersParams,
  UpdateUserRequest,
} from "../api/users.service";

export const useAdminsQuery = (params?: GetUsersParams) => {
  return useQuery({
    queryKey: ["admins", params],
    queryFn: () => adminsApi.getAdmins(params),
    staleTime: 30 * 1000,
  });
};

export const useCreateAdmin = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateUserRequest) => adminsApi.createAdmin(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admins"] }),
  });
};

export const useUpdateAdmin = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateUserRequest }) =>
      adminsApi.updateAdmin(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admins"] }),
  });
};

export const useDeleteAdmin = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminsApi.deleteAdmin(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admins"] }),
  });
};
