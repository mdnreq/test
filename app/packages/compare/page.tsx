"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Check, X, ChevronDown, Zap, Mail, Phone } from "lucide-react"
import { CAMPAIGN_PACKAGE_PRESETS } from "@/lib/campaign-package-presets"
import { CAMPAIGN_SERVICE_CATALOG } from "@/lib/campaign-system"

interface PackageComparison {
  id: string
  name: string
  target: string
  voters: string
  cycleMonths: number
  monthlyCore: number
  launchCost: number
  totalValue: number
  bestFor: string
  color: string
  highlight: boolean
}

export default function PackageComparePage() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>("core")

  // Get service by ID
  const getService = (id: string) => CAMPAIGN_SERVICE_CATALOG.find(s => s.id === id)

  // Package comparison data
  const packages: PackageComparison[] = [
    {
      id: "lean-mayor",
      name: "Lean Mayor",
      target: "Regional City",
      voters: "65,000",
      cycleMonths: 5,
      monthlyCore: 5775,
      launchCost: 2590,
      totalValue: 33460,
      bestFor: "Challenger in smaller cities",
      color: "bg-blue-500/10 border-blue-500/30",
      highlight: false,
    },
    {
      id: "top-tier-mayor",
      name: "Top-Tier Mayor",
      target: "Major City",
      voters: "450,000",
      cycleMonths: 6,
      monthlyCore: 7890,
      launchCost: 5990,
      totalValue: 62920,
      bestFor: "Incumbent or competitive race",
      color: "bg-purple-500/10 border-purple-500/30",
      highlight: true,
    },
    {
      id: "lean-councillor",
      name: "Lean Councillor",
      target: "Neighbourhood",
      voters: "9,000",
      cycleMonths: 5,
      monthlyCore: 4575,
      launchCost: 2590,
      totalValue: 27460,
      bestFor: "Local ward challenger",
      color: "bg-cyan-500/10 border-cyan-500/30",
      highlight: false,
    },
    {
      id: "top-tier-councillor",
      name: "Top-Tier Councillor",
      target: "Urban Ward",
      voters: "22,000",
      cycleMonths: 6,
      monthlyCore: 7275,
      launchCost: 10985,
      totalValue: 54635,
      bestFor: "Competitive ward incumbent",
      color: "bg-emerald-500/10 border-emerald-500/30",
      highlight: true,
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-gradient-to-br from-blue-950/30 via-purple-950/30 to-transparent px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
            <div className="flex-1">
              <h1 className="text-4xl font-bold">Campaign Package Comparison</h1>
              <p className="mt-3 text-xl text-white/70">
                Find the perfect package for your municipal campaign. Compare features, pricing, and services side-by-side.
              </p>
            </div>
            <Link
              href="/services/assistant"
              className="inline-flex items-center rounded-xl border border-purple-500/30 bg-purple-500/10 px-4 py-3 text-sm font-semibold text-purple-300 hover:bg-purple-500/20 whitespace-nowrap"
            >
              💡 AI Service Assistant
            </Link>
          </div>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="mx-auto max-w-7xl px-6 py-16">
        {/* Package Cards Overview */}
        <div className="mb-12 grid gap-6 lg:grid-cols-2">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative rounded-2xl border p-6 transition-all ${pkg.color} ${
                pkg.highlight ? "ring-2 ring-amber-500/50" : ""
              }`}
            >
              {pkg.highlight && (
                <div className="absolute -top-3 right-4 inline-flex items-center rounded-full bg-amber-500/20 border border-amber-500/50 px-3 py-1 text-xs font-semibold text-amber-300">
                  Popular Choice
                </div>
              )}

              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white">{pkg.name}</h3>
                  <p className="mt-1 text-sm text-white/60">{pkg.target}</p>
                </div>
                <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold whitespace-nowrap ${
                  pkg.id.includes("top")
                    ? "border-purple-500/30 bg-purple-500/15 text-purple-300"
                    : "border-blue-500/30 bg-blue-500/15 text-blue-300"
                }`}>
                  {pkg.id.includes("top") ? "Premium Tier" : "Lean Tier"}
                </span>
              </div>

              <div className="space-y-3 mb-6">
                <div>
                  <p className="text-xs text-white/50 uppercase">Target Voters</p>
                  <p className="text-lg font-semibold text-white">{pkg.voters}</p>
                </div>
                <div>
                  <p className="text-xs text-white/50 uppercase">Campaign Duration</p>
                  <p className="text-lg font-semibold text-white">{pkg.cycleMonths} months</p>
                </div>
                <div className="border-t border-white/10 pt-3">
                  <p className="text-xs text-white/50 uppercase">Total Investment</p>
                  <p className="text-2xl font-bold text-white">
                    ${(pkg.totalValue / 1000).toFixed(1)}k
                  </p>
                  <p className="text-xs text-white/60 mt-1">
                    ${(pkg.monthlyCore / 100).toFixed(0)}/month + ${(pkg.launchCost / 100).toFixed(0)} setup
                  </p>
                </div>
              </div>

              <p className="text-sm text-white/70 mb-6">
                <span className="font-semibold text-white">Best for:</span> {pkg.bestFor}
              </p>

              <div className="flex flex-col gap-3">
                <Button asChild className="flex-1 bg-blue-600 hover:bg-blue-700">
                  <Link href={`/auth/sign-up?template=${pkg.id}`}>Get Started</Link>
                </Button>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="flex-1">
                      Details
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="overflow-y-auto border-white/10 bg-[#05070a] w-[97vw] sm:w-[94vw] md:w-[86vw] lg:w-[78vw] xl:w-[70vw] max-w-[1280px]">
                    <SheetHeader className="mb-6">
                      <SheetTitle className="text-2xl text-white">{pkg.name} - Full Details</SheetTitle>
                      <SheetDescription className="text-white/60">
                        Everything included in this package
                      </SheetDescription>
                    </SheetHeader>

                    {/* Preset details */}
                    {(() => {
                      const preset = CAMPAIGN_PACKAGE_PRESETS.find(p => p.id === pkg.id)
                      if (!preset) return null

                      const coreServices = preset.mustHaveMonthlyRetainers
                        .map(id => getService(id))
                        .filter(Boolean)
                      const launchServices = preset.oneTimeLaunchWork
                        .map(id => getService(id))
                        .filter(Boolean)
                      const addOnServices = preset.recommendedAddOns
                        .map(id => getService(id))
                        .filter(Boolean)

                      return (
                        <div className="space-y-6">
                          {/* Core */}
                          <div>
                            <h4 className="font-semibold text-white mb-3">
                              Monthly Core Services (${(preset.mustHaveMonthlyRetainers.reduce((sum, id) => {
                                const svc = getService(id)
                                return sum + (svc?.price_monthly || 0)
                              }, 0) / 100).toFixed(0)}/month)
                            </h4>
                            <div className="space-y-2">
                              {coreServices.map((svc) => (
                                <div key={svc.id} className="flex justify-between items-start text-sm p-2 rounded bg-white/5 hover:bg-white/10">
                                  <div className="flex-1">
                                    <p className="text-white font-medium">{svc.name}</p>
                                    <p className="text-xs text-white/50 mt-1">{svc.description}</p>
                                  </div>
                                  <span className="whitespace-nowrap text-white/60 ml-2">{svc.price_display}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Launch */}
                          {launchServices.length > 0 && (
                            <div>
                              <h4 className="font-semibold text-white mb-3">One-Time Launch Work</h4>
                              <div className="space-y-2">
                                {launchServices.map((svc) => (
                                  <div key={svc.id} className="flex justify-between items-start text-sm p-2 rounded bg-white/5 hover:bg-white/10">
                                    <div className="flex-1">
                                      <p className="text-white font-medium">{svc.name}</p>
                                      <p className="text-xs text-white/50 mt-1">{svc.description}</p>
                                    </div>
                                    <span className="whitespace-nowrap text-white/60 ml-2">{svc.price_display}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Add-ons */}
                          {addOnServices.length > 0 && (
                            <div>
                              <h4 className="font-semibold text-white mb-3">Popular Add-Ons</h4>
                              <div className="space-y-2">
                                {addOnServices.map((svc) => (
                                  <div key={svc.id} className="flex justify-between items-start text-sm p-2 rounded bg-white/5 hover:bg-white/10">
                                    <div className="flex-1">
                                      <p className="text-white font-medium">{svc.name}</p>
                                      <p className="text-xs text-white/50 mt-1">{svc.description}</p>
                                    </div>
                                    <span className="whitespace-nowrap text-white/60 ml-2">{svc.price_display}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="border-t border-white/10 pt-4 mt-4">
                            <Button className="w-full bg-blue-600 hover:bg-blue-700" asChild>
                              <Link href={`/auth/sign-up?template=${pkg.id}`}>Start with {pkg.name}</Link>
                            </Button>
                          </div>
                        </div>
                      )
                    })()}
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          ))}
        </div>

        {/* Feature Comparison Table */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-8">Feature Comparison</h2>

          <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/5">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="px-6 py-4 text-left font-semibold text-white">Feature</th>
                  {packages.map((pkg) => (
                    <th key={pkg.id} className="px-6 py-4 text-center font-semibold text-white">
                      {pkg.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {/* Campaign Duration */}
                <tr className="hover:bg-white/[0.02]">
                  <td className="px-6 py-4 font-medium text-white">Campaign Duration</td>
                  {packages.map((pkg) => (
                    <td key={pkg.id} className="px-6 py-4 text-center text-white/70">
                      {pkg.cycleMonths} months
                    </td>
                  ))}
                </tr>

                {/* Paid Media */}
                <tr className="hover:bg-white/[0.02]">
                  <td className="px-6 py-4 font-medium text-white">Paid Media Management</td>
                  {packages.map((pkg) => (
                    <td key={pkg.id} className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center justify-center px-2 py-1 rounded text-xs font-semibold ${
                        pkg.name.includes("Top-Tier") ? "bg-purple-500/20 text-purple-300" : "bg-blue-500/20 text-blue-300"
                      }`}>
                        {pkg.name.includes("Top-Tier") ? "Elite" : "Standard"}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Voter Data */}
                <tr className="hover:bg-white/[0.02]">
                  <td className="px-6 py-4 font-medium text-white">Voter Database</td>
                  {packages.map((pkg) => (
                    <td key={pkg.id} className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center justify-center px-2 py-1 rounded text-xs font-semibold ${
                        pkg.name.includes("Top-Tier") ? "bg-emerald-500/20 text-emerald-300" : "bg-cyan-500/20 text-cyan-300"
                      }`}>
                        {pkg.name.includes("Top-Tier") ? "1M+ Records" : "100K/mo"}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Video Production */}
                <tr className="hover:bg-white/[0.02]">
                  <td className="px-6 py-4 font-medium text-white">Video Production</td>
                  {packages.map((pkg) => (
                    <td key={pkg.id} className="px-6 py-4 text-center text-white/70">
                      {pkg.name.includes("Top-Tier") ? "4K, Unlimited" : "HD, 2-3/month"}
                    </td>
                  ))}
                </tr>

                {/* Analytics */}
                <tr className="hover:bg-white/[0.02]">
                  <td className="px-6 py-4 font-medium text-white">Analytics Dashboard</td>
                  {packages.map((pkg) => (
                    <td key={pkg.id} className="px-6 py-4 text-center">
                      {pkg.name.includes("Top-Tier") ? <Check className="mx-auto w-5 h-5 text-green-400" /> : <X className="mx-auto w-5 h-5 text-white/30" />}
                    </td>
                  ))}
                </tr>

                {/* Website */}
                <tr className="hover:bg-white/[0.02]">
                  <td className="px-6 py-4 font-medium text-white">Campaign Website</td>
                  {packages.map((pkg) => (
                    <td key={pkg.id} className="px-6 py-4 text-center text-white/70">
                      {pkg.name.includes("Top-Tier") ? "Elite + App" : "Enhanced"}
                    </td>
                  ))}
                </tr>

                {/* Support */}
                <tr className="hover:bg-white/[0.02]">
                  <td className="px-6 py-4 font-medium text-white">Dedicated Support</td>
                  {packages.map((pkg) => (
                    <td key={pkg.id} className="px-6 py-4 text-center">
                      {pkg.name.includes("Top-Tier") ? <Check className="mx-auto w-5 h-5 text-green-400" /> : <X className="mx-auto w-5 h-5 text-white/30" />}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 rounded-2xl border border-white/10 bg-gradient-to-r from-blue-950/30 to-purple-950/30 p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Not Sure Which Package Is Right?</h2>
          <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto">
            Our campaign specialists can help you customize a package based on your specific race, budget, and goals.
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <Button className="bg-blue-600 hover:bg-blue-700 gap-2" size="lg">
              <Phone className="w-4 h-4" />
              Schedule a Call
            </Button>
            <Button variant="outline" size="lg" className="gap-2">
              <Mail className="w-4 h-4" />
              Get a Custom Quote
            </Button>
            <Button variant="outline" size="lg" className="gap-2">
              <Zap className="w-4 h-4" />
              Download Comparison
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
