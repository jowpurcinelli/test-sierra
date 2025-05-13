import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { toast } from 'sonner';


const isBrowser = typeof window !== 'undefined';


export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});


if (isBrowser) {
  apiClient.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  
  apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      
      if (error.response) {
        
        
        if (error.response.status === 401) {
          
          toast.error('Session expired. Please login again.');
          localStorage.removeItem('accessToken');
          window.location.href = '/login';
        } else if (error.response.status === 403) {
          toast.error('You don\'t have permission to perform this action');
        } else if (error.response.status === 429) {
          toast.error('Too many requests. Please try again later.');
        } else {
          
          const message = error.response.data && typeof error.response.data === 'object' 
            ? (error.response.data as any).message || 'An error occurred'
            : 'An error occurred';
          toast.error(message);
        }
      } else if (error.request) {
        
        toast.error('No response from server. Please check your internet connection.');
      } else {
        
        toast.error('An error occurred. Please try again.');
      }
      return Promise.reject(error);
    }
  );
}


export async function request<T>(config: AxiosRequestConfig): Promise<T> {
  try {
    const response = await apiClient(config);
    return response.data;
  } catch (error) {
    throw error;
  }
}


export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) => 
    request<T>({ ...config, method: 'GET', url }),
  post: <T>(url: string, data?: any, config?: AxiosRequestConfig) => 
    request<T>({ ...config, method: 'POST', url, data }),
  put: <T>(url: string, data?: any, config?: AxiosRequestConfig) => 
    request<T>({ ...config, method: 'PUT', url, data }),
  patch: <T>(url: string, data?: any, config?: AxiosRequestConfig) => 
    request<T>({ ...config, method: 'PATCH', url, data }),
  delete: <T>(url: string, config?: AxiosRequestConfig) => 
    request<T>({ ...config, method: 'DELETE', url }),
}; 