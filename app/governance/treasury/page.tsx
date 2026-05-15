"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  ArrowLeft, 
  Coins,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownLeft,
  Search,
  Filter,
  Download,
  ExternalLink,
  Calendar,
  Clock,
  PieChart,
  BarChart3,
  Wallet,
  Users,
  Building,
  Leaf,
  Zap,
  Shield,
  Eye,
  Copy,
  Check
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const treasuryOverview = {
  totalValue: 12450000,
  liquidAssets: 4500000,
  stakedAssets: 5200000,
  reserveFund: 2750000,
  monthlyInflow: 890000,
  monthlyOutflow: 650000,
  changePercent: 8.5
}

const assetBacking = [
  { name: "Lithium Reserves", value: 4500000, percentage: 36, icon: Zap, color: "cyan" },
  { name: "Hydrogen Credits", value: 3200000, percentage: 26, icon: Leaf, color: "green" },
  { name: "Strategic Resources", value: 2800000, percentage: 22, icon: Shield, color: "purple" },
  { name: "Cash Reserves", value: 1950000, percentage: 16, icon: Coins, color: "yellow" }
]

const budgetAllocation = [
  { category: "Universal Basic Income", allocated: 4980000, spent: 3850000, percentage: 40 },
  { category: "Campaign Funding Pool", allocated: 3735000, spent: 2100000, percentage: 30 },
  { category: "Public Goods Investment", allocated: 2490000, spent: 1800000, percentage: 20 },
  { category: "Operations & Development", allocated: 1245000, spent: 950000, percentage: 10 }
]

const recentTransactions = [
  { id: "0x1a2b3c...4d5e", type: "outflow", category: "UBI Distribution", amount: 125000, recipient: "District 5 Residents", date: "2 hours ago", status: "confirmed" },
  { id: "0x2b3c4d...5e6f", type: "inflow", category: "Resource Revenue", amount: 450000, recipient: "Treasury", date: "5 hours ago", status: "confirmed" },
  { id: "0x3c4d5e...6f7g", type: "outflow", category: "Campaign Grant", amount: 25000, recipient: "Candidate: Sarah Chen", date: "1 day ago", status: "confirmed" },
  { id: "0x4d5e6f...7g8h", type: "outflow", category: "Public Goods", amount: 180000, recipient: "Youth Center Development", date: "2 days ago", status: "confirmed" },
  { id: "0x5e6f7g...8h9i", type: "inflow", category: "Staking Rewards", amount: 89000, recipient: "Treasury", date: "3 days ago", status: "confirmed" },
  { id: "0x6f7g8h...9i0j", type: "outflow", category: "Bounty Payment", amount: 5000, recipient: "Developer: @alex_dev", date: "4 days ago", status: "confirmed" }
]

const proposalFunding = [
  { title: "Youth Transit Program", requested: 500000, approved: 450000, status: "funded", votes: 1245 },
  { title: "Community Garden Network", requested: 150000, approved: 150000, status: "funded", votes: 890 },
  { title: "Digital Literacy Initiative", requested: 300000, approved: 0, status: "pending", votes: 456 },
  { title: "Senior Care Partnership", requested: 200000, approved: 180000, status: "funded", votes: 678 }
]

export default function TreasuryExplorerPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(text)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="min-h-screen bg-[#030712]">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#030712]/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/governance">
                <Button variant="ghost" size="sm" className="text-white/70 hover:text-white">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="h-6 w-px bg-white/20" />
              <div>
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  <Coins className="w-5 h-5 text-yellow-400" />
                  Treasury Explorer
                </h1>
                <p className="text-sm text-white/50">Full transparency on DAO finances</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                <Eye className="w-3 h-3 mr-1" />
                Real-time Data
              </Badge>
              <Button variant="outline" className="border-white/20 text-white bg-transparent">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Treasury Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/30">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-yellow-400">Total Treasury Value</p>
                  <p className="text-3xl font-bold text-white mt-1">
                    ${(treasuryOverview.totalValue / 1000000).toFixed(2)}M
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-yellow-400" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-3 text-sm">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-green-400">+{treasuryOverview.changePercent}%</span>
                <span className="text-white/50">this month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-white/50">Monthly Inflow</p>
                  <p className="text-2xl font-bold text-green-400 mt-1">
                    +${(treasuryOverview.monthlyInflow / 1000).toFixed(0)}K
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <ArrowDownLeft className="w-5 h-5 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-white/50">Monthly Outflow</p>
                  <p className="text-2xl font-bold text-red-400 mt-1">
                    -${(treasuryOverview.monthlyOutflow / 1000).toFixed(0)}K
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                  <ArrowUpRight className="w-5 h-5 text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-white/50">Reserve Fund</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    ${(treasuryOverview.reserveFund / 1000000).toFixed(2)}M
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-white/5 border border-white/10 mb-6">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white/10">
              <PieChart className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="transactions" className="data-[state=active]:bg-white/10">
              <BarChart3 className="w-4 h-4 mr-2" />
              Transactions
            </TabsTrigger>
            <TabsTrigger value="budget" className="data-[state=active]:bg-white/10">
              <Coins className="w-4 h-4 mr-2" />
              Budget vs Actual
            </TabsTrigger>
            <TabsTrigger value="funding" className="data-[state=active]:bg-white/10">
              <Building className="w-4 h-4 mr-2" />
              Proposal Funding
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Asset Backing */}
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Asset Backing</CardTitle>
                  <CardDescription className="text-white/60">
                    $NEXT token is backed by these real assets
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {assetBacking.map((asset, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg bg-${asset.color}-500/20 flex items-center justify-center`}>
                            <asset.icon className={`w-5 h-5 text-${asset.color}-400`} />
                          </div>
                          <div>
                            <p className="text-white font-medium">{asset.name}</p>
                            <p className="text-sm text-white/50">${(asset.value / 1000000).toFixed(2)}M</p>
                          </div>
                        </div>
                        <span className="text-white font-medium">{asset.percentage}%</span>
                      </div>
                      <Progress value={asset.percentage} className="h-2 bg-white/10" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Distribution Breakdown */}
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Treasury Distribution</CardTitle>
                  <CardDescription className="text-white/60">
                    How funds are allocated across categories
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {budgetAllocation.map((item, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="w-16 text-right">
                          <span className="text-white font-medium">{item.percentage}%</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-white text-sm">{item.category}</p>
                          <Progress value={item.percentage} className="h-2 mt-1 bg-white/10" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-4 text-center">
                  <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">12,450</p>
                  <p className="text-sm text-white/50">UBI Recipients</p>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-4 text-center">
                  <Building className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">45</p>
                  <p className="text-sm text-white/50">Funded Proposals</p>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-4 text-center">
                  <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">234</p>
                  <p className="text-sm text-white/50">Bounties Paid</p>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-4 text-center">
                  <Shield className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">100%</p>
                  <p className="text-sm text-white/50">Audit Score</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Transaction History</CardTitle>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                      <Input
                        placeholder="Search transactions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 bg-white/5 border-white/10 text-white w-64"
                      />
                    </div>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-32 bg-white/5 border-white/10 text-white">
                        <Filter className="w-4 h-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="inflow">Inflow</SelectItem>
                        <SelectItem value="outflow">Outflow</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentTransactions.map((tx, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        tx.type === "inflow" ? "bg-green-500/20" : "bg-red-500/20"
                      }`}>
                        {tx.type === "inflow" ? (
                          <ArrowDownLeft className="w-5 h-5 text-green-400" />
                        ) : (
                          <ArrowUpRight className="w-5 h-5 text-red-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-white font-medium">{tx.category}</p>
                          <Badge variant="outline" className="border-white/20 text-white/60 text-xs">
                            {tx.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-white/50 truncate">{tx.recipient}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${tx.type === "inflow" ? "text-green-400" : "text-red-400"}`}>
                          {tx.type === "inflow" ? "+" : "-"}${tx.amount.toLocaleString()}
                        </p>
                        <p className="text-sm text-white/50">{tx.date}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-white/50 hover:text-white"
                          onClick={() => copyToClipboard(tx.id)}
                        >
                          {copied === tx.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                        <Button variant="ghost" size="sm" className="text-white/50 hover:text-white">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Budget Tab */}
          <TabsContent value="budget">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Budget vs Actual Spending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {budgetAllocation.map((item, index) => (
                    <div key={index} className="p-4 bg-white/5 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-white font-medium">{item.category}</h3>
                        <Badge className={
                          (item.spent / item.allocated) > 0.9 
                            ? "bg-red-500/20 text-red-400 border-red-500/30"
                            : (item.spent / item.allocated) > 0.7
                              ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                              : "bg-green-500/20 text-green-400 border-green-500/30"
                        }>
                          {((item.spent / item.allocated) * 100).toFixed(0)}% utilized
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-white/50">Allocated</p>
                          <p className="text-lg font-medium text-white">${(item.allocated / 1000000).toFixed(2)}M</p>
                        </div>
                        <div>
                          <p className="text-sm text-white/50">Spent</p>
                          <p className="text-lg font-medium text-orange-400">${(item.spent / 1000000).toFixed(2)}M</p>
                        </div>
                        <div>
                          <p className="text-sm text-white/50">Remaining</p>
                          <p className="text-lg font-medium text-green-400">${((item.allocated - item.spent) / 1000000).toFixed(2)}M</p>
                        </div>
                      </div>
                      <div className="relative h-4 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                          style={{ width: `${(item.spent / item.allocated) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Funding Tab */}
          <TabsContent value="funding">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Proposal Funding Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {proposalFunding.map((proposal, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-white font-medium">{proposal.title}</h3>
                          <Badge className={
                            proposal.status === "funded" 
                              ? "bg-green-500/20 text-green-400 border-green-500/30"
                              : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                          }>
                            {proposal.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-white/50 mt-1">{proposal.votes} votes</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white">Requested: ${proposal.requested.toLocaleString()}</p>
                        {proposal.approved > 0 && (
                          <p className="text-sm text-green-400">Approved: ${proposal.approved.toLocaleString()}</p>
                        )}
                      </div>
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
