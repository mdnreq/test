"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Vote,
  Users,
  Coins,
  Shield,
  FileText,
  TrendingUp,
  Award,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Wallet,
  Briefcase,
  Globe,
  Tv,
  Code,
  Palette,
  PenTool,
  ChevronRight,
  Plus,
  Search,
  Filter,
  Sparkles,
  Lock,
  Eye,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Share2,
  BarChart3,
  Zap,
  Target,
  Crown,
  Fingerprint,
  Building2,
  LogOut
} from "lucide-react"
import type { User } from "@supabase/supabase-js"

interface Profile {
  id: string
  full_name: string
  user_type: string
  is_verified: boolean
  municipality_id: string | null
  province: string | null
}

interface Municipality {
  id: string
  name: string
  province: string
}

interface Proposal {
  id: string
  title: string
  description: string
  proposal_type: string
  status: string
  votes_for: number
  votes_against: number
  created_at: string
  expires_at: string | null
  created_by: string
  municipality: { name: string; province: string } | null
}

interface UserVote {
  proposal_id: string
  vote: string
}

interface Creator {
  id: string
  full_name: string
}

interface DAOGovernanceHubProps {
  user: User
  profile: Profile | null
  proposals: Proposal[]
  userVotes: UserVote[]
  municipalities: Municipality[]
  creators: Creator[]
}

// Demo data for DAO features
const demoTokenBalance = {
  nextTokens: 2450,
  votingPower: 156,
  stakedTokens: 1000,
  pendingRewards: 125
}

const demoBounties = [
  { id: "1", title: "Design Youth Voter Outreach Campaign", category: "Design", reward: 500, deadline: "2026-02-15", difficulty: "Medium", applicants: 12 },
  { id: "2", title: "Build Mobile Canvassing App", category: "Development", reward: 1500, deadline: "2026-03-01", difficulty: "Hard", applicants: 8 },
  { id: "3", title: "Create Gen Z & Millennial Engagement Documentary", category: "Media", reward: 750, deadline: "2026-02-20", difficulty: "Medium", applicants: 15 },
  { id: "4", title: "Write Policy Brief on Municipal Reform", category: "Research", reward: 400, deadline: "2026-02-10", difficulty: "Easy", applicants: 6 },
  { id: "5", title: "Translate Platform to French", category: "Translation", reward: 300, deadline: "2026-02-28", difficulty: "Easy", applicants: 4 },
]

const demoAssemblyMembers = [
  { id: "1", name: "Maya Chen", age: 22, role: "Assembly Lead", reputation: 850, proposals: 12 },
  { id: "2", name: "Jordan Williams", age: 19, role: "Policy Committee", reputation: 720, proposals: 8 },
  { id: "3", name: "Alex Rivera", age: 25, role: "Treasury Council", reputation: 680, proposals: 6 },
  { id: "4", name: "Sam Thompson", age: 17, role: "Youth Advocate", reputation: 590, proposals: 4 },
]

const demoSBTCredentials = [
  { id: "1", name: "Verified Youth Voter", icon: Fingerprint, earned: true, description: "Age-verified citizen under 40" },
  { id: "2", name: "Policy Contributor", icon: FileText, earned: true, description: "Submitted 3+ approved proposals" },
  { id: "3", name: "Community Builder", icon: Users, earned: false, description: "Recruited 10+ new members" },
  { id: "4", name: "Bounty Hunter", icon: Target, earned: true, description: "Completed 5+ bounty tasks" },
  { id: "5", name: "Assembly Delegate", icon: Crown, earned: false, description: "Elected to Youth Assembly" },
]

export function DAOGovernanceHub({ 
  user, 
  profile, 
  proposals, 
  userVotes, 
  municipalities,
  creators 
}: DAOGovernanceHubProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [showCreateProposal, setShowCreateProposal] = useState(false)
  const [votingProposal, setVotingProposal] = useState<string | null>(null)
  
  // Create maps for easy lookup
  const userVoteMap = new Map(userVotes.map((v) => [v.proposal_id, v.vote]))
  const creatorMap = new Map(creators.map((c) => [c.id, c]))

  // Filter proposals
  const filteredProposals = proposals.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === "all" || p.status.toLowerCase() === filterStatus.toLowerCase()
    return matchesSearch && matchesFilter
  })

  const handleVote = async (proposalId: string, vote: "for" | "against") => {
    setVotingProposal(proposalId)
    try {
      const supabase = createClient()
      
      // Check if user already voted
      const existingVote = userVoteMap.get(proposalId)
      
      if (existingVote) {
        // Update existing vote
        await supabase
          .from("proposal_votes")
          .update({ vote })
          .eq("user_id", user.id)
          .eq("proposal_id", proposalId)
      } else {
        // Insert new vote
        await supabase
          .from("proposal_votes")
          .insert({ user_id: user.id, proposal_id: proposalId, vote })
      }
      
      // Update proposal vote counts (in real app this would be a trigger)
      router.refresh()
    } catch (error) {
      console.error("Vote error:", error)
    } finally {
      setVotingProposal(null)
    }
  }

  const getCategoryIcon = (category: string) => {
    switch(category.toLowerCase()) {
      case "development": return <Code className="w-4 h-4" />
      case "design": return <Palette className="w-4 h-4" />
      case "media": return <Tv className="w-4 h-4" />
      case "research": return <FileText className="w-4 h-4" />
      default: return <Briefcase className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Header */}
      <div className="border-b border-white/10 bg-[#0d1117]/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">DAO Governance Hub</h1>
              <p className="text-white/50 text-sm">Decentralized democracy for the next generation</p>
            </div>
            <div className="flex items-center gap-4">
              {/* Token Balance Display */}
              <div className="hidden md:flex items-center gap-3 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/20 rounded-xl px-4 py-2">
                <Coins className="w-5 h-5 text-amber-400" />
                <div>
                  <p className="text-xs text-amber-400/70">$NEXT Balance</p>
                  <p className="text-lg font-bold text-amber-400">{demoTokenBalance.nextTokens.toLocaleString()}</p>
                </div>
              </div>
              
              {/* Voting Power */}
              <div className="hidden md:flex items-center gap-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl px-4 py-2">
                <Zap className="w-5 h-5 text-purple-400" />
                <div>
                  <p className="text-xs text-purple-400/70">Voting Power</p>
                  <p className="text-lg font-bold text-purple-400">{demoTokenBalance.votingPower}</p>
                </div>
              </div>

              <Button 
                variant="outline" 
                size="sm"
                className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                asChild
              >
                <Link href="/auth/logout">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="bg-white/5 border border-white/10 p-1 flex-wrap h-auto gap-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="proposals" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Vote className="w-4 h-4 mr-2" />
              Proposals
            </TabsTrigger>
            <TabsTrigger value="assembly" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Users className="w-4 h-4 mr-2" />
              Youth Assembly
            </TabsTrigger>
            <TabsTrigger value="treasury" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Wallet className="w-4 h-4 mr-2" />
              Treasury
            </TabsTrigger>
            <TabsTrigger value="bounties" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Target className="w-4 h-4 mr-2" />
              Bounty Board
            </TabsTrigger>
            <TabsTrigger value="identity" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Shield className="w-4 h-4 mr-2" />
              Identity (SBTs)
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <Vote className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">{proposals.filter(p => p.status === "Active").length}</p>
                      <p className="text-xs text-white/50">Active Proposals</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">{proposals.filter(p => p.status === "Passed").length}</p>
                      <p className="text-xs text-white/50">Passed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-500/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                      <Coins className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">$124.5K</p>
                      <p className="text-xs text-white/50">Treasury Balance</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                      <Users className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">2,847</p>
                      <p className="text-xs text-white/50">DAO Members</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Architecture Overview */}
            <Card className="bg-[#0d1117] border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-400" />
                  DAO Architecture Layers
                </CardTitle>
                <CardDescription className="text-white/50">
                  Our decentralized governance system is built on multiple layers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Governance Layer */}
                <div className="p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <Vote className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Governance Layer</h3>
                      <p className="text-xs text-white/50">Quadratic Voting & Youth Assembly</p>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="bg-white/5 rounded-lg p-3">
                      <h4 className="text-sm font-medium text-blue-400 mb-2">Quadratic Voting Protocol</h4>
                      <ul className="text-xs text-white/70 space-y-1">
                        <li>• Soulbound IDs enforce one-person-one-identity</li>
                        <li>• Policy proposals & representative selection</li>
                        <li>• Fair budget allocation mechanisms</li>
                      </ul>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                      <h4 className="text-sm font-medium text-cyan-400 mb-2">Youth Assembly</h4>
                      <ul className="text-xs text-white/70 space-y-1">
                        <li>• Minimum 70% members under age 40</li>
                        <li>• On-chain legislative proposals</li>
                        <li>• Collective veto power on harmful policies</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Identity Layer */}
                <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Identity & Verification Layer</h3>
                      <p className="text-xs text-white/50">Soulbound Tokens & Campaign Vaults</p>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="bg-white/5 rounded-lg p-3">
                      <h4 className="text-sm font-medium text-purple-400 mb-2">Soulbound Tokens (SBTs)</h4>
                      <ul className="text-xs text-white/70 space-y-1">
                        <li>• Age-verified citizenship/residency</li>
                        <li>• Non-transferable civic credentials</li>
                        <li>• Participation & reputation tracking</li>
                      </ul>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                      <h4 className="text-sm font-medium text-pink-400 mb-2">Crypto-Campaign Vaults</h4>
                      <ul className="text-xs text-white/70 space-y-1">
                        <li>• Transparent, on-chain political financing</li>
                        <li>• Youth candidate funding pools</li>
                        <li>• Real-time inflow/outflow auditability</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Service Layer */}
                <div className="p-4 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/20 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                      <Coins className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Service & Labor Module</h3>
                      <p className="text-xs text-white/50">$NEXT Coin & Bounty Board</p>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="bg-white/5 rounded-lg p-3">
                      <h4 className="text-sm font-medium text-amber-400 mb-2">$NEXT Coin</h4>
                      <ul className="text-xs text-white/70 space-y-1">
                        <li>• Asset-backed (Lithium, Hydrogen, Strategic Resources)</li>
                        <li>• UBI distribution & campaign funding</li>
                        <li>• Public-goods investment</li>
                      </ul>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                      <h4 className="text-sm font-medium text-yellow-400 mb-2">DAO Bounty Board</h4>
                      <ul className="text-xs text-white/70 space-y-1">
                        <li>• Task marketplace for developers & designers</li>
                        <li>• Media creator opportunities</li>
                        <li>• Paid exclusively in $NEXT</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Communication Layer */}
                <div className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                      <Globe className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Communication & Media Layer</h3>
                      <p className="text-xs text-white/50">Youth Media DAO & Digital Parliament</p>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="bg-white/5 rounded-lg p-3">
                      <h4 className="text-sm font-medium text-green-400 mb-2">Youth Media DAO</h4>
                      <ul className="text-xs text-white/70 space-y-1">
                        <li>• Crowdsourced, decentralized media network</li>
                        <li>• 70% revenue share to creators</li>
                        <li>• Anti-algorithmic suppression design</li>
                      </ul>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                      <h4 className="text-sm font-medium text-emerald-400 mb-2">AR / Digital Parliament</h4>
                      <ul className="text-xs text-white/70 space-y-1">
                        <li>• Live-streamed debates</li>
                        <li>• Policy visualization & simulation</li>
                        <li>• Public deliberation in immersive environments</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Recent Proposals */}
              <Card className="bg-[#0d1117] border-white/10">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-white text-lg">Recent Proposals</CardTitle>
                    <CardDescription className="text-white/50">Latest governance activity</CardDescription>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                    onClick={() => setActiveTab("proposals")}
                  >
                    View All
                  </Button>
                </CardHeader>
                <CardContent className="space-y-3">
                  {proposals.slice(0, 3).map((proposal) => {
                    const totalVotes = proposal.votes_for + proposal.votes_against
                    const forPercentage = totalVotes > 0 ? (proposal.votes_for / totalVotes) * 100 : 50
                    
                    return (
                      <div key={proposal.id} className="p-3 bg-white/5 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-white line-clamp-1">{proposal.title}</h4>
                            <p className="text-xs text-white/50">
                              {proposal.municipality?.name}, {proposal.municipality?.province}
                            </p>
                          </div>
                          <Badge 
                            className={
                              proposal.status === "Active" 
                                ? "bg-green-500/20 text-green-400 border-green-500/30"
                                : proposal.status === "Passed"
                                ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                                : "bg-red-500/20 text-red-400 border-red-500/30"
                            }
                          >
                            {proposal.status}
                          </Badge>
                        </div>
                        <Progress value={forPercentage} className="h-1.5" />
                        <div className="flex justify-between text-xs text-white/40 mt-1">
                          <span>{proposal.votes_for} for</span>
                          <span>{proposal.votes_against} against</span>
                        </div>
                      </div>
                    )
                  })}
                  {proposals.length === 0 && (
                    <div className="text-center py-8 text-white/50">
                      <Vote className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No proposals yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Your SBT Credentials */}
              <Card className="bg-[#0d1117] border-white/10">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-white text-lg">Your Soulbound Tokens</CardTitle>
                    <CardDescription className="text-white/50">Non-transferable credentials</CardDescription>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                    onClick={() => setActiveTab("identity")}
                  >
                    View All
                  </Button>
                </CardHeader>
                <CardContent className="space-y-3">
                  {demoSBTCredentials.slice(0, 4).map((sbt) => (
                    <div 
                      key={sbt.id} 
                      className={`p-3 rounded-lg flex items-center gap-3 ${
                        sbt.earned 
                          ? "bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20" 
                          : "bg-white/5 border border-white/10 opacity-50"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        sbt.earned ? "bg-purple-500/20" : "bg-white/10"
                      }`}>
                        <sbt.icon className={`w-5 h-5 ${sbt.earned ? "text-purple-400" : "text-white/30"}`} />
                      </div>
                      <div className="flex-1">
                        <h4 className={`text-sm font-medium ${sbt.earned ? "text-white" : "text-white/50"}`}>
                          {sbt.name}
                        </h4>
                        <p className="text-xs text-white/40">{sbt.description}</p>
                      </div>
                      {sbt.earned ? (
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                      ) : (
                        <Lock className="w-5 h-5 text-white/30" />
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Proposals Tab */}
          <TabsContent value="proposals" className="space-y-6">
            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="flex flex-1 gap-3 w-full md:w-auto">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <Input 
                    placeholder="Search proposals..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[140px] bg-white/5 border-white/10 text-white">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="passed">Passed</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500"
                asChild
              >
                <Link href="/governance/create">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Proposal
                </Link>
              </Button>
            </div>

            {/* Proposals List */}
            <div className="space-y-4">
              {filteredProposals.map((proposal) => {
                const userVote = userVoteMap.get(proposal.id)
                const totalVotes = proposal.votes_for + proposal.votes_against
                const forPercentage = totalVotes > 0 ? (proposal.votes_for / totalVotes) * 100 : 50
                const creatorName = creatorMap.get(proposal.created_by)?.full_name || "Unknown"

                return (
                  <Card key={proposal.id} className="bg-[#0d1117] border-white/10 overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Main Content */}
                        <div className="flex-1 space-y-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge 
                                  className={
                                    proposal.status === "Active" 
                                      ? "bg-green-500/20 text-green-400 border-green-500/30"
                                      : proposal.status === "Passed"
                                      ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                                      : "bg-red-500/20 text-red-400 border-red-500/30"
                                  }
                                >
                                  {proposal.status}
                                </Badge>
                                <Badge variant="outline" className="border-white/20 text-white/70">
                                  {proposal.proposal_type}
                                </Badge>
                              </div>
                              <h3 className="text-xl font-semibold text-white">{proposal.title}</h3>
                              <p className="text-sm text-white/50">
                                {proposal.municipality?.name}, {proposal.municipality?.province}
                              </p>
                            </div>
                          </div>

                          <p className="text-sm text-white/70">{proposal.description}</p>

                          {/* Vote Progress */}
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-green-400">Support: {forPercentage.toFixed(1)}%</span>
                              <span className="text-white/50">{totalVotes} total votes</span>
                            </div>
                            <div className="h-3 bg-white/10 rounded-full overflow-hidden flex">
                              <div 
                                className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all"
                                style={{ width: `${forPercentage}%` }}
                              />
                              <div 
                                className="h-full bg-gradient-to-r from-red-500 to-red-400"
                                style={{ width: `${100 - forPercentage}%` }}
                              />
                            </div>
                            <div className="flex justify-between text-xs text-white/40">
                              <span className="flex items-center gap-1">
                                <ThumbsUp className="w-3 h-3" />
                                {proposal.votes_for} for
                              </span>
                              <span className="flex items-center gap-1">
                                <ThumbsDown className="w-3 h-3" />
                                {proposal.votes_against} against
                              </span>
                            </div>
                          </div>

                          {/* Meta Info */}
                          <div className="flex items-center gap-4 text-xs text-white/40 pt-2 border-t border-white/10">
                            <span>Proposed by {creatorName}</span>
                            <span>•</span>
                            <span>{new Date(proposal.created_at).toLocaleDateString()}</span>
                            {proposal.expires_at && (
                              <>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  Expires {new Date(proposal.expires_at).toLocaleDateString()}
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Voting Section */}
                        {proposal.status === "Active" && (
                          <div className="flex flex-row md:flex-col gap-2 md:border-l md:border-white/10 md:pl-6">
                            <Button
                              variant={userVote === "for" ? "default" : "outline"}
                              className={
                                userVote === "for"
                                  ? "bg-green-600 hover:bg-green-500 flex-1"
                                  : "border-green-500/50 text-green-400 hover:bg-green-500/10 flex-1 bg-transparent"
                              }
                              disabled={votingProposal === proposal.id}
                              onClick={() => handleVote(proposal.id, "for")}
                            >
                              <ThumbsUp className="w-4 h-4 mr-2" />
                              Vote For
                            </Button>
                            <Button
                              variant={userVote === "against" ? "default" : "outline"}
                              className={
                                userVote === "against"
                                  ? "bg-red-600 hover:bg-red-500 flex-1"
                                  : "border-red-500/50 text-red-400 hover:bg-red-500/10 flex-1 bg-transparent"
                              }
                              disabled={votingProposal === proposal.id}
                              onClick={() => handleVote(proposal.id, "against")}
                            >
                              <ThumbsDown className="w-4 h-4 mr-2" />
                              Vote Against
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}

              {filteredProposals.length === 0 && (
                <Card className="bg-[#0d1117] border-white/10">
                  <CardContent className="p-12 text-center">
                    <Vote className="w-12 h-12 mx-auto mb-4 text-white/20" />
                    <p className="text-white/50 mb-4">No proposals found</p>
                    <Button asChild>
                      <Link href="/governance/create">Create the first proposal</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Youth Assembly Tab */}
          <TabsContent value="assembly" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Assembly Stats */}
              <Card className="md:col-span-3 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-cyan-500/20">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 flex items-center justify-center">
                        <Building2 className="w-8 h-8 text-cyan-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">Youth Assembly</h3>
                        <p className="text-white/50">On-Chain Legislature with 70% Under-40 Membership</p>
                      </div>
                    </div>
                    <div className="flex gap-8">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-cyan-400">47</p>
                        <p className="text-xs text-white/50">Assembly Members</p>
                      </div>
                      <div className="text-center">
                        <p className="text-3xl font-bold text-blue-400">78%</p>
                        <p className="text-xs text-white/50">Under 40</p>
                      </div>
                      <div className="text-center">
                        <p className="text-3xl font-bold text-purple-400">12</p>
                        <p className="text-xs text-white/50">Active Bills</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Assembly Members */}
              <Card className="md:col-span-2 bg-[#0d1117] border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Assembly Members</CardTitle>
                  <CardDescription className="text-white/50">Elected representatives in the Youth Assembly</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {demoAssemblyMembers.map((member, index) => (
                    <div key={member.id} className="flex items-center gap-4 p-3 bg-white/5 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                        {member.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-medium text-white">{member.name}</h4>
                          {index === 0 && <Crown className="w-4 h-4 text-amber-400" />}
                        </div>
                        <p className="text-xs text-white/50">{member.role} • Age {member.age}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-purple-400">{member.reputation}</p>
                        <p className="text-xs text-white/40">reputation</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-blue-400">{member.proposals}</p>
                        <p className="text-xs text-white/40">proposals</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Veto Powers */}
              <Card className="bg-[#0d1117] border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                    Veto Powers
                  </CardTitle>
                  <CardDescription className="text-white/50">
                    Collective power to block generationally harmful policies
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                    <h4 className="text-sm font-medium text-amber-400 mb-2">Active Veto Threshold</h4>
                    <p className="text-2xl font-bold text-white">67%</p>
                    <p className="text-xs text-white/50 mt-1">Required for collective veto</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-white">Recent Veto Actions</h4>
                    <div className="p-3 bg-white/5 rounded-lg">
                      <p className="text-sm text-white">Climate Rollback Bill #42</p>
                      <p className="text-xs text-red-400">Vetoed - 78% Assembly Support</p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg">
                      <p className="text-sm text-white">Education Cuts Proposal</p>
                      <p className="text-xs text-red-400">Vetoed - 82% Assembly Support</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Treasury Tab */}
          <TabsContent value="treasury" className="space-y-6">
            <div className="grid md:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border-amber-500/20">
                <CardContent className="p-4">
                  <Coins className="w-6 h-6 text-amber-400 mb-2" />
                  <p className="text-2xl font-bold text-white">$124,500</p>
                  <p className="text-xs text-white/50">Treasury Balance</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
                <CardContent className="p-4">
                  <TrendingUp className="w-6 h-6 text-green-400 mb-2" />
                  <p className="text-2xl font-bold text-white">$45,200</p>
                  <p className="text-xs text-white/50">This Month Inflow</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
                <CardContent className="p-4">
                  <Award className="w-6 h-6 text-blue-400 mb-2" />
                  <p className="text-2xl font-bold text-white">$32,800</p>
                  <p className="text-xs text-white/50">Distributed to Bounties</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
                <CardContent className="p-4">
                  <Users className="w-6 h-6 text-purple-400 mb-2" />
                  <p className="text-2xl font-bold text-white">$18,500</p>
                  <p className="text-xs text-white/50">Campaign Funding</p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-[#0d1117] border-white/10">
              <CardHeader>
                <CardTitle className="text-white">$NEXT Token Economics</CardTitle>
                <CardDescription className="text-white/50">Asset-backed governance token</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-white">Backing Assets</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-white/70">Lithium Reserves</span>
                        <span className="text-sm text-amber-400">35%</span>
                      </div>
                      <Progress value={35} className="h-2" />
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-white/70">Hydrogen Credits</span>
                        <span className="text-sm text-green-400">25%</span>
                      </div>
                      <Progress value={25} className="h-2" />
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-white/70">Strategic Resources</span>
                        <span className="text-sm text-blue-400">40%</span>
                      </div>
                      <Progress value={40} className="h-2" />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-white">Token Distribution</h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-white/5 rounded-lg">
                        <div className="flex justify-between">
                          <span className="text-sm text-white/70">UBI Distribution</span>
                          <span className="text-sm text-white">40%</span>
                        </div>
                      </div>
                      <div className="p-3 bg-white/5 rounded-lg">
                        <div className="flex justify-between">
                          <span className="text-sm text-white/70">Campaign Funding</span>
                          <span className="text-sm text-white">30%</span>
                        </div>
                      </div>
                      <div className="p-3 bg-white/5 rounded-lg">
                        <div className="flex justify-between">
                          <span className="text-sm text-white/70">Public Goods</span>
                          <span className="text-sm text-white">30%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-white">Your Holdings</h4>
                    <div className="p-4 bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border border-amber-500/20 rounded-xl">
                      <p className="text-3xl font-bold text-amber-400">{demoTokenBalance.nextTokens}</p>
                      <p className="text-sm text-white/50">$NEXT Tokens</p>
                      <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-white/50">Staked</span>
                          <span className="text-white">{demoTokenBalance.stakedTokens}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-white/50">Pending Rewards</span>
                          <span className="text-green-400">+{demoTokenBalance.pendingRewards}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bounty Board Tab */}
          <TabsContent value="bounties" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">DAO Bounty Board</h2>
                <p className="text-white/50 text-sm">Earn $NEXT tokens by completing tasks</p>
              </div>
              <Button className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500">
                <Plus className="w-4 h-4 mr-2" />
                Post Bounty
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {demoBounties.map((bounty) => (
                <Card key={bounty.id} className="bg-[#0d1117] border-white/10 hover:border-amber-500/30 transition-colors">
                  <CardContent className="p-4 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                        {getCategoryIcon(bounty.category)}
                      </div>
                      <Badge className={
                        bounty.difficulty === "Easy" 
                          ? "bg-green-500/20 text-green-400 border-green-500/30"
                          : bounty.difficulty === "Medium"
                          ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                          : "bg-red-500/20 text-red-400 border-red-500/30"
                      }>
                        {bounty.difficulty}
                      </Badge>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-white line-clamp-2">{bounty.title}</h3>
                      <p className="text-xs text-white/50 mt-1">{bounty.category}</p>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t border-white/10">
                      <div className="flex items-center gap-1">
                        <Coins className="w-4 h-4 text-amber-400" />
                        <span className="font-bold text-amber-400">{bounty.reward}</span>
                        <span className="text-xs text-white/50">$NEXT</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-white/50">
                        <Users className="w-3 h-3" />
                        {bounty.applicants} applicants
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/40 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Due {new Date(bounty.deadline).toLocaleDateString()}
                      </span>
                      <Button size="sm" variant="outline" className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10 bg-transparent">
                        Apply
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Identity (SBTs) Tab */}
          <TabsContent value="identity" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Your Identity Card */}
              <Card className="md:col-span-1 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
                <CardContent className="p-6 text-center">
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-3xl font-bold text-white mb-4">
                    {profile?.full_name?.charAt(0) || user.email?.charAt(0) || "?"}
                  </div>
                  <h3 className="text-lg font-bold text-white">{profile?.full_name || "User"}</h3>
                  <p className="text-sm text-white/50 mb-4">{user.email}</p>
                  
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Shield className="w-5 h-5 text-purple-400" />
                    <span className="text-purple-400 font-medium">Soulbound Identity</span>
                  </div>
                  
                  <div className="p-4 bg-white/5 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50">Credentials Earned</span>
                      <span className="text-white">{demoSBTCredentials.filter(s => s.earned).length}/{demoSBTCredentials.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50">Voting Power</span>
                      <span className="text-purple-400">{demoTokenBalance.votingPower}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50">Reputation Score</span>
                      <span className="text-amber-400">720</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* All SBT Credentials */}
              <Card className="md:col-span-2 bg-[#0d1117] border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Soulbound Token Credentials</CardTitle>
                  <CardDescription className="text-white/50">
                    Non-transferable credentials that prove your civic participation
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid sm:grid-cols-2 gap-4">
                  {demoSBTCredentials.map((sbt) => (
                    <div 
                      key={sbt.id}
                      className={`p-4 rounded-xl border ${
                        sbt.earned 
                          ? "bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30" 
                          : "bg-white/5 border-white/10"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          sbt.earned ? "bg-purple-500/20" : "bg-white/10"
                        }`}>
                          <sbt.icon className={`w-6 h-6 ${sbt.earned ? "text-purple-400" : "text-white/30"}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className={`font-medium ${sbt.earned ? "text-white" : "text-white/50"}`}>
                              {sbt.name}
                            </h4>
                            {sbt.earned && <CheckCircle2 className="w-4 h-4 text-green-400" />}
                          </div>
                          <p className="text-xs text-white/50 mt-1">{sbt.description}</p>
                          {!sbt.earned && (
                            <Button size="sm" variant="outline" className="mt-2 text-xs border-white/20 text-white/70 hover:bg-white/10 bg-transparent">
                              View Requirements
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Verification Status */}
            <Card className="bg-[#0d1117] border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Identity Verification Status</CardTitle>
                <CardDescription className="text-white/50">
                  One-person-one-identity verification for fair governance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-center">
                    <CheckCircle2 className="w-8 h-8 text-green-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-white">Email Verified</p>
                    <p className="text-xs text-white/50">Completed</p>
                  </div>
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-center">
                    <CheckCircle2 className="w-8 h-8 text-green-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-white">Age Verification</p>
                    <p className="text-xs text-white/50">Under 40 Confirmed</p>
                  </div>
                  <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg text-center">
                    <Clock className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-white">Residency Proof</p>
                    <p className="text-xs text-white/50">Pending Review</p>
                  </div>
                  <div className="p-4 bg-white/5 border border-white/10 rounded-lg text-center">
                    <Lock className="w-8 h-8 text-white/30 mx-auto mb-2" />
                    <p className="text-sm font-medium text-white/50">Biometric ID</p>
                    <p className="text-xs text-white/40">Not Started</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
