'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, ExternalLink } from "lucide-react"
import { Link as LinkType, Profile as ApiProfile } from "@/types/api"
import { LinkCard } from "@/components/LinkCard"



interface ProfileContentProps {
  username: string
  profile: ApiProfile
  links: LinkType[]
}

export default function ProfileContent({ username, profile, links }: ProfileContentProps) {
  
  const [accentColorStyle, setAccentColorStyle] = useState<React.CSSProperties | null>(null)
  const [buttonStyle, setButtonStyle] = useState<React.CSSProperties | null>(null)
  
  
  const displayName = profile.displayName || username

  useEffect(() => {
    
    const accentColor = profile.accentColor || "#189278"
    
    setAccentColorStyle({
      backgroundColor: `${accentColor}10`,
      backgroundImage: "radial-gradient(circle at center, rgba(255, 255, 255, 0.56) 0%, rgba(80, 80, 80, 0) 70%)",
    })
    
    setButtonStyle({
      borderColor: accentColor,
      color: accentColor,
      transition: "all 0.2s ease-in-out",
    })
  }, [profile.accentColor])

  
  const getInitials = (name: string) => {
    if (!name) return username.substring(0, 2).toUpperCase()
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  
  const getFullAvatarUrl = (url: string | null) => {
    if (!url) return undefined
    if (url.startsWith('http')) return url
    return `${process.env.NEXT_PUBLIC_API_URL}${url}`
  }

  return (
    <div
      className="flex min-h-screen flex-col items-center w-full"
      style={accentColorStyle || {}}
    >
      <div className="container max-w-lg w-full px-4 py-8 md:py-12">
        <Link href="/" className="inline-flex items-center text-sm mb-8 hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Homepage
        </Link>
        
        <Card className="w-full p-6 md:p-8 shadow-lg bg-background/80 backdrop-blur-sm">
          <div className="flex flex-col items-center text-center">
            <Avatar className="h-24 w-24 md:h-32 md:w-32 mb-4 border-2" style={{borderColor: profile.accentColor}}>
              <AvatarImage 
                src={getFullAvatarUrl(profile.avatarUrl)} 
                alt={displayName} 
              />
              <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
            </Avatar>
            <h1 className="text-2xl md:text-3xl font-bold">{displayName}</h1>
            {profile.bio && <p className="mt-3 text-muted-foreground max-w-md">{profile.bio}</p>}
          </div>

          <div className="space-y-4 mt-8">
            {links.map((link) => (
              <LinkCard 
                key={link.id} 
                title={link.title} 
                url={link.url} 
                accentColor={profile.accentColor}
              />
            ))}

            {links.length === 0 && (
              <div className="rounded-lg border border-dashed p-8 text-center">
                <h3 className="text-lg font-semibold">No links yet</h3>
                <p className="text-sm text-muted-foreground">This user hasn&apos;t added any links yet.</p>
              </div>
            )}
          </div>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>
              Powered by <Link href="/" className="font-medium hover:underline">LinkHub</Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
} 