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
        className={`fixed top-16 right-2 max-h-[75vh] w-72 max-w-[90vw] rounded-3xl shadow-2xl z-50 transform transition-all duration-300 ease-in-out md:hidden ${
          isOpen ? "scale-100 opacity-100 origin-top-right" : "scale-95 opacity-0 pointer-events-none origin-top-right"
        }`}
        style={{
          backgroundColor: "#0f1419",
          backgroundImage: "linear-gradient(135deg, rgba(15, 20, 25, 0.95) 0%, rgba(20, 35, 50, 0.95) 100%)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(59, 130, 246, 0.3)",
          opacity: isOpen ? 1 : 0,
          overflowY: "auto",
          overflowX: "hidden",
          scrollbarWidth: "none",
        }}
      >
        <style>{`
          [style*="overflow-y: auto"]::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        {/* Header */}
        <div 
          className="flex items-center justify-between p-4 border-b rounded-t-3xl sticky top-0"
          style={{
            backgroundColor: "rgba(15, 20, 25, 0.8)",
            borderColor: "rgba(59, 130, 246, 0.2)",
            backdropFilter: "blur(16px)",
          }}
        >
          <div className="flex items-center gap-2">
            <Vote className="h-5 w-5 text-blue-400" />
            <span className="font-bold text-white text-sm">Navigation</span>
          </div>
          <button onClick={closeMenu} className="p-1 hover:bg-blue-600/30 rounded-lg transition" aria-label="Close menu">
            <X className="h-5 w-5 text-blue-400" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col p-3 gap-2">
          <Link
            href="/auth/demo-login?role=candidate"
            onClick={closeMenu}
            className="px-4 py-3 hover:bg-blue-600/20 rounded-xl transition text-sm text-blue-300 font-semibold border border-blue-500/30 hover:border-blue-400/60"
          >
            👤 Candidate Demo
          </Link>
          <Link
            href="/auth/demo-login?role=voter"
            onClick={closeMenu}
            className="px-4 py-3 hover:bg-blue-600/20 rounded-xl transition text-sm text-blue-300 font-semibold border border-blue-500/30 hover:border-blue-400/60"
          >
            🗳️ Voter Demo
          </Link>

          <div className="my-2 border-t" style={{ borderColor: "rgba(59, 130, 246, 0.2)" }} />

          <div className="px-3 py-2">
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Account</p>
            <div className="flex flex-col gap-1">

              <Link
                href="/account"
                onClick={closeMenu}
                className="px-3 py-2 hover:bg-blue-500/20 rounded-lg transition text-xs text-blue-300"
              >
                👤 Client Account
              </Link>
              <Link
                href="/account"
                onClick={closeMenu}
                className="px-3 py-2 hover:bg-blue-500/20 rounded-lg transition text-xs text-blue-300"
              >
                🗳️ Voter Account
              </Link>
            </div>
          </div>

          {/* Auth Buttons */}
          <div className="mt-3 pt-3 border-t flex flex-col gap-2" style={{ borderColor: "rgba(59, 130, 246, 0.2)" }}>
            {!user ? (
              <>
                <Link href="/auth/login" onClick={closeMenu}>
                  <Button className="w-full text-sm h-9 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/auth/sign-up" onClick={closeMenu}>
                  <Button variant="ghost" className="w-full text-sm h-9 hover:bg-blue-500/20 border border-blue-400/50" size="sm">
                    Sign Up
                  </Button>
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

          {/* Hidden Admin Link */}
          <div className="mt-4 pt-4 border-t" style={{ borderColor: "rgba(59, 130, 246, 0.1)" }}>
            <Link
              href="/admin/login"
              onClick={closeMenu}
              className="px-3 py-2 text-xs text-slate-600 hover:text-slate-400 transition opacity-50 hover:opacity-100"
            >
              [Admin Access]
            </Link>
          </div>
        </nav>
      </div>
    </>
  )
}
