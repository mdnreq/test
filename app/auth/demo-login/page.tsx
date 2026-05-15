"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, Vote, UserCheck, Shield, Loader2, RefreshCw } from "lucide-react"
import * as CRMStore from "@/lib/store/crm-store"

export default function DemoLoginPage() {
  const router = useRouter()
  const [users, setUsers] = useState<CRMStore.DemoUser[]>([])
  const [loading, setLoading] = useState<string | null>(null)

  const startDemoSession = (user: CRMStore.DemoUser) => {
    const demoProfile = {
      id: user.id,
      email: user.email,
      full_name: user.name,
      user_type: user.type,
      is_verified: user.status === "active",
      province: "Ontario",
      municipality: user.type === "candidate" ? "Toronto" : "Ottawa",
      birth_year: user.type === "voter" ? 2004 : 1992,
      created_at: user.created_at,
    }

    localStorage.setItem("tnm-demo-mode", "true")
    localStorage.setItem("tnm-demo-user", JSON.stringify(demoProfile))
    document.cookie = "tnm-demo-mode=true; path=/; max-age=604800; samesite=lax"
  }

  useEffect(() => {
    CRMStore.initializeStore()
    setUsers(CRMStore.getUsers())
  }, [])

  const handleLogin = (user: CRMStore.DemoUser) => {
    setLoading(user.id)
    const authenticatedUser = CRMStore.authenticateUser(user.email, user.password)

    if (!authenticatedUser) {
      setLoading(null)
      return
    }

    startDemoSession(authenticatedUser)
    
    // Redirect based on user type
    setTimeout(() => {
      if (user.type === "admin") {
        router.push("/admin")
      } else if (user.type === "candidate") {
        router.push("/candidate-portal")
      } else {
        router.push("/dashboard/voter")
      }
    }, 500)
  }

  const handleReset = () => {
    CRMStore.resetStore()
    localStorage.removeItem("tnm-demo-mode")
    localStorage.removeItem("tnm-demo-user")
    document.cookie = "tnm-demo-mode=; path=/; max-age=0; samesite=lax"
    setUsers(CRMStore.getUsers())
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "admin": return <Shield className="w-4 h-4" />
      case "candidate": return <Vote className="w-4 h-4" />
      default: return <UserCheck className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "admin": return "bg-amber-500/20 text-amber-400 border-amber-500/30"
      case "candidate": return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      default: return "bg-green-500/20 text-green-400 border-green-500/30"
    }
  }

  const getAvatarBg = (type: string) => {
    switch (type) {
      case "admin": return "bg-gradient-to-br from-amber-500 to-orange-600"
      case "candidate": return "bg-gradient-to-br from-blue-500 to-cyan-600"
      default: return "bg-gradient-to-br from-green-500 to-emerald-600"
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center p-4">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-4xl">
        <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-8 transition">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-white">Demo Login</CardTitle>
            <CardDescription className="text-white/60">
              Select a demo account to explore the platform. All data is stored locally.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {users.map((user) => (
                <Card 
                  key={user.id} 
                  className="bg-white/5 border-white/10 hover:bg-white/10 transition-all cursor-pointer group"
                  onClick={() => handleLogin(user)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className={`text-white text-sm ${getAvatarBg(user.type)}`}>
                          {user.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white truncate">{user.name}</p>
                        <p className="text-xs text-white/50 truncate">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge className={getTypeColor(user.type)}>
                        {getTypeIcon(user.type)}
                        <span className="ml-1 capitalize">{user.type}</span>
                      </Badge>
                      <Button 
                        size="sm" 
                        className="bg-white text-black hover:bg-white/90 opacity-0 group-hover:opacity-100 transition-opacity"
                        disabled={loading === user.id}
                      >
                        {loading === user.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          "Login"
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
              <p className="text-sm text-white/40">
                Demo data is stored in your browser. Changes persist across sessions.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="border-white/20 text-white/60 hover:text-white hover:bg-white/10 bg-transparent"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset Demo Data
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-white/40 text-sm">
            Have a real account?{" "}
            <Link href="/auth/login" className="text-blue-400 hover:text-blue-300 transition">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
