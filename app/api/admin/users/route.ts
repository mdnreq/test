import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

// Middleware to check admin access
async function checkAdmin(supabase: any, userId: string) {
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("primary_role, secondary_roles")
    .eq("id", userId)
    .single()

  return profile?.primary_role === "admin" || 
    (profile?.secondary_roles && profile.secondary_roles.includes("admin"))
}

// GET - List all users (admin only)
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const isAdmin = await checkAdmin(supabase, user.id)
    if (!isAdmin) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const url = new URL(request.url)
    const type = url.searchParams.get("type") // candidate, voter, admin
    const status = url.searchParams.get("status") // active, pending, suspended

    let query = supabase
      .from("user_profiles")
      .select(`
        id,
        full_name,
        email,
        primary_role,
        secondary_roles,
        status,
        created_at,
        candidate_services (
          id,
          status,
          service_id
        ),
        orders (
          id,
          status,
          total_amount
        )
      `)
      .order("created_at", { ascending: false })

    if (type && type !== "all") {
      query = query.eq("primary_role", type)
    }

    if (status && status !== "all") {
      query = query.eq("status", status)
    }

    const { data: users, error } = await query

    if (error) {
      console.error("[v0] Error fetching users:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Transform data to include counts
    const transformedUsers = users?.map(u => ({
      ...u,
      subscriptions_count: u.candidate_services?.filter((s: any) => s.status === "active").length || 0,
      orders_count: u.orders?.length || 0,
      total_spent: u.orders?.reduce((sum: number, o: any) => sum + (o.total_amount || 0), 0) || 0
    }))

    return NextResponse.json({ users: transformedUsers })
  } catch (error) {
    console.error("[v0] Users GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
