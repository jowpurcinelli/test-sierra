'use client';

import { api } from '@/lib/api-client';
import { User } from '@/types/api';
import { useQuery } from '@tanstack/react-query';

export function useUsers() {
  const getUserByUsername = (username: string) => {
    return useQuery<User>({
      queryKey: ['users', 'username', username],
      queryFn: () => api.get(`/users/username/${username}`),
      enabled: !!username,
      retry: 1,
      staleTime: 1000 * 60 * 5,
    });
  };

  return {
    getUserByUsername,
  };
} 