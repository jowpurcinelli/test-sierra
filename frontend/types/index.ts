export interface User {
  id: string
  email: string
  username: string
  createdAt: string
}

export interface Link {
  id: string
  userId: string
  title: string
  url: string
  isVisible: boolean
  order: number
}

export interface Profile {
  id: string
  userId: string
  displayName: string
  bio: string
  avatarUrl: string
  accentColor: string
  isPublic: boolean
}
