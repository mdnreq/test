"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  ArrowLeft, 
  Vote, 
  Scale, 
  Clock, 
  Shield, 
  Users, 
  Zap,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Lock,
  Unlock,
  Info,
  ChevronRight,
  Coins,
  Timer,
  BarChart3,
  GitBranch,
  Layers
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// Consensus mechanism types
const consensusMechanisms = [
  {
    id: "quadratic",
    name: "Quadratic Voting",
    icon: Scale,
    description: "Voting power equals the square root of tokens committed. Prevents plutocracy and gives minorities a voice.",
    color: "from-blue-500 to-cyan-500",
    usedFor: ["Policy Proposals", "Budget Allocation", "Representative Selection"],
    formula: "Voting Power = √(Tokens Committed)",
    pros: ["Prevents whale dominance", "Encourages broader participation", "Fair representation"],
    cons: ["Complex to understand", "Requires identity verification", "Can be gamed with multiple accounts"]
  },
  {
    id: "conviction",
    name: "Conviction Voting",
    icon: TrendingUp,
    description: "Votes accumulate power over time. The longer you commit, the stronger your vote becomes.",
    color: "from-purple-500 to-pink-500",
    usedFor: ["Long-term Policy", "Treasury Grants", "Community Priorities"],
    formula: "Conviction = Tokens × Time Staked",
    pros: ["Rewards long-term commitment", "Reduces snap decisions", "Continuous voting"],
    cons: ["Slower decision making", "Favors patient voters", "Complex accumulation"]
  },
  {
    id: "holographic",
    name: "Holographic Consensus",
    icon: Zap,
    description: "Prediction markets boost important proposals. Stake tokens to signal proposal significance.",
    color: "from-yellow-500 to-orange-500",
    usedFor: ["Urgent Decisions", "Contested Proposals", "High-Impact Changes"],
    formula: "Boosted if Prediction Stake > Threshold",
    pros: ["Fast decisions when needed", "Market-driven prioritization", "Scalable governance"],
    cons: ["Requires prediction markets", "Can favor wealthy", "Complex mechanics"]
  },
  {
    id: "optimistic",
    name: "Optimistic Governance",
    icon: CheckCircle2,
    description: "Proposals pass automatically unless vetoed. Youth Assembly holds veto power for harmful policies.",
    color: "from-green-500 to-emerald-500",
    usedFor: ["Routine Decisions", "Minor Updates", "Administrative Actions"],
    formula: "Passes after Timelock unless Vetoed",
    pros: ["Efficient for routine items", "Reduces voter fatigue", "Clear veto process"],
    cons: ["Requires vigilant monitoring", "Veto power concentration", "May miss issues"]
  },
  {
    id: "multisig",
    name: "Multi-Signature",
    icon: Lock,
    description: "Multiple signers required for execution. Used for treasury and critical operations.",
    color: "from-red-500 to-rose-500",
    usedFor: ["Treasury Releases", "Smart Contract Upgrades", "Emergency Actions"],
    formula: "M-of-N Signatures Required",
    pros: ["High security", "Distributed control", "Prevents single point of failure"],
    cons: ["Slower execution", "Coordination required", "Key management complexity"]
  },
  {
    id: "delegated",
    name: "Liquid Democracy",
    icon: GitBranch,
    description: "Delegate your voting power to trusted representatives. Reclaim anytime.",
    color: "from-indigo-500 to-violet-500",
    usedFor: ["Representative Selection", "Specialized Decisions", "Low-engagement Voters"],
    formula: "Delegated Power = Sum of Delegator Tokens",
    pros: ["Expert-driven decisions", "Flexible participation", "Scalable democracy"],
    cons: ["Power concentration risk", "Delegation tracking", "Accountability challenges"]
  }
]

// Active proposals using different mechanisms
const activeProposals = [
  {
    id: 1,
    title: "Youth Climate Action Fund - $50,000 Allocation",
    mechanism: "quadratic",
    status: "active",
    votesFor: 1247,
    votesAgainst: 423,
    quorum: 2000,
    timeLeft: "3 days",
    yourVotes: 0,
    maxVotes: 100
  },
  {
    id: 2,
    title: "Permanent Remote Voting Infrastructure",
    mechanism: "conviction",
    status: "active",
    conviction: 78,
    threshold: 100,
    supporters: 89,
    timeActive: "12 days",
    yourStake: 0
  },
  {
    id: 3,
    title: "Emergency: Security Patch Deployment",
    mechanism: "holographic",
    status: "boosted",
    predictionStake: 15000,
    boostThreshold: 10000,
    votesFor: 892,
    votesAgainst: 34,
    timeLeft: "6 hours"
  },
  {
    id: 4,
    title: "Update Community Guidelines v2.3",
    mechanism: "optimistic",
    status: "pending",
    timelock: "5 days",
    vetoVotes: 12,
    vetoThreshold: 100,
    proposer: "Community Council"
  },
  {
    id: 5,
    title: "Treasury Release: Q1 Campaign Grants",
    mechanism: "multisig",
    status: "awaiting",
    signaturesCollected: 4,
    signaturesRequired: 7,
    amount: "$125,000",
    signers: ["Treasury Council"]
  }
]

export default function ConsensusMechanismsPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedMechanism, setSelectedMechanism] = useState<string | null>(null)
  const [quadraticVotes, setQuadraticVotes] = useState(0)
  const [convictionStake, setConvictionStake] = useState(0)
  const [delegateTo, setDelegateTo] = useState<string | null>(null)

  // Calculate quadratic voting cost
  const quadraticCost = quadraticVotes * quadraticVotes

  // User's token balance (demo)
  const userTokens = 500

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <div className="border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/governance">
              <Button variant="ghost" size="sm" className="text-white/70 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Governance
              </Button>
            </Link>
            <div className="h-6 w-px bg-white/20" />
            <div>
              <h1 className="text-xl font-bold text-white">Consensus Mechanisms</h1>
              <p className="text-sm text-white/50">How decisions are made in the DAO</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="bg-white/5 border border-white/10 p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white/10">
              <Layers className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="vote" className="data-[state=active]:bg-white/10">
              <Vote className="w-4 h-4 mr-2" />
              Cast Votes
            </TabsTrigger>
            <TabsTrigger value="delegate" className="data-[state=active]:bg-white/10">
              <GitBranch className="w-4 h-4 mr-2" />
              Delegation
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-white/10">
              <Clock className="w-4 h-4 mr-2" />
              History
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            {/* Mechanism Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {consensusMechanisms.map((mechanism) => (
                <Card 
                  key={mechanism.id}
                  className={`bg-gradient-to-br ${mechanism.color} p-[1px] rounded-2xl cursor-pointer transition-transform hover:scale-[1.02]`}
                  onClick={() => setSelectedMechanism(selectedMechanism === mechanism.id ? null : mechanism.id)}
                >
                  <div className="bg-[#0d1117] rounded-2xl p-6 h-full">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${mechanism.color} flex items-center justify-center`}>
                        <mechanism.icon className="w-6 h-6 text-white" />
                      </div>
                      <Badge variant="outline" className="border-white/20 text-white/70">
                        {mechanism.usedFor.length} use cases
                      </Badge>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{mechanism.name}</h3>
                    <p className="text-sm text-white/60 mb-4">{mechanism.description}</p>
                    
                    {selectedMechanism === mechanism.id && (
                      <div className="space-y-4 pt-4 border-t border-white/10 animate-in fade-in slide-in-from-top-2">
                        <div>
                          <p className="text-xs text-white/40 mb-1">Formula</p>
                          <code className="text-xs bg-white/5 px-2 py-1 rounded text-cyan-400">
                            {mechanism.formula}
                          </code>
                        </div>
                        <div>
                          <p className="text-xs text-white/40 mb-2">Used For</p>
                          <div className="flex flex-wrap gap-1">
                            {mechanism.usedFor.map((use) => (
                              <Badge key={use} className="bg-white/10 text-white/70 text-xs">
                                {use}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-green-400 mb-1">Pros</p>
                            <ul className="text-xs text-white/50 space-y-1">
                              {mechanism.pros.map((pro) => (
                                <li key={pro} className="flex items-start gap-1">
                                  <CheckCircle2 className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                                  {pro}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-xs text-red-400 mb-1">Cons</p>
                            <ul className="text-xs text-white/50 space-y-1">
                              {mechanism.cons.map((con) => (
                                <li key={con} className="flex items-start gap-1">
                                  <AlertTriangle className="w-3 h-3 text-red-400 mt-0.5 flex-shrink-0" />
                                  {con}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full mt-4 text-white/50 hover:text-white"
                    >
                      {selectedMechanism === mechanism.id ? "Show Less" : "Learn More"}
                      <ChevronRight className={`w-4 h-4 ml-1 transition-transform ${selectedMechanism === mechanism.id ? "rotate-90" : ""}`} />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {/* How Consensus Works */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Info className="w-5 h-5 text-blue-400" />
                  How Consensus Works in Next Majority DAO
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-3">
                      <span className="text-blue-400 font-bold">1</span>
                    </div>
                    <h4 className="text-white font-medium mb-1">Proposal Submitted</h4>
                    <p className="text-sm text-white/50">Any SBT holder can submit a proposal with required stake</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-3">
                      <span className="text-purple-400 font-bold">2</span>
                    </div>
                    <h4 className="text-white font-medium mb-1">Mechanism Selected</h4>
                    <p className="text-sm text-white/50">Appropriate voting mechanism applied based on proposal type</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center mx-auto mb-3">
                      <span className="text-cyan-400 font-bold">3</span>
                    </div>
                    <h4 className="text-white font-medium mb-1">Voting Period</h4>
                    <p className="text-sm text-white/50">Community votes using their $NEXT tokens and SBT credentials</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-3">
                      <span className="text-green-400 font-bold">4</span>
                    </div>
                    <h4 className="text-white font-medium mb-1">Execution</h4>
                    <p className="text-sm text-white/50">Passed proposals execute on-chain after timelock period</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cast Votes Tab */}
          <TabsContent value="vote" className="space-y-6">
            {/* Token Balance */}
            <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                      <Coins className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-white/50">Your Voting Power</p>
                      <p className="text-2xl font-bold text-white">{userTokens} $NEXT</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-white/50">Quadratic Votes Available</p>
                    <p className="text-xl font-semibold text-cyan-400">{Math.floor(Math.sqrt(userTokens))} votes</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Active Proposals */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">Active Proposals</h2>
              
              {activeProposals.map((proposal) => (
                <Card key={proposal.id} className="bg-white/5 border-white/10">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={
                            proposal.mechanism === "quadratic" ? "bg-blue-500/20 text-blue-400" :
                            proposal.mechanism === "conviction" ? "bg-purple-500/20 text-purple-400" :
                            proposal.mechanism === "holographic" ? "bg-yellow-500/20 text-yellow-400" :
                            proposal.mechanism === "optimistic" ? "bg-green-500/20 text-green-400" :
                            "bg-red-500/20 text-red-400"
                          }>
                            {consensusMechanisms.find(m => m.id === proposal.mechanism)?.name}
                          </Badge>
                          <Badge variant="outline" className={
                            proposal.status === "active" ? "border-green-500/50 text-green-400" :
                            proposal.status === "boosted" ? "border-yellow-500/50 text-yellow-400" :
                            proposal.status === "pending" ? "border-blue-500/50 text-blue-400" :
                            "border-orange-500/50 text-orange-400"
                          }>
                            {proposal.status}
                          </Badge>
                        </div>
                        <h3 className="text-lg font-medium text-white">{proposal.title}</h3>
                      </div>
                      <div className="text-right">
                        {"timeLeft" in proposal && (
                          <div className="flex items-center gap-1 text-white/50 text-sm">
                            <Timer className="w-4 h-4" />
                            {proposal.timeLeft}
                          </div>
                        )}
                        {"timelock" in proposal && (
                          <div className="flex items-center gap-1 text-white/50 text-sm">
                            <Lock className="w-4 h-4" />
                            Timelock: {proposal.timelock}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Quadratic Voting */}
                    {proposal.mechanism === "quadratic" && "votesFor" in proposal && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-green-400">For: {proposal.votesFor}</span>
                              <span className="text-red-400">Against: {proposal.votesAgainst}</span>
                            </div>
                            <Progress 
                              value={(proposal.votesFor / (proposal.votesFor + proposal.votesAgainst)) * 100} 
                              className="h-2"
                            />
                            <p className="text-xs text-white/40 mt-1">
                              Quorum: {proposal.votesFor + proposal.votesAgainst}/{proposal.quorum}
                            </p>
                          </div>
                          <div className="bg-white/5 rounded-lg p-3">
                            <p className="text-sm text-white/50 mb-2">Cast Quadratic Votes</p>
                            <div className="flex items-center gap-3">
                              <Slider
                                value={[quadraticVotes]}
                                onValueChange={([v]) => setQuadraticVotes(v)}
                                max={Math.floor(Math.sqrt(userTokens))}
                                step={1}
                                className="flex-1"
                              />
                              <span className="text-white font-medium w-8">{quadraticVotes}</span>
                            </div>
                            <p className="text-xs text-white/40 mt-1">
                              Cost: {quadraticCost} $NEXT tokens
                            </p>
                            <div className="flex gap-2 mt-3">
                              <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-500">
                                Vote For
                              </Button>
                              <Button size="sm" variant="outline" className="flex-1 border-red-500/50 text-red-400 hover:bg-red-500/10 bg-transparent">
                                Vote Against
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Conviction Voting */}
                    {proposal.mechanism === "conviction" && "conviction" in proposal && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-white/50 mb-1">Conviction Progress</p>
                            <Progress value={proposal.conviction} className="h-3 mb-1" />
                            <div className="flex justify-between text-xs text-white/40">
                              <span>{proposal.conviction}% conviction</span>
                              <span>Threshold: {proposal.threshold}%</span>
                            </div>
                            <p className="text-xs text-white/40 mt-2">
                              {proposal.supporters} supporters | Active for {proposal.timeActive}
                            </p>
                          </div>
                          <div className="bg-white/5 rounded-lg p-3">
                            <p className="text-sm text-white/50 mb-2">Stake Tokens (builds over time)</p>
                            <div className="flex items-center gap-3">
                              <Slider
                                value={[convictionStake]}
                                onValueChange={([v]) => setConvictionStake(v)}
                                max={userTokens}
                                step={10}
                                className="flex-1"
                              />
                              <span className="text-white font-medium w-12">{convictionStake}</span>
                            </div>
                            <Button size="sm" className="w-full mt-3 bg-purple-600 hover:bg-purple-500">
                              Stake for Proposal
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Holographic Consensus */}
                    {proposal.mechanism === "holographic" && "predictionStake" in proposal && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-4 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                          <Zap className="w-5 h-5 text-yellow-400" />
                          <div className="flex-1">
                            <p className="text-sm text-yellow-400 font-medium">Boosted Proposal</p>
                            <p className="text-xs text-white/50">
                              Prediction stake: {proposal.predictionStake.toLocaleString()} $NEXT (threshold: {proposal.boostThreshold.toLocaleString()})
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button className="flex-1 bg-green-600 hover:bg-green-500">
                            Vote For ({proposal.votesFor})
                          </Button>
                          <Button variant="outline" className="flex-1 border-red-500/50 text-red-400 hover:bg-red-500/10 bg-transparent">
                            Vote Against ({proposal.votesAgainst})
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Optimistic Governance */}
                    {proposal.mechanism === "optimistic" && "vetoVotes" in proposal && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-4 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                          <CheckCircle2 className="w-5 h-5 text-green-400" />
                          <div className="flex-1">
                            <p className="text-sm text-green-400 font-medium">Will pass automatically</p>
                            <p className="text-xs text-white/50">
                              Unless {proposal.vetoThreshold - proposal.vetoVotes} more veto votes are cast
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-white/50">Veto votes: {proposal.vetoVotes}/{proposal.vetoThreshold}</p>
                            <Progress value={(proposal.vetoVotes / proposal.vetoThreshold) * 100} className="h-2 w-48 mt-1" />
                          </div>
                          <Button variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10 bg-transparent">
                            <Shield className="w-4 h-4 mr-2" />
                            Cast Veto
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Multi-sig */}
                    {proposal.mechanism === "multisig" && "signaturesCollected" in proposal && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-4 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                          <Lock className="w-5 h-5 text-red-400" />
                          <div className="flex-1">
                            <p className="text-sm text-red-400 font-medium">Awaiting Signatures</p>
                            <p className="text-xs text-white/50">
                              {proposal.signaturesCollected} of {proposal.signaturesRequired} required | Amount: {proposal.amount}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {Array.from({ length: proposal.signaturesRequired }).map((_, i) => (
                            <div 
                              key={i}
                              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                i < proposal.signaturesCollected 
                                  ? "bg-green-500/20 border-2 border-green-500" 
                                  : "bg-white/5 border-2 border-white/10"
                              }`}
                            >
                              {i < proposal.signaturesCollected ? (
                                <CheckCircle2 className="w-5 h-5 text-green-400" />
                              ) : (
                                <span className="text-white/30 text-sm">{i + 1}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Delegation Tab */}
          <TabsContent value="delegate" className="space-y-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Liquid Democracy - Delegate Your Votes</CardTitle>
                <CardDescription>
                  Delegate your voting power to trusted representatives. You can reclaim at any time.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Current Delegation Status */}
                <div className="p-4 bg-white/5 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white/50">Current Delegation</p>
                      <p className="text-lg font-medium text-white">
                        {delegateTo ? `Delegated to ${delegateTo}` : "Not delegating - voting directly"}
                      </p>
                    </div>
                    {delegateTo && (
                      <Button 
                        variant="outline" 
                        className="border-red-500/50 text-red-400 hover:bg-red-500/10 bg-transparent"
                        onClick={() => setDelegateTo(null)}
                      >
                        <Unlock className="w-4 h-4 mr-2" />
                        Reclaim Votes
                      </Button>
                    )}
                  </div>
                </div>

                {/* Delegate Options */}
                <div className="space-y-3">
                  <h3 className="text-white font-medium">Recommended Delegates</h3>
                  {[
                    { name: "Youth Climate Coalition", address: "0x1a2b...3c4d", votes: 45000, specialty: "Environmental Policy", alignment: 94 },
                    { name: "Digital Rights Council", address: "0x5e6f...7g8h", votes: 38000, specialty: "Tech & Privacy", alignment: 87 },
                    { name: "Education Reform Alliance", address: "0x9i0j...1k2l", votes: 29000, specialty: "Education", alignment: 91 },
                    { name: "Economic Justice Network", address: "0x3m4n...5o6p", votes: 22000, specialty: "Economic Policy", alignment: 82 }
                  ].map((delegate) => (
                    <div 
                      key={delegate.address}
                      className={`p-4 rounded-xl border transition-colors cursor-pointer ${
                        delegateTo === delegate.name 
                          ? "bg-blue-500/10 border-blue-500/50" 
                          : "bg-white/5 border-white/10 hover:border-white/20"
                      }`}
                      onClick={() => setDelegateTo(delegate.name)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                            <Users className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="text-white font-medium">{delegate.name}</p>
                            <p className="text-xs text-white/50">{delegate.address} | {delegate.specialty}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-white">{delegate.votes.toLocaleString()} votes</p>
                          <p className="text-xs text-green-400">{delegate.alignment}% alignment</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {delegateTo && (
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500">
                    <GitBranch className="w-4 h-4 mr-2" />
                    Confirm Delegation to {delegateTo}
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Your Voting History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { proposal: "Youth Assembly Expansion", mechanism: "quadratic", vote: "for", votes: 12, date: "2026-01-20", outcome: "passed" },
                    { proposal: "Treasury Diversification Plan", mechanism: "conviction", vote: "stake", votes: 100, date: "2026-01-15", outcome: "passed" },
                    { proposal: "Emergency Protocol Update", mechanism: "holographic", vote: "for", votes: 1, date: "2026-01-10", outcome: "passed" },
                    { proposal: "Controversial Policy X", mechanism: "optimistic", vote: "veto", votes: 1, date: "2026-01-05", outcome: "vetoed" },
                    { proposal: "Q4 Grant Distribution", mechanism: "multisig", vote: "signed", votes: 1, date: "2025-12-28", outcome: "executed" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          item.outcome === "passed" || item.outcome === "executed" ? "bg-green-400" :
                          item.outcome === "vetoed" ? "bg-red-400" : "bg-yellow-400"
                        }`} />
                        <div>
                          <p className="text-white font-medium">{item.proposal}</p>
                          <p className="text-xs text-white/50">
                            {item.mechanism} | {item.vote} ({item.votes} {item.mechanism === "conviction" ? "tokens staked" : "votes"}) | {item.date}
                          </p>
                        </div>
                      </div>
                      <Badge className={
                        item.outcome === "passed" ? "bg-green-500/20 text-green-400" :
                        item.outcome === "executed" ? "bg-blue-500/20 text-blue-400" :
                        item.outcome === "vetoed" ? "bg-red-500/20 text-red-400" :
                        "bg-yellow-500/20 text-yellow-400"
                      }>
                        {item.outcome}
                      </Badge>
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
