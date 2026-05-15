"use client"

import React from "react"
import { Suspense } from "react"
import Loading from "./loading"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Check, CreditCard, Lock, Shield, Star, Zap, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { CAMPAIGN_SERVICE_CATALOG } from "@/lib/campaign-system"
import * as CRMStore from "@/lib/store/crm-store"

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
}

const demoServices: Service[] = CAMPAIGN_SERVICE_CATALOG

export default function CheckoutPage() {
  const router = useRouter()
  const hasSupabaseConfig = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === "true"
  const [serviceId, setServiceId] = useState<string | null>(null)
  const [service, setService] = useState<Service | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(false)
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly")
  
  // Form state
  const [cardName, setCardName] = useState("")
  const [cardNumber, setCardNumber] = useState("")
  const [expiry, setExpiry] = useState("")
  const [cvc, setCvc] = useState("")
  const [email, setEmail] = useState("")
  const [promoCode, setPromoCode] = useState("")
  const [promoApplied, setPromoApplied] = useState(false)
  const [promoDiscount, setPromoDiscount] = useState(0)

  useEffect(() => {
    async function loadData() {
      // Also check demo mode for backward compatibility
      const isDemoMode = localStorage.getItem("tnm-demo-mode") === "true"

      if (isDemoMode) {
        CRMStore.initializeStore()
        const demoCurrentUser = CRMStore.getCurrentUser()
        if (demoCurrentUser && demoCurrentUser.type !== "candidate") {
          router.replace(demoCurrentUser.type === "voter" ? "/voter" : "/")
          return
        }

        const demoUser = JSON.parse(localStorage.getItem("tnm-demo-user") || "{}")
        setEmail(demoUser.email || "alex.candidate@toronto.ca")

        const searchParams = new URLSearchParams(window.location.search)
        const id = searchParams.get("service")
        const nameParam = searchParams.get("name")
        const priceParam = searchParams.get("price")

        if (id) {
          setServiceId(id)

          let foundService = demoServices.find((demoService) => demoService.id === id)

          if (!foundService && nameParam) {
            const decodedName = decodeURIComponent(nameParam)
            foundService = demoServices.find((demoService) => demoService.name === decodedName)
          }

          if (!foundService && nameParam && priceParam) {
            foundService = {
              id,
              name: decodeURIComponent(nameParam),
              description: "Campaign service",
              category: "Services",
              price_monthly: Number.parseFloat(priceParam) || 0,
              price_display: `$${priceParam}/month`,
              features: ["Full service included"],
              popular: true,
            }
          }

          setService(foundService || null)
        }

        setLoading(false)
        return
      }

      if (!hasSupabaseConfig) {
        router.replace("/auth/login?redirect=/candidate-portal/checkout")
        return
      }

      const supabase = createClient()
      
      // Check authentication
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user && !isDemoMode) {
        router.push("/auth/login?redirect=/candidate-portal/checkout")
        return
      }

      if (user) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("user_type")
          .eq("id", user.id)
          .single()

        if (!profileData || profileData.user_type !== "candidate") {
          router.replace(profileData?.user_type === "voter" ? "/voter" : "/")
          return
        }
      }

      // Load user email
      if (user) {
        setEmail(user.email || "")
      } else {
        const demoUser = JSON.parse(localStorage.getItem("tnm-demo-user") || "{}")
        setEmail(demoUser.email || "alex.candidate@toronto.ca")
      }

      // Find service from URL params
      const searchParams = new URLSearchParams(window.location.search)
      const id = searchParams.get("service")
      const nameParam = searchParams.get("name")
      const priceParam = searchParams.get("price")
      
      if (id) {
        setServiceId(id)
        
        // Try to fetch from database first
        const { data: dbService } = await supabase
          .from("services")
          .select("*")
          .eq("id", id)
          .single()
        
        if (dbService) {
          setService({
            id: dbService.id,
            name: dbService.name,
            description: dbService.description || "",
            category: dbService.category || "Services",
            price_monthly: dbService.price || 0,
            price_display: dbService.price_display || `$${(dbService.price / 100).toFixed(0)}/month`,
            features: dbService.features || [],
            popular: dbService.popular || false
          })
        } else {
          // Fallback to demo services
          let foundService = demoServices.find(s => s.id === id)
          
          if (!foundService && nameParam) {
            const decodedName = decodeURIComponent(nameParam)
            foundService = demoServices.find(s => s.name === decodedName)
          }
          
          if (!foundService && nameParam && priceParam) {
            foundService = {
              id: id,
              name: decodeURIComponent(nameParam),
              description: "Campaign service",
              category: "Services",
              price_monthly: Number.parseFloat(priceParam) || 0,
              price_display: `$${priceParam}/month`,
              features: ["Full service included"],
              popular: true
            }
          }
          
          setService(foundService || null)
        }
      }
      
      setLoading(false)
    }
    
    loadData()
  }, [router])

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    return parts.length ? parts.join(" ") : value
  }

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4)
    }
    return v
  }

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === "tnm2026" || promoCode.toLowerCase() === "democracy") {
      setPromoApplied(true)
      setPromoDiscount(20) // 20% off
    }
  }

  const isMonthlyService = (s: Service | null) => {
    if (!s?.price_display) return false
    return s.price_display.toLowerCase().includes("/month") || s.price_display.toLowerCase().includes("monthly")
  }

  const calculateTotal = () => {
    if (!service) return 0
    let price = service.price_monthly || 0
    if (isMonthlyService(service) && billingCycle === "annual") {
      price = (service.price_monthly || 0) * 12 * 0.8 // 20% discount for annual
    }
    if (promoApplied) {
      price = price * (1 - promoDiscount / 100)
    }
    return price
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setProcessing(true)

    try {
      const currentUser = CRMStore.getCurrentUser()
      let user: Awaited<ReturnType<ReturnType<typeof createClient>["auth"]["getUser"]>>["data"]["user"] | null = null
      let supabase: ReturnType<typeof createClient> | null = null

      if (currentUser && currentUser.type !== "candidate") {
        router.replace(currentUser.type === "voter" ? "/voter" : "/")
        setProcessing(false)
        return
      }

      if (hasSupabaseConfig) {
        supabase = createClient()
        const authResponse = await supabase.auth.getUser()
        user = authResponse.data.user
      }

      if (user && service?.id) {
        const { data: profileData } = await supabase!
          .from("profiles")
          .select("user_type")
          .eq("id", user.id)
          .single()

        if (!profileData || profileData.user_type !== "candidate") {
          router.replace(profileData?.user_type === "voter" ? "/voter" : "/")
          setProcessing(false)
          return
        }

        // Create real order via API
        if (!isStaticExport) {
          try {
            const response = await fetch("/api/subscriptions", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                service_id: service.id,
                create_order: true
              })
            })

            const result = await response.json()

            if (!response.ok) {
              console.error("[v0] Order creation failed:", result.error)
            } else {
              console.log("[v0] Order created:", result)
            }
          } catch (error) {
            console.error("[v0] API order creation unavailable, using local fallback:", error)
          }
        }
      }

      // Also save to localStorage for demo compatibility
      const existingServices = JSON.parse(localStorage.getItem("tnm-demo-services") || "[]")
      existingServices.push({
        service_id: service?.id,
        service_name: service?.name,
        subscribed_at: new Date().toISOString(),
        status: "active"
      })
      localStorage.setItem("tnm-demo-services", JSON.stringify(existingServices))

      // Save to CRM store so admin can see it
      const storedCurrentUser = JSON.parse(localStorage.getItem("crm_current_user") || "null")
      if (storedCurrentUser || user) {
        const userName = storedCurrentUser?.name || user?.email?.split("@")[0] || "Anonymous"
        const userId = storedCurrentUser?.id || user?.id || `user-${Date.now()}`
        const userType = "candidate"
        
        // Create order in CRM store
        const crmOrders = JSON.parse(localStorage.getItem("crm_orders") || "[]")
        const newOrder = {
          id: `ord-${Date.now()}`,
          order_number: `ORD-${new Date().getFullYear()}-${String(crmOrders.length + 1).padStart(5, "0")}`,
          user_id: userId,
          user_name: userName,
          user_type: userType,
          items: [{ service_id: service?.id, service_name: service?.name, price_cents: Math.round((service?.price_monthly || 0) * 100) }],
          total_cents: Math.round((service?.price_monthly || 0) * 100),
          status: "completed",
          payment_status: "paid",
          created_at: new Date().toISOString()
        }
        crmOrders.push(newOrder)
        localStorage.setItem("crm_orders", JSON.stringify(crmOrders))

        // Create subscription in CRM store
        const crmSubs = JSON.parse(localStorage.getItem("crm_subscriptions") || "[]")
        const startDate = new Date().toISOString().split("T")[0]
        const nextBilling = new Date()
        nextBilling.setMonth(nextBilling.getMonth() + (billingCycle === "annual" ? 12 : 1))
        const newSub = {
          id: `sub-${Date.now()}`,
          user_id: userId,
          user_name: userName,
          user_type: userType,
          service_id: service?.id,
          service_name: service?.name,
          plan: billingCycle,
          price_cents: Math.round((service?.price_monthly || 0) * 100),
          status: "active",
          start_date: startDate,
          next_billing: nextBilling.toISOString().split("T")[0],
          auto_renew: true
        }
        crmSubs.push(newSub)
        localStorage.setItem("crm_subscriptions", JSON.stringify(crmSubs))
      }

      setSuccess(true)
    } catch (error) {
      console.error("[v0] Checkout error:", error)
      // Still show success for demo purposes
      setSuccess(true)
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05070a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-[#05070a] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Service Not Found</h1>
          <Link href="/candidate-portal/services" className="text-blue-400 hover:underline">
            Browse Services
          </Link>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#05070a] flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">Payment Successful!</h1>
          <p className="text-gray-400 mb-2">Thank you for subscribing to</p>
          <p className="text-xl font-semibold text-blue-400 mb-6">{service.name}</p>
          
          <div className="bg-[#0b0f16] border border-[#1a1f28] rounded-2xl p-6 mb-6 text-left">
            <h3 className="text-sm font-medium text-gray-400 mb-3">ORDER SUMMARY</h3>
            <div className="flex justify-between text-white mb-2">
              <span>{service.name}</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-400 text-sm">
              <span>Billing</span>
              <span>{!isMonthlyService(service) ? "One-time" : billingCycle === "annual" ? "Annual" : "Monthly"}</span>
            </div>
            <div className="border-t border-[#1a1f28] mt-4 pt-4">
              <p className="text-sm text-gray-400">
                Confirmation sent to: <span className="text-white">{email}</span>
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => router.push("/candidate-portal")}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              Go to Dashboard
            </Button>
            <Button
              onClick={() => router.push("/candidate-portal/services")}
              variant="outline"
              className="flex-1 border-[#2a2f38] hover:bg-[#0b0f16]"
            >
              More Services
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#05070a]">
      {/* Header */}
      <div className="border-b border-[#1a1f28]">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Link
            href="/candidate-portal/services"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Services
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-3">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Checkout</h1>
              <p className="text-gray-400">Complete your subscription to {service.name}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Billing Cycle (for monthly services) */}
              {isMonthlyService(service) && (
                <div className="bg-[#0b0f16] border border-[#1a1f28] rounded-2xl p-6">
                  <h2 className="text-lg font-semibold text-white mb-4">Billing Cycle</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setBillingCycle("monthly")}
                      className={`p-4 rounded-xl border-2 transition text-left ${
                        billingCycle === "monthly"
                          ? "border-blue-500 bg-blue-500/10"
                          : "border-[#2a2f38] hover:border-[#3a3f48]"
                      }`}
                    >
                      <div className="text-white font-semibold">${service.price_monthly}/mo</div>
                      <div className="text-gray-400 text-sm">Billed monthly</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setBillingCycle("annual")}
                      className={`p-4 rounded-xl border-2 transition text-left relative ${
                        billingCycle === "annual"
                          ? "border-purple-500 bg-purple-500/10"
                          : "border-[#2a2f38] hover:border-[#3a3f48]"
                      }`}
                    >
                      <div className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">
                        Save 20%
                      </div>
                      <div className="text-white font-semibold">${((service?.price_monthly || 0) * 12 * 0.8).toFixed(0)}/yr</div>
                      <div className="text-gray-400 text-sm">Billed annually</div>
                    </button>
                  </div>
                </div>
              )}

              {/* Contact Information */}
              <div className="bg-[#0b0f16] border border-[#1a1f28] rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Contact Information</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email" className="text-gray-300">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1.5 bg-[#06080c] border-[#2a2f38] text-white"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-[#0b0f16] border border-[#1a1f28] rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-white">Payment Information</h2>
                  <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                    <Lock className="w-3.5 h-3.5" />
                    Secure
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cardName" className="text-gray-300">Name on Card</Label>
                    <Input
                      id="cardName"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="Alex Demo Candidate"
                      className="mt-1.5 bg-[#06080c] border-[#2a2f38] text-white placeholder:text-gray-600"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cardNumber" className="text-gray-300">Card Number</Label>
                    <div className="relative">
                      <Input
                        id="cardNumber"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        placeholder="4242 4242 4242 4242"
                        maxLength={19}
                        className="mt-1.5 bg-[#06080c] border-[#2a2f38] text-white placeholder:text-gray-600 pr-12"
                        required
                      />
                      <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 mt-0.5 w-5 h-5 text-gray-500" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry" className="text-gray-300">Expiry Date</Label>
                      <Input
                        id="expiry"
                        value={expiry}
                        onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                        placeholder="MM/YY"
                        maxLength={5}
                        className="mt-1.5 bg-[#06080c] border-[#2a2f38] text-white placeholder:text-gray-600"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvc" className="text-gray-300">CVC</Label>
                      <Input
                        id="cvc"
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                        placeholder="123"
                        maxLength={4}
                        className="mt-1.5 bg-[#06080c] border-[#2a2f38] text-white placeholder:text-gray-600"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Demo Notice */}
                <div className="mt-4 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                  <p className="text-purple-300 text-sm">
                    <strong>Demo Mode:</strong> Use any card details. Try 4242 4242 4242 4242 for testing.
                  </p>
                </div>
              </div>

              {/* Promo Code */}
              <div className="bg-[#0b0f16] border border-[#1a1f28] rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Promo Code</h2>
                <div className="flex gap-3">
                  <Input
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter promo code"
                    disabled={promoApplied}
                    className="bg-[#06080c] border-[#2a2f38] text-white placeholder:text-gray-600"
                  />
                  <Button
                    type="button"
                    onClick={applyPromoCode}
                    disabled={promoApplied || !promoCode}
                    variant="outline"
                    className="border-[#2a2f38] hover:bg-[#1a1f28] whitespace-nowrap bg-transparent"
                  >
                    {promoApplied ? "Applied!" : "Apply"}
                  </Button>
                </div>
                {promoApplied && (
                  <p className="text-green-400 text-sm mt-2">
                    {promoDiscount}% discount applied!
                  </p>
                )}
                <p className="text-gray-500 text-xs mt-2">Try: TNM2026 or DEMOCRACY</p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={processing}
                className="w-full h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-lg rounded-xl"
              >
                {processing ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Pay ${calculateTotal().toFixed(2)}
                  </span>
                )}
              </Button>

              {/* Security Badges */}
              <div className="flex items-center justify-center gap-6 text-gray-500 text-sm">
                <div className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4" />
                  SSL Encrypted
                </div>
                <div className="flex items-center gap-1.5">
                  <Lock className="w-4 h-4" />
                  Secure Checkout
                </div>
              </div>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-2">
            <div className="sticky top-8">
              <div className="bg-[#0b0f16] border border-[#1a1f28] rounded-2xl overflow-hidden">
                {/* Service Header */}
                <div className="p-6 border-b border-[#1a1f28]">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{service.name}</h3>
                      <p className="text-gray-400 text-sm">{service.category}</p>
                      {service.popular && (
                        <div className="inline-flex items-center gap-1 mt-2 text-xs text-amber-400">
                          <Star className="w-3 h-3 fill-amber-400" />
                          Popular Choice
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="p-6 border-b border-[#1a1f28]">
                  <h4 className="text-sm font-medium text-gray-400 mb-3">WHAT&apos;S INCLUDED</h4>
                  <ul className="space-y-2.5">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2.5 text-gray-300 text-sm">
                        <div className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                          <Check className="w-2.5 h-2.5 text-green-500" />
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Price Breakdown */}
                <div className="p-6">
                  <h4 className="text-sm font-medium text-gray-400 mb-4">ORDER SUMMARY</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between text-gray-300">
                      <span>{service.name}</span>
                      <span>
${isMonthlyService(service) && billingCycle === "annual"
                          ? ((service?.price_monthly || 0) * 12).toFixed(2)
                          : (service?.price_monthly || 0).toFixed(2)}
                      </span>
                    </div>
                    
                    {isMonthlyService(service) && billingCycle === "annual" && (
                      <div className="flex justify-between text-green-400">
                        <span>Annual discount (20%)</span>
                        <span>-${((service?.price_monthly || 0) * 12 * 0.2).toFixed(2)}</span>
                      </div>
                    )}

                    {promoApplied && (
                      <div className="flex justify-between text-green-400">
                        <span>Promo ({promoDiscount}% off)</span>
                        <span>
                          -${(
                            (isMonthlyService(service) && billingCycle === "annual"
                              ? (service?.price_monthly || 0) * 12 * 0.8
                              : (service?.price_monthly || 0)) * (promoDiscount / 100)
                          ).toFixed(2)}
                        </span>
                      </div>
                    )}

                    <div className="border-t border-[#1a1f28] pt-3 mt-3">
                      <div className="flex justify-between text-white font-semibold text-lg">
                        <span>Total</span>
                        <span>${calculateTotal().toFixed(2)}</span>
                      </div>
                      <p className="text-gray-500 text-xs mt-1">
                        {service.price_monthly_type === "one-time" 
                          ? "One-time payment" 
                          : billingCycle === "annual" 
                            ? "Billed annually" 
                            : "Billed monthly"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Guarantee */}
              <div className="mt-4 p-4 bg-[#0b0f16] border border-[#1a1f28] rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-white font-medium">30-Day Guarantee</p>
                    <p className="text-gray-400 text-sm">Full refund if not satisfied</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const dynamic = "force-static"
