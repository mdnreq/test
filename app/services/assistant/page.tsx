"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CAMPAIGN_SERVICE_CATALOG, PUBLIC_SERVICE_STACKS } from "@/lib/campaign-system"
import { CAMPAIGN_PACKAGE_PRESETS } from "@/lib/campaign-package-presets"
import { Send, Bot, Lightbulb, TrendingUp, Users, MapPin, Target } from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface CandidateProfile {
  officeType?: "mayor" | "councillor"
  region?: string
  voterCount?: number
  budget?: number
  goals?: string[]
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hi! 👋 I'm your Campaign Service AI Assistant. I'm here to help you find the perfect services, stacks, and packages for your municipal campaign.\n\nTo get started, could you tell me:\n\n1. **What position are you running for?** (Mayor or Councillor)\n2. **What region/municipality are you in?**\n3. **How many voters are in your target area?**\n4. **What's your approximate campaign budget?**\n5. **What are your top campaign goals?** (e.g., brand awareness, voter turnout, fundraising, etc.)\n\nThe more details you share, the better I can tailor recommendations to maximize your campaign's impact while optimizing your investment.",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [profile, setProfile] = useState<CandidateProfile>({})
  const [recommendations, setRecommendations] = useState<{
    packages: typeof CAMPAIGN_PACKAGE_PRESETS
    stacks: typeof PUBLIC_SERVICE_STACKS
    services: typeof CAMPAIGN_SERVICE_CATALOG
  } | null>(null)

  const analyzeMessage = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()

    // Extract office type
    if (lowerMessage.includes("mayor")) {
      setProfile((p) => ({ ...p, officeType: "mayor" }))
    } else if (lowerMessage.includes("councillor") || lowerMessage.includes("council")) {
      setProfile((p) => ({ ...p, officeType: "councillor" }))
    }

    // Extract region/municipality
    const regionMatch = userMessage.match(
      /(?:in|at|from|for)\s+([A-Z][a-zA-Z\s]+(?:municipality|city|ward|district|area))/i,
    )
    if (regionMatch) {
      setProfile((p) => ({ ...p, region: regionMatch[1] }))
    }

    // Extract voter count
    const voterMatch = userMessage.match(/(\d{1,3}(?:,\d{3})*|\d+)\s*(?:voters|residents|people)/i)
    if (voterMatch) {
      const voterCount = parseInt(voterMatch[1].replace(/,/g, ""))
      setProfile((p) => ({ ...p, voterCount }))
    }

    // Extract budget
    const budgetMatch = userMessage.match(/\$?(\d+)(?:k|K)?(?:\s*(?:to|-)\s*\$?(\d+)(?:k|K)?)?/i)
    if (budgetMatch) {
      let budget = parseInt(budgetMatch[1])
      if (userMessage.toLowerCase().includes("k")) budget *= 1000
      setProfile((p) => ({ ...p, budget }))
    }

    // Generate AI response based on profile
    let response = ""

    if (profile.officeType && profile.region && profile.voterCount && profile.budget) {
      // Generate recommendations
      response = generateRecommendations()
    } else if (profile.officeType) {
      response = `Great! So you're running for **${profile.officeType}**. `
      if (!profile.region) response += "What region or municipality are you campaigning in?"
      else if (!profile.voterCount) response += "How many voters are in your target area?"
      else if (!profile.budget) response += "What's your total campaign budget?"
    } else {
      response =
        "I notice you mentioned a few details, but I need to clarify your office position. Are you running for **Mayor** or **Councillor**?"
    }

    return response
  }

  const generateRecommendations = (): string => {
    const { officeType, voterCount = 0, budget = 0 } = profile

    // Match package
    let recommendedPackage = CAMPAIGN_PACKAGE_PRESETS.find((p) => {
      const isSameOffice = p.officeType === officeType
      const isBudgetFit = budget >= p.monthlyCore * (p.cycleMonths / 12)
      return isSameOffice && isBudgetFit
    })

    // If no exact match, recommend closest tier
    if (!recommendedPackage) {
      recommendedPackage = CAMPAIGN_PACKAGE_PRESETS.find((p) => p.officeType === officeType && p.tier === "lean")
    }

    // Get relevant stacks
    const relevantStacks = PUBLIC_SERVICE_STACKS.slice(0, 5)

    // Get high-ROI services
    const highROIServices = CAMPAIGN_SERVICE_CATALOG.filter((s) => s.popular).slice(0, 6)

    setRecommendations({
      packages: recommendedPackage ? [recommendedPackage] : [],
      stacks: relevantStacks,
      services: highROIServices,
    })

    let response = `## 🎯 My Recommendations for You\n\n`

    if (recommendedPackage) {
      response += `### 📦 Recommended Package: **${recommendedPackage.label}**\n`
      response += `${recommendedPackage.description}\n\n`
      response += `- **Duration:** ${recommendedPackage.cycleMonths} months\n`
      response += `- **Monthly Core:** $${(recommendedPackage.monthlyCore / 100).toLocaleString()}\n`
      response += `- **Best for:** ${recommendedPackage.profileSummary}\n\n`
    }

    response += `### 🏗️ Key Campaign Stacks\n`
    response += `Based on your ${officeType} campaign targeting ${voterCount?.toLocaleString()} voters, I recommend focusing on:\n\n`
    relevantStacks.slice(0, 3).forEach((stack) => {
      response += `- **${stack.title}** - ${stack.description.substring(0, 60)}...\n`
    })

    response += `\n### 💡 High-Impact Services to Consider\n`
    response += `These services offer excellent ROI for your voter count and budget:\n\n`
    highROIServices.slice(0, 3).forEach((service) => {
      response += `- **${service.name}** (${service.price_display}) - ${service.description.substring(0, 50)}...\n`
    })

    response += `\n---\n\n**Would you like me to:**\n1. Deep-dive into specific services?\n2. Show you alternative package options?\n3. Compare stacks for different campaign focuses?\n4. Help you prioritize services within your budget?`

    return response
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])

    // Generate AI response
    const aiResponse = analyzeMessage(input)
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: aiResponse,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, assistantMessage])
    setInput("")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-white/10 bg-gradient-to-br from-blue-950/30 via-purple-950/30 to-transparent px-6 py-12">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center gap-3 mb-4">
            <Bot className="h-8 w-8 text-blue-400" />
            <h1 className="text-3xl font-bold text-white">Campaign Service AI Assistant</h1>
          </div>
          <p className="text-white/70 text-lg">
            Get personalized service recommendations based on your campaign goals, region, budget, and target voters.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Chat Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Messages */}
            <div className="rounded-2xl border border-white/10 bg-[#0b0f16] p-6 h-[600px] overflow-y-auto space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === "assistant" ? "" : "justify-end"}`}
                >
                  {message.role === "assistant" && (
                    <div className="h-8 w-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-blue-400" />
                    </div>
                  )}
                  <div
                    className={`max-w-sm px-4 py-3 rounded-xl ${
                      message.role === "assistant"
                        ? "bg-white/5 border border-white/10 text-white/80"
                        : "bg-blue-600 text-white"
                    }`}
                  >
                    <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Tell me about your campaign..."
                className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-blue-500/50"
              />
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 px-4">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>

          {/* Profile & Recommendations Sidebar */}
          <div className="space-y-4">
            {/* Profile Summary */}
            {Object.keys(profile).length > 0 && (
              <div className="rounded-2xl border border-white/10 bg-[#0b0f16] p-4">
                <p className="text-xs text-white/50 uppercase font-semibold mb-3">Your Profile</p>
                <div className="space-y-2 text-sm">
                  {profile.officeType && (
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-blue-400" />
                      <span className="text-white capitalize">{profile.officeType}</span>
                    </div>
                  )}
                  {profile.region && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-blue-400" />
                      <span className="text-white">{profile.region}</span>
                    </div>
                  )}
                  {profile.voterCount && (
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-400" />
                      <span className="text-white">{profile.voterCount.toLocaleString()} voters</span>
                    </div>
                  )}
                  {profile.budget && (
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-blue-400" />
                      <span className="text-white">${profile.budget.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {recommendations && recommendations.packages.length > 0 && (
              <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="h-4 w-4 text-blue-400" />
                  <p className="text-xs text-blue-300 uppercase font-semibold">Recommended Package</p>
                </div>
                <div className="space-y-2">
                  {recommendations.packages.map((pkg) => (
                    <div key={pkg.id}>
                      <p className="font-semibold text-white">{pkg.label}</p>
                      <p className="text-xs text-white/70 mt-1">{pkg.description}</p>
                      <Button asChild className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-xs">
                        <Link href={`/auth/sign-up?template=${pkg.id}`}>Get Started</Link>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Links */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-2">
              <p className="text-xs text-white/60 uppercase font-semibold">Quick Links</p>
              <Link
                href="/services/catalog"
                className="block text-sm text-blue-400 hover:text-blue-300 transition"
              >
                View All Services →
              </Link>
              <Link
                href="/packages/compare"
                className="block text-sm text-blue-400 hover:text-blue-300 transition"
              >
                Compare Packages →
              </Link>
              <Link
                href="/services"
                className="block text-sm text-blue-400 hover:text-blue-300 transition"
              >
                Browse Stacks →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
