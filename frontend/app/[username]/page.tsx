'use client'

import { useEffect, useState } from "react"
import { notFound, useParams } from "next/navigation"
import { useUsers } from "@/hooks/use-users"
import { useProfile } from "@/hooks/use-profile"
import { useLinks } from "@/hooks/use-links"
import ProfileContent from "./profile-content"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProfilePage() {
  
  const { username } = useParams<{ username: string }>()
  const [error, setError] = useState<string | null>(null)

  
  const { getUserByUsername } = useUsers()
  const { getProfileByUsername } = useProfile()
  const { getPublicLinks } = useLinks()

  const userQuery = getUserByUsername(username as string)
  
  
  const userId = userQuery.data?.id
  const profileQuery = getProfileByUsername(username as string)
  
  
  const linksQuery = getPublicLinks(userId || '')
  
  
  useEffect(() => {
    if (userQuery.error) {
      console.error("Error fetching user:", userQuery.error)
      setError("User not found")
    } else if (profileQuery.error) {
      console.error("Error fetching profile:", profileQuery.error)
      setError("Profile not found")
    } else if (linksQuery.error && userId) {
      console.error("Error fetching links:", linksQuery.error)
      
    }
  }, [userQuery.error, profileQuery.error, linksQuery.error, userId])

  
  if (userQuery.isPending || profileQuery.isPending) {
    return (
      <div className="flex flex-col items-center w-full p-4">
        <div className="container max-w-lg w-full mt-8">
          <div className="h-8 w-32 mb-8">
            <Skeleton className="h-8 w-full" />
          </div>
          <div className="rounded-lg border bg-card p-8">
            <div className="flex flex-col items-center">
              <Skeleton className="h-32 w-32 rounded-full mb-4" />
              <Skeleton className="h-8 w-40 mb-2" />
              <Skeleton className="h-4 w-64 mb-8" />
              
              <div className="space-y-4 w-full">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  
  if (error || !userQuery.data || !profileQuery.data) {
    return notFound()
  }
  
  
  const links = linksQuery.data || []
  
  return (
    <ProfileContent 
      username={username as string}
      profile={profileQuery.data}
      links={links}
    />
  )
}
