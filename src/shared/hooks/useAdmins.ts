import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminsApi } from "../api/admins.service";
import type {
  CreateUserRequest,
  GetUsersParams,
  GetUsersResponse,
  UpdateUserRequest,
  User,
} from "../api/users.service";

const updateAllAdminsCaches = (
  queryClient: ReturnType<typeof useQueryClient>,
  updater: (prev: GetUsersResponse) => GetUsersResponse
) => {
  queryClient
    .getQueriesData<GetUsersResponse>({ queryKey: ["admins"] })
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

export const useAdminsQuery = (params?: GetUsersParams) => {
  return useQuery({
    queryKey: ["admins", params],
    queryFn: () => adminsApi.getAdmins(params),
    staleTime: 30 * 1000,
  });
};

export const useCreateAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserRequest) => adminsApi.createAdmin(data),

    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ["admins"] });

      const previous = queryClient.getQueriesData<GetUsersResponse>({
        queryKey: ["admins"],
      });

      const { firstName, lastName } = splitName(data.name);

      const optimisticAdmin: User = {
        id: Date.now(),
        firstName,
        lastName,
        email: data.email,
        birthDate: data.birthDate,
        role: "admin",
        image: data.image,
      };

      updateAllAdminsCaches(queryClient, (prev) => ({
        ...prev,
        users: [optimisticAdmin, ...prev.users],
        total: prev.total + 1,
      }));

      return { previous };
    },

    onError: (_err, _data, ctx) => {
      ctx?.previous?.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
    },
  });
};

export const useUpdateAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateUserRequest }) =>
      adminsApi.updateAdmin(id, data),

    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ["admins"] });

      const previous = queryClient.getQueriesData<GetUsersResponse>({
        queryKey: ["admins"],
      });

      const nameParts = data.name ? splitName(data.name) : null;

      updateAllAdminsCaches(queryClient, (prev) => ({
        ...prev,
        users: prev.users.map((u) =>
          u.id !== id
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
                role: "admin",
                ...(data.image != null ? { image: data.image } : {}),
              }
        ),
      }));

      return { previous };
    },

    onError: (_err, _vars, ctx) => {
      ctx?.previous?.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
    },
  });
};

export const useDeleteAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => adminsApi.deleteAdmin(id),

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["admins"] });

      const previous = queryClient.getQueriesData<GetUsersResponse>({
        queryKey: ["admins"],
      });

      updateAllAdminsCaches(queryClient, (prev) => ({
        ...prev,
        users: prev.users.filter((u) => u.id !== id),
        total: Math.max(0, prev.total - 1),
      }));

      return { previous };
    },

    onError: (_err, _id, ctx) => {
      ctx?.previous?.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
    },
  });
};
