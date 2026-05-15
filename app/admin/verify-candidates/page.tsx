import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, Mail, MapPin, Calendar } from "lucide-react"
import { redirect } from "next/navigation"

const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === "true"

export default async function VerifyCandidatesPage() {
  if (isStaticExport) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="mx-auto max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle>Candidate Verification Dashboard</CardTitle>
              <CardDescription>Verification actions are disabled in the static export build.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                The static export includes the review surface, but approval and rejection require server actions that are only available in the full Next.js app.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const supabase = await createClient()

  // Check if user is admin (you can add admin role checking here)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch pending candidates
  const { data: candidates } = await supabase
    .from("candidates")
    .select(`
      *,
      municipalities (
        name,
        province
      )
    `)
    .eq("verified", false)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">Candidate Verification Dashboard</h1>
          <p className="text-muted-foreground mt-2">Review and verify candidates using government email addresses</p>
        </div>

        <div className="grid gap-6">
          {candidates && candidates.length > 0 ? (
            candidates.map((candidate) => (
              <Card key={candidate.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl">{candidate.full_name}</CardTitle>
                      <CardDescription className="mt-2 flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {candidate.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {candidate.municipalities?.name}, {candidate.municipalities?.province}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {candidate.position}
                        </span>
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-amber-500/10 text-amber-500">
                      Pending Verification
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Platform Summary</h3>
                      <p className="text-sm text-muted-foreground">{candidate.platform_summary}</p>
                    </div>

                    <div className="flex gap-3">
                      <form action="/api/verify-candidate" method="POST">
                        <input type="hidden" name="candidateId" value={candidate.id} />
                        <input type="hidden" name="action" value="approve" />
                        <Button type="submit" className="bg-green-600 hover:bg-green-700">
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Verify Candidate
                        </Button>
                      </form>

                      <form action="/api/verify-candidate" method="POST">
                        <input type="hidden" name="candidateId" value={candidate.id} />
                        <input type="hidden" name="action" value="reject" />
                        <Button type="submit" variant="destructive">
                          <XCircle className="mr-2 h-4 w-4" />
                          Reject
                        </Button>
                      </form>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-green-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">All caught up!</h3>
                <p className="text-muted-foreground">No pending candidate verifications at this time.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
