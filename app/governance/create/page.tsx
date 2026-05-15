import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { CreateProposalForm } from "@/components/create-proposal-form"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === "true"

export default async function CreateProposalPage() {
  if (isStaticExport) {
    return (
      <div className="container mx-auto max-w-2xl p-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold">Create Governance Proposal</h1>
            <p className="mt-2 text-muted-foreground">Static export preview. Sign in to submit governance proposals in the full app.</p>
          </div>

          <Button asChild size="lg">
            <Link href="/auth/login">Sign In to Continue</Link>
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
          <h1 className="text-4xl font-bold">Create Governance Proposal</h1>
          <p className="text-muted-foreground mt-2">Submit a proposal for community voting</p>
        </div>

        <CreateProposalForm municipalities={municipalities || []} userId={user.id} />
      </div>
    </div>
  )
}
