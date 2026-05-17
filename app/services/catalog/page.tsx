import Link from "next/link"

import { createClient } from "@/lib/supabase/server"
import { AnimatedServiceBackground } from "@/components/animated-service-background"
import { CAMPAIGN_SERVICE_CATALOG, PUBLIC_SERVICE_STACKS, getCampaignCommercialModel, getCampaignServicesForStack, getCampaignStackForService, slugifyCampaignLabel } from "@/lib/campaign-system"
import { CAMPAIGN_PACKAGE_PRESETS } from "@/lib/campaign-package-presets"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  AlertCircle,
  BarChart3,
  Briefcase,
  Calendar,
  Eye,
  Globe,
  MessageSquare,
  Scale,
  Search,
  Shield,
  Target,
  Video,
  Zap,
} from "lucide-react"

const categoryIconMap = {
  "Digital Marketing": Target,
  "Content Creation": MessageSquare,
  "Web Development": Globe,
  "Video Production": Video,
  "Email Marketing": Calendar,
  Design: Zap,
  Research: Briefcase,
  Analytics: BarChart3,
  "SEO & Optimization": Search,
  Reputation: Eye,
  "Risk & Crisis": Shield,
} as const

const categoryVisualMap = {
  "Digital Marketing": {
    animation: "digital",
    headerClass: "bg-gradient-to-r from-blue-950 via-indigo-950/80 to-violet-950/60",
    bodyClass: "from-blue-950/35 to-indigo-950/15",
  },
  "Content Creation": {
    animation: "content",
    headerClass: "bg-gradient-to-r from-violet-950 via-fuchsia-950/80 to-purple-950/60",
    bodyClass: "from-violet-950/35 to-fuchsia-950/15",
  },
  "Web Development": {
    animation: "web",
    headerClass: "bg-gradient-to-r from-cyan-950 via-blue-950/80 to-indigo-950/60",
    bodyClass: "from-cyan-950/30 to-blue-950/15",
  },
  "Video Production": {
    animation: "video",
    headerClass: "bg-gradient-to-r from-rose-950 via-red-950/80 to-orange-950/60",
    bodyClass: "from-rose-950/30 to-orange-950/15",
  },
  "Email Marketing": {
    animation: "email",
    headerClass: "bg-gradient-to-r from-lime-950 via-green-950/80 to-emerald-950/60",
    bodyClass: "from-lime-950/30 to-emerald-950/15",
  },
  Design: {
    animation: "design",
    headerClass: "bg-gradient-to-r from-purple-950 via-fuchsia-950/80 to-pink-950/60",
    bodyClass: "from-purple-950/35 to-fuchsia-950/15",
  },
  Research: {
    animation: "research",
    headerClass: "bg-gradient-to-r from-amber-950 via-yellow-950/80 to-lime-950/60",
    bodyClass: "from-amber-950/35 to-lime-950/15",
  },
  Analytics: {
    animation: "analytics",
    headerClass: "bg-gradient-to-r from-emerald-950 via-teal-950/80 to-cyan-950/60",
    bodyClass: "from-emerald-950/35 to-cyan-950/15",
  },
  "SEO & Optimization": {
    animation: "seo",
    headerClass: "bg-gradient-to-r from-sky-950 via-blue-950/80 to-indigo-950/60",
    bodyClass: "from-sky-950/35 to-indigo-950/15",
  },
  Reputation: {
    animation: "reputation",
    headerClass: "bg-gradient-to-r from-indigo-950 via-slate-950/80 to-blue-950/60",
    bodyClass: "from-indigo-950/35 to-slate-950/15",
  },
  "Risk & Crisis": {
    animation: "crisis",
    headerClass: "bg-gradient-to-r from-red-950 via-orange-950/80 to-amber-950/60",
    bodyClass: "from-red-950/35 to-orange-950/15",
  },
} as const

const OFFICIAL_FINANCE_SOURCE_URL = "http://app.toronto.ca/EFD/jsf/main/main.xhtml?campaign=19"

const OLIVIA_CHOW_2023_FINANCE = {
  candidateName: "Olivia Chow",
  election: "2023 Toronto By-Election for Mayor",
  spendingLimitCents: 161675145,
  totalContributionsCents: 161092765,
  totalExpensesCents: 156905568,
  surplusCents: 4189697,
  categories: [
    { label: "Advertising", amountCents: 52611822, mappedService: "Paid media and message distribution" },
    { label: "Brochures / Flyers", amountCents: 4528728, mappedService: "Print collateral and voter literature" },
    { label: "Signs", amountCents: 9810315, mappedService: "Sign program and street visibility" },
    { label: "Meetings Hosted", amountCents: 3176597, mappedService: "Events and stakeholder activations" },
    { label: "Office + Phone + Internet", amountCents: 14251241, mappedService: "Campaign operations infrastructure" },
    { label: "Salaries + Professional Fees", amountCents: 38748839, mappedService: "Staffing, consultants, and specialist execution" },
    { label: "Voting Day Parties / Appreciation", amountCents: 10874648, mappedService: "Election-day engagement and volunteer recognition" },
    { label: "Accounting + Audit", amountCents: 4655293, mappedService: "Compliance and financial reporting support" },
    { label: "Fundraising Event Costs", amountCents: 10451933, mappedService: "Fundraising production and event delivery" },
    { label: "Other + Bank Charges", amountCents: 7796152, mappedService: "Miscellaneous campaign operations" },
  ],
} as const

function isOneTimeService(priceDisplay: string) {
  return /one-time|\/page/i.test(priceDisplay.toLowerCase())
}

function getCategoryVisual(category: string) {
  return categoryVisualMap[category as keyof typeof categoryVisualMap] ?? {
    animation: "analytics",
    headerClass: "bg-gradient-to-r from-slate-950 via-zinc-950/80 to-neutral-950/60",
    bodyClass: "from-slate-950/35 to-zinc-950/15",
  }
}

function formatCurrency(cents: number) {
  return new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(cents / 100)
}

function formatPercent(value: number) {
  return `${value.toFixed(1)}%`
}

const PUBLIC_SHEET_CLASS = "overflow-y-auto border-white/10 bg-[#05070a] w-[97vw] sm:w-[94vw] md:w-[86vw] lg:w-[78vw] xl:w-[70vw] max-w-[1280px]"

type CatalogView = "all" | "services" | "packages" | "stacks"

const CATALOG_VIEW_OPTIONS: Array<{ value: CatalogView; label: string; summary: string }> = [
  { value: "all", label: "Everything", summary: "Stacks, package examples, and individual service cards together." },
  { value: "services", label: "Individual Services", summary: "Browse every service card one by one." },
  { value: "packages", label: "Package Examples", summary: "See the bundled campaign examples only." },
  { value: "stacks", label: "Campaign Stacks", summary: "Review the stack layer without the individual cards." },
]

function resolveCatalogView(value?: string): CatalogView {
  return CATALOG_VIEW_OPTIONS.some((option) => option.value === value) ? (value as CatalogView) : "all"
}

export default async function ServicesCatalogPage() {
  const activeView: CatalogView = "all"
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let isVerifiedCandidate = false

  if (user) {
    const { data: candidate } = await supabase.from("candidates").select("verified").eq("user_id", user.id).single()
    isVerifiedCandidate = candidate?.verified === true
  }

  const services = CAMPAIGN_SERVICE_CATALOG.map((service) => ({
    ...service,
    icon: categoryIconMap[service.category as keyof typeof categoryIconMap] ?? Briefcase,
  }))
  const packageCards = CAMPAIGN_PACKAGE_PRESETS.map((preset) => {
    const includedServiceCount = preset.mustHaveMonthlyRetainers.length + preset.oneTimeLaunchWork.length + preset.recommendedAddOns.length
    const stackTitles = [
      ...preset.coreCampaignStackIds,
      ...preset.launchCampaignStackIds,
      ...preset.addOnCampaignStackIds,
    ].map((stackId) => PUBLIC_SERVICE_STACKS.find((stack) => stack.id === stackId)?.title).filter((title): title is string => Boolean(title))

    return {
      ...preset,
      includedServiceCount,
      stackTitles: Array.from(new Set(stackTitles)),
    }
  })
  const stackCards = PUBLIC_SERVICE_STACKS.map((stack) => {
    const stackServices = getCampaignServicesForStack(stack.id)
    const relatedPackages = CAMPAIGN_PACKAGE_PRESETS.filter((preset) =>
      preset.coreCampaignStackIds.includes(stack.id) ||
      preset.launchCampaignStackIds.includes(stack.id) ||
      preset.addOnCampaignStackIds.includes(stack.id),
    )

    return {
      ...stack,
      stackServices,
      relatedPackages,
    }
  })

  const oliviaBudgetUsage = OLIVIA_CHOW_2023_FINANCE.totalExpensesCents / OLIVIA_CHOW_2023_FINANCE.spendingLimitCents
  const oliviaLargestCategory = OLIVIA_CHOW_2023_FINANCE.categories.reduce((largest, category) =>
    category.amountCents > largest.amountCents ? category : largest,
  )

  return (
    <div className="min-h-screen bg-background">
      <section className="border-b border-border bg-gradient-to-b from-blue-950/20 to-background">
        <div className="container mx-auto max-w-6xl px-4 py-20">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-sm uppercase tracking-[0.25em] text-blue-300/80">Public Catalog</p>
            <h1 className="mt-4 text-5xl font-black uppercase tracking-tight text-white">Full Campaign Services Catalog</h1>
            <p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground">
              This page is the full public catalog of every campaign service card. It is separate from the campaign stacks overview so people can browse the entire service inventory in one place.
            </p>
            {!isVerifiedCandidate && (
              <div className="mx-auto mt-8 max-w-2xl rounded-lg border border-yellow-500/40 bg-yellow-500/10 p-4 text-left">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 h-5 w-5 text-yellow-400" />
                  <div>
                    <p className="font-semibold text-yellow-300">Public browsing only</p>
                    <p className="mt-1 text-sm text-white/70">
                      You can browse every service here. Candidate checkout still requires a verified candidate account.
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href="/services" className="inline-flex items-center rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-white hover:bg-white/10">
                Back To Campaign Stacks
              </Link>
              <Link href={isVerifiedCandidate ? "/candidate-portal/services" : "/auth/sign-up"} className="inline-flex items-center rounded-xl bg-white px-5 py-3 font-semibold text-black hover:bg-white/90">
                {isVerifiedCandidate ? "Open Candidate Workspace Catalog" : "Sign Up As Candidate"}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="rounded-3xl border border-white/10 bg-[#0b0f16] p-6 md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-3xl font-black uppercase text-white">Browse Full Services</h2>
                <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
                  This catalog now lets people switch between individual cards, bundled package examples, and campaign stacks from one public page.
                </p>
              </div>
              <div className="grid min-w-[220px] gap-3 text-sm sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-center">
                  <p className="text-white/45">Individual services</p>
                  <p className="mt-1 text-2xl font-bold text-white">{services.length}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-center">
                  <p className="text-white/45">Package examples</p>
                  <p className="mt-1 text-2xl font-bold text-white">{packageCards.length}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-center">
                  <p className="text-white/45">Campaign stacks</p>
                  <p className="mt-1 text-2xl font-bold text-white">{stackCards.length}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {CATALOG_VIEW_OPTIONS.map((option) => {
                const active = option.value === activeView

                return (
                  <Link
                    key={option.value}
                    href={option.value === "all" ? "/services/catalog" : `/services/catalog?view=${option.value}`}
                    className={`rounded-2xl border px-4 py-3 text-sm transition ${active ? "border-blue-500/40 bg-blue-500/15 text-white" : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"}`}
                  >
                    <span className="block font-semibold">{option.label}</span>
                    <span className="mt-1 block text-xs text-inherit/80">{option.summary}</span>
                  </Link>
                )
              })}
            </div>
          </div>

          {(activeView === "all" || activeView === "packages") && (
            <div className="mt-12">
              <div className="mb-8 flex items-end justify-between gap-4 flex-wrap">
                <div>
                  <h2 className="text-3xl font-black uppercase text-white">Package Examples</h2>
                  <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
                    These are the bundled campaign examples that combine locked retainers, launch work, and optional add-ons.
                  </p>
                </div>
                <p className="text-sm text-white/50">{packageCards.length} examples</p>
              </div>

              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                {packageCards.map((preset) => (
                  <div key={preset.id} className="rounded-3xl border border-white/10 bg-[#0b0f16] p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="max-w-2xl">
                        <h3 className="text-2xl font-bold text-white">{preset.label}</h3>
                        <p className="mt-2 text-sm text-white/65">{preset.description}</p>
                        <p className="mt-3 text-sm text-blue-300">{preset.officeType} campaign • {preset.cycleMonths} months • {preset.targetRegion}</p>
                      </div>
                      <span className="rounded-2xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                        {preset.tier} tier
                      </span>
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                      <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                        <p className="text-xs text-white/45">Core retainers</p>
                        <p className="mt-1 text-2xl font-bold text-white">{preset.mustHaveMonthlyRetainers.length}</p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                        <p className="text-xs text-white/45">Launch items</p>
                        <p className="mt-1 text-2xl font-bold text-white">{preset.oneTimeLaunchWork.length}</p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                        <p className="text-xs text-white/45">Add-ons</p>
                        <p className="mt-1 text-2xl font-bold text-white">{preset.recommendedAddOns.length}</p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                        <p className="text-xs text-white/45">Included services</p>
                        <p className="mt-1 text-2xl font-bold text-white">{preset.includedServiceCount}</p>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2 text-xs">
                      {preset.stackTitles.slice(0, 5).map((title) => (
                        <span key={`${preset.id}-${title}`} className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-blue-200">
                          {title}
                        </span>
                      ))}
                      {preset.stackTitles.length > 5 && (
                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/65">
                          +{preset.stackTitles.length - 5} more stacks
                        </span>
                      )}
                    </div>

                    <p className="mt-5 text-sm text-white/55">{preset.profileSummary}</p>

                    <div className="mt-5 flex flex-wrap gap-3 border-t border-white/10 pt-5">
                      <Sheet>
                        <SheetTrigger asChild>
                          <button className="inline-flex items-center rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white hover:bg-white/10">
                            Open Package Drawer
                          </button>
                        </SheetTrigger>
                        <SheetContent className={PUBLIC_SHEET_CLASS}>
                          <SheetHeader className="mb-6">
                            <SheetTitle>{preset.label} - Full Details</SheetTitle>
                            <SheetDescription className="text-white/60">
                              {preset.description}
                            </SheetDescription>
                          </SheetHeader>

                          <div className="space-y-6">
                            {/* Core Services */}
                            <div>
                              <h4 className="font-semibold text-white mb-3">
                                Monthly Core Services (${(preset.mustHaveMonthlyRetainers.reduce((sum, id) => {
                                  const svc = CAMPAIGN_SERVICE_CATALOG.find(s => s.id === id)
                                  return sum + (svc?.price_monthly || 0)
                                }, 0) / 100).toFixed(0)}/month)
                              </h4>
                              <div className="space-y-2">
                                {preset.mustHaveMonthlyRetainers.map((id) => {
                                  const svc = CAMPAIGN_SERVICE_CATALOG.find(s => s.id === id)
                                  return svc ? (
                                    <div key={svc.id} className="flex justify-between items-start text-sm p-2 rounded bg-white/5 hover:bg-white/10">
                                      <div className="flex-1">
                                        <p className="text-white font-medium">{svc.name}</p>
                                        <p className="text-xs text-white/50 mt-1">{svc.description}</p>
                                      </div>
                                      <span className="whitespace-nowrap text-white/60 ml-2">{svc.price_display}</span>
                                    </div>
                                  ) : null
                                })}
                              </div>
                            </div>

                            {/* Launch Services */}
                            {preset.oneTimeLaunchWork.length > 0 && (
                              <div>
                                <h4 className="font-semibold text-white mb-3">
                                  Launch Services (${(preset.oneTimeLaunchWork.reduce((sum, id) => {
                                    const svc = CAMPAIGN_SERVICE_CATALOG.find(s => s.id === id)
                                    return sum + (svc?.price_one_time || 0)
                                  }, 0) / 100).toFixed(0)} one-time)
                                </h4>
                                <div className="space-y-2">
                                  {preset.oneTimeLaunchWork.map((id) => {
                                    const svc = CAMPAIGN_SERVICE_CATALOG.find(s => s.id === id)
                                    return svc ? (
                                      <div key={svc.id} className="flex justify-between items-start text-sm p-2 rounded bg-white/5 hover:bg-white/10">
                                        <div className="flex-1">
                                          <p className="text-white font-medium">{svc.name}</p>
                                          <p className="text-xs text-white/50 mt-1">{svc.description}</p>
                                        </div>
                                        <span className="whitespace-nowrap text-white/60 ml-2">{svc.price_display}</span>
                                      </div>
                                    ) : null
                                  })}
                                </div>
                              </div>
                            )}

                            {/* Add-ons */}
                            {preset.recommendedAddOns.length > 0 && (
                              <div>
                                <h4 className="font-semibold text-white mb-3">Recommended Add-ons</h4>
                                <div className="space-y-2">
                                  {preset.recommendedAddOns.map((id) => {
                                    const svc = CAMPAIGN_SERVICE_CATALOG.find(s => s.id === id)
                                    return svc ? (
                                      <div key={svc.id} className="flex justify-between items-start text-sm p-2 rounded bg-white/5 hover:bg-white/10">
                                        <div className="flex-1">
                                          <p className="text-white font-medium">{svc.name}</p>
                                          <p className="text-xs text-white/50 mt-1">{svc.description}</p>
                                        </div>
                                        <span className="whitespace-nowrap text-white/60 ml-2">{svc.price_display}</span>
                                      </div>
                                    ) : null
                                  })}
                                </div>
                              </div>
                            )}

                            {/* Summary */}
                            <div className="border-t border-white/10 pt-4 mt-6">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-xs text-white/50">Office Type</p>
                                  <p className="text-sm font-semibold text-white mt-1">{preset.officeType}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-white/50">Duration</p>
                                  <p className="text-sm font-semibold text-white mt-1">{preset.cycleMonths} months</p>
                                </div>
                                <div>
                                  <p className="text-xs text-white/50">Target Region</p>
                                  <p className="text-sm font-semibold text-white mt-1">{preset.targetRegion}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-white/50">Tier</p>
                                  <p className="text-sm font-semibold text-white capitalize mt-1">{preset.tier}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </SheetContent>
                      </Sheet>
                      <Link
                        href={`/auth/sign-up?template=${preset.id}`}
                        className="inline-flex items-center rounded-xl border border-blue-500/20 bg-blue-500/10 px-4 py-3 text-sm font-semibold text-blue-200 hover:bg-blue-500/15"
                      >
                        Use In Candidate Signup
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(activeView === "all" || activeView === "stacks") && (
            <div className="mt-12">
              <div className="mb-8 flex items-end justify-between gap-4 flex-wrap">
                <div>
                  <h2 className="text-3xl font-black uppercase text-white">Campaign Stacks</h2>
                  <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
                    Stack cards group related services into an operating layer so people can browse strategy before drilling into individual cards.
                  </p>
                </div>
                <p className="text-sm text-white/50">{stackCards.length} stacks</p>
              </div>

              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                {stackCards.map((stack) => (
                  <div key={stack.id} className="rounded-3xl border border-white/10 bg-[#0b0f16] p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${stack.badgeClass}`}>
                          {stack.badge}
                        </span>
                        <h3 className="mt-3 text-2xl font-bold text-white">{stack.title}</h3>
                        <p className="mt-2 text-sm text-white/65">{stack.description}</p>
                      </div>
                      <div className="min-w-[220px] space-y-2 text-right text-sm text-white/55">
                        <p>{stack.stackServices.length} services in stack</p>
                        <p>{stack.relatedPackages.length} package matches</p>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-3">
                      {stack.metrics.map((metric, metricIndex) => (
                        <div key={`${stack.id}-${metric.label}-${metricIndex}`} className="rounded-2xl border border-white/10 bg-black/20 p-4 text-center">
                          <p className={`text-2xl font-bold ${metric.accentClass}`}>{metric.value}</p>
                          <p className="mt-1 text-xs text-white/50">{metric.label}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2 text-xs">
                      {stack.stackServices.slice(0, 4).map((service) => (
                        <span key={`${stack.id}-${service.id}`} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/70">
                          {service.name}
                        </span>
                      ))}
                      {stack.stackServices.length > 4 && (
                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/50">
                          +{stack.stackServices.length - 4} more services
                        </span>
                      )}
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3 border-t border-white/10 pt-5">
                      <Link
                        href={`/services/stacks/${slugifyCampaignLabel(stack.title)}`}
                        className="inline-flex items-center rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white hover:bg-white/10"
                      >
                        Open Stack Page
                      </Link>
                      <Link
                        href="/services"
                        className="inline-flex items-center rounded-xl border border-blue-500/20 bg-blue-500/10 px-4 py-3 text-sm font-semibold text-blue-200 hover:bg-blue-500/15"
                      >
                        Browse Stack Examples
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(activeView === "all" || activeView === "services") && (
            <div className="mt-12">
              <div className="mb-8 flex items-end justify-between gap-4 flex-wrap">
                <div>
                  <h2 className="text-3xl font-black uppercase text-white">Individual Service Cards</h2>
                  <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
                    Every service below is a real card from the shared catalog. Monthly retainers and one-time launch projects are shown together so you can compare scope, pricing, and package coverage.
                  </p>
                </div>
                <p className="text-sm text-white/50">{services.length} services</p>
              </div>

              {/* Filter Section */}
              <div className="mb-8 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                <p className="text-sm font-semibold text-white mb-4">🔍 Filter Services</p>
                <div className="grid gap-4 md:grid-cols-5">
                  <div>
                    <label className="text-xs text-white/90 font-semibold uppercase tracking-wide">Category</label>
                    <select className="mt-2 w-full rounded-lg bg-white/10 border border-white/10 text-white text-sm px-3 py-2 hover:bg-white/15 transition">
                      <option value="">All Categories</option>
                      {Array.from(new Set(services.map(s => s.category))).map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-white/90 font-semibold uppercase tracking-wide">Tier</label>
                    <select className="mt-2 w-full rounded-lg bg-white/10 border border-white/10 text-white text-sm px-3 py-2 hover:bg-white/15 transition">
                      <option value="">All Tiers</option>
                      <option value="top">Top Tier (Premium)</option>
                      <option value="lean">Lean Tier</option>
                      <option value="standalone">Standalone Only</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-white/90 font-semibold uppercase tracking-wide">Price Range</label>
                    <select className="mt-2 w-full rounded-lg bg-white/10 border border-white/10 text-white text-sm px-3 py-2 hover:bg-white/15 transition">
                      <option value="">Any Price</option>
                      <option value="0-500">Under $500</option>
                      <option value="500-1000">$500 - $1,000</option>
                      <option value="1000-2000">$1,000 - $2,000</option>
                      <option value="2000+">$2,000+</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-white/90 font-semibold uppercase tracking-wide">Type</label>
                    <select className="mt-2 w-full rounded-lg bg-white/10 border border-white/10 text-white text-sm px-3 py-2 hover:bg-white/15 transition">
                      <option value="">All Types</option>
                      <option value="monthly">Monthly Retainer</option>
                      <option value="one-time">One-Time Project</option>
                      <option value="popular">Popular Only</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-white/90 font-semibold uppercase tracking-wide">Search</label>
                    <input placeholder="Find service..." className="mt-2 w-full rounded-lg bg-white/10 border border-white/10 text-white text-sm px-3 py-2 placeholder:text-white/50 hover:bg-white/15 transition" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {services.map((service) => {
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
                        <span className={`rounded-full border px-2 py-1 text-[11px] font-semibold ${launchProject ? "border-cyan-500/30 bg-cyan-500/15 text-cyan-300" : "border-green-500/30 bg-green-500/15 text-green-300"}`}>
                          {launchProject ? "Launch project" : "Monthly retainer"}
                        </span>
                        {/* Show which tiers this service is in */}
                        {packageMatches.length > 0 && (
                          <>
                            {packageMatches.some(p => p.tier === "top") && (
                              <span className="rounded-full border border-purple-500/30 bg-purple-500/15 px-2 py-1 text-[11px] font-semibold text-purple-300">
                                Top Tier
                              </span>
                            )}
                            {packageMatches.some(p => p.tier === "lean") && (
                              <span className="rounded-full border border-blue-500/30 bg-blue-500/15 px-2 py-1 text-[11px] font-semibold text-blue-300">
                                Lean Tier
                              </span>
                            )}
                          </>
                        )}
                      </div>
                      <h3 className="mt-3 text-lg font-bold text-white leading-snug">{service.name}</h3>
                      <p className="mt-2 text-sm text-white/60 line-clamp-2">{service.description}</p>
                      <Sheet>
                        <SheetTrigger asChild>
                          <button className="mt-3 inline-flex items-center text-sm font-semibold text-cyan-300 hover:text-cyan-200">
                            View Service Breakdown
                          </button>
                        </SheetTrigger>
                        <SheetContent side="right" className={PUBLIC_SHEET_CLASS}>
                          <SheetHeader className="border-b border-white/10 px-6 py-5">
                            <div className="flex flex-wrap gap-2">
                              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 whitespace-nowrap">{service.price_display}</span>
                              <span className={`rounded-full border px-3 py-1 text-xs ${commercialModel === "monthly-retainer" ? "border-green-500/30 bg-green-500/15 text-green-300" : "border-cyan-500/30 bg-cyan-500/15 text-cyan-300"}`}>
                                {commercialModel === "monthly-retainer" ? "Monthly retainer" : "Launch project"}
                              </span>
                              {stack && (
                                <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs text-blue-200">
                                  Stack: {stack.title}
                                </span>
                              )}
                            </div>
                            <SheetTitle className="text-2xl text-white">{service.name}</SheetTitle>
                            <SheetDescription className="text-white/60">{service.description}</SheetDescription>
                          </SheetHeader>

                          <div className="space-y-5 px-6 py-5">
                            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                              <p className="text-sm font-semibold text-white">What’s included</p>
                              <div className="mt-4 space-y-3">
                                {service.features.map((feature) => (
                                  <div key={`${service.id}-catalog-sheet-feature-${feature}`} className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white/75">
                                    {feature}
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                              <p className="text-sm font-semibold text-white">Package placement</p>
                              <div className="mt-4 space-y-3">
                                {packageMatches.length > 0 ? packageMatches.map((preset) => (
                                  <div key={`${service.id}-catalog-sheet-package-${preset.id}`} className="rounded-xl border border-white/10 bg-black/20 p-4">
                                    <p className="font-medium text-white">{preset.label}</p>
                                    <p className="mt-1 text-sm text-white/60">{preset.description}</p>
                                  </div>
                                )) : (
                                  <p className="text-sm text-white/60">This service is available individually even when it is not pre-bundled in a campaign template.</p>
                                )}
                              </div>
                            </div>

                            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-5">
                              <p className="text-sm font-semibold text-amber-200">Selling premise</p>
                              <p className="mt-2 text-sm text-white/75">
                                Use this service when the campaign needs sharper Gen Z and Millennial voter targeting, stronger persuasion, or a more reliable turnout system.
                              </p>
                            </div>

                            <div className="flex flex-wrap gap-3 border-t border-white/10 pt-5">
                              <Link
                                href={`/services/catalog/${slugifyCampaignLabel(service.name)}`}
                                className="inline-flex items-center rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-semibold text-white hover:bg-white/10"
                              >
                                Open Standalone Service Page
                              </Link>
                              {stack && (
                                <Link
                                  href={`/services/stacks/${slugifyCampaignLabel(stack.title)}`}
                                  className="inline-flex items-center rounded-xl border border-blue-500/20 bg-blue-500/10 px-4 py-3 font-semibold text-blue-200 hover:bg-blue-500/15"
                                >
                                  Open Standalone Stack Page
                                </Link>
                              )}
                            </div>
                          </div>
                        </SheetContent>
                      </Sheet>
                    </div>
                    <div className="space-y-1 text-sm text-white/70">
                      {service.features.slice(0, 4).map((feature) => (
                        <div key={`${service.id}-${feature}`} className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-col gap-3 border-t border-white/10 pt-4">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-lg font-bold text-white whitespace-nowrap">{service.price_display}</span>
                      </div>
                      <Link
                        href={isVerifiedCandidate ? `/candidate-portal/checkout?service=${service.id}` : "/auth/sign-up"}
                        className="w-full inline-flex min-h-10 items-center justify-center rounded-lg bg-white px-3 py-2 text-center text-sm font-semibold text-black hover:bg-white/90 transition"
                      >
                        {launchProject ? "Start Project" : "Start Retainer"}
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="border-t border-border bg-blue-950/10 py-16">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="rounded-3xl border border-white/10 bg-[#0b0f16] p-6 md:p-8">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <h2 className="text-2xl font-black uppercase text-white">Olivia Chow Campaign Finance Reference</h2>
                <p className="mt-2 max-w-3xl text-sm text-white/60">
                  This benchmark sits at the bottom of the public catalog so people can compare a real municipal filing against the service buckets and campaign-stack model shown above.
                </p>
              </div>
              <a href={OFFICIAL_FINANCE_SOURCE_URL} target="_blank" rel="noreferrer" className="text-sm text-amber-300 underline underline-offset-4 hover:text-amber-200">
                Open official City of Toronto disclosure
              </a>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-5">
              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs text-white/50">Candidate</p>
                <p className="mt-1 font-semibold text-white">{OLIVIA_CHOW_2023_FINANCE.candidateName}</p>
                <p className="mt-1 text-xs text-white/40">{OLIVIA_CHOW_2023_FINANCE.election}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs text-white/50">Spending Limit</p>
                <p className="mt-1 font-semibold text-white">{formatCurrency(OLIVIA_CHOW_2023_FINANCE.spendingLimitCents)}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs text-white/50">Official Contributions</p>
                <p className="mt-1 font-semibold text-white">{formatCurrency(OLIVIA_CHOW_2023_FINANCE.totalContributionsCents)}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs text-white/50">Official Expenses</p>
                <p className="mt-1 font-semibold text-white">{formatCurrency(OLIVIA_CHOW_2023_FINANCE.totalExpensesCents)}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs text-white/50">Filed Surplus</p>
                <p className="mt-1 font-semibold text-white">{formatCurrency(OLIVIA_CHOW_2023_FINANCE.surplusCents)}</p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <p className="text-sm font-medium text-white">Budget Usage</p>
                <p className="mt-2 text-sm text-white/70">
                  {formatCurrency(OLIVIA_CHOW_2023_FINANCE.totalExpensesCents)} spent against a {formatCurrency(OLIVIA_CHOW_2023_FINANCE.spendingLimitCents)} limit.
                </p>
                <p className="mt-2 text-xs text-amber-300">{formatPercent(oliviaBudgetUsage * 100)} of official spending limit used.</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <p className="text-sm font-medium text-white">Largest Filed Cost Bucket</p>
                <p className="mt-2 text-sm text-white/70">{oliviaLargestCategory.label}</p>
                <p className="mt-2 text-xs text-amber-300">
                  {formatCurrency(oliviaLargestCategory.amountCents)} mapped to {oliviaLargestCategory.mappedService}.
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-white/10 bg-black/20 p-4">
              <div className="mb-4 flex items-center gap-2">
                <Scale className="h-4 w-4 text-amber-300" />
                <p className="font-medium text-white">Filed Categories Mapped To Service Buckets</p>
              </div>
              <div className="space-y-3">
                {OLIVIA_CHOW_2023_FINANCE.categories.map((category) => (
                  <div key={category.label} className="flex items-start justify-between gap-4 border-b border-white/5 pb-3 last:border-b-0 last:pb-0">
                    <div>
                      <p className="text-sm font-medium text-white">{category.label}</p>
                      <p className="mt-1 text-xs text-white/50">Mapped here as: {category.mappedService}</p>
                    </div>
                    <p className="whitespace-nowrap font-medium text-white">{formatCurrency(category.amountCents)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}