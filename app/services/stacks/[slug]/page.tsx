import Link from "next/link"
import { notFound } from "next/navigation"

import { CAMPAIGN_PACKAGE_PRESETS, type CampaignStackId } from "@/lib/campaign-package-presets"
import { PUBLIC_SERVICE_STACKS, getCampaignServicesForStack, getCampaignStackBySlug, slugifyCampaignLabel } from "@/lib/campaign-system"

export const dynamicParams = false

export function generateStaticParams() {
  return PUBLIC_SERVICE_STACKS.map((stack) => ({
    slug: slugifyCampaignLabel(stack.title),
  }))
}

export default async function ServiceStackDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const stack = getCampaignStackBySlug(slug)

  if (!stack) {
    notFound()
  }

  const services = getCampaignServicesForStack(stack.id as CampaignStackId)
  const relatedPackages = CAMPAIGN_PACKAGE_PRESETS.filter((preset) =>
    preset.coreCampaignStackIds.includes(stack.id as CampaignStackId) ||
    preset.launchCampaignStackIds.includes(stack.id as CampaignStackId) ||
    preset.addOnCampaignStackIds.includes(stack.id as CampaignStackId),
  )

  return (
    <div className="min-h-screen bg-[#05070a] text-white">
      <section className="border-b border-white/10 bg-gradient-to-b from-white/5 to-transparent">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <Link href="/services" className="text-sm text-white/60 hover:text-white">Back to Services</Link>
          <div className="mt-6 flex flex-wrap items-start justify-between gap-6">
            <div className="max-w-3xl">
              <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${stack.badgeClass}`}>
                {stack.badge}
              </span>
              <h1 className="mt-4 text-5xl font-black tracking-tight">{stack.title}</h1>
              <p className={`mt-4 text-lg ${stack.textClass}`}>{stack.description}</p>
              {stack.id === "youth-engagement" && (
                <p className="mt-4 max-w-2xl text-sm text-white/70">
                  Key selling premise: help campaigns win the next majority by organizing Gen Z voters and converting Millennial households into repeat turnout networks.
                </p>
              )}
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {stack.metrics.map((metric) => (
                <div key={metric.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center min-w-[120px]">
                  <div className={`text-2xl font-bold ${metric.accentClass}`}>{metric.value}</div>
                  <div className="mt-1 text-xs text-white/55">{metric.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <h2 className="text-2xl font-semibold">Services In This Stack</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {services.map((service) => (
                <Link
                  key={service.id}
                  href={`/services/catalog/${slugifyCampaignLabel(service.name)}`}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 hover:bg-white/[0.06]"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-white/40">{service.category}</p>
                  <h3 className="mt-3 text-xl font-semibold">{service.name}</h3>
                  <p className="mt-2 text-sm text-white/65">{service.description}</p>
                  <p className="mt-4 text-sm font-semibold text-cyan-300 whitespace-nowrap">{service.price_display}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <h2 className="text-2xl font-semibold">Used In Campaign Packages</h2>
              <div className="mt-4 space-y-3">
                {relatedPackages.map((preset) => (
                  <div key={preset.id} className="rounded-xl border border-white/10 bg-black/20 p-4">
                    <p className="font-medium text-white">{preset.label}</p>
                    <p className="mt-1 text-sm text-white/60">{preset.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-5">
              <p className="text-sm font-semibold text-blue-200">What this page is for</p>
              <p className="mt-2 text-sm text-white/70">
                Stack pages explain the strategic layer. Individual service pages break out the exact retainer or launch item inside that stack.
              </p>
              <Link href="/services/catalog" className="mt-4 inline-flex rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-white/90">
                Open Separate Full Catalog
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}