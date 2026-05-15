"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  ArrowLeft, 
  BarChart3,
  Users,
  Vote,
  TrendingUp,
  TrendingDown,
  Calendar,
  Globe,
  PieChart,
  Activity,
  Target,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Download,
  RefreshCw
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const participationData = {
  totalVoters: 45678,
  activeThisMonth: 12450,
  proposalsCreated: 234,
  averageTurnout: 67.5,
  youthParticipation: 42.3,
  trends: {
    voters: +12.5,
    active: +8.2,
    proposals: -3.4,
    turnout: +5.1
  }
}

const demographicData = [
  { age: "16-18", count: 4567, percentage: 10 },
  { age: "19-24", count: 9134, percentage: 20 },
  { age: "25-30", count: 11876, percentage: 26 },
  { age: "31-40", count: 13678, percentage: 30 },
  { age: "40+", count: 6423, percentage: 14 }
]

const districtData = [
  { name: "Downtown", voters: 8900, turnout: 72, proposals: 45 },
  { name: "Northside", voters: 6700, turnout: 65, proposals: 32 },
  { name: "Eastview", voters: 7200, turnout: 58, proposals: 28 },
  { name: "Westend", voters: 5400, turnout: 71, proposals: 38 },
  { name: "Southgate", voters: 4300, turnout: 63, proposals: 24 }
]

const recentActivity = [
  { type: "vote", description: "Budget Proposal 2026", participants: 3456, time: "2 hours ago" },
  { type: "proposal", description: "New Transit Route", participants: 1, time: "5 hours ago" },
  { type: "townhall", description: "Youth Assembly Meeting", participants: 234, time: "1 day ago" },
  { type: "vote", description: "Park Renovation", participants: 2890, time: "2 days ago" }
]

export default function AnalyticsDashboardPage() {
  const [timeRange, setTimeRange] = useState("30d")
  const [activeTab, setActiveTab] = useState("overview")

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
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                  Public Analytics Dashboard
                </h1>
                <p className="text-sm text-white/50">Real-time participation & engagement metrics</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32 bg-white/5 border-white/10 text-white">
                  <Calendar className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="border-white/20 text-white bg-transparent">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="icon" className="border-white/20 text-white bg-transparent">
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-white/50">Total Registered Voters</p>
                  <p className="text-3xl font-bold text-white mt-1">
                    {participationData.totalVoters.toLocaleString()}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-400" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-3 text-sm">
                <ArrowUpRight className="w-4 h-4 text-green-400" />
                <span className="text-green-400">+{participationData.trends.voters}%</span>
                <span className="text-white/50">vs last period</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-white/50">Active This Month</p>
                  <p className="text-3xl font-bold text-white mt-1">
                    {participationData.activeThisMonth.toLocaleString()}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-green-400" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-3 text-sm">
                <ArrowUpRight className="w-4 h-4 text-green-400" />
                <span className="text-green-400">+{participationData.trends.active}%</span>
                <span className="text-white/50">vs last period</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-white/50">Average Voter Turnout</p>
                  <p className="text-3xl font-bold text-white mt-1">
                    {participationData.averageTurnout}%
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Vote className="w-5 h-5 text-purple-400" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-3 text-sm">
                <ArrowUpRight className="w-4 h-4 text-green-400" />
                <span className="text-green-400">+{participationData.trends.turnout}%</span>
                <span className="text-white/50">vs last period</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-cyan-500/30">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-cyan-400">Youth Participation</p>
                  <p className="text-3xl font-bold text-white mt-1">
                    {participationData.youthParticipation}%
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                  <Target className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-3 text-sm">
                <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                  Ages 16-30
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-white/5 border border-white/10 mb-6">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white/10">
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="demographics" className="data-[state=active]:bg-white/10">
              <PieChart className="w-4 h-4 mr-2" />
              Demographics
            </TabsTrigger>
            <TabsTrigger value="districts" className="data-[state=active]:bg-white/10">
              <Globe className="w-4 h-4 mr-2" />
              By District
            </TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-white/10">
              <Activity className="w-4 h-4 mr-2" />
              Activity Feed
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Participation Trend Chart */}
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Participation Trend</CardTitle>
                  <CardDescription className="text-white/60">Daily active voters over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-end gap-2">
                    {[65, 72, 58, 80, 75, 90, 85, 78, 92, 88, 95, 89].map((value, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center gap-2">
                        <div 
                          className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t"
                          style={{ height: `${value}%` }}
                        />
                        <span className="text-xs text-white/40">{index + 1}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Proposal Success Rate */}
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Proposal Outcomes</CardTitle>
                  <CardDescription className="text-white/60">Last 30 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-white">Passed</span>
                        <span className="text-green-400">68%</span>
                      </div>
                      <Progress value={68} className="h-3 bg-white/10" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-white">Rejected</span>
                        <span className="text-red-400">22%</span>
                      </div>
                      <Progress value={22} className="h-3 bg-white/10" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-white">Pending</span>
                        <span className="text-yellow-400">10%</span>
                      </div>
                      <Progress value={10} className="h-3 bg-white/10" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-white">156</p>
                      <p className="text-sm text-white/50">Total Proposals</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-400">106</p>
                      <p className="text-sm text-white/50">Passed</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-red-400">34</p>
                      <p className="text-sm text-white/50">Rejected</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Engagement by Mechanism */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Engagement by Consensus Mechanism</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {[
                    { name: "Quadratic", votes: 12450, color: "blue" },
                    { name: "Conviction", votes: 8900, color: "purple" },
                    { name: "Holographic", votes: 5600, color: "cyan" },
                    { name: "Optimistic", votes: 7800, color: "green" },
                    { name: "Multi-Sig", votes: 2300, color: "orange" },
                    { name: "Liquid", votes: 4500, color: "pink" }
                  ].map((mech, index) => (
                    <Card key={index} className="bg-white/5 border-white/10">
                      <CardContent className="p-4 text-center">
                        <p className="text-xl font-bold text-white">{mech.votes.toLocaleString()}</p>
                        <p className="text-sm text-white/50">{mech.name}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Demographics Tab */}
          <TabsContent value="demographics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Age Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {demographicData.map((item, index) => (
                      <div key={index}>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-white">{item.age} years</span>
                          <span className="text-white/60">{item.count.toLocaleString()} ({item.percentage}%)</span>
                        </div>
                        <Progress value={item.percentage} className="h-3 bg-white/10" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Target className="w-5 h-5 text-cyan-400" />
                    Youth Assembly Representation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-6xl font-bold text-cyan-400">72%</p>
                    <p className="text-white/60 mt-2">Members under 40</p>
                    <p className="text-green-400 text-sm mt-4">
                      Above 70% threshold requirement
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/10">
                    <div className="text-center">
                      <p className="text-xl font-bold text-white">156</p>
                      <p className="text-sm text-white/50">Total Members</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-cyan-400">112</p>
                      <p className="text-sm text-white/50">Under 40</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Districts Tab */}
          <TabsContent value="districts">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Participation by District</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-3 px-4 text-white/60 font-medium">District</th>
                        <th className="text-right py-3 px-4 text-white/60 font-medium">Registered Voters</th>
                        <th className="text-right py-3 px-4 text-white/60 font-medium">Avg Turnout</th>
                        <th className="text-right py-3 px-4 text-white/60 font-medium">Proposals</th>
                        <th className="text-right py-3 px-4 text-white/60 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {districtData.map((district, index) => (
                        <tr key={index} className="border-b border-white/5 hover:bg-white/5">
                          <td className="py-4 px-4">
                            <span className="text-white font-medium">{district.name}</span>
                          </td>
                          <td className="py-4 px-4 text-right text-white">
                            {district.voters.toLocaleString()}
                          </td>
                          <td className="py-4 px-4 text-right">
                            <span className={district.turnout >= 70 ? "text-green-400" : district.turnout >= 60 ? "text-yellow-400" : "text-red-400"}>
                              {district.turnout}%
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right text-white">
                            {district.proposals}
                          </td>
                          <td className="py-4 px-4 text-right">
                            <Badge className={
                              district.turnout >= 70 
                                ? "bg-green-500/20 text-green-400 border-green-500/30" 
                                : district.turnout >= 60 
                                  ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                                  : "bg-red-500/20 text-red-400 border-red-500/30"
                            }>
                              {district.turnout >= 70 ? "High" : district.turnout >= 60 ? "Medium" : "Low"}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Feed Tab */}
          <TabsContent value="activity">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        activity.type === "vote" ? "bg-blue-500/20" :
                        activity.type === "proposal" ? "bg-green-500/20" :
                        "bg-purple-500/20"
                      }`}>
                        {activity.type === "vote" ? <Vote className="w-5 h-5 text-blue-400" /> :
                         activity.type === "proposal" ? <TrendingUp className="w-5 h-5 text-green-400" /> :
                         <Users className="w-5 h-5 text-purple-400" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">{activity.description}</p>
                        <p className="text-sm text-white/50">
                          {activity.participants.toLocaleString()} {activity.type === "proposal" ? "author" : "participants"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-white/50">
                        <Clock className="w-4 h-4" />
                        {activity.time}
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
