"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Vote,
  FileText,
  Calendar,
  Target,
  BarChart3,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  ExternalLink,
  Filter,
  Share2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

const candidateData = {
  name: "Sarah Chen",
  role: "City Councillor - District 5",
  term: "2024-2028",
  avatar: "SC",
  overallScore: 78,
  promisesKept: 12,
  promisesPartial: 5,
  promisesBroken: 2,
  promisesPending: 8,
}

const promises = [
  {
    id: 1,
    title: "Launch Millennial Voter Engagement Campaign",
    category: "Youth Empowerment",
    status: "kept",
    madeOn: "Jan 15, 2024",
    deadline: "Dec 31, 2024",
    completedOn: "Oct 15, 2024",
    evidence: ["Council Resolution #2024-089", "Implementation Report"],
    description: "Promised to champion legislation allowing 16-17 year olds to vote in local elections.",
  },
  {
    id: 2,
    title: "Increase Youth Budget Allocation by 15%",
    category: "Budget",
    status: "partial",
    madeOn: "Feb 1, 2024",
    deadline: "Budget 2025",
    progress: 60,
    description: "Committed to increasing funding for youth programs and services.",
    notes: "Achieved 9% increase, working on additional funding sources.",
  },
  {
    id: 3,
    title: "Create 500 Youth Apprenticeship Positions",
    category: "Employment",
    status: "in-progress",
    madeOn: "Mar 10, 2024",
    deadline: "Dec 31, 2025",
    progress: 45,
    current: 225,
    target: 500,
    description: "Partner with local businesses to create paid apprenticeship opportunities.",
  },
  {
    id: 4,
    title: "Monthly Town Hall Meetings",
    category: "Transparency",
    status: "kept",
    madeOn: "Jan 1, 2024",
    completedOn: "Ongoing",
    description: "Hold monthly public town hall meetings in different neighborhoods.",
    evidence: ["12 town halls held", "Average attendance: 156"],
  },
  {
    id: 5,
    title: "Reduce Transit Fares for Students",
    category: "Transit",
    status: "broken",
    madeOn: "Feb 15, 2024",
    deadline: "Sep 1, 2024",
    description: "Implement 50% discount on transit fares for all students.",
    reason: "Budget constraints prevented implementation. Alternative: free transit for under-18s being explored.",
  },
  {
    id: 6,
    title: "Publish All Campaign Donations Transparently",
    category: "Transparency",
    status: "kept",
    madeOn: "Dec 1, 2023",
    completedOn: "Jan 1, 2024",
    description: "Full transparency on all campaign contributions and spending.",
    evidence: ["Public ledger on campaign website", "Quarterly reports filed"],
  },
]

const votingRecord = [
  { proposal: "Youth Budget Increase 2025", vote: "for", result: "passed", date: "Nov 15, 2024", alignment: "aligned" },
  { proposal: "Transit Expansion Plan", vote: "for", result: "passed", date: "Oct 28, 2024", alignment: "aligned" },
  { proposal: "Zoning Amendment - Downtown", vote: "against", result: "passed", date: "Oct 15, 2024", alignment: "opposed" },
  { proposal: "Emergency Housing Fund", vote: "for", result: "passed", date: "Sep 30, 2024", alignment: "aligned" },
  { proposal: "Police Budget Reallocation", vote: "abstain", result: "rejected", date: "Sep 15, 2024", alignment: "neutral" },
]

const attendanceRecord = {
  councilMeetings: { attended: 45, total: 48, percentage: 94 },
  committeeMeetings: { attended: 32, total: 36, percentage: 89 },
  publicHearings: { attended: 18, total: 20, percentage: 90 },
}

export default function AccountabilityPageClient() {
  const [activeTab, setActiveTab] = useState("promises")
  const [statusFilter, setStatusFilter] = useState("all")

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "kept": return <CheckCircle2 className="w-5 h-5 text-green-400" />
      case "partial": return <AlertTriangle className="w-5 h-5 text-yellow-400" />
      case "broken": return <XCircle className="w-5 h-5 text-red-400" />
      case "in-progress": return <Clock className="w-5 h-5 text-blue-400" />
      default: return <Clock className="w-5 h-5 text-white/40" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "kept": return "bg-green-500/20 text-green-400 border-green-500/30"
      case "partial": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "broken": return "bg-red-500/20 text-red-400 border-red-500/30"
      case "in-progress": return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      default: return "bg-white/10 text-white/60 border-white/20"
    }
  }

  const filteredPromises = statusFilter === "all"
    ? promises
    : promises.filter((promise) => promise.status === statusFilter)

  return (
    <div className="min-h-screen bg-[#030712]">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#030712]/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/candidates">
                <Button variant="ghost" size="sm" className="text-white/70 hover:text-white">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              </Link>
              <div className="h-6 w-px bg-white/20" />
              <div>
                <h1 className="flex items-center gap-2 text-xl font-bold text-white">
                  <Target className="h-5 w-5 text-orange-400" />
                  Accountability Tracker
                </h1>
                <p className="text-sm text-white/50">Track promises, voting record & attendance</p>
              </div>
            </div>
            <Button variant="outline" className="border-white/20 bg-transparent text-white">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Card className="mb-8 border-white/10 bg-white/5">
          <CardContent className="p-6">
            <div className="flex items-start gap-6">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-gradient-to-br from-orange-500 to-red-500 text-2xl text-white">
                  {candidateData.avatar}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white">{candidateData.name}</h2>
                <p className="text-white/60">{candidateData.role}</p>
                <p className="mt-1 text-sm text-white/40">Term: {candidateData.term}</p>
              </div>
              <div className="text-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-green-500">
                  <div>
                    <p className="text-3xl font-bold text-white">{candidateData.overallScore}%</p>
                    <p className="text-xs text-white/50">Score</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-4 gap-4 border-t border-white/10 pt-6">
              <div className="text-center">
                <div className="mb-1 flex items-center justify-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-400" />
                  <span className="text-2xl font-bold text-white">{candidateData.promisesKept}</span>
                </div>
                <p className="text-sm text-white/50">Promises Kept</p>
              </div>
              <div className="text-center">
                <div className="mb-1 flex items-center justify-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-400" />
                  <span className="text-2xl font-bold text-white">{candidateData.promisesPartial}</span>
                </div>
                <p className="text-sm text-white/50">Partially Kept</p>
              </div>
              <div className="text-center">
                <div className="mb-1 flex items-center justify-center gap-2">
                  <XCircle className="h-5 w-5 text-red-400" />
                  <span className="text-2xl font-bold text-white">{candidateData.promisesBroken}</span>
                </div>
                <p className="text-sm text-white/50">Broken</p>
              </div>
              <div className="text-center">
                <div className="mb-1 flex items-center justify-center gap-2">
                  <Clock className="h-5 w-5 text-blue-400" />
                  <span className="text-2xl font-bold text-white">{candidateData.promisesPending}</span>
                </div>
                <p className="text-sm text-white/50">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 border border-white/10 bg-white/5">
            <TabsTrigger value="promises" className="data-[state=active]:bg-white/10">
              <FileText className="mr-2 h-4 w-4" />
              Promises
            </TabsTrigger>
            <TabsTrigger value="voting" className="data-[state=active]:bg-white/10">
              <Vote className="mr-2 h-4 w-4" />
              Voting Record
            </TabsTrigger>
            <TabsTrigger value="attendance" className="data-[state=active]:bg-white/10">
              <Calendar className="mr-2 h-4 w-4" />
              Attendance
            </TabsTrigger>
            <TabsTrigger value="feedback" className="data-[state=active]:bg-white/10">
              <MessageSquare className="mr-2 h-4 w-4" />
              Public Feedback
            </TabsTrigger>
          </TabsList>

          <TabsContent value="promises" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">Campaign Promises</h3>
              <div className="flex gap-2">
                {["all", "kept", "partial", "broken", "in-progress"].map((status) => (
                  <Button
                    key={status}
                    variant={statusFilter === status ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter(status)}
                    className={statusFilter !== status ? "border-white/20 bg-transparent text-white" : ""}
                  >
                    {status === "all" ? "All" : status.replace("-", " ")}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid gap-4">
              {filteredPromises.map((promise) => (
                <Card key={promise.id} className="border-white/10 bg-white/5">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <CardTitle className="text-white">{promise.title}</CardTitle>
                        <CardDescription className="mt-2 text-white/60">{promise.category}</CardDescription>
                      </div>
                      <Badge className={getStatusBadge(promise.status)}>{promise.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 text-white/75">
                    <p>{promise.description}</p>

                    {"progress" in promise && promise.progress ? (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{promise.progress}%</span>
                        </div>
                        <Progress value={promise.progress} className="h-2" />
                      </div>
                    ) : null}

                    <div className="grid gap-2 text-sm md:grid-cols-3">
                      <div>
                        <span className="text-white/45">Made:</span> {promise.madeOn}
                      </div>
                      {"deadline" in promise && promise.deadline ? (
                        <div>
                          <span className="text-white/45">Deadline:</span> {promise.deadline}
                        </div>
                      ) : null}
                      {"completedOn" in promise && promise.completedOn ? (
                        <div>
                          <span className="text-white/45">Completed:</span> {promise.completedOn}
                        </div>
                      ) : null}
                    </div>

                    {"notes" in promise && promise.notes ? <p className="text-sm text-yellow-300">{promise.notes}</p> : null}
                    {"reason" in promise && promise.reason ? <p className="text-sm text-red-300">{promise.reason}</p> : null}
                    {"evidence" in promise && promise.evidence ? (
                      <div className="flex flex-wrap gap-2">
                        {promise.evidence.map((item) => (
                          <Badge key={item} variant="outline" className="border-white/20 text-white/70">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    ) : null}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="voting">
            <Card className="border-white/10 bg-white/5">
              <CardHeader>
                <CardTitle className="text-white">Voting Record</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {votingRecord.map((record) => (
                  <div key={`${record.proposal}-${record.date}`} className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 p-4 text-white/80">
                    <div>
                      <p className="font-medium text-white">{record.proposal}</p>
                      <p className="text-sm text-white/45">{record.date}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="border-white/20 text-white/70">{record.vote}</Badge>
                      <Badge variant="outline" className="border-white/20 text-white/70">{record.result}</Badge>
                      <Badge className={record.alignment === "aligned" ? "bg-green-500/20 text-green-300" : record.alignment === "opposed" ? "bg-red-500/20 text-red-300" : "bg-white/10 text-white/60"}>
                        {record.alignment}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="attendance">
            <Card className="border-white/10 bg-white/5">
              <CardHeader>
                <CardTitle className="text-white">Attendance</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-3">
                {Object.entries(attendanceRecord).map(([label, value]) => (
                  <div key={label} className="rounded-xl border border-white/10 bg-black/20 p-4 text-white/80">
                    <p className="font-medium capitalize text-white">{label.replace(/([A-Z])/g, " $1")}</p>
                    <p className="mt-2 text-3xl font-bold text-white">{value.percentage}%</p>
                    <p className="text-sm text-white/45">{value.attended} of {value.total} attended</p>
                    <Progress value={value.percentage} className="mt-3 h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="feedback">
            <Card className="border-white/10 bg-white/5">
              <CardHeader>
                <CardTitle className="text-white">Public Feedback Snapshot</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-white">
                  <ThumbsUp className="mb-2 h-5 w-5 text-green-300" />
                  <p className="text-2xl font-bold">1,284</p>
                  <p className="text-sm text-green-100/70">Positive reactions</p>
                </div>
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-white">
                  <ThumbsDown className="mb-2 h-5 w-5 text-red-300" />
                  <p className="text-2xl font-bold">214</p>
                  <p className="text-sm text-red-100/70">Negative reactions</p>
                </div>
                <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-4 text-white">
                  <MessageSquare className="mb-2 h-5 w-5 text-blue-300" />
                  <p className="text-2xl font-bold">392</p>
                  <p className="text-sm text-blue-100/70">Verified public comments</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}