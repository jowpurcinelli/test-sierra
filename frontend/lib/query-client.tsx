'use client';

import { QueryClient, QueryClientProvider as TanStackQueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactNode, useState } from 'react';


export function QueryClientProvider({ children }: { children: ReactNode }) {
  
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        
        staleTime: 1000 * 60 * 5, 
        gcTime: 1000 * 60 * 10, 
        retry: 1,
        refetchOnWindowFocus: true,
      },
      mutations: {
        retry: 1,
      },
    },
  }));

  return (
    <TanStackQueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </TanStackQueryClientProvider>
  );
} 