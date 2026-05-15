import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

// GET - List subscriptions
export async function GET(request: NextRequest) {
  try {
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

    let query = supabase
      .from("candidate_services")
      .select(`
        *,
        services (
          id,
          name,
          price,
          category
        ),
        user_profiles!candidate_services_candidate_id_fkey (
          id,
          full_name,
          email,
          primary_role
        )
      `)
      .order("subscribed_at", { ascending: false })

    if (!isAdmin) {
      query = query.eq("candidate_id", user.id)
    }

    const { data: subscriptions, error } = await query

    if (error) {
      console.error("[v0] Error fetching subscriptions:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ subscriptions })
  } catch (error) {
    console.error("[v0] Subscriptions GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST - Create subscription (subscribe to service)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { service_id, create_order = true } = body

    if (!service_id) {
      return NextResponse.json({ error: "service_id is required" }, { status: 400 })
    }

    // Get service details
    const { data: service, error: serviceError } = await supabase
      .from("services")
      .select("*")
      .eq("id", service_id)
      .single()

    if (serviceError || !service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

    // Check if already subscribed
    const { data: existing } = await supabase
      .from("candidate_services")
      .select("id, status")
      .eq("candidate_id", user.id)
      .eq("service_id", service_id)
      .single()

    if (existing && existing.status === "active") {
      return NextResponse.json({ error: "Already subscribed to this service" }, { status: 400 })
    }

    // Get user profile
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("primary_role")
      .eq("id", user.id)
      .single()

    // Create order first if requested
    let order = null
    if (create_order) {
      const { data: newOrder, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          user_type: profile?.primary_role || "voter",
          total_amount: service.price,
          status: "pending",
          payment_status: "unpaid",
          payment_method: "pending"
        })
        .select()
        .single()

      if (orderError) {
        console.error("[v0] Error creating order:", orderError)
        return NextResponse.json({ error: orderError.message }, { status: 500 })
      }

      order = newOrder

      // Create order item
      await supabase
        .from("order_items")
        .insert({
          order_id: order.id,
          service_id: service.id,
          service_name: service.name,
          quantity: 1,
          unit_price: service.price,
          total_price: service.price
        })
    }

    // Create or update subscription (pending until payment)
    const { data: subscription, error: subError } = await supabase
      .from("candidate_services")
      .upsert({
        candidate_id: user.id,
        service_id: service_id,
        status: create_order ? "pending" : "active",
        subscribed_at: new Date().toISOString()
      }, {
        onConflict: "candidate_id,service_id"
      })
      .select()
      .single()

    if (subError) {
      console.error("[v0] Error creating subscription:", subError)
      return NextResponse.json({ error: subError.message }, { status: 500 })
    }

    return NextResponse.json({ 
      subscription,
      order,
      message: create_order ? "Order created - pending payment" : "Subscription activated"
    }, { status: 201 })
  } catch (error) {
    console.error("[v0] Subscriptions POST error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
