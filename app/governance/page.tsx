import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DAOGovernanceHub } from "@/components/dao-governance-hub"

const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === "true"

export const metadata = {
  title: "DAO Governance | Next Majority",
  description: "Participate in decentralized governance - vote on proposals, earn $NEXT tokens, and shape the future of youth democracy"
}

export default async function GovernancePage() {
  if (isStaticExport) {
    return (
      <div className="container mx-auto max-w-5xl p-6">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
          <h1 className="text-4xl font-bold">DAO Governance</h1>
          <p className="mt-3 text-muted-foreground">
            Static export preview. Proposal creation, voting history, and member-specific governance data are available in the full authenticated app.
          </p>
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

  // Fetch user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  // Fetch all governance proposals
  const { data: proposals } = await supabase
    .from("governance_proposals")
    .select(`
      *,
      municipality:municipalities(name, province)
    `)
    .order("created_at", { ascending: false })

  // Fetch user's votes
  const { data: userVotes } = await supabase
    .from("proposal_votes")
    .select("proposal_id, vote")
    .eq("user_id", user.id)

  // Fetch municipalities for proposal creation
  const { data: municipalities } = await supabase
    .from("municipalities")
    .select("id, name, province")
    .order("name")

  // Get creator info
  const creatorIds = proposals?.map((p) => p.created_by).filter(Boolean) || []
  const { data: creators } = await supabase
    .from("profiles")
    .select("id, full_name")
    .in("id", creatorIds)

  return (
    <DAOGovernanceHub 
      user={user}
      profile={profile}
      proposals={proposals || []}
      userVotes={userVotes || []}
      municipalities={municipalities || []}
      creators={creators || []}
    />
  )
}
