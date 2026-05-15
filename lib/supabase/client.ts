import { createBrowserClient } from "@supabase/ssr"

let hasWarnedMissingSupabaseConfig = false

function warnMissingSupabaseConfig() {
  const isStaticExport = process.env.STATIC_EXPORT === "true" || process.env.NEXT_PUBLIC_STATIC_EXPORT === "true"

  if (process.env.NODE_ENV === "production" || isStaticExport || hasWarnedMissingSupabaseConfig) {
    return
  }

  hasWarnedMissingSupabaseConfig = true
  console.warn("Supabase is not configured; using the mock browser client.")
}

function createChainableMock() {
  const mock: any = {
    data: null,
    error: null,
    select: () => mock,
    insert: () => mock,
    update: () => mock,
    delete: () => mock,
    upsert: () => mock,
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

function createMockBrowserClient() {
  return {
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({
        data: {
          subscription: {
            unsubscribe: () => {},
          },
        },
      }),
      signInWithPassword: async () => ({ data: null, error: null }),
      signUp: async () => ({ data: null, error: null }),
      signOut: async () => ({ error: null }),
      resetPasswordForEmail: async () => ({ data: null, error: null }),
      updateUser: async () => ({ data: null, error: null }),
    },
    from: () => createChainableMock(),
    rpc: async () => ({ data: null, error: null }),
  } as any
}

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    warnMissingSupabaseConfig()
    return createMockBrowserClient()
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

export { createClient as createBrowserClient }
