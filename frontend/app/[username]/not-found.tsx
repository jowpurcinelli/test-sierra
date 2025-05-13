import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"

export default function UserNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/20 p-4">
      <Card className="w-full max-w-md p-8 shadow-lg bg-background/80 backdrop-blur-sm">
        <div className="flex flex-col items-center text-center gap-4">
          <h1 className="text-4xl font-bold">404</h1>
          <h2 className="text-2xl font-semibold">Profile Not Found</h2>
          <p className="text-muted-foreground">
            The user profile you're looking for doesn't exist or is not available.
          </p>
          
          <div className="mt-6">
            <Link href="/">
              <Button className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  )
} 