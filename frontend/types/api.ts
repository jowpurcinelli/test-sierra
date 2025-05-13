
export interface PaginatedResponse<T> {
  items: T[];
  meta: {
    itemCount: number;
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
  links?: {
    first: string;
    previous: string;
    next: string;
    last: string;
  };
}


export interface User {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  accentColor: string;
  isPublic: boolean;
  email: string;
  profileId: string;
  createdAt: string;
  updatedAt: string;
}


export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}


export interface Profile {
  id: string;
  userId: string;
  displayName: string;
  bio: string | null;
  avatarUrl: string;
  theme: string;
  accentColor: string;
  isPublic: boolean;
  socialLinks: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}


export interface Link {
  id: string;
  title: string;
  url: string;
  description: string | null;
  isActive: boolean;
  order: number;
  clickCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLinkDto {
  title: string;
  url: string;
  description?: string;
  isActive?: boolean;
  order?: number;
}

export interface UpdateLinkDto {
  title?: string;
  url?: string;
  description?: string;
  isActive?: boolean;
  order?: number;
} 