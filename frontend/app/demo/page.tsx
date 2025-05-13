// Add a demo page to showcase the app without requiring login
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function DemoPage() {
  const profile = {
    displayName: "Demo User",
    username: "demo",
    bio: "This is a demo profile for the LinkHub application. Create your own profile to customize it!",
    avatarUrl: "",
    accentColor: "#189278",
  }

  // Demo links
  const links = [
    {
      id: "demo-1",
      title: "Personal Website",
      url: "https://example.com",
    },
    {
      id: "demo-2",
      title: "GitHub Profile",
      url: "https://github.com",
    },
    {
      id: "demo-3",
      title: "LinkedIn",
      url: "https://linkedin.com",
    },
    {
      id: "demo-4",
      title: "Twitter",
      url: "https://twitter.com",
    },
  ]

  return (
    <div
      className="flex min-h-screen flex-col items-center py-12"
      style={{
        backgroundColor: `${profile.accentColor}10`,
        backgroundImage: "radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)",
      }}
    >
      <div className="container max-w-md space-y-6 px-4">
        <div className="flex flex-col items-center text-center">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src={profile.avatarUrl || "/placeholder.svg"} alt={profile.displayName} />
            <AvatarFallback>{profile.displayName.charAt(0)}</AvatarFallback>
          </Avatar>
          <h1 className="text-2xl font-bold">{profile.displayName}</h1>
          <p className="mt-2 text-muted-foreground">{profile.bio}</p>
        </div>

        <div className="space-y-4">
          {links.map((link) => (
            <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="block w-full">
              <Button
                variant="outline"
                className="w-full justify-start h-auto py-3 px-4 text-left"
                style={{
                  borderColor: profile.accentColor,
                  color: profile.accentColor,
                }}
              >
                <div className="flex items-center">{link.title}</div>
              </Button>
            </a>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center space-y-4">
          <p className="text-center text-sm text-muted-foreground">
            This is a demo page. Create your own profile to customize it!
          </p>
          <Link href="/signup">
            <Button>Create Your Own LinkHub</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
