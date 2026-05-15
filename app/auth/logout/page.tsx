"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LogOut, Loader2, CheckCircle2, Home, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function LogoutPage() {
  const router = useRouter()
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [countdown, setCountdown] = useState(5)

  const handleLogout = async () => {
    setStatus("loading")
    
    try {
      const supabase = createClient()
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error("Logout error:", error)
        setStatus("error")
        return
      }
      
      // Clear any local storage data
      localStorage.removeItem("tnm-demo-subscriptions")
      localStorage.removeItem("tnm-accessibility-settings")
      
      setStatus("success")
      
      // Start countdown for redirect
      let count = 5
      const interval = setInterval(() => {
        count--
        setCountdown(count)
        if (count === 0) {
          clearInterval(interval)
          router.push("/")
        }
      }, 1000)
      
    } catch (err) {
      console.error("Logout error:", err)
      setStatus("error")
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-purple-900/20 pointer-events-none" />
      
      <Card className="w-full max-w-md bg-[#0d1117] border-white/10 relative z-10">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
            {status === "loading" ? (
              <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
            ) : status === "success" ? (
              <CheckCircle2 className="w-8 h-8 text-green-400" />
            ) : (
              <LogOut className="w-8 h-8 text-blue-400" />
            )}
          </div>
          <div>
            <CardTitle className="text-2xl text-white">
              {status === "success" ? "Logged Out Successfully" : "Sign Out"}
            </CardTitle>
            <CardDescription className="text-white/60 mt-2">
              {status === "idle" && "Are you sure you want to sign out of your account?"}
              {status === "loading" && "Signing you out securely..."}
              {status === "success" && `Redirecting to home in ${countdown} seconds...`}
              {status === "error" && "There was an error signing out. Please try again."}
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {status === "idle" && (
            <>
              <Button 
                onClick={handleLogout}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Yes, Sign Out
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full border-white/20 text-white hover:bg-white/10 bg-transparent"
                onClick={() => router.back()}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
            </>
          )}
          
          {status === "loading" && (
            <div className="py-4 text-center">
              <p className="text-white/50 text-sm">Clearing session data...</p>
            </div>
          )}
          
          {status === "success" && (
            <div className="space-y-3">
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-center">
                <p className="text-green-400 text-sm">
                  You have been successfully signed out.
                </p>
              </div>
              
              <Button 
                asChild
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500"
              >
                <Link href="/">
                  <Home className="w-4 h-4 mr-2" />
                  Return to Home Now
                </Link>
              </Button>
            </div>
          )}
          
          {status === "error" && (
            <div className="space-y-3">
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-center">
                <p className="text-red-400 text-sm">
                  Failed to sign out. Please try again or close your browser.
                </p>
              </div>
              
              <Button 
                onClick={handleLogout}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600"
              >
                Try Again
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full border-white/20 text-white hover:bg-white/10 bg-transparent"
                asChild
              >
                <Link href="/">
                  <Home className="w-4 h-4 mr-2" />
                  Return to Home
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
