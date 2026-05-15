"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { 
  GraduationCap, Users, Vote, Calendar, Trophy, FileText,
  MessageSquare, Bell, ChevronRight, Plus, CheckCircle2,
  Clock, Star, Zap, Target, Award, BookOpen, School
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface CouncilMember {
  id: string
  full_name: string
  email: string
  school_name: string
  grade: number
  council_role: string
  reputation_score: number
  voting_power: number
  is_verified: boolean
  badges: string[]
}

export default function SchoolCouncilDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [member, setMember] = useState<CouncilMember | null>(null)
  const [schoolProposals, setSchoolProposals] = useState<any[]>([])
  const [councilTasks, setCouncilTasks] = useState<any[]>([])
  const [events, setEvents] = useState<any[]>([])

  useEffect(() => {
    async function loadData() {
      const isDemoMode = localStorage.getItem("tnm-demo-mode") === "true"
      
      if (isDemoMode) {
        setMember({
          id: "sc-001",
          full_name: "Jordan Williams",
          email: "jordan@school.ca",
          school_name: "Riverside Secondary School",
          grade: 11,
          council_role: "Vice President",
          reputation_score: 485,
          voting_power: 22,
          is_verified: true,
          badges: ["youth_voter", "council_member", "debate_participant"]
        })

        setSchoolProposals([
          { id: "1", title: "Votes at 16 Awareness Week", status: "active", votes_for: 45, votes_against: 8, deadline: new Date(Date.now() + 7*24*60*60*1000).toISOString() },
          { id: "2", title: "Student Transit Pass Program", status: "active", votes_for: 67, votes_against: 12, deadline: new Date(Date.now() + 14*24*60*60*1000).toISOString() },
          { id: "3", title: "Municipal Candidate Forum at School", status: "pending", votes_for: 0, votes_against: 0, deadline: new Date(Date.now() + 21*24*60*60*1000).toISOString() },
        ])

        setCouncilTasks([
          { id: "1", title: "Organize voter registration drive", status: "in_progress", due_date: new Date(Date.now() + 5*24*60*60*1000).toISOString(), rep_reward: 50 },
          { id: "2", title: "Create social media content for Votes at 16", status: "pending", due_date: new Date(Date.now() + 10*24*60*60*1000).toISOString(), rep_reward: 30 },
          { id: "3", title: "Meet with school board representative", status: "completed", due_date: new Date(Date.now() - 2*24*60*60*1000).toISOString(), rep_reward: 40 },
        ])

        setEvents([
          { id: "1", title: "Youth Assembly Online Session", date: new Date(Date.now() + 3*24*60*60*1000).toISOString(), type: "assembly" },
          { id: "2", title: "School Board Town Hall", date: new Date(Date.now() + 7*24*60*60*1000).toISOString(), type: "town_hall" },
          { id: "3", title: "Candidate Q&A Forum", date: new Date(Date.now() + 14*24*60*60*1000).toISOString(), type: "forum" },
        ])

        setLoading(false)
        return
      }

      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push("/auth/login?redirect=/dashboard/school-council")
        return
      }

      // Load real data
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      const { data: councilData } = await supabase
        .from("school_council_members")
        .select("*")
        .eq("user_id", user.id)
        .single()

      if (profile && councilData) {
        setMember({
          ...profile,
          ...councilData,
          reputation_score: profile.reputation_score || 0,
          voting_power: profile.voting_power || 1,
          badges: profile.badges || []
        })
      }

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

  return (
    <div className="min-h-screen bg-[#05070a]">
      {/* Header */}
      <div className="border-b border-white/10 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  School Council Dashboard
                </h1>
                <p className="text-white/60 mt-1">
                  {member?.council_role} • {member?.school_name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30">
                <Trophy className="w-5 h-5 text-amber-400" />
                <div>
                  <p className="text-xs text-amber-400/70">Reputation</p>
                  <p className="text-lg font-bold text-amber-400">{member?.reputation_score || 0}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30">
                <Zap className="w-5 h-5 text-purple-400" />
                <div>
                  <p className="text-xs text-purple-400/70">Voting Power</p>
                  <p className="text-lg font-bold text-purple-400">{member?.voting_power || 1}</p>
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
              Overview
            </TabsTrigger>
            <TabsTrigger value="proposals" className="data-[state=active]:bg-blue-600">
              School Proposals
            </TabsTrigger>
            <TabsTrigger value="tasks" className="data-[state=active]:bg-blue-600">
              Council Tasks
            </TabsTrigger>
            <TabsTrigger value="assembly" className="data-[state=active]:bg-blue-600">
              Youth Assembly
            </TabsTrigger>
            <TabsTrigger value="events" className="data-[state=active]:bg-blue-600">
              Events
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-[#0b0f16] border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/60 text-sm">Active Proposals</p>
                      <p className="text-3xl font-bold text-white mt-1">
                        {schoolProposals.filter(p => p.status === "active").length}
                      </p>
                    </div>
                    <Vote className="w-10 h-10 text-blue-400/50" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#0b0f16] border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/60 text-sm">Pending Tasks</p>
                      <p className="text-3xl font-bold text-white mt-1">
                        {councilTasks.filter(t => t.status !== "completed").length}
                      </p>
                    </div>
                    <Target className="w-10 h-10 text-yellow-400/50" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#0b0f16] border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/60 text-sm">Upcoming Events</p>
                      <p className="text-3xl font-bold text-white mt-1">{events.length}</p>
                    </div>
                    <Calendar className="w-10 h-10 text-green-400/50" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#0b0f16] border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/60 text-sm">Badges Earned</p>
                      <p className="text-3xl font-bold text-white mt-1">{member?.badges?.length || 0}</p>
                    </div>
                    <Award className="w-10 h-10 text-amber-400/50" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Youth Assembly Connection */}
            <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-400" />
                  Youth Assembly Connection
                </CardTitle>
                <CardDescription className="text-white/60">
                  As a school council member, you have a voice in the Youth Assembly
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-white/5">
                    <h4 className="font-medium text-white">Your Role</h4>
                    <p className="text-white/60 text-sm mt-1">School Representative</p>
                    <p className="text-purple-400 text-sm mt-2">Can submit proposals to Assembly</p>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5">
                    <h4 className="font-medium text-white">Assembly Privileges</h4>
                    <ul className="text-white/60 text-sm mt-1 space-y-1">
                      <li>- Vote on youth policies</li>
                      <li>- Participate in debates</li>
                      <li>- Propose school initiatives</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5">
                    <h4 className="font-medium text-white">Next Session</h4>
                    <p className="text-white/60 text-sm mt-1">
                      {new Date(events[0]?.date).toLocaleDateString()}
                    </p>
                    <Link href="/governance">
                      <Button size="sm" className="mt-2 bg-purple-600 hover:bg-purple-500">
                        Join Assembly
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-[#0b0f16] border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Recent Proposals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {schoolProposals.slice(0, 2).map((proposal) => (
                      <div key={proposal.id} className="p-3 rounded-lg bg-white/5">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-white">{proposal.title}</h4>
                            <p className="text-white/50 text-sm mt-1">
                              {proposal.votes_for} for • {proposal.votes_against} against
                            </p>
                          </div>
                          <Badge className={proposal.status === "active" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}>
                            {proposal.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Link href="/governance/town-hall">
                    <Button variant="outline" className="w-full mt-4 border-white/20 text-white hover:bg-white/10 bg-transparent">
                      View All Proposals
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="bg-[#0b0f16] border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Your Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {councilTasks.filter(t => t.status !== "completed").slice(0, 2).map((task) => (
                      <div key={task.id} className="p-3 rounded-lg bg-white/5">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-white">{task.title}</h4>
                            <p className="text-white/50 text-sm mt-1 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Due {new Date(task.due_date).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge className="bg-amber-500/20 text-amber-400">
                            +{task.rep_reward} rep
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-500">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Task
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Proposals Tab */}
          <TabsContent value="proposals" className="space-y-6">
            <Card className="bg-[#0b0f16] border-white/10">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-white">School Proposals</CardTitle>
                    <CardDescription className="text-white/60">
                      Proposals from your school council
                    </CardDescription>
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-500">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Proposal
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {schoolProposals.map((proposal) => (
                    <div key={proposal.id} className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <Badge className={proposal.status === "active" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}>
                            {proposal.status}
                          </Badge>
                          <h4 className="font-medium text-white text-lg mt-2">{proposal.title}</h4>
                        </div>
                        {proposal.status === "active" && (
                          <div className="flex gap-2">
                            <Button size="sm" className="bg-green-600 hover:bg-green-500">Vote For</Button>
                            <Button size="sm" variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/20 bg-transparent">Against</Button>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-green-400">{proposal.votes_for} for</span>
                          <span className="text-red-400">{proposal.votes_against} against</span>
                        </div>
                        <Progress value={(proposal.votes_for / (proposal.votes_for + proposal.votes_against) * 100) || 50} className="h-2" />
                      </div>
                      
                      <p className="mt-2 text-sm text-white/50">
                        Deadline: {new Date(proposal.deadline).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tasks Tab */}
          <TabsContent value="tasks" className="space-y-6">
            <Card className="bg-[#0b0f16] border-white/10">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-white">Council Tasks</CardTitle>
                  <Button className="bg-blue-600 hover:bg-blue-500">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Task
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {councilTasks.map((task) => (
                    <div key={task.id} className={`p-4 rounded-lg border ${
                      task.status === "completed" 
                        ? "bg-green-500/10 border-green-500/30" 
                        : task.status === "in_progress"
                        ? "bg-blue-500/10 border-blue-500/30"
                        : "bg-white/5 border-white/10"
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {task.status === "completed" ? (
                            <CheckCircle2 className="w-5 h-5 text-green-400" />
                          ) : (
                            <div className={`w-5 h-5 rounded-full border-2 ${
                              task.status === "in_progress" ? "border-blue-400" : "border-white/30"
                            }`} />
                          )}
                          <div>
                            <h4 className={`font-medium ${task.status === "completed" ? "text-white/50 line-through" : "text-white"}`}>
                              {task.title}
                            </h4>
                            <p className="text-white/50 text-sm">
                              Due {new Date(task.due_date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className="bg-amber-500/20 text-amber-400">+{task.rep_reward} rep</Badge>
                          {task.status !== "completed" && (
                            <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
                              Mark Done
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Youth Assembly Tab */}
          <TabsContent value="assembly" className="space-y-6">
            <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white">Youth Assembly</CardTitle>
                <CardDescription className="text-white/60">
                  On-chain legislature with 70% under-40 membership
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-white mb-3">Your Assembly Privileges</h4>
                    <ul className="space-y-2">
                      {[
                        "Submit proposals on behalf of your school",
                        "Vote on youth-related policies",
                        "Participate in live debates",
                        "Veto power on generationally harmful policies"
                      ].map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-white/80">
                          <CheckCircle2 className="w-4 h-4 text-green-400" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5">
                    <h4 className="font-medium text-white mb-3">Assembly Stats</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-white/60">Total Members</span>
                        <span className="text-white font-medium">47</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Under 40</span>
                        <span className="text-purple-400 font-medium">78%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">School Reps</span>
                        <span className="text-white font-medium">23</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Active Bills</span>
                        <span className="text-blue-400 font-medium">12</span>
                      </div>
                    </div>
                    <Link href="/governance">
                      <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-500">
                        Enter Assembly
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <Card className="bg-[#0b0f16] border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {events.map((event) => (
                    <div key={event.id} className="p-4 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          event.type === "assembly" ? "bg-purple-500/20" :
                          event.type === "town_hall" ? "bg-blue-500/20" : "bg-green-500/20"
                        }`}>
                          {event.type === "assembly" && <Users className="w-6 h-6 text-purple-400" />}
                          {event.type === "town_hall" && <MessageSquare className="w-6 h-6 text-blue-400" />}
                          {event.type === "forum" && <School className="w-6 h-6 text-green-400" />}
                        </div>
                        <div>
                          <h4 className="font-medium text-white">{event.title}</h4>
                          <p className="text-white/60 text-sm">
                            {new Date(event.date).toLocaleDateString()} at {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-500">
                        RSVP
                      </Button>
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
