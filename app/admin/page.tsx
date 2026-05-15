"use client"

import React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { 
  LayoutDashboard, Users, Vote, School, Building2, Shield, Settings,
  Plus, Search, Filter, MoreHorizontal, Check, X, Clock, AlertTriangle,
  Calendar, ChevronRight, TrendingUp, Eye, Edit, Trash2, UserCheck,
  FileText, BarChart3, Activity, Globe, Lock, Unlock, Briefcase
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import * as CRMStore from "@/lib/store/crm-store"

// Types
type UserRole = "voter" | "candidate" | "elected_official" | "school_council" | "school_board" | "group_admin" | "group_member" | "moderator" | "admin"
type ElectionStatus = "draft" | "nomination_open" | "nomination_closed" | "voting_open" | "voting_closed" | "certified" | "archived"
type VerificationStatus = "not_started" | "pending" | "verified" | "rejected"

interface User {
  id: string
  email: string
  full_name: string
  display_name?: string
  avatar_url?: string
  primary_role: UserRole
  secondary_roles: UserRole[]
  reputation_score: number
  voting_power: number
  identity_verified: VerificationStatus
  email_verified: VerificationStatus
  created_at: string
  last_active_at: string
}

interface Election {
  id: string
  title: string
  election_type: string
  status: ElectionStatus
  nomination_start: string
  nomination_end: string
  voting_start: string
  voting_end: string
  total_eligible_voters: number
  total_votes_cast: number
  positions_available: number
}

const DEMO_ELECTIONS: Election[] = [
  {
    id: "demo-election-1",
    title: "Ontario Municipal Election 2026",
    election_type: "municipal",
    status: "nomination_open",
    nomination_start: "2026-05-01",
    nomination_end: "2026-08-15",
    voting_start: "2026-10-20",
    voting_end: "2026-10-26",
    total_eligible_voters: 12000,
    total_votes_cast: 0,
    positions_available: 12,
  },
  {
    id: "demo-election-2",
    title: "School Board Trustee Election",
    election_type: "school_board",
    status: "draft",
    nomination_start: "2026-06-01",
    nomination_end: "2026-08-22",
    voting_start: "2026-10-20",
    voting_end: "2026-10-26",
    total_eligible_voters: 5400,
    total_votes_cast: 0,
    positions_available: 4,
  },
]

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [users, setUsers] = useState<User[]>([])
  const [elections, setElections] = useState<Election[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [showCreateElection, setShowCreateElection] = useState(false)
  const [showEditUser, setShowEditUser] = useState<User | null>(null)
  
  // Stats
  const [stats, setStats] = useState({
    totalUsers: 0,
    verifiedUsers: 0,
    activeElections: 0,
    pendingVerifications: 0,
    totalProposals: 0,
    activeProposals: 0,
  })

  const hasSupabaseConfig = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  
  useEffect(() => {
    fetchData()
  }, [])
  
  async function fetchData() {
    setLoading(true)
    try {
      CRMStore.initializeStore()

      const demoMode = localStorage.getItem("tnm-demo-mode") === "true"
      const currentUser = CRMStore.getCurrentUser()

      if (demoMode || currentUser?.type === "admin") {
        const demoUsers = CRMStore.getUsers().map((user) => ({
          id: user.id,
          email: user.email,
          full_name: user.name,
          primary_role: user.type === "admin" ? "admin" : user.type,
          secondary_roles: [],
          reputation_score: user.type === "candidate" ? 420 : user.type === "admin" ? 999 : 180,
          voting_power: user.type === "candidate" ? 35 : user.type === "admin" ? 100 : 12,
          identity_verified: user.status === "active" ? "verified" : user.status === "pending" ? "pending" : "rejected",
          email_verified: user.status === "active" ? "verified" : "pending",
          created_at: user.created_at,
          last_active_at: new Date().toISOString(),
        })) as User[]

        setUsers(demoUsers)
        setElections(DEMO_ELECTIONS)

        const verified = demoUsers.filter((user) => user.identity_verified === "verified").length
        const pending = demoUsers.filter((user) => user.identity_verified === "pending").length
        const active = DEMO_ELECTIONS.filter((election) => ["nomination_open", "voting_open"].includes(election.status)).length

        setStats({
          totalUsers: demoUsers.length,
          verifiedUsers: verified,
          activeElections: active,
          pendingVerifications: pending,
          totalProposals: 6,
          activeProposals: 3,
        })

        setLoading(false)
        return
      }

      if (!hasSupabaseConfig) {
        setUsers([])
        setElections([])
        setStats({
          totalUsers: 0,
          verifiedUsers: 0,
          activeElections: 0,
          pendingVerifications: 0,
          totalProposals: 0,
          activeProposals: 0,
        })
        setLoading(false)
        return
      }

      const supabase = createClient()

      // Fetch users
      const { data: usersData } = await supabase
        .from("user_profiles")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100)
      
      setUsers(usersData || [])
      
      // Fetch elections
      const { data: electionsData } = await supabase
        .from("elections")
        .select("*")
        .order("created_at", { ascending: false })
      
      setElections(electionsData || [])
      
      // Calculate stats
      const verified = (usersData || []).filter((u: any) => u.identity_verified === "verified").length
      const pending = (usersData || []).filter((u: any) => u.identity_verified === "pending").length
      const active = (electionsData || []).filter((e: any) => ["nomination_open", "voting_open"].includes(e.status)).length
      
      setStats({
        totalUsers: usersData?.length || 0,
        verifiedUsers: verified,
        activeElections: active,
        pendingVerifications: pending,
        totalProposals: 0,
        activeProposals: 0,
      })
      
    } catch (error) {
      console.error("Fetch error:", error)
    } finally {
      setLoading(false)
    }
  }
  
  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === "all" || user.primary_role === roleFilter
    return matchesSearch && matchesRole
  })
  
  // Update user role
  async function updateUserRole(userId: string, newRole: UserRole) {
    if (!hasSupabaseConfig) {
      setUsers(users.map(u => u.id === userId ? { ...u, primary_role: newRole } : u))
      setShowEditUser(null)
      return
    }

    const supabase = createClient()
    const { error } = await supabase
      .from("user_profiles")
      .update({ primary_role: newRole, updated_at: new Date().toISOString() })
      .eq("id", userId)
    
    if (!error) {
      setUsers(users.map(u => u.id === userId ? { ...u, primary_role: newRole } : u))
      setShowEditUser(null)
    }
  }
  
  // Verify user
  async function verifyUser(userId: string, status: VerificationStatus) {
    if (!hasSupabaseConfig) {
      const updatedUsers = users.map(u => u.id === userId ? { ...u, identity_verified: status } : u)
      setUsers(updatedUsers)
      setStats((currentStats) => ({
        ...currentStats,
        verifiedUsers: updatedUsers.filter(user => user.identity_verified === "verified").length,
        pendingVerifications: updatedUsers.filter(user => user.identity_verified === "pending").length,
      }))
      return
    }

    const supabase = createClient()
    const { error } = await supabase
      .from("user_profiles")
      .update({ identity_verified: status, updated_at: new Date().toISOString() })
      .eq("id", userId)
    
    if (!error) {
      setUsers(users.map(u => u.id === userId ? { ...u, identity_verified: status } : u))
    }
  }
  
  // Update election status
  async function updateElectionStatus(electionId: string, newStatus: ElectionStatus) {
    if (!hasSupabaseConfig) {
      const updatedElections = elections.map(e => e.id === electionId ? { ...e, status: newStatus } : e)
      setElections(updatedElections)
      setStats((currentStats) => ({
        ...currentStats,
        activeElections: updatedElections.filter(e => ["nomination_open", "voting_open"].includes(e.status)).length,
      }))
      return
    }

    const supabase = createClient()
    const { error } = await supabase
      .from("elections")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", electionId)
    
    if (!error) {
      setElections(elections.map(e => e.id === electionId ? { ...e, status: newStatus } : e))
    }
  }

  const getRoleBadgeColor = (role: UserRole) => {
    const colors: Record<UserRole, string> = {
      admin: "bg-red-500/20 text-red-400 border-red-500/30",
      moderator: "bg-orange-500/20 text-orange-400 border-orange-500/30",
      candidate: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      elected_official: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      school_board: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
      school_council: "bg-green-500/20 text-green-400 border-green-500/30",
      group_admin: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      group_member: "bg-gray-500/20 text-gray-400 border-gray-500/30",
      voter: "bg-white/10 text-white/70 border-white/20",
    }
    return colors[role] || colors.voter
  }
  
  const getStatusBadge = (status: ElectionStatus) => {
    const styles: Record<ElectionStatus, { bg: string; label: string }> = {
      draft: { bg: "bg-gray-500/20 text-gray-400", label: "Draft" },
      nomination_open: { bg: "bg-blue-500/20 text-blue-400", label: "Nominations Open" },
      nomination_closed: { bg: "bg-yellow-500/20 text-yellow-400", label: "Nominations Closed" },
      voting_open: { bg: "bg-green-500/20 text-green-400", label: "Voting Open" },
      voting_closed: { bg: "bg-orange-500/20 text-orange-400", label: "Voting Closed" },
      certified: { bg: "bg-purple-500/20 text-purple-400", label: "Certified" },
      archived: { bg: "bg-gray-500/20 text-gray-400", label: "Archived" },
    }
    return styles[status] || styles.draft
  }
  
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r border-white/10 min-h-screen p-4 hidden lg:block">
          <div className="flex items-center gap-2 mb-8">
            <Shield className="w-6 h-6 text-red-400" />
            <span className="font-semibold text-lg">Admin Panel</span>
          </div>
          
          <nav className="space-y-1">
            {[
              { id: "overview", icon: LayoutDashboard, label: "Overview" },
              { id: "users", icon: Users, label: "User Management" },
              { id: "elections", icon: Vote, label: "Elections" },
              { id: "organizations", icon: Building2, label: "Organizations" },
              { id: "verifications", icon: UserCheck, label: "Verifications" },
              { id: "proposals", icon: FileText, label: "Proposals" },
              { id: "analytics", icon: BarChart3, label: "Analytics" },
              { id: "settings", icon: Settings, label: "Settings" },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeTab === item.id 
                    ? "bg-white/10 text-white" 
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </nav>
          
          {/* CRM Link */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-xs text-white/40 uppercase tracking-wider mb-3 px-3">Separate Workspace</p>
            <Link
              href="/crm"
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-white/60 hover:bg-white/5 hover:text-white"
            >
              <Briefcase className="w-4 h-4" />
              Campaign CRM
            </Link>
          </div>
        </aside>
        
        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold">Dashboard Overview</h1>
                <p className="text-white/60">Platform administration and management</p>
              </div>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-white/5 border-white/10">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-white/60">Total Users</p>
                        <p className="text-3xl font-bold">{stats.totalUsers.toLocaleString()}</p>
                      </div>
                      <Users className="w-10 h-10 text-blue-400 opacity-50" />
                    </div>
                    <p className="text-xs text-green-400 mt-2">+12% from last month</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/5 border-white/10">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-white/60">Verified Users</p>
                        <p className="text-3xl font-bold">{stats.verifiedUsers.toLocaleString()}</p>
                      </div>
                      <UserCheck className="w-10 h-10 text-green-400 opacity-50" />
                    </div>
                    <Progress value={(stats.verifiedUsers / stats.totalUsers) * 100} className="mt-2 h-1" />
                  </CardContent>
                </Card>
                
                <Card className="bg-white/5 border-white/10">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-white/60">Active Elections</p>
                        <p className="text-3xl font-bold">{stats.activeElections}</p>
                      </div>
                      <Vote className="w-10 h-10 text-purple-400 opacity-50" />
                    </div>
                    <p className="text-xs text-white/40 mt-2">{elections.length} total elections</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/5 border-white/10">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-white/60">Pending Verifications</p>
                        <p className="text-3xl font-bold">{stats.pendingVerifications}</p>
                      </div>
                      <Clock className="w-10 h-10 text-yellow-400 opacity-50" />
                    </div>
                    <Link href="#" onClick={() => setActiveTab("verifications")} className="text-xs text-blue-400 mt-2 inline-block">
                      Review pending
                    </Link>
                  </CardContent>
                </Card>
              </div>
              
              {/* Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start bg-transparent"
                      onClick={() => setShowCreateElection(true)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create New Election
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start bg-transparent"
                      onClick={() => setActiveTab("verifications")}
                    >
                      <UserCheck className="w-4 h-4 mr-2" />
                      Review Verifications ({stats.pendingVerifications})
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start bg-transparent"
                      onClick={() => setActiveTab("users")}
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Manage Users
                    </Button>
                    <Link href="/crm">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start bg-transparent"
                      >
                        <Briefcase className="w-4 h-4 mr-2" />
                        Open Campaign CRM
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-lg">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { action: "New user registered", user: "john.doe@email.com", time: "2 min ago" },
                      { action: "Verification approved", user: "jane.smith@email.com", time: "15 min ago" },
                      { action: "Proposal submitted", user: "alex.chen@email.com", time: "1 hour ago" },
                      { action: "Election certified", user: "Municipal Council 2026", time: "3 hours ago" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                        <div>
                          <p className="text-sm">{item.action}</p>
                          <p className="text-xs text-white/50">{item.user}</p>
                        </div>
                        <span className="text-xs text-white/40">{item.time}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
          
          {/* Users Tab */}
          {activeTab === "users" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold">User Management</h1>
                  <p className="text-white/60">Manage user accounts, roles, and permissions</p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add User
                </Button>
              </div>
              
              {/* Filters */}
              <div className="flex gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <Input 
                    placeholder="Search users..." 
                    className="pl-10 bg-white/5 border-white/10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-48 bg-white/5 border-white/10">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="voter">Voter</SelectItem>
                    <SelectItem value="candidate">Candidate</SelectItem>
                    <SelectItem value="school_council">School Council</SelectItem>
                    <SelectItem value="school_board">School Board</SelectItem>
                    <SelectItem value="moderator">Moderator</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Users Table */}
              <Card className="bg-white/5 border-white/10">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10">
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Reputation</TableHead>
                      <TableHead>Verification</TableHead>
                      <TableHead>Last Active</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map(user => (
                      <TableRow key={user.id} className="border-white/10">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={user.avatar_url || "/placeholder.svg"} />
                              <AvatarFallback className="bg-blue-600 text-xs">
                                {user.full_name?.split(" ").map(n => n[0]).join("") || "?"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{user.full_name || "Unknown"}</p>
                              <p className="text-xs text-white/50">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getRoleBadgeColor(user.primary_role)} border`}>
                            {user.primary_role.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{user.reputation_score}</span>
                            <span className="text-xs text-white/40">({user.voting_power} VP)</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {user.identity_verified === "verified" ? (
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 border">
                              <Check className="w-3 h-3 mr-1" /> Verified
                            </Badge>
                          ) : user.identity_verified === "pending" ? (
                            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 border">
                              <Clock className="w-3 h-3 mr-1" /> Pending
                            </Badge>
                          ) : (
                            <Badge className="bg-white/10 text-white/50 border-white/20 border">
                              Not verified
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-white/60">
                          {new Date(user.last_active_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setShowEditUser(user)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            {user.identity_verified === "pending" && (
                              <>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="text-green-400"
                                  onClick={() => verifyUser(user.id, "verified")}
                                >
                                  <Check className="w-4 h-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="text-red-400"
                                  onClick={() => verifyUser(user.id, "rejected")}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </div>
          )}
          
          {/* Elections Tab */}
          {activeTab === "elections" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold">Election Management</h1>
                  <p className="text-white/60">Create and manage elections across the platform</p>
                </div>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => setShowCreateElection(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Election
                </Button>
              </div>
              
              {/* Election Lifecycle */}
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-lg">Election Lifecycle</CardTitle>
                  <CardDescription>Standard election phases and transitions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    {[
                      { label: "Draft", icon: FileText },
                      { label: "Nominations", icon: Users },
                      { label: "Voting", icon: Vote },
                      { label: "Results", icon: BarChart3 },
                      { label: "Certified", icon: Check },
                    ].map((phase, i) => (
                      <div key={phase.label} className="flex items-center">
                        <div className="flex flex-col items-center">
                          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                            <phase.icon className="w-5 h-5 text-blue-400" />
                          </div>
                          <span className="text-xs mt-2 text-white/60">{phase.label}</span>
                        </div>
                        {i < 4 && (
                          <ChevronRight className="w-5 h-5 text-white/20 mx-4" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Elections List */}
              <div className="grid gap-4">
                {elections.length === 0 ? (
                  <Card className="bg-white/5 border-white/10">
                    <CardContent className="py-12 text-center">
                      <Vote className="w-12 h-12 mx-auto text-white/20 mb-4" />
                      <h3 className="font-medium mb-2">No Elections Yet</h3>
                      <p className="text-sm text-white/50 mb-4">Create your first election to get started</p>
                      <Button onClick={() => setShowCreateElection(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Election
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  elections.map(election => {
                    const statusInfo = getStatusBadge(election.status)
                    const turnout = election.total_eligible_voters > 0 
                      ? (election.total_votes_cast / election.total_eligible_voters) * 100 
                      : 0
                    
                    return (
                      <Card key={election.id} className="bg-white/5 border-white/10">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center gap-3">
                                <h3 className="font-semibold text-lg">{election.title}</h3>
                                <Badge className={statusInfo.bg}>{statusInfo.label}</Badge>
                              </div>
                              <p className="text-sm text-white/50">
                                {election.election_type} | {election.positions_available} position(s)
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Select 
                                value={election.status}
                                onValueChange={(value) => updateElectionStatus(election.id, value as ElectionStatus)}
                              >
                                <SelectTrigger className="w-48 bg-white/5 border-white/10 h-8 text-sm">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="draft">Draft</SelectItem>
                                  <SelectItem value="nomination_open">Open Nominations</SelectItem>
                                  <SelectItem value="nomination_closed">Close Nominations</SelectItem>
                                  <SelectItem value="voting_open">Open Voting</SelectItem>
                                  <SelectItem value="voting_closed">Close Voting</SelectItem>
                                  <SelectItem value="certified">Certify Results</SelectItem>
                                  <SelectItem value="archived">Archive</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button variant="outline" size="sm" className="bg-transparent">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t border-white/10">
                            <div>
                              <p className="text-xs text-white/50">Nominations</p>
                              <p className="text-sm">
                                {election.nomination_start ? new Date(election.nomination_start).toLocaleDateString() : "Not set"}
                                {" - "}
                                {election.nomination_end ? new Date(election.nomination_end).toLocaleDateString() : "Not set"}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-white/50">Voting Period</p>
                              <p className="text-sm">
                                {election.voting_start ? new Date(election.voting_start).toLocaleDateString() : "Not set"}
                                {" - "}
                                {election.voting_end ? new Date(election.voting_end).toLocaleDateString() : "Not set"}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-white/50">Eligible Voters</p>
                              <p className="text-sm font-medium">{election.total_eligible_voters.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-xs text-white/50">Turnout</p>
                              <div className="flex items-center gap-2">
                                <Progress value={turnout} className="h-2 flex-1" />
                                <span className="text-sm font-medium">{turnout.toFixed(1)}%</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })
                )}
              </div>
            </div>
          )}
          
          {/* Verifications Tab */}
          {activeTab === "verifications" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold">Verification Queue</h1>
                <p className="text-white/60">Review and approve user identity verifications</p>
              </div>
              
              <div className="grid gap-4">
                {users.filter(u => u.identity_verified === "pending").map(user => (
                  <Card key={user.id} className="bg-white/5 border-white/10">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={user.avatar_url || "/placeholder.svg"} />
                            <AvatarFallback className="bg-yellow-600">
                              {user.full_name?.split(" ").map(n => n[0]).join("") || "?"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{user.full_name}</h3>
                            <p className="text-sm text-white/50">{user.email}</p>
                            <p className="text-xs text-white/40">
                              Applied: {new Date(user.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => verifyUser(user.id, "verified")}
                          >
                            <Check className="w-4 h-4 mr-2" />
                            Approve
                          </Button>
                          <Button 
                            variant="outline" 
                            className="bg-transparent border-red-500/30 text-red-400 hover:bg-red-500/10"
                            onClick={() => verifyUser(user.id, "rejected")}
                          >
                            <X className="w-4 h-4 mr-2" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {users.filter(u => u.identity_verified === "pending").length === 0 && (
                  <Card className="bg-white/5 border-white/10">
                    <CardContent className="py-12 text-center">
                      <Check className="w-12 h-12 mx-auto text-green-400/50 mb-4" />
                      <h3 className="font-medium mb-2">All Caught Up!</h3>
                      <p className="text-sm text-white/50">No pending verifications at this time</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}
          
          {/* Organizations Tab */}
          {activeTab === "organizations" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold">Organizations</h1>
                  <p className="text-white/60">Manage schools, school boards, and community groups</p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Organization
                </Button>
              </div>
              
              <Tabs defaultValue="schools" className="space-y-4">
                <TabsList className="bg-white/5 border border-white/10">
                  <TabsTrigger value="schools">Schools</TabsTrigger>
                  <TabsTrigger value="school_boards">School Boards</TabsTrigger>
                  <TabsTrigger value="groups">Community Groups</TabsTrigger>
                </TabsList>
                
                <TabsContent value="schools" className="space-y-4">
                  <Card className="bg-white/5 border-white/10">
                    <CardContent className="py-12 text-center">
                      <School className="w-12 h-12 mx-auto text-white/20 mb-4" />
                      <h3 className="font-medium mb-2">No Schools Registered</h3>
                      <p className="text-sm text-white/50 mb-4">Schools can be added through school board registration</p>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="school_boards" className="space-y-4">
                  <Card className="bg-white/5 border-white/10">
                    <CardContent className="py-12 text-center">
                      <Building2 className="w-12 h-12 mx-auto text-white/20 mb-4" />
                      <h3 className="font-medium mb-2">No School Boards Registered</h3>
                      <p className="text-sm text-white/50 mb-4">Add a school board to enable student council registration</p>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Add School Board
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="groups" className="space-y-4">
                  <Card className="bg-white/5 border-white/10">
                    <CardContent className="py-12 text-center">
                      <Users className="w-12 h-12 mx-auto text-white/20 mb-4" />
                      <h3 className="font-medium mb-2">No Community Groups</h3>
                      <p className="text-sm text-white/50 mb-4">Community groups can be created by verified users</p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
          
          {/* Other tabs show placeholder */}
          {["proposals", "analytics", "settings"].includes(activeTab) && (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <Settings className="w-12 h-12 mx-auto text-white/20 mb-4" />
                <h3 className="font-medium mb-2">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h3>
                <p className="text-sm text-white/50">Coming soon</p>
              </div>
            </div>
          )}
        </main>
      </div>
      
      {/* Create Election Dialog */}
      <Dialog open={showCreateElection} onOpenChange={setShowCreateElection}>
        <DialogContent className="sm:max-w-lg bg-card border-white/10">
          <DialogHeader>
            <DialogTitle>Create New Election</DialogTitle>
            <DialogDescription>Set up a new election with voting rules and timeline</DialogDescription>
          </DialogHeader>
          <CreateElectionForm
            hasSupabaseConfig={hasSupabaseConfig}
            onClose={() => setShowCreateElection(false)}
            onSuccess={fetchData}
            onLocalCreate={(election) => {
              setElections((current) => [election, ...current])
              setStats((currentStats) => ({
                ...currentStats,
                activeElections: [election, ...elections].filter((item) => ["nomination_open", "voting_open"].includes(item.status)).length,
              }))
            }}
          />
        </DialogContent>
      </Dialog>
      
      {/* Edit User Dialog */}
      <Dialog open={!!showEditUser} onOpenChange={() => setShowEditUser(null)}>
        <DialogContent className="sm:max-w-md bg-card border-white/10">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user role and permissions</DialogDescription>
          </DialogHeader>
          {showEditUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={showEditUser.avatar_url || "/placeholder.svg"} />
                  <AvatarFallback>{showEditUser.full_name?.[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{showEditUser.full_name}</p>
                  <p className="text-sm text-white/50">{showEditUser.email}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Primary Role</Label>
                <Select 
                  value={showEditUser.primary_role}
                  onValueChange={(value) => updateUserRole(showEditUser.id, value as UserRole)}
                >
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="voter">Voter</SelectItem>
                    <SelectItem value="candidate">Candidate</SelectItem>
                    <SelectItem value="elected_official">Elected Official</SelectItem>
                    <SelectItem value="school_council">School Council</SelectItem>
                    <SelectItem value="school_board">School Board</SelectItem>
                    <SelectItem value="group_admin">Group Admin</SelectItem>
                    <SelectItem value="moderator">Moderator</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <DialogFooter>
                <Button variant="outline" className="bg-transparent" onClick={() => setShowEditUser(null)}>
                  Cancel
                </Button>
                <Button onClick={() => setShowEditUser(null)}>
                  Save Changes
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Create Election Form Component
function CreateElectionForm({
  hasSupabaseConfig,
  onClose,
  onSuccess,
  onLocalCreate,
}: {
  hasSupabaseConfig: boolean
  onClose: () => void
  onSuccess: () => void
  onLocalCreate: (election: Election) => void
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    election_type: "municipal",
    positions_available: 1,
    consensus_mechanism: "simple_majority",
    nomination_start: "",
    nomination_end: "",
    voting_start: "",
    voting_end: "",
    min_age: 16,
  })
  const [loading, setLoading] = useState(false)
  
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    
    try {
      if (!hasSupabaseConfig) {
        onLocalCreate({
          id: `demo-election-${Date.now()}`,
          title: formData.title,
          election_type: formData.election_type,
          status: "draft",
          nomination_start: formData.nomination_start,
          nomination_end: formData.nomination_end,
          voting_start: formData.voting_start,
          voting_end: formData.voting_end,
          total_eligible_voters: 0,
          total_votes_cast: 0,
          positions_available: formData.positions_available,
        })
        onClose()
        return
      }

      const supabase = createClient()
      const { error } = await supabase
        .from("elections")
        .insert({
          ...formData,
          status: "draft",
        })
      
      if (error) throw error
      
      onSuccess()
      onClose()
    } catch (error) {
      console.error("Create election error:", error)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Election Title</Label>
        <Input 
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g., Municipal Council 2026"
          className="bg-white/5 border-white/10"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea 
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe the election..."
          className="bg-white/5 border-white/10"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Election Type</Label>
          <Select 
            value={formData.election_type}
            onValueChange={(value) => setFormData({ ...formData, election_type: value })}
          >
            <SelectTrigger className="bg-white/5 border-white/10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="municipal">Municipal</SelectItem>
              <SelectItem value="school_council">School Council</SelectItem>
              <SelectItem value="dao_delegate">DAO Delegate</SelectItem>
              <SelectItem value="referendum">Referendum</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>Positions Available</Label>
          <Input 
            type="number"
            min={1}
            value={formData.positions_available}
            onChange={(e) => setFormData({ ...formData, positions_available: parseInt(e.target.value) })}
            className="bg-white/5 border-white/10"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Consensus Mechanism</Label>
        <Select 
          value={formData.consensus_mechanism}
          onValueChange={(value) => setFormData({ ...formData, consensus_mechanism: value })}
        >
          <SelectTrigger className="bg-white/5 border-white/10">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="simple_majority">Simple Majority (50% + 1)</SelectItem>
            <SelectItem value="supermajority">Supermajority (66%)</SelectItem>
            <SelectItem value="quadratic">Quadratic Voting</SelectItem>
            <SelectItem value="ranked_choice">Ranked Choice</SelectItem>
            <SelectItem value="approval">Approval Voting</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Nomination Start</Label>
          <Input 
            type="datetime-local"
            value={formData.nomination_start}
            onChange={(e) => setFormData({ ...formData, nomination_start: e.target.value })}
            className="bg-white/5 border-white/10"
          />
        </div>
        <div className="space-y-2">
          <Label>Nomination End</Label>
          <Input 
            type="datetime-local"
            value={formData.nomination_end}
            onChange={(e) => setFormData({ ...formData, nomination_end: e.target.value })}
            className="bg-white/5 border-white/10"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Voting Start</Label>
          <Input 
            type="datetime-local"
            value={formData.voting_start}
            onChange={(e) => setFormData({ ...formData, voting_start: e.target.value })}
            className="bg-white/5 border-white/10"
          />
        </div>
        <div className="space-y-2">
          <Label>Voting End</Label>
          <Input 
            type="datetime-local"
            value={formData.voting_end}
            onChange={(e) => setFormData({ ...formData, voting_end: e.target.value })}
            className="bg-white/5 border-white/10"
          />
        </div>
      </div>
      
      <DialogFooter>
        <Button type="button" variant="outline" className="bg-transparent" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Election"}
        </Button>
      </DialogFooter>
    </form>
  )
}
