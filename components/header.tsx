import Link from "next/link"
import { Vote } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { MobileMenu } from "@/components/mobile-menu"

export async function Header() {
  let user = null
  let isAdmin = false
  const isDev = process.env.NODE_ENV === "development"
  
  try {
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()
    user = data?.user
    
    // Check if user is admin (only detect in development)
    if (isDev && user) {
      const { data: profile } = await supabase
        .from("user_profiles")
        .select("primary_role, secondary_roles")
        .eq("id", user.id)
        .single()
      
      if (profile) {
        isAdmin = profile.primary_role === "admin" || 
          (profile.secondary_roles && profile.secondary_roles.includes("admin"))
      }
    }
  } catch (error) {
    console.warn("[v0] Failed to get user in header:", error)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-gradient-to-b from-[#0f172a] to-[#0a0f1a] backdrop-blur">
      {/* Top Section: Logo + Tagline + CTA Buttons */}
      <div className="border-b border-white/5">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo + Tagline */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0" style={{ boxShadow: "0 0 16px rgba(59, 130, 246, 0.5)" }}>
              <Vote className="h-5 w-5 text-white flex-shrink-0" />
            </div>
            <div>
              <div className="text-sm font-black tracking-wider uppercase">The Next Majority</div>
              <div className="text-xs text-white/60">Independent civic initiative • Municipal turnout strategy</div>
            </div>
          </Link>

          {/* Main CTA Buttons - Desktop Only */}
          <div className="hidden md:flex items-center gap-3">
            {!user ? (
              <>
                <Link
                  href="/demo"
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition text-sm tracking-wider"
                  style={{
                    boxShadow: "0 0 20px rgba(168, 85, 247, 0.6), inset 0 1px 2px rgba(255, 255, 255, 0.2)"
                  }}
                >
                  Demo Portal
                </Link>
                <Link
                  href="/auth/sign-up"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition text-sm tracking-wider"
                  style={{
                    boxShadow: "0 0 20px rgba(59, 130, 246, 0.6), inset 0 1px 2px rgba(255, 255, 255, 0.2)"
                  }}
                >
                  Join the Movement
                </Link>
              </>
            ) : (
              <form action="/auth/sign-out" method="post">
                <Button variant="ghost" size="sm" type="submit" className="text-white hover:text-white/80">
                  Sign Out
                </Button>
              </form>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <MobileMenu user={user} isAdmin={isAdmin} isDev={isDev} />
          </div>
        </div>
      </div>

      {/* Navigation Row */}
      <nav id="main-navigation" aria-label="Main navigation" className="hidden md:block bg-white/2">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-8 text-sm font-medium">
            <Link href="/simulation" className="text-white/80 hover:text-white transition">
              Simulation
            </Link>
            <Link href="/municipalities" className="text-white/80 hover:text-white transition">
              Municipalities
            </Link>
            <Link href="/services" className="text-white/80 hover:text-white transition">
              Campaign Services
            </Link>
            <Link href="/candidates" className="text-white/80 hover:text-white transition">
              Candidates
            </Link>
            <Link href="/legal" className="text-white/80 hover:text-white transition">
              Legal
            </Link>
          </div>

          {/* User Portal Links */}
          {user && (
            <div className="flex items-center gap-6 text-sm">
              <Link href="/candidate-portal" className="text-blue-400 hover:text-blue-300 transition font-medium">
                My Portal
              </Link>
              <Link href="/governance" className="text-white/80 hover:text-white transition">
                Governance
              </Link>
              <Link href="/dashboard" className="text-white/80 hover:text-white transition">
                Dashboard
              </Link>
              {isAdmin && (
                <Link href="/admin" className="text-amber-400 hover:text-amber-300 transition font-medium">
                  Admin
                </Link>
              )}
            </div>
          )}

          {/* Dev-Only Links */}
          {!user && isDev && (
            <Link href="/admin/login" className="text-xs text-white/30 hover:text-amber-400 transition">
              Admin
            </Link>
          )}
        </div>
      </nav>
    </header>
  )
}
