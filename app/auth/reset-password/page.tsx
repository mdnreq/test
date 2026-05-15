"use client"

import React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { KeyRound, CheckCircle2, Loader2, Eye, EyeOff, AlertCircle } from "lucide-react"

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isValidSession, setIsValidSession] = useState<boolean | null>(null)

  useEffect(() => {
    // Check if user has a valid session from the reset link
    const checkSession = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      setIsValidSession(!!session)
    }
    checkSession()
  }, [])

  const validatePassword = (pwd: string): string | null => {
    if (pwd.length < 8) {
      return "Password must be at least 8 characters long"
    }
    if (!/[A-Z]/.test(pwd)) {
      return "Password must contain at least one uppercase letter"
    }
    if (!/[a-z]/.test(pwd)) {
      return "Password must contain at least one lowercase letter"
    }
    if (!/[0-9]/.test(pwd)) {
      return "Password must contain at least one number"
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    // Validate password strength
    const passwordError = validatePassword(password)
    if (passwordError) {
      setError(passwordError)
      return
    }

    setIsLoading(true)

    try {
      const supabase = createClient()
      
      const { error } = await supabase.auth.updateUser({
        password: password
      })

      if (error) {
        setError(error.message)
      } else {
        setIsSuccess(true)
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push("/auth/login")
        }, 3000)
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Loading state while checking session
  if (isValidSession === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md border-white/10 bg-card">
          <CardContent className="py-12 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
            <p className="text-white/60">Verifying reset link...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Invalid or expired session
  if (!isValidSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md border-white/10 bg-card">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <CardTitle className="text-2xl text-white">Invalid or Expired Link</CardTitle>
            <CardDescription className="text-white/60">
              This password reset link is invalid or has expired. Please request a new one.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/auth/forgot-password" className="block">
              <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500">
                Request New Reset Link
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Success state
  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md border-white/10 bg-card">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <CardTitle className="text-2xl text-white">Password Reset Successful</CardTitle>
            <CardDescription className="text-white/60">
              Your password has been updated. Redirecting to login...
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/auth/login" className="block">
              <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500">
                Continue to Login
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md border-white/10 bg-card">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-2">
            <KeyRound className="w-6 h-6 text-blue-400" />
          </div>
          <CardTitle className="text-2xl text-white">Reset Your Password</CardTitle>
          <CardDescription className="text-white/60">
            Enter your new password below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="bg-white/5 border-white/10 pr-10"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  className="bg-white/5 border-white/10 pr-10"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Password requirements */}
            <div className="bg-white/5 rounded-lg p-3 space-y-1.5">
              <p className="text-xs text-white/50 font-medium">Password must contain:</p>
              <ul className="text-xs text-white/40 space-y-1">
                <li className={password.length >= 8 ? "text-green-400" : ""}>
                  {password.length >= 8 ? "✓" : "○"} At least 8 characters
                </li>
                <li className={/[A-Z]/.test(password) ? "text-green-400" : ""}>
                  {/[A-Z]/.test(password) ? "✓" : "○"} One uppercase letter
                </li>
                <li className={/[a-z]/.test(password) ? "text-green-400" : ""}>
                  {/[a-z]/.test(password) ? "✓" : "○"} One lowercase letter
                </li>
                <li className={/[0-9]/.test(password) ? "text-green-400" : ""}>
                  {/[0-9]/.test(password) ? "✓" : "○"} One number
                </li>
              </ul>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Resetting Password...
                </>
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
