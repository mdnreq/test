"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Vote } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MobileMenuProps {
  user: any
  isAdmin?: boolean
}

export function MobileMenu({ user, isAdmin = false }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)

  return (
    <>
      {/* Hamburger Button - Only visible on mobile */}
      <button
        onClick={toggleMenu}
        className="md:hidden p-2 hover:bg-accent rounded-lg transition"
        aria-label="Toggle menu"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/80 z-40 md:hidden" onClick={closeMenu} />}

      {/* Floating Menu Panel */}
      <div
        className={`fixed top-4 right-3 max-h-[85vh] w-72 max-w-[85vw] rounded-3xl shadow-2xl z-50 transform transition-all duration-300 ease-in-out md:hidden overflow-y-auto ${
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
        }`}
        style={{
          backgroundColor: "#1a2332",
          backgroundImage: "linear-gradient(135deg, #1a2332 0%, #243447 100%)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(148, 163, 184, 0.2)",
          opacity: isOpen ? 1 : 0,
        }}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between p-4 border-b rounded-t-3xl"
          style={{
            backgroundColor: "rgba(30, 41, 59, 0.6)",
            borderColor: "rgba(148, 163, 184, 0.2)",
          }}
        >
          <div className="flex items-center gap-2">
            <Vote className="h-5 w-5 text-blue-400" />
            <span className="font-bold text-white text-sm">Menu</span>
          </div>
          <button onClick={closeMenu} className="p-1 hover:bg-blue-600/30 rounded-lg transition" aria-label="Close menu">
            <X className="h-5 w-5 text-blue-400" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col p-3 gap-2" style={{ backgroundColor: "transparent" }}>
          <Link
            href="/simulation"
            onClick={closeMenu}
            className="px-4 py-3 hover:bg-blue-500/20 rounded-xl transition text-sm text-slate-100 font-medium border border-transparent hover:border-blue-400/50"
          >
            Simulation
          </Link>
          <Link
            href="/municipalities"
            onClick={closeMenu}
            className="px-4 py-3 hover:bg-blue-500/20 rounded-xl transition text-sm text-slate-100 font-medium border border-transparent hover:border-blue-400/50"
          >
            Municipalities
          </Link>
          <Link
            href="/services"
            onClick={closeMenu}
            className="px-4 py-3 hover:bg-blue-500/20 rounded-xl transition text-sm text-slate-100 font-medium border border-transparent hover:border-blue-400/50"
          >
            Services
          </Link>
          <Link
            href="/candidates"
            onClick={closeMenu}
            className="px-4 py-3 hover:bg-blue-500/20 rounded-xl transition text-sm text-slate-100 font-medium border border-transparent hover:border-blue-400/50"
          >
            Candidates
          </Link>
          <Link 
            href="/legal" 
            onClick={closeMenu} 
            className="px-4 py-3 hover:bg-blue-500/20 rounded-xl transition text-sm text-slate-100 font-medium border border-transparent hover:border-blue-400/50"
          >
            Legal
          </Link>

          {user && (
            <>
              <Link
                href="/candidate-portal"
                onClick={closeMenu}
                className="px-3 py-2 hover:bg-slate-700 rounded-lg transition text-xs font-medium text-blue-300"
              >
                My Services Portal
              </Link>
              <Link
                href="/governance"
                onClick={closeMenu}
                className="px-3 py-2 hover:bg-slate-700 rounded-lg transition text-xs text-white"
              >
                Governance
              </Link>
              <Link
                href="/dashboard"
                onClick={closeMenu}
                className="px-3 py-2 hover:bg-slate-700 rounded-lg transition text-xs text-white"
              >
                Dashboard
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={closeMenu}
                  className="px-3 py-2 hover:bg-slate-700 rounded-lg transition text-xs font-medium text-amber-300"
                >
                  Admin Panel
                </Link>
              )}
            </>
          )}

          <div className="mt-2 pt-2 border-t" style={{ borderColor: "rgba(148, 163, 184, 0.2)" }}>
            <Link
              href="/demographics"
              onClick={closeMenu}
              className="px-4 py-3 hover:bg-blue-500/20 rounded-xl transition text-sm block text-slate-100 border border-transparent hover:border-blue-400/50"
            >
              Demographics
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="mt-3 pt-3 border-t flex flex-col gap-2" style={{ borderColor: "rgba(148, 163, 184, 0.2)" }}>
            {!user ? (
              <>
                <Link href="/auth/login" onClick={closeMenu}>
                  <Button variant="ghost" className="w-full text-sm h-9 hover:bg-blue-500/20" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/auth/sign-up" onClick={closeMenu}>
                  <Button className="w-full text-sm h-9 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600" size="sm">
                    Get Started
                  </Button>
                </Link>
                <Link 
                  href="/auth/demo-login" 
                  onClick={closeMenu}
                  className="text-sm text-center text-blue-400 hover:text-blue-300 transition"
                >
                  Try Demo
                </Link>
                <Link 
                  href="/admin/login" 
                  onClick={closeMenu}
                  className="text-sm text-center text-slate-400 hover:text-amber-400 transition"
                >
                  Admin
                </Link>
              </>
            ) : (
              <form action="/auth/sign-out" method="post">
                <Button variant="ghost" className="w-full text-sm h-9 hover:bg-red-500/20" size="sm" type="submit">
                  Sign Out
                </Button>
              </form>
            )}
          </div>
        </nav>
      </div>
    </>
  )
}
