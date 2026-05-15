"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, ArrowRight } from "lucide-react"

export default function DemoPage() {
  const [setupComplete, setSetupComplete] = useState(false)

  useEffect(() => {
    // Set demo mode in localStorage
    localStorage.setItem("tnm-demo-mode", "true")
    localStorage.setItem("tnm-demo-user", JSON.stringify({
      id: "demo-user-001",
      email: "demo@thenextmajority.ca",
      full_name: "Alex Demo Candidate",
      user_type: "candidate",
      is_verified: true,
      province: "Ontario",
      municipality: "Toronto",
      birth_year: 1992,
      created_at: new Date().toISOString()
    }))
    
    // Mark setup complete after a moment
    setTimeout(() => setSetupComplete(true), 1000)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#05070a] via-[#0a0f1a] to-[#05070a] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/5 border-white/10">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Demo Session Setup</CardTitle>
          <CardDescription>Initializing demo experience...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
              <span className="text-sm text-white/70">Demo user created</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className={`h-5 w-5 flex-shrink-0 ${setupComplete ? "text-green-500" : "text-white/30"}`} />
              <span className="text-sm text-white/70">Session initialized</span>
            </div>
          </div>

          {setupComplete && (
            <div className="pt-4 space-y-3">
              <p className="text-sm text-white/60 text-center">
                Your demo account is ready to explore the candidate portal.
              </p>
              <Link href="/candidate-portal" className="block">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Enter Candidate Portal <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/" className="block">
                <Button variant="outline" className="w-full">
                  Back to Home
                </Button>
              </Link>
            </div>
          )}

          {!setupComplete && (
            <div className="flex justify-center pt-4">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
