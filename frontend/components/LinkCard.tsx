import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"

interface LinkCardProps {
  title: string
  url: string
  accentColor?: string
}

export function LinkCard({ title, url, accentColor }: LinkCardProps) {
  const buttonStyle = accentColor ? {
    borderColor: accentColor,
    color: accentColor,
    transition: "all 0.2s ease-in-out",
  } : undefined
  
  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="block w-full transition-transform hover:scale-[1.01]"
    >
      <Button
        variant="outline"
        className="w-full justify-between h-auto py-4 px-5 text-left group"
        style={buttonStyle}
      >
        <span>{title}</span>
        <ExternalLink className="h-4 w-4 opacity-50 group-hover:opacity-100" />
      </Button>
    </a>
  )
} 