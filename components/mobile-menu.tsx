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
      {isOpen && <div className="fixed inset-0 bg-black/70 z-40 md:hidden" onClick={closeMenu} />}

      {/* Slide-out Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-slate-900 border-l border-slate-700 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-800">
          <div className="flex items-center gap-2">
            <Vote className="h-6 w-6 text-primary" />
            <span className="font-bold">The Next Majority</span>
          </div>
          <button onClick={closeMenu} className="p-2 hover:bg-accent rounded-lg transition" aria-label="Close menu">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col p-4 gap-2">
          <Link
            href="/simulation"
            onClick={closeMenu}
            className="px-4 py-3 hover:bg-accent rounded-lg transition text-sm"
          >
            Simulation
          </Link>
          <Link
            href="/municipalities"
            onClick={closeMenu}
            className="px-4 py-3 hover:bg-accent rounded-lg transition text-sm"
          >
            Municipalities
          </Link>
          <Link
            href="/services"
            onClick={closeMenu}
            className="px-4 py-3 hover:bg-accent rounded-lg transition text-sm"
          >
            Campaign Services
          </Link>
          <Link
            href="/candidates"
            onClick={closeMenu}
            className="px-4 py-3 hover:bg-accent rounded-lg transition text-sm"
          >
            Candidates
          </Link>
          <Link href="/legal" onClick={closeMenu} className="px-4 py-3 hover:bg-accent rounded-lg transition text-sm">
            Legal Framework
          </Link>

          {user && (
            <>
              <Link
                href="/candidate-portal"
                onClick={closeMenu}
                className="px-4 py-3 hover:bg-accent rounded-lg transition text-sm font-medium text-blue-400"
              >
                My Services Portal
              </Link>
              <Link
                href="/governance"
                onClick={closeMenu}
                className="px-4 py-3 hover:bg-accent rounded-lg transition text-sm"
              >
                Governance
              </Link>
              <Link
                href="/dashboard"
                onClick={closeMenu}
                className="px-4 py-3 hover:bg-accent rounded-lg transition text-sm"
              >
                Dashboard
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={closeMenu}
                  className="px-4 py-3 hover:bg-accent rounded-lg transition text-sm font-medium text-amber-400"
                >
                  Admin Panel
                </Link>
              )}
            </>
          )}

          <div className="mt-2 pt-2 border-t border-slate-700 text-slate-100">
            <Link
              href="/demographics"
              onClick={closeMenu}
              className="px-4 py-3 hover:bg-accent rounded-lg transition text-sm block"
            >
              Demographics
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="mt-4 pt-4 border-t border-slate-700 flex flex-col gap-2">
            {!user ? (
              <>
                <Link href="/auth/login" onClick={closeMenu}>
                  <Button variant="ghost" className="w-full" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/auth/sign-up" onClick={closeMenu}>
                  <Button className="w-full" size="sm">
                    Get Started
                  </Button>
                </Link>
                <Link 
                  href="/auth/demo-login" 
                  onClick={closeMenu}
                  className="text-xs text-center text-blue-400 hover:text-blue-300 transition mt-2"
                >
                  Try Demo
                </Link>
                <Link 
                  href="/admin/login" 
                  onClick={closeMenu}
                  className="text-xs text-center text-white/30 hover:text-amber-400 transition mt-1"
                >
                  Admin Login
                </Link>
              </>
            ) : (
              <form action="/auth/sign-out" method="post">
                <Button variant="ghost" className="w-full" size="sm" type="submit">
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
