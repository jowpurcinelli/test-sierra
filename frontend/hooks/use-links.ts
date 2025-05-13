'use client';

import { api } from '@/lib/api-client';
import { CreateLinkDto, Link, PaginatedResponse, UpdateLinkDto } from '@/types/api';
import { 
  useMutation, 
  useQuery, 
  useQueryClient, 
  useInfiniteQuery 
} from '@tanstack/react-query';


export function useLinks() {
  const queryClient = useQueryClient();

  
  const getLinks = useQuery<Link[]>({
    queryKey: ['links'],
    queryFn: () => api.get('/links'),
  });

  
  const getPaginatedLinks = (page = 1, limit = 10) => {
    return useQuery<PaginatedResponse<Link>>({
      queryKey: ['links', 'paginated', { page, limit }],
      queryFn: () => api.get(`/links?page=${page}&limit=${limit}`),
    });
  };

  
  const useInfiniteLinks = (limit = 10) => {
    return useInfiniteQuery<PaginatedResponse<Link>>({
      queryKey: ['links', 'infinite'],
      queryFn: ({ pageParam = 1 }) => 
        api.get(`/links?page=${pageParam}&limit=${limit}`),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        const { currentPage, totalPages } = lastPage.meta;
        return currentPage < totalPages ? currentPage + 1 : undefined;
      },
    });
  };

  
  const getLink = (id: string) => {
    return useQuery<Link>({
      queryKey: ['links', id],
      queryFn: () => api.get(`/links/${id}`),
      enabled: !!id,
    });
  };
  
  const getPublicLinks = (userId: string) => {
    return useQuery<Link[]>({
      queryKey: ['links', 'public', userId],
      queryFn: () => api.get(`/links/user/${userId}/public`),
      enabled: !!userId,
    });
  };

  
  const createLink = useMutation<Link, Error, CreateLinkDto>({
    mutationFn: (data) => api.post('/links', data),
    onSuccess: () => {
      
      queryClient.invalidateQueries({ queryKey: ['links'] });
    },
  });

  
  const updateLink = useMutation<Link, Error, { id: string; data: UpdateLinkDto }>({
    mutationFn: ({ id, data }) => api.patch(`/links/${id}`, data),
    onSuccess: (data) => {
      
      queryClient.invalidateQueries({ queryKey: ['links'] });
      queryClient.invalidateQueries({ queryKey: ['links', data.id] });
    },
  });

  
  const deleteLink = useMutation<void, Error, string>({
    mutationFn: (id) => api.delete(`/links/${id}`),
    onSuccess: () => {
      
      queryClient.invalidateQueries({ queryKey: ['links'] });
    },
  });

  
  const updateLinkOrder = useMutation<Link[], Error, { links: { id: string; order: number }[] }>({
    mutationFn: (data) => api.patch('/links/reorder', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] });
    },
  });

  return {
    getLinks,
    getPaginatedLinks,
    useInfiniteLinks,
    getLink,
    getPublicLinks,
    createLink,
    updateLink,
    deleteLink,
    updateLinkOrder,
  };
} 