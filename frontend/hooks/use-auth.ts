'use client';

import { api } from '@/lib/api-client';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '@/types/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [mounted, setMounted] = useState(false);

  
  useEffect(() => {
    setMounted(true);
  }, []);

  
  const hasToken = mounted && typeof window !== 'undefined' && !!localStorage.getItem('accessToken');

  
  const { data: currentUser, isLoading, error, refetch } = useQuery<User>({
    queryKey: ['currentUser'],
    queryFn: async () => {
      console.log('Fetching current user data...');
      try {
        const userData = await api.get<User>('/profiles/me');
        console.log('User data fetched:', userData);
        return userData;
      } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
      }
    },
    retry: 1,
    
    enabled: hasToken,
  });

  
  const login = useMutation<AuthResponse, Error, LoginRequest>({
    mutationFn: (credentials) => api.post('/auth/login', credentials),
    onSuccess: (data) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', data.accessToken);
        
        queryClient.invalidateQueries({ queryKey: ['currentUser'] });
        router.push('/dashboard');
      }
    },
  });

  
  const register = useMutation<AuthResponse, Error, RegisterRequest>({
    mutationFn: (data) => api.post('/auth/register', data),
    onSuccess: (data) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', data.accessToken);
        
        queryClient.invalidateQueries({ queryKey: ['currentUser'] });
        router.push('/dashboard');
      }
    },
  });

  
  const logout = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      
      queryClient.clear();
      router.push('/login');
    }
  }, [queryClient, router]);

  return {
    currentUser,
    isLoading: !mounted || isLoading,
    isLoggedIn: !!currentUser,
    error,
    login,
    register,
    logout,
  };
} 