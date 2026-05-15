"use client"

import { useState, useEffect } from "react"
import { Download, X, Smartphone, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
      return
    }

    // Check for iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent)
    setIsIOS(isIOSDevice)

    // Listen for beforeinstallprompt
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      
      // Show prompt after a delay if user hasn't dismissed before
      const dismissed = localStorage.getItem('pwa-prompt-dismissed')
      if (!dismissed) {
        setTimeout(() => setShowPrompt(true), 3000)
      }
    }

    window.addEventListener('beforeinstallprompt', handler)

    // Listen for app installed
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true)
      setShowPrompt(false)
      setDeferredPrompt(null)
    })

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      setIsInstalled(true)
    }
    
    setDeferredPrompt(null)
    setShowPrompt(false)
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem('pwa-prompt-dismissed', 'true')
  }

  // Register service worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then((registration) => {
        console.log('[PWA] Service Worker registered:', registration.scope)
      }).catch((error) => {
        console.log('[PWA] Service Worker registration failed:', error)
      })
    }
  }, [])

  if (isInstalled || !showPrompt) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm">
      <Card className="bg-[#0d1117] border-blue-500/30 shadow-lg shadow-blue-500/10">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-white">Install Municipal DAO</h3>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-white/50 hover:text-white -mr-2 -mt-1 h-8 w-8"
                  onClick={handleDismiss}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-sm text-white/60 mt-1 mb-3">
                {isIOS 
                  ? "Tap the share button and 'Add to Home Screen' for the best experience."
                  : "Install our app for quick access, offline support, and push notifications."
                }
              </p>
              
              {!isIOS && deferredPrompt && (
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className="bg-blue-600 hover:bg-blue-500"
                    onClick={handleInstall}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Install
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="text-white/60"
                    onClick={handleDismiss}
                  >
                    Not now
                  </Button>
                </div>
              )}

              {isIOS && (
                <div className="flex items-center gap-2 text-sm text-blue-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Use Safari for best results</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
