import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col w-full">
      <header className="border-b w-full">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6 max-w-full">
          <div className="flex items-center gap-2 font-bold">
            <span className="text-xl">LinkHub</span>
          </div>
          <nav className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Sign Up</Button>
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 w-full">
        <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10 px-4 md:px-6 max-w-full">
          <div className="flex max-w-[980px] flex-col items-center gap-4 mx-auto">
            <h1 className="text-center text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl lg:text-5xl lg:leading-[1.1]">
              Share all your links in one simple page
            </h1>
            <p className="max-w-[700px] text-center text-lg text-muted-foreground md:text-xl">
              Create your personalized link hub in minutes. No coding required.
            </p>
          </div>
          <div className="flex justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="gap-2">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button variant="outline" size="lg">
                View Demo
              </Button>
            </Link>
          </div>
        </section>
        <section className="container py-12 px-4 md:px-6 max-w-full">
          <div className="grid gap-6 md:grid-cols-3 max-w-[1200px] mx-auto">
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h3 className="text-xl font-bold">Easy to Use</h3>
              <p className="text-muted-foreground">
                No technical knowledge required. Just sign up, add your links, and share your profile.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h3 className="text-xl font-bold">Customizable</h3>
              <p className="text-muted-foreground">
                Personalize your profile with your name, bio, profile picture, and theme color.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h3 className="text-xl font-bold">Privacy Controls</h3>
              <p className="text-muted-foreground">
                Control what information is visible to the public. Hide or show links as needed.
              </p>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 w-full">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row px-4 md:px-6 max-w-full">
          <p className="text-center text-sm text-muted-foreground">© 2024 LinkHub. All rights reserved.</p>
          <nav className="flex gap-4 text-sm text-muted-foreground">
            <Link href="/terms" className="hover:underline">
              Terms
            </Link>
            <Link href="/privacy" className="hover:underline">
              Privacy
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
