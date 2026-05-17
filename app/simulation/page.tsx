"use client"

export const dynamic = 'force-static'

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, Check, School, Users, Vote, TrendingUp } from "lucide-react"

export default function GenMillennialTurnoutSimulation() {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedMunicipality, setSelectedMunicipality] = useState("Toronto")

  const steps = [
    {
      title: "Gen Z (Age 18-27)",
      icon: Users,
      description: "Digital-native voters responsive to social media campaigns, TikTok civic education, and peer mobilization strategies.",
      stats: { engagement: "72%", reach: "Social First" },
      color: "cyan",
    },
    {
      title: "Millennials (Age 28-43)",
      icon: Vote,
      description: "Established voters with platform experience. Respond to data-driven messaging and community impact stories.",
      stats: { engagement: "88%", reach: "Multi-Platform" },
      color: "blue",
    },
    {
      title: "Digital Mobilization (Peak 2026)",
      icon: TrendingUp,
      description: "Coordinated campaigns across Instagram, TikTok, email, and SMS reach 65% of target cohorts. 1.8x engagement multiplier.",
      stats: { engagement: "65%", reach: "+1.8x" },
      color: "purple",
    },
    {
      title: "Municipal Impact",
      icon: School,
      description: "Combined Gen Z + Millennial turnout drives +9.2% municipal election participation across all provinces.",
      stats: { engagement: "+9.2%", reach: "All Ages" },
      color: "pink",
    },
  ]

  const municipalities = [
    // Ontario
    { name: "Toronto", province: "Ontario", current: 29.2, projected: 35.7 },
    { name: "Ottawa", province: "Ontario", current: 38.1, projected: 44.6 },
    { name: "Mississauga", province: "Ontario", current: 27.8, projected: 34.3 },
    // PEI
    { name: "Charlottetown", province: "PEI", current: 47.1, projected: 53.6 },
    { name: "Summerside", province: "PEI", current: 51.6, projected: 58.1 },
    // Manitoba
    { name: "Winnipeg", province: "Manitoba", current: 46.8, projected: 53.3 },
    { name: "Brandon", province: "Manitoba", current: 43.2, projected: 49.7 },
    // New Brunswick
    { name: "Moncton", province: "New Brunswick", current: 42.1, projected: 48.6 },
    { name: "Saint John", province: "New Brunswick", current: 40.7, projected: 47.2 },
    // British Columbia
    { name: "Vancouver", province: "British Columbia", current: 34.2, projected: 40.7 },
    { name: "Victoria", province: "British Columbia", current: 38.1, projected: 44.6 },
    { name: "Surrey", province: "British Columbia", current: 29.7, projected: 36.2 },
    // Saskatchewan
    { name: "Saskatoon", province: "Saskatchewan", current: 37.1, projected: 43.6 },
    { name: "Regina", province: "Saskatchewan", current: 35.8, projected: 42.3 },
    // Northwest Territories
    { name: "Yellowknife", province: "NWT", current: 39.2, projected: 45.7 },
  ]

  const selected = municipalities.find((m) => m.name === selectedMunicipality) || municipalities[0]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
            Back to Home
          </Link>
          <h1 className="text-5xl font-black tracking-tight mb-4">GEN Z & MILLENNIAL TURNOUT SIMULATION</h1>
          <p className="text-xl text-muted-foreground">
            See how targeted digital campaigns mobilize Gen Z (18-27) and Millennials (28-43) to increase municipal voter turnout by 9.2%
          </p>
        </div>

        {/* Demographic Overview */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-cyan-950/30 border border-cyan-500/20 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-3 w-3 rounded-full bg-cyan-500" />
              <h3 className="font-bold text-lg">Gen Z (Ages 18-27)</h3>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-muted-foreground">Born 1997-2012</p>
              <p className="text-muted-foreground">📱 Digital-first voters who prefer social media</p>
              <p className="text-muted-foreground">📊 Baseline turnout: 36-42% (lower than avg)</p>
              <p className="text-muted-foreground">🎯 Highly responsive to peer mobilization</p>
              <p className="font-semibold text-cyan-400 mt-3">Canada: ~7.2M eligible voters</p>
            </div>
          </div>

          <div className="bg-blue-950/30 border border-blue-500/20 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-3 w-3 rounded-full bg-blue-500" />
              <h3 className="font-bold text-lg">Millennials (Ages 28-43)</h3>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-muted-foreground">Born 1981-1996</p>
              <p className="text-muted-foreground">💼 Established voters with platform familiarity</p>
              <p className="text-muted-foreground">📈 Turnout: 38-45% (near average)</p>
              <p className="text-muted-foreground">👥 Influence family and friend networks</p>
              <p className="font-semibold text-blue-400 mt-3">Canada: ~8.1M eligible voters</p>
            </div>
          </div>
        </div>

        {/* Municipality Selector */}
        <div className="bg-card border rounded-xl p-6 mb-8">
          <label className="block text-sm font-bold mb-4">SELECT MUNICIPALITY - See Gen Z & Millennial Impact on Turnout</label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {municipalities.map((muni) => (
              <button
                key={muni.name}
                onClick={() => setSelectedMunicipality(muni.name)}
                className={`p-4 rounded-lg border-2 transition ${
                  selectedMunicipality === muni.name
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-border hover:border-blue-500/50"
                }`}
              >
                <div className="font-bold text-sm">{muni.name}</div>
                <div className="text-xs text-muted-foreground">{muni.province}</div>
                <div className="text-xs text-muted-foreground mt-1">Current: {muni.current}%</div>
              </button>
            ))}
          </div>
        </div>

        {/* Impact Projection */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-muted/50 border rounded-xl p-8">
            <h3 className="text-lg font-bold mb-4">WITHOUT DIGITAL MOBILIZATION</h3>
            <div className="text-center py-8">
              <div className="text-6xl font-black text-red-500 mb-2">{selected.current}%</div>
              <div className="text-sm text-muted-foreground">Current Municipal Turnout</div>
            </div>
            <div className="h-4 bg-background rounded-full overflow-hidden">
              <div className="h-full bg-red-500 transition-all" style={{ width: `${selected.current}%` }} />
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600/10 to-cyan-600/10 border border-blue-500/20 rounded-xl p-8">
            <h3 className="text-lg font-bold mb-4">WITH GEN Z & MILLENNIAL MOBILIZATION</h3>
            <div className="text-center py-8">
              <div className="text-6xl font-black text-blue-500 mb-2">{selected.projected}%</div>
              <div className="text-sm text-muted-foreground">Projected Turnout (+{(selected.projected - selected.current).toFixed(1)}%)</div>
            </div>
            <div className="h-4 bg-background rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all"
                style={{ width: `${selected.projected}%` }}
              />
            </div>
          </div>
        </div>

        {/* Journey Steps */}
        <div className="mb-12">
          <h2 className="text-3xl font-black mb-8">GEN Z & MILLENNIAL ENGAGEMENT PATHWAY</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = currentStep === index
              return (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={`bg-card border rounded-xl p-6 text-left transition ${
                    isActive
                      ? `border-${step.color}-500 bg-${step.color}-500/10`
                      : "border-border hover:border-blue-500/50"
                  }`}
                >
                  <Icon className={`h-10 w-10 mb-4 ${isActive ? `text-${step.color}-500` : "text-muted-foreground"}`} />
                  <h3 className="font-bold mb-2">{step.title}</h3>
                  <p className="text-xs text-muted-foreground mb-4">{step.description}</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <div className="text-muted-foreground">Engagement</div>
                      <div className="font-bold">{step.stats.engagement}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Reach Type</div>
                      <div className="font-bold">{step.stats.reach}</div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Current Step Detail */}
        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-600/20 rounded-xl p-8 mb-12">
          <div className="flex items-start gap-6">
            {(() => {
              const Icon = steps[currentStep].icon
              return <Icon className="h-16 w-16 text-blue-500 flex-shrink-0" />
            })()}
            <div className="flex-1">
              <h3 className="text-2xl font-black mb-3">{steps[currentStep].title}</h3>
              <p className="text-lg text-muted-foreground mb-4">{steps[currentStep].description}</p>
              <div className="flex gap-6">
                <div>
                  <div className="text-3xl font-black text-blue-500">{steps[currentStep].stats.engagement}</div>
                  <div className="text-sm text-muted-foreground">Engagement Rate</div>
                </div>
                <div>
                  <div className="text-3xl font-black text-purple-500">{steps[currentStep].stats.reach}</div>
                  <div className="text-sm text-muted-foreground">Reach Strategy</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Benefits */}
        <div className="bg-card border rounded-xl overflow-hidden mb-12">
          <div className="border-b p-6">
            <h2 className="text-2xl font-bold">DIGITAL MOBILIZATION BENEFITS</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-px bg-border">
            {[
              {
                title: "Social Media Campaigns",
                description:
                  "TikTok, Instagram, and YouTube shorts reach Gen Z where they are. Short-form video explains local ballot issues in 30-60 seconds.",
              },
              {
                title: "Peer-to-Peer Mobilization",
                description:
                  "Millennials (28-43) with established networks amplify messages to friends and family. Text/email reminders increase turnout 12-15%.",
              },
              {
                title: "Local Impact Storytelling",
                description:
                  "Data-driven narratives show how local elections affect rent, climate, schools. Personal testimonials from Gen Z & Millennial leaders.",
              },
            ].map((benefit, i) => (
              <div key={i} className="bg-card p-6">
                <Check className="h-8 w-8 text-blue-500 mb-4" />
                <h3 className="font-bold mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/governance"
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition"
          >
            Join Gen Z & Millennial Voter Mobilization Initiative
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
