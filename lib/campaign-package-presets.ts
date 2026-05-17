export interface CampaignPackageGap {
  area: string
  summary: string
  recommendedServiceIds: string[]
}

export type CampaignStackId =
  | "design-branding"
  | "seo-digital-optimization"
  | "identity-reputation"
  | "web-digital-presence"
  | "crisis-risk"
  | "media-content"
  | "analytics-data"
  | "field-operations"
  | "youth-engagement"
  | "fundraising-donations"
  | "content-creation"
  | "digital-marketing"
  | "research-intelligence"
  | "video-production"
  | "email-marketing"

export interface CampaignPackagePreset {
  id: string
  officeType: "mayor" | "councillor"
  tier: "top" | "lean"
  label: string
  description: string
  demoCandidateId: string
  demoCandidateName: string
  demoCandidateEmail: string
  targetRegion: string
  profileSummary: string
  cycleMonths: number
  mustHaveMonthlyRetainers: string[]
  coreCampaignStackIds: CampaignStackId[]
  oneTimeLaunchWork: string[]
  launchCampaignStackIds: CampaignStackId[]
  recommendedAddOns: string[]
  addOnCampaignStackIds: CampaignStackId[]
  gapAnalysis: CampaignPackageGap[]
}

export const CAMPAIGN_PACKAGE_PRESETS: CampaignPackagePreset[] = [
  {
    id: "premium-tier",
    officeType: "mayor",
    tier: "top",
    label: "🌟 PREMIUM TIER",
    description: "Full-suite comprehensive campaign: every core service for maximum impact. Includes polling, crisis management, opposition research, and complete launch package with website, video, and social media.",
    demoCandidateId: "demo-cand-1",
    demoCandidateName: "Sarah Thompson",
    demoCandidateEmail: "sarah@premium.demo",
    targetRegion: "Any municipality - citywide focus",
    profileSummary: "All-inclusive campaign package at $8,000/month. Core services cover messaging, media relations, advertising, voter management, fundraising, print materials, polling, crisis management, opposition research, and Gen Z engagement.",
    cycleMonths: 6,
    mustHaveMonthlyRetainers: ["2", "15", "17", "23", "26", "37", "11", "65", "66", "34"],
    coreCampaignStackIds: ["content-creation", "digital-marketing", "analytics-data", "fundraising-donations", "research-intelligence", "crisis-risk", "video-production"],
    oneTimeLaunchWork: ["74", "75", "76"],
    launchCampaignStackIds: ["web-digital-presence", "design-branding", "video-production"],
    recommendedAddOns: ["33", "32", "31", "16", "61"],
    addOnCampaignStackIds: ["youth-engagement", "email-marketing", "content-creation", "media-content"],
    gapAnalysis: [
      {
        area: "Event activation",
        summary: "Premium campaigns can amplify impact with coordinated town halls, fundraisers, and press events across the municipality.",
        recommendedServiceIds: ["31"],
      },
      {
        area: "Earned media expansion",
        summary: "Podcasts and media appearances extend reach and credibility beyond paid channels.",
        recommendedServiceIds: ["16"],
      },
    ],
  },
  {
    id: "professional-tier",
    officeType: "mayor",
    tier: "top",
    label: "⭐⭐ PROFESSIONAL TIER",
    description: "Strong standard package at $6,000/month: core outreach, voter management, local media relations, and complete launch suite. Add polling or opposition research as strategic upgrades.",
    demoCandidateId: "demo-cand-2",
    demoCandidateName: "James Chen",
    demoCandidateEmail: "james@professional.demo",
    targetRegion: "Mid-size municipality",
    profileSummary: "Balanced campaign package covering messaging, media relations, advertising, voter management, fundraising, and print design. Launch includes website, video production, and social media. Strategic flexibility to add research services.",
    cycleMonths: 6,
    mustHaveMonthlyRetainers: ["2", "15", "17", "23", "26", "37"],
    coreCampaignStackIds: ["content-creation", "digital-marketing", "analytics-data", "fundraising-donations", "media-content", "video-production"],
    oneTimeLaunchWork: ["74", "75", "76"],
    launchCampaignStackIds: ["web-digital-presence", "design-branding", "video-production"],
    recommendedAddOns: ["66", "65", "33", "19", "61", "32"],
    addOnCampaignStackIds: ["research-intelligence", "email-marketing", "digital-marketing", "youth-engagement"],
    gapAnalysis: [
      {
        area: "Polling insights",
        summary: "Professional campaigns track voter sentiment through strategic polling at key campaign moments.",
        recommendedServiceIds: ["66"],
      },
      {
        area: "Opposition intelligence",
        summary: "Understanding competitor moves allows faster pivots and defensive preparation.",
        recommendedServiceIds: ["65"],
      },
    ],
  },
  {
    id: "starter-tier",
    officeType: "councillor",
    tier: "top",
    label: "⭐ STARTER TIER",
    description: "Essential campaign toolkit at $4,000/month: messaging, voter management, local advertising, door-to-door operations, and volunteer coordination. Complete launch with website, video, and social.",
    demoCandidateId: "demo-cand-3",
    demoCandidateName: "Maria Rodriguez",
    demoCandidateEmail: "maria@starter.demo",
    targetRegion: "Urban ward",
    profileSummary: "Ward-focused campaign covering local messaging, voter database management, field operations, volunteer coordination, and paid advertising. Full launch suite gets you live immediately.",
    cycleMonths: 5,
    mustHaveMonthlyRetainers: ["2", "23", "20", "22", "17"],
    coreCampaignStackIds: ["content-creation", "digital-marketing", "field-operations", "analytics-data", "video-production"],
    oneTimeLaunchWork: ["74", "75", "76"],
    launchCampaignStackIds: ["design-branding", "web-digital-presence", "video-production"],
    recommendedAddOns: ["37", "33", "32", "61", "31", "18"],
    addOnCampaignStackIds: ["design-branding", "youth-engagement", "email-marketing", "content-creation"],
    gapAnalysis: [
      {
        area: "Print materials",
        summary: "Door-to-door campaigns are amplified with professional flyers, door hangers, and yard signs.",
        recommendedServiceIds: ["37"],
      },
      {
        area: "Digital advertising",
        summary: "Google and social ads expand reach beyond field and email outreach.",
        recommendedServiceIds: ["18", "19"],
      },
    ],
  },
  {
    id: "growth-tier",
    officeType: "councillor",
    tier: "top",
    label: "💚 GROWTH TIER",
    description: "Bootstrap-friendly campaign at $2,500/month: local messaging, voter management, and door-to-door operations. Launch with basic website and social media. Scale up as you build momentum.",
    demoCandidateId: "demo-cand-4",
    demoCandidateName: "Alex Kim",
    demoCandidateEmail: "alex@growth.demo",
    targetRegion: "Emerging candidate ward",
    profileSummary: "First-time campaign package with essential messaging, voter contact tools, and grassroots field operations. Lite website and social launch get you online fast. Add video production and email as budget allows.",
    cycleMonths: 4,
    mustHaveMonthlyRetainers: ["2", "23", "20"],
    coreCampaignStackIds: ["content-creation", "field-operations", "analytics-data"],
    oneTimeLaunchWork: ["73", "76"],
    launchCampaignStackIds: ["design-branding", "web-digital-presence"],
    recommendedAddOns: ["75", "37", "61", "33", "32"],
    addOnCampaignStackIds: ["video-production", "design-branding", "email-marketing", "youth-engagement"],
    gapAnalysis: [
      {
        area: "Video storytelling",
        summary: "Professional video dramatically increases engagement and candidate visibility online.",
        recommendedServiceIds: ["75"],
      },
      {
        area: "Email follow-up",
        summary: "Building an email list and sending regular updates keeps supporters engaged between contact attempts.",
        recommendedServiceIds: ["61"],
      },
    ],
  },
]