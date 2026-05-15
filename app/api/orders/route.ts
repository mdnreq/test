import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

// GET - List orders for current user or all orders (admin)
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("primary_role, secondary_roles")
      .eq("id", user.id)
      .single()

    const isAdmin = profile?.primary_role === "admin" || 
      (profile?.secondary_roles && profile.secondary_roles.includes("admin"))

    // Admins see all orders, users see their own
    let query = supabase
      .from("orders")
      .select(`
        *,
        order_items (
          id,
          service_id,
          service_name,
          quantity,
          unit_price,
          total_price
        ),
        user_profiles!orders_user_id_fkey (
          id,
          full_name,
          email,
          primary_role
        )
      `)
      .order("created_at", { ascending: false })

    if (!isAdmin) {
      query = query.eq("user_id", user.id)
    }

    const { data: orders, error } = await query

    if (error) {
      console.error("[v0] Error fetching orders:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ orders })
  } catch (error) {
    console.error("[v0] Orders GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST - Create a new order
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { items, payment_method = "pending" } = body

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Order must have at least one item" }, { status: 400 })
    }

    // Get user profile for role
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("primary_role")
      .eq("id", user.id)
      .single()

    // Calculate total
    let totalAmount = 0
    const orderItems = []

    for (const item of items) {
      // Fetch service details
      const { data: service } = await supabase
        .from("services")
        .select("id, name, price")
        .eq("id", item.service_id)
        .single()

      if (!service) {
        return NextResponse.json({ error: `Service not found: ${item.service_id}` }, { status: 400 })
      }

      const quantity = item.quantity || 1
      const itemTotal = service.price * quantity
      totalAmount += itemTotal

      orderItems.push({
        service_id: service.id,
        service_name: service.name,
        quantity,
        unit_price: service.price,
        total_price: itemTotal
      })
    }

    // Create order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        user_type: profile?.primary_role || "voter",
        total_amount: totalAmount,
        status: "pending",
        payment_status: "unpaid",
        payment_method
      })
      .select()
      .single()

    if (orderError) {
      console.error("[v0] Error creating order:", orderError)
      return NextResponse.json({ error: orderError.message }, { status: 500 })
    }

    // Create order items
    const itemsWithOrderId = orderItems.map(item => ({
      ...item,
      order_id: order.id
    }))

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(itemsWithOrderId)

    if (itemsError) {
      console.error("[v0] Error creating order items:", itemsError)
      // Rollback order if items fail
      await supabase.from("orders").delete().eq("id", order.id)
      return NextResponse.json({ error: itemsError.message }, { status: 500 })
    }

    // Fetch complete order with items
    const { data: completeOrder } = await supabase
      .from("orders")
      .select(`
        *,
        order_items (*)
      `)
      .eq("id", order.id)
      .single()

    return NextResponse.json({ order: completeOrder }, { status: 201 })
  } catch (error) {
    console.error("[v0] Orders POST error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
