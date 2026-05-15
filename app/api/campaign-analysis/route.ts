import { NextResponse } from "next/server"

const DEFAULT_CAMPAIGN_CYCLE_MONTHS = 8
const OFFICIAL_FINANCE_SOURCE_URL = "http://app.toronto.ca/EFD/jsf/main/main.xhtml?campaign=19"

const officialBenchmarks = [
  {
    id: "olivia-chow-2023",
    source: "official_city_filing",
    candidateName: "Olivia Chow",
    election: "2023 Toronto By-Election for Mayor",
    spendingLimitCents: 161675145,
    totalContributionsCents: 161092765,
    totalExpensesCents: 156905568,
    surplusCents: 4189697,
    note: "Official filing benchmark. Enrich with election-result vote totals when you want exact cost-per-vote from official returns.",
    sourceUrl: OFFICIAL_FINANCE_SOURCE_URL,
  },
]

const fullCampaignProfiles = [
  {
    id: "top-tier-mayor-official",
    label: "Top-Tier Mayor",
    candidateName: "Olivia Chow",
    benchmarkType: "official benchmark",
    election: "2023 Toronto By-Election for Mayor",
    cycleMonths: 8,
    targetedVoters: 450000,
    expectedVotes: 250000,
    monthlyCoreCents: 425000,
    oneTimeLaunchCents: 285000,
    addOnValueCents: 168000,
    mustHaveServices: [
      "Campaign strategy and war-room management",
      "Paid media management",
      "Rapid response and press operations",
      "Fundraising operations and donor communications",
      "Election-day GOTV coordination",
    ],
    recommendedServices: [
      "Polling and message testing subscription",
      "Daily analytics and opposition monitoring",
      "Volunteer recruitment automation",
      "Compliance and finance reporting support",
    ],
    addOnSubscriptions: ["Polling & Message Lab", "Volunteer Ops Cloud", "Finance Compliance Desk"],
  },
  {
    id: "low-tier-mayor-modeled",
    label: "Low-Tier Mayor",
    candidateName: "Regional Mayor Demo",
    benchmarkType: "modeled package",
    election: "Smaller-city mayoral run",
    cycleMonths: 7,
    targetedVoters: 65000,
    expectedVotes: 18000,
    monthlyCoreCents: 189000,
    oneTimeLaunchCents: 96000,
    addOnValueCents: 48000,
    mustHaveServices: [
      "Campaign website and donation funnel",
      "Core messaging and literature production",
      "Social media management",
      "Volunteer and canvass coordination",
      "Election-week GOTV text and email plan",
    ],
    recommendedServices: [
      "Basic fundraising automation",
      "Issue tracker and weekly sentiment reporting",
      "Candidate media training",
    ],
    addOnSubscriptions: ["Debate Prep Sprint", "Fundraising Email Engine"],
  },
  {
    id: "top-tier-councillor-modeled",
    label: "Top-Tier Councillor",
    candidateName: "Metro Councillor Demo",
    benchmarkType: "modeled package",
    election: "Competitive urban ward race",
    cycleMonths: 7,
    targetedVoters: 22000,
    expectedVotes: 7500,
    monthlyCoreCents: 164000,
    oneTimeLaunchCents: 78500,
    addOnValueCents: 54000,
    mustHaveServices: [
      "Ward strategy and issue positioning",
      "Canvass program with route management",
      "Digital ads and email capture",
      "Volunteer scheduling and scripts",
      "Election-day field dashboard",
    ],
    recommendedServices: [
      "Micro-targeted persuasion ads",
      "Direct mail production oversight",
      "Weekly analytics scorecards",
    ],
    addOnSubscriptions: ["Direct Mail Management", "Neighbourhood Data Reporting"],
  },
  {
    id: "low-tier-councillor-modeled",
    label: "Low-Tier Councillor",
    candidateName: "Neighbourhood Councillor Demo",
    benchmarkType: "modeled package",
    election: "Lean local ward race",
    cycleMonths: 6,
    targetedVoters: 9000,
    expectedVotes: 2600,
    monthlyCoreCents: 92000,
    oneTimeLaunchCents: 42000,
    addOnValueCents: 24000,
    mustHaveServices: [
      "Starter website and candidate profile",
      "Printed literature and sign plan",
      "Volunteer texting and canvass sheets",
      "Basic social posting calendar",
      "Election-day checklist and reporting",
    ],
    recommendedServices: [
      "Neighbourhood endorsements kit",
      "Low-cost fundraising pages",
      "Doorstep issue logging",
    ],
    addOnSubscriptions: ["Community Endorsement Pack", "Volunteer Texting Pack"],
  },
].map((profile) => {
  const fullCampaignValueCents = profile.monthlyCoreCents * profile.cycleMonths + profile.oneTimeLaunchCents + profile.addOnValueCents

  return {
    ...profile,
    fullCampaignValueCents,
    costPerTargetedVoterCents: Math.round(fullCampaignValueCents / profile.targetedVoters),
    costPerExpectedVoteCents: Math.round(fullCampaignValueCents / profile.expectedVotes),
  }
})

const onboardingScenarios = [
  {
    id: "ward-challenger-demo",
    candidateName: "Maria Rodriguez",
    profile: "Ward campaign challenger model",
    cycleMonths: 7,
    targetedVoters: 12000,
    expectedVotes: 4100,
    monthlyRetainerCents: 159000,
    launchProjectCents: 159000,
  },
  {
    id: "citywide-issue-demo",
    candidateName: "James Wilson",
    profile: "Mayoral or city-wide issue campaign model",
    cycleMonths: 8,
    targetedVoters: 18000,
    expectedVotes: 6100,
    monthlyRetainerCents: 116500,
    launchProjectCents: 189000,
  },
].map((scenario) => {
  const fullCampaignValueCents = scenario.monthlyRetainerCents * scenario.cycleMonths + scenario.launchProjectCents

  return {
    ...scenario,
    fullCampaignValueCents,
    costPerTargetedVoterCents: Math.round(fullCampaignValueCents / scenario.targetedVoters),
    costPerExpectedVoteCents: Math.round(fullCampaignValueCents / scenario.expectedVotes),
  }
})

export async function GET() {
  return NextResponse.json({
    generatedAt: new Date().toISOString(),
    model: {
      defaultCampaignCycleMonths: DEFAULT_CAMPAIGN_CYCLE_MONTHS,
      formula: "fullCampaignValue = (monthlyRetainer * cycleMonths) + launchProjectValue",
      explanation: [
        "Subscriptions represent recurring monthly service lines inside a full campaign account.",
        "Orders represent one-time launch or production work such as websites, creative builds, or crisis setup.",
        "Campaigns, tasks, meetings, files, and chat are the delivery layer used after the client signs.",
        "Workspace programs are smaller execution tracks inside the larger full-campaign account.",
        "Official filing data should stay separate from CRM service operations and be used only as an external benchmark.",
      ],
    },
    officialBenchmarks,
    fullCampaignProfiles,
    onboardingScenarios,
  })
}
