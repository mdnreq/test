import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { AnimatedServiceBackground } from "@/components/animated-service-background"
import { CAMPAIGN_SERVICE_CATALOG, PUBLIC_SERVICE_STACKS, getCampaignServicesForStack, slugifyCampaignLabel } from "@/lib/campaign-system"
import { CAMPAIGN_PACKAGE_PRESETS } from "@/lib/campaign-package-presets"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { AlertCircle, Briefcase } from "lucide-react"

const PUBLIC_SHEET_CLASS = "overflow-y-auto border-white/10 bg-[#05070a] w-[97vw] sm:w-[94vw] md:w-[86vw] lg:w-[78vw] xl:w-[70vw] max-w-[1280px]"

type CatalogView = "all" | "services" | "packages" | "stacks"

const CATALOG_VIEW_OPTIONS: Array<{ value: CatalogView; label: string; summary: string }> = [
  { value: "all", label: "Everything", summary: "Services, stacks, and packages together." },
  { value: "services", label: "Individual Services", summary: "Browse every service card." },
  { value: "packages", label: "Campaign Packages", summary: "See the bundled examples only." },
  { value: "stacks", label: "Campaign Stacks", summary: "Review the stack layer." },
]

function resolveCatalogView(value?: string): CatalogView {
  return CATALOG_VIEW_OPTIONS.some((option) => option.value === value) ? (value as CatalogView) : "all"
}

export default async function ServicesCatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>
}) {
  const params = await searchParams
  const activeView: CatalogView = resolveCatalogView(params.view)
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let isVerifiedCandidate = false
  if (user) {
    const { data: candidate } = await supabase.from("candidates").select("verified").eq("user_id", user.id).single()
    isVerifiedCandidate = candidate?.verified === true
  }

  const services = CAMPAIGN_SERVICE_CATALOG
  const allPackageCards = CAMPAIGN_PACKAGE_PRESETS.map((preset) => {
    const includedServiceCount = preset.mustHaveMonthlyRetainers.length + preset.oneTimeLaunchWork.length + preset.recommendedAddOns.length
    const monthlyTotal = preset.mustHaveMonthlyRetainers.reduce((sum, id) => {
      const svc = CAMPAIGN_SERVICE_CATALOG.find(s => s.id === id)
      return sum + (svc?.price_monthly || 0)
    }, 0)
    const launchTotal = preset.oneTimeLaunchWork.reduce((sum, id) => {
      const svc = CAMPAIGN_SERVICE_CATALOG.find(s => s.id === id)
      return sum + (svc?.price_one_time || 0)
    }, 0)
    return { ...preset, includedServiceCount, monthlyTotal, launchTotal }
  })
  // Show ONLY top-tier packages (no Lean)
  const packageCards = allPackageCards.filter(p => p.tier === 'top')
  
  const stackCards = PUBLIC_SERVICE_STACKS.map((stack) => {
    const stackServices = getCampaignServicesForStack(stack.id)
    const relatedPackages = CAMPAIGN_PACKAGE_PRESETS.filter((preset) =>
      preset.coreCampaignStackIds.includes(stack.id) ||
      preset.launchCampaignStackIds.includes(stack.id) ||
      preset.addOnCampaignStackIds.includes(stack.id),
    )
    return { ...stack, stackServices, relatedPackages }
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="border-b border-border bg-gradient-to-b from-blue-950/20 to-background">
        <div className="container mx-auto max-w-6xl px-4 py-20">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-sm uppercase tracking-[0.25em] text-blue-300/80">Public Catalog</p>
            <h1 className="mt-4 text-5xl font-black uppercase tracking-tight text-white">Campaign Services Catalog</h1>
            <p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground">
              Browse individual services, campaign stacks, and bundled package examples all in one place.
            </p>
            {!isVerifiedCandidate && (
              <div className="mx-auto mt-8 max-w-2xl rounded-lg border border-yellow-500/40 bg-yellow-500/10 p-4 text-left">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 h-5 w-5 text-yellow-400" />
                  <div>
                    <p className="font-semibold text-yellow-300">Public browsing only</p>
                    <p className="mt-1 text-sm text-white/70">
                      Candidate checkout requires a verified account.
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href="/services" className="inline-flex items-center rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-white hover:bg-white/10">
                Back To Stacks
              </Link>
              <Link href={isVerifiedCandidate ? "/candidate-portal/services" : "/auth/sign-up"} className="inline-flex items-center rounded-xl bg-white px-5 py-3 font-semibold text-black hover:bg-white/90">
                {isVerifiedCandidate ? "Candidate Workspace" : "Sign Up"}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* View Switcher */}
      <section className="py-8 border-b border-white/10">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex flex-wrap gap-3">
            {CATALOG_VIEW_OPTIONS.map((option) => {
              const active = option.value === activeView
              return (
                <Link
                  key={option.value}
                  href={option.value === "all" ? "/services/catalog" : `/services/catalog?view=${option.value}`}
                  className={`rounded-2xl border px-4 py-3 text-sm transition ${active ? "border-blue-500/40 bg-blue-500/15 text-white" : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"}`}
                >
                  <span className="font-semibold">{option.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto max-w-6xl px-4">
          
          {/* SERVICES SECTION */}
          {(activeView === "all" || activeView === "services") && (
            <div className="mb-20">
              <div className="mb-8">
                <h2 className="text-3xl font-black uppercase text-white">Individual Services</h2>
                <p className="mt-2 text-sm text-muted-foreground">All {services.length} services in the catalog</p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {services.map((service) => (
                  <div key={service.id} className="rounded-2xl border border-white/10 bg-[#0b0f16] p-5 hover:border-white/20 transition">
                    <h3 className="font-bold text-white">{service.name}</h3>
                    <p className="mt-1 text-xs text-white/45">{service.category}</p>
                    <p className="mt-3 text-sm text-white/70">{service.description}</p>
                    <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
                      <span className="text-lg font-bold text-white">{service.price_display}</span>
                      {service.tier && service.tier.length > 0 && (
                        <div className="flex gap-1">
                          {service.tier.includes('top') && <span className="rounded px-2 py-1 text-xs bg-purple-500/20 text-purple-200">Top</span>}
                          {service.tier.includes('lean') && <span className="rounded px-2 py-1 text-xs bg-blue-500/20 text-blue-200">Lean</span>}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STACKS SECTION */}
          {(activeView === "all" || activeView === "stacks") && (
            <div className="mb-20">
              <div className="mb-8">
                <h2 className="text-3xl font-black uppercase text-white">Campaign Stacks</h2>
                <p className="mt-2 text-sm text-muted-foreground">{stackCards.length} stacks group related services</p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {stackCards.map((stack) => (
                  <div key={stack.id} className="rounded-3xl border border-white/10 bg-[#0b0f16] p-6 hover:border-white/20 transition">
                    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${stack.badgeClass}`}>
                      {stack.badge}
                    </span>
                    <h3 className="mt-3 text-2xl font-bold text-white">{stack.title}</h3>
                    <p className="mt-2 text-sm text-white/65">{stack.description}</p>
                    <div className="mt-5 text-sm text-white/55">
                      <p>{stack.stackServices.length} services • {stack.relatedPackages.length} packages</p>
                    </div>
                    <Link
                      href={`/services/stacks/${slugifyCampaignLabel(stack.title)}`}
                      className="mt-5 inline-flex items-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
                    >
                      Open Stack
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PACKAGES SECTION - LAST */}
          {(activeView === "all" || activeView === "packages") && (
            <div>
              <div className="mb-12 rounded-3xl border border-white/15 bg-gradient-to-r from-blue-950/30 to-indigo-950/30 p-8">
                <h2 className="text-4xl font-black uppercase text-white">Campaign Packages</h2>
                <p className="mt-3 text-lg text-white/75">Premium bundles designed for competitive campaigns</p>
                <p className="mt-2 text-sm text-white/50">Only TOP-TIER packages shown • Comprehensive service bundles</p>
              </div>

              {/* MAYOR SECTION */}
              <div className="mb-12">
                <h3 className="text-3xl font-bold text-white mb-6">🏛️ Mayoral Campaigns</h3>
                <div className="grid grid-cols-1 gap-8">
                  {packageCards.filter(p => p.officeType === 'mayor').map((preset) => (
                    <div key={preset.id} className="rounded-3xl border-2 border-purple-500/30 bg-gradient-to-br from-purple-950/40 to-blue-950/40 p-8">
                      {/* TIER BADGE - HUGE AND PROMINENT */}
                      <div className="mb-6 inline-block">
                        <span className="rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 text-2xl font-black uppercase tracking-[0.2em] text-white shadow-lg">
                          ⭐ TOP TIER
                        </span>
                      </div>

                      <h3 className="text-3xl font-black text-white">{preset.label}</h3>
                      <p className="mt-3 text-lg text-white/75">{preset.description}</p>
                      <p className="mt-2 text-sm text-white/50">{preset.cycleMonths} month campaign • {preset.targetRegion}</p>

                      {/* PRICING - LARGE AND CLEAR */}
                      <div className="mt-8 rounded-2xl border-2 border-white/20 bg-white/5 p-6">
                        <p className="text-sm text-white/60 uppercase tracking-wider">Base Monthly Investment</p>
                        <p className="mt-2 text-5xl font-black text-white">
                          ${(preset.monthlyTotal / 100).toLocaleString()}
                          <span className="text-xl text-white/60">/month</span>
                        </p>
                        <p className="mt-3 text-sm text-white/60">
                          Launch Cost: ${(preset.launchTotal / 100).toLocaleString()} (one-time)
                        </p>
                      </div>

                      {/* PACKAGE BREAKDOWN */}
                      <div className="mt-8 grid grid-cols-3 gap-4">
                        <div className="rounded-lg bg-white/5 border border-white/10 p-4">
                          <p className="text-xs text-white/50">Core Services</p>
                          <p className="mt-2 text-2xl font-bold text-white">{preset.mustHaveMonthlyRetainers.length}</p>
                        </div>
                        <div className="rounded-lg bg-white/5 border border-white/10 p-4">
                          <p className="text-xs text-white/50">Launch Work</p>
                          <p className="mt-2 text-2xl font-bold text-white">{preset.oneTimeLaunchWork.length}</p>
                        </div>
                        <div className="rounded-lg bg-white/5 border border-white/10 p-4">
                          <p className="text-xs text-white/50">Add-ons</p>
                          <p className="mt-2 text-2xl font-bold text-white">{preset.recommendedAddOns.length}</p>
                        </div>
                      </div>

                      {/* BUTTONS */}
                      <div className="mt-8 flex gap-4">
                        <Sheet>
                          <SheetTrigger asChild>
                            <button className="rounded-xl border border-white/10 bg-white/10 px-6 py-3 font-semibold text-white hover:bg-white/15">
                              View Full Details
                            </button>
                          </SheetTrigger>
                          <SheetContent className={PUBLIC_SHEET_CLASS}>
                            <SheetHeader className="mb-6">
                              <SheetTitle className="text-white">{preset.label}</SheetTitle>
                              <SheetDescription className="text-white/60">
                                Top-Tier Package • {preset.cycleMonths} months
                              </SheetDescription>
                            </SheetHeader>
                            
                            <div className="space-y-6">
                              <div>
                                <h4 className="font-semibold text-white mb-3">Core Monthly Services</h4>
                                <div className="space-y-2">
                                  {preset.mustHaveMonthlyRetainers.map((id) => {
                                    const svc = CAMPAIGN_SERVICE_CATALOG.find(s => s.id === id)
                                    return svc ? (
                                      <div key={svc.id} className="text-sm p-2 rounded bg-white/5">
                                        <p className="text-white font-medium">{svc.name}</p>
                                        <p className="text-xs text-white/50">{svc.price_display}</p>
                                      </div>
                                    ) : null
                                  })}
                                </div>
                              </div>

                              {preset.oneTimeLaunchWork.length > 0 && (
                                <div>
                                  <h4 className="font-semibold text-white mb-3">Launch Services</h4>
                                  <div className="space-y-2">
                                    {preset.oneTimeLaunchWork.map((id) => {
                                      const svc = CAMPAIGN_SERVICE_CATALOG.find(s => s.id === id)
                                      return svc ? (
                                        <div key={svc.id} className="text-sm p-2 rounded bg-white/5">
                                          <p className="text-white font-medium">{svc.name}</p>
                                          <p className="text-xs text-white/50">{svc.price_display}</p>
                                        </div>
                                      ) : null
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>
                          </SheetContent>
                        </Sheet>
                        <Link
                          href={`/auth/sign-up?template=${preset.id}`}
                          className="rounded-xl bg-white px-6 py-3 font-semibold text-black hover:bg-white/90"
                        >
                          Start Campaign
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* COUNCILLOR SECTION */}
              <div>
                <h3 className="text-3xl font-bold text-white mb-6">🏘️ Councillor Campaigns</h3>
                <div className="grid grid-cols-1 gap-8">
                  {packageCards.filter(p => p.officeType === 'councillor').map((preset) => (
                    <div key={preset.id} className="rounded-3xl border-2 border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 to-blue-950/40 p-8">
                      {/* TIER BADGE - HUGE AND PROMINENT */}
                      <div className="mb-6 inline-block">
                        <span className="rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-3 text-2xl font-black uppercase tracking-[0.2em] text-white shadow-lg">
                          ⭐ TOP TIER
                        </span>
                      </div>

                      <h3 className="text-3xl font-black text-white">{preset.label}</h3>
                      <p className="mt-3 text-lg text-white/75">{preset.description}</p>
                      <p className="mt-2 text-sm text-white/50">{preset.cycleMonths} month campaign • {preset.targetRegion}</p>

                      {/* PRICING - LARGE AND CLEAR */}
                      <div className="mt-8 rounded-2xl border-2 border-white/20 bg-white/5 p-6">
                        <p className="text-sm text-white/60 uppercase tracking-wider">Base Monthly Investment</p>
                        <p className="mt-2 text-5xl font-black text-white">
                          ${(preset.monthlyTotal / 100).toLocaleString()}
                          <span className="text-xl text-white/60">/month</span>
                        </p>
                        <p className="mt-3 text-sm text-white/60">
                          Launch Cost: ${(preset.launchTotal / 100).toLocaleString()} (one-time)
                        </p>
                      </div>

                      {/* PACKAGE BREAKDOWN */}
                      <div className="mt-8 grid grid-cols-3 gap-4">
                        <div className="rounded-lg bg-white/5 border border-white/10 p-4">
                          <p className="text-xs text-white/50">Core Services</p>
                          <p className="mt-2 text-2xl font-bold text-white">{preset.mustHaveMonthlyRetainers.length}</p>
                        </div>
                        <div className="rounded-lg bg-white/5 border border-white/10 p-4">
                          <p className="text-xs text-white/50">Launch Work</p>
                          <p className="mt-2 text-2xl font-bold text-white">{preset.oneTimeLaunchWork.length}</p>
                        </div>
                        <div className="rounded-lg bg-white/5 border border-white/10 p-4">
                          <p className="text-xs text-white/50">Add-ons</p>
                          <p className="mt-2 text-2xl font-bold text-white">{preset.recommendedAddOns.length}</p>
                        </div>
                      </div>

                      {/* BUTTONS */}
                      <div className="mt-8 flex gap-4">
                        <Sheet>
                          <SheetTrigger asChild>
                            <button className="rounded-xl border border-white/10 bg-white/10 px-6 py-3 font-semibold text-white hover:bg-white/15">
                              View Full Details
                            </button>
                          </SheetTrigger>
                          <SheetContent className={PUBLIC_SHEET_CLASS}>
                            <SheetHeader className="mb-6">
                              <SheetTitle className="text-white">{preset.label}</SheetTitle>
                              <SheetDescription className="text-white/60">
                                Top-Tier Package • {preset.cycleMonths} months
                              </SheetDescription>
                            </SheetHeader>
                            
                            <div className="space-y-6">
                              <div>
                                <h4 className="font-semibold text-white mb-3">Core Monthly Services</h4>
                                <div className="space-y-2">
                                  {preset.mustHaveMonthlyRetainers.map((id) => {
                                    const svc = CAMPAIGN_SERVICE_CATALOG.find(s => s.id === id)
                                    return svc ? (
                                      <div key={svc.id} className="text-sm p-2 rounded bg-white/5">
                                        <p className="text-white font-medium">{svc.name}</p>
                                        <p className="text-xs text-white/50">{svc.price_display}</p>
                                      </div>
                                    ) : null
                                  })}
                                </div>
                              </div>

                              {preset.oneTimeLaunchWork.length > 0 && (
                                <div>
                                  <h4 className="font-semibold text-white mb-3">Launch Services</h4>
                                  <div className="space-y-2">
                                    {preset.oneTimeLaunchWork.map((id) => {
                                      const svc = CAMPAIGN_SERVICE_CATALOG.find(s => s.id === id)
                                      return svc ? (
                                        <div key={svc.id} className="text-sm p-2 rounded bg-white/5">
                                          <p className="text-white font-medium">{svc.name}</p>
                                          <p className="text-xs text-white/50">{svc.price_display}</p>
                                        </div>
                                      ) : null
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>
                          </SheetContent>
                        </Sheet>
                        <Link
                          href={`/auth/sign-up?template=${preset.id}`}
                          className="rounded-xl bg-white px-6 py-3 font-semibold text-black hover:bg-white/90"
                        >
                          Start Campaign
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
