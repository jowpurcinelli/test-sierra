"use client"

import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/hooks/use-auth"
import { useAuthContext } from "@/components/auth-provider"
import { Skeleton } from "@/components/ui/skeleton"

export function UserNav() {
  const { currentUser, isLoading } = useAuth()
  const { logout } = useAuthContext()

  const displayName = currentUser?.displayName || ""

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage 
              src={currentUser?.avatarUrl ? 
                `${process.env.NEXT_PUBLIC_API_URL}${currentUser.avatarUrl}` : 
                "/placeholder.svg"} 
              alt={displayName} 
            />
            <AvatarFallback>
              {(displayName).charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            {isLoading ? (
              <>
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-3 w-24" />
              </>
            ) : (
              <>
                <p className="text-sm font-medium leading-none">{displayName}</p>
                <p className="text-xs leading-none text-muted-foreground">{currentUser?.email}</p>
              </>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard">Dashboard</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/profile">Profile</Link>
        </DropdownMenuItem>
        {displayName && (
          <DropdownMenuItem asChild>
            <Link href={`/${displayName}`} target="_blank">
              View Public Page
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
