"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { CAMPAIGN_PACKAGE_PRESETS } from "@/lib/campaign-package-presets"
import { AnimatedServiceBackground } from "@/components/animated-service-background"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { X } from "lucide-react"

interface FilteredServicesGridProps {
  services: any[]
  isVerifiedCandidate: boolean
  categoryVisualMap: Record<string, any>
  getCategoryVisual: (category: string) => any
  getCampaignStackForService: (service: any) => any
  getCampaignCommercialModel: (service: any) => string
  isOneTimeService: (priceDisplay: string) => boolean
  slugifyCampaignLabel: (label: string) => string
  PUBLIC_SHEET_CLASS: string
}

export function FilteredServicesGrid({
  services,
  isVerifiedCandidate,
  categoryVisualMap,
  getCategoryVisual,
  getCampaignStackForService,
  getCampaignCommercialModel,
  isOneTimeService,
  slugifyCampaignLabel,
  PUBLIC_SHEET_CLASS,
}: FilteredServicesGridProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedModels, setSelectedModels] = useState<string[]>([])
  const [selectedTiers, setSelectedTiers] = useState<string[]>([])
  const [showPopularOnly, setShowPopularOnly] = useState(false)

  const categories = useMemo(() => Array.from(new Set(services.map((s) => s.category))).sort(), [services])
  const models = ["Monthly retainer", "Launch project"]
  const tiers = CAMPAIGN_PACKAGE_PRESETS.map((p) => p.label)

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      // Category filter
      if (selectedCategories.length > 0 && !selectedCategories.includes(service.category)) {
        return false
      }

      // Model filter
      if (selectedModels.length > 0) {
        const isLaunch = isOneTimeService(service.price_display)
        const model = isLaunch ? "Launch project" : "Monthly retainer"
        if (!selectedModels.includes(model)) {
          return false
        }
      }

      // Tier filter
      if (selectedTiers.length > 0) {
        const packageMatches = CAMPAIGN_PACKAGE_PRESETS.filter((preset) =>
          preset.mustHaveMonthlyRetainers.includes(service.id) ||
          preset.oneTimeLaunchWork.includes(service.id) ||
          preset.recommendedAddOns.includes(service.id),
        )
        const presetLabels = packageMatches.map((p) => p.label)
        if (!selectedTiers.some((tier) => presetLabels.includes(tier))) {
          return false
        }
      }

      // Popular filter
      if (showPopularOnly && !service.popular) {
        return false
      }

      return true
    })
  }, [services, selectedCategories, selectedModels, selectedTiers, showPopularOnly])

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) => (prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]))
  }

  const toggleModel = (model: string) => {
    setSelectedModels((prev) => (prev.includes(model) ? prev.filter((m) => m !== model) : [...prev, model]))
  }

  const toggleTier = (tier: string) => {
    setSelectedTiers((prev) => (prev.includes(tier) ? prev.filter((t) => t !== tier) : [...prev, tier]))
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedModels([])
    setSelectedTiers([])
    setShowPopularOnly(false)
  }

  const hasActiveFilters = selectedCategories.length > 0 || selectedModels.length > 0 || selectedTiers.length > 0 || showPopularOnly

  return (
    <div className="space-y-6">
      {/* Filter Section */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-sm font-semibold text-white">Filters</h3>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1 text-xs text-blue-300 hover:text-blue-200"
            >
              <X className="h-3 w-3" />
              Clear all
            </button>
          )}
        </div>

        {/* Category Filter */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-white/70">Category</p>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => toggleCategory(category)}
                className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                  selectedCategories.includes(category)
                    ? "border-blue-500/50 bg-blue-500/20 text-blue-200"
                    : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Model Filter */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-white/70">Type</p>
          <div className="flex flex-wrap gap-2">
            {models.map((model) => (
              <button
                key={model}
                onClick={() => toggleModel(model)}
                className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                  selectedModels.includes(model)
                    ? "border-blue-500/50 bg-blue-500/20 text-blue-200"
                    : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                }`}
              >
                {model}
              </button>
            ))}
          </div>
        </div>

        {/* Tier Filter */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-white/70">Campaign Package</p>
          <div className="flex flex-wrap gap-2">
            {tiers.map((tier) => (
              <button
                key={tier}
                onClick={() => toggleTier(tier)}
                className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                  selectedTiers.includes(tier)
                    ? "border-blue-500/50 bg-blue-500/20 text-blue-200"
                    : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                }`}
              >
                {tier}
              </button>
            ))}
          </div>
        </div>

        {/* Popular Filter */}
        <div className="space-y-2">
          <button
            onClick={() => setShowPopularOnly(!showPopularOnly)}
            className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
              showPopularOnly ? "border-orange-500/50 bg-orange-500/20 text-orange-200" : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
            }`}
          >
            ⭐ Popular Only
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-white/60">
            Showing <span className="font-semibold text-white">{filteredServices.length}</span> of{" "}
            <span className="font-semibold text-white">{services.length}</span> services
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {filteredServices.map((service) => {
            const Icon = service.icon
            const launchProject = isOneTimeService(service.price_display)
            const visual = getCategoryVisual(service.category)
            const stack = getCampaignStackForService(service)
            const commercialModel = getCampaignCommercialModel(service)
            const packageMatches = CAMPAIGN_PACKAGE_PRESETS.filter((preset) =>
              preset.mustHaveMonthlyRetainers.includes(service.id) ||
              preset.oneTimeLaunchWork.includes(service.id) ||
              preset.recommendedAddOns.includes(service.id),
            )

            return (
              <div key={service.id} className={`rounded-3xl border border-white/10 bg-gradient-to-br ${visual.bodyClass} overflow-hidden`}>
                <div className={`relative h-20 overflow-hidden ${visual.headerClass}`}>
                  <AnimatedServiceBackground type={visual.animation} />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50" />
                </div>
                <div className="p-5 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-white/80" />
                    </div>
                    {service.popular && (
                      <span className="rounded-full border border-orange-500/30 bg-orange-500/15 px-2 py-1 text-[11px] font-semibold text-orange-300">
                        Popular
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-white/40">{service.category}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span
                        className={`rounded-full border px-2 py-1 text-[11px] font-semibold ${
                          launchProject ? "border-cyan-500/30 bg-cyan-500/15 text-cyan-300" : "border-green-500/30 bg-green-500/15 text-green-300"
                        }`}
                      >
                        {launchProject ? "Launch project" : "Monthly retainer"}
                      </span>
                      {packageMatches.slice(0, 2).map((preset) => (
                        <span key={`${service.id}-${preset.id}`} className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-white/70">
                          {preset.label}
                        </span>
                      ))}
                    </div>
                    <h3 className="mt-3 text-xl font-bold text-white">{service.name}</h3>
                    <p className="mt-2 text-sm text-white/60">{service.description}</p>
                    <Sheet>
                      <SheetTrigger asChild>
                        <button className="mt-3 inline-flex items-center text-sm font-semibold text-cyan-300 hover:text-cyan-200">
                          View Service Breakdown
                        </button>
                      </SheetTrigger>
                      <SheetContent side="right" className={PUBLIC_SHEET_CLASS}>
                        <SheetHeader className="border-b border-white/10 px-6 py-5">
                          <div className="flex flex-wrap gap-2">
                            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">{service.price_display}</span>
                            <span
                              className={`rounded-full border px-3 py-1 text-xs ${
                                commercialModel === "monthly-retainer" ? "border-green-500/30 bg-green-500/15 text-green-300" : "border-cyan-500/30 bg-cyan-500/15 text-cyan-300"
                              }`}
                            >
                              {commercialModel === "monthly-retainer" ? "Monthly retainer" : "Launch project"}
                            </span>
                            {stack && <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs text-blue-200">Stack: {stack.title}</span>}
                          </div>
                          <SheetTitle className="text-2xl text-white">{service.name}</SheetTitle>
                          <SheetDescription className="text-white/60">{service.description}</SheetDescription>
                        </SheetHeader>

                        <div className="space-y-5 px-6 py-5">
                          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                            <p className="text-sm font-semibold text-white">What's included</p>
                            <div className="mt-4 space-y-3">
                              {service.features.map((feature: string) => (
                                <div key={`${service.id}-sheet-feature-${feature}`} className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white/75">
                                  {feature}
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                            <p className="text-sm font-semibold text-white">Package placement</p>
                            <div className="mt-4 space-y-3">
                              {packageMatches.length > 0
                                ? packageMatches.map((preset) => (
                                    <div key={`${service.id}-sheet-package-${preset.id}`} className="rounded-xl border border-white/10 bg-black/20 p-4">
                                      <p className="font-medium text-white">{preset.label}</p>
                                      <p className="mt-1 text-sm text-white/60">{preset.description}</p>
                                    </div>
                                  ))
                                : <p className="text-sm text-white/60">This service is available individually even when it is not pre-bundled in a campaign template.</p>}
                            </div>
                          </div>
                        </div>
                      </SheetContent>
                    </Sheet>
                  </div>
                  <div className="space-y-1 text-sm text-white/70">
                    {service.features.slice(0, 4).map((feature: string) => (
                      <div key={`${service.id}-${feature}`} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col gap-3 border-t border-white/10 pt-4 sm:grid sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                    <span className="text-xl font-bold leading-tight text-white whitespace-nowrap">{service.price_display}</span>
                    <Link
                      href={isVerifiedCandidate ? `/candidate-portal/checkout?service=${service.id}` : "/auth/sign-up"}
                      className="inline-flex min-h-10 w-full items-center justify-center rounded-xl bg-white px-4 py-2 text-center text-sm font-semibold text-black hover:bg-white/90 sm:min-w-[132px] sm:w-auto"
                    >
                      {launchProject ? "Start Project" : "Start Retainer"}
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {filteredServices.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
            <p className="text-white/60">No services match your filters. Try adjusting your selection.</p>
          </div>
        )}
      </div>
    </div>
  )
}
