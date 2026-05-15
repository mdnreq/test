import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, MapPin } from "lucide-react"

const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === "true"

export default async function DashboardPage() {
  if (isStaticExport) {
    return (
      <div className="container mx-auto max-w-7xl space-y-8 p-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight">MUNICIPAL DAO DASHBOARD</h1>
          <p className="mt-2 text-muted-foreground">Static export preview. Sign in to access personalized dashboard data in the full app.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            ["Ontario", "/dashboard/ontario"],
            ["Prince Edward Island", "/dashboard/pei"],
            ["Manitoba", "/dashboard/manitoba"],
            ["New Brunswick", "/dashboard/new-brunswick"],
            ["NWT", "/dashboard/northwest-territories"],
            ["British Columbia", "/dashboard/british-columbia"],
            ["Saskatchewan", "/dashboard/saskatchewan"],
          ].map(([label, href]) => (
            <Link key={href} href={href} className="group rounded-xl border border-blue-600/20 bg-gradient-to-br from-blue-600/10 to-purple-600/10 p-8 transition hover:border-blue-600/40">
              <div className="mb-4 flex items-center justify-between">
                <MapPin className="h-10 w-10 text-blue-500" />
                <ArrowRight className="h-6 w-6 text-muted-foreground transition group-hover:text-blue-500" />
              </div>
              <h2 className="text-3xl font-black mb-2">{label}</h2>
              <p className="text-muted-foreground">Open province dashboard</p>
            </Link>
          ))}
        </div>
      </div>
    )
  }

  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const { data: municipalities } = await supabase
    .from("municipalities")
    .select("*")
    .order("voter_turnout_2022", { ascending: false })
    .limit(10)

  const { data: activeProposals } = await supabase
    .from("governance_proposals")
    .select("*")
    .eq("status", "Active")
    .order("created_at", { ascending: false })
    .limit(5)

  const { data: candidates } = await supabase
    .from("candidates")
    .select("*")
    .eq("verified", true)
    .order("created_at", { ascending: false })
    .limit(6)

  return (
    <div className="container mx-auto max-w-7xl p-6 space-y-8">
      <div>
        <h1 className="text-4xl font-black tracking-tight">MUNICIPAL DAO DASHBOARD</h1>
        <p className="text-muted-foreground mt-2">Welcome back, {profile?.full_name || user.email}</p>
      </div>

      {/* Province Selection */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          href="/dashboard/ontario"
          className="group bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-blue-600/20 hover:border-blue-600/40 rounded-xl p-8 transition"
        >
          <div className="flex items-center justify-between mb-4">
            <MapPin className="h-10 w-10 text-blue-500" />
            <ArrowRight className="h-6 w-6 text-muted-foreground group-hover:text-blue-500 transition" />
          </div>
          <h2 className="text-3xl font-black mb-2">ONTARIO</h2>
          <p className="text-muted-foreground mb-4">444 municipalities • Next election: Oct 2026</p>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-2xl font-bold text-blue-500">32.9%</div>
              <div className="text-muted-foreground">Turnout Floor</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-500">4:1</div>
              <div className="text-muted-foreground">Senior/Youth</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-500">72%</div>
              <div className="text-muted-foreground">Info Friction</div>
            </div>
          </div>
        </Link>

        <Link
          href="/dashboard/pei"
          className="group bg-gradient-to-br from-cyan-600/10 to-blue-600/10 border border-cyan-600/20 hover:border-cyan-600/40 rounded-xl p-8 transition"
        >
          <div className="flex items-center justify-between mb-4">
            <MapPin className="h-10 w-10 text-cyan-500" />
            <ArrowRight className="h-6 w-6 text-muted-foreground group-hover:text-cyan-500 transition" />
          </div>
          <h2 className="text-3xl font-black mb-2">PRINCE EDWARD ISLAND</h2>
          <p className="text-muted-foreground mb-4">57 municipalities • Next election: Nov 2, 2026</p>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-2xl font-bold text-cyan-500">70%</div>
              <div className="text-muted-foreground">Pop. Coverage</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-cyan-500">44y</div>
              <div className="text-muted-foreground">Median Age</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-cyan-500">14K</div>
              <div className="text-muted-foreground">Age 20-34</div>
            </div>
          </div>
        </Link>

        <Link
          href="/dashboard/manitoba"
          className="group bg-gradient-to-br from-amber-600/10 to-orange-600/10 border border-amber-600/20 hover:border-amber-600/40 rounded-xl p-8 transition"
        >
          <div className="flex items-center justify-between mb-4">
            <MapPin className="h-10 w-10 text-amber-500" />
            <ArrowRight className="h-6 w-6 text-muted-foreground group-hover:text-amber-500 transition" />
          </div>
          <h2 className="text-3xl font-black mb-2">MANITOBA</h2>
          <p className="text-muted-foreground mb-4">137 municipalities • Next election: Oct 28, 2026</p>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-2xl font-bold text-amber-500">28.5%</div>
              <div className="text-muted-foreground">Turnout Floor</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-500">3:2</div>
              <div className="text-muted-foreground">Senior/Youth</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-500">68%</div>
              <div className="text-muted-foreground">Info Friction</div>
            </div>
          </div>
        </Link>

        <Link
          href="/dashboard/new-brunswick"
          className="group bg-gradient-to-br from-red-600/10 to-rose-600/10 border border-red-600/20 hover:border-red-600/40 rounded-xl p-8 transition"
        >
          <div className="flex items-center justify-between mb-4">
            <MapPin className="h-10 w-10 text-red-500" />
            <ArrowRight className="h-6 w-6 text-muted-foreground group-hover:text-red-500 transition" />
          </div>
          <h2 className="text-3xl font-black mb-2">NEW BRUNSWICK</h2>
          <p className="text-muted-foreground mb-4">77 municipalities • Next election: May 10, 2026</p>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-2xl font-bold text-red-500">35%</div>
              <div className="text-muted-foreground">Turnout Floor</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-500">3:1</div>
              <div className="text-muted-foreground">Senior/Youth</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-500">70%</div>
              <div className="text-muted-foreground">Info Friction</div>
            </div>
          </div>
        </Link>

        <Link
          href="/dashboard/northwest-territories"
          className="group bg-gradient-to-br from-slate-600/10 to-zinc-600/10 border border-slate-600/20 hover:border-slate-600/40 rounded-xl p-8 transition"
        >
          <div className="flex items-center justify-between mb-4">
            <MapPin className="h-10 w-10 text-slate-400" />
            <ArrowRight className="h-6 w-6 text-muted-foreground group-hover:text-slate-400 transition" />
          </div>
          <h2 className="text-3xl font-black mb-2">NWT</h2>
          <p className="text-muted-foreground mb-4">33 communities • Next election: Dec 14, 2026</p>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-2xl font-bold text-slate-400">25%</div>
              <div className="text-muted-foreground">Turnout Floor</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-400">2:1</div>
              <div className="text-muted-foreground">Senior/Youth</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-400">65%</div>
              <div className="text-muted-foreground">Info Friction</div>
            </div>
          </div>
        </Link>

        <Link
          href="/dashboard/british-columbia"
          className="group bg-gradient-to-br from-green-600/10 to-emerald-600/10 border border-green-600/20 hover:border-green-600/40 rounded-xl p-8 transition"
        >
          <div className="flex items-center justify-between mb-4">
            <MapPin className="h-10 w-10 text-green-500" />
            <ArrowRight className="h-6 w-6 text-muted-foreground group-hover:text-green-500 transition" />
          </div>
          <h2 className="text-3xl font-black mb-2">BRITISH COLUMBIA</h2>
          <p className="text-muted-foreground mb-4">161 municipalities • Next election: Oct 15, 2026</p>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-2xl font-bold text-green-500">29.7%</div>
              <div className="text-muted-foreground">Turnout Floor</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-500">3:1</div>
              <div className="text-muted-foreground">Senior/Youth</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-500">64%</div>
              <div className="text-muted-foreground">Info Friction</div>
            </div>
          </div>
        </Link>

        <Link
          href="/dashboard/saskatchewan"
          className="group bg-gradient-to-br from-yellow-600/10 to-amber-600/10 border border-yellow-600/20 hover:border-yellow-600/40 rounded-xl p-8 transition"
        >
          <div className="flex items-center justify-between mb-4">
            <MapPin className="h-10 w-10 text-yellow-500" />
            <ArrowRight className="h-6 w-6 text-muted-foreground group-hover:text-yellow-500 transition" />
          </div>
          <h2 className="text-3xl font-black mb-2">SASKATCHEWAN</h2>
          <p className="text-muted-foreground mb-4">781 municipalities • Next election: Nov 13, 2026</p>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-2xl font-bold text-yellow-500">31.2%</div>
              <div className="text-muted-foreground">Turnout Floor</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-500">3:2</div>
              <div className="text-muted-foreground">Senior/Youth</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-500">66%</div>
              <div className="text-muted-foreground">Info Friction</div>
            </div>
          </div>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">{municipalities?.length || 0}</CardTitle>
            <CardDescription>Active Municipalities</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">{activeProposals?.length || 0}</CardTitle>
            <CardDescription>Active Proposals</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">{candidates?.length || 0}</CardTitle>
            <CardDescription>Verified Candidates</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Top Municipalities by Turnout</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/municipalities">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {municipalities?.slice(0, 5).map((municipality) => (
                <div key={municipality.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{municipality.name}</p>
                    <p className="text-sm text-muted-foreground">{municipality.province}</p>
                  </div>
                  <Badge variant="secondary">{municipality.voter_turnout_2022}%</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Active Governance Proposals</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/governance">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeProposals?.map((proposal) => (
                <div key={proposal.id} className="space-y-1">
                  <p className="font-medium line-clamp-1">{proposal.title}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {proposal.proposal_type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {proposal.votes_for} for · {proposal.votes_against} against
                    </span>
                  </div>
                </div>
              ))}
              {(!activeProposals || activeProposals.length === 0) && (
                <p className="text-sm text-muted-foreground">No active proposals</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Recent Verified Candidates</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/candidates">View All</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {candidates?.map((candidate) => (
              <div key={candidate.id} className="p-4 border rounded-lg">
                <p className="font-medium">{candidate.full_name}</p>
                <p className="text-sm text-muted-foreground">{candidate.position}</p>
                <Badge variant="secondary" className="mt-2 bg-green-100 text-green-800">
                  Verified
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
