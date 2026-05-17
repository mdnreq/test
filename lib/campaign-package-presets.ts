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
    id: "top-tier-mayor",
    officeType: "mayor",
    tier: "top",
    label: "Top-Tier Mayor",
    description: "Full-scale citywide race package for a competitive mayoral campaign with fundraising, paid media, field, and war-room operations.",
    demoCandidateId: "demo-cand-3",
    demoCandidateName: "Olivia Chow",
    demoCandidateEmail: "olivia@mayorbenchmark.demo",
    targetRegion: "Toronto City-wide",
    profileSummary: "Official-style top-tier mayor demo account with city-wide paid media, fundraising, polling, local media relations, and rapid-response delivery.",
    cycleMonths: 6,
    mustHaveMonthlyRetainers: ["2", "15", "17", "23", "26", "66", "11"],
    coreCampaignStackIds: ["content-creation", "digital-marketing", "analytics-data", "fundraising-donations", "research-intelligence", "crisis-risk", "video-production"],
    oneTimeLaunchWork: ["74", "75", "76"],
    launchCampaignStackIds: ["web-digital-presence", "design-branding", "video-production"],
    recommendedAddOns: ["14", "61", "33", "65", "32", "19"],
    addOnCampaignStackIds: ["design-branding", "email-marketing", "youth-engagement", "crisis-risk", "research-intelligence"],
    gapAnalysis: [
      {
        area: "Fundraising throughput",
        summary: "Without recurring donor operations and campaign email, a top-tier mayoral race under-monetizes momentum.",
        recommendedServiceIds: ["26", "61"],
      },
      {
        area: "Rapid response coverage",
        summary: "Citywide races need a standing crisis and opposition desk to respond within hours, not days.",
        recommendedServiceIds: ["11", "65", "14"],
      },
    ],
  },
  {
    id: "lean-mayor",
    officeType: "mayor",
    tier: "lean",
    label: "Lean Mayor",
    description: "A smaller-city mayoral package focused on message clarity, website conversion, volunteer coordination, and essential GOTV infrastructure.",
    demoCandidateId: "demo-cand-4",
    demoCandidateName: "Regional Mayor Demo",
    demoCandidateEmail: "regional.mayor@tnm.demo",
    targetRegion: "Regional municipality",
    profileSummary: "Lean mayor demo account for a smaller municipality with essential website, volunteer, voter, and donor operations.",
    cycleMonths: 5,
    mustHaveMonthlyRetainers: ["2", "17", "22", "23"],
    coreCampaignStackIds: ["content-creation", "digital-marketing", "field-operations", "analytics-data"],
    oneTimeLaunchWork: ["10", "58"],
    launchCampaignStackIds: ["web-digital-presence"],
    recommendedAddOns: ["26", "61", "14"],
    addOnCampaignStackIds: ["fundraising-donations", "email-marketing", "crisis-risk"],
    gapAnalysis: [
      {
        area: "Volunteer coordination",
        summary: "Lean mayoral campaigns often attract volunteers but lack a repeatable scheduling and accountability layer.",
        recommendedServiceIds: ["22", "20"],
      },
      {
        area: "Donor follow-up",
        summary: "A lower-budget race still needs structured fundraising and email automation to extend runway.",
        recommendedServiceIds: ["26", "61"],
      },
    ],
  },
  {
    id: "top-tier-councillor",
    officeType: "councillor",
    tier: "top",
    label: "Top-Tier Councillor",
    description: "A competitive ward package with field discipline, digital persuasion, volunteer throughput, analytics, and strong local community engagement built in.",
    demoCandidateId: "demo-cand-5",
    demoCandidateName: "Metro Councillor Demo",
    demoCandidateEmail: "metro.councillor@tnm.demo",
    targetRegion: "Competitive urban ward",
    profileSummary: "Competitive ward demo account with local media relations, persuasion media, volunteer throughput, analytics, and election-week execution.",
    cycleMonths: 6,
    mustHaveMonthlyRetainers: ["2", "15", "17", "20", "22", "23"],
    coreCampaignStackIds: ["content-creation", "digital-marketing", "field-operations", "analytics-data", "video-production"],
    oneTimeLaunchWork: ["74", "75", "76"],
    launchCampaignStackIds: ["design-branding", "web-digital-presence", "video-production"],
    recommendedAddOns: ["66", "65", "14", "37", "32", "19", "34"],
    addOnCampaignStackIds: ["design-branding", "research-intelligence", "crisis-risk"],
    gapAnalysis: [
      {
        area: "Persuasion mix",
        summary: "Top ward races need coordinated digital, print, and field persuasion rather than a single outreach channel.",
        recommendedServiceIds: ["17", "37", "66"],
      },
      {
        area: "Election-week readiness",
        summary: "Volunteer surge and compliance pressure both increase in the final stretch of a serious councillor race.",
        recommendedServiceIds: ["22", "14"],
      },
    ],
  },
  {
    id: "lean-councillor",
    officeType: "councillor",
    tier: "lean",
    label: "Lean Councillor",
    description: "A lower-budget neighbourhood campaign package that covers the essentials without pretending to be a citywide operation.",
    demoCandidateId: "demo-cand-6",
    demoCandidateName: "Neighbourhood Councillor Demo",
    demoCandidateEmail: "neighbourhood.councillor@tnm.demo",
    targetRegion: "Neighbourhood ward",
    profileSummary: "Lean ward demo account focused on basic website, volunteer coordination, recurring messaging, and voter capture.",
    cycleMonths: 5,
    mustHaveMonthlyRetainers: ["2", "22", "23"],
    coreCampaignStackIds: ["content-creation", "field-operations", "analytics-data"],
    oneTimeLaunchWork: ["36", "10"],
    launchCampaignStackIds: ["design-branding", "web-digital-presence"],
    recommendedAddOns: ["20", "14", "61"],
    addOnCampaignStackIds: ["design-branding", "field-operations", "crisis-risk", "email-marketing"],
    gapAnalysis: [
      {
        area: "Data capture",
        summary: "Lean ward campaigns often do outreach but fail to structure the voter information for follow-up and GOTV.",
        recommendedServiceIds: ["23", "20"],
      },
      {
        area: "Candidate consistency",
        summary: "A small councillor race still needs regular messaging and supporter updates to stay credible.",
        recommendedServiceIds: ["2", "61"],
      },
    ],
  },
]