import { useQuery } from '@tanstack/react-query';
import { usersApi } from '../api/users.service';

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => usersApi.getUsers(),
    staleTime: 5 * 60 * 1000,
  });
};

