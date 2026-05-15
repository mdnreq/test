import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/header"
import { SiteFooter } from "@/components/site-footer"
import { AIAssistant } from "@/components/ai-assistant"
import { AccessibilityPanel } from "@/components/accessibility-panel"
import { PWAInstallPrompt } from "@/components/pwa-install-prompt"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })
const siteUrl = "https://thenextmajority.technocracyai.net"

export const viewport: Viewport = {
  themeColor: "#3b82f6",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "The Next Majority - Municipal DAO Platform",
  description:
    "Empowering the next generation of voters across Ontario and PEI municipalities. Verified candidates, DAO governance, and democratic participation.",
  alternates: {
    canonical: "/",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Municipal DAO",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {/* Skip Links for Keyboard Navigation - WCAG 2.1 AA */}
          <a
            href="#main-content"
            className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-background"
          >
            Skip to main content
          </a>
          <a
            href="#main-navigation"
            className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-48 focus:z-[100] focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-background"
          >
            Skip to navigation
          </a>
          <Header />
          <main id="main-content" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <SiteFooter />
          <AIAssistant />
          <AccessibilityPanel />
          <PWAInstallPrompt />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
