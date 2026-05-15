import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

// GET - Get CRM dashboard stats (admin only)
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check admin
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("primary_role, secondary_roles")
      .eq("id", user.id)
      .single()

    const isAdmin = profile?.primary_role === "admin" || 
      (profile?.secondary_roles && profile.secondary_roles.includes("admin"))

    if (!isAdmin) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    // Get user counts by role
    const { data: usersByRole } = await supabase
      .from("user_profiles")
      .select("primary_role")

    const userCounts = {
      total: usersByRole?.length || 0,
      candidates: usersByRole?.filter(u => u.primary_role === "candidate").length || 0,
      voters: usersByRole?.filter(u => u.primary_role === "voter").length || 0,
      admins: usersByRole?.filter(u => u.primary_role === "admin").length || 0
    }

    // Get order stats
    const { data: orders } = await supabase
      .from("orders")
      .select("status, payment_status, total_amount")

    const orderStats = {
      total: orders?.length || 0,
      pending: orders?.filter(o => o.status === "pending").length || 0,
      processing: orders?.filter(o => o.status === "processing").length || 0,
      completed: orders?.filter(o => o.status === "completed").length || 0,
      totalRevenue: orders?.filter(o => o.payment_status === "paid").reduce((sum, o) => sum + (o.total_amount || 0), 0) || 0,
      pendingRevenue: orders?.filter(o => o.payment_status === "unpaid").reduce((sum, o) => sum + (o.total_amount || 0), 0) || 0
    }

    // Get subscription stats
    const { data: subscriptions } = await supabase
      .from("candidate_services")
      .select("status")

    const subscriptionStats = {
      total: subscriptions?.length || 0,
      active: subscriptions?.filter(s => s.status === "active").length || 0,
      pending: subscriptions?.filter(s => s.status === "pending").length || 0,
      cancelled: subscriptions?.filter(s => s.status === "cancelled").length || 0
    }

    // Get service request stats (leads)
    const { data: serviceRequests } = await supabase
      .from("service_requests")
      .select("status")

    const leadStats = {
      total: serviceRequests?.length || 0,
      new: serviceRequests?.filter(r => r.status === "pending").length || 0,
      contacted: serviceRequests?.filter(r => r.status === "contacted").length || 0,
      converted: serviceRequests?.filter(r => r.status === "approved").length || 0
    }

    return NextResponse.json({
      users: userCounts,
      orders: orderStats,
      subscriptions: subscriptionStats,
      leads: leadStats
    })
  } catch (error) {
    console.error("[v0] Stats GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
