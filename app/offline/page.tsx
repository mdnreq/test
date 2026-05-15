"use client"

import { WifiOff, RefreshCw, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <Card className="max-w-md w-full bg-white/5 border-white/10">
        <CardContent className="p-8 text-center">
          <div className="w-20 h-20 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto mb-6">
            <WifiOff className="w-10 h-10 text-orange-400" />
          </div>
          
          <h1 className="text-2xl font-bold text-white mb-2">You're Offline</h1>
          <p className="text-white/60 mb-6">
            It looks like you've lost your internet connection. Some features may be unavailable until you're back online.
          </p>

          <div className="space-y-3">
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-500"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            
            <Link href="/">
              <Button variant="outline" className="w-full border-white/20 text-white bg-transparent">
                <Home className="w-4 h-4 mr-2" />
                Go to Home
              </Button>
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10">
            <h3 className="text-white font-medium mb-3">Available Offline:</h3>
            <ul className="text-sm text-white/60 space-y-1">
              <li>• Previously viewed proposals</li>
              <li>• Cached town hall discussions</li>
              <li>• Your profile and badges</li>
              <li>• Calendar events (cached)</li>
            </ul>
          </div>

          <p className="text-xs text-white/40 mt-6">
            Your pending votes and comments will sync automatically when you're back online.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
