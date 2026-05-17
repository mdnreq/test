import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { AnimatedServiceBackground } from "@/components/animated-service-background"
import { CAMPAIGN_SERVICE_CATALOG, PUBLIC_SERVICE_STACKS, getCampaignCommercialModel, getCampaignServicesForStack, getCampaignStackById, getCampaignStackForService, getCampaignStackHighlights, slugifyCampaignLabel } from "@/lib/campaign-system"
import { CAMPAIGN_PACKAGE_PRESETS } from "@/lib/campaign-package-presets"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  Check,
  Zap,
  MessageSquare,
  Globe,
  Megaphone,
  Target,
  Users,
  Briefcase,
  Heart,
  Database,
  TrendingUp,
  Settings,
  Shield,
  Calendar,
  UserCheck,
  BarChart3,
  Map,
  School,
  Newspaper,
  Sparkles,
  Brain,
  AlertCircle,
  Search,
  Bot,
  Cpu,
  BookOpen,
  CircleDot,
  Eye,
  AlertTriangle,
  FileSearch,
  Scale,
  Video,
  DollarSign,
  Rocket,
  LineChart,
  ChevronDown,
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

function normalizePriceToCents(price: number) {
  return price >= 10000 ? price : Math.round(price * 100)
}

function isOneTimeService(priceDisplay: string) {
  return /one-time|\/page/i.test(priceDisplay.toLowerCase())
}

function summarizeServiceLabels(
  items: Array<{ name: string; price_display: string }>,
  maxVisible = 3,
) {
  const visible = items.slice(0, maxVisible).map((item) => `${item.name} (${item.price_display})`)
  const hiddenCount = Math.max(items.length - maxVisible, 0)
  return { visible, hiddenCount }
}

function getCategoryVisual(category: string) {
  return categoryVisualMap[category as keyof typeof categoryVisualMap] ?? {
    animation: "analytics",
    headerClass: "bg-gradient-to-r from-slate-950 via-zinc-950/80 to-neutral-950/60",
    bodyClass: "from-slate-950/35 to-zinc-950/15",
  }
}

const OFFICIAL_FINANCE_SOURCE_URL = "http://app.toronto.ca/EFD/jsf/main/main.xhtml?campaign=19"

const OLIVIA_CHOW_2023_FINANCE = {
  candidateName: "Olivia Chow",
  election: "2023 Toronto By-Election for Mayor",
  totalContributionsCents: 161092765,
  totalExpensesCents: 156905568,
  largestCostBuckets: ["Advertising", "Salaries + Professional Fees", "Office + Phone + Internet"],
} as const

function formatCurrency(cents: number) {
  return new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(cents / 100)
}

function formatPercent(value: number) {
  return `${value.toFixed(1)}%`
}

const PUBLIC_SHEET_CLASS = "overflow-y-auto border-white/10 bg-[#05070a] !w-[98vw] sm:!w-[96vw] md:!w-[92vw] lg:!w-[88vw] xl:!w-[84vw] !max-w-[1480px]"

function renderStackSheetContent(stack: (typeof PUBLIC_SERVICE_STACKS)[number]) {
  const stackServices = getCampaignServicesForStack(stack.id)
  const relatedPackages = CAMPAIGN_PACKAGE_PRESETS.filter((preset) =>
    preset.coreCampaignStackIds.includes(stack.id) ||
    preset.launchCampaignStackIds.includes(stack.id) ||
    preset.addOnCampaignStackIds.includes(stack.id),
  )

  return (
    <>
      <SheetHeader className="border-b border-white/10 px-6 py-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${stack.badgeClass}`}>
            {stack.badge}
          </span>
        </div>
        <SheetTitle className="text-2xl text-white">{stack.title}</SheetTitle>
        <SheetDescription className="text-white/60">{stack.description}</SheetDescription>
      </SheetHeader>

      <div className="space-y-5 px-6 py-5">
        <div className="grid gap-3 sm:grid-cols-3">
          {stack.metrics.map((metric, metricIndex) => (
            <div key={`${stack.id}-sheet-metric-${metric.label}-${metricIndex}`} className="min-w-[120px] rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center">
              <div className={`text-2xl font-bold ${metric.accentClass}`}>{metric.value}</div>
              <div className="mt-1 text-xs text-white/55">{metric.label}</div>
            </div>
          ))}
        </div>

        {stack.id === "youth-engagement" && (
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-5 text-sm text-white/75">
            <p className="font-semibold text-amber-200">Key selling premise</p>
            <p className="mt-2">Help campaigns win the next majority by organizing Gen Z voters and converting Millennial households into repeat turnout networks.</p>
          </div>
        )}

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h3 className="text-xl font-semibold text-white">Services In This Stack</h3>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {stackServices.map((service) => (
              <div key={`${stack.id}-sheet-service-${service.id}`} className="rounded-xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-white/40">{service.category}</p>
                <p className="mt-3 font-medium text-white">{service.name}</p>
                <p className="mt-2 text-sm text-white/60">{service.description}</p>
                <p className="mt-3 text-sm font-semibold text-cyan-300">{service.price_display}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h3 className="text-xl font-semibold text-white">Used In Campaign Packages</h3>
          <div className="mt-4 space-y-3">
            {relatedPackages.map((preset) => (
              <div key={`${stack.id}-sheet-package-${preset.id}`} className="rounded-xl border border-white/10 bg-black/20 p-4">
                <p className="font-medium text-white">{preset.label}</p>
                <p className="mt-1 text-sm text-white/60">{preset.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-3 border-t border-white/10 pt-5">
          <Link
            href={`/services/stacks/${slugifyCampaignLabel(stack.title)}`}
            className="inline-flex items-center rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-semibold text-white hover:bg-white/10"
          >
            Open Standalone Stack Page
          </Link>
          <Link
            href="/services/catalog"
            className="inline-flex items-center rounded-xl border border-blue-500/20 bg-blue-500/10 px-4 py-3 font-semibold text-blue-200 hover:bg-blue-500/15"
          >
            Open Separate Full Catalog
          </Link>
        </div>
      </div>
    </>
  )
}

export default async function ServicesPage() {
  const supabase = await createClient()

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let isVerifiedCandidate = false
  let candidateData = null

  if (user) {
    // Check if user is a verified candidate
    const { data: candidate } = await supabase.from("candidates").select("*").eq("user_id", user.id).single()

    candidateData = candidate
    isVerifiedCandidate = candidate?.verified === true
  }

  const services = CAMPAIGN_SERVICE_CATALOG.map((service) => ({
    ...service,
    price: service.price_display,
    icon: categoryIconMap[service.category as keyof typeof categoryIconMap] ?? Briefcase,
  }))
  const featuredServices = services.filter((service) => service.popular).slice(0, 8)

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="border-b border-border bg-gradient-to-b from-blue-950/20 to-background">
        <div className="container mx-auto max-w-6xl px-4 py-24">
          <div className="mb-4 flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-1.5 text-sm text-orange-400">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-500"></span>
              New: AI-Powered Campaign Analytics
            </span>
          </div>

          <h1 className="mb-6 text-center text-5xl font-black uppercase leading-tight tracking-tight">
            Empowering Democracy
            <br />
            Through AI Innovation
          </h1>

          <p className="mx-auto mb-8 max-w-3xl text-center text-lg text-muted-foreground">
            Transform political campaigns with AI-powered tools. Build, deploy, and scale democratic engagement with
            TechnocracyAI - headquartered in Canada, serving G7 nations worldwide.
          </p>

          {!user && (
            <div className="mx-auto mb-8 max-w-2xl rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-yellow-500">Verified Candidates Only</h3>
                  <p className="text-sm text-muted-foreground">
                    Services are available exclusively to verified candidates. Please sign up as a candidate and
                    complete verification.
                  </p>
                </div>
              </div>
            </div>
          )}

          {user && !candidateData && (
            <div className="mx-auto mb-8 max-w-2xl rounded-lg border border-blue-500/50 bg-blue-500/10 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-500">Register as a Candidate</h3>
                  <p className="text-sm text-muted-foreground">
                    To access campaign services, please register as a municipal candidate in your profile settings.
                  </p>
                </div>
              </div>
            </div>
          )}

          {user && candidateData && !isVerifiedCandidate && (
            <div className="mx-auto mb-8 max-w-2xl rounded-lg border border-orange-500/50 bg-orange-500/10 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-orange-500">Verification Pending</h3>
                  <p className="text-sm text-muted-foreground">
                    Your candidate registration is under review. Services will be available once verification is
                    complete.
                  </p>
                </div>
              </div>
            </div>
          )}

          {isVerifiedCandidate && (
            <div className="mx-auto mb-8 max-w-2xl rounded-lg border border-green-500/50 bg-green-500/10 p-4">
              <div className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-green-500">Verified Candidate</h3>
                  <p className="text-sm text-muted-foreground">You're verified! Access all campaign services below.</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-4">
            {!user ? (
              <Link
                href="/auth/sign-up"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3 font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Sign Up as Candidate
                <span>→</span>
              </Link>
            ) : isVerifiedCandidate ? (
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3 font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Schedule Consultation
                <span>→</span>
              </Link>
            ) : (
              <Link
                href="/candidates/register"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3 font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Complete Registration
                <span>→</span>
              </Link>
            )}
            <Link
              href="/simulation"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-8 py-3 font-semibold hover:bg-accent"
            >
              <span>👁</span>
              Try Live Demo
            </Link>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Trusted by over 50 political candidates worldwide
          </p>
        </div>
      </section>

      {/* Services by Category - Ribbon Style Cards */}
      <section className="py-24">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-black uppercase">Campaign Services</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Comprehensive campaign services designed for progressive candidates competing for Gen Z and Millennial voters
            </p>
          </div>

          <div className="mb-10 grid gap-4 md:grid-cols-4">
            <div className="rounded-2xl border border-border bg-card/60 p-5">
              <p className="text-sm font-semibold text-white">1. Service Stacks</p>
              <p className="mt-2 text-sm text-muted-foreground">The ribbons below are capability stacks like brand, field, research, digital, fundraising, and crisis. They are not separate full campaigns by themselves.</p>
            </div>
            <div className="rounded-2xl border border-border bg-card/60 p-5">
              <p className="text-sm font-semibold text-white">2. Monthly Retainers</p>
              <p className="mt-2 text-sm text-muted-foreground">Recurring services inside those stacks become monthly retainers in CRM, such as messaging, ads, voter data, polling, volunteer ops, and fundraising.</p>
            </div>
            <div className="rounded-2xl border border-border bg-card/60 p-5">
              <p className="text-sm font-semibold text-white">3. Launch Projects</p>
              <p className="mt-2 text-sm text-muted-foreground">One-time work such as websites, donation setup, logos, Wikipedia, and special production becomes launch projects, not subscriptions.</p>
            </div>
            <div className="rounded-2xl border border-border bg-card/60 p-5">
              <p className="text-sm font-semibold text-white">4. Full Campaign Package</p>
              <p className="mt-2 text-sm text-muted-foreground">A mayor or councillor package combines the right retainers and launch projects into one campaign account with delivery team, tasks, files, meetings, and election programs.</p>
            </div>
          </div>

          <div className="mb-12 rounded-2xl border border-blue-500/20 bg-blue-500/10 p-6">
            <p className="text-lg font-semibold text-white">How to read this page</p>
            <p className="mt-2 max-w-4xl text-sm text-blue-100/80">Example: the Web & Digital Presence stack can contribute both a monthly retainer like Digital Presence and one-time launch projects like Campaign Website Pro. A full campaign model then combines that stack with messaging, voter data, field, fundraising, and compliance into one contract and one CRM account.</p>
            <div className="mt-4 flex flex-wrap gap-3 text-xs text-blue-100/70">
              <span className="rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1">Stack = capability area</span>
              <span className="rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1">Retainer = recurring monthly service</span>
              <span className="rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1">Launch project = one-time setup or production</span>
              <span className="rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1">Campaign package = bundled race model</span>
            </div>
          </div>

          <div className="mb-12 rounded-2xl border border-white/10 bg-[#0b0f16] p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-lg font-semibold text-white">Browse Filters</p>
                <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
                  Use these filters on this page for stacks, package examples, or individual cards. If you want the dedicated full-page browser, jump into the filtered catalog links below.
                </p>
              </div>
              <Link
                href="/services/catalog"
                className="inline-flex items-center rounded-xl border border-blue-500/20 bg-blue-500/10 px-4 py-3 text-sm font-semibold text-blue-200 hover:bg-blue-500/15"
              >
                Open Full Catalog
              </Link>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <Link
                href="/services#service-stacks"
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
              >
                <span className="block font-semibold text-white">Service Stacks</span>
                <span className="mt-1 block text-xs text-inherit/80">Jump to the ribbon stack examples.</span>
              </Link>
              <Link
                href="/services#campaign-templates"
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
              >
                <span className="block font-semibold text-white">Package Examples</span>
                <span className="mt-1 block text-xs text-inherit/80">Jump to bundled campaign packages.</span>
              </Link>
              <Link
                href="/services#individual-services"
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
              >
                <span className="block font-semibold text-white">Individual Services</span>
                <span className="mt-1 block text-xs text-inherit/80">Jump to the standalone service cards.</span>
              </Link>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/services/catalog"
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/75 transition hover:bg-white/10 hover:text-white"
              >
                Everything
              </Link>
              <Link
                href="/services/catalog?view=services"
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/75 transition hover:bg-white/10 hover:text-white"
              >
                Full Page: Individual Services
              </Link>
              <Link
                href="/services/catalog?view=packages"
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/75 transition hover:bg-white/10 hover:text-white"
              >
                Full Page: Packages
              </Link>
              <Link
                href="/services/catalog?view=stacks"
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/75 transition hover:bg-white/10 hover:text-white"
              >
                Full Page: Stacks
              </Link>
            </div>
          </div>

          {/* Service Category Ribbons */}
          <div id="service-stacks" className="space-y-6 scroll-mt-24">
            {PUBLIC_SERVICE_STACKS.map((stack) => (
              <div key={stack.id} className="group relative overflow-hidden rounded-2xl bg-[#0a0a12]">
                <div className="absolute inset-0 opacity-60">
                  <AnimatedServiceBackground type={stack.animation} />
                </div>
                <div className={`absolute inset-0 bg-gradient-to-r ${stack.gradientClass}`} />
                <div className="relative">
                  <div className="flex flex-col gap-6 p-8 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1">
                      <span className={`mb-3 inline-block rounded-full border px-3 py-1 text-xs font-semibold ${stack.badgeClass}`}>
                        {stack.badge}
                      </span>
                      <h3 className="mb-2 text-2xl font-bold text-white">{stack.title}</h3>
                      <p className={`${stack.textClass} max-w-xl`}>
                        {stack.description}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-3">
                        <Sheet>
                          <SheetTrigger asChild>
                            <button className="inline-flex items-center rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10">
                              View Stack Page
                            </button>
                          </SheetTrigger>
                          <SheetContent side="right" className={PUBLIC_SHEET_CLASS}>{renderStackSheetContent(stack)}</SheetContent>
                        </Sheet>

                        <Sheet>
                          <SheetTrigger asChild>
                            <button className="inline-flex items-center rounded-xl border border-white/15 bg-black/20 px-4 py-2 text-sm font-semibold text-white/85 hover:bg-white/10">
                              Expand Stack Example
                            </button>
                          </SheetTrigger>
                          <SheetContent side="right" className={PUBLIC_SHEET_CLASS}>{renderStackSheetContent(stack)}</SheetContent>
                        </Sheet>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {stack.metrics.map((metric, metricIndex) => (
                        <div key={`${stack.id}-${metric.label}-${metricIndex}`} className="min-w-[100px] rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-center backdrop-blur-sm">
                          <div className={`text-2xl font-bold ${metric.accentClass}`}>{metric.value}</div>
                          <div className={`text-xs ${stack.textClass.replace('/80', '/70')}`}>{metric.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 space-y-6">
            <div id="campaign-templates" className="text-center scroll-mt-24">
              <h3 className="text-3xl font-black uppercase text-white">Campaign Templates</h3>
              <p className="mx-auto mt-3 max-w-3xl text-sm text-muted-foreground">
                These are the actual bundled race models behind the new system: recurring retainers, one-time launch work, recommended add-ons, and the main delivery gaps each template is designed to solve.
              </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
              {CAMPAIGN_PACKAGE_PRESETS.map((preset) => {
                const coreServices = preset.mustHaveMonthlyRetainers
                  .map((serviceId) => services.find((service) => service.id === serviceId))
                  .filter((service): service is (typeof services)[number] => Boolean(service))
                const launchServices = preset.oneTimeLaunchWork
                  .map((serviceId) => services.find((service) => service.id === serviceId))
                  .filter((service): service is (typeof services)[number] => Boolean(service))
                const addOnServices = preset.recommendedAddOns
                  .map((serviceId) => services.find((service) => service.id === serviceId))
                  .filter((service): service is (typeof services)[number] => Boolean(service))
                const coreSummary = summarizeServiceLabels(coreServices)
                const launchSummary = summarizeServiceLabels(launchServices)
                const addOnSummary = summarizeServiceLabels(addOnServices)
                const coreMonthlyValue = preset.mustHaveMonthlyRetainers.reduce((sum, serviceId) => {
                  const service = services.find((entry) => entry.id === serviceId)
                  return sum + (service ? normalizePriceToCents(service.price_monthly) : 0)
                }, 0)
                const launchValue = preset.oneTimeLaunchWork.reduce((sum, serviceId) => {
                  const service = services.find((entry) => entry.id === serviceId)
                  return sum + (service ? normalizePriceToCents(service.price_monthly) : 0)
                }, 0)
                const addOnValue = preset.recommendedAddOns.reduce((sum, serviceId) => {
                  const service = services.find((entry) => entry.id === serviceId)
                  return sum + (service ? normalizePriceToCents(service.price_monthly) : 0)
                }, 0)
                const coreStacks = preset.coreCampaignStackIds.map((stackId) => getCampaignStackById(stackId)).filter((stack): stack is NonNullable<ReturnType<typeof getCampaignStackById>> => Boolean(stack))
                const launchStacks = preset.launchCampaignStackIds.map((stackId) => getCampaignStackById(stackId)).filter((stack): stack is NonNullable<ReturnType<typeof getCampaignStackById>> => Boolean(stack))
                const addOnStacks = preset.addOnCampaignStackIds.map((stackId) => getCampaignStackById(stackId)).filter((stack): stack is NonNullable<ReturnType<typeof getCampaignStackById>> => Boolean(stack))
                const coreStackHighlights = summarizeServiceLabels(getCampaignStackHighlights(preset.coreCampaignStackIds), 4)
                const launchStackHighlights = summarizeServiceLabels(getCampaignStackHighlights(preset.launchCampaignStackIds), 5)
                const addOnStackHighlights = summarizeServiceLabels(getCampaignStackHighlights(preset.addOnCampaignStackIds), 5)
                const fullCampaignValue = services.reduce((sum, service) => {
                  if (preset.mustHaveMonthlyRetainers.includes(service.id)) {
                    return sum + (normalizePriceToCents(service.price_monthly) * preset.cycleMonths)
                  }
                  if (preset.oneTimeLaunchWork.includes(service.id) || preset.recommendedAddOns.includes(service.id)) {
                    return sum + normalizePriceToCents(service.price_monthly)
                  }
                  return sum
                }, 0)
                const benchmarkExpenseShare = (fullCampaignValue / OLIVIA_CHOW_2023_FINANCE.totalExpensesCents) * 100
                const benchmarkContributionShare = (fullCampaignValue / OLIVIA_CHOW_2023_FINANCE.totalContributionsCents) * 100
                const benchmarkMonthlyRunRate = Math.round(fullCampaignValue / preset.cycleMonths)

                return (
                  <div key={preset.id} className="rounded-3xl border border-white/10 bg-[#0b0f16] p-5 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="text-2xl font-bold text-white">{preset.label}</h4>
                        <p className="mt-2 text-white/70">{preset.description}</p>
                        <p className="mt-3 text-sm text-blue-300">Demo CRM client: {preset.demoCandidateName} • {preset.targetRegion}</p>
                        <p className="mt-1 text-xs text-white/40">{preset.profileSummary}</p>
                      </div>
                      <span className="inline-flex items-center rounded-2xl border border-blue-500/30 bg-blue-500/15 px-3 py-1.5 text-xs font-semibold text-blue-300 whitespace-nowrap">
                        {preset.officeType} • {preset.cycleMonths} months
                      </span>
                    </div>

                    <div className="grid gap-3 text-sm sm:grid-cols-2 xl:grid-cols-4">
                      <div className="min-w-0 rounded-xl border border-white/10 bg-black/20 p-4">
                        <p className="text-white/50 text-xs">Core Campaign Stack</p>
                        <p className="mt-1 text-lg font-bold leading-tight text-white whitespace-nowrap">${(coreMonthlyValue / 100).toLocaleString()}/month</p>
                      </div>
                      <div className="min-w-0 rounded-xl border border-white/10 bg-black/20 p-4">
                        <p className="text-white/50 text-xs">Launch Stack</p>
                        <p className="mt-1 text-lg font-bold leading-tight text-white whitespace-nowrap">${(launchValue / 100).toLocaleString()}</p>
                      </div>
                      <div className="min-w-0 rounded-xl border border-white/10 bg-black/20 p-4">
                        <p className="text-white/50 text-xs">Add-On Stack</p>
                        <p className="mt-1 text-lg font-bold leading-tight text-white whitespace-nowrap">${(addOnValue / 100).toLocaleString()}</p>
                      </div>
                      <div className="min-w-0 rounded-xl border border-white/10 bg-black/20 p-4">
                        <p className="text-white/50 text-xs">Total value</p>
                        <p className="mt-1 text-lg font-bold leading-tight text-white whitespace-nowrap">${(fullCampaignValue / 100).toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="rounded-full border border-green-500/30 bg-green-500/15 px-3 py-1 text-green-200">
                        {coreServices.length} locked core retainers
                      </span>
                      <span className="rounded-full border border-cyan-500/30 bg-cyan-500/15 px-3 py-1 text-cyan-200">
                        {launchServices.length} scoped launch items
                      </span>
                      <span className="rounded-full border border-amber-500/30 bg-amber-500/15 px-3 py-1 text-amber-200">
                        {addOnServices.length} flexible add-ons
                      </span>
                    </div>

                    <div className="mt-4 grid gap-3 border-t border-white/10 pt-4 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-center">
                      <p className="min-w-0 text-xs text-white/45">{preset.profileSummary}</p>
                      <div className="flex flex-wrap gap-3 xl:justify-end">
                        <Link
                          href={`/auth/sign-up?template=${preset.id}`}
                          className="inline-flex items-center rounded-xl border border-blue-500/30 bg-blue-500/10 px-4 py-3 text-sm font-semibold text-blue-200 hover:bg-blue-500/20"
                        >
                          Use In Candidate Signup
                        </Link>
                        <Sheet>
                          <SheetTrigger asChild>
                            <button className="inline-flex items-center rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white hover:bg-white/10">
                              View Full Package
                            </button>
                          </SheetTrigger>
                          <SheetContent side="right" className={PUBLIC_SHEET_CLASS}>
                            <SheetHeader className="border-b border-white/10 px-6 py-5">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="rounded-full border border-blue-500/30 bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-300">
                                  {preset.officeType} • {preset.cycleMonths} months
                                </span>
                                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                                  CRM client: {preset.demoCandidateName}
                                </span>
                              </div>
                              <SheetTitle className="text-2xl text-white">{preset.label}</SheetTitle>
                              <SheetDescription className="text-white/60">{preset.description}</SheetDescription>
                            </SheetHeader>

                            <div className="space-y-5 px-6 py-5">
                              <div className="grid gap-5 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
                                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                                  <p className="text-sm font-medium text-white">Package summary</p>
                                  <p className="mt-2 text-sm text-white/60">{preset.profileSummary}</p>
                                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
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

                                <div className="space-y-5">
                                  <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                      <div>
                                        <p className="text-sm font-semibold text-amber-200">Campaign Finance Context</p>
                                        <p className="mt-1 max-w-3xl text-sm text-amber-100/75">
                                          This package uses municipal benchmark finance data so the stack model stays grounded in a real filing context.
                                        </p>
                                      </div>
                                      <a
                                        href={OFFICIAL_FINANCE_SOURCE_URL}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-xs text-amber-300 underline underline-offset-4 hover:text-amber-200"
                                      >
                                        Olivia Chow official filing
                                      </a>
                                    </div>
                                    <div className="mt-4 grid gap-3 sm:grid-cols-2 text-sm">
                                      <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                                        <p className="text-[11px] text-white/50">Modeled package value</p>
                                        <p className="mt-1 font-semibold text-white">{formatCurrency(fullCampaignValue)}</p>
                                        <p className="mt-1 text-xs text-white/45">About {formatCurrency(benchmarkMonthlyRunRate)} per month over {preset.cycleMonths} months.</p>
                                      </div>
                                      <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                                        <p className="text-[11px] text-white/50">Share of filed expenses</p>
                                        <p className="mt-1 font-semibold text-white">{formatPercent(benchmarkExpenseShare)}</p>
                                        <p className="mt-1 text-xs text-white/45">Compared against {formatCurrency(OLIVIA_CHOW_2023_FINANCE.totalExpensesCents)} in official expenses.</p>
                                      </div>
                                      <div className="rounded-xl border border-white/10 bg-black/20 p-3 sm:col-span-2">
                                        <p className="text-[11px] text-white/50">Share of filed contributions</p>
                                        <p className="mt-1 font-semibold text-white">{formatPercent(benchmarkContributionShare)}</p>
                                        <p className="mt-1 text-xs text-white/45">Benchmark includes {formatCurrency(OLIVIA_CHOW_2023_FINANCE.totalContributionsCents)} in contributions.</p>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4 text-sm">
                                    <p className="font-medium text-blue-200">Commercial guardrail</p>
                                    <p className="mt-2 text-white/70">
                                      Locked core retainers protect the monthly operating floor. Launch work is approved as a separate scope, and only add-ons should be swapped or removed later.
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div className="grid gap-4 text-sm xl:grid-cols-2">
                                <div className="rounded-2xl border border-green-500/20 bg-green-500/10 p-4">
                                  <p className="font-medium text-green-300">Locked Core Services</p>
                                  <p className="mt-2 text-xs text-green-200/80">These monthly retainers define the minimum viable campaign operating system and should not be removed.</p>
                                  <p className="mt-2 text-xs text-green-200/80">{coreStacks.map((stack) => stack.title).join(" • ")}</p>
                                  <div className="mt-3 space-y-2 text-white/85">
                                    {coreServices.map((service) => (
                                      <div key={`${preset.id}-sheet-core-${service.id}`} className="flex min-w-0 flex-col gap-1 border-b border-white/5 pb-2 last:border-b-0 last:pb-0">
                                        <span className="min-w-0 line-clamp-2 text-white/90">{service.name}</span>
                                        <span className="whitespace-nowrap text-white/45">{service.price_display}</span>
                                      </div>
                                    ))}
                                  </div>
                                  <p className="line-clamp-2 text-xs text-white/55">Stack coverage: {coreStackHighlights.visible.join(", ")}{coreStackHighlights.hiddenCount > 0 ? ` +${coreStackHighlights.hiddenCount} more` : ""}</p>
                                </div>

                                <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-4">
                                  <p className="font-medium text-cyan-300">Required Launch Work</p>
                                  <p className="mt-2 text-xs text-cyan-200/80">One-time setup work that gets the campaign live. Once started or delivered, this scope should stay attached to the package.</p>
                                  <p className="mt-2 text-xs text-cyan-200/80">{launchStacks.map((stack) => stack.title).join(" • ")}</p>
                                  <div className="mt-3 space-y-2 text-white/85">
                                    {launchServices.map((service) => (
                                      <div key={`${preset.id}-sheet-launch-${service.id}`} className="flex min-w-0 flex-col gap-1 border-b border-white/5 pb-2 last:border-b-0 last:pb-0">
                                        <span className="min-w-0 line-clamp-2 text-white/90">{service.name}</span>
                                        <span className="whitespace-nowrap text-white/45">{service.price_display}</span>
                                      </div>
                                    ))}
                                  </div>
                                  <p className="line-clamp-2 text-xs text-white/55">Stack coverage: {launchStackHighlights.visible.join(", ")}{launchStackHighlights.hiddenCount > 0 ? ` +${launchStackHighlights.hiddenCount} more` : ""}</p>
                                </div>

                                <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
                                  <p className="font-medium text-amber-300">Flexible Add-Ons</p>
                                  <p className="mt-2 text-xs text-amber-200/80">These services can be scaled, swapped, or removed without breaking the package minimum.</p>
                                  <p className="mt-2 text-xs text-amber-200/80">{addOnStacks.map((stack) => stack.title).join(" • ")}</p>
                                  <div className="mt-3 space-y-2 text-white/85">
                                    {addOnServices.length > 0 ? addOnServices.map((service) => (
                                      <div key={`${preset.id}-sheet-addon-${service.id}`} className="flex min-w-0 flex-col gap-1 border-b border-white/5 pb-2 last:border-b-0 last:pb-0">
                                        <span className="min-w-0 line-clamp-2 text-white/90">{service.name}</span>
                                        <span className="whitespace-nowrap text-white/45">{service.price_display}</span>
                                      </div>
                                    )) : <p className="text-white/60">No add-ons selected for this package.</p>}
                                  </div>
                                  <p className="line-clamp-2 text-xs text-white/55">Stack coverage: {addOnServices.length === 0 ? "No add-on stack examples" : `${addOnStackHighlights.visible.join(", ")}${addOnStackHighlights.hiddenCount > 0 ? ` +${addOnStackHighlights.hiddenCount} more` : ""}`}</p>
                                </div>
                              </div>

                              <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
                                <Collapsible className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                                <CollapsibleTrigger className="flex w-full items-center justify-between gap-3 text-left">
                                  <div>
                                    <p className="text-sm font-medium text-white">Gap Analysis</p>
                                    <p className="mt-1 text-xs text-white/50">Expand only when you want delivery risks and recommended fixes.</p>
                                  </div>
                                  <ChevronDown className="h-4 w-4 text-white/50" />
                                </CollapsibleTrigger>
                                <CollapsibleContent className="pt-4">
                                  <div className="grid gap-3 sm:grid-cols-2">
                                    {preset.gapAnalysis.map((gap) => (
                                      <div key={`${preset.id}-sheet-gap-${gap.area}`} className="rounded-xl border border-white/10 bg-black/20 p-3">
                                        <p className="font-medium text-white">{gap.area}</p>
                                        <p className="mt-2 text-sm text-white/60">{gap.summary}</p>
                                        <p className="mt-3 text-xs text-amber-300">
                                          Fix with: {gap.recommendedServiceIds
                                            .map((serviceId) => services.find((service) => service.id === serviceId)?.name)
                                            .filter((value): value is string => Boolean(value))
                                            .join(", ")}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                </CollapsibleContent>
                                </Collapsible>

                                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                                  <p className="text-sm font-medium text-white">Next step</p>
                                  <p className="mt-2 text-sm text-white/60">Move from preview to onboarding with one package path for candidate signup and one path for human review.</p>
                                  <div className="mt-4 flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:flex-wrap">
                                    <Link
                                      href={`/auth/sign-up?template=${preset.id}`}
                                      className="inline-flex items-center justify-center rounded-xl border border-blue-500/30 bg-blue-500/10 px-4 py-3 font-semibold text-blue-200 hover:bg-blue-500/20"
                                    >
                                      Use In Candidate Signup
                                    </Link>
                                    <Link
                                      href={isVerifiedCandidate ? "/contact" : "/auth/sign-up"}
                                      className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-3 font-semibold text-black hover:bg-white/90"
                                    >
                                      {isVerifiedCandidate ? "Schedule Package Review" : "Get Verified"}
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </SheetContent>
                        </Sheet>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div id="individual-services" className="mt-16 space-y-6 scroll-mt-24">
            <div className="text-center">
              <h3 className="text-3xl font-black uppercase text-white">Campaign Services</h3>
              <p className="mx-auto mt-3 max-w-3xl text-sm text-muted-foreground">
                The featured cards below are real services from the shared campaign catalog. Each one is tagged as a monthly retainer or launch project and maps back into the same template logic used in the portal.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {featuredServices.map((service) => {
                const Icon = service.icon
                const packageMatches = CAMPAIGN_PACKAGE_PRESETS.filter((preset) =>
                  preset.mustHaveMonthlyRetainers.includes(service.id) ||
                  preset.oneTimeLaunchWork.includes(service.id) ||
                  preset.recommendedAddOns.includes(service.id),
                )
                const launchProject = isOneTimeService(service.price_display)
                const visual = getCategoryVisual(service.category)
                const stack = getCampaignStackForService(service)
                const commercialModel = getCampaignCommercialModel(service)

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
                          {packageMatches.slice(0, 2).map((preset) => (
                            <span key={`${service.id}-${preset.id}`} className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-white/70">
                              {preset.label}
                            </span>
                          ))}
                        </div>
                        <h4 className="mt-3 text-xl font-bold text-white">{service.name}</h4>
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
                                    <div key={`${service.id}-sheet-feature-${feature}`} className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white/75">
                                      {feature}
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                                <p className="text-sm font-semibold text-white">Package placement</p>
                                <div className="mt-4 space-y-3">
                                  {packageMatches.length > 0 ? packageMatches.map((preset) => (
                                    <div key={`${service.id}-sheet-package-${preset.id}`} className="rounded-xl border border-white/10 bg-black/20 p-4">
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
                                  Open Full Service Page
                                </Link>
                                {stack && (
                                  <Link
                                    href={`/services/stacks/${slugifyCampaignLabel(stack.title)}`}
                                    className="inline-flex items-center rounded-xl border border-blue-500/20 bg-blue-500/10 px-4 py-3 font-semibold text-blue-200 hover:bg-blue-500/15"
                                  >
                                    Open Stack Page
                                  </Link>
                                )}
                              </div>
                            </div>
                          </SheetContent>
                        </Sheet>
                      </div>
                      <div className="space-y-1 text-sm text-white/70">
                        {service.features.slice(0, 2).map((feature) => (
                          <div key={`${service.id}-${feature}`} className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                            <span>{feature}</span>
                          </div>
                        ))}
                        {service.features.length > 2 && <p className="pl-4 text-xs text-white/40">+{service.features.length - 2} more</p>}
                      </div>
                      <details className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/75">
                        <summary className="cursor-pointer list-none font-semibold text-white">
                          View full stack example
                        </summary>
                        <div className="mt-3 space-y-3">
                          <div>
                            <p className="text-xs uppercase tracking-wide text-white/40">Commercial model</p>
                            <p className="mt-1 text-white/75">
                              {launchProject
                                ? "One-time launch project that lands in CRM as an order with delivery tasks and files."
                                : "Monthly retainer that rolls into full campaign contract value and recurring CRM delivery."}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-wide text-white/40">Everything included</p>
                            <div className="mt-2 space-y-2">
                              {service.features.map((feature) => (
                                <div key={`${service.id}-full-${feature}`} className="flex items-center gap-2 text-white/75">
                                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                                  <span>{feature}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          {packageMatches.length > 0 && (
                            <div>
                              <p className="text-xs uppercase tracking-wide text-white/40">Included in campaign templates</p>
                              <div className="mt-2 flex flex-wrap gap-2">
                                {packageMatches.map((preset) => (
                                  <span key={`${service.id}-full-${preset.id}`} className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-white/75">
                                    {preset.label}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </details>
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
          </div>

          {/* View All Services CTA */}
          <div className="mt-12 text-center">
            <Link
              href="/services/catalog"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3 font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Open Separate Full Catalog
              <span>{">"}</span>
            </Link>
            <p className="mt-3 text-sm text-white/45">
              Campaign templates above are for finance context and race-fit. The full catalog below stays separate for line-by-line service browsing.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border bg-blue-950/20 py-24">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <h2 className="mb-4 text-4xl font-black uppercase">Ready to Transform Your Campaign?</h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Join campaigns using TechnocracyAI to win Gen Z and Millennial voters with sharper targeting, stronger messaging, and better turnout operations
          </p>
          {isVerifiedCandidate ? (
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3 font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Schedule Consultation
              <span>→</span>
            </Link>
          ) : (
            <Link
              href="/auth/sign-up"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3 font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Get Verified
              <span>→</span>
            </Link>
          )}
        </div>
      </section>
    </div>
  )
}
