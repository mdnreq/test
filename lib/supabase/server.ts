import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

let hasWarnedMissingSupabaseConfig = false

function warnMissingSupabaseConfig() {
  const isStaticExport = process.env.STATIC_EXPORT === "true" || process.env.NEXT_PUBLIC_STATIC_EXPORT === "true"

  if (process.env.NODE_ENV === "production" || isStaticExport || hasWarnedMissingSupabaseConfig) {
    return
  }

  hasWarnedMissingSupabaseConfig = true
  console.warn("Supabase is not configured; using the mock server client.")
}

export async function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    warnMissingSupabaseConfig()
    // Return a mock client that won't throw errors and supports chaining
    const createChainableMock = () => {
      const mock: any = {
        data: null,
        error: null,
        select: () => mock,
        insert: () => mock,
        update: () => mock,
        delete: () => mock,
        eq: () => mock,
        neq: () => mock,
        gt: () => mock,
        gte: () => mock,
        lt: () => mock,
        lte: () => mock,
        like: () => mock,
        ilike: () => mock,
        is: () => mock,
        in: () => mock,
        contains: () => mock,
        containedBy: () => mock,
        order: () => mock,
        limit: () => mock,
        range: () => mock,
        single: () => Promise.resolve({ data: null, error: null }),
        maybeSingle: () => Promise.resolve({ data: null, error: null }),
        then: (resolve: any) => resolve({ data: null, error: null }),
      }
      return mock
    }

    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        signOut: async () => ({ error: null }),
      },
      from: () => createChainableMock(),
      rpc: async () => ({ data: null, error: null }),
    } as any
  }

  const cookieStore = await cookies()

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // The "setAll" method was called from a Server Component.
          // This can be ignored if you have proxy refreshing user sessions.
        }
      },
    },
  })
}
