"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Vote } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MobileMenuProps {
  user: any
}

export function MobileMenu({ user }: MobileMenuProps) {
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
        className={`fixed top-16 right-2 max-h-[75vh] w-72 max-w-[90vw] rounded-2xl shadow-xl z-50 transform transition-all duration-300 ease-in-out md:hidden ${
          isOpen ? "scale-100 opacity-100 origin-top-right" : "scale-95 opacity-0 pointer-events-none origin-top-right"
        }`}
        style={{
          backgroundColor: "#1a1f2e",
          border: "1px solid rgba(71, 85, 105, 0.4)",
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
          className="flex items-center justify-between p-4 border-b rounded-t-2xl sticky top-0"
          style={{
            backgroundColor: "#1a1f2e",
            borderColor: "rgba(71, 85, 105, 0.3)",
          }}
        >
          <div className="flex items-center gap-2">
            <Vote className="h-5 w-5 text-blue-400" />
            <span className="font-semibold text-white text-sm">Navigation</span>
          </div>
          <button onClick={closeMenu} className="p-1 hover:bg-slate-700/30 rounded-lg transition" aria-label="Close menu">
            <X className="h-5 w-5 text-slate-400 hover:text-slate-300" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col p-4 gap-3">
          <Link
            href="/auth/demo-login?role=candidate"
            onClick={closeMenu}
            className="px-4 py-3 hover:bg-blue-500/10 rounded-xl transition text-sm text-blue-200 font-semibold border border-blue-500/20 hover:border-blue-400/40"
          >
            👤 Candidate Demo
          </Link>
          <Link
            href="/auth/demo-login?role=voter"
            onClick={closeMenu}
            className="px-4 py-3 hover:bg-blue-500/10 rounded-xl transition text-sm text-blue-200 font-semibold border border-blue-500/20 hover:border-blue-400/40"
          >
            🗳️ Voter Demo
          </Link>

          <div className="my-1 border-t" style={{ borderColor: "rgba(71, 85, 105, 0.3)" }} />

          <div className="px-2 py-3">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-2">Account</p>
            <div className="flex flex-col gap-2">

              <Link
                href="/account"
                onClick={closeMenu}
                className="px-3 py-2 hover:bg-slate-700/40 rounded-lg transition text-sm text-slate-300 border border-slate-700/30 hover:border-slate-600/50"
              >
                👤 Client Account
              </Link>
              <Link
                href="/account"
                onClick={closeMenu}
                className="px-3 py-2 hover:bg-slate-700/40 rounded-lg transition text-sm text-slate-300 border border-slate-700/30 hover:border-slate-600/50"
              >
                🗳️ Voter Account
              </Link>
            </div>
          </div>

          {/* Auth Buttons */}
          <div className="mt-2 pt-3 border-t flex flex-col gap-2" style={{ borderColor: "rgba(71, 85, 105, 0.3)" }}>
            {!user ? (
              <>
                <Link href="/auth/login" onClick={closeMenu}>
                  <Button className="w-full text-sm h-9 bg-blue-600 hover:bg-blue-700 text-white" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/auth/sign-up" onClick={closeMenu}>
                  <Button variant="ghost" className="w-full text-sm h-9 hover:bg-slate-700/30 border border-slate-600/40 text-slate-300" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </>
            ) : (
              <form action="/auth/sign-out" method="post">
                <Button variant="ghost" className="w-full text-sm h-9 hover:bg-red-500/20 text-slate-300" size="sm" type="submit">
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
