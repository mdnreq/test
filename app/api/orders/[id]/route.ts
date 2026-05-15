import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

// GET - Get single order details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: order, error } = await supabase
      .from("orders")
      .select(`
        *,
        order_items (*),
        user_profiles!orders_user_id_fkey (
          id,
          full_name,
          email,
          primary_role
        )
      `)
      .eq("id", id)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 })
    }

    // Check if user owns this order or is admin
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("primary_role, secondary_roles")
      .eq("id", user.id)
      .single()

    const isAdmin = profile?.primary_role === "admin" || 
      (profile?.secondary_roles && profile.secondary_roles.includes("admin"))

    if (order.user_id !== user.id && !isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    return NextResponse.json({ order })
  } catch (error) {
    console.error("[v0] Order GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PATCH - Update order status (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if admin
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

    const body = await request.json()
    const { status, payment_status } = body

    const updates: Record<string, string> = {}
    if (status) updates.status = status
    if (payment_status) updates.payment_status = payment_status

    const { data: order, error } = await supabase
      .from("orders")
      .update(updates)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // If order is completed and paid, activate subscriptions
    if (status === "completed" && payment_status === "paid") {
      // Get order items
      const { data: items } = await supabase
        .from("order_items")
        .select("service_id")
        .eq("order_id", id)

      if (items) {
        for (const item of items) {
          // Create or update subscription
          await supabase
            .from("candidate_services")
            .upsert({
              candidate_id: order.user_id,
              service_id: item.service_id,
              status: "active",
              subscribed_at: new Date().toISOString()
            }, {
              onConflict: "candidate_id,service_id"
            })
        }
      }
    }

    return NextResponse.json({ order })
  } catch (error) {
    console.error("[v0] Order PATCH error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
