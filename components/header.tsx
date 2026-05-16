import Link from "next/link"
import { Vote } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { MobileMenu } from "@/components/mobile-menu"

export async function Header() {
  let user = null
  try {
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()
    user = data?.user
  } catch (error) {
    console.warn("[v0] Failed to get user in header:", error)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
          <Vote className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold">The Next Majority</span>
        </Link>

        {/* Desktop Navigation */}
        <nav id="main-navigation" aria-label="Main navigation" className="hidden md:flex items-center gap-6">
          <Link href="/simulation" className="text-sm hover:text-primary transition">
            Simulation
          </Link>
          <Link href="/municipalities" className="text-sm hover:text-primary transition">
            Municipalities
          </Link>
          <Link href="/services" className="text-sm hover:text-primary transition">
            Campaign Services
          </Link>
          <Link href="/candidates" className="text-sm hover:text-primary transition">
            Candidates
          </Link>
          <Link href="/legal" className="text-sm hover:text-primary transition">
            Legal
          </Link>
          {user && (
            <>
              <Link href="/candidate-portal" className="text-sm font-medium text-blue-400 hover:text-blue-300 transition">
                My Portal
              </Link>
              <Link href="/governance" className="text-sm hover:text-primary transition">
                Governance
              </Link>
              <Link href="/dashboard" className="text-sm hover:text-primary transition">
                Dashboard
              </Link>
            </>
          )}
          {!user ? (
            <>
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/auth/sign-up">
                <Button size="sm">Get Started</Button>
              </Link>
              <Link href="/auth/demo-login" className="text-xs text-blue-400 hover:text-blue-300 transition ml-2">
                Demo
              </Link>
            </>
          ) : (
            <form action="/auth/sign-out" method="post">
              <Button variant="ghost" size="sm" type="submit">
                Sign Out
              </Button>
            </form>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <MobileMenu user={user} />
        </div>
      </div>
    </header>
  )
}
