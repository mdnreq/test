import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
  const isDemoMode = request.cookies.get("tnm-demo-mode")?.value === "true"

  // Skip authentication for public routes if Supabase is not configured
  if (!supabaseUrl || !supabaseAnonKey) {
    console.log("[v0] Supabase not configured, skipping auth check")
    return NextResponse.next({
      request,
    })
  }

  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
        supabaseResponse = NextResponse.next({
          request,
        })
        cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protected routes that require authentication
  if (!user && !isDemoMode && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  // Redirect authenticated users away from auth pages
  if (
    user &&
    (request.nextUrl.pathname.startsWith("/auth/login") || request.nextUrl.pathname.startsWith("/auth/sign-up"))
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return supabaseResponse
}

export async function proxy(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
