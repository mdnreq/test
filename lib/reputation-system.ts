/**
 * REPUTATION SYSTEM
 * A non-crypto, merit-based system for governance participation
 * 
 * Key Concepts:
 * - Reputation Score: Total accumulated points
 * - Participation Points: Earned from active engagement
 * - Contribution Points: Earned from creating value
 * - Voting Power: sqrt(reputation) - prevents plutocracy
 * 
 * Consensus Mechanisms Supported:
 * - Simple Majority: 50% + 1
 * - Supermajority: 66% required
 * - Quadratic: sqrt(reputation) = voting power
 * - Conviction: Time-weighted voting (longer = stronger)
 * - Proof of Participation: Based on verified activities
 * - Delegated: Liquid democracy
 */

import { createClient } from "@/lib/supabase/client"

// Types
export type ConsensusMechanism = 
  | "simple_majority"
  | "supermajority"
  | "quadratic"
  | "conviction"
  | "ranked_choice"
  | "approval"
  | "proof_of_participation"
  | "delegated"

export interface ReputationAction {
  id: string
  action_name: string
  description: string
  points_awarded: number
  category: "participation" | "contribution" | "governance" | "community"
  cooldown_hours: number
  max_per_day?: number
}

export interface ReputationHistory {
  id: string
  user_id: string
  action_id: string
  points_earned: number
  reference_type?: string
  reference_id?: string
  description?: string
  created_at: string
  action?: ReputationAction
}

export interface VotingPowerBreakdown {
  base_reputation: number
  quadratic_power: number
  delegation_received: number
  total_voting_power: number
  conviction_multiplier?: number
}

// Calculate voting power based on consensus mechanism
export function calculateVotingPower(
  reputation: number,
  mechanism: ConsensusMechanism,
  options?: {
    convictionDays?: number
    delegatedPower?: number
    participationProofs?: number
  }
): VotingPowerBreakdown {
  const base = reputation
  let quadratic = Math.max(1, Math.floor(Math.sqrt(reputation)))
  let total = quadratic
  let convictionMultiplier = 1
  
  switch (mechanism) {
    case "simple_majority":
    case "supermajority":
      // 1 person = 1 vote, regardless of reputation
      total = 1
      quadratic = 1
      break
      
    case "quadratic":
      // sqrt(reputation) = voting power
      // Prevents whales from dominating
      total = quadratic
      break
      
    case "conviction":
      // Voting power increases over time
      // Rewards long-term commitment
      const days = options?.convictionDays || 0
      convictionMultiplier = Math.min(3, 1 + Math.log(Math.max(1, days + 1)) / 2)
      total = Math.floor(quadratic * convictionMultiplier)
      break
      
    case "proof_of_participation":
      // Based on verified activities
      const proofs = options?.participationProofs || 0
      total = Math.max(1, proofs)
      break
      
    case "delegated":
      // Include delegated votes
      const delegated = options?.delegatedPower || 0
      total = quadratic + delegated
      break
      
    default:
      total = quadratic
  }
  
  return {
    base_reputation: base,
    quadratic_power: quadratic,
    delegation_received: options?.delegatedPower || 0,
    total_voting_power: total,
    conviction_multiplier: convictionMultiplier,
  }
}

// Calculate if proposal passes based on consensus
export function calculateProposalResult(
  votesFor: number,
  votesAgainst: number,
  votesAbstain: number,
  mechanism: ConsensusMechanism,
  options?: {
    quorumRequired?: number
    totalEligible?: number
    youthVetoActive?: boolean
    youthVetoThreshold?: number
    youthVetoVotes?: number
  }
): {
  passed: boolean
  reason: string
  percentage: number
  quorumMet: boolean
  vetoApplied: boolean
} {
  const totalVotes = votesFor + votesAgainst
  const totalCast = totalVotes + votesAbstain
  const percentage = totalVotes > 0 ? (votesFor / totalVotes) * 100 : 0
  
  // Check quorum
  let quorumMet = true
  if (options?.quorumRequired && options?.totalEligible) {
    const turnout = (totalCast / options.totalEligible) * 100
    quorumMet = turnout >= options.quorumRequired
  }
  
  // Check youth veto
  let vetoApplied = false
  if (options?.youthVetoActive && options?.youthVetoVotes !== undefined) {
    const vetoThreshold = options.youthVetoThreshold || 67
    if (options.youthVetoVotes >= vetoThreshold) {
      vetoApplied = true
    }
  }
  
  if (vetoApplied) {
    return {
      passed: false,
      reason: "Vetoed by Youth Assembly",
      percentage,
      quorumMet,
      vetoApplied: true,
    }
  }
  
  if (!quorumMet) {
    return {
      passed: false,
      reason: `Quorum not met (${options?.quorumRequired}% required)`,
      percentage,
      quorumMet: false,
      vetoApplied: false,
    }
  }
  
  let threshold: number
  let passed: boolean
  
  switch (mechanism) {
    case "supermajority":
      threshold = 66
      passed = percentage >= threshold
      break
      
    case "simple_majority":
    case "quadratic":
    case "conviction":
    case "proof_of_participation":
    case "delegated":
    default:
      threshold = 50
      passed = percentage > threshold
      break
  }
  
  return {
    passed,
    reason: passed ? `Passed with ${percentage.toFixed(1)}%` : `Failed with ${percentage.toFixed(1)}% (${threshold}% required)`,
    percentage,
    quorumMet,
    vetoApplied: false,
  }
}

// Reputation Service Class
export class ReputationService {
  private supabase = createClient()
  
  // Award reputation to user
  async awardReputation(
    userId: string,
    actionName: string,
    referenceType?: string,
    referenceId?: string,
    description?: string
  ): Promise<{ success: boolean; points: number; error?: string }> {
    try {
      // Get action details
      const { data: action, error: actionError } = await this.supabase
        .from("reputation_actions")
        .select("*")
        .eq("action_name", actionName)
        .single()
      
      if (actionError || !action) {
        return { success: false, points: 0, error: "Action not found" }
      }
      
      // Check cooldown and daily limits
      if (action.cooldown_hours > 0 || action.max_per_day) {
        const { count } = await this.supabase
          .from("reputation_history")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId)
          .eq("action_id", action.id)
          .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        
        if (action.max_per_day && (count || 0) >= action.max_per_day) {
          return { success: false, points: 0, error: "Daily limit reached" }
        }
      }
      
      // Insert history
      const { error: historyError } = await this.supabase
        .from("reputation_history")
        .insert({
          user_id: userId,
          action_id: action.id,
          points_earned: action.points_awarded,
          reference_type: referenceType,
          reference_id: referenceId,
          description,
        })
      
      if (historyError) throw historyError
      
      // Update user profile
      const { data: profile } = await this.supabase
        .from("user_profiles")
        .select("reputation_score, participation_points, contribution_points")
        .eq("id", userId)
        .single()
      
      if (profile) {
        const newReputation = profile.reputation_score + action.points_awarded
        const newVotingPower = Math.max(1, Math.floor(Math.sqrt(newReputation)))
        
        await this.supabase
          .from("user_profiles")
          .update({
            reputation_score: newReputation,
            participation_points: action.category === "participation" 
              ? profile.participation_points + action.points_awarded 
              : profile.participation_points,
            contribution_points: action.category === "contribution"
              ? profile.contribution_points + action.points_awarded
              : profile.contribution_points,
            voting_power: newVotingPower,
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId)
      }
      
      return { success: true, points: action.points_awarded }
      
    } catch (error) {
      console.error("Award reputation error:", error)
      return { success: false, points: 0, error: "Failed to award reputation" }
    }
  }
  
  // Get user's reputation history
  async getHistory(userId: string, limit = 50): Promise<ReputationHistory[]> {
    const { data } = await this.supabase
      .from("reputation_history")
      .select(`
        *,
        action:reputation_actions(*)
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit)
    
    return data || []
  }
  
  // Get leaderboard
  async getLeaderboard(
    limit = 20,
    category?: "reputation" | "participation" | "contribution"
  ): Promise<Array<{
    id: string
    display_name: string
    avatar_url?: string
    reputation_score: number
    participation_points: number
    contribution_points: number
    voting_power: number
    primary_role: string
  }>> {
    const orderBy = category === "participation" 
      ? "participation_points"
      : category === "contribution"
        ? "contribution_points"
        : "reputation_score"
    
    const { data } = await this.supabase
      .from("user_profiles")
      .select("id, display_name, full_name, avatar_url, reputation_score, participation_points, contribution_points, voting_power, primary_role")
      .order(orderBy, { ascending: false })
      .limit(limit)
    
    return (data || []).map(u => ({
      ...u,
      display_name: u.display_name || u.full_name,
    }))
  }
  
  // Stake reputation on a proposal
  async stakeReputation(
    userId: string,
    proposalId: string,
    amount: number,
    stakeType: "proposal_sponsor" | "dispute_bond" | "prediction"
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Check user has enough reputation
      const { data: profile } = await this.supabase
        .from("user_profiles")
        .select("reputation_score")
        .eq("id", userId)
        .single()
      
      if (!profile || profile.reputation_score < amount) {
        return { success: false, error: "Insufficient reputation" }
      }
      
      // Create stake
      const { error } = await this.supabase
        .from("reputation_stakes")
        .insert({
          user_id: userId,
          proposal_id: proposalId,
          staked_reputation: amount,
          stake_type: stakeType,
        })
      
      if (error) throw error
      
      // Deduct from available reputation (for voting power calculation)
      // Note: They keep the reputation, but it's "locked"
      
      return { success: true }
      
    } catch (error) {
      console.error("Stake reputation error:", error)
      return { success: false, error: "Failed to stake reputation" }
    }
  }
  
  // Resolve a stake (after proposal outcome)
  async resolveStake(
    stakeId: string,
    outcome: "won" | "lost" | "returned",
    multiplier = 1.0
  ): Promise<{ success: boolean; pointsAwarded?: number }> {
    try {
      const { data: stake } = await this.supabase
        .from("reputation_stakes")
        .select("*")
        .eq("id", stakeId)
        .single()
      
      if (!stake) return { success: false }
      
      let pointsChange = 0
      
      if (outcome === "won") {
        // Reward for successful stake
        pointsChange = Math.floor(stake.staked_reputation * (multiplier - 1))
      } else if (outcome === "lost") {
        // Penalty for failed stake
        pointsChange = -Math.floor(stake.staked_reputation * 0.5)
      }
      // "returned" = no change
      
      // Update stake
      await this.supabase
        .from("reputation_stakes")
        .update({
          outcome,
          multiplier,
          resolved_at: new Date().toISOString(),
        })
        .eq("id", stakeId)
      
      // Update user reputation if changed
      if (pointsChange !== 0) {
        const { data: profile } = await this.supabase
          .from("user_profiles")
          .select("reputation_score")
          .eq("id", stake.user_id)
          .single()
        
        if (profile) {
          const newRep = Math.max(0, profile.reputation_score + pointsChange)
          await this.supabase
            .from("user_profiles")
            .update({
              reputation_score: newRep,
              voting_power: Math.max(1, Math.floor(Math.sqrt(newRep))),
            })
            .eq("id", stake.user_id)
        }
      }
      
      return { success: true, pointsAwarded: pointsChange }
      
    } catch (error) {
      console.error("Resolve stake error:", error)
      return { success: false }
    }
  }
  
  // Record proof of participation
  async recordProofOfParticipation(
    userId: string,
    activityType: string,
    activityId?: string,
    proofCode?: string
  ): Promise<{ success: boolean; verified: boolean }> {
    try {
      // Create PoP record
      const { data, error } = await this.supabase
        .from("proof_of_participation")
        .insert({
          user_id: userId,
          activity_type: activityType,
          activity_id: activityId,
          proof_hash: proofCode ? btoa(proofCode) : null,
          verified: !!proofCode, // Auto-verify if code provided
        })
        .select()
        .single()
      
      if (error) throw error
      
      // Award reputation for verified participation
      if (data?.verified) {
        await this.awardReputation(
          userId,
          activityType === "town_hall_attendance" ? "town_hall_attendance" : "daily_login",
          "proof_of_participation",
          data.id
        )
      }
      
      return { success: true, verified: data?.verified || false }
      
    } catch (error) {
      console.error("Record PoP error:", error)
      return { success: false, verified: false }
    }
  }
}

// Singleton instance
export const reputationService = new ReputationService()
