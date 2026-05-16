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
        className={`fixed top-1/2 left-1/2 max-h-[90vh] w-80 max-w-[90vw] rounded-2xl shadow-2xl z-50 transform transition-all duration-300 ease-in-out md:hidden overflow-y-auto ${
          isOpen ? "scale-100 opacity-100 -translate-x-1/2 -translate-y-1/2" : "scale-95 opacity-0 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        }`}
        style={{
          backgroundColor: "#0f172a",
          backgroundImage: "none",
          backdropFilter: "none",
          opacity: isOpen ? 1 : 0,
        }}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between p-4 border-b border-slate-700 rounded-t-2xl"
          style={{
            backgroundColor: "#1e293b",
            backgroundImage: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
          }}
        >
          <div className="flex items-center gap-2">
            <Vote className="h-5 w-5 text-primary" />
            <span className="font-bold text-white text-sm">The Next Majority</span>
          </div>
          <button onClick={closeMenu} className="p-1 hover:bg-slate-600 rounded-lg transition" aria-label="Close menu">
            <X className="h-5 w-5 text-white" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col p-3 gap-1" style={{ backgroundColor: "transparent" }}>
          <Link
            href="/simulation"
            onClick={closeMenu}
            className="px-3 py-2 hover:bg-slate-700 rounded-lg transition text-xs text-white font-medium"
          >
            Simulation
          </Link>
          <Link
            href="/municipalities"
            onClick={closeMenu}
            className="px-3 py-2 hover:bg-slate-700 rounded-lg transition text-xs text-white font-medium"
          >
            Municipalities
          </Link>
          <Link
            href="/services"
            onClick={closeMenu}
            className="px-3 py-2 hover:bg-slate-700 rounded-lg transition text-xs text-white font-medium"
          >
            Campaign Services
          </Link>
          <Link
            href="/candidates"
            onClick={closeMenu}
            className="px-3 py-2 hover:bg-slate-700 rounded-lg transition text-xs text-white font-medium"
          >
            Candidates
          </Link>
          <Link 
            href="/legal" 
            onClick={closeMenu} 
            className="px-3 py-2 hover:bg-slate-700 rounded-lg transition text-xs text-white font-medium"
          >
            Legal Framework
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

          <div className="mt-2 pt-2 border-t border-slate-700 text-white">
            <Link
              href="/demographics"
              onClick={closeMenu}
              className="px-3 py-2 hover:bg-slate-700 rounded-lg transition text-xs block text-white"
            >
              Demographics
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="mt-2 pt-2 border-t border-slate-700 flex flex-col gap-1">
            {!user ? (
              <>
                <Link href="/auth/login" onClick={closeMenu}>
                  <Button variant="ghost" className="w-full text-xs h-8" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/auth/sign-up" onClick={closeMenu}>
                  <Button className="w-full text-xs h-8" size="sm">
                    Get Started
                  </Button>
                </Link>
                <Link 
                  href="/auth/demo-login" 
                  onClick={closeMenu}
                  className="text-xs text-center text-blue-400 hover:text-blue-300 transition mt-1"
                >
                  Try Demo
                </Link>
                <Link 
                  href="/admin/login" 
                  onClick={closeMenu}
                  className="text-xs text-center text-white/30 hover:text-amber-400 transition"
                >
                  Admin Login
                </Link>
              </>
            ) : (
              <form action="/auth/sign-out" method="post">
                <Button variant="ghost" className="w-full text-xs h-8" size="sm" type="submit">
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
