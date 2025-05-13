"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import type { User } from "@/types/api"
import { useQueryClient } from "@tanstack/react-query"

interface AuthContextType {
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  logout: () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const queryClient = useQueryClient()

  
  useEffect(() => {
    setMounted(true)
  }, [])

  
  const logout = () => {
    localStorage.removeItem('accessToken')
    queryClient.clear()
    router.push('/login')
  }

  useEffect(() => {
    if (mounted) {
      
      const protectedRoutes = ["/dashboard", "/dashboard/profile"]
      const isProtectedRoute = protectedRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`))

      
      const authRoutes = ["/login", "/signup"]
      const isAuthRoute = authRoutes.includes(pathname)

      
      const hasToken = typeof window !== 'undefined' && !!localStorage.getItem('accessToken')

      if (isProtectedRoute && !hasToken) {
        router.push("/login")
      } else if (isAuthRoute && hasToken) {
        router.push("/dashboard")
      }
    }
  }, [pathname, router, mounted])

  
  if (!mounted) {
    return <>{children}</>
  }

  return (
    <AuthContext.Provider value={{ logout }}>
      {children}
    </AuthContext.Provider>
  )
}



export const useAuthContext = () => useContext(AuthContext)
