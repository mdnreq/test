"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import * as CRMStore from "@/lib/store/crm-store"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Eye, EyeOff, AlertCircle, ArrowLeft } from "lucide-react"

// Demo admin credentials
const DEMO_ADMIN = {
  email: "admin@campaigncore.com",
  password: "admin123"
}

export default function AdminLoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const startAdminDemoSession = (user: CRMStore.DemoUser) => {
    localStorage.setItem("tnm-demo-mode", "true")
    localStorage.setItem("tnm-demo-user", JSON.stringify({
      id: user.id,
      email: user.email,
      full_name: user.name,
      user_type: user.type,
      is_verified: true,
      province: "Ontario",
      municipality: "Toronto",
      birth_year: 1990,
      created_at: user.created_at,
    }))
    document.cookie = "tnm-demo-mode=true; path=/; max-age=604800; samesite=lax"
  }

  const handleDemoLogin = () => {
    setEmail(DEMO_ADMIN.email)
    setPassword(DEMO_ADMIN.password)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Initialize store
    CRMStore.initializeStore()

    // Authenticate using CRM store
    const user = CRMStore.authenticateUser(email, password)
    
    if (!user) {
      setError("Invalid email or password.")
      setLoading(false)
      return
    }

    if (user.type !== "admin") {
      CRMStore.logoutUser()
      setError("Access denied. Admin privileges required.")
      setLoading(false)
      return
    }

    startAdminDemoSession(user)

    // Success - redirect to admin panel
    router.push("/admin")
  }

  return (
    <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Back link */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white mb-8 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center mb-4 border border-amber-500/20">
              <Shield className="w-8 h-8 text-amber-400" />
            </div>
            <CardTitle className="text-2xl text-white">Admin Login</CardTitle>
            <CardDescription className="text-white/60">
              Sign in with your administrator credentials
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Demo Login Button */}
              <button
                type="button"
                onClick={handleDemoLogin}
                className="w-full p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400 text-sm hover:bg-amber-500/20 transition"
              >
                Use Demo Credentials
                <span className="block text-xs text-amber-400/60 mt-1">
                  {DEMO_ADMIN.email}
                </span>
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-[#0d0d0e] px-2 text-white/40">or enter credentials</span>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white/80">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-amber-500/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white/80">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-amber-500/50 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0"
              >
                {loading ? "Signing in..." : "Sign in to Admin Panel"}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-white/10 text-center">
              <p className="text-sm text-white/40">
                Not an administrator?{" "}
                <Link href="/auth/login" className="text-amber-400 hover:text-amber-300 transition">
                  Regular login
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-white/30 mt-6">
          Protected area. Unauthorized access is prohibited.
        </p>
      </div>
    </div>
  )
}
