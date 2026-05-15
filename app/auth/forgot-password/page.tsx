"use client"

import React from "react"

import { useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Mail, CheckCircle2, Loader2 } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) {
        setError(error.message)
      } else {
        setIsSuccess(true)
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md border-white/10 bg-card">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <CardTitle className="text-2xl text-white">Check Your Email</CardTitle>
            <CardDescription className="text-white/60">
              We&apos;ve sent a password reset link to <span className="text-white font-medium">{email}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <p className="text-sm text-blue-400">
                The link will expire in 24 hours. If you don&apos;t see the email, check your spam folder.
              </p>
            </div>
            
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full border-white/20 text-white hover:bg-white/10 bg-transparent"
                onClick={() => {
                  setIsSuccess(false)
                  setEmail("")
                }}
              >
                Try a different email
              </Button>
              
              <Link href="/auth/login" className="block">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Login
                </Button>
              </Link>
            </div>
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
            <Mail className="w-6 h-6 text-blue-400" />
          </div>
          <CardTitle className="text-2xl text-white">Forgot Password?</CardTitle>
          <CardDescription className="text-white/60">
            Enter your email address and we&apos;ll send you a link to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="bg-white/5 border-white/10"
              />
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
                  Sending...
                </>
              ) : (
                "Send Reset Link"
              )}
            </Button>

            <div className="text-center">
              <Link 
                href="/auth/login" 
                className="text-sm text-white/60 hover:text-white inline-flex items-center gap-1"
              >
                <ArrowLeft className="w-3 h-3" />
                Back to Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
