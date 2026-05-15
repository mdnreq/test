import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const supabase = await createClient()

  // Check if user is admin
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const formData = await request.formData()
  const candidateId = formData.get("candidateId") as string
  const action = formData.get("action") as string

  if (action === "approve") {
    const { error } = await supabase
      .from("candidates")
      .update({
        verified: true,
        verified_at: new Date().toISOString(),
        verified_by: user.id,
      })
      .eq("id", candidateId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.redirect(new URL("/admin/verify-candidates", request.url))
  } else if (action === "reject") {
    const { error } = await supabase.from("candidates").delete().eq("id", candidateId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.redirect(new URL("/admin/verify-candidates", request.url))
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 })
}
