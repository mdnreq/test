"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { 
  Vote, Users, FileText, Calendar, Trophy, Star, 
  TrendingUp, CheckCircle2, Clock, Bell, MapPin,
  MessageSquare, ThumbsUp, Award, Zap, ChevronRight,
  BarChart3, Target, Shield, BookOpen
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface VoterProfile {
  id: string
  full_name: string
  email: string
  municipality_id: string | null
  province: string | null
  reputation_score: number
  voting_power: number
  badges: string[]
  is_verified: boolean
}

interface ReputationAction {
  id: string
  action_type: string
  points: number
  description: string
  created_at: string
}

export default function VoterDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<VoterProfile | null>(null)
  const [reputationHistory, setReputationHistory] = useState<ReputationAction[]>([])
  const [activeProposals, setActiveProposals] = useState<any[]>([])
  const [upcomingElections, setUpcomingElections] = useState<any[]>([])
  const [localCandidates, setLocalCandidates] = useState<any[]>([])

  useEffect(() => {
    async function loadData() {
      // Check demo mode
      const isDemoMode = localStorage.getItem("tnm-demo-mode") === "true"
      
      if (isDemoMode) {
        const demoUser = JSON.parse(localStorage.getItem("tnm-demo-user") || "{}")
        setProfile({
          id: demoUser.id || "demo-voter-001",
          full_name: demoUser.full_name || "Demo Voter",
          email: demoUser.email || "voter@demo.com",
          municipality_id: null,
          province: demoUser.province || "Ontario",
          reputation_score: 720,
          voting_power: 156,
          badges: ["verified_voter", "policy_contributor", "community_builder"],
          is_verified: true
        })

        setReputationHistory([
          { id: "1", action_type: "proposal_vote", points: 10, description: "Voted on 'Millennial Civic Mobilization Initiative'", created_at: new Date(Date.now() - 2*24*60*60*1000).toISOString() },
          { id: "2", action_type: "issue_raised", points: 25, description: "Raised issue: 'Youth transit passes'", created_at: new Date(Date.now() - 5*24*60*60*1000).toISOString() },
          { id: "3", action_type: "town_hall_attendance", points: 15, description: "Attended virtual town hall", created_at: new Date(Date.now() - 7*24*60*60*1000).toISOString() },
          { id: "4", action_type: "comment_upvoted", points: 5, description: "Your comment received 10+ upvotes", created_at: new Date(Date.now() - 10*24*60*60*1000).toISOString() },
          { id: "5", action_type: "referral", points: 50, description: "Referred a new voter who registered", created_at: new Date(Date.now() - 14*24*60*60*1000).toISOString() },
        ])

        setActiveProposals([
          { id: "1", title: "Millennial Civic Mobilization Initiative", status: "active", votes_for: 234, votes_against: 45, your_vote: null, deadline: new Date(Date.now() + 7*24*60*60*1000).toISOString() },
          { id: "2", title: "Youth transit subsidy", status: "active", votes_for: 189, votes_against: 78, your_vote: "for", deadline: new Date(Date.now() + 14*24*60*60*1000).toISOString() },
          { id: "3", title: "Climate action fund allocation", status: "active", votes_for: 567, votes_against: 123, your_vote: null, deadline: new Date(Date.now() + 3*24*60*60*1000).toISOString() },
        ])

        setUpcomingElections([
          { id: "1", name: "Ontario Municipal Elections", date: "October 26, 2026", days_until: 267, registered: true },
          { id: "2", name: "School Board Trustee Elections", date: "October 26, 2026", days_until: 267, registered: true },
        ])

        setLocalCandidates([
          { id: "1", name: "Sarah Chen", position: "City Councillor - Ward 5", party: "Independent", match_score: 87 },
          { id: "2", name: "Marcus Johnson", position: "Mayor", party: "Progressive", match_score: 72 },
          { id: "3", name: "Emily Rodriguez", position: "School Board Trustee", party: "Independent", match_score: 91 },
        ])

        setLoading(false)
        return
      }

      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push("/auth/login?redirect=/dashboard/voter")
        return
      }

      // Load real data from Supabase
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      if (profileData) {
        setProfile({
          ...profileData,
          reputation_score: profileData.reputation_score || 0,
          voting_power: profileData.voting_power || 1,
          badges: profileData.badges || []
        })
      }

      // Load reputation history
      const { data: repHistory } = await supabase
        .from("reputation_transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10)

      if (repHistory) setReputationHistory(repHistory)

      // Load active proposals
      const { data: proposals } = await supabase
        .from("governance_proposals")
        .select("*")
        .eq("status", "Active")
        .order("created_at", { ascending: false })

      if (proposals) setActiveProposals(proposals)

      setLoading(false)
    }

    loadData()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05070a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-white/70">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  const reputationLevel = Math.floor((profile?.reputation_score || 0) / 100) + 1
  const nextLevelProgress = ((profile?.reputation_score || 0) % 100)

  return (
    <div className="min-h-screen bg-[#05070a]">
      {/* Header */}
      <div className="border-b border-white/10 bg-[#06080c]">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                Voter Dashboard
              </h1>
              <p className="text-white/60 mt-1">
                Welcome back, {profile?.full_name || "Voter"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Reputation Badge - Replaces Crypto Token */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30">
                <Trophy className="w-5 h-5 text-amber-400" />
                <div>
                  <p className="text-xs text-amber-400/70">Reputation</p>
                  <p className="text-lg font-bold text-amber-400">{profile?.reputation_score || 0}</p>
                </div>
              </div>
              {/* Voting Power */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30">
                <Zap className="w-5 h-5 text-purple-400" />
                <div>
                  <p className="text-xs text-purple-400/70">Voting Power</p>
                  <p className="text-lg font-bold text-purple-400">{profile?.voting_power || 1}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-white/5 border border-white/10 p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600">
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="vote" className="data-[state=active]:bg-blue-600">
              <Vote className="w-4 h-4 mr-2" />
              Vote
            </TabsTrigger>
            <TabsTrigger value="reputation" className="data-[state=active]:bg-blue-600">
              <Trophy className="w-4 h-4 mr-2" />
              Reputation
            </TabsTrigger>
            <TabsTrigger value="candidates" className="data-[state=active]:bg-blue-600">
              <Users className="w-4 h-4 mr-2" />
              Candidates
            </TabsTrigger>
            <TabsTrigger value="elections" className="data-[state=active]:bg-blue-600">
              <Calendar className="w-4 h-4 mr-2" />
              Elections
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-[#0b0f16] border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/60 text-sm">Reputation Level</p>
                      <p className="text-3xl font-bold text-white mt-1">Level {reputationLevel}</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                      <Trophy className="w-6 h-6 text-amber-400" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-white/50 mb-1">
                      <span>Progress to Level {reputationLevel + 1}</span>
                      <span>{nextLevelProgress}%</span>
                    </div>
                    <Progress value={nextLevelProgress} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#0b0f16] border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/60 text-sm">Proposals to Vote</p>
                      <p className="text-3xl font-bold text-white mt-1">
                        {activeProposals.filter(p => !p.your_vote).length}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                      <Vote className="w-6 h-6 text-blue-400" />
                    </div>
                  </div>
                  <Link href="/governance/town-hall">
                    <p className="mt-4 text-sm text-blue-400 hover:text-blue-300">
                      View all proposals →
                    </p>
                  </Link>
                </CardContent>
              </Card>

              <Card className="bg-[#0b0f16] border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/60 text-sm">Badges Earned</p>
                      <p className="text-3xl font-bold text-white mt-1">{profile?.badges?.length || 0}</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                      <Award className="w-6 h-6 text-green-400" />
                    </div>
                  </div>
                  <div className="mt-4 flex gap-1">
                    {profile?.badges?.slice(0, 3).map((badge, i) => (
                      <Badge key={i} variant="outline" className="text-xs border-green-500/30 text-green-400">
                        {badge.replace("_", " ")}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#0b0f16] border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/60 text-sm">Days to Election</p>
                      <p className="text-3xl font-bold text-white mt-1">
                        {upcomingElections[0]?.days_until || "—"}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-purple-400" />
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-white/50">
                    {upcomingElections[0]?.name || "No upcoming elections"}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* How Reputation Works */}
            <Card className="bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border-amber-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-400" />
                  How Reputation Works (No Crypto Required)
                </CardTitle>
                <CardDescription className="text-white/60">
                  Earn reputation through genuine civic participation - not money
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-lg bg-white/5">
                    <Vote className="w-8 h-8 text-blue-400 mb-2" />
                    <h4 className="font-medium text-white">Vote on Proposals</h4>
                    <p className="text-sm text-white/60 mt-1">+10 rep per vote</p>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5">
                    <MessageSquare className="w-8 h-8 text-green-400 mb-2" />
                    <h4 className="font-medium text-white">Raise Issues</h4>
                    <p className="text-sm text-white/60 mt-1">+25 rep per issue</p>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5">
                    <Users className="w-8 h-8 text-purple-400 mb-2" />
                    <h4 className="font-medium text-white">Attend Town Halls</h4>
                    <p className="text-sm text-white/60 mt-1">+15 rep per session</p>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5">
                    <ThumbsUp className="w-8 h-8 text-amber-400 mb-2" />
                    <h4 className="font-medium text-white">Quality Contributions</h4>
                    <p className="text-sm text-white/60 mt-1">+5 rep per upvote</p>
                  </div>
                </div>
                <div className="mt-4 p-4 rounded-lg bg-white/5 border border-amber-500/20">
                  <p className="text-sm text-white/80">
                    <strong className="text-amber-400">Voting Power</strong> is calculated from your reputation. 
                    Higher reputation = more voting weight using <strong>quadratic voting</strong> (sqrt of reputation). 
                    This ensures influence is earned through participation, not purchased.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Active Proposals Quick View */}
            <Card className="bg-[#0b0f16] border-white/10">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-white">Proposals Needing Your Vote</CardTitle>
                  <Link href="/governance/town-hall?tab=proposals">
                    <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
                      View All
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activeProposals.filter(p => !p.your_vote).slice(0, 3).map((proposal) => (
                    <div key={proposal.id} className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-blue-500/30 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-white">{proposal.title}</h4>
                          <div className="flex items-center gap-4 mt-2 text-sm text-white/60">
                            <span className="text-green-400">{proposal.votes_for} for</span>
                            <span className="text-red-400">{proposal.votes_against} against</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Ends {new Date(proposal.deadline).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <Link href={`/governance/town-hall?proposal=${proposal.id}`}>
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-500">
                            Vote Now
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                  {activeProposals.filter(p => !p.your_vote).length === 0 && (
                    <p className="text-center text-white/50 py-8">
                      You've voted on all active proposals! Check back later.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Vote Tab */}
          <TabsContent value="vote" className="space-y-6">
            <Card className="bg-[#0b0f16] border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Active Proposals</CardTitle>
                <CardDescription className="text-white/60">
                  Cast your vote using your earned voting power
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeProposals.map((proposal) => (
                    <div key={proposal.id} className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className={proposal.your_vote ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}>
                              {proposal.your_vote ? "Voted" : "Pending"}
                            </Badge>
                            <Badge variant="outline" className="border-white/20 text-white/60">
                              {proposal.status}
                            </Badge>
                          </div>
                          <h4 className="font-medium text-white text-lg">{proposal.title}</h4>
                        </div>
                        {!proposal.your_vote && (
                          <div className="flex gap-2">
                            <Button size="sm" className="bg-green-600 hover:bg-green-500">
                              <ThumbsUp className="w-4 h-4 mr-1" />
                              For
                            </Button>
                            <Button size="sm" variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/20 bg-transparent">
                              Against
                            </Button>
                          </div>
                        )}
                      </div>
                      
                      {/* Vote Progress */}
                      <div className="mt-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-green-400">{proposal.votes_for} for ({Math.round(proposal.votes_for / (proposal.votes_for + proposal.votes_against) * 100) || 50}%)</span>
                          <span className="text-red-400">{proposal.votes_against} against</span>
                        </div>
                        <div className="h-2 rounded-full bg-white/10 overflow-hidden flex">
                          <div 
                            className="bg-green-500 h-full transition-all"
                            style={{ width: `${(proposal.votes_for / (proposal.votes_for + proposal.votes_against) * 100) || 50}%` }}
                          />
                          <div 
                            className="bg-red-500 h-full transition-all"
                            style={{ width: `${(proposal.votes_against / (proposal.votes_for + proposal.votes_against) * 100) || 50}%` }}
                          />
                        </div>
                      </div>
                      
                      {proposal.your_vote && (
                        <p className="mt-2 text-sm text-white/50">
                          You voted <span className={proposal.your_vote === "for" ? "text-green-400" : "text-red-400"}>{proposal.your_vote}</span>
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reputation Tab */}
          <TabsContent value="reputation" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Reputation Card */}
              <Card className="bg-gradient-to-br from-amber-500/20 to-yellow-500/10 border-amber-500/30">
                <CardContent className="p-6 text-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 mx-auto flex items-center justify-center mb-4">
                    <Trophy className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-4xl font-bold text-white">{profile?.reputation_score || 0}</h3>
                  <p className="text-amber-400 font-medium">Reputation Score</p>
                  <p className="text-white/60 text-sm mt-2">Level {reputationLevel} Citizen</p>
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-white/50 mb-1">
                      <span>Next Level</span>
                      <span>{100 - nextLevelProgress} pts needed</span>
                    </div>
                    <Progress value={nextLevelProgress} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Voting Power Explanation */}
              <Card className="bg-[#0b0f16] border-white/10 lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Zap className="w-5 h-5 text-purple-400" />
                    Your Voting Power
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-6 mb-4">
                    <div className="text-center">
                      <p className="text-5xl font-bold text-purple-400">{profile?.voting_power || 1}</p>
                      <p className="text-white/60 text-sm">Voting Power</p>
                    </div>
                    <div className="flex-1 p-4 rounded-lg bg-white/5">
                      <p className="text-white/80 text-sm">
                        <strong>Quadratic Voting Formula:</strong>
                      </p>
                      <p className="text-lg font-mono text-purple-400 mt-1">
                        Voting Power = √(Reputation Score)
                      </p>
                      <p className="text-white/60 text-sm mt-2">
                        √{profile?.reputation_score || 0} ≈ {profile?.voting_power || 1}
                      </p>
                    </div>
                  </div>
                  <p className="text-white/60 text-sm">
                    Quadratic voting prevents wealthy individuals from dominating decisions. 
                    Your influence grows with genuine participation, not money.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Reputation History */}
            <Card className="bg-[#0b0f16] border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Reputation History</CardTitle>
                <CardDescription className="text-white/60">
                  How you've earned your reputation through civic participation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {reputationHistory.map((action) => (
                    <div key={action.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          action.points > 20 ? "bg-green-500/20" : 
                          action.points > 10 ? "bg-blue-500/20" : "bg-white/10"
                        }`}>
                          {action.action_type === "proposal_vote" && <Vote className="w-5 h-5 text-blue-400" />}
                          {action.action_type === "issue_raised" && <MessageSquare className="w-5 h-5 text-green-400" />}
                          {action.action_type === "town_hall_attendance" && <Users className="w-5 h-5 text-purple-400" />}
                          {action.action_type === "comment_upvoted" && <ThumbsUp className="w-5 h-5 text-amber-400" />}
                          {action.action_type === "referral" && <Star className="w-5 h-5 text-yellow-400" />}
                        </div>
                        <div>
                          <p className="text-white font-medium">{action.description}</p>
                          <p className="text-white/50 text-sm">
                            {new Date(action.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        +{action.points} rep
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Badges */}
            <Card className="bg-[#0b0f16] border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Earned Badges</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { id: "verified_voter", name: "Verified Voter", desc: "Completed identity verification", icon: Shield, earned: profile?.badges?.includes("verified_voter") },
                    { id: "policy_contributor", name: "Policy Contributor", desc: "Submitted 3+ approved proposals", icon: FileText, earned: profile?.badges?.includes("policy_contributor") },
                    { id: "community_builder", name: "Community Builder", desc: "Recruited 10+ new members", icon: Users, earned: profile?.badges?.includes("community_builder") },
                    { id: "bounty_hunter", name: "Bounty Hunter", desc: "Completed 5+ bounty tasks", icon: Target, earned: profile?.badges?.includes("bounty_hunter") },
                    { id: "town_hall_regular", name: "Town Hall Regular", desc: "Attended 10+ town halls", icon: Calendar, earned: false },
                    { id: "debate_champion", name: "Debate Champion", desc: "Won a parliament debate", icon: Award, earned: false },
                    { id: "youth_advocate", name: "Youth Advocate", desc: "Under 25 with 500+ rep", icon: Zap, earned: false },
                    { id: "civic_scholar", name: "Civic Scholar", desc: "Completed all tutorials", icon: BookOpen, earned: false },
                  ].map((badge) => (
                    <div 
                      key={badge.id}
                      className={`p-4 rounded-lg border text-center transition-all ${
                        badge.earned 
                          ? "bg-gradient-to-br from-amber-500/20 to-yellow-500/10 border-amber-500/30" 
                          : "bg-white/5 border-white/10 opacity-50"
                      }`}
                    >
                      <badge.icon className={`w-8 h-8 mx-auto mb-2 ${badge.earned ? "text-amber-400" : "text-white/30"}`} />
                      <h4 className={`font-medium ${badge.earned ? "text-white" : "text-white/50"}`}>{badge.name}</h4>
                      <p className="text-xs text-white/50 mt-1">{badge.desc}</p>
                      {badge.earned && (
                        <Badge className="mt-2 bg-green-500/20 text-green-400 border-0">Earned</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Candidates Tab */}
          <TabsContent value="candidates" className="space-y-6">
            <Card className="bg-[#0b0f16] border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Candidates in Your Area</CardTitle>
                <CardDescription className="text-white/60">
                  Based on your municipality and policy preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {localCandidates.map((candidate) => (
                    <div key={candidate.id} className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-blue-500/30 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                            {candidate.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-medium text-white">{candidate.name}</h4>
                            <p className="text-white/60 text-sm">{candidate.position}</p>
                            <Badge variant="outline" className="mt-1 border-white/20 text-white/60">
                              {candidate.party}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-400">{candidate.match_score}%</div>
                          <p className="text-white/50 text-xs">Policy Match</p>
                          <Link href={`/candidates/${candidate.id}`}>
                            <Button size="sm" variant="outline" className="mt-2 border-white/20 text-white hover:bg-white/10 bg-transparent">
                              View Profile
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Link href="/candidates">
                  <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-500">
                    View All Candidates
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Elections Tab */}
          <TabsContent value="elections" className="space-y-6">
            <Card className="bg-[#0b0f16] border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Upcoming Elections</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingElections.map((election) => (
                    <div key={election.id} className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-white text-lg">{election.name}</h4>
                          <p className="text-white/60 flex items-center gap-2 mt-1">
                            <Calendar className="w-4 h-4" />
                            {election.date}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-blue-400">{election.days_until}</div>
                          <p className="text-white/50 text-sm">days until</p>
                          {election.registered ? (
                            <Badge className="mt-2 bg-green-500/20 text-green-400 border-green-500/30">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Registered
                            </Badge>
                          ) : (
                            <Button size="sm" className="mt-2 bg-blue-600 hover:bg-blue-500">
                              Register to Vote
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Election Checklist */}
            <Card className="bg-[#0b0f16] border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Your Election Checklist</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { task: "Verify your identity", done: true },
                    { task: "Confirm your address", done: true },
                    { task: "Research candidates in your ward", done: false },
                    { task: "Take the policy quiz for candidate matching", done: false },
                    { task: "Find your polling location", done: false },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                      {item.done ? (
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-white/30" />
                      )}
                      <span className={item.done ? "text-white/50 line-through" : "text-white"}>
                        {item.task}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
