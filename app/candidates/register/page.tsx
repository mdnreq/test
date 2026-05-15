import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { CandidateRegistrationForm } from "@/components/candidate-registration-form"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === "true"

export default async function RegisterCandidatePage() {
  if (isStaticExport) {
    return (
      <div className="container mx-auto max-w-2xl p-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold">Register as Candidate</h1>
            <p className="mt-2 text-muted-foreground">Static export preview. Sign in to submit candidate registration in the full app.</p>
          </div>

          <Button asChild size="lg">
            <Link href="/auth/sign-up">Sign Up to Register</Link>
          </Button>
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

  const { data: municipalities } = await supabase.from("municipalities").select("*").order("name")

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold">Register as Candidate</h1>
          <p className="text-muted-foreground mt-2">Submit your candidacy information for verification</p>
        </div>

        <CandidateRegistrationForm municipalities={municipalities || []} userId={user.id} />
      </div>
    </div>
  )
}
