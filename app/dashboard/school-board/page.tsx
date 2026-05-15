"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { 
  School, Users, Vote, FileText, Calendar, Settings,
  Plus, Search, Check, X, Clock, ChevronRight, Eye,
  Building2, GraduationCap, UserCheck, AlertTriangle, TrendingUp
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface SchoolCouncilMember {
  id: string
  full_name: string
  email: string
  avatar_url?: string
  school_name: string
  council_role: string
  grade: number
  reputation_score: number
  status: "pending" | "approved" | "rejected"
  created_at: string
}

interface SchoolElection {
  id: string
  title: string
  school_name: string
  status: string
  positions: number
  candidates: number
  votes_cast: number
  voting_end: string
}

export default function SchoolBoardDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [councils, setCouncils] = useState<SchoolCouncilMember[]>([])
  const [elections, setElections] = useState<SchoolElection[]>([])
  const [showAddSchool, setShowAddSchool] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  
  // Mock data for demonstration
  useEffect(() => {
    // In production, fetch from Supabase
    setCouncils([
      { id: "1", full_name: "Emma Wilson", email: "emma.w@student.edu", school_name: "Central High School", council_role: "President", grade: 12, reputation_score: 450, status: "approved", created_at: "2026-01-15" },
      { id: "2", full_name: "James Chen", email: "james.c@student.edu", school_name: "Central High School", council_role: "Vice President", grade: 11, reputation_score: 380, status: "approved", created_at: "2026-01-15" },
      { id: "3", full_name: "Sofia Rodriguez", email: "sofia.r@student.edu", school_name: "Westside Academy", council_role: "Secretary", grade: 10, reputation_score: 290, status: "pending", created_at: "2026-01-28" },
      { id: "4", full_name: "Marcus Thompson", email: "marcus.t@student.edu", school_name: "Eastview High", council_role: "Treasurer", grade: 11, reputation_score: 320, status: "pending", created_at: "2026-01-29" },
    ])
    
    setElections([
      { id: "1", title: "Student Council 2026-2027", school_name: "Central High School", status: "voting_open", positions: 5, candidates: 12, votes_cast: 234, voting_end: "2026-02-15" },
      { id: "2", title: "Class Representatives", school_name: "Westside Academy", status: "nomination_open", positions: 8, candidates: 6, votes_cast: 0, voting_end: "2026-02-20" },
    ])
  }, [])
  
  const pendingApprovals = councils.filter(c => c.status === "pending")
  const approvedMembers = councils.filter(c => c.status === "approved")
  
  const stats = {
    totalSchools: 12,
    totalCouncilMembers: approvedMembers.length,
    pendingApprovals: pendingApprovals.length,
    activeElections: elections.filter(e => e.status === "voting_open").length,
    totalStudentsReached: 4500,
    youthEngagementRate: 67,
  }
  
  async function approveCouncilMember(id: string) {
    setCouncils(councils.map(c => c.id === id ? { ...c, status: "approved" as const } : c))
  }
  
  async function rejectCouncilMember(id: string) {
    setCouncils(councils.map(c => c.id === id ? { ...c, status: "rejected" as const } : c))
  }
  
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">School Board Dashboard</h1>
                <p className="text-white/60">Toronto District School Board</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="bg-transparent">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button className="bg-cyan-600 hover:bg-cyan-700" onClick={() => setShowAddSchool(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add School
            </Button>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <School className="w-5 h-5 text-cyan-400 mb-2" />
              <p className="text-2xl font-bold">{stats.totalSchools}</p>
              <p className="text-xs text-white/50">Schools</p>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <Users className="w-5 h-5 text-green-400 mb-2" />
              <p className="text-2xl font-bold">{stats.totalCouncilMembers}</p>
              <p className="text-xs text-white/50">Council Members</p>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <Clock className="w-5 h-5 text-yellow-400 mb-2" />
              <p className="text-2xl font-bold">{stats.pendingApprovals}</p>
              <p className="text-xs text-white/50">Pending Approvals</p>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <Vote className="w-5 h-5 text-purple-400 mb-2" />
              <p className="text-2xl font-bold">{stats.activeElections}</p>
              <p className="text-xs text-white/50">Active Elections</p>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <GraduationCap className="w-5 h-5 text-blue-400 mb-2" />
              <p className="text-2xl font-bold">{stats.totalStudentsReached.toLocaleString()}</p>
              <p className="text-xs text-white/50">Students Reached</p>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <TrendingUp className="w-5 h-5 text-emerald-400 mb-2" />
              <p className="text-2xl font-bold">{stats.youthEngagementRate}%</p>
              <p className="text-xs text-white/50">Engagement Rate</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-white/5 border border-white/10">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="approvals">
              Approvals
              {stats.pendingApprovals > 0 && (
                <Badge className="ml-2 bg-yellow-500/20 text-yellow-400">{stats.pendingApprovals}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="councils">Council Members</TabsTrigger>
            <TabsTrigger value="elections">Elections</TabsTrigger>
            <TabsTrigger value="schools">Schools</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Pending Approvals Preview */}
              <Card className="bg-white/5 border-white/10">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Pending Approvals</CardTitle>
                    <CardDescription>Student council registrations awaiting review</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab("approvals")}>
                    View All <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-3">
                  {pendingApprovals.length === 0 ? (
                    <p className="text-sm text-white/50 text-center py-4">No pending approvals</p>
                  ) : (
                    pendingApprovals.slice(0, 3).map(member => (
                      <div key={member.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={member.avatar_url || "/placeholder.svg"} />
                            <AvatarFallback className="bg-yellow-600 text-xs">
                              {member.full_name.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{member.full_name}</p>
                            <p className="text-xs text-white/50">{member.school_name} - {member.council_role}</p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-green-400" onClick={() => approveCouncilMember(member.id)}>
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-400" onClick={() => rejectCouncilMember(member.id)}>
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
              
              {/* Active Elections */}
              <Card className="bg-white/5 border-white/10">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Active Elections</CardTitle>
                    <CardDescription>Ongoing student council elections</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab("elections")}>
                    View All <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-3">
                  {elections.filter(e => ["voting_open", "nomination_open"].includes(e.status)).map(election => (
                    <div key={election.id} className="p-3 rounded-lg bg-white/5">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">{election.title}</h4>
                        <Badge className={election.status === "voting_open" ? "bg-green-500/20 text-green-400" : "bg-blue-500/20 text-blue-400"}>
                          {election.status === "voting_open" ? "Voting" : "Nominations"}
                        </Badge>
                      </div>
                      <p className="text-xs text-white/50 mb-2">{election.school_name}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span>{election.candidates} candidates</span>
                        <span>{election.votes_cast} votes cast</span>
                        <span>Ends {new Date(election.voting_end).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
            
            {/* Youth Assembly Integration */}
            <Card className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-cyan-500/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center">
                      <Users className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Youth Assembly Integration</h3>
                      <p className="text-sm text-white/60">
                        {approvedMembers.length} council members eligible for Youth Assembly participation
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-cyan-400">{Math.floor(approvedMembers.length * 0.7)}</p>
                    <p className="text-xs text-white/50">Active in DAO Governance</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Approvals Tab */}
          <TabsContent value="approvals" className="space-y-4">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle>Pending Council Member Approvals</CardTitle>
                <CardDescription>Review and approve student council registrations</CardDescription>
              </CardHeader>
              <CardContent>
                {pendingApprovals.length === 0 ? (
                  <div className="text-center py-8">
                    <Check className="w-12 h-12 mx-auto text-green-400/50 mb-4" />
                    <h3 className="font-medium mb-2">All Caught Up!</h3>
                    <p className="text-sm text-white/50">No pending approvals at this time</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingApprovals.map(member => (
                      <div key={member.id} className="p-4 rounded-lg bg-white/5 border border-yellow-500/20">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-4">
                            <Avatar className="w-12 h-12">
                              <AvatarImage src={member.avatar_url || "/placeholder.svg"} />
                              <AvatarFallback className="bg-yellow-600">
                                {member.full_name.split(" ").map(n => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-semibold">{member.full_name}</h4>
                              <p className="text-sm text-white/60">{member.email}</p>
                              <div className="flex items-center gap-4 mt-2 text-xs text-white/50">
                                <span>School: {member.school_name}</span>
                                <span>Role: {member.council_role}</span>
                                <span>Grade: {member.grade}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button className="bg-green-600 hover:bg-green-700" onClick={() => approveCouncilMember(member.id)}>
                              <Check className="w-4 h-4 mr-2" />
                              Approve
                            </Button>
                            <Button variant="outline" className="bg-transparent border-red-500/30 text-red-400 hover:bg-red-500/10" onClick={() => rejectCouncilMember(member.id)}>
                              <X className="w-4 h-4 mr-2" />
                              Reject
                            </Button>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-white/10">
                          <p className="text-xs text-white/40">
                            Applied: {new Date(member.created_at).toLocaleDateString()} | 
                            Reputation Score: {member.reputation_score} points
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Council Members Tab */}
          <TabsContent value="councils" className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <Input 
                  placeholder="Search members..." 
                  className="pl-10 bg-white/5 border-white/10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <Card className="bg-white/5 border-white/10">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10">
                    <TableHead>Member</TableHead>
                    <TableHead>School</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Reputation</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {approvedMembers
                    .filter(m => m.full_name.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map(member => (
                      <TableRow key={member.id} className="border-white/10">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={member.avatar_url || "/placeholder.svg"} />
                              <AvatarFallback className="bg-cyan-600 text-xs">
                                {member.full_name.split(" ").map(n => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{member.full_name}</p>
                              <p className="text-xs text-white/50">{member.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{member.school_name}</TableCell>
                        <TableCell>
                          <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 border">
                            {member.council_role}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{member.grade}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{member.reputation_score}</span>
                            <span className="text-xs text-white/40">pts</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 border">
                            Active
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
          
          {/* Elections Tab */}
          <TabsContent value="elections" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold">School Council Elections</h2>
                <p className="text-sm text-white/60">Manage elections across all schools</p>
              </div>
              <Button className="bg-cyan-600 hover:bg-cyan-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Election
              </Button>
            </div>
            
            <div className="grid gap-4">
              {elections.map(election => (
                <Card key={election.id} className="bg-white/5 border-white/10">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{election.title}</h3>
                          <Badge className={
                            election.status === "voting_open" 
                              ? "bg-green-500/20 text-green-400" 
                              : "bg-blue-500/20 text-blue-400"
                          }>
                            {election.status === "voting_open" ? "Voting Open" : "Nominations Open"}
                          </Badge>
                        </div>
                        <p className="text-sm text-white/60">{election.school_name}</p>
                      </div>
                      <Button variant="outline" className="bg-transparent">
                        Manage
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t border-white/10">
                      <div>
                        <p className="text-xs text-white/50">Positions</p>
                        <p className="font-semibold">{election.positions}</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/50">Candidates</p>
                        <p className="font-semibold">{election.candidates}</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/50">Votes Cast</p>
                        <p className="font-semibold">{election.votes_cast}</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/50">Ends</p>
                        <p className="font-semibold">{new Date(election.voting_end).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          {/* Schools Tab */}
          <TabsContent value="schools" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold">Registered Schools</h2>
                <p className="text-sm text-white/60">Schools under this school board</p>
              </div>
              <Button className="bg-cyan-600 hover:bg-cyan-700" onClick={() => setShowAddSchool(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add School
              </Button>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {["Central High School", "Westside Academy", "Eastview High", "Northern Secondary", "Lakefront High", "Valley View School"].map((school, i) => (
                <Card key={school} className="bg-white/5 border-white/10 hover:border-cyan-500/30 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                        <School className="w-5 h-5 text-cyan-400" />
                      </div>
                      <div>
                        <h4 className="font-medium">{school}</h4>
                        <p className="text-xs text-white/50">Toronto, ON</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 rounded bg-white/5">
                        <p className="text-lg font-bold">{Math.floor(Math.random() * 800) + 200}</p>
                        <p className="text-xs text-white/50">Students</p>
                      </div>
                      <div className="p-2 rounded bg-white/5">
                        <p className="text-lg font-bold">{Math.floor(Math.random() * 8) + 3}</p>
                        <p className="text-xs text-white/50">Council</p>
                      </div>
                      <div className="p-2 rounded bg-white/5">
                        <p className="text-lg font-bold">{Math.floor(Math.random() * 30) + 40}%</p>
                        <p className="text-xs text-white/50">Engaged</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Add School Dialog */}
      <Dialog open={showAddSchool} onOpenChange={setShowAddSchool}>
        <DialogContent className="bg-card border-white/10">
          <DialogHeader>
            <DialogTitle>Add New School</DialogTitle>
            <DialogDescription>Register a new school under this school board</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>School Name</Label>
              <Input placeholder="e.g., Central High School" className="bg-white/5 border-white/10" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>City</Label>
                <Input placeholder="Toronto" className="bg-white/5 border-white/10" />
              </div>
              <div className="space-y-2">
                <Label>Province</Label>
                <Select>
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ON">Ontario</SelectItem>
                    <SelectItem value="PE">Prince Edward Island</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Estimated Student Population</Label>
              <Input type="number" placeholder="500" className="bg-white/5 border-white/10" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="bg-transparent" onClick={() => setShowAddSchool(false)}>Cancel</Button>
            <Button className="bg-cyan-600 hover:bg-cyan-700">Add School</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
