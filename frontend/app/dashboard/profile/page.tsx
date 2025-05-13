"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { AvatarUpload } from "@/components/AvatarUpload"
import { useRouter } from "next/navigation"
import { useProfile } from "@/hooks/use-profile"
import { Profile as ApiProfile } from "@/types/api"

interface Profile extends ApiProfile {}

export default function ProfilePage() {
  const { currentUser, isLoggedIn } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const { getCurrentProfile, updateProfile } = useProfile()
  
  
  const [displayName, setDisplayName] = useState("")
  const [bio, setBio] = useState("")
  const [accentColor, setAccentColor] = useState("#189278")
  
  const profile = getCurrentProfile.data
  const isLoading = getCurrentProfile.isLoading
  
  useEffect(() => {
    if (!profile) return
    
    setDisplayName(profile.displayName || "")
    setBio(profile.bio || "")
    setAccentColor(profile.accentColor || "#189278")
  }, [profile])
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isLoggedIn) return
    
    updateProfile.mutate(
      {
        displayName,
        bio,
        accentColor,
      },
      {
        onSuccess: () => {
          toast({
            title: "Profile updated",
            description: "Your profile has been updated successfully",
          })
          
          router.refresh()
        },
        onError: (error) => {
          console.error("Error updating profile:", error)
          toast({
            title: "Error",
            description: "Failed to update profile",
            variant: "destructive",
          })
        }
      }
    )
  }
  
  if (!isLoggedIn) {
    return (
      <div className="container mx-auto py-10">
        <p>Please sign in to view your profile</p>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
            <CardDescription>Upload a new profile picture</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <AvatarUpload 
              currentAvatarUrl={profile?.avatarUrl} 
              displayName={profile?.displayName}
              onSuccess={(avatarUrl) => {
                
              }}
            />
          </CardContent>
        </Card>
        
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Edit your public profile details</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p>Loading profile...</p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Your display name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself"
                    rows={4}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="accentColor">Accent Color</Label>
                  <div className="flex items-center gap-3">
                    <Input
                      type="color"
                      id="accentColor"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="w-16 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      placeholder="#000000"
                      className="flex-1"
                      pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                      title="Please enter a valid hex color code (e.g. #FF0000)"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Select a color for your profile theme
                  </p>
                </div>
                
                <Button type="submit" disabled={updateProfile.isPending}>
                  {updateProfile.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 