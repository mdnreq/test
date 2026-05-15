"use client"

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

// User roles in the system
export type UserRole = 
  | "voter"
  | "candidate"
  | "elected_official"
  | "school_council"
  | "school_board"
  | "group_admin"
  | "group_member"
  | "moderator"
  | "admin"

// Verification statuses
export type VerificationStatus = "not_started" | "pending" | "verified" | "rejected"

// User profile with role and reputation
export interface UserProfile {
  id: string
  email: string
  full_name: string
  display_name?: string
  avatar_url?: string
  date_of_birth?: string
  age_verified: boolean
  
  // Roles
  primary_role: UserRole
  secondary_roles: UserRole[]
  is_under_40: boolean
  
  // Location
  municipality_id?: string
  province?: string
  postal_code?: string
  ward?: string
  
  // Reputation (NOT crypto)
  reputation_score: number
  participation_points: number
  contribution_points: number
  voting_power: number
  
  // Verification
  email_verified: VerificationStatus
  identity_verified: VerificationStatus
  residency_verified: VerificationStatus
  age_verification: VerificationStatus
  
  // Activity stats
  proposals_submitted: number
  proposals_passed: number
  votes_cast: number
  issues_raised: number
  bounties_completed: number
  
  // Timestamps
  last_active_at: string
  created_at: string
  updated_at: string
}

// Soulbound credential
export interface SoulboundCredential {
  id: string
  credential_type: string
  credential_name: string
  description?: string
  issued_by: string
  is_active: boolean
  issued_at: string
  expires_at?: string
}

// Auth context type
interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  credentials: SoulboundCredential[]
  loading: boolean
  error: string | null
  
  // Role checks
  hasRole: (role: UserRole) => boolean
  hasAnyRole: (roles: UserRole[]) => boolean
  isAdmin: boolean
  isCandidate: boolean
  isSchoolCouncil: boolean
  isSchoolBoard: boolean
  isVerified: boolean
  
  // Actions
  refreshProfile: () => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<UserProfile>) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [credentials, setCredentials] = useState<SoulboundCredential[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const supabase = createClient()
  
  // Fetch user profile
  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", userId)
        .single()
      
      if (profileError) {
        // Profile doesn't exist, create one
        if (profileError.code === "PGRST116") {
          const { data: userData } = await supabase.auth.getUser()
          if (userData.user) {
            const newProfile = {
              id: userId,
              email: userData.user.email || "",
              full_name: userData.user.user_metadata?.full_name || "",
              primary_role: "voter" as UserRole,
              secondary_roles: [],
              reputation_score: 0,
              participation_points: 0,
              contribution_points: 0,
              voting_power: 1,
            }
            
            const { data: created, error: createError } = await supabase
              .from("user_profiles")
              .insert(newProfile)
              .select()
              .single()
            
            if (createError) throw createError
            setProfile(created as UserProfile)
          }
        } else {
          throw profileError
        }
      } else {
        setProfile(profileData as UserProfile)
      }
      
      // Fetch credentials
      const { data: credData } = await supabase
        .from("soulbound_credentials")
        .select("*")
        .eq("user_id", userId)
        .eq("is_active", true)
      
      setCredentials(credData || [])
      
    } catch (err) {
      console.error("Error fetching profile:", err)
      setError("Failed to load profile")
    }
  }, [supabase])
  
  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          setUser(session.user)
          await fetchProfile(session.user.id)
        }
      } catch (err) {
        console.error("Auth init error:", err)
      } finally {
        setLoading(false)
      }
    }
    
    initAuth()
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          setUser(session.user)
          await fetchProfile(session.user.id)
        } else if (event === "SIGNED_OUT") {
          setUser(null)
          setProfile(null)
          setCredentials([])
        }
      }
    )
    
    return () => subscription.unsubscribe()
  }, [supabase, fetchProfile])
  
  // Refresh profile
  const refreshProfile = useCallback(async () => {
    if (user) {
      await fetchProfile(user.id)
    }
  }, [user, fetchProfile])
  
  // Sign out
  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    setCredentials([])
  }, [supabase])
  
  // Update profile
  const updateProfile = useCallback(async (updates: Partial<UserProfile>): Promise<boolean> => {
    if (!user) return false
    
    try {
      const { error: updateError } = await supabase
        .from("user_profiles")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", user.id)
      
      if (updateError) throw updateError
      
      await refreshProfile()
      return true
    } catch (err) {
      console.error("Update profile error:", err)
      return false
    }
  }, [user, supabase, refreshProfile])
  
  // Role check helpers
  const hasRole = useCallback((role: UserRole): boolean => {
    if (!profile) return false
    return profile.primary_role === role || profile.secondary_roles.includes(role)
  }, [profile])
  
  const hasAnyRole = useCallback((roles: UserRole[]): boolean => {
    return roles.some(role => hasRole(role))
  }, [hasRole])
  
  const isAdmin = profile?.primary_role === "admin" || profile?.secondary_roles.includes("admin")
  const isCandidate = hasRole("candidate") || hasRole("elected_official")
  const isSchoolCouncil = hasRole("school_council")
  const isSchoolBoard = hasRole("school_board")
  const isVerified = profile?.identity_verified === "verified" && profile?.email_verified === "verified"
  
  const value: AuthContextType = {
    user,
    profile,
    credentials,
    loading,
    error,
    hasRole,
    hasAnyRole,
    isAdmin,
    isCandidate,
    isSchoolCouncil,
    isSchoolBoard,
    isVerified,
    refreshProfile,
    signOut,
    updateProfile,
  }
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Hook to require specific role(s)
export function useRequireRole(requiredRoles: UserRole[]) {
  const { profile, loading, hasAnyRole } = useAuth()
  
  const hasAccess = !loading && profile && hasAnyRole(requiredRoles)
  const isLoading = loading
  
  return { hasAccess, isLoading, profile }
}

// Dashboard routes by role
export function getDashboardRoute(role: UserRole): string {
  const routes: Record<UserRole, string> = {
    voter: "/dashboard/voter",
    candidate: "/candidate-portal",
    elected_official: "/dashboard/official",
    school_council: "/dashboard/school-council",
    school_board: "/dashboard/school-board",
    group_admin: "/dashboard/group",
    group_member: "/dashboard/group",
    moderator: "/dashboard/moderator",
    admin: "/admin",
  }
  return routes[role] || "/dashboard/voter"
}
