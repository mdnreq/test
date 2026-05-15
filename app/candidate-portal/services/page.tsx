"use client"

import React, { Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import * as CRMStore from "@/lib/store/crm-store"
import { CAMPAIGN_PACKAGE_PRESETS, type CampaignPackagePreset } from "@/lib/campaign-package-presets"
import { CAMPAIGN_SERVICE_CATALOG, getCampaignStackById, getCampaignStackHighlights } from "@/lib/campaign-system"
import { 
  ArrowLeft,
  Package, 
  Check,
  Star,
  Filter,
  Search,
  Megaphone,
  Mail,
  Globe,
  Palette,
  Video,
  FileSearch,
  PenTool,
  BarChart3,
  Loader2,
  Shield,
  Eye,
  ChevronDown,
  BookOpen,
  Bot,
  Cpu
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { AnimatedServiceBackground } from "@/components/animated-service-background"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import LoadingComponent from "./loading"

interface Service {
  id: string
  name: string
  slug?: string
  description: string
  category: string
  price_monthly: number
  price_display: string
  features: string[]
  popular: boolean
  active?: boolean
  icon?: string
}

const categoryIcons: Record<string, React.ReactNode> = {
  "Digital Marketing": <Megaphone className="w-4 h-4" />,
  "Content Creation": <PenTool className="w-4 h-4" />,
  "Web Development": <Globe className="w-4 h-4" />,
  "Video Production": <Video className="w-4 h-4" />,
  "Email Marketing": <Mail className="w-4 h-4" />,
  "Design": <Palette className="w-4 h-4" />,
  "Research": <FileSearch className="w-4 h-4" />,
  "Analytics": <BarChart3 className="w-4 h-4" />,
  "SEO & Optimization": <Search className="w-4 h-4" />,
  "Reputation": <Eye className="w-4 h-4" />,
  "Risk & Crisis": <Shield className="w-4 h-4" />
}

const categoryColors: Record<string, string> = {
  "Digital Marketing": "from-blue-500/20 to-blue-600/20",
  "Content Creation": "from-purple-500/20 to-purple-600/20",
  "Web Development": "from-cyan-500/20 to-cyan-600/20",
  "Video Production": "from-red-500/20 to-red-600/20",
  "Email Marketing": "from-green-500/20 to-green-600/20",
  "Design": "from-pink-500/20 to-pink-600/20",
  "Research": "from-orange-500/20 to-orange-600/20",
  "Analytics": "from-yellow-500/20 to-yellow-600/20",
  "SEO & Optimization": "from-emerald-500/20 to-emerald-600/20",
  "Reputation": "from-indigo-500/20 to-indigo-600/20",
  "Risk & Crisis": "from-red-500/20 to-red-600/20"
}

// Animation + color theme explicitly mapped per service ID
// Within each category, every card has a different animation and color
type AnimationType = "analytics" | "field" | "web" | "design" | "seo" | "reputation" | "crisis" | "media" | "youth" | "fundraising" | "content" | "video" | "email" | "research" | "digital"

type CardVisual = { anim: AnimationType; header: string; body: string }

// Explicit per-service mapping - no two cards in same category share a look
const serviceVisuals: Record<string, CardVisual> = {
  // Design (8 services - each different)
  "1":  { anim: "design",      header: "bg-gradient-to-r from-rose-950 via-pink-950/80 to-fuchsia-950/60",    body: "from-rose-950/40 to-rose-950/20" },
  "36": { anim: "content",     header: "bg-gradient-to-r from-fuchsia-950 via-purple-950/80 to-violet-950/60", body: "from-fuchsia-950/40 to-fuchsia-950/20" },
  "37": { anim: "media",       header: "bg-gradient-to-r from-purple-950 via-violet-950/80 to-indigo-950/60",  body: "from-purple-950/40 to-purple-950/20" },
  "38": { anim: "digital",     header: "bg-gradient-to-r from-pink-950 via-rose-950/80 to-red-950/60",         body: "from-pink-950/40 to-pink-950/20" },
  "39": { anim: "youth",       header: "bg-gradient-to-r from-violet-950 via-fuchsia-950/80 to-pink-950/60",   body: "from-violet-950/40 to-violet-950/20" },
  "40": { anim: "email",       header: "bg-gradient-to-r from-red-950 via-rose-950/80 to-pink-950/60",         body: "from-red-950/40 to-pink-950/20" },
  "41": { anim: "analytics",   header: "bg-gradient-to-r from-fuchsia-950 via-pink-950/60 to-rose-950/40",     body: "from-fuchsia-950/30 to-rose-950/20" },
  "42": { anim: "video",       header: "bg-gradient-to-r from-rose-950 via-red-950/80 to-orange-950/60",       body: "from-rose-950/30 to-red-950/20" },

  // Content Creation (5 services)
  "2":  { anim: "content",     header: "bg-gradient-to-r from-violet-950 via-purple-950/80 to-fuchsia-950/60", body: "from-violet-950/40 to-violet-950/20" },
  "15": { anim: "media",       header: "bg-gradient-to-r from-purple-950 via-indigo-950/80 to-blue-950/60",    body: "from-purple-950/40 to-purple-950/20" },
  "16": { anim: "fundraising", header: "bg-gradient-to-r from-indigo-950 via-violet-950/80 to-purple-950/60",  body: "from-indigo-950/40 to-indigo-950/20" },
  "31": { anim: "field",       header: "bg-gradient-to-r from-fuchsia-950 via-violet-950/80 to-indigo-950/60", body: "from-fuchsia-950/40 to-fuchsia-950/20" },
  "32": { anim: "youth",       header: "bg-gradient-to-r from-blue-950 via-violet-950/80 to-purple-950/60",    body: "from-blue-950/40 to-blue-950/20" },

  // SEO & Optimization (8 services)
  "3":  { anim: "seo",         header: "bg-gradient-to-r from-emerald-950 via-teal-950/80 to-cyan-950/60",     body: "from-emerald-950/40 to-emerald-950/20" },
  "4":  { anim: "analytics",   header: "bg-gradient-to-r from-teal-950 via-cyan-950/80 to-sky-950/60",         body: "from-teal-950/40 to-teal-950/20" },
  "5":  { anim: "digital",     header: "bg-gradient-to-r from-cyan-950 via-teal-950/80 to-emerald-950/60",     body: "from-cyan-950/40 to-cyan-950/20" },
  "43": { anim: "web",         header: "bg-gradient-to-r from-green-950 via-emerald-950/80 to-teal-950/60",    body: "from-green-950/40 to-green-950/20" },
  "44": { anim: "research",    header: "bg-gradient-to-r from-sky-950 via-cyan-950/80 to-teal-950/60",         body: "from-sky-950/40 to-sky-950/20" },
  "45": { anim: "field",       header: "bg-gradient-to-r from-emerald-950 via-green-950/80 to-lime-950/60",    body: "from-emerald-950/30 to-green-950/20" },
  "46": { anim: "reputation",  header: "bg-gradient-to-r from-teal-950 via-emerald-950/80 to-green-950/60",    body: "from-teal-950/30 to-emerald-950/20" },
  "47": { anim: "crisis",      header: "bg-gradient-to-r from-cyan-950 via-sky-950/80 to-blue-950/60",         body: "from-cyan-950/30 to-sky-950/20" },
  "48": { anim: "content",     header: "bg-gradient-to-r from-lime-950 via-green-950/80 to-emerald-950/60",    body: "from-lime-950/30 to-green-950/20" },
  "49": { anim: "email",       header: "bg-gradient-to-r from-green-950 via-teal-950/80 to-cyan-950/60",       body: "from-green-950/30 to-teal-950/20" },
  "50": { anim: "media",       header: "bg-gradient-to-r from-sky-950 via-blue-950/80 to-indigo-950/60",       body: "from-sky-950/30 to-blue-950/20" },

  // Reputation (7 services)
  "51": { anim: "reputation",  header: "bg-gradient-to-r from-blue-950 via-indigo-950/80 to-violet-950/60",    body: "from-blue-950/40 to-blue-950/20" },
  "53": { anim: "research",    header: "bg-gradient-to-r from-indigo-950 via-blue-950/80 to-sky-950/60",       body: "from-indigo-950/40 to-indigo-950/20" },
  "54": { anim: "design",      header: "bg-gradient-to-r from-violet-950 via-indigo-950/80 to-blue-950/60",    body: "from-violet-950/40 to-violet-950/20" },
  "56": { anim: "content",     header: "bg-gradient-to-r from-sky-950 via-indigo-950/80 to-violet-950/60",     body: "from-sky-950/40 to-sky-950/20" },
  "6":  { anim: "seo",         header: "bg-gradient-to-r from-blue-950 via-sky-950/80 to-cyan-950/60",         body: "from-blue-950/30 to-sky-950/20" },
  "7":  { anim: "digital",     header: "bg-gradient-to-r from-indigo-950 via-violet-950/80 to-purple-950/60",  body: "from-indigo-950/30 to-violet-950/20" },
  "8":  { anim: "analytics",   header: "bg-gradient-to-r from-purple-950 via-blue-950/80 to-indigo-950/60",    body: "from-purple-950/30 to-blue-950/20" },

  // Risk & Crisis (6 services)
  "52": { anim: "crisis",      header: "bg-gradient-to-r from-red-950 via-rose-950/80 to-pink-950/60",         body: "from-red-950/40 to-red-950/20" },
  "55": { anim: "seo",         header: "bg-gradient-to-r from-rose-950 via-red-950/80 to-orange-950/60",       body: "from-rose-950/40 to-rose-950/20" },
  "11": { anim: "field",       header: "bg-gradient-to-r from-red-950 via-orange-950/80 to-amber-950/60",      body: "from-red-950/30 to-orange-950/20" },
  "12": { anim: "analytics",   header: "bg-gradient-to-r from-orange-950 via-red-950/80 to-rose-950/60",       body: "from-orange-950/30 to-red-950/20" },
  "13": { anim: "research",    header: "bg-gradient-to-r from-amber-950 via-orange-950/80 to-red-950/60",      body: "from-amber-950/30 to-orange-950/20" },
  "14": { anim: "reputation",  header: "bg-gradient-to-r from-rose-950 via-pink-950/80 to-fuchsia-950/60",     body: "from-rose-950/30 to-pink-950/20" },

  // Web Development (9 services)
  "9":  { anim: "web",         header: "bg-gradient-to-r from-cyan-950 via-teal-950/80 to-emerald-950/60",     body: "from-cyan-950/40 to-cyan-950/20" },
  "10": { anim: "design",      header: "bg-gradient-to-r from-teal-950 via-cyan-950/80 to-sky-950/60",         body: "from-teal-950/40 to-teal-950/20" },
  "57": { anim: "fundraising", header: "bg-gradient-to-r from-sky-950 via-cyan-950/80 to-teal-950/60",         body: "from-sky-950/40 to-sky-950/20" },
  "58": { anim: "email",       header: "bg-gradient-to-r from-emerald-950 via-teal-950/80 to-cyan-950/60",     body: "from-emerald-950/40 to-emerald-950/20" },
  "59": { anim: "youth",       header: "bg-gradient-to-r from-cyan-950 via-sky-950/80 to-blue-950/60",         body: "from-cyan-950/30 to-sky-950/20" },
  "60": { anim: "field",       header: "bg-gradient-to-r from-teal-950 via-emerald-950/80 to-green-950/60",    body: "from-teal-950/30 to-emerald-950/20" },
  "61": { anim: "content",     header: "bg-gradient-to-r from-green-950 via-teal-950/80 to-cyan-950/60",       body: "from-green-950/30 to-teal-950/20" },
  "62": { anim: "digital",     header: "bg-gradient-to-r from-blue-950 via-cyan-950/80 to-teal-950/60",        body: "from-blue-950/30 to-cyan-950/20" },
  "63": { anim: "analytics",   header: "bg-gradient-to-r from-sky-950 via-blue-950/80 to-indigo-950/60",       body: "from-sky-950/30 to-blue-950/20" },
  "64": { anim: "media",       header: "bg-gradient-to-r from-indigo-950 via-sky-950/80 to-cyan-950/60",       body: "from-indigo-950/30 to-sky-950/20" },

  // Digital Marketing (7 services)
  "17": { anim: "digital",     header: "bg-gradient-to-r from-blue-950 via-indigo-950/80 to-violet-950/60",    body: "from-blue-950/40 to-blue-950/20" },
  "18": { anim: "seo",         header: "bg-gradient-to-r from-indigo-950 via-blue-950/80 to-sky-950/60",       body: "from-indigo-950/40 to-indigo-950/20" },
  "19": { anim: "media",       header: "bg-gradient-to-r from-sky-950 via-indigo-950/80 to-blue-950/60",       body: "from-sky-950/40 to-sky-950/20" },
  "26": { anim: "fundraising", header: "bg-gradient-to-r from-violet-950 via-blue-950/80 to-indigo-950/60",    body: "from-violet-950/40 to-violet-950/20" },
  "27": { anim: "youth",       header: "bg-gradient-to-r from-blue-950 via-sky-950/80 to-cyan-950/60",         body: "from-blue-950/30 to-sky-950/20" },
  "33": { anim: "web",         header: "bg-gradient-to-r from-cyan-950 via-blue-950/80 to-indigo-950/60",      body: "from-cyan-950/30 to-blue-950/20" },
  "34": { anim: "content",     header: "bg-gradient-to-r from-indigo-950 via-violet-950/80 to-purple-950/60",  body: "from-indigo-950/30 to-violet-950/20" },
  "35": { anim: "analytics",   header: "bg-gradient-to-r from-purple-950 via-indigo-950/80 to-blue-950/60",    body: "from-purple-950/30 to-indigo-950/20" },

  // Analytics (6 services)
  "20": { anim: "analytics",   header: "bg-gradient-to-r from-amber-950 via-yellow-950/80 to-orange-950/60",   body: "from-amber-950/40 to-amber-950/20" },
  "21": { anim: "web",         header: "bg-gradient-to-r from-yellow-950 via-amber-950/80 to-orange-950/60",   body: "from-yellow-950/40 to-yellow-950/20" },
  "22": { anim: "field",       header: "bg-gradient-to-r from-orange-950 via-amber-950/80 to-yellow-950/60",   body: "from-orange-950/40 to-orange-950/20" },
  "23": { anim: "digital",     header: "bg-gradient-to-r from-amber-950 via-orange-950/80 to-red-950/60",      body: "from-amber-950/30 to-orange-950/20" },
  "24": { anim: "research",    header: "bg-gradient-to-r from-orange-950 via-red-950/80 to-amber-950/60",      body: "from-orange-950/30 to-red-950/20" },
  "25": { anim: "seo",         header: "bg-gradient-to-r from-red-950 via-orange-950/80 to-amber-950/60",      body: "from-red-950/30 to-orange-950/20" },

  // Research (9 services)
  "28": { anim: "research",    header: "bg-gradient-to-r from-amber-950 via-yellow-950/80 to-lime-950/60",     body: "from-amber-950/40 to-amber-950/20" },
  "29": { anim: "analytics",   header: "bg-gradient-to-r from-yellow-950 via-amber-950/80 to-orange-950/60",   body: "from-yellow-950/40 to-yellow-950/20" },
  "30": { anim: "youth",       header: "bg-gradient-to-r from-lime-950 via-yellow-950/80 to-amber-950/60",     body: "from-lime-950/40 to-lime-950/20" },
  "65": { anim: "crisis",      header: "bg-gradient-to-r from-orange-950 via-amber-950/80 to-yellow-950/60",   body: "from-orange-950/40 to-orange-950/20" },
  "66": { anim: "field",       header: "bg-gradient-to-r from-amber-950 via-orange-950/80 to-red-950/60",      body: "from-amber-950/30 to-orange-950/20" },
  "67": { anim: "content",     header: "bg-gradient-to-r from-yellow-950 via-lime-950/80 to-green-950/60",     body: "from-yellow-950/30 to-lime-950/20" },
  "68": { anim: "digital",     header: "bg-gradient-to-r from-lime-950 via-green-950/80 to-emerald-950/60",    body: "from-lime-950/30 to-green-950/20" },
  "69": { anim: "seo",         header: "bg-gradient-to-r from-green-950 via-lime-950/80 to-yellow-950/60",     body: "from-green-950/30 to-lime-950/20" },
  "70": { anim: "web",         header: "bg-gradient-to-r from-emerald-950 via-green-950/80 to-lime-950/60",    body: "from-emerald-950/30 to-green-950/20" },
  "71": { anim: "email",       header: "bg-gradient-to-r from-teal-950 via-emerald-950/80 to-green-950/60",    body: "from-teal-950/30 to-emerald-950/20" },
  "72": { anim: "media",       header: "bg-gradient-to-r from-cyan-950 via-teal-950/80 to-emerald-950/60",     body: "from-cyan-950/30 to-teal-950/20" },
}

// Fallback for any unmapped service
const fallbackVisual: CardVisual = { anim: "analytics", header: "bg-gradient-to-r from-slate-950 via-zinc-950/80 to-neutral-950/60", body: "from-slate-950/40 to-slate-950/20" }

function getServiceVisual(serviceId: string): CardVisual {
  return serviceVisuals[serviceId] || fallbackVisual
}

function getCardAnimationType(serviceId: string): AnimationType {
  const visual = getServiceVisual(serviceId);
  return visual.anim;
}

function getCardTheme(serviceId: string): { header: string, body: string } {
  const visual = getServiceVisual(serviceId);
  return { header: visual.header, body: visual.body };
}

function summarizeServiceNames(services: Service[], maxVisible = 3) {
  const visible = services.slice(0, maxVisible).map((service) => service.name)
  const hiddenCount = Math.max(services.length - maxVisible, 0)

  return {
    visible,
    hiddenCount,
  }
}

function ServicesCatalogPageContent() {
  return <CandidateServicesCatalog />
}

export default function ServicesCatalogPage() {
  return (
    <Suspense fallback={null}>
      <ServicesCatalogPageContent />
    </Suspense>
  )
}

export function CandidateServicesCatalog({ embedded = false }: { embedded?: boolean }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [subscribing, setSubscribing] = useState<string | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [subscribedIds, setSubscribedIds] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [packageOnboardingId, setPackageOnboardingId] = useState<string | null>(null)
  const [activeDemoCandidateId, setActiveDemoCandidateId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"packages" | "services">("packages")

  useEffect(() => {
    const tabParam = searchParams.get("tab")
    if (tabParam === "packages" || tabParam === "services") {
      setActiveTab(tabParam)
    }
  }, [searchParams])

  useEffect(() => {
    async function loadData() {
      // Check for demo mode
      const isDemoMode = localStorage.getItem("tnm-demo-mode") === "true"
      
      if (isDemoMode) {
        CRMStore.initializeStore()
        const demoServices: Service[] = CAMPAIGN_SERVICE_CATALOG
        setServices(demoServices)
        setUserId("demo-user")
        // Cache demo services for checkout page
        localStorage.setItem("tnm-cached-services", JSON.stringify(demoServices))

        const currentDemoCandidate = CRMStore.getCurrentUser()
        if (currentDemoCandidate && currentDemoCandidate.type !== "candidate") {
          router.replace(currentDemoCandidate.type === "voter" ? "/voter" : "/")
          return
        }
        const fallbackDemoCandidate = CRMStore.getUser("demo-cand-3") || CRMStore.getUsers().find((user) => user.type === "candidate") || null
        const resolvedDemoCandidate = currentDemoCandidate?.type === "candidate" ? currentDemoCandidate : fallbackDemoCandidate

        if (resolvedDemoCandidate) {
          CRMStore.setCurrentUser(resolvedDemoCandidate)
          setActiveDemoCandidateId(resolvedDemoCandidate.id)
          const candidateServiceIds = Array.from(new Set([
            ...CRMStore.getSubscriptionsByUser(resolvedDemoCandidate.id).map((subscription) => subscription.service_id),
            ...CRMStore.getOrdersByUser(resolvedDemoCandidate.id).flatMap((order) => order.items.map((item) => item.service_id)),
          ]))
          setSubscribedIds(candidateServiceIds)
        }
        
        setLoading(false)
        return
      }

      // Regular authentication flow
      const supabase = createClient()
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/login?redirect=/candidate-portal/services")
        return
      }

      const { data: profileData } = await supabase
        .from("profiles")
        .select("user_type")
        .eq("id", user.id)
        .single()

      if (!profileData || profileData.user_type !== "candidate") {
        router.replace(profileData?.user_type === "voter" ? "/voter" : "/")
        return
      }
      
      setUserId(user.id)

      // Get all services
      const { data: servicesData } = await supabase
        .from("services")
        .select("*")
        .eq("active", true)
        .order("popular", { ascending: false })

      if (servicesData) {
        setServices(servicesData)
        // Cache services for checkout page
        localStorage.setItem("tnm-cached-services", JSON.stringify(servicesData))
      }

      // Get subscribed service IDs
      const { data: subscriptions } = await supabase
        .from("candidate_services")
        .select("service_id")
        .eq("candidate_id", user.id)

      if (subscriptions) {
        setSubscribedIds(subscriptions.map(s => s.service_id))
      }

      setLoading(false)
    }

    loadData()
  }, [router])

  async function handleSubscribe(serviceId: string) {
    if (!userId) return

    const currentUser = CRMStore.getCurrentUser()
    if (currentUser && currentUser.type !== "candidate") {
      router.push(currentUser.type === "voter" ? "/voter" : "/")
      return
    }
    
    setSubscribing(serviceId)
    
    // Find the service details
    const service = services.find(s => s.id === serviceId)
    if (!service) {
      setSubscribing(null)
      return
    }

    // Get current user from CRM store
    const resolvedUserId = currentUser?.id || userId
    const resolvedUserName = currentUser?.name || "Guest User"
    const createMonthlyRetainer = !isOneTimeService(service)
    
    // Create order in CRM store
    CRMStore.createOrder({
      user_id: resolvedUserId,
      user_name: resolvedUserName,
      user_type: "candidate",
      items: [{
        service_id: serviceId,
        service_name: service.name,
        price_cents: normalizePriceToCents(service.price_monthly),
      }],
      total_cents: normalizePriceToCents(service.price_monthly),
      status: "completed",
      payment_status: "paid",
    })

    if (createMonthlyRetainer) {
      CRMStore.createSubscription({
        user_id: resolvedUserId,
        user_name: resolvedUserName,
        user_type: "candidate",
        service_id: serviceId,
        service_name: service.name,
        plan: "monthly",
        price_cents: normalizePriceToCents(service.price_monthly),
        status: "active",
        auto_renew: true,
      })
    }

    // Also try Supabase (will work if connection is available)
    try {
      const supabase = createClient()
      await supabase
        .from("candidate_services")
        .insert({
          candidate_id: userId,
          service_id: serviceId,
          status: "active"
        })
    } catch (e) {
      // Supabase insert failed, but CRM store has the data
      console.log("[v0] Supabase insert failed, using local store")
    }

    setSubscribedIds((current) => [...new Set([...current, serviceId])])
    setSubscribing(null)
  }

  const categories = [...new Set(services.map(s => s.category))]
  
  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategory || service.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const normalizePriceToCents = (price: number) => (price >= 10000 ? price : Math.round(price * 100))
  const isOneTimeService = (service: Service) => /one-time|\/page/i.test(service.price_display.toLowerCase())
  const serviceMap = new Map(services.map(service => [service.id, service]))

  const getPresetCandidateAccount = (preset: CampaignPackagePreset) => {
    const presetCandidate = CRMStore.getUser(preset.demoCandidateId)
    if (presetCandidate?.type === "candidate") return presetCandidate

    const fallbackCandidate = CRMStore.getUsers().find(
      (user) => user.type === "candidate" && user.email.toLowerCase() === preset.demoCandidateEmail.toLowerCase(),
    )
    return fallbackCandidate?.type === "candidate" ? fallbackCandidate : null
  }

  const ensureCampaignWorkspaceArtifacts = (candidateId: string, candidateName: string, preset: CampaignPackagePreset) => {
    const existingMembers = CRMStore.getTeamMembersByCandidate(candidateId)
    const existingCampaigns = CRMStore.getCampaignsByUser(candidateId)
    const existingChats = CRMStore.getTeamChatsByCandidate(candidateId)
    const existingThreads = CRMStore.getClientChats().filter(thread => thread.client_id === candidateId)
    const existingFiles = CRMStore.getSharedFilesByCandidate(candidateId)
    const existingMeetings = CRMStore.getMeetingsByCandidate(candidateId)
    const existingDeals = CRMStore.getDeals().filter(deal => deal.client_name === candidateName)
    const existingTasks = CRMStore.getTasks().filter(task => task.related_to === candidateName)

    const campaignName = `${preset.label} Full Campaign`
    if (!existingCampaigns.some(campaign => campaign.name === campaignName)) {
      CRMStore.createCampaign({
        owner_user_id: candidateId,
        owner_name: candidateName,
        name: campaignName,
        status: "active",
        budget_cents: 0,
        target_region: preset.targetRegion,
        launch_date: new Date().toISOString().split("T")[0],
        goals: ["Message discipline", "Volunteer execution", "Election-day turnout"],
      })
    }

    const defaultMembers: Array<{ name: string; email: string; role: CRMStore.TeamMember["role"]; permissions: string[] }> = [
      { name: `${candidateName} Campaign Lead`, email: `${candidateId}-lead@tnm.demo`, role: "campaign_manager", permissions: ["campaigns", "chat", "files", "meetings", "reporting"] },
      { name: `${candidateName} Field Lead`, email: `${candidateId}-field@tnm.demo`, role: "field_director", permissions: ["field", "volunteers", "chat", "meetings"] },
      { name: `${candidateName} Insights Lead`, email: `${candidateId}-insights@tnm.demo`, role: "analyst", permissions: ["campaigns", "files", "reporting"] },
    ]

    defaultMembers.forEach((member) => {
      if (!existingMembers.some(existing => existing.email === member.email)) {
        CRMStore.createTeamMember({
          candidate_user_id: candidateId,
          candidate_name: candidateName,
          name: member.name,
          email: member.email,
          role: member.role,
          status: "active",
          portal_access: true,
          permissions: member.permissions,
        })
      }
    })

    const refreshedMembers = CRMStore.getTeamMembersByCandidate(candidateId)
    const activeMemberIds = refreshedMembers.filter(member => member.status === "active").map(member => member.id)

    if (!existingChats.some(chat => chat.name === "War Room")) {
      CRMStore.createTeamChat({
        candidate_user_id: candidateId,
        candidate_name: candidateName,
        name: "War Room",
        topic: `${preset.label} delivery decisions and approvals`,
        member_ids: activeMemberIds,
        last_message: `Package onboarded for ${preset.label}.`,
        unread_count: 0,
      })
    }

    if (!existingThreads.some(thread => thread.subject === `${preset.label} onboarding`)) {
      CRMStore.createClientChat({
        client_id: candidateId,
        client_name: candidateName,
        owner_name: `${candidateName} Campaign Lead`,
        subject: `${preset.label} onboarding`,
        priority: "high",
        status: "open",
        last_message: "Core package activated and delivery workspace created.",
      })
    }

    const filesToCreate = [
      { name: `${preset.label.replace(/\s+/g, "-")}-Strategy-Brief.pdf`, category: "brief" as const, size_label: "2.1 MB" },
      { name: `${preset.label.replace(/\s+/g, "-")}-Launch-Checklist.xlsx`, category: "field" as const, size_label: "680 KB" },
    ]

    filesToCreate.forEach((file) => {
      if (!existingFiles.some(existing => existing.name === file.name)) {
        CRMStore.createSharedFile({
          candidate_user_id: candidateId,
          candidate_name: candidateName,
          name: file.name,
          category: file.category,
          uploaded_by: `${candidateName} Campaign Lead`,
          role_visibility: ["campaign_manager", "field_director", "analyst"],
          size_label: file.size_label,
        })
      }
    })

    if (!existingMeetings.some(meeting => meeting.title === `${preset.label} Kickoff`)) {
      CRMStore.createMeeting({
        candidate_user_id: candidateId,
        candidate_name: candidateName,
        title: `${preset.label} Kickoff`,
        meeting_type: "strategy",
        starts_at: new Date(Date.now() + 86400000).toISOString(),
        duration_minutes: 60,
        attendees: [candidateName, `${candidateName} Campaign Lead`, `${candidateName} Field Lead`],
        status: "scheduled",
        notes: "Review package scope, launch work, and add-on recommendations.",
      })
    }

    if (!existingDeals.some(deal => deal.title === `${preset.label} Campaign Account`)) {
      CRMStore.createDeal({
        title: `${preset.label} Campaign Account`,
        client_name: candidateName,
        value_cents: 0,
        stage: "closed_won",
        probability: 100,
        expected_close: new Date().toISOString().split("T")[0],
      })
    }

    preset.gapAnalysis.forEach((gap) => {
      const title = `Close ${gap.area} gap`
      if (!existingTasks.some(task => task.title === title && task.related_to === candidateName)) {
        CRMStore.createTask({
          title,
          description: `${gap.gap} Recommended retainer: ${gap.subscription}.`,
          related_to: candidateName,
          priority: "high",
          status: "pending",
          due_date: new Date(Date.now() + 172800000).toISOString().split("T")[0],
        })
      }
    })
  }

  const handlePackageOnboard = async (preset: CampaignPackagePreset, includeAddOns: boolean) => {
    const packageKey = `${preset.id}-${includeAddOns ? "plus" : "core"}`
    setPackageOnboardingId(packageKey)

    try {
      const candidateAccount = getPresetCandidateAccount(preset)
      if (!candidateAccount) {
        setPackageOnboardingId(null)
        return
      }

      CRMStore.setCurrentUser(candidateAccount)
      setActiveDemoCandidateId(candidateAccount.id)

      const selectedServiceIds = Array.from(new Set([
        ...preset.mustHaveMonthlyRetainers,
        ...preset.oneTimeLaunchWork,
        ...(includeAddOns ? preset.recommendedAddOns : []),
      ]))

      const selectedServices = selectedServiceIds
        .map((serviceId) => serviceMap.get(serviceId))
        .filter((service): service is Service => Boolean(service))

      selectedServices.forEach((service) => {
        const alreadyOrdered = CRMStore.getOrdersByUser(candidateAccount.id).some((order) =>
          order.items.some((item) => item.service_id === service.id),
        )

        if (!alreadyOrdered) {
          CRMStore.createOrder({
            user_id: candidateAccount.id,
            user_name: candidateAccount.name,
            user_type: "candidate",
            items: [{
              service_id: service.id,
              service_name: service.name,
              price_cents: normalizePriceToCents(service.price_monthly),
            }],
            total_cents: normalizePriceToCents(service.price_monthly),
            status: "completed",
            payment_status: "paid",
          })
        }

        if (!isOneTimeService(service)) {
          const alreadySubscribed = CRMStore.getSubscriptionsByUser(candidateAccount.id).some(
            (subscription) => subscription.service_id === service.id && subscription.status === "active",
          )

          if (!alreadySubscribed) {
            CRMStore.createSubscription({
              user_id: candidateAccount.id,
              user_name: candidateAccount.name,
              user_type: "candidate",
              service_id: service.id,
              service_name: service.name,
              plan: "monthly",
              price_cents: normalizePriceToCents(service.price_monthly),
              status: "active",
              auto_renew: true,
            })
          }
        }
      })

      ensureCampaignWorkspaceArtifacts(candidateAccount.id, candidateAccount.name, preset)

      const candidateServiceIds = Array.from(new Set([
        ...CRMStore.getSubscriptionsByUser(candidateAccount.id).map((subscription) => subscription.service_id),
        ...CRMStore.getOrdersByUser(candidateAccount.id).flatMap((order) => order.items.map((item) => item.service_id)),
      ]))

      setSubscribedIds(candidateServiceIds)
    } finally {
      setPackageOnboardingId(null)
    }
  }

  const activeDemoCandidate = activeDemoCandidateId ? CRMStore.getUser(activeDemoCandidateId) : CRMStore.getCurrentUser()

  const getServiceCommercialModel = (service: Service) => {
    const packageMatches = CAMPAIGN_PACKAGE_PRESETS.filter((preset) =>
      preset.mustHaveMonthlyRetainers.includes(service.id) ||
      preset.oneTimeLaunchWork.includes(service.id) ||
      preset.recommendedAddOns.includes(service.id),
    )

    if (isOneTimeService(service)) {
      return {
        label: "Launch project",
        detail: "Creates a one-time project/order in CRM. It does not create a recurring subscription.",
        color: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
        packageMatches,
      }
    }

    return {
      label: "Monthly retainer",
      detail: "Creates an active monthly retainer in CRM and rolls into full campaign contract value.",
      color: "bg-green-500/15 text-green-300 border-green-500/30",
      packageMatches,
    }
  }

  if (loading) {
    if (embedded) {
      return (
        <div className="flex items-center justify-center py-16">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-white/70">Loading services...</p>
          </div>
        </div>
      )
    }

    return (
      <div className="min-h-screen bg-[#05070a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-white/70">Loading services...</p>
        </div>
      </div>
    )
  }

  const content = (
    <div className={embedded ? "space-y-8" : "max-w-7xl mx-auto px-4 py-8"}>
      {!embedded && (
        <div className="border-b border-white/10 bg-[#06080c] -mx-4 mb-8 px-4 py-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-4">
              <Link href="/candidate-portal">
                <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">Campaign Services</h1>
                <p className="text-white/60 mt-1">Professional tools to power your municipal campaign</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "packages" | "services")} className="gap-6">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
          <TabsList className="h-auto w-full flex-wrap justify-start gap-2 bg-transparent p-0">
            <TabsTrigger value="packages" className="min-w-[180px] border border-white/10 bg-white/5 px-4 py-2 text-white data-[state=active]:border-blue-500/40 data-[state=active]:bg-blue-500/15 data-[state=active]:text-blue-200">
              Campaign Packages
            </TabsTrigger>
            <TabsTrigger value="services" className="min-w-[180px] border border-white/10 bg-white/5 px-4 py-2 text-white data-[state=active]:border-cyan-500/40 data-[state=active]:bg-cyan-500/15 data-[state=active]:text-cyan-200">
              Individual Services
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="packages">
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-[11px] uppercase tracking-[0.24em] text-blue-200/70">Campaign Packages</p>
              <h2 className="mt-2 text-xl font-semibold text-white">Adaptive Campaign Packages</h2>
              <p className="mt-1 text-white/60">
                Region should suggest the starting package, not hard-enforce the stack. Pick the closest campaign template, keep the locked core retainers intact, and adjust only launch scope or add-ons later for budget, municipality size, and race conditions.
              </p>
            </div>

            <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-4 md:p-5">
              <div className="grid gap-3 md:grid-cols-4">
                <div>
                  <p className="text-blue-200 font-medium text-sm">1. Choose template</p>
                  <p className="text-white/60 text-sm mt-1">Start with office type plus region fit. This is a recommended package, not a hard lock.</p>
                </div>
                <div>
                  <p className="text-blue-200 font-medium text-sm">2. Save to signup</p>
                  <p className="text-white/60 text-sm mt-1">Candidate signup saves the selected template as the starting plan choice.</p>
                </div>
                <div>
                  <p className="text-blue-200 font-medium text-sm">3. Load workspace</p>
                  <p className="text-white/60 text-sm mt-1">Portal onboarding creates retainers, launch work, tasks, and team workspace records.</p>
                </div>
                <div>
                  <p className="text-blue-200 font-medium text-sm">4. Customize later</p>
                  <p className="text-white/60 text-sm mt-1">Swap or reduce add-ons later, but keep the core monthly operating layer and approved launch work intact.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {CAMPAIGN_PACKAGE_PRESETS.map((preset) => {
                const coreMonthly = preset.mustHaveMonthlyRetainers.map((serviceId) => serviceMap.get(serviceId)).filter((service): service is Service => Boolean(service))
                const launchWork = preset.oneTimeLaunchWork.map((serviceId) => serviceMap.get(serviceId)).filter((service): service is Service => Boolean(service))
                const addOns = preset.recommendedAddOns.map((serviceId) => serviceMap.get(serviceId)).filter((service): service is Service => Boolean(service))
                const coreStackHighlights = summarizeServiceNames(getCampaignStackHighlights(preset.coreCampaignStackIds), 4)
                const launchStackHighlights = summarizeServiceNames(getCampaignStackHighlights(preset.launchCampaignStackIds), 5)
                const addOnStackHighlights = summarizeServiceNames(getCampaignStackHighlights(preset.addOnCampaignStackIds), 5)
                const coreStacks = preset.coreCampaignStackIds.map((stackId) => getCampaignStackById(stackId)).filter((stack): stack is NonNullable<ReturnType<typeof getCampaignStackById>> => Boolean(stack))
                const launchStacks = preset.launchCampaignStackIds.map((stackId) => getCampaignStackById(stackId)).filter((stack): stack is NonNullable<ReturnType<typeof getCampaignStackById>> => Boolean(stack))
                const addOnStacks = preset.addOnCampaignStackIds.map((stackId) => getCampaignStackById(stackId)).filter((stack): stack is NonNullable<ReturnType<typeof getCampaignStackById>> => Boolean(stack))
                const packageCandidate = getPresetCandidateAccount(preset)
                const coreMonthlyValue = coreMonthly.reduce((sum, service) => sum + normalizePriceToCents(service.price_monthly), 0)
                const launchValue = launchWork.reduce((sum, service) => sum + normalizePriceToCents(service.price_monthly), 0)
                const addOnValue = addOns.reduce((sum, service) => sum + normalizePriceToCents(service.price_monthly), 0)
                const fullCampaignValue = (coreMonthlyValue * preset.cycleMonths) + launchValue + addOnValue

                return (
                  <Card key={preset.id} className="border-white/10 bg-white/5">
                    <CardContent className="p-5">
                      <div className="space-y-4">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-lg font-semibold text-white">{preset.label}</p>
                              <Badge className="border-blue-500/30 bg-blue-500/20 text-blue-300">
                                {preset.officeType} • {preset.cycleMonths} months
                              </Badge>
                            </div>
                            <p className="mt-2 max-w-3xl text-sm leading-6 text-white/60">{preset.description}</p>
                            <p className="mt-2 text-xs text-blue-200/90">Demo CRM client: {preset.demoCandidateName} • {preset.targetRegion}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                          <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                            <p className="text-[11px] text-white/50">Core</p>
                            <p className="mt-1 text-sm font-semibold text-white">${(coreMonthlyValue / 100).toLocaleString()}/month</p>
                          </div>
                          <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                            <p className="text-[11px] text-white/50">Launch</p>
                            <p className="mt-1 text-sm font-semibold text-white">${(launchValue / 100).toLocaleString()}</p>
                          </div>
                          <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                            <p className="text-[11px] text-white/50">Add-ons</p>
                            <p className="mt-1 text-sm font-semibold text-white">${(addOnValue / 100).toLocaleString()}</p>
                          </div>
                          <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                            <p className="text-[11px] text-white/50">Total value</p>
                            <p className="mt-1 text-sm font-semibold text-white">${(fullCampaignValue / 100).toLocaleString()}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Badge className="border-emerald-500/30 bg-emerald-500/15 text-emerald-200">
                            {coreMonthly.length} locked core retainers
                          </Badge>
                          <Badge className="border-cyan-500/30 bg-cyan-500/15 text-cyan-200">
                            {launchWork.length} scoped launch items
                          </Badge>
                          <Badge className="border-amber-500/30 bg-amber-500/15 text-amber-200">
                            {addOns.length} flexible add-ons
                          </Badge>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-white/10 pt-4">
                        <p className="text-xs text-white/45">{preset.profileSummary}</p>
                        <div className="ml-auto flex flex-wrap gap-3">
                          <Sheet>
                            <SheetTrigger asChild>
                              <Button variant="outline" className="border-white/20 bg-transparent text-white hover:bg-white/10">
                                View Full Package
                              </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="overflow-y-auto border-white/10 bg-[#05070a] !w-[98vw] sm:!w-[96vw] md:!w-[92vw] lg:!w-[88vw] xl:!w-[84vw] !max-w-[1480px]">
                              <SheetHeader className="border-b border-white/10 px-6 py-5">
                                <div className="flex flex-wrap items-center gap-2">
                                  <Badge className="border-blue-500/30 bg-blue-500/20 text-blue-300">
                                    {preset.officeType} • {preset.cycleMonths} months
                                  </Badge>
                                  {packageCandidate && <Badge className="border-white/10 bg-white/5 text-white/70">CRM client: {packageCandidate.name}</Badge>}
                                </div>
                                <SheetTitle className="text-2xl text-white">{preset.label}</SheetTitle>
                                <SheetDescription className="text-white/60">{preset.description}</SheetDescription>
                              </SheetHeader>

                              <div className="space-y-5 px-6 py-5">
                                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                                  <p className="text-sm font-medium text-white">Package summary</p>
                                  <p className="mt-2 text-sm text-white/60">{preset.profileSummary}</p>
                                  <div className="mt-4 grid gap-3 md:grid-cols-4">
                                    <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                                      <p className="text-[11px] text-white/50">Core campaign stack</p>
                                      <p className="mt-1 text-sm font-semibold text-white">${(coreMonthlyValue / 100).toLocaleString()}/month</p>
                                    </div>
                                    <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                                      <p className="text-[11px] text-white/50">Launch stack</p>
                                      <p className="mt-1 text-sm font-semibold text-white">${(launchValue / 100).toLocaleString()}</p>
                                    </div>
                                    <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                                      <p className="text-[11px] text-white/50">Add-on stack</p>
                                      <p className="mt-1 text-sm font-semibold text-white">${(addOnValue / 100).toLocaleString()}</p>
                                    </div>
                                    <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                                      <p className="text-[11px] text-white/50">Full campaign value</p>
                                      <p className="mt-1 text-sm font-semibold text-white">${(fullCampaignValue / 100).toLocaleString()}</p>
                                    </div>
                                  </div>
                                </div>

                                <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4 text-sm">
                                  <p className="font-medium text-blue-200">Commercial guardrail</p>
                                  <p className="mt-2 text-white/70">
                                    Locked core retainers protect the monthly operating floor. Launch work is approved as a separate scope, and only add-ons should be swapped or removed later.
                                  </p>
                                </div>

                                <div className="grid gap-4 text-sm 2xl:grid-cols-3">
                                  <div className="rounded-2xl border border-green-500/20 bg-green-500/10 p-4">
                                    <p className="font-medium text-green-300">Locked Core Services</p>
                                    <p className="mt-2 text-xs text-green-200/80">These monthly retainers define the minimum viable campaign operating system and should not be removed.</p>
                                    <p className="mt-2 text-xs text-green-200/80">{coreStacks.map((stack) => stack.title).join(" • ")}</p>
                                    <div className="mt-3 space-y-2 text-white/85">
                                      {coreMonthly.map((service) => (
                                        <div key={`${preset.id}-core-${service.id}`} className="flex min-w-0 flex-col gap-1 border-b border-white/5 pb-2 last:border-b-0 last:pb-0">
                                          <span className="min-w-0 break-words text-white/90">{service.name}</span>
                                          <span className="text-white/45">{service.price_display}</span>
                                        </div>
                                      ))}
                                    </div>
                                    <p className="mt-3 break-words text-xs text-white/55">Stack coverage: {coreStackHighlights.visible.join(", ")}{coreStackHighlights.hiddenCount > 0 ? ` +${coreStackHighlights.hiddenCount} more` : ""}</p>
                                  </div>

                                  <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-4">
                                    <p className="font-medium text-cyan-300">Required Launch Work</p>
                                    <p className="mt-2 text-xs text-cyan-200/80">One-time setup work that gets the campaign live. Once started or delivered, this scope should stay attached to the package.</p>
                                    <p className="mt-2 text-xs text-cyan-200/80">{launchStacks.map((stack) => stack.title).join(" • ")}</p>
                                    <div className="mt-3 space-y-2 text-white/85">
                                      {launchWork.map((service) => (
                                        <div key={`${preset.id}-launch-${service.id}`} className="flex min-w-0 flex-col gap-1 border-b border-white/5 pb-2 last:border-b-0 last:pb-0">
                                          <span className="min-w-0 break-words text-white/90">{service.name}</span>
                                          <span className="text-white/45">{service.price_display}</span>
                                        </div>
                                      ))}
                                    </div>
                                    <p className="mt-3 break-words text-xs text-white/55">Stack coverage: {launchStackHighlights.visible.join(", ")}{launchStackHighlights.hiddenCount > 0 ? ` +${launchStackHighlights.hiddenCount} more` : ""}</p>
                                  </div>

                                  <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
                                    <p className="font-medium text-amber-300">Flexible Add-Ons</p>
                                    <p className="mt-2 text-xs text-amber-200/80">These services can be scaled, swapped, or removed without breaking the package minimum.</p>
                                    <p className="mt-2 text-xs text-amber-200/80">{addOnStacks.map((stack) => stack.title).join(" • ")}</p>
                                    <div className="mt-3 space-y-2 text-white/85">
                                      {addOns.length > 0 ? addOns.map((service) => (
                                        <div key={`${preset.id}-addon-${service.id}`} className="flex min-w-0 flex-col gap-1 border-b border-white/5 pb-2 last:border-b-0 last:pb-0">
                                          <span className="min-w-0 break-words text-white/90">{service.name}</span>
                                          <span className="text-white/45">{service.price_display}</span>
                                        </div>
                                      )) : <p className="text-white/60">No add-ons selected for this package.</p>}
                                    </div>
                                    <p className="mt-3 break-words text-xs text-white/55">Stack coverage: {addOns.length === 0 ? "No add-on stack examples" : `${addOnStackHighlights.visible.join(", ")}${addOnStackHighlights.hiddenCount > 0 ? ` +${addOnStackHighlights.hiddenCount} more` : ""}`}</p>
                                  </div>
                                </div>

                                <Collapsible className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                                  <CollapsibleTrigger className="flex w-full items-center justify-between gap-3 text-left">
                                    <div>
                                      <p className="text-sm font-medium text-white">Gap Analysis</p>
                                      <p className="mt-1 text-xs text-white/50">Expand only when you want delivery risks and recommended fixes.</p>
                                    </div>
                                    <ChevronDown className="h-4 w-4 text-white/50" />
                                  </CollapsibleTrigger>
                                  <CollapsibleContent className="pt-4">
                                    <div className="grid gap-3 md:grid-cols-2">
                                      {preset.gapAnalysis.map((gap) => (
                                        <div key={gap.area} className="rounded-xl border border-white/10 bg-black/20 p-3">
                                          <p className="font-medium text-white">{gap.area}</p>
                                          <p className="mt-2 text-sm text-white/60">{gap.summary}</p>
                                          <p className="mt-3 text-xs text-amber-300">
                                            Fix with: {gap.recommendedServiceIds.map((serviceId) => serviceMap.get(serviceId)?.name).filter(Boolean).join(", ")}
                                          </p>
                                        </div>
                                      ))}
                                    </div>
                                  </CollapsibleContent>
                                </Collapsible>
                              </div>

                              <SheetFooter className="border-t border-white/10 px-6 py-5 sm:flex-row sm:justify-end">
                                <Link href={`/auth/sign-up?template=${preset.id}`}>
                                  <Button variant="outline" className="border-blue-500/30 bg-transparent text-blue-200 hover:bg-blue-500/10">
                                    Use In Candidate Signup
                                  </Button>
                                </Link>
                                <Button
                                  onClick={() => handlePackageOnboard(preset, false)}
                                  disabled={packageOnboardingId !== null}
                                  className="bg-white text-black hover:bg-white/90"
                                >
                                  {packageOnboardingId === `${preset.id}-core` ? "Onboarding..." : "Onboard Locked Core"}
                                </Button>
                                <Button
                                  variant="outline"
                                  onClick={() => handlePackageOnboard(preset, true)}
                                  disabled={packageOnboardingId !== null}
                                  className="border-white/20 bg-transparent text-white hover:bg-white/10"
                                >
                                  {packageOnboardingId === `${preset.id}-plus` ? "Onboarding..." : "Onboard Core + Flexible Add-Ons"}
                                </Button>
                              </SheetFooter>
                            </SheetContent>
                          </Sheet>
                          <Button
                            onClick={() => handlePackageOnboard(preset, false)}
                            disabled={packageOnboardingId !== null}
                            className="bg-white text-black hover:bg-white/90"
                          >
                            {packageOnboardingId === `${preset.id}-core` ? "Onboarding..." : "Onboard Locked Core"}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {activeDemoCandidate && (
              <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-blue-500/10 via-cyan-500/5 to-transparent p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-200">Active demo account on this services page</p>
                    <p className="mt-2 text-white text-sm">{activeDemoCandidate.name} • {activeDemoCandidate.email}</p>
                    <p className="mt-2 max-w-3xl text-sm text-white/60">
                      Package onboarding writes into this demo client workspace. Switch to the services tab when you want to browse or add single services without opening each package.
                    </p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:w-[360px]">
                    <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                      <p className="text-[11px] uppercase tracking-wide text-white/40">Current mode</p>
                      <p className="mt-1 text-sm font-medium text-white">Demo CRM preview</p>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                      <p className="text-[11px] uppercase tracking-wide text-white/40">Package behavior</p>
                      <p className="mt-1 text-sm font-medium text-white">Switches active client</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="services">
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-[11px] uppercase tracking-[0.24em] text-cyan-200/70">Individual Services</p>
              <h2 className="mt-2 text-xl font-semibold text-white">Browse Individual Services</h2>
              <p className="mt-1 text-sm text-white/60">
                Search and category filters only affect the service cards in this tab. Campaign templates stay separate in the packages tab.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <Input
                  placeholder="Search individual services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
                />
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                  className={`whitespace-nowrap ${
                    !selectedCategory
                      ? "bg-blue-600 border-blue-600 text-white hover:bg-blue-500"
                      : "border-white/20 text-white/70 hover:bg-white/10 hover:text-white bg-transparent"
                  }`}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  All
                </Button>
                {categories.map(category => (
                  <Button
                    key={category}
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={`whitespace-nowrap ${
                      selectedCategory === category
                        ? "bg-blue-600 border-blue-600 text-white hover:bg-blue-500"
                        : "border-white/20 text-white/70 hover:bg-white/10 hover:text-white bg-transparent"
                    }`}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredServices.map((service) => {
                const isSubscribed = subscribedIds.includes(service.id)
                const visual = getServiceVisual(service.id)
                const animationType = visual.anim
                const theme = { header: visual.header, body: visual.body }

                return (
                  <Card key={service.id} className={`relative bg-gradient-to-br ${theme.body} border-none overflow-hidden group hover:scale-[1.02] transition-all duration-300`}>
                    <div className={`relative h-20 overflow-hidden ${theme.header}`}>
                      <AnimatedServiceBackground type={animationType} />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />
                    </div>
                    <CardContent className="relative p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
                          {categoryIcons[service.category] || <Package className="w-4 h-4 text-white/70" />}
                        </div>
                        {service.popular && (
                          <Badge className="bg-orange-500/30 text-orange-300 border-0 text-[10px] px-1.5 py-0">
                            <Star className="w-2.5 h-2.5 mr-0.5 fill-orange-300" />
                            Popular
                          </Badge>
                        )}
                      </div>

                      <div className="mb-3">
                        <span className="text-[10px] uppercase tracking-wider text-white/40">{service.category}</span>
                        <div className="mt-1 flex flex-wrap gap-2">
                          {(() => {
                            const commercialModel = getServiceCommercialModel(service)
                            return (
                              <>
                                <Badge className={commercialModel.color}>{commercialModel.label}</Badge>
                                {commercialModel.packageMatches.slice(0, 2).map((preset) => (
                                  <Badge key={preset.id} className="bg-white/10 text-white/70 border-white/15">
                                    {preset.label}
                                  </Badge>
                                ))}
                              </>
                            )
                          })()}
                        </div>
                        <h3 className="text-white font-semibold text-sm mb-1 line-clamp-1">{service.name}</h3>
                        <p className="text-white/50 text-xs line-clamp-2 leading-relaxed">{service.description}</p>
                        <p className="text-white/35 text-[11px] leading-relaxed mt-2">{getServiceCommercialModel(service).detail}</p>
                      </div>

                      {service.features && service.features.length > 0 && (
                        <div className="mb-3 space-y-1">
                          {service.features.slice(0, 2).map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-1.5 text-xs">
                              <Check className="w-3 h-3 text-green-400 flex-shrink-0" />
                              <span className="text-white/60 truncate">{feature}</span>
                            </div>
                          ))}
                          {service.features.length > 2 && (
                            <p className="text-white/40 text-[10px] pl-4">+{service.features.length - 2} more</p>
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-3 border-t border-white/10">
                        <div>
                          <span className="text-sm font-bold text-white">{service.price_display}</span>
                        </div>
                        {isSubscribed ? (
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-[10px]">Active</Badge>
                        ) : (
                          <Button size="sm" onClick={() => router.push(`/candidate-portal/checkout?service=${service.id}`)} className="bg-white text-black hover:bg-white/90 text-xs h-7 px-3">
                            {isOneTimeService(service) ? "Start Launch Project" : "Start Retainer"}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {filteredServices.length === 0 && (
              <div className="text-center py-16">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                  <Package className="w-10 h-10 text-white/30" />
                </div>
                <h3 className="text-white text-xl font-semibold mb-2">No services found</h3>
                <p className="text-white/50 mb-6">Try adjusting your search or filter criteria</p>
                <Button variant="outline" onClick={() => { setSearchQuery(""); setSelectedCategory(null) }} className="border-white/20 text-white hover:bg-white/10 bg-transparent">
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )

  if (embedded) {
    return content
  }

  return <div className="min-h-screen bg-[#05070a] px-4">{content}</div>
}

// Renamed the Loading function to avoid redeclaration
function Loading() {
  return null
}
