import type { QueryClient } from "@tanstack/react-query";
import type { GetUsersResponse } from "../api/users.service";

export const updateAllUsersCaches = (
  queryClient: QueryClient,
  updater: (prev: GetUsersResponse) => GetUsersResponse
) => {
  queryClient
    .getQueriesData<GetUsersResponse>({ queryKey: ["users"] })
    .forEach(([key, data]) => {
      if (!data) return;
      queryClient.setQueryData(key, updater(data));
    });
};
