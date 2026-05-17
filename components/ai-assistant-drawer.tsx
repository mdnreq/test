"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Send, Bot, Lightbulb, MapPin, Target, Users, TrendingUp, X } from "lucide-react"
import { CAMPAIGN_SERVICE_CATALOG, PUBLIC_SERVICE_STACKS } from "@/lib/campaign-system"
import { CAMPAIGN_PACKAGE_PRESETS } from "@/lib/campaign-package-presets"

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

interface AIRecommendation {
  package: (typeof CAMPAIGN_PACKAGE_PRESETS)[0]
  tier: "top" | "lean"
  coreServiceIds: string[]
  launchServiceIds: string[]
  recommendedAddOnIds: string[]
}

interface AIAssistantDrawerProps {
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function AIAssistantDrawer({ trigger, open: controlledOpen, onOpenChange }: AIAssistantDrawerProps) {
  const [open, setOpen] = useState(controlledOpen ?? false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hi! 👋 I'm your Campaign Service AI Assistant. I'll help you find the perfect services and package for your municipal campaign.\n\nTo get started, tell me:\n1. **Mayor or Councillor?**\n2. **Your region/municipality?**\n3. **Target voter count?**\n4. **Campaign budget?**\n5. **Your main goals?** (brand awareness, turnout, fundraising, etc.)",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [profile, setProfile] = useState<CandidateProfile>({})
  const [recommendation, setRecommendation] = useState<AIRecommendation | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Handle controlled open state
  useEffect(() => {
    if (controlledOpen !== undefined) {
      setOpen(controlledOpen)
    }
  }, [controlledOpen])

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    onOpenChange?.(newOpen)
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const analyzeMessage = (userMessage: string): { response: string; updated: boolean } => {
    const lowerMessage = userMessage.toLowerCase()
    let updated = false

    // Extract office type
    if (lowerMessage.includes("mayor")) {
      setProfile((p) => ({ ...p, officeType: "mayor" }))
      updated = true
    } else if (lowerMessage.includes("councillor") || lowerMessage.includes("council")) {
      setProfile((p) => ({ ...p, officeType: "councillor" }))
      updated = true
    }

    // Extract region
    const regionMatch = userMessage.match(/(?:in|at|from)\s+([A-Za-z\s]+?)(?:\.|,|$)/i)
    if (regionMatch) {
      setProfile((p) => ({ ...p, region: regionMatch[1].trim() }))
      updated = true
    }

    // Extract voter count
    const voterMatch = userMessage.match(/(\d{1,3}(?:,\d{3})*|\d+)\s*(?:voters|residents|people)?/i)
    if (voterMatch) {
      const voterCount = parseInt(voterMatch[1].replace(/,/g, ""))
      if (voterCount > 100) {
        setProfile((p) => ({ ...p, voterCount }))
        updated = true
      }
    }

    // Extract budget
    const budgetMatch = userMessage.match(/\$?(\d+)(?:k|K)?(?:\s*(?:to|-)\s*\$?(\d+)(?:k|K)?)?/i)
    if (budgetMatch) {
      let budget = parseInt(budgetMatch[1])
      if (userMessage.toLowerCase().includes("k")) budget *= 1000
      setProfile((p) => ({ ...p, budget }))
      updated = true
    }

    let response = ""

    // Check if we have enough info to generate recommendations
    const hasEnoughInfo = profile.officeType && profile.voterCount && profile.budget

    if (hasEnoughInfo) {
      response = generateRecommendations()
    } else if (profile.officeType) {
      if (!profile.region) response = `Got it, **${profile.officeType}**! What region are you in?`
      else if (!profile.voterCount) response = `**${profile.region}** - got it! How many voters in your target area?`
      else if (!profile.budget) response = `**${profile.voterCount.toLocaleString()}** voters - perfect! What's your total campaign budget?`
    } else {
      response = `I need to know: Are you running for **Mayor** or **Councillor**?`
    }

    return { response, updated }
  }

  const generateRecommendations = (): string => {
    const { officeType, voterCount = 0, budget = 0 } = profile

    // Determine tier based on budget and voter count
    const tier = budget >= 50000 || voterCount >= 100000 ? "top" : "lean"

    // Find matching package
    const matchedPackage = CAMPAIGN_PACKAGE_PRESETS.find(
      (p) => p.officeType === officeType && p.tier === tier
    )

    if (!matchedPackage) {
      return "I couldn't find a matching package. Can you clarify your office type?"
    }

    // Build recommendation with all service IDs
    const rec: AIRecommendation = {
      package: matchedPackage,
      tier,
      coreServiceIds: matchedPackage.mustHaveMonthlyRetainers,
      launchServiceIds: matchedPackage.oneTimeLaunchWork,
      recommendedAddOnIds: matchedPackage.recommendedAddOns.slice(0, 3),
    }

    setRecommendation(rec)

    const response = `## 🎯 Perfect Match Found!\n\n**${matchedPackage.label}** for your campaign:\n\n` +
      `- **Office:** ${officeType}\n` +
      `- **Tier:** ${tier === "top" ? "🏆 Premium" : "💡 Lean & Efficient"}\n` +
      `- **Voter Base:** ${voterCount?.toLocaleString()}\n` +
      `- **Budget:** $${budget?.toLocaleString()}\n` +
      `- **Duration:** ${matchedPackage.cycleMonths} months\n` +
      `- **Monthly Cost:** $${(matchedPackage.monthlyCore / 100).toLocaleString()}\n\n` +
      `**${matchedPackage.description}**\n\n` +
      `Ready to get started? Create your account below and we'll pre-load all recommended services.`

    return response
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])

    const { response } = analyzeMessage(input)
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: response,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, assistantMessage])
    setInput("")
  }

  // Encode recommendation data for URL
  const encodeRecommendation = () => {
    if (!recommendation) return ""
    return btoa(
      JSON.stringify({
        packageId: recommendation.package.id,
        tier: recommendation.tier,
        coreServices: recommendation.coreServiceIds,
        launchServices: recommendation.launchServiceIds,
        addOnServices: recommendation.recommendedAddOnIds,
      })
    )
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        {trigger || (
          <Button className="fixed bottom-6 right-6 h-16 w-16 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg flex items-center justify-center z-40">
            <Bot className="h-8 w-8" />
          </Button>
        )}
      </SheetTrigger>

      <SheetContent side="right" className="w-full sm:w-[600px] bg-[#05070a] border-l border-white/10 flex flex-col p-0">
        <SheetHeader className="border-b border-white/10 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bot className="h-5 w-5 text-blue-400" />
              <SheetTitle className="text-white">Campaign AI Assistant</SheetTitle>
            </div>
            <button onClick={() => handleOpenChange(false)} className="text-white/60 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex gap-3 ${message.role === "assistant" ? "" : "justify-end"}`}>
                {message.role === "assistant" && (
                  <div className="h-7 w-7 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-blue-400" />
                  </div>
                )}
                <div
                  className={`max-w-xs px-4 py-3 rounded-lg text-sm whitespace-pre-wrap ${
                    message.role === "assistant"
                      ? "bg-white/5 border border-white/10 text-white/80"
                      : "bg-blue-600 text-white"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Profile Summary */}
          {Object.keys(profile).length > 0 && (
            <div className="border-t border-white/10 px-6 py-3 bg-white/5">
              <div className="grid grid-cols-2 gap-2 text-xs">
                {profile.officeType && (
                  <div className="flex items-center gap-2">
                    <Target className="h-3 w-3 text-blue-400" />
                    <span className="text-white/70 capitalize">{profile.officeType}</span>
                  </div>
                )}
                {profile.region && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3 w-3 text-blue-400" />
                    <span className="text-white/70">{profile.region}</span>
                  </div>
                )}
                {profile.voterCount && (
                  <div className="flex items-center gap-2">
                    <Users className="h-3 w-3 text-blue-400" />
                    <span className="text-white/70">{profile.voterCount.toLocaleString()}</span>
                  </div>
                )}
                {profile.budget && (
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-3 w-3 text-blue-400" />
                    <span className="text-white/70">${profile.budget.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Recommendation Card */}
          {recommendation && (
            <div className="border-t border-white/10 px-6 py-4 bg-blue-500/10 border-l-4 border-l-blue-500">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="h-4 w-4 text-blue-400" />
                <p className="text-xs font-semibold text-blue-300 uppercase">Recommended Package</p>
              </div>
              <p className="text-sm font-semibold text-white mb-1">{recommendation.package.label}</p>
              <p className="text-xs text-white/70 mb-3">{recommendation.package.description}</p>
              <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-xs h-8">
                <Link href={`/auth/sign-up?rec=${encodeRecommendation()}`}>Create Account with Services</Link>
              </Button>
            </div>
          )}

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="border-t border-white/10 px-6 py-4 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tell me about your campaign..."
              className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-blue-500/50"
            />
            <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700 h-9">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  )
}
