"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  ArrowLeft, TrendingUp, Users, CheckCircle2, BarChart3,
  ThumbsUp, ThumbsDown, MessageSquare, Calendar, MapPin,
  Target, Zap, Award, FileText, ExternalLink, ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const impactReports = [
  {
    id: 1,
    proposal: "Youth Transit Pass Initiative",
    passedDate: "2024-01-15",
    implementedDate: "2024-03-01",
    status: "implemented",
    category: "Transportation",
    metrics: {
      beneficiaries: 12500,
      budgetUsed: 450000,
      budgetAllocated: 500000,
      satisfactionScore: 4.6,
      goalProgress: 85
    },
    outcomes: [
      { metric: "Youth transit ridership", before: "23%", after: "41%", change: "+78%" },
      { metric: "Student commute costs", before: "$120/mo", after: "$45/mo", change: "-62%" },
      { metric: "Car trips reduced", before: "N/A", after: "8,400/mo", change: "New" }
    ],
    feedback: { positive: 847, negative: 123, comments: 234 },
    nextSteps: ["Expand to neighboring municipalities", "Add weekend coverage"]
  },
  {
    id: 2,
    proposal: "School Board Transparency Act",
    passedDate: "2024-02-20",
    implementedDate: "2024-04-15",
    status: "implemented",
    category: "Education",
    metrics: {
      beneficiaries: 45000,
      budgetUsed: 75000,
      budgetAllocated: 100000,
      satisfactionScore: 4.2,
      goalProgress: 70
    },
    outcomes: [
      { metric: "Meeting attendance", before: "45", after: "320", change: "+611%" },
      { metric: "Public comments", before: "12/mo", after: "89/mo", change: "+642%" },
      { metric: "Document requests", before: "8/mo", after: "156/mo", change: "+1850%" }
    ],
    feedback: { positive: 562, negative: 89, comments: 178 },
    nextSteps: ["Add real-time streaming", "Create mobile app"]
  },
  {
    id: 3,
    proposal: "Green Spaces for Youth",
    passedDate: "2024-03-10",
    implementedDate: null,
    status: "in_progress",
    category: "Environment",
    metrics: {
      beneficiaries: 0,
      budgetUsed: 120000,
      budgetAllocated: 800000,
      satisfactionScore: 0,
      goalProgress: 25
    },
    outcomes: [],
    feedback: { positive: 234, negative: 45, comments: 67 },
    milestones: [
      { name: "Site selection", completed: true },
      { name: "Community input", completed: true },
      { name: "Design phase", completed: false },
      { name: "Construction", completed: false },
      { name: "Grand opening", completed: false }
    ]
  }
]

const communityFeedback = [
  { id: 1, proposal: "Youth Transit Pass", user: "Maya T.", rating: 5, comment: "This has been life-changing for getting to my after-school job!", date: "2024-03-15" },
  { id: 2, proposal: "School Board Transparency", user: "Parent Council", rating: 4, comment: "Finally we can see what's happening with our kids' education budget.", date: "2024-04-20" },
  { id: 3, proposal: "Youth Transit Pass", user: "Student Union", rating: 5, comment: "Our members save an average of $75/month. Huge win!", date: "2024-03-22" }
]

export default function ImpactReportsPage() {
  const [selectedReport, setSelectedReport] = useState<typeof impactReports[0] | null>(null)

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/governance">
            <Button variant="ghost" size="icon" className="text-white/70 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Impact Reports</h1>
            <p className="text-white/60">Measuring real-world outcomes of passed proposals</p>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-green-500/20 to-green-600/10 border-green-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">23</p>
                  <p className="text-xs text-white/60">Proposals Implemented</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border-blue-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">127K</p>
                  <p className="text-xs text-white/60">People Impacted</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 border-purple-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">4.3</p>
                  <p className="text-xs text-white/60">Avg Satisfaction</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-amber-500/20 to-amber-600/10 border-amber-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <Target className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">78%</p>
                  <p className="text-xs text-white/60">Goals Achieved</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="reports" className="space-y-6">
          <TabsList className="bg-white/5 border border-white/10">
            <TabsTrigger value="reports">Impact Reports</TabsTrigger>
            <TabsTrigger value="feedback">Community Feedback</TabsTrigger>
            <TabsTrigger value="trends">Trends & Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="reports" className="space-y-4">
            {selectedReport ? (
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <Button variant="ghost" size="sm" onClick={() => setSelectedReport(null)} className="text-white/60 hover:text-white mb-2 -ml-2">
                        <ArrowLeft className="w-4 h-4 mr-1" /> Back to all reports
                      </Button>
                      <CardTitle className="text-white text-2xl">{selectedReport.proposal}</CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">{selectedReport.category}</Badge>
                        <Badge className={selectedReport.status === "implemented" ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-amber-500/20 text-amber-400 border-amber-500/30"}>
                          {selectedReport.status === "implemented" ? "Implemented" : "In Progress"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="bg-white/5 rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-white">{selectedReport.metrics.beneficiaries.toLocaleString()}</p>
                      <p className="text-xs text-white/60">Beneficiaries</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-white">${(selectedReport.metrics.budgetUsed / 1000).toFixed(0)}K</p>
                      <p className="text-xs text-white/60">Budget Used</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-white">{((selectedReport.metrics.budgetUsed / selectedReport.metrics.budgetAllocated) * 100).toFixed(0)}%</p>
                      <p className="text-xs text-white/60">Budget Efficiency</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-white">{selectedReport.metrics.satisfactionScore || "N/A"}</p>
                      <p className="text-xs text-white/60">Satisfaction</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-white">{selectedReport.metrics.goalProgress}%</p>
                      <p className="text-xs text-white/60">Goal Progress</p>
                    </div>
                  </div>

                  {/* Outcomes */}
                  {selectedReport.outcomes.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Measured Outcomes</h3>
                      <div className="space-y-3">
                        {selectedReport.outcomes.map((outcome, i) => (
                          <div key={i} className="bg-white/5 rounded-lg p-4 flex items-center justify-between">
                            <span className="text-white/80">{outcome.metric}</span>
                            <div className="flex items-center gap-4">
                              <span className="text-white/50">{outcome.before}</span>
                              <ChevronRight className="w-4 h-4 text-white/30" />
                              <span className="text-white font-medium">{outcome.after}</span>
                              <Badge className={outcome.change.startsWith("+") || outcome.change === "New" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}>
                                {outcome.change}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Milestones for in-progress */}
                  {selectedReport.milestones && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Implementation Milestones</h3>
                      <div className="space-y-2">
                        {selectedReport.milestones.map((milestone, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${milestone.completed ? "bg-green-500" : "bg-white/10"}`}>
                              {milestone.completed && <CheckCircle2 className="w-4 h-4 text-white" />}
                            </div>
                            <span className={milestone.completed ? "text-white" : "text-white/50"}>{milestone.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Community Feedback Summary */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Community Feedback</h3>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <ThumbsUp className="w-5 h-5 text-green-400" />
                        <span className="text-white">{selectedReport.feedback.positive}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ThumbsDown className="w-5 h-5 text-red-400" />
                        <span className="text-white">{selectedReport.feedback.negative}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-blue-400" />
                        <span className="text-white">{selectedReport.feedback.comments} comments</span>
                      </div>
                    </div>
                  </div>

                  {/* Next Steps */}
                  {selectedReport.nextSteps && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Recommended Next Steps</h3>
                      <ul className="space-y-2">
                        {selectedReport.nextSteps.map((step, i) => (
                          <li key={i} className="flex items-center gap-2 text-white/80">
                            <Zap className="w-4 h-4 text-amber-400" />
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {impactReports.map((report) => (
                  <Card 
                    key={report.id} 
                    className="bg-white/5 border-white/10 hover:bg-white/10 cursor-pointer transition-colors"
                    onClick={() => setSelectedReport(report)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">{report.category}</Badge>
                            <Badge className={report.status === "implemented" ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-amber-500/20 text-amber-400 border-amber-500/30"}>
                              {report.status === "implemented" ? "Implemented" : "In Progress"}
                            </Badge>
                          </div>
                          <h3 className="text-xl font-semibold text-white mb-2">{report.proposal}</h3>
                          <div className="flex items-center gap-4 text-sm text-white/60">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              Passed {new Date(report.passedDate).toLocaleDateString()}
                            </span>
                            {report.metrics.beneficiaries > 0 && (
                              <span className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                {report.metrics.beneficiaries.toLocaleString()} impacted
                              </span>
                            )}
                          </div>
                          <div className="mt-3">
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="text-white/60">Goal Progress</span>
                              <span className="text-white">{report.metrics.goalProgress}%</span>
                            </div>
                            <Progress value={report.metrics.goalProgress} className="h-2" />
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-white/40" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="feedback" className="space-y-4">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Community Feedback</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {communityFeedback.map((fb) => (
                  <div key={fb.id} className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-white font-medium">{fb.user}</p>
                        <p className="text-sm text-white/60">on {fb.proposal}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className={`w-4 h-4 rounded-full ${i < fb.rating ? "bg-amber-400" : "bg-white/20"}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-white/80">{fb.comment}</p>
                    <p className="text-xs text-white/40 mt-2">{new Date(fb.date).toLocaleDateString()}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Trends & Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white/5 rounded-lg p-4">
                    <h3 className="text-white font-medium mb-3">Most Impactful Categories</h3>
                    <div className="space-y-3">
                      {[
                        { category: "Transportation", impact: 85, color: "bg-blue-500" },
                        { category: "Education", impact: 72, color: "bg-green-500" },
                        { category: "Environment", impact: 65, color: "bg-emerald-500" },
                        { category: "Housing", impact: 58, color: "bg-purple-500" }
                      ].map((cat) => (
                        <div key={cat.category}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-white/80">{cat.category}</span>
                            <span className="text-white">{cat.impact}%</span>
                          </div>
                          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div className={`h-full ${cat.color} rounded-full`} style={{ width: `${cat.impact}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <h3 className="text-white font-medium mb-3">Key Insights</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <Award className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                        <span className="text-white/80">Youth-led proposals have 23% higher implementation success rate</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <TrendingUp className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-white/80">Community satisfaction increased 15% over last quarter</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Target className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                        <span className="text-white/80">78% of proposals meet or exceed their stated goals</span>
                      </li>
                    </ul>
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
