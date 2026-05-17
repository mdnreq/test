import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle2, UserPlus, Users } from "lucide-react"

export default async function CandidatesPage() {
  const supabase = await createClient()

  const { data: candidates } = await supabase
    .from("candidates")
    .select(`
      *,
      municipality:municipalities(name, province)
    `)
    .eq("verified", true)
    .order("created_at", { ascending: false })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="container mx-auto max-w-7xl p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold">Verified Candidate Registry</h1>
          <p className="text-muted-foreground mt-2">
            Browse verified candidates across all municipalities in Ontario, PEI, Manitoba, New Brunswick, Northwest
            Territories, British Columbia, and Saskatchewan
          </p>
        </div>
        {user && (
          <Button asChild size="lg">
            <Link href="/candidates/register">
              <UserPlus className="mr-2 h-4 w-4" />
              Register as Candidate
            </Link>
          </Button>
        )}
      </div>

      {(!candidates || candidates.length === 0) && (
        <div className="flex flex-col items-center justify-center py-24 px-4">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full" />
            <Users className="relative h-24 w-24 text-blue-500" />
          </div>

          <h2 className="text-3xl font-bold mb-4">Verified Candidates Across North America</h2>
          <p className="text-muted-foreground text-center max-w-2xl mb-8">
            We work with verified candidates across all major regions including Ontario, PEI, Manitoba, New Brunswick, Northwest Territories, British Columbia, Saskatchewan, Nova Scotia, and federal candidates. Due to privacy and conflict of interest protections, we don't publicly list candidate details. Our verified portfolio includes recent federal candidates, previous-term incumbents (such as Andy Fillmore in Nova Scotia), and many potential candidates across the globe. Candidate portfolios can be demonstrated upon request for qualified partnerships.
          </p>

          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-6 max-w-2xl w-full mb-8">
            <p className="text-sm text-blue-100">
              <span className="font-semibold text-blue-300">Privacy First Approach:</span> We protect candidate identities and campaign strategies. To learn about our verified candidate network and explore partnership opportunities, contact our team directly.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            {user ? (
              <Button asChild size="lg" className="text-lg px-8">
                <Link href="/candidates/register">
                  <UserPlus className="mr-2 h-5 w-5" />
                  Register as Candidate
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild size="lg" className="text-lg px-8">
                  <Link href="/auth/sign-up">
                    <UserPlus className="mr-2 h-5 w-5" />
                    Sign Up to Register
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-lg px-8 bg-transparent">
                  <Link href="/auth/login">Log In</Link>
                </Button>
              </>
            )}
          </div>

          <Card className="max-w-2xl w-full bg-muted/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                Verified Candidate Network
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-blue-500 mt-2" />
                <p className="text-sm">Coverage across 1,700+ municipalities in Canada and expansion globally</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-blue-500 mt-2" />
                <p className="text-sm">Verified candidates from federal, provincial, and municipal levels</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-blue-500 mt-2" />
                <p className="text-sm">Privacy-protected partnership model</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-blue-500 mt-2" />
                <p className="text-sm">Portfolio demonstrations available upon request</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-blue-500 mt-2" />
                <p className="text-sm">Full campaign service suite and AI-powered recommendations</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {candidates && candidates.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {candidates.map((candidate) => (
            <Card key={candidate.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{candidate.full_name}</CardTitle>
                    <CardDescription>
                      {candidate.municipality?.name}, {candidate.municipality?.province}
                    </CardDescription>
                  </div>
                  {candidate.verified && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Verified
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium">Position</p>
                    <p className="text-sm text-muted-foreground">{candidate.position}</p>
                  </div>
                  {candidate.platform_summary && (
                    <div>
                      <p className="text-sm font-medium">Platform Summary</p>
                      <p className="text-sm text-muted-foreground line-clamp-3">{candidate.platform_summary}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Registered {new Date(candidate.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
