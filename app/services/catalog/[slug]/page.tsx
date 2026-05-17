import Link from "next/link"
import { notFound } from "next/navigation"

import { CAMPAIGN_PACKAGE_PRESETS } from "@/lib/campaign-package-presets"
import { CAMPAIGN_SERVICE_CATALOG, getCampaignCommercialModel, getCampaignServiceBySlug, getCampaignStackForService, slugifyCampaignLabel } from "@/lib/campaign-system"

export const dynamicParams = false

export function generateStaticParams() {
  return CAMPAIGN_SERVICE_CATALOG.map((service) => ({
    slug: slugifyCampaignLabel(service.name),
  }))
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const service = getCampaignServiceBySlug(slug)

  if (!service) {
    notFound()
  }

  const stack = getCampaignStackForService(service)
  const commercialModel = getCampaignCommercialModel(service)
  const relatedPackages = CAMPAIGN_PACKAGE_PRESETS.filter((preset) =>
    preset.mustHaveMonthlyRetainers.includes(service.id) ||
    preset.oneTimeLaunchWork.includes(service.id) ||
    preset.recommendedAddOns.includes(service.id),
  )

  return (
    <div className="min-h-screen bg-[#05070a] text-white">
      <section className="border-b border-white/10 bg-gradient-to-b from-white/5 to-transparent">
        <div className="mx-auto max-w-5xl px-4 py-20">
          <Link href="/services/catalog" className="text-sm text-white/60 hover:text-white">Back to Full Catalog</Link>
          <div className="mt-6 max-w-3xl">
            <p className="text-xs uppercase tracking-[0.24em] text-white/40">{service.category}</p>
            <h1 className="mt-3 text-5xl font-black tracking-tight">{service.name}</h1>
            <p className="mt-4 text-lg text-white/70">{service.description}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/80 whitespace-nowrap">{service.price_display}</span>
              <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-200">
                {commercialModel === "monthly-retainer" ? "Monthly retainer" : "Launch project"}
              </span>
              {stack && (
                <Link
                  href={`/services/stacks/${slugifyCampaignLabel(stack.title)}`}
                  className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-sm text-blue-200 hover:bg-blue-500/15"
                >
                  Stack: {stack.title}
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-2xl font-semibold">What’s included</h2>
            <div className="mt-5 space-y-3">
              {service.features.map((feature) => (
                <div key={feature} className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white/75">
                  {feature}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <h2 className="text-2xl font-semibold">Package Placement</h2>
              <div className="mt-4 space-y-3">
                {relatedPackages.length > 0 ? relatedPackages.map((preset) => (
                  <div key={preset.id} className="rounded-xl border border-white/10 bg-black/20 p-4">
                    <p className="font-medium text-white">{preset.label}</p>
                    <p className="mt-1 text-sm text-white/60">{preset.description}</p>
                  </div>
                )) : (
                  <p className="text-sm text-white/60">This service is available individually even when it is not pre-bundled in a campaign template.</p>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-6">
              <p className="text-sm font-semibold text-amber-200">Selling premise</p>
              <p className="mt-2 text-sm text-white/75">
                Use this service when the campaign needs sharper Gen Z and Millennial voter targeting, stronger persuasion, or a more reliable turnout system.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}