"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  ArrowLeft, 
  Scale,
  FileText,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Shield,
  Gavel,
  ArrowRight,
  Upload,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Filter,
  Search,
  Plus,
  ChevronRight,
  AlertCircle,
  HelpCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const disputes = [
  {
    id: "DIS-001",
    title: "Content Moderation Appeal - Youth Media DAO",
    type: "content",
    status: "mediation",
    priority: "medium",
    submittedBy: "Alex Rivera",
    submittedAt: "2 days ago",
    respondent: "Media DAO Moderators",
    stage: 2,
    totalStages: 4,
    description: "Appeal against content removal decision citing political speech suppression"
  },
  {
    id: "DIS-002",
    title: "Proposal Voting Irregularity",
    type: "governance",
    status: "investigation",
    priority: "high",
    submittedBy: "Jordan Lee",
    submittedAt: "5 days ago",
    respondent: "Governance Committee",
    stage: 1,
    totalStages: 4,
    description: "Alleged manipulation of quadratic voting weights during budget proposal"
  },
  {
    id: "DIS-003",
    title: "SBT Credential Dispute",
    type: "identity",
    status: "resolved",
    priority: "low",
    submittedBy: "Taylor Kim",
    submittedAt: "2 weeks ago",
    respondent: "Identity Verification Team",
    stage: 4,
    totalStages: 4,
    resolution: "Credential reinstated after documentation review",
    description: "Age verification rejection for Youth Assembly membership"
  },
  {
    id: "DIS-004",
    title: "Treasury Allocation Challenge",
    type: "financial",
    status: "arbitration",
    priority: "high",
    submittedBy: "Community Coalition",
    submittedAt: "1 week ago",
    respondent: "Treasury Committee",
    stage: 3,
    totalStages: 4,
    description: "Challenge to grant distribution priorities and selection criteria"
  }
]

const arbitrators = [
  { name: "Dr. Sarah Chen", specialty: "Governance & Policy", casesResolved: 45, rating: 4.9, available: true },
  { name: "Marcus Williams", specialty: "Financial Disputes", casesResolved: 32, rating: 4.8, available: true },
  { name: "Elena Rodriguez", specialty: "Identity & Verification", casesResolved: 28, rating: 4.7, available: false },
  { name: "James Park", specialty: "Content & Media", casesResolved: 38, rating: 4.9, available: true }
]

const resolutionStages = [
  { name: "Submission", description: "Initial complaint filed and documented" },
  { name: "Investigation", description: "Evidence gathering and preliminary review" },
  { name: "Mediation", description: "Facilitated discussion between parties" },
  { name: "Arbitration", description: "Binding decision by neutral arbitrator" }
]

export default function DisputeResolutionPage() {
  const [activeTab, setActiveTab] = useState("active")
  const [showNewDispute, setShowNewDispute] = useState(false)
  const [selectedDispute, setSelectedDispute] = useState<string | null>(null)
  const [disputeType, setDisputeType] = useState("")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "investigation": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "mediation": return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "arbitration": return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      case "resolved": return "bg-green-500/20 text-green-400 border-green-500/30"
      case "rejected": return "bg-red-500/20 text-red-400 border-red-500/30"
      default: return "bg-white/10 text-white/60 border-white/20"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-500/20 text-red-400 border-red-500/30"
      case "medium": return "bg-orange-500/20 text-orange-400 border-orange-500/30"
      case "low": return "bg-green-500/20 text-green-400 border-green-500/30"
      default: return "bg-white/10 text-white/60 border-white/20"
    }
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
                  <Scale className="w-5 h-5 text-amber-400" />
                  Dispute Resolution Center
                </h1>
                <p className="text-sm text-white/50">Fair, transparent conflict resolution</p>
              </div>
            </div>
            <Button 
              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500"
              onClick={() => setShowNewDispute(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              File New Dispute
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">12</p>
                  <p className="text-sm text-white/50">Active Cases</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">156</p>
                  <p className="text-sm text-white/50">Resolved</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">8</p>
                  <p className="text-sm text-white/50">Active Arbitrators</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Scale className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">94%</p>
                  <p className="text-sm text-white/50">Resolution Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resolution Process */}
        <Card className="bg-white/5 border-white/10 mb-8">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-lg">Resolution Process</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              {resolutionStages.map((stage, index) => (
                <div key={index} className="flex items-center">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-2">
                      <span className="text-white font-bold">{index + 1}</span>
                    </div>
                    <p className="text-white text-sm font-medium">{stage.name}</p>
                    <p className="text-white/50 text-xs max-w-[120px]">{stage.description}</p>
                  </div>
                  {index < resolutionStages.length - 1 && (
                    <ArrowRight className="w-6 h-6 text-white/30 mx-4" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between mb-6">
            <TabsList className="bg-white/5 border border-white/10">
              <TabsTrigger value="active" className="data-[state=active]:bg-white/10">
                <Clock className="w-4 h-4 mr-2" />
                Active Disputes
              </TabsTrigger>
              <TabsTrigger value="my-cases" className="data-[state=active]:bg-white/10">
                <FileText className="w-4 h-4 mr-2" />
                My Cases
              </TabsTrigger>
              <TabsTrigger value="arbitrators" className="data-[state=active]:bg-white/10">
                <Gavel className="w-4 h-4 mr-2" />
                Arbitrators
              </TabsTrigger>
              <TabsTrigger value="resolved" className="data-[state=active]:bg-white/10">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Resolved
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <Input
                  placeholder="Search disputes..."
                  className="pl-9 bg-white/5 border-white/10 text-white w-64"
                />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-32 bg-white/5 border-white/10 text-white">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="governance">Governance</SelectItem>
                  <SelectItem value="content">Content</SelectItem>
                  <SelectItem value="financial">Financial</SelectItem>
                  <SelectItem value="identity">Identity</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Disputes Tab */}
          <TabsContent value="active" className="space-y-4">
            {disputes.filter(d => d.status !== "resolved").map((dispute) => (
              <Card key={dispute.id} className="bg-white/5 border-white/10 hover:border-white/20 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                      <Scale className="w-6 h-6 text-amber-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-white/50 text-sm">{dispute.id}</span>
                            <Badge className={getStatusColor(dispute.status)}>
                              {dispute.status}
                            </Badge>
                            <Badge className={getPriorityColor(dispute.priority)}>
                              {dispute.priority} priority
                            </Badge>
                          </div>
                          <h3 className="text-white font-medium">{dispute.title}</h3>
                          <p className="text-white/60 text-sm mt-1">{dispute.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 mt-3 text-sm text-white/50">
                        <span>Filed by: <span className="text-white">{dispute.submittedBy}</span></span>
                        <span>Against: <span className="text-white">{dispute.respondent}</span></span>
                        <span>{dispute.submittedAt}</span>
                      </div>
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-white/50">Progress</span>
                          <span className="text-white">Stage {dispute.stage} of {dispute.totalStages}</span>
                        </div>
                        <Progress value={(dispute.stage / dispute.totalStages) * 100} className="h-2 bg-white/10" />
                      </div>
                    </div>
                    <Button variant="outline" className="border-white/20 text-white bg-transparent">
                      View Details
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* My Cases Tab */}
          <TabsContent value="my-cases">
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-8 text-center">
                <FileText className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <h3 className="text-white text-lg font-medium">No Active Cases</h3>
                <p className="text-white/50 mt-2">You haven't filed any disputes yet</p>
                <Button 
                  className="mt-4 bg-amber-600 hover:bg-amber-500"
                  onClick={() => setShowNewDispute(true)}
                >
                  File New Dispute
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Arbitrators Tab */}
          <TabsContent value="arbitrators">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {arbitrators.map((arb, index) => (
                <Card key={index} className="bg-white/5 border-white/10">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-14 h-14">
                        <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-500 text-white">
                          {arb.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-white font-medium">{arb.name}</h3>
                          <Badge className={arb.available ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-red-500/20 text-red-400 border-red-500/30"}>
                            {arb.available ? "Available" : "Busy"}
                          </Badge>
                        </div>
                        <p className="text-white/60 text-sm">{arb.specialty}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <span className="text-white/50">Cases: <span className="text-white">{arb.casesResolved}</span></span>
                          <span className="text-white/50">Rating: <span className="text-yellow-400">{arb.rating}/5.0</span></span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Resolved Tab */}
          <TabsContent value="resolved">
            {disputes.filter(d => d.status === "resolved").map((dispute) => (
              <Card key={dispute.id} className="bg-white/5 border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-6 h-6 text-green-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white/50 text-sm">{dispute.id}</span>
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Resolved</Badge>
                      </div>
                      <h3 className="text-white font-medium">{dispute.title}</h3>
                      <p className="text-green-400 text-sm mt-2">Resolution: {dispute.resolution}</p>
                      <p className="text-white/50 text-sm mt-1">Resolved {dispute.submittedAt}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>

      {/* New Dispute Modal */}
      {showNewDispute && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="bg-[#0d1117] border-white/10 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                File New Dispute
                <Button variant="ghost" size="sm" onClick={() => setShowNewDispute(false)} className="text-white/50">
                  ×
                </Button>
              </CardTitle>
              <CardDescription className="text-white/60">
                Please provide details about your dispute. All submissions are reviewed within 48 hours.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-white">Dispute Type</Label>
                <RadioGroup value={disputeType} onValueChange={setDisputeType} className="grid grid-cols-2 gap-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="governance" id="governance" />
                    <Label htmlFor="governance" className="text-white/70">Governance Issue</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="content" id="content" />
                    <Label htmlFor="content" className="text-white/70">Content Moderation</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="financial" id="financial" />
                    <Label htmlFor="financial" className="text-white/70">Financial/Treasury</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="identity" id="identity" />
                    <Label htmlFor="identity" className="text-white/70">Identity/Verification</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label className="text-white">Title</Label>
                <Input className="bg-white/5 border-white/10 text-white mt-2" placeholder="Brief title for your dispute" />
              </div>
              <div>
                <Label className="text-white">Respondent</Label>
                <Input className="bg-white/5 border-white/10 text-white mt-2" placeholder="Who or what entity is this dispute against?" />
              </div>
              <div>
                <Label className="text-white">Description</Label>
                <Textarea className="bg-white/5 border-white/10 text-white mt-2" placeholder="Provide detailed description of the issue..." rows={4} />
              </div>
              <div>
                <Label className="text-white">Desired Outcome</Label>
                <Textarea className="bg-white/5 border-white/10 text-white mt-2" placeholder="What resolution are you seeking?" rows={2} />
              </div>
              <div>
                <Label className="text-white">Supporting Evidence</Label>
                <div className="mt-2 border-2 border-dashed border-white/20 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-white/40 mx-auto mb-2" />
                  <p className="text-white/60">Drag & drop files or click to upload</p>
                  <p className="text-white/40 text-sm mt-1">Screenshots, documents, transaction hashes, etc.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500">
                  Submit Dispute
                </Button>
                <Button variant="outline" className="border-white/20 text-white bg-transparent" onClick={() => setShowNewDispute(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
