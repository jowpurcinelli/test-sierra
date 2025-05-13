'use client';

import { api } from '@/lib/api-client';
import { Profile } from '@/types/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useProfile() {
  const queryClient = useQueryClient();

  
  const getCurrentProfile = useQuery<Profile>({
    queryKey: ['profile', 'current'],
    queryFn: () => api.get('/profiles/me'),
    
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('accessToken'),
  });

  
  const getProfileByUsername = (username: string) => {
    return useQuery<Profile>({
      queryKey: ['profile', 'username', username],
      queryFn: () => api.get(`/profiles/username/${username}`),
      enabled: !!username,
    });
  };

  
  const updateProfile = useMutation<
    Profile,
    Error,
    Partial<Omit<Profile, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>
  >({
    mutationFn: (data) => api.patch('/profiles/me', data),
    onSuccess: (updatedProfile) => {
      
      queryClient.invalidateQueries({ queryKey: ['profile', 'current'] });
      if (updatedProfile.userId) {
        queryClient.invalidateQueries({ 
          queryKey: ['profile', 'username', updatedProfile.userId]
        });
      }
    },
  });

  
  const uploadAvatar = useMutation<Profile, Error, FormData>({
    mutationFn: (formData) => 
      api.post('/profiles/me/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      }),
    onSuccess: (updatedProfile) => {
      queryClient.invalidateQueries({ queryKey: ['profile', 'current'] });
      if (updatedProfile.userId) {
        queryClient.invalidateQueries({ 
          queryKey: ['profile', 'username', updatedProfile.userId]
        });
      }
    },
  });

  
  const updateSocialLinks = useMutation<
    Profile,
    Error,
    Record<string, string>
  >({
    mutationFn: (data) => api.patch('/profiles/me/social-links', { socialLinks: data }),
    onSuccess: (updatedProfile) => {
      queryClient.invalidateQueries({ queryKey: ['profile', 'current'] });
      if (updatedProfile.userId) {
        queryClient.invalidateQueries({ 
          queryKey: ['profile', 'username', updatedProfile.userId]
        });
      }
    },
  });

  return {
    getCurrentProfile,
    getProfileByUsername,
    updateProfile,
    uploadAvatar,
    updateSocialLinks,
  };
} 