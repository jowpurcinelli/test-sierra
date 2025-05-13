"use client"

import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Loader2, Upload, X } from "lucide-react"

interface AvatarUploadProps {
  currentAvatarUrl?: string
  displayName?: string
  onSuccess?: (avatarUrl: string) => void
}

export function AvatarUpload({ currentAvatarUrl, displayName, onSuccess }: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()
  const { isLoggedIn } = useAuth()

  if (!isLoggedIn) {
    return null
  }

  
  const getInitials = () => {
    if (!displayName) return "U"
    return displayName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a valid image file (JPEG, PNG, GIF, WEBP)",
        variant: "destructive",
      })
      return
    }

    
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image size should be less than 5MB",
        variant: "destructive",
      })
      return
    }

    
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    
    handleUpload(file)
  }

  const handleUpload = async (file: File) => {
    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profiles/me/avatar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to upload avatar')
      }

      const data = await response.json()
      
      
      if (onSuccess && data.avatarUrl) {
        onSuccess(data.avatarUrl)
      }

      toast({
        title: "Avatar updated",
        description: "Your profile picture has been updated successfully",
      })

      
      router.refresh()
    } catch (error) {
      console.error('Avatar upload error:', error)
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload avatar",
        variant: "destructive",
      })
      
      setPreview(null)
    } finally {
      setIsUploading(false)
    }
  }

  const clearPreview = () => {
    setPreview(null)
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <Avatar className="h-24 w-24">
          <AvatarImage 
            src={preview || (currentAvatarUrl ? `${process.env.NEXT_PUBLIC_API_URL}${currentAvatarUrl}` : undefined)} 
            alt={displayName || "Profile"} 
          />
          <AvatarFallback>{getInitials()}</AvatarFallback>
        </Avatar>
        
        {preview && (
          <Button 
            variant="destructive" 
            size="icon" 
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full" 
            onClick={clearPreview}
            disabled={isUploading}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      <div className="flex gap-2 items-center">
        <input
          id="avatar-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={isUploading}
        />
        <label htmlFor="avatar-upload">
          <Button 
            variant="outline" 
            size="sm" 
            className="cursor-pointer" 
            asChild
            disabled={isUploading}
          >
            <span>
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Avatar
                </>
              )}
            </span>
          </Button>
        </label>
      </div>
    </div>
  )
} 