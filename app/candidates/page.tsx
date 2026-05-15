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

          <h2 className="text-3xl font-bold mb-4">No Verified Candidates Yet</h2>
          <p className="text-muted-foreground text-center max-w-md mb-8">
            Be the first to join our verified candidate registry and connect with voters across 1,700+ municipalities in
            Ontario, PEI, Manitoba, New Brunswick, Northwest Territories, British Columbia, and Saskatchewan.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            {user ? (
              <Button asChild size="lg" className="text-lg px-8">
                <Link href="/candidates/register">
                  <UserPlus className="mr-2 h-5 w-5" />
                  Register Now
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
                Benefits of Verification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-blue-500 mt-2" />
                <p className="text-sm">Increased visibility across 1,700+ municipalities</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-blue-500 mt-2" />
                <p className="text-sm">Verified badge to build voter trust</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-blue-500 mt-2" />
                <p className="text-sm">Platform to share your vision and policies</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-blue-500 mt-2" />
                <p className="text-sm">Direct connection with engaged voters</p>
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
