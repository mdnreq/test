import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, Users } from "lucide-react"
import { loadLocalMunicipalityData, type MunicipalityRecord } from "./local-municipality-data"

function calculateVotesAt16Impact(currentTurnout: number) {
  // Youth (16-18) typically adds 2-3% to eligible voter base
  // With 2.5x lifetime engagement multiplier, projected increase is 5-8%
  const baseIncrease = 6.5 // Average 6.5% turnout increase
  const projectedTurnout = Math.min(currentTurnout + baseIncrease, 95) // Cap at 95%
  return {
    projected: projectedTurnout,
    increase: projectedTurnout - currentTurnout,
    retentionMultiplier: 2.5,
  }
}

type MunicipalityView = MunicipalityRecord & {
  voter_turnout_2021?: number
  voter_turnout_2025?: number
  voter_turnout_2026?: number
  voter_turnout_2014?: number
  election_date?: string
}

const TURNOUT_YEAR_KEYS = [2026, 2025, 2022, 2021, 2018, 2014] as const

function getTurnoutValue(municipality: MunicipalityView, year: (typeof TURNOUT_YEAR_KEYS)[number]) {
  const value = municipality[`voter_turnout_${year}` as keyof MunicipalityView]
  return typeof value === "number" ? value : undefined
}

function getTurnoutYears(municipality: MunicipalityView) {
  return TURNOUT_YEAR_KEYS.filter((year) => typeof getTurnoutValue(municipality, year) === "number")
}

function getElectionYear(municipality: MunicipalityView) {
  if (!municipality.election_date) return undefined

  const match = municipality.election_date.match(/^(\d{4})-/)
  if (!match) return undefined

  const year = Number(match[1])
  return Number.isNaN(year) ? undefined : year
}

function renderMunicipalityCard(municipality: MunicipalityView, projectionLabel = "WITH VOTES AT 16") {
  const turnoutYears = getTurnoutYears(municipality)
  const electionYear = getElectionYear(municipality)
  const rawLatestYear = turnoutYears[0]
  const latestYear = electionYear && rawLatestYear && electionYear > rawLatestYear ? electionYear : rawLatestYear
  const previousYear = turnoutYears[1]
  const latestTurnout = rawLatestYear ? getTurnoutValue(municipality, rawLatestYear) : undefined
  const previousTurnout = previousYear ? getTurnoutValue(municipality, previousYear) : undefined
  const impact = calculateVotesAt16Impact(latestTurnout || 0)

  return (
    <Card key={municipality.id}>
      <CardHeader>
        <CardTitle>{municipality.name}</CardTitle>
        <CardDescription>
          {municipality.type}
          {municipality.population && ` · Population: ${municipality.population.toLocaleString()}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {latestTurnout !== undefined && latestYear && (
            <div className="flex justify-between">
              <span className="text-sm">{latestYear} Turnout</span>
              <Badge variant="secondary">{latestTurnout}%</Badge>
            </div>
          )}
          {previousTurnout !== undefined && previousYear && (
            <div className="flex justify-between">
              <span className="text-sm">{previousYear} Turnout</span>
              <Badge variant="outline">{previousTurnout}%</Badge>
            </div>
          )}
          {latestTurnout !== undefined && previousTurnout !== undefined && latestYear && previousYear && (
            <div className="pt-2 border-t">
              <span className="text-sm text-muted-foreground">
                Change ({previousYear} to {latestYear}):{" "}
                <span className={latestTurnout - previousTurnout > 0 ? "text-green-600" : "text-red-600"}>
                  {(latestTurnout - previousTurnout).toFixed(1)}%
                </span>
              </span>
            </div>
          )}

          <div className="mt-3 p-3 bg-blue-950/30 rounded-lg border border-blue-800/50">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-blue-400" />
              <span className="text-xs font-semibold text-blue-300">{projectionLabel}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Projected Turnout</span>
              <Badge className="bg-blue-500 hover:bg-blue-600">{impact.projected.toFixed(1)}%</Badge>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs text-muted-foreground">Increase</span>
              <span className="text-xs text-green-400 font-medium">+{impact.increase.toFixed(1)}%</span>
            </div>
            <div className="mt-2 text-xs text-blue-200">{impact.retentionMultiplier}x retention multiplier</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default async function MunicipalitiesPage() {
  const supabase = await createClient()

  const { data: ontarioMunicipalities } = await supabase
    .from("municipalities")
    .select("*")
    .eq("province", "Ontario")
    .order("name")

  const { data: peiMunicipalities } = await supabase
    .from("municipalities")
    .select("*")
    .eq("province", "PEI")
    .order("name")

  const { data: manitobaMunicipalities } = await supabase
    .from("municipalities")
    .select("*")
    .eq("province", "Manitoba")
    .order("name")

  const { data: nbMunicipalities } = await supabase
    .from("municipalities")
    .select("*")
    .eq("province", "New Brunswick")
    .order("name")

  const { data: nwtMunicipalities } = await supabase
    .from("municipalities")
    .select("*")
    .eq("province", "Northwest Territories")
    .order("name")

  const { data: bcMunicipalities } = await supabase
    .from("municipalities")
    .select("*")
    .eq("province", "British Columbia")
    .order("name")

  const { data: skMunicipalities } = await supabase
    .from("municipalities")
    .select("*")
    .eq("province", "Saskatchewan")
    .order("name")

  const realWorldCounts = {
    ontario: 444, // Ontario Open Data 2024
    pei: 57, // PEI Municipal Affairs
    manitoba: 137, // Association of Manitoba Municipalities
    nb: 77, // Post-2023 local governance reform
    nwt: 33, // NWT MACA
    bc: 161, // BC Stats 2024
    sk: 781, // Saskatchewan SORC 2024
  }

  const newBrunswick2026Election = {
    dateLabel: "May 11, 2026",
    turnout: 39.8,
    votesAt16Implemented: false,
  }

  const localMunicipalities = await loadLocalMunicipalityData()

  const displayedOntarioMunicipalities = ontarioMunicipalities?.length ? ontarioMunicipalities : localMunicipalities.Ontario
  const displayedPeiMunicipalities = peiMunicipalities?.length ? peiMunicipalities : localMunicipalities.PEI
  const displayedManitobaMunicipalities = manitobaMunicipalities?.length ? manitobaMunicipalities : localMunicipalities.Manitoba
  const displayedNbMunicipalities = nbMunicipalities?.length ? nbMunicipalities : localMunicipalities["New Brunswick"]
  const displayedNwtMunicipalities = nwtMunicipalities?.length ? nwtMunicipalities : localMunicipalities["Northwest Territories"]
  const displayedBcMunicipalities = bcMunicipalities?.length ? bcMunicipalities : localMunicipalities["British Columbia"]
  const displayedSkMunicipalities = skMunicipalities?.length ? skMunicipalities : localMunicipalities.Saskatchewan

  const hasLiveMunicipalityData = Boolean(
    ontarioMunicipalities?.length ||
      peiMunicipalities?.length ||
      manitobaMunicipalities?.length ||
      nbMunicipalities?.length ||
      nwtMunicipalities?.length ||
      bcMunicipalities?.length ||
      skMunicipalities?.length,
  )

  const totalMunicipalities =
    hasLiveMunicipalityData
      ? displayedOntarioMunicipalities.length +
        displayedPeiMunicipalities.length +
        displayedManitobaMunicipalities.length +
        displayedNbMunicipalities.length +
        displayedNwtMunicipalities.length +
        displayedBcMunicipalities.length +
        displayedSkMunicipalities.length
      : Object.values(realWorldCounts).reduce((sum, count) => sum + count, 0)

  return (
    <div className="container mx-auto max-w-7xl p-6 space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Municipalities</h1>
        <p className="text-muted-foreground mt-2">
          Explore voter data across {totalMunicipalities} municipalities in Ontario, PEI, Manitoba, New Brunswick,
          Northwest Territories, British Columbia, and Saskatchewan
        </p>
        {!hasLiveMunicipalityData && (
          <p className="text-sm text-muted-foreground mt-2">
            Showing the local municipality dataset compiled from repository SQL seeds. Where the repo only includes partial named rows, the remaining entries are filled to the full provincial count locally.
          </p>
        )}
      </div>

      <Card className="bg-gradient-to-br from-blue-950 to-background border-blue-800">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">Votes at 16 Impact Analysis</CardTitle>
              <CardDescription className="text-blue-200">
                Projected turnout increase with 16-year-old voting rights
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-background/50 rounded-lg border border-blue-800/50">
              <div className="text-3xl font-bold text-blue-400">+6.5%</div>
              <div className="text-sm text-muted-foreground">Average Turnout Increase</div>
            </div>
            <div className="p-4 bg-background/50 rounded-lg border border-blue-800/50">
              <div className="text-3xl font-bold text-blue-400">2.5x</div>
              <div className="text-sm text-muted-foreground">Lifetime Engagement Multiplier</div>
            </div>
            <div className="p-4 bg-background/50 rounded-lg border border-blue-800/50">
              <div className="text-3xl font-bold text-blue-400">{totalMunicipalities}</div>
              <div className="text-sm text-muted-foreground">Municipalities Impacted</div>
            </div>
          </div>
          <p className="text-sm text-blue-100">
            Research shows voters who start at 16 maintain 2.5x higher engagement through age 35, creating a retention
            lock-in that reverses the turnout crisis.
          </p>
        </CardContent>
      </Card>

      <Tabs defaultValue="ontario" className="w-full">
        <TabsList className="w-full flex flex-wrap gap-2 h-auto justify-start p-2 md:grid md:grid-cols-7">
          <TabsTrigger value="ontario" className="flex-shrink-0">
            Ontario ({realWorldCounts.ontario})
          </TabsTrigger>
          <TabsTrigger value="pei" className="flex-shrink-0">
            PEI ({realWorldCounts.pei})
          </TabsTrigger>
          <TabsTrigger value="manitoba" className="flex-shrink-0">
            Manitoba ({realWorldCounts.manitoba})
          </TabsTrigger>
          <TabsTrigger value="nb" className="flex-shrink-0">
            New Brunswick ({realWorldCounts.nb})
          </TabsTrigger>
          <TabsTrigger value="nwt" className="flex-shrink-0">
            NWT ({realWorldCounts.nwt})
          </TabsTrigger>
          <TabsTrigger value="bc" className="flex-shrink-0">
            BC ({realWorldCounts.bc})
          </TabsTrigger>
          <TabsTrigger value="sk" className="flex-shrink-0">
            SK ({realWorldCounts.sk})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ontario" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {displayedOntarioMunicipalities.map((municipality) => renderMunicipalityCard(municipality))}
          </div>
        </TabsContent>

        <TabsContent value="pei" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {displayedPeiMunicipalities.map((municipality) => renderMunicipalityCard(municipality))}
          </div>
        </TabsContent>

        <TabsContent value="manitoba" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {displayedManitobaMunicipalities.map((municipality) => renderMunicipalityCard(municipality))}
          </div>
        </TabsContent>

        <TabsContent value="nb" className="space-y-6">
          <Card className="border-amber-700/50 bg-amber-950/20">
            <CardHeader>
              <CardTitle className="text-xl">New Brunswick 2026 Election Update</CardTitle>
              <CardDescription>
                Elections NB ran province-wide local government elections on {newBrunswick2026Election.dateLabel}.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border border-amber-700/40 bg-background/60 p-4">
                <div className="text-sm text-muted-foreground">Province-wide turnout</div>
                <div className="text-2xl font-semibold">{newBrunswick2026Election.turnout}%</div>
              </div>
              <div className="rounded-lg border border-amber-700/40 bg-background/60 p-4">
                <div className="text-sm text-muted-foreground">Votes at 16 status</div>
                <div className="text-2xl font-semibold">
                  {newBrunswick2026Election.votesAt16Implemented ? "Implemented" : "Not implemented"}
                </div>
              </div>
              <div className="rounded-lg border border-amber-700/40 bg-background/60 p-4">
                <div className="text-sm text-muted-foreground">Interpretation</div>
                <div className="text-sm leading-6">
                  New Brunswick still posted strong local election participation without lowering the voting age, so this tab now treats votes at 16 as a next-cycle scenario rather than a completed reform.
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {displayedNbMunicipalities.map((municipality) =>
              renderMunicipalityCard(municipality, "IF NB ADOPTS VOTES AT 16 NEXT CYCLE"),
            )}
          </div>
        </TabsContent>

        <TabsContent value="nwt" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {displayedNwtMunicipalities.map((municipality) => renderMunicipalityCard(municipality))}
          </div>
        </TabsContent>

        <TabsContent value="bc" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {displayedBcMunicipalities.map((municipality) => renderMunicipalityCard(municipality))}
          </div>
        </TabsContent>

        <TabsContent value="sk" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {displayedSkMunicipalities.map((municipality) => renderMunicipalityCard(municipality))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
