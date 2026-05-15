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
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { 
  ArrowLeft, Users, UserPlus, Handshake, CheckSquare, Search, Plus, 
  MoreHorizontal, Phone, Mail, Calendar, DollarSign, TrendingUp,
  Clock, AlertCircle, ChevronRight, Building2, Tag, MessageSquare,
  ArrowUpRight, ArrowDownRight, Filter, GripVertical, ShoppingCart,
  CreditCard, Receipt, RefreshCw, Pause, Play, XCircle, UserCheck,
  Vote, Package, Check, FileText, CircleHelp, Scale
} from "lucide-react"
import * as CRMStore from "@/lib/store/crm-store"
import { FULL_CAMPAIGN_BLUEPRINTS as SHARED_FULL_CAMPAIGN_BLUEPRINTS } from "@/lib/campaign-system"

// Types
type LeadStatus = "new" | "contacted" | "qualified" | "proposal" | "negotiation" | "won" | "lost"
type DealStage = "discovery" | "proposal" | "negotiation" | "closed_won" | "closed_lost"
type TaskPriority = "low" | "medium" | "high" | "urgent"
type TaskStatus = "pending" | "in_progress" | "completed" | "cancelled"

interface Lead {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  source: string
  status: LeadStatus
  notes?: string
  assigned_to?: string
  created_at: string
  updated_at: string
}

interface Client {
  id: string
  candidate_id: string
  name: string
  email: string
  phone?: string
  avatar_url?: string
  services: string[]
  total_revenue: number
  status: "active" | "inactive" | "churned"
  created_at: string
}

interface Deal {
  id: string
  title: string
  client_id?: string
  lead_id?: string
  client_name: string
  value: number
  stage: DealStage
  probability: number
  expected_close: string
  notes?: string
  created_at: string
}

interface Task {
  id: string
  title: string
  description?: string
  client_id?: string
  lead_id?: string
  deal_id?: string
  related_name?: string
  priority: TaskPriority
  status: TaskStatus
  due_date: string
  assigned_to?: string
  created_at: string
}

interface Note {
  id: string
  content: string
  entity_type: "lead" | "client" | "deal"
  entity_id: string
  created_at: string
  created_by?: string
}

interface Order {
  id: string
  order_number: string
  client_id: string
  client_name: string
  client_type: "candidate" | "voter"
  services: { name: string; price: number }[]
  total: number
  status: "pending" | "processing" | "completed" | "cancelled" | "refunded"
  payment_status: "unpaid" | "paid" | "partial" | "refunded"
  created_at: string
}

interface Subscription {
  id: string
  client_id: string
  client_name: string
  client_type: "candidate" | "voter"
  service_name: string
  plan: "monthly" | "quarterly" | "annual"
  price: number
  status: "active" | "paused" | "cancelled" | "expired"
  start_date: string
  next_billing: string
  auto_renew: boolean
}

interface CRMDashboardUser {
  id: string
  name: string
  email: string
  type: "candidate" | "voter" | "admin"
  avatar?: string
  status: "active" | "pending" | "suspended"
  created_at: string
  subscriptions: string[]
  orders: string[]
}

type TeamMember = CRMStore.TeamMember
type TeamChatChannel = CRMStore.TeamChatChannel
type ClientChatThread = CRMStore.ClientChatThread
type Campaign = CRMStore.Campaign
type SharedFile = CRMStore.SharedFile
type Meeting = CRMStore.Meeting

// Demo Users - 2 Candidates, 2 Voters
const mockDemoUsers: CRMDashboardUser[] = [
  // Candidates
  { 
    id: "cand-1", 
    name: "Maria Rodriguez", 
    email: "maria@rodriguez2024.com", 
    type: "candidate", 
    status: "active",
    created_at: "2024-01-01",
    subscriptions: ["sub-1", "sub-2"],
    orders: ["ord-1", "ord-2"]
  },
  { 
    id: "cand-2", 
    name: "James Wilson", 
    email: "james@wilsonformayor.com", 
    type: "candidate", 
    status: "active",
    created_at: "2024-01-10",
    subscriptions: ["sub-3"],
    orders: ["ord-3"]
  },
  // Voters
  { 
    id: "voter-1", 
    name: "Emily Thompson", 
    email: "emily.t@gmail.com", 
    type: "voter", 
    status: "active",
    created_at: "2024-02-01",
    subscriptions: [],
    orders: ["ord-4"]
  },
  { 
    id: "voter-2", 
    name: "David Park", 
    email: "dpark@outlook.com", 
    type: "voter", 
    status: "pending",
    created_at: "2024-02-15",
    subscriptions: [],
    orders: []
  },
]

// Mock Orders
const mockOrders: Order[] = [
  { id: "ord-1", order_number: "ORD-2024-001", client_id: "cand-1", client_name: "Maria Rodriguez", client_type: "candidate", services: [{ name: "SEO Optimization", price: 69500 }, { name: "Social Media Package", price: 44500 }], total: 114000, status: "completed", payment_status: "paid", created_at: "2024-01-05" },
  { id: "ord-2", order_number: "ORD-2024-002", client_id: "cand-1", client_name: "Maria Rodriguez", client_type: "candidate", services: [{ name: "Campaign Website Pro", price: 129500 }], total: 129500, status: "processing", payment_status: "paid", created_at: "2024-02-01" },
  { id: "ord-3", order_number: "ORD-2024-003", client_id: "cand-2", client_name: "James Wilson", client_type: "candidate", services: [{ name: "Digital Presence", price: 79500 }, { name: "Video Production", price: 89500 }], total: 169000, status: "completed", payment_status: "paid", created_at: "2024-01-20" },
  { id: "ord-4", order_number: "ORD-2024-004", client_id: "voter-1", client_name: "Emily Thompson", client_type: "voter", services: [{ name: "Voter Guide Premium", price: 999 }], total: 999, status: "completed", payment_status: "paid", created_at: "2024-02-10" },
  { id: "ord-5", order_number: "ORD-2024-005", client_id: "cand-1", client_name: "Maria Rodriguez", client_type: "candidate", services: [{ name: "Crisis Management", price: 99500 }], total: 99500, status: "pending", payment_status: "unpaid", created_at: "2024-03-01" },
]

// Mock Subscriptions
const mockSubscriptions: Subscription[] = [
  { id: "sub-1", client_id: "cand-1", client_name: "Maria Rodriguez", client_type: "candidate", service_name: "Local Messaging & Communication", plan: "monthly", price: 59500, status: "active", start_date: "2024-01-01", next_billing: "2024-04-01", auto_renew: true },
  { id: "sub-2", client_id: "cand-1", client_name: "Maria Rodriguez", client_type: "candidate", service_name: "Social Media Management", plan: "monthly", price: 44500, status: "active", start_date: "2024-01-15", next_billing: "2024-04-15", auto_renew: true },
  { id: "sub-3", client_id: "cand-2", client_name: "James Wilson", client_type: "candidate", service_name: "SEO Optimization", plan: "quarterly", price: 179500, status: "active", start_date: "2024-01-20", next_billing: "2024-04-20", auto_renew: true },
  { id: "sub-4", client_id: "cand-1", client_name: "Maria Rodriguez", client_type: "candidate", service_name: "Crisis Management", plan: "monthly", price: 99500, status: "paused", start_date: "2024-02-01", next_billing: "2024-03-01", auto_renew: false },
  { id: "sub-5", client_id: "cand-2", client_name: "James Wilson", client_type: "candidate", service_name: "Email Marketing", plan: "annual", price: 299500, status: "cancelled", start_date: "2023-06-01", next_billing: "2024-06-01", auto_renew: false },
]

// Mock data for development (will be replaced with Supabase data)
const mockLeads: Lead[] = [
  { id: "1", name: "Sarah Johnson", email: "sarah@example.com", phone: "555-0101", company: "City Council Campaign", source: "Website", status: "new", created_at: "2024-01-15", updated_at: "2024-01-15" },
  { id: "2", name: "Michael Chen", email: "mchen@example.com", phone: "555-0102", company: "School Board 2024", source: "Referral", status: "contacted", created_at: "2024-01-14", updated_at: "2024-01-15" },
  { id: "3", name: "Emily Rodriguez", email: "emily.r@example.com", phone: "555-0103", source: "Social Media", status: "qualified", created_at: "2024-01-13", updated_at: "2024-01-14" },
  { id: "4", name: "David Kim", email: "dkim@example.com", phone: "555-0104", company: "Mayor Campaign", source: "Website", status: "proposal", created_at: "2024-01-12", updated_at: "2024-01-13" },
  { id: "5", name: "Lisa Thompson", email: "lisa.t@example.com", source: "Event", status: "negotiation", created_at: "2024-01-11", updated_at: "2024-01-12" },
]

const mockClients: Client[] = [
  { id: "1", candidate_id: "c1", name: "James Wilson", email: "james@wilson2024.com", phone: "555-0201", services: ["Digital Presence", "Youth Outreach"], total_revenue: 15900, status: "active", created_at: "2024-01-01" },
  { id: "2", candidate_id: "c2", name: "Maria Garcia", email: "maria@garciaforcouncil.com", phone: "555-0202", services: ["Branding", "Media Relations", "Advertising"], total_revenue: 24500, status: "active", created_at: "2023-12-15" },
  { id: "3", candidate_id: "c3", name: "Robert Lee", email: "robert@lee4mayor.com", services: ["Crisis Management", "Digital Presence"], total_revenue: 17900, status: "active", created_at: "2023-11-20" },
  { id: "4", candidate_id: "c4", name: "Jennifer Adams", email: "jen@adamscampaign.com", phone: "555-0204", services: ["Youth Outreach"], total_revenue: 5950, status: "inactive", created_at: "2023-10-01" },
]

const mockDeals: Deal[] = [
  { id: "1", title: "Wilson Campaign - Full Package", client_name: "James Wilson", value: 35000, stage: "negotiation", probability: 75, expected_close: "2024-02-15", created_at: "2024-01-10" },
  { id: "2", title: "Garcia Council - Q2 Extension", client_name: "Maria Garcia", value: 18000, stage: "proposal", probability: 50, expected_close: "2024-03-01", created_at: "2024-01-12" },
  { id: "3", title: "New Lead - Chen Campaign", client_name: "Michael Chen", lead_id: "2", value: 12000, stage: "discovery", probability: 25, expected_close: "2024-04-01", created_at: "2024-01-14" },
  { id: "4", title: "Rodriguez - Starter Package", client_name: "Emily Rodriguez", lead_id: "3", value: 8500, stage: "proposal", probability: 60, expected_close: "2024-02-28", created_at: "2024-01-13" },
]

const mockTasks: Task[] = [
  { id: "1", title: "Follow up on proposal", related_name: "James Wilson", deal_id: "1", priority: "high", status: "pending", due_date: "2024-01-20", created_at: "2024-01-15" },
  { id: "2", title: "Schedule demo call", related_name: "Michael Chen", lead_id: "2", priority: "medium", status: "pending", due_date: "2024-01-18", created_at: "2024-01-14" },
  { id: "3", title: "Send contract", related_name: "Lisa Thompson", lead_id: "5", priority: "urgent", status: "in_progress", due_date: "2024-01-16", created_at: "2024-01-12" },
  { id: "4", title: "Quarterly review meeting", related_name: "Maria Garcia", client_id: "2", priority: "medium", status: "pending", due_date: "2024-01-25", created_at: "2024-01-10" },
  { id: "5", title: "Onboarding call", related_name: "Emily Rodriguez", lead_id: "3", priority: "high", status: "completed", due_date: "2024-01-14", created_at: "2024-01-13" },
]

const OFFICIAL_FINANCE_SOURCE_URL = "http://app.toronto.ca/EFD/jsf/main/main.xhtml?campaign=19"

const OLIVIA_CHOW_2023_FINANCE = {
  candidateName: "Olivia Chow",
  election: "2023 Toronto By-Election for Mayor",
  spendingLimitCents: 161675145,
  totalContributionsCents: 161092765,
  totalIncomeCents: 161095265,
  totalExpensesCents: 156905568,
  surplusCents: 4189697,
  categories: [
    { label: "Advertising", amountCents: 52611822, mappedService: "Paid media and message distribution" },
    { label: "Brochures / Flyers", amountCents: 4528728, mappedService: "Print collateral and voter literature" },
    { label: "Signs", amountCents: 9810315, mappedService: "Sign program and street visibility" },
    { label: "Meetings Hosted", amountCents: 3176597, mappedService: "Events and stakeholder activations" },
    { label: "Office + Phone + Internet", amountCents: 14251241, mappedService: "Campaign operations infrastructure" },
    { label: "Salaries + Professional Fees", amountCents: 38748839, mappedService: "Staffing, consultants, and specialist execution" },
    { label: "Voting Day Parties / Appreciation", amountCents: 10874648, mappedService: "Election-day engagement and volunteer recognition" },
    { label: "Accounting + Audit", amountCents: 4655293, mappedService: "Compliance and financial reporting support" },
    { label: "Fundraising Event Costs", amountCents: 10451933, mappedService: "Fundraising production and event delivery" },
    { label: "Other + Bank Charges", amountCents: 7796152, mappedService: "Miscellaneous campaign operations" },
  ],
} as const

const DEFAULT_CAMPAIGN_CYCLE_MONTHS = 8

const DEMO_CAMPAIGN_ANALYSIS_ASSUMPTIONS = {
  "demo-cand-1": {
    cycleMonths: 7,
    targetedVoters: 12000,
    expectedVotes: 4100,
    profile: "Ward campaign challenger model",
  },
  "demo-cand-2": {
    cycleMonths: 8,
    targetedVoters: 18000,
    expectedVotes: 6100,
    profile: "Mayoral or city-wide issue campaign model",
  },
} as const

const FULL_CAMPAIGN_BLUEPRINTS = SHARED_FULL_CAMPAIGN_BLUEPRINTS

export default function CRMPage() {
  const [activeTab, setActiveTab] = useState("users")
  const [leads, setLeads] = useState<Lead[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [deals, setDeals] = useState<Deal[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [teamChats, setTeamChats] = useState<TeamChatChannel[]>([])
  const [clientChats, setClientChats] = useState<ClientChatThread[]>([])
  const [sharedFiles, setSharedFiles] = useState<SharedFile[]>([])
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [demoUsers, setDemoUsers] = useState<CRMDashboardUser[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [userTypeFilter, setUserTypeFilter] = useState<string>("all")
  const [showAddLead, setShowAddLead] = useState(false)
  const [showAddDeal, setShowAddDeal] = useState(false)
  const [showAddTask, setShowAddTask] = useState(false)
  const [showPipelineMath, setShowPipelineMath] = useState(false)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  

  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null)
  const [newCampaignName, setNewCampaignName] = useState("")
  const [newCampaignRegion, setNewCampaignRegion] = useState("")
  const [newCampaignBudget, setNewCampaignBudget] = useState("")
  const [newTeamChannelName, setNewTeamChannelName] = useState("")
  const [newTeamChannelTopic, setNewTeamChannelTopic] = useState("")
  const [newClientChatUserId, setNewClientChatUserId] = useState("")
  const [newClientChatSubject, setNewClientChatSubject] = useState("")
  const [newTeamMemberName, setNewTeamMemberName] = useState("")
  const [newTeamMemberEmail, setNewTeamMemberEmail] = useState("")
  const [newTeamMemberRole, setNewTeamMemberRole] = useState<TeamMember["role"]>("campaign_manager")
  const [selectedCandidateUserId, setSelectedCandidateUserId] = useState("")
  const [draggedDealId, setDraggedDealId] = useState<string | null>(null)
  const [chatDrafts, setChatDrafts] = useState<Record<string, string>>({})
  
  // Load data from shared CRM store
  useEffect(() => {
    CRMStore.initializeStore()
    loadData()
  }, [])

  const loadData = () => {
    const storeUsers = CRMStore.getUsers()
    setDemoUsers(storeUsers.filter(u => u.type !== "admin").map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      type: u.type as "candidate" | "voter" | "admin",
      status: u.status,
      created_at: u.created_at,
      subscriptions: CRMStore.getSubscriptionsByUser(u.id).map(s => s.id),
      orders: CRMStore.getOrdersByUser(u.id).map(o => o.id),
    })))

    const storeOrders = CRMStore.getOrders()
    setOrders(storeOrders.map(o => ({
      id: o.id,
      order_number: o.order_number,
      client_id: o.user_id,
      client_name: o.user_name,
      client_type: o.user_type,
      services: o.items.map(i => ({ name: i.service_name, price: i.price_cents })),
      total: o.total_cents,
      status: o.status,
      payment_status: o.payment_status,
      created_at: o.created_at,
    })))

    const storeSubs = CRMStore.getSubscriptions()
    setSubscriptions(storeSubs.map(s => ({
      id: s.id,
      client_id: s.user_id,
      client_name: s.user_name,
      client_type: s.user_type,
      service_name: s.service_name,
      plan: s.plan,
      price: s.price_cents,
      status: s.status,
      start_date: s.start_date,
      next_billing: s.next_billing,
      auto_renew: s.auto_renew,
    })))

    const storeLeads = CRMStore.getLeads()
    setLeads(storeLeads.map(l => ({
      id: l.id,
      name: l.name,
      email: l.email,
      phone: l.phone,
      company: l.company,
      source: l.source,
      status: l.status as LeadStatus,
      created_at: l.created_at,
      updated_at: l.created_at,
    })))

    const storeDeals = CRMStore.getDeals()
    setDeals(storeDeals.map(d => ({
      id: d.id,
      title: d.title,
      client_name: d.client_name,
      value: d.value_cents,
      stage: d.stage as DealStage,
      probability: d.probability,
      expected_close: d.expected_close,
      created_at: d.created_at,
    })))

    const storeTasks = CRMStore.getTasks()
    setTasks(storeTasks.map(t => ({
      id: t.id,
      title: t.title,
      description: t.description,
      related_name: t.related_to,
      priority: t.priority as TaskPriority,
      status: t.status as TaskStatus,
      due_date: t.due_date,
      created_at: t.created_at,
    })))

    setClients(storeUsers
      .filter(user => user.type !== "admin")
      .map((user) => {
        const userOrders = storeOrders.filter(order => order.user_id === user.id)
        const userSubs = storeSubs.filter(subscription => subscription.user_id === user.id)
        const userCampaigns = CRMStore.getCampaignsByUser(user.id)
        const services = Array.from(new Set([
          ...userSubs.map(subscription => subscription.service_name),
          ...userOrders.flatMap(order => order.items.map(item => item.service_name)),
          ...userCampaigns.map(campaign => campaign.name),
        ]))

        return {
          id: user.id,
          candidate_id: user.id,
          name: user.name,
          email: user.email,
          services,
          total_revenue: userOrders
            .filter(order => order.payment_status === "paid")
            .reduce((sum, order) => sum + order.total_cents, 0),
          status: user.status === "active" ? "active" : user.status === "pending" ? "inactive" : "churned",
          created_at: user.created_at,
        }
      }))

    setCampaigns(CRMStore.getCampaigns())
    setTeamMembers(CRMStore.getTeamMembers())
    setTeamChats(CRMStore.getTeamChats())
    setClientChats(CRMStore.getClientChats())
    setSharedFiles(CRMStore.getSharedFiles())
    setMeetings(CRMStore.getMeetings())

    if (!selectedCandidateUserId) {
      const firstCandidate = storeUsers.find(user => user.type === "candidate")
      if (firstCandidate) {
        setSelectedCandidateUserId(firstCandidate.id)
      }
    }
  }

  // Get stats from store
  const storeStats = CRMStore.getStats()
  const stats = {
    totalLeads: storeStats.totalLeads,
    newLeads: storeStats.newLeads,
    activeClients: storeStats.totalCandidates + storeStats.totalVoters,
    totalRevenue: storeStats.totalRevenue,
    pipelineValue: storeStats.dealPipeline,
    openDeals: storeStats.openDeals,
    pendingTasks: storeStats.pendingTasks,
    overdueTasks: storeStats.overdueTasks,
  }

  const formatCurrency = (amountCents: number) => `$${(amountCents / 100).toLocaleString()}`
  const formatPercent = (value: number) => `${value.toFixed(1)}%`

  const addButtonLabel: Record<string, string> = {
    users: "Add Campaign Account",
    orders: "Add Launch Project",
    subscriptions: "Add Monthly Retainer",
    leads: "Add Lead",
    clients: "Add Client",
    deals: "Add Deal",
    tasks: "Add Task",
    campaigns: "Add Campaign",
    teamChat: "Add Channel",
    clientChat: "Add Thread",
    teamSetup: "Invite Member",
  }

  const stageOrder: DealStage[] = ["discovery", "proposal", "negotiation", "closed_won", "closed_lost"]
  const candidateUsers = demoUsers.filter(user => user.type === "candidate")
  const selectedCandidate = candidateUsers.find(user => user.id === selectedCandidateUserId) || candidateUsers[0] || null

  const getMonthlyRetainerEquivalent = (subscription: Subscription) => {
    if (subscription.plan === "annual") return Math.round(subscription.price / 12)
    if (subscription.plan === "quarterly") return Math.round(subscription.price / 3)
    return subscription.price
  }

  const activeRetainers = subscriptions.filter(subscription => subscription.status === "active")
  const monthlyRetainerValue = activeRetainers.reduce((sum, subscription) => sum + getMonthlyRetainerEquivalent(subscription), 0)
  const launchProjectValue = orders
    .filter(order => order.status !== "cancelled" && order.payment_status !== "refunded")
    .reduce((sum, order) => sum + order.total, 0)
  const activeCampaignWorkspaces = campaigns.filter(campaign => campaign.status !== "completed").length
  const managedCampaignContractValue = monthlyRetainerValue * DEFAULT_CAMPAIGN_CYCLE_MONTHS + launchProjectValue

  const campaignAccountSnapshots = candidateUsers.map((user) => {
    const assumptions = DEMO_CAMPAIGN_ANALYSIS_ASSUMPTIONS[user.id as keyof typeof DEMO_CAMPAIGN_ANALYSIS_ASSUMPTIONS] ?? {
      cycleMonths: DEFAULT_CAMPAIGN_CYCLE_MONTHS,
      targetedVoters: 10000,
      expectedVotes: 3500,
      profile: "Campaign account model",
    }

    const userRetainers = subscriptions.filter(
      subscription => subscription.client_id === user.id && subscription.status === "active"
    )
    const userOrders = orders.filter(
      order => order.client_id === user.id && order.status !== "cancelled" && order.payment_status !== "refunded"
    )
    const userCampaigns = campaigns.filter(campaign => campaign.owner_user_id === user.id)
    const userTasks = tasks.filter(task => task.related_name === user.name)
    const userMeetings = meetings.filter(meeting => meeting.candidate_user_id === user.id)
    const userFiles = sharedFiles.filter(file => file.candidate_user_id === user.id)

    const monthlyRetainerCents = userRetainers.reduce(
      (sum, subscription) => sum + getMonthlyRetainerEquivalent(subscription),
      0
    )
    const launchProjectCents = userOrders.reduce((sum, order) => sum + order.total, 0)
    const fullCampaignValueCents = monthlyRetainerCents * assumptions.cycleMonths + launchProjectCents
    const costPerTargetedVoterCents = Math.round(fullCampaignValueCents / assumptions.targetedVoters)
    const costPerExpectedVoteCents = Math.round(fullCampaignValueCents / assumptions.expectedVotes)

    return {
      id: user.id,
      name: user.name,
      profile: assumptions.profile,
      cycleMonths: assumptions.cycleMonths,
      targetedVoters: assumptions.targetedVoters,
      expectedVotes: assumptions.expectedVotes,
      monthlyRetainerCents,
      launchProjectCents,
      fullCampaignValueCents,
      costPerTargetedVoterCents,
      costPerExpectedVoteCents,
      activeRetainers: userRetainers.length,
      activeCampaigns: userCampaigns.filter(campaign => campaign.status !== "completed").length,
      deliveryLoad: userTasks.length + userMeetings.length + userFiles.length,
    }
  })

  const benchmarkApiPath = "/api/campaign-analysis"
  const fullCampaignBlueprints = FULL_CAMPAIGN_BLUEPRINTS.map((blueprint) => {
    const fullCampaignValueCents = blueprint.monthlyCoreCents * blueprint.cycleMonths + blueprint.oneTimeLaunchCents + blueprint.addOnValueCents

    return {
      ...blueprint,
      fullCampaignValueCents,
      costPerTargetedVoterCents: Math.round(fullCampaignValueCents / blueprint.targetedVoters),
      costPerExpectedVoteCents: Math.round(fullCampaignValueCents / blueprint.expectedVotes),
    }
  })

  // Lead status colors
  const getLeadStatusColor = (status: LeadStatus) => {
    const colors: Record<LeadStatus, string> = {
      new: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      contacted: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      qualified: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
      proposal: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      negotiation: "bg-orange-500/20 text-orange-400 border-orange-500/30",
      won: "bg-green-500/20 text-green-400 border-green-500/30",
      lost: "bg-red-500/20 text-red-400 border-red-500/30",
    }
    return colors[status]
  }

  // Deal stage colors
  const getDealStageColor = (stage: DealStage) => {
    const colors: Record<DealStage, string> = {
      discovery: "bg-blue-500/20 text-blue-400",
      proposal: "bg-purple-500/20 text-purple-400",
      negotiation: "bg-orange-500/20 text-orange-400",
      closed_won: "bg-green-500/20 text-green-400",
      closed_lost: "bg-red-500/20 text-red-400",
    }
    return colors[stage]
  }

  // Task priority colors
  const getTaskPriorityColor = (priority: TaskPriority) => {
    const colors: Record<TaskPriority, string> = {
      low: "bg-gray-500/20 text-gray-400",
      medium: "bg-blue-500/20 text-blue-400",
      high: "bg-orange-500/20 text-orange-400",
      urgent: "bg-red-500/20 text-red-400",
    }
    return colors[priority]
  }

  // Order status colors
  const getOrderStatusColor = (status: Order["status"]) => {
    const colors: Record<Order["status"], string> = {
      pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      processing: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      completed: "bg-green-500/20 text-green-400 border-green-500/30",
      cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
      refunded: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    }
    return colors[status]
  }

  // Payment status colors
  const getPaymentStatusColor = (status: Order["payment_status"]) => {
    const colors: Record<Order["payment_status"], string> = {
      unpaid: "bg-red-500/20 text-red-400 border-red-500/30",
      paid: "bg-green-500/20 text-green-400 border-green-500/30",
      partial: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      refunded: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    }
    return colors[status]
  }

  // Subscription status colors
  const getSubscriptionStatusColor = (status: Subscription["status"]) => {
    const colors: Record<Subscription["status"], string> = {
      active: "bg-green-500/20 text-green-400 border-green-500/30",
      paused: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
      expired: "bg-gray-500/20 text-gray-400 border-gray-500/30",
    }
    return colors[status]
  }

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.client_name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    const matchesType = userTypeFilter === "all" || order.client_type === userTypeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  // Filter subscriptions
  const filteredSubscriptions = subscriptions.filter(sub => {
    const matchesSearch = 
      sub.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.service_name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || sub.status === statusFilter
    const matchesType = userTypeFilter === "all" || sub.client_type === userTypeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  // Filter demo users
  const filteredDemoUsers = demoUsers.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = userTypeFilter === "all" || user.type === userTypeFilter
    return matchesSearch && matchesType
  })

  // Filter leads
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Filter clients
  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || client.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch =
      campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.owner_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.target_region.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || campaign.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const filteredTeamMembers = teamMembers.filter(member => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || member.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const filteredTeamChats = teamChats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.last_message.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredClientChats = clientChats.filter(thread => {
    const matchesSearch =
      thread.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      thread.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      thread.owner_name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || thread.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const workspaceCampaigns = filteredCampaigns.filter(campaign => !selectedCandidate || campaign.owner_user_id === selectedCandidate.id)
  const workspaceTeamMembers = filteredTeamMembers.filter(member => !selectedCandidate || member.candidate_user_id === selectedCandidate.id)
  const workspaceTeamChats = filteredTeamChats.filter(chat => !selectedCandidate || chat.candidate_user_id === selectedCandidate.id)
  const workspaceFiles = sharedFiles.filter(file => !selectedCandidate || file.candidate_user_id === selectedCandidate.id)
  const workspaceMeetings = meetings.filter(meeting => !selectedCandidate || meeting.candidate_user_id === selectedCandidate.id)
  const activeTabExplainers: Record<string, { title: string; description: string }> = {
    users: { title: "Campaign Accounts", description: "Signed clients. This is the top-level race account that owns retainers, launch work, election programs, and team delivery." },
    orders: { title: "Launch Projects", description: "One-time implementation work such as websites, donation setup, brand assets, and special production. These are not recurring subscriptions." },
    subscriptions: { title: "Monthly Retainers", description: "Recurring service lines such as strategy, ads, voter management, polling, volunteer operations, and reporting." },
    leads: { title: "Leads", description: "Prospects that have not yet become paying campaign accounts." },
    clients: { title: "Client Directory", description: "Roll-up view of each account’s active retainers, launch work, election programs, and revenue collected so far." },
    deals: { title: "Deals", description: "Proposed campaign contracts before they become active accounts. Closed-won deals should line up with a real campaign account." },
    tasks: { title: "Tasks", description: "Gap analysis, approvals, and delivery work assigned inside a campaign account after onboarding." },
    campaigns: { title: "Election Programs", description: "Execution workstreams inside a campaign account, such as donor growth, ward persuasion, field ops, or youth outreach." },
    teamChat: { title: "Team Chat", description: "Internal delivery communication for campaign staff and service operators." },
    clientChat: { title: "Client Chat", description: "Candidate-facing communication threads about approvals, updates, and next steps." },
    teamSetup: { title: "Team Setup", description: "Multi-user staffing for each campaign account." },
  }

  const syncLeadStatus = (clientName: string, status: LeadStatus) => {
    const lead = leads.find(item => item.name === clientName)
    if (!lead) return
    CRMStore.updateLeadStatus(lead.id, status)
    setLeads(currentLeads => currentLeads.map(item => item.id === lead.id ? { ...item, status, updated_at: new Date().toISOString() } : item))
  }

  const syncClientStatus = (clientName: string, status: Client["status"]) => {
    const existingClient = clients.find(item => item.name === clientName)
    if (existingClient) {
      setClients(currentClients => currentClients.map(item => item.name === clientName ? { ...item, status } : item))
      return
    }

    const matchingLead = leads.find(item => item.name === clientName)
    if (status === "active" && matchingLead) {
      setClients(currentClients => [
        ...currentClients,
        {
          id: `c${currentClients.length + 1}`,
          candidate_id: matchingLead.id,
          name: matchingLead.name,
          email: matchingLead.email,
          phone: matchingLead.phone,
          services: [],
          total_revenue: 0,
          status: "active",
          created_at: new Date().toISOString(),
        },
      ])
    }
  }

  // Update lead status - persists to store
  const updateLeadStatus = (leadId: string, newStatus: LeadStatus) => {
    CRMStore.updateLeadStatus(leadId, newStatus)
    setLeads(leads.map(l => l.id === leadId ? { ...l, status: newStatus, updated_at: new Date().toISOString() } : l))
  }

  // Update order status - persists to store
  const handleUpdateOrderStatus = (orderId: string, status: Order["status"], paymentStatus?: Order["payment_status"]) => {
    CRMStore.updateOrderStatus(orderId, status, paymentStatus)
    setOrders(orders.map(o => 
      o.id === orderId 
        ? { ...o, status, ...(paymentStatus && { payment_status: paymentStatus }) }
        : o
    ))
  }

  // Update subscription status - persists to store
  const handleUpdateSubscriptionStatus = (subId: string, status: Subscription["status"]) => {
    CRMStore.updateSubscriptionStatus(subId, status)
    setSubscriptions(subscriptions.map(s => s.id === subId ? { ...s, status } : s))
  }

  // Update task status - persists to store
  const handleUpdateTaskStatus = (taskId: string, status: TaskStatus) => {
    CRMStore.updateTaskStatus(taskId, status)
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status } : t))
  }

  // Update deal stage - persists to store
  const handleUpdateDealStage = (dealId: string, stage: DealStage) => {
    CRMStore.updateDealStage(dealId, stage)
    const changedDeal = deals.find(deal => deal.id === dealId)
    setDeals(deals.map(d => d.id === dealId ? { ...d, stage } : d))
    setSelectedDeal(current => current?.id === dealId ? { ...current, stage } : current)

    if (!changedDeal) return

    if (stage === "closed_won") {
      syncLeadStatus(changedDeal.client_name, "won")
      syncClientStatus(changedDeal.client_name, "active")
    }

    if (stage === "closed_lost") {
      syncLeadStatus(changedDeal.client_name, "lost")
      syncClientStatus(changedDeal.client_name, "churned")
    }
  }

  // Convert lead to client
  const convertToClient = (lead: Lead) => {
    const newClient: Client = {
      id: `c${clients.length + 1}`,
      candidate_id: `cand${clients.length + 1}`,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      services: [],
      total_revenue: 0,
      status: "active",
      created_at: new Date().toISOString(),
    }
    setClients([...clients, newClient])
    updateLeadStatus(lead.id, "won")
  }

  // Reset all data to initial demo state
  const handleResetData = () => {
    CRMStore.resetStore()
    loadData()
  }

  const handleCreateCampaign = () => {
    if (!newCampaignName.trim() || !newCampaignRegion.trim() || !selectedCandidate) return
    CRMStore.createCampaign({
      owner_user_id: selectedCandidate.id,
      name: newCampaignName.trim(),
      owner_name: selectedCandidate.name,
      status: "planning",
      budget_cents: Math.max(0, Number(newCampaignBudget || 0)) * 100,
      target_region: newCampaignRegion.trim(),
      launch_date: new Date().toISOString().split("T")[0],
      goals: ["Messaging", "Volunteer recruitment", "Fundraising"],
    })
    setNewCampaignName("")
    setNewCampaignRegion("")
    setNewCampaignBudget("")
    loadData()
  }

  const handleCreateTeamChat = () => {
    if (!newTeamChannelName.trim() || !selectedCandidate) return
    CRMStore.createTeamChat({
      candidate_user_id: selectedCandidate.id,
      candidate_name: selectedCandidate.name,
      name: newTeamChannelName.trim(),
      topic: newTeamChannelTopic.trim() || "General coordination",
      member_ids: workspaceTeamMembers.filter(member => member.status === "active").map(member => member.id),
      last_message: "Channel created and ready for updates.",
      unread_count: 0,
    })
    setNewTeamChannelName("")
    setNewTeamChannelTopic("")
    loadData()
  }

  const handlePostTeamChatMessage = (chatId: string) => {
    const draft = chatDrafts[chatId]?.trim() || "New internal update posted."
    CRMStore.postTeamChatMessage(chatId, draft)
    setChatDrafts(prev => ({ ...prev, [chatId]: "" }))
    loadData()
  }

  const handleCreateClientChat = () => {
    const user = demoUsers.find(candidate => candidate.id === newClientChatUserId)
    if (!user || !newClientChatSubject.trim()) return
    CRMStore.createClientChat({
      client_id: user.id,
      client_name: user.name,
      owner_name: teamMembers.find(member => member.status === "active")?.name || "Campaign Team",
      subject: newClientChatSubject.trim(),
      priority: user.type === "candidate" ? "high" : "medium",
      status: "open",
      last_message: "Conversation opened from CRM dashboard.",
    })
    setNewClientChatUserId("")
    setNewClientChatSubject("")
    loadData()
  }

  const handlePostClientChatMessage = (threadId: string) => {
    const draft = chatDrafts[threadId]?.trim() || "Status update sent to client."
    CRMStore.postClientChatMessage(threadId, draft)
    setChatDrafts(prev => ({ ...prev, [threadId]: "" }))
    loadData()
  }

  const handleInviteTeamMember = () => {
    if (!newTeamMemberName.trim() || !newTeamMemberEmail.trim() || !selectedCandidate) return
    CRMStore.createTeamMember({
      candidate_user_id: selectedCandidate.id,
      candidate_name: selectedCandidate.name,
      name: newTeamMemberName.trim(),
      email: newTeamMemberEmail.trim(),
      role: newTeamMemberRole,
      status: "invited",
      portal_access: true,
      permissions: ["chat", "campaigns", "files"],
    })
    setNewTeamMemberName("")
    setNewTeamMemberEmail("")
    setNewTeamMemberRole("campaign_manager")
    loadData()
  }

  const handleAddSharedFile = () => {
    if (!selectedCandidate) return
    CRMStore.createSharedFile({
      candidate_user_id: selectedCandidate.id,
      candidate_name: selectedCandidate.name,
      name: `${selectedCandidate.name.split(" ")[0]}-Strategy-Doc-${workspaceFiles.length + 1}.pdf`,
      category: "brief",
      uploaded_by: workspaceTeamMembers[0]?.name || selectedCandidate.name,
      role_visibility: ["campaign_manager", "field_director", "designer", "analyst"],
      size_label: "1.2 MB",
    })
    loadData()
  }

  const handleScheduleMeeting = () => {
    if (!selectedCandidate) return
    CRMStore.createMeeting({
      candidate_user_id: selectedCandidate.id,
      candidate_name: selectedCandidate.name,
      title: `${selectedCandidate.name.split(" ")[0]} Team Sync`,
      meeting_type: "strategy",
      starts_at: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
      duration_minutes: 30,
      attendees: workspaceTeamMembers.slice(0, 3).map(member => member.name),
      status: "scheduled",
      notes: "Weekly operations review and approvals.",
    })
    loadData()
  }

  const handlePreviewCandidateWorkspace = () => {
    if (!selectedCandidate) return
    CRMStore.clearWorkspaceMemberSession()
    localStorage.setItem("tnm-demo-mode", "true")
    localStorage.setItem("tnm-demo-user", JSON.stringify({
      id: selectedCandidate.id,
      email: selectedCandidate.email,
      full_name: selectedCandidate.name,
      user_type: "candidate",
      is_verified: true,
      province: "Ontario",
      municipality: "Toronto",
      created_at: selectedCandidate.created_at,
    }))
    window.open("/candidate-portal/workspace", "_blank")
  }

  const handlePreviewMemberWorkspace = (member: TeamMember) => {
    CRMStore.setWorkspaceMemberSession({
      candidate_user_id: member.candidate_user_id,
      member_id: member.id,
    })
    localStorage.setItem("tnm-demo-mode", "true")
    localStorage.setItem("tnm-demo-user", JSON.stringify({
      id: member.candidate_user_id,
      email: member.email,
      full_name: member.name,
      user_type: "candidate_team_member",
      is_verified: true,
      province: "Ontario",
      municipality: "Toronto",
      created_at: member.joined_at,
    }))
    window.open("/candidate-portal/workspace", "_blank")
  }

  const handleQuickAdd = () => {
    const firstUser = CRMStore.getUsers().find(
      (user): user is CRMStore.DemoUser & { type: "candidate" | "voter" } => user.type !== "admin",
    )

    if (activeTab === "orders" && firstUser) {
      CRMStore.createOrder({
        user_id: firstUser.id,
        user_name: firstUser.name,
        user_type: firstUser.type,
        items: [{ service_id: "quick-add", service_name: "CRM Quick Order", price_cents: 19900 }],
        total_cents: 19900,
        status: "pending",
        payment_status: "unpaid",
      })
      loadData()
      return
    }

    if (activeTab === "subscriptions" && firstUser) {
      CRMStore.createSubscription({
        user_id: firstUser.id,
        user_name: firstUser.name,
        user_type: firstUser.type,
        service_id: "quick-sub",
        service_name: "CRM Retainer",
        plan: "monthly",
        price_cents: 49500,
        status: "active",
        auto_renew: true,
      })
      loadData()
      return
    }

    if (activeTab === "leads") {
      CRMStore.createLead({
        name: `New Lead ${leads.length + 1}`,
        email: `lead${leads.length + 1}@example.com`,
        phone: "555-0199",
        company: "Municipal Campaign",
        source: "Dashboard",
        status: "new",
      })
      loadData()
      return
    }

    if (activeTab === "deals") {
      CRMStore.createDeal({
        title: `New Deal ${deals.length + 1}`,
        client_name: leads[0]?.name || clients[0]?.name || "New Client",
        value_cents: 250000,
        stage: "discovery",
        probability: 30,
        expected_close: new Date().toISOString().split("T")[0],
      })
      loadData()
      return
    }

    if (activeTab === "tasks") {
      CRMStore.createTask({
        title: `Follow-up task ${tasks.length + 1}`,
        description: "Created from CRM dashboard quick add",
        related_to: leads[0]?.name || clients[0]?.name || "Campaign team",
        priority: "medium",
        status: "pending",
        due_date: new Date().toISOString().split("T")[0],
      })
      loadData()
      return
    }

    if (activeTab === "campaigns") {
      handleCreateCampaign()
      return
    }

    if (activeTab === "teamChat") {
      handleCreateTeamChat()
      return
    }

    if (activeTab === "clientChat") {
      handleCreateClientChat()
      return
    }

    if (activeTab === "teamSetup" || activeTab === "users") {
      handleInviteTeamMember()
    }
  }

  // Group deals by stage for pipeline
  const dealsByStage: Record<DealStage, Deal[]> = {
    discovery: deals.filter(d => d.stage === "discovery"),
    proposal: deals.filter(d => d.stage === "proposal"),
    negotiation: deals.filter(d => d.stage === "negotiation"),
    closed_won: deals.filter(d => d.stage === "closed_won"),
    closed_lost: deals.filter(d => d.stage === "closed_lost"),
  }

  const pipelineCoverageOfOliviaSpend = stats.pipelineValue / OLIVIA_CHOW_2023_FINANCE.totalExpensesCents
  const oliviaBudgetUsage = OLIVIA_CHOW_2023_FINANCE.totalExpensesCents / OLIVIA_CHOW_2023_FINANCE.spendingLimitCents
  const oliviaLargestCategory = [...OLIVIA_CHOW_2023_FINANCE.categories].sort((left, right) => right.amountCents - left.amountCents)[0]

  const selectedDealLead = selectedDeal
    ? leads.find(lead => lead.id === selectedDeal.lead_id || lead.name === selectedDeal.client_name)
    : null
  const selectedDealClient = selectedDeal
    ? clients.find(client => client.id === selectedDeal.client_id || client.name === selectedDeal.client_name)
    : null
  const selectedDealTasks = selectedDeal
    ? tasks.filter(task => task.deal_id === selectedDeal.id || task.related_name === selectedDeal.client_name)
    : []

  const moveDealRelative = (dealId: string, direction: -1 | 1) => {
    const deal = deals.find(item => item.id === dealId)
    if (!deal) return
    const currentIndex = stageOrder.indexOf(deal.stage)
    const nextStage = stageOrder[currentIndex + direction]
    if (!nextStage) return
    handleUpdateDealStage(dealId, nextStage)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-foreground">CRM Dashboard</h1>
                <p className="text-sm text-muted-foreground">Run campaign accounts from first lead through election-day delivery</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={loadData}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button 
                variant="outline" 
                className="border-red-500/30 text-red-500 hover:bg-red-500/10"
                onClick={handleResetData}
              >
                Reset Demo
              </Button>
              <Button className="bg-white text-black hover:bg-white/90" onClick={handleQuickAdd}>
                <Plus className="w-4 h-4 mr-2" />
                {addButtonLabel[activeTab] || "Add New"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          <Card className="bg-muted/50 border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <UserPlus className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats.totalLeads}</p>
                  <p className="text-xs text-white/60">Total Leads</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-muted/50 border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/20">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats.newLeads}</p>
                  <p className="text-xs text-white/60">New This Week</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-muted/50 border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/20">
                  <Users className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats.activeClients}</p>
                  <p className="text-xs text-white/60">Active CRM Accounts</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-muted/50 border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/20">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{formatCurrency(stats.totalRevenue)}</p>
                  <p className="text-xs text-white/60">Collected CRM Revenue</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-muted/50 border-border cursor-pointer hover:bg-white/[0.07] transition-colors" onClick={() => setShowPipelineMath(true)}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/20">
                  <Handshake className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{formatCurrency(stats.pipelineValue)}</p>
                  <p className="text-xs text-white/60">Open Deal Pipeline</p>
                  <p className="text-[11px] text-white/40 mt-1">Click for formula</p>
                </div>
                <CircleHelp className="w-4 h-4 text-white/35 ml-auto" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-muted/50 border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-cyan-500/20">
                  <CheckSquare className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats.pendingTasks}</p>
                  <p className="text-xs text-white/60">Pending Tasks</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-muted/50 border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-500/20">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats.overdueTasks}</p>
                  <p className="text-xs text-white/60">Overdue</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-muted/50 border-border mb-8">
          <CardHeader>
            <CardTitle className="text-white text-lg">How This CRM Actually Works</CardTitle>
            <CardDescription className="text-white/60">
              The tabs are not separate products. They are one campaign account broken into sales, delivery, finance, and team operations.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <div className="rounded-lg border border-border bg-background p-4">
              <p className="text-white text-sm font-medium">1. Lead To Deal</p>
              <p className="text-white/70 text-sm mt-2">
                Leads and deals qualify the race, budget, timeline, and win conditions before a campaign account is activated.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-background p-4">
              <p className="text-white text-sm font-medium">2. Monthly Retainers</p>
              <p className="text-white/70 text-sm mt-2">
                {formatCurrency(monthlyRetainerValue)} in active monthly-equivalent service lines covers recurring work like strategy, ads, content, voter data, polling, field support, and reporting.
              </p>
              <p className="text-white/50 text-xs mt-2">This is the recurring subscription layer of the campaign contract.</p>
            </div>
            <div className="rounded-lg border border-border bg-background p-4">
              <p className="text-white text-sm font-medium">3. Launch Projects</p>
              <p className="text-white/70 text-sm mt-2">
                {formatCurrency(launchProjectValue)} in one-time work covers websites, setup, creative production, crisis work, and campaign launches.
              </p>
              <p className="text-white/50 text-xs mt-2">This is the one-time implementation layer, separate from monthly retainers.</p>
            </div>
            <div className="rounded-lg border border-border bg-background p-4">
              <p className="text-white text-sm font-medium">4. Delivery Workspace</p>
              <p className="text-white/70 text-sm mt-2">
                Election programs, tasks, chat, files, meetings, and team setup are the operating layer used after the client signs.
              </p>
              <p className="text-white/50 text-xs mt-2">Active workspaces: {activeCampaignWorkspaces}</p>
            </div>
            <div className="rounded-lg border border-border bg-background p-4">
              <p className="text-white text-sm font-medium">5. Full Campaign Value</p>
              <p className="text-white/70 text-sm mt-2">
                {formatCurrency(managedCampaignContractValue)} = monthly retainers x {DEFAULT_CAMPAIGN_CYCLE_MONTHS} campaign months + one-time launch projects.
              </p>
              <p className="text-white/50 text-xs mt-2">This is the contract value you pitch and manage, not just subscription revenue.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-muted/50 border-border mb-8">
          <CardHeader>
            <CardTitle className="text-white text-lg">How CRM Forecast Math Works</CardTitle>
            <CardDescription className="text-white/60">
              This section is sales pipeline math for campaign service work, not official election filing data.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-border bg-background p-4">
              <p className="text-white text-sm font-medium">Pipeline Value</p>
              <p className="text-white/70 text-sm mt-2">
                {formatCurrency(stats.pipelineValue)} = all open deals added together across discovery, proposal, and negotiation.
              </p>
              <p className="text-white/50 text-xs mt-2">Current open deals: {stats.openDeals}</p>
            </div>
            <div className="rounded-lg border border-border bg-background p-4">
              <p className="text-white text-sm font-medium">Collected CRM Revenue</p>
              <p className="text-white/70 text-sm mt-2">
                {formatCurrency(stats.totalRevenue)} = paid orders only. Quotes and open deals are excluded until they convert.
              </p>
              <p className="text-white/50 text-xs mt-2">This is CRM revenue, not regulated campaign spending.</p>
            </div>
            <div className="rounded-lg border border-border bg-background p-4">
              <p className="text-white text-sm font-medium">Benchmarks And Analysis</p>
              <p className="text-white/70 text-sm mt-2">
                Official filing data stays separate from CRM service operations. Olivia Chow is loaded here as a real benchmark, while the campaign accounts below are operational models for onboarding and delivery planning.
              </p>
              <p className="text-white/50 text-xs mt-2">API endpoint: {benchmarkApiPath}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-muted/50 border-border mb-8">
          <CardHeader>
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <CardTitle className="text-white text-lg">Campaign Benchmarks And Finance Reference</CardTitle>
                <CardDescription className="text-white/60">
                  Use one official filing benchmark plus managed campaign account models to price, onboard, and operate a full election client.
                </CardDescription>
              </div>
              <a href={OFFICIAL_FINANCE_SOURCE_URL} target="_blank" rel="noreferrer" className="text-sm text-amber-300 hover:text-amber-200 underline underline-offset-4">
                Open official City of Toronto disclosure
              </a>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-5">
              <div className="rounded-lg border border-border bg-background p-4">
                <p className="text-white/60 text-xs">Candidate</p>
                <p className="text-white font-semibold mt-1">{OLIVIA_CHOW_2023_FINANCE.candidateName}</p>
                <p className="text-white/40 text-xs mt-1">{OLIVIA_CHOW_2023_FINANCE.election}</p>
              </div>
              <div className="rounded-lg border border-border bg-background p-4">
                <p className="text-white/60 text-xs">Spending Limit</p>
                <p className="text-white font-semibold mt-1">{formatCurrency(OLIVIA_CHOW_2023_FINANCE.spendingLimitCents)}</p>
              </div>
              <div className="rounded-lg border border-border bg-background p-4">
                <p className="text-white/60 text-xs">Official Contributions</p>
                <p className="text-white font-semibold mt-1">{formatCurrency(OLIVIA_CHOW_2023_FINANCE.totalContributionsCents)}</p>
              </div>
              <div className="rounded-lg border border-border bg-background p-4">
                <p className="text-white/60 text-xs">Official Expenses</p>
                <p className="text-white font-semibold mt-1">{formatCurrency(OLIVIA_CHOW_2023_FINANCE.totalExpensesCents)}</p>
              </div>
              <div className="rounded-lg border border-border bg-background p-4">
                <p className="text-white/60 text-xs">Filed Surplus</p>
                <p className="text-white font-semibold mt-1">{formatCurrency(OLIVIA_CHOW_2023_FINANCE.surplusCents)}</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border border-border bg-background p-4">
                <p className="text-white text-sm font-medium">Budget Usage</p>
                <p className="text-white/70 text-sm mt-2">
                  {formatCurrency(OLIVIA_CHOW_2023_FINANCE.totalExpensesCents)} spent against a {formatCurrency(OLIVIA_CHOW_2023_FINANCE.spendingLimitCents)} limit.
                </p>
                <p className="text-amber-300 text-xs mt-2">{formatPercent(oliviaBudgetUsage * 100)} of official spending limit used.</p>
              </div>
              <div className="rounded-lg border border-border bg-background p-4">
                <p className="text-white text-sm font-medium">Largest Filed Cost Bucket</p>
                <p className="text-white/70 text-sm mt-2">{oliviaLargestCategory.label}</p>
                <p className="text-amber-300 text-xs mt-2">{formatCurrency(oliviaLargestCategory.amountCents)} mapped to {oliviaLargestCategory.mappedService}.</p>
              </div>
              <div className="rounded-lg border border-border bg-background p-4">
                <p className="text-white text-sm font-medium">Compare To Our Current CRM</p>
                <p className="text-white/70 text-sm mt-2">Current open deal pipeline: {formatCurrency(stats.pipelineValue)}</p>
                <p className="text-amber-300 text-xs mt-2">That is {formatPercent(pipelineCoverageOfOliviaSpend * 100)} of Olivia Chow's filed 2023 campaign expenses.</p>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-background p-4">
              <div className="flex items-center gap-2 mb-4">
                <Scale className="w-4 h-4 text-amber-300" />
                <p className="text-white font-medium">Modeled Filing Categories To Service Buckets</p>
              </div>
              <div className="space-y-3">
                {OLIVIA_CHOW_2023_FINANCE.categories.map((category) => (
                  <div key={category.label} className="flex items-start justify-between gap-4 border-b border-white/5 pb-3 last:border-b-0 last:pb-0">
                    <div>
                      <p className="text-white text-sm font-medium">{category.label}</p>
                      <p className="text-white/50 text-xs mt-1">Mapped here as: {category.mappedService}</p>
                    </div>
                    <p className="text-white font-medium whitespace-nowrap">{formatCurrency(category.amountCents)}</p>
                  </div>
                ))}
              </div>
              <p className="text-white/50 text-xs mt-4">
                This official filing data provides category totals, not a full vendor-by-vendor service ledger. We can model service buckets from the filing, but exact vendor contracts and internal invoices are not exposed in this public search result.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-background p-4">
              <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
                <div>
                  <p className="text-white font-medium">Managed Campaign Account Models</p>
                  <p className="text-white/50 text-xs mt-1">
                    These are the service-side campaign accounts your team actually manages after onboarding. Cost-per-voter values below are modeled from demo targeting assumptions, not official election returns.
                  </p>
                </div>
                <p className="text-white/50 text-xs font-mono">GET {benchmarkApiPath}</p>
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                {campaignAccountSnapshots.map((snapshot) => (
                  <div key={snapshot.id} className="rounded-lg border border-white/10 bg-muted/30 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-white font-semibold">{snapshot.name}</p>
                        <p className="text-white/50 text-xs mt-1">{snapshot.profile}</p>
                      </div>
                      <Badge variant="outline" className="border-white/20 text-white">
                        {snapshot.cycleMonths}-month cycle
                      </Badge>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2 mt-4">
                      <div>
                        <p className="text-white/50 text-xs">Monthly retainer value</p>
                        <p className="text-white font-medium mt-1">{formatCurrency(snapshot.monthlyRetainerCents)}</p>
                      </div>
                      <div>
                        <p className="text-white/50 text-xs">Launch project value</p>
                        <p className="text-white font-medium mt-1">{formatCurrency(snapshot.launchProjectCents)}</p>
                      </div>
                      <div>
                        <p className="text-white/50 text-xs">Full campaign contract</p>
                        <p className="text-amber-300 font-medium mt-1">{formatCurrency(snapshot.fullCampaignValueCents)}</p>
                      </div>
                      <div>
                        <p className="text-white/50 text-xs">Delivery load</p>
                        <p className="text-white font-medium mt-1">{snapshot.deliveryLoad} active work items</p>
                      </div>
                      <div>
                        <p className="text-white/50 text-xs">Modeled cost per targeted voter</p>
                        <p className="text-white font-medium mt-1">{formatCurrency(snapshot.costPerTargetedVoterCents)}</p>
                      </div>
                      <div>
                        <p className="text-white/50 text-xs">Modeled cost per expected vote</p>
                        <p className="text-white font-medium mt-1">{formatCurrency(snapshot.costPerExpectedVoteCents)}</p>
                      </div>
                    </div>
                    <p className="text-white/50 text-xs mt-4">
                      {snapshot.activeRetainers} retainers, {snapshot.activeCampaigns} active campaign workspace(s), target universe {snapshot.targetedVoters.toLocaleString()} voters.
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-border bg-background p-4">
              <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
                <div>
                  <p className="text-white font-medium">Full Campaign Package Archetypes</p>
                  <p className="text-white/50 text-xs mt-1">
                    This is the full business logic layer: one top-tier mayor, one lean mayor, one top-tier councillor, and one lean councillor. Each profile shows the entire race package, not just one campaign activity.
                  </p>
                </div>
                <p className="text-white/50 text-xs font-mono">4 full demo profiles</p>
              </div>
              <div className="grid gap-4 xl:grid-cols-2">
                {fullCampaignBlueprints.map((blueprint) => (
                  <div key={blueprint.id} className="rounded-lg border border-white/10 bg-muted/30 p-4 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-white font-semibold">{blueprint.label}: {blueprint.candidateName}</p>
                        <p className="text-white/50 text-xs mt-1">{blueprint.election} • {blueprint.benchmarkType}</p>
                      </div>
                      <Badge variant="outline" className="border-white/20 text-white">
                        {blueprint.cycleMonths}-month full cycle
                      </Badge>
                    </div>
                    <div className="grid gap-3 md:grid-cols-3">
                      <div className="rounded-md border border-white/10 p-3">
                        <p className="text-white/50 text-xs">Monthly core retainer</p>
                        <p className="text-white mt-1 font-medium">{formatCurrency(blueprint.monthlyCoreCents)}</p>
                      </div>
                      <div className="rounded-md border border-white/10 p-3">
                        <p className="text-white/50 text-xs">One-time launch</p>
                        <p className="text-white mt-1 font-medium">{formatCurrency(blueprint.oneTimeLaunchCents)}</p>
                      </div>
                      <div className="rounded-md border border-white/10 p-3">
                        <p className="text-white/50 text-xs">Full campaign package</p>
                        <p className="text-amber-300 mt-1 font-medium">{formatCurrency(blueprint.fullCampaignValueCents)}</p>
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <p className="text-white text-sm font-medium">Must-Have Services</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {blueprint.mustHaveServices.map((service) => (
                            <Badge key={service} variant="outline" className="border-green-500/30 text-green-300 bg-green-500/10">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">Recommended Services</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {blueprint.recommendedServices.map((service) => (
                            <Badge key={service} variant="outline" className="border-blue-500/30 text-blue-300 bg-blue-500/10">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <p className="text-white text-sm font-medium">Gap Analysis</p>
                        <div className="space-y-2 mt-2">
                          {blueprint.gapAnalysis.map((gap) => (
                            <div key={gap.area} className="rounded-md border border-white/10 p-3">
                              <p className="text-white text-sm">{gap.area}</p>
                              <p className="text-white/60 text-xs mt-1">{gap.gap}</p>
                              <p className="text-amber-300 text-xs mt-2">Recommended add-on: {gap.subscription}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">Efficiency Model</p>
                        <div className="rounded-md border border-white/10 p-3 mt-2 space-y-2">
                          <p className="text-white/60 text-xs">Target voter universe: {blueprint.targetedVoters.toLocaleString()}</p>
                          <p className="text-white/60 text-xs">Expected votes: {blueprint.expectedVotes.toLocaleString()}</p>
                          <p className="text-white text-sm">Modeled cost per targeted voter: {formatCurrency(blueprint.costPerTargetedVoterCents)}</p>
                          <p className="text-white text-sm">Modeled cost per expected vote: {formatCurrency(blueprint.costPerExpectedVoteCents)}</p>
                          <p className="text-white/50 text-xs">Add-on subscription value available: {formatCurrency(blueprint.addOnValueCents)}</p>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {blueprint.addOnSubscriptions.map((subscription) => (
                            <Badge key={subscription} variant="outline" className="border-amber-500/30 text-amber-300 bg-amber-500/10">
                              {subscription}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-border bg-background p-4">
              <p className="text-white font-medium">Onboarding API Shape</p>
              <p className="text-white/60 text-sm mt-2">
                New prospects should be analyzed against a full-campaign contract model: monthly retainers, one-time setup, campaign length, target voter universe, expected vote goal, and benchmark comparison against official filing data.
              </p>
              <div className="grid gap-3 md:grid-cols-3 mt-4 text-sm">
                <div className="rounded-md border border-white/10 p-3">
                  <p className="text-white/50 text-xs">Input</p>
                  <p className="text-white mt-1">Race type, geography, voter universe, timeline, delivery scope</p>
                </div>
                <div className="rounded-md border border-white/10 p-3">
                  <p className="text-white/50 text-xs">Output</p>
                  <p className="text-white mt-1">Monthly retainer, launch fees, total contract, modeled cost per voter, benchmark variance</p>
                </div>
                <div className="rounded-md border border-white/10 p-3">
                  <p className="text-white/50 text-xs">Efficiency Goal</p>
                  <p className="text-white mt-1">Standardize proposals, staffing load, and expected ROI before the client signs</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <Card className="bg-muted/50 border-border">
            <CardContent className="p-4 flex items-start justify-between gap-4 flex-wrap">
              <div>
                <p className="text-white font-medium">{activeTabExplainers[activeTab]?.title}</p>
                <p className="text-white/60 text-sm mt-1">{activeTabExplainers[activeTab]?.description}</p>
              </div>
              <p className="text-white/40 text-xs">CRM model: leads {">"} deals {">"} campaign account {">"} retainers + launch work {">"} election programs + team delivery</p>
            </CardContent>
          </Card>
          <div className="flex items-center justify-between">
            <TabsList className="bg-muted/50 border border-border">
              <TabsTrigger value="users" className="data-[state=active]:bg-white data-[state=active]:text-black">
                <Users className="w-4 h-4 mr-2" />
                Campaign Accounts
              </TabsTrigger>
              <TabsTrigger value="orders" className="data-[state=active]:bg-white data-[state=active]:text-black">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Launch Projects
              </TabsTrigger>
              <TabsTrigger value="subscriptions" className="data-[state=active]:bg-white data-[state=active]:text-black">
                <RefreshCw className="w-4 h-4 mr-2" />
                Monthly Retainers
              </TabsTrigger>
              <TabsTrigger value="leads" className="data-[state=active]:bg-white data-[state=active]:text-black">
                <UserPlus className="w-4 h-4 mr-2" />
                Leads
              </TabsTrigger>
              <TabsTrigger value="clients" className="data-[state=active]:bg-white data-[state=active]:text-black">
                <Building2 className="w-4 h-4 mr-2" />
                Clients
              </TabsTrigger>
              <TabsTrigger value="deals" className="data-[state=active]:bg-white data-[state=active]:text-black">
                <Handshake className="w-4 h-4 mr-2" />
                Deals
              </TabsTrigger>
              <TabsTrigger value="tasks" className="data-[state=active]:bg-white data-[state=active]:text-black">
                <CheckSquare className="w-4 h-4 mr-2" />
                Tasks
              </TabsTrigger>
              <TabsTrigger value="campaigns" className="data-[state=active]:bg-white data-[state=active]:text-black">
                <TrendingUp className="w-4 h-4 mr-2" />
                Election Programs
              </TabsTrigger>
              <TabsTrigger value="teamChat" className="data-[state=active]:bg-white data-[state=active]:text-black">
                <MessageSquare className="w-4 h-4 mr-2" />
                Team Chat
              </TabsTrigger>
              <TabsTrigger value="clientChat" className="data-[state=active]:bg-white data-[state=active]:text-black">
                <Mail className="w-4 h-4 mr-2" />
                Client Chat
              </TabsTrigger>
              <TabsTrigger value="teamSetup" className="data-[state=active]:bg-white data-[state=active]:text-black">
                <UserCheck className="w-4 h-4 mr-2" />
                Team Setup
              </TabsTrigger>
            </TabsList>

            {/* Search and Filters */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-64 bg-muted/50 border-border text-white placeholder:text-white/40"
                />
              </div>
              {activeTab === "leads" && (
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40 bg-muted/50 border-border text-white">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="qualified">Qualified</SelectItem>
                    <SelectItem value="proposal">Proposal</SelectItem>
                    <SelectItem value="negotiation">Negotiation</SelectItem>
                    <SelectItem value="won">Won</SelectItem>
                    <SelectItem value="lost">Lost</SelectItem>
                  </SelectContent>
                </Select>
              )}
              {activeTab === "campaigns" && (
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40 bg-muted/50 border-border text-white">
                    <SelectValue placeholder="Campaign Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="planning">Planning</SelectItem>
                    <SelectItem value="launching">Launching</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              )}
              {activeTab === "clientChat" && (
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40 bg-muted/50 border-border text-white">
                    <SelectValue placeholder="Thread Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="waiting">Waiting</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              )}
              {activeTab === "teamSetup" && (
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40 bg-muted/50 border-border text-white">
                    <SelectValue placeholder="Member Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="invited">Invited</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              )}
              {(["campaigns", "teamChat", "teamSetup"].includes(activeTab)) && selectedCandidate && (
                <Select value={selectedCandidateUserId} onValueChange={setSelectedCandidateUserId}>
                  <SelectTrigger className="w-52 bg-muted/50 border-border text-white">
                    <SelectValue placeholder="Candidate Workspace" />
                  </SelectTrigger>
                  <SelectContent>
                    {candidateUsers.map((candidate) => (
                      <SelectItem key={candidate.id} value={candidate.id}>{candidate.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          {/* Users Tab - Demo Candidates & Voters */}
          <TabsContent value="users" className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <Select value={userTypeFilter} onValueChange={setUserTypeFilter}>
                <SelectTrigger className="w-40 bg-muted/50 border-border text-white">
                  <SelectValue placeholder="User Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="candidate">Candidates</SelectItem>
                  <SelectItem value="voter">Voters</SelectItem>
                  <SelectItem value="admin">Admins</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredDemoUsers.map((user) => (
                <Card key={user.id} className="bg-muted/50 border-border hover:bg-white/10 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className={`text-white text-sm ${user.type === "candidate" ? "bg-gradient-to-br from-blue-500 to-cyan-600" : user.type === "voter" ? "bg-gradient-to-br from-green-500 to-emerald-600" : "bg-gradient-to-br from-amber-500 to-orange-600"}`}>
                            {user.name.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-white">{user.name}</p>
                          <p className="text-xs text-white/50">{user.email}</p>
                        </div>
                      </div>
                      <Badge className={user.type === "candidate" ? "bg-blue-500/20 text-blue-400" : user.type === "voter" ? "bg-green-500/20 text-green-400" : "bg-amber-500/20 text-amber-400"}>
                        {user.type === "candidate" ? <Vote className="w-3 h-3 mr-1" /> : <UserCheck className="w-3 h-3 mr-1" />}
                        {user.type}
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between text-white/60">
                        <span>Status</span>
                        <Badge variant="outline" className={user.status === "active" ? "border-green-500/30 text-green-400" : "border-yellow-500/30 text-yellow-400"}>
                          {user.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-white/60">
                        <span>Orders</span>
                        <span className="text-white">{user.orders.length}</span>
                      </div>
                      <div className="flex justify-between text-white/60">
                        <span>Subscriptions</span>
                        <span className="text-white">{user.subscriptions.length}</span>
                      </div>
                      <div className="flex justify-between text-white/60">
                        <span>Joined</span>
                        <span className="text-white">{new Date(user.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-border flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent border-white/20 text-white hover:bg-white/10">
                        <Mail className="w-3 h-3 mr-1" />
                        Email
                      </Button>
                      <Button size="sm" className="flex-1 bg-white text-black hover:bg-white/90">
                        View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 bg-muted/50 border-border text-white">
                  <SelectValue placeholder="Order Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
              <Select value={userTypeFilter} onValueChange={setUserTypeFilter}>
                <SelectTrigger className="w-40 bg-muted/50 border-border text-white">
                  <SelectValue placeholder="Client Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="candidate">Candidates</SelectItem>
                  <SelectItem value="voter">Voters</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Card className="bg-muted/50 border-border">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-white/60">Order #</TableHead>
                    <TableHead className="text-white/60">Client</TableHead>
                    <TableHead className="text-white/60">Type</TableHead>
                    <TableHead className="text-white/60">Services</TableHead>
                    <TableHead className="text-white/60">Total</TableHead>
                    <TableHead className="text-white/60">Status</TableHead>
                    <TableHead className="text-white/60">Payment</TableHead>
                    <TableHead className="text-white/60">Date</TableHead>
                    <TableHead className="text-white/60 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id} className="border-border hover:bg-muted/50">
                      <TableCell className="font-mono text-white">{order.order_number}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-7 w-7">
                            <AvatarFallback className="bg-white/10 text-white text-xs">
                              {order.client_name.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-white">{order.client_name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={order.client_type === "candidate" ? "bg-blue-500/20 text-blue-400" : "bg-green-500/20 text-green-400"}>
                          {order.client_type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {order.services.slice(0, 2).map((s, i) => (
                            <Badge key={i} variant="outline" className="text-xs border-white/20 text-white/70">
                              {s.name.length > 15 ? s.name.slice(0, 15) + "..." : s.name}
                            </Badge>
                          ))}
                          {order.services.length > 2 && (
                            <Badge variant="outline" className="text-xs border-white/20 text-white/50">
                              +{order.services.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold text-white">${(order.total / 100).toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge className={getOrderStatusColor(order.status)}>{order.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPaymentStatusColor(order.payment_status)}>{order.payment_status}</Badge>
                      </TableCell>
                      <TableCell className="text-white/60">{new Date(order.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-white/60 hover:text-white">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-[#1a1a1b] border-border">
                            <DropdownMenuItem className="text-white hover:bg-white/10" onClick={() => setSelectedOrder(order)}>
                              <Receipt className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            {order.payment_status !== "paid" && (
                              <DropdownMenuItem 
                                className="text-green-400 hover:bg-green-500/10"
                                onClick={() => handleUpdateOrderStatus(order.id, "completed", "paid")}
                              >
                                <CreditCard className="w-4 h-4 mr-2" />
                                Mark as Paid
                              </DropdownMenuItem>
                            )}
                            {order.status === "pending" && (
                              <DropdownMenuItem 
                                className="text-blue-400 hover:bg-blue-500/10"
                                onClick={() => handleUpdateOrderStatus(order.id, "processing")}
                              >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Start Processing
                              </DropdownMenuItem>
                            )}
                            {order.status === "processing" && (
                              <DropdownMenuItem 
                                className="text-green-400 hover:bg-green-500/10"
                                onClick={() => handleUpdateOrderStatus(order.id, "completed")}
                              >
                                <Check className="w-4 h-4 mr-2" />
                                Mark Complete
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem 
                              className="text-red-400 hover:bg-red-500/10"
                              onClick={() => handleUpdateOrderStatus(order.id, "cancelled")}
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Cancel Order
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Subscriptions Tab */}
          <TabsContent value="subscriptions" className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 bg-muted/50 border-border text-white">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
              <Select value={userTypeFilter} onValueChange={setUserTypeFilter}>
                <SelectTrigger className="w-40 bg-muted/50 border-border text-white">
                  <SelectValue placeholder="Client Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="candidate">Candidates</SelectItem>
                  <SelectItem value="voter">Voters</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Card className="bg-muted/50 border-border">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-white/60">Client</TableHead>
                    <TableHead className="text-white/60">Type</TableHead>
                    <TableHead className="text-white/60">Service</TableHead>
                    <TableHead className="text-white/60">Plan</TableHead>
                    <TableHead className="text-white/60">Price</TableHead>
                    <TableHead className="text-white/60">Status</TableHead>
                    <TableHead className="text-white/60">Next Billing</TableHead>
                    <TableHead className="text-white/60">Auto-Renew</TableHead>
                    <TableHead className="text-white/60 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubscriptions.map((sub) => (
                    <TableRow key={sub.id} className="border-border hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-7 w-7">
                            <AvatarFallback className="bg-white/10 text-white text-xs">
                              {sub.client_name.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-white">{sub.client_name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={sub.client_type === "candidate" ? "bg-blue-500/20 text-blue-400" : "bg-green-500/20 text-green-400"}>
                          {sub.client_type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-white">{sub.service_name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-white/20 text-white/70 capitalize">{sub.plan}</Badge>
                      </TableCell>
                      <TableCell className="font-semibold text-white">${(sub.price / 100).toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge className={getSubscriptionStatusColor(sub.status)}>{sub.status}</Badge>
                      </TableCell>
                      <TableCell className="text-white/60">{new Date(sub.next_billing).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {sub.auto_renew ? (
                          <Badge className="bg-green-500/20 text-green-400">Yes</Badge>
                        ) : (
                          <Badge className="bg-gray-500/20 text-gray-400">No</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-white/60 hover:text-white">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-[#1a1a1b] border-border">
                            <DropdownMenuItem className="text-white hover:bg-white/10" onClick={() => setSelectedSubscription(sub)}>
                              <Package className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            {sub.status === "active" && (
                              <DropdownMenuItem 
                                className="text-yellow-400 hover:bg-yellow-500/10"
                                onClick={() => handleUpdateSubscriptionStatus(sub.id, "paused")}
                              >
                                <Pause className="w-4 h-4 mr-2" />
                                Pause Subscription
                              </DropdownMenuItem>
                            )}
                            {sub.status === "paused" && (
                              <DropdownMenuItem 
                                className="text-green-400 hover:bg-green-500/10"
                                onClick={() => handleUpdateSubscriptionStatus(sub.id, "active")}
                              >
                                <Play className="w-4 h-4 mr-2" />
                                Resume Subscription
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem 
                              className="text-red-400 hover:bg-red-500/10"
                              onClick={() => handleUpdateSubscriptionStatus(sub.id, "cancelled")}
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Cancel Subscription
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Leads Tab */}
          <TabsContent value="leads" className="space-y-4">
            <Card className="bg-muted/50 border-border">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-white/60">Name</TableHead>
                    <TableHead className="text-white/60">Contact</TableHead>
                    <TableHead className="text-white/60">Company</TableHead>
                    <TableHead className="text-white/60">Source</TableHead>
                    <TableHead className="text-white/60">Status</TableHead>
                    <TableHead className="text-white/60">Created</TableHead>
                    <TableHead className="text-white/60 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeads.map((lead) => (
                    <TableRow key={lead.id} className="border-border hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-white/10 text-white text-xs">
                              {lead.name.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-white">{lead.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-white/70">
                            <Mail className="w-3 h-3" />
                            {lead.email}
                          </div>
                          {lead.phone && (
                            <div className="flex items-center gap-2 text-sm text-white/50">
                              <Phone className="w-3 h-3" />
                              {lead.phone}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-white/70">{lead.company || "-"}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-muted/50 border-white/20 text-white/70">
                          {lead.source}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getLeadStatusColor(lead.status)}>
                          {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-white/50 text-sm">
                        {new Date(lead.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-white/60 hover:text-white hover:bg-white/10">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-[#1a1a1b] border-border">
                            <DropdownMenuItem className="text-white/70 hover:text-white hover:bg-white/10" onClick={() => setSelectedLead(lead)}>
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-white/70 hover:text-white hover:bg-white/10" onClick={() => updateLeadStatus(lead.id, "contacted")}>
                              Mark Contacted
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-white/70 hover:text-white hover:bg-white/10" onClick={() => updateLeadStatus(lead.id, "qualified")}>
                              Mark Qualified
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-green-400 hover:text-green-300 hover:bg-green-500/10" onClick={() => convertToClient(lead)}>
                              Convert to Client
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-400 hover:text-red-300 hover:bg-red-500/10" onClick={() => updateLeadStatus(lead.id, "lost")}>
                              Mark Lost
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Clients Tab */}
          <TabsContent value="clients" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredClients.map((client) => (
                <Card key={client.id} className="bg-muted/50 border-border hover:bg-white/[0.07] transition-colors cursor-pointer" onClick={() => setSelectedClient(client)}>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={client.avatar_url} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                            {client.name.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium text-white">{client.name}</h3>
                          <p className="text-sm text-white/50">{client.email}</p>
                        </div>
                      </div>
                      <Badge className={client.status === "active" ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"}>
                        {client.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-white/40 mb-1">Active Services</p>
                        <div className="flex flex-wrap gap-1">
                          {client.services.length > 0 ? client.services.map((service, i) => (
                            <Badge key={i} variant="outline" className="bg-muted/50 border-white/20 text-white/70 text-xs">
                              {service}
                            </Badge>
                          )) : (
                            <span className="text-white/40 text-sm">No active services</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-3 border-t border-border">
                        <div>
                          <p className="text-xs text-white/40">Total Revenue</p>
                          <p className="text-lg font-semibold text-white">${(client.total_revenue / 100).toLocaleString()}</p>
                        </div>
                        <Button variant="ghost" size="sm" className="text-white/60 hover:text-white hover:bg-white/10">
                          View Profile
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Deals Pipeline Tab */}
          <TabsContent value="deals" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {(["discovery", "proposal", "negotiation", "closed_won", "closed_lost"] as DealStage[]).map((stage) => (
                <div key={stage} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-white capitalize">{stage.replace("_", " ")}</h3>
                    <Badge variant="outline" className="bg-muted/50 border-white/20 text-white/60">
                      {dealsByStage[stage].length}
                    </Badge>
                  </div>
                  <div
                    className="space-y-3 min-h-[400px] p-2 rounded-lg bg-white/[0.02] border border-white/5"
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={() => {
                      if (draggedDealId) {
                        handleUpdateDealStage(draggedDealId, stage)
                        setDraggedDealId(null)
                      }
                    }}
                  >
                    {dealsByStage[stage].map((deal) => (
                      <Card
                        key={deal.id}
                        draggable
                        onDragStart={() => setDraggedDealId(deal.id)}
                        onDragEnd={() => setDraggedDealId(null)}
                        onClick={() => setSelectedDeal(deal)}
                        className="bg-muted/50 border-border hover:bg-white/[0.07] transition-colors cursor-pointer"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-white text-sm leading-tight">{deal.title}</h4>
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-white/40 hover:text-white" onClick={(event) => event.stopPropagation()}>
                              <GripVertical className="w-3 h-3" />
                            </Button>
                          </div>
                          <p className="text-xs text-white/50 mb-3">{deal.client_name}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-semibold text-white">{formatCurrency(deal.value)}</span>
                            <span className="text-xs text-white/40">{deal.probability}%</span>
                          </div>
                          <div className="flex items-center gap-1 mt-2 text-xs text-white/40">
                            <Calendar className="w-3 h-3" />
                            {new Date(deal.expected_close).toLocaleDateString()}
                          </div>
                          <div className="mt-3 flex items-center justify-between gap-2">
                            <Button variant="outline" size="sm" className="border-white/20 bg-transparent text-white hover:bg-white/10" onClick={(event) => {
                              event.stopPropagation()
                              moveDealRelative(deal.id, -1)
                            }} disabled={deal.stage === "discovery"}>
                              <ArrowDownRight className="w-3 h-3 mr-1" />
                              Back
                            </Button>
                            <Badge className={getDealStageColor(deal.stage)}>{deal.stage.replace("_", " ")}</Badge>
                            <Button variant="outline" size="sm" className="border-white/20 bg-transparent text-white hover:bg-white/10" onClick={(event) => {
                              event.stopPropagation()
                              moveDealRelative(deal.id, 1)
                            }} disabled={deal.stage === "closed_lost" || deal.stage === "closed_won"}>
                              Forward
                              <ArrowUpRight className="w-3 h-3 ml-1" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {dealsByStage[stage].length === 0 && (
                      <div className="flex items-center justify-center h-24 text-white/30 text-sm">
                        No deals
                      </div>
                    )}
                  </div>
                  <div className="text-sm text-white/40 text-center">
                    {formatCurrency(dealsByStage[stage].reduce((sum, d) => sum + d.value, 0))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Tasks Tab */}
          <TabsContent value="tasks" className="space-y-4">
            <Card className="bg-muted/50 border-border">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-white/60">Task</TableHead>
                    <TableHead className="text-white/60">Related To</TableHead>
                    <TableHead className="text-white/60">Priority</TableHead>
                    <TableHead className="text-white/60">Status</TableHead>
                    <TableHead className="text-white/60">Due Date</TableHead>
                    <TableHead className="text-white/60 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.map((task) => {
                    const isOverdue = task.status !== "completed" && new Date(task.due_date) < new Date()
                    return (
                      <TableRow key={task.id} className={`border-border hover:bg-muted/50 ${isOverdue ? "bg-red-500/5" : ""}`}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${task.status === "completed" ? "bg-green-500" : isOverdue ? "bg-red-500" : "bg-white/30"}`} />
                            <span className={`font-medium ${task.status === "completed" ? "text-white/50 line-through" : "text-white"}`}>
                              {task.title}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-white/70">{task.related_name || "-"}</TableCell>
                        <TableCell>
                          <Badge className={getTaskPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`
                            ${task.status === "completed" ? "bg-green-500/10 border-green-500/30 text-green-400" : ""}
                            ${task.status === "pending" ? "bg-muted/50 border-white/20 text-white/60" : ""}
                            ${task.status === "in_progress" ? "bg-blue-500/10 border-blue-500/30 text-blue-400" : ""}
                          `}>
                            {task.status.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell className={isOverdue ? "text-red-400" : "text-white/50"}>
                          <div className="flex items-center gap-2">
                            {isOverdue && <AlertCircle className="w-3 h-3" />}
                            {new Date(task.due_date).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-white/60 hover:text-white hover:bg-white/10">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-[#1a1a1b] border-border">
                              <DropdownMenuItem className="text-white/70 hover:text-white hover:bg-white/10">
                                Edit Task
                              </DropdownMenuItem>
                                <DropdownMenuItem className="text-green-400 hover:text-green-300 hover:bg-green-500/10" onClick={() => handleUpdateTaskStatus(task.id, "completed")}>
                                Mark Complete
                              </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-400 hover:text-red-300 hover:bg-red-500/10" onClick={() => handleUpdateTaskStatus(task.id, "cancelled")}>
                                  Cancel
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="campaigns" className="space-y-4">
            <Card className="bg-muted/50 border-border">
              <CardHeader>
                <CardTitle className="text-white text-lg">Workspace Programs vs Full Campaign Accounts</CardTitle>
                <CardDescription className="text-white/50">
                  The cards below are execution programs inside a campaign account. They are not the entire race package on their own.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border border-border bg-background p-4">
                  <p className="text-white text-sm font-medium">Full Campaign Account</p>
                  <p className="text-white/70 text-sm mt-2">Strategy, retainers, launch work, team, files, meetings, field, finance, and election-day delivery for the whole race.</p>
                </div>
                <div className="rounded-lg border border-border bg-background p-4">
                  <p className="text-white text-sm font-medium">Workspace Program</p>
                  <p className="text-white/70 text-sm mt-2">A focused workstream such as youth outreach, transit messaging, donor growth, or field execution inside that larger client account.</p>
                </div>
                <div className="rounded-lg border border-border bg-background p-4">
                  <p className="text-white text-sm font-medium">Why Both Exist</p>
                  <p className="text-white/70 text-sm mt-2">The business sells the full campaign package. The operations team runs the package through smaller programs so owners can track work cleanly.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-muted/50 border-border">
              <CardHeader>
                <CardTitle className="text-white text-lg">Launch a Campaign Workspace Program</CardTitle>
                <CardDescription className="text-white/50">Create a workstream inside the full campaign account, assign an owner, and start tracking execution.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-4">
                <Input value={newCampaignName} onChange={(e) => setNewCampaignName(e.target.value)} placeholder="Campaign name" className="bg-background border-border text-white placeholder:text-white/40" />
                <Input value={newCampaignRegion} onChange={(e) => setNewCampaignRegion(e.target.value)} placeholder="Target region" className="bg-background border-border text-white placeholder:text-white/40" />
                <Input value={newCampaignBudget} onChange={(e) => setNewCampaignBudget(e.target.value)} placeholder="Budget in dollars" className="bg-background border-border text-white placeholder:text-white/40" />
                <Button className="bg-white text-black hover:bg-white/90" onClick={handleCreateCampaign}>Create Campaign</Button>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {workspaceCampaigns.map((campaign) => (
                <Card key={campaign.id} className="bg-muted/50 border-border">
                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-white font-semibold">{campaign.name}</h3>
                        <p className="text-white/50 text-sm">{campaign.target_region} • Owner: {campaign.owner_name}</p>
                      </div>
                      <Badge className={campaign.status === "active" ? "bg-green-500/20 text-green-400" : campaign.status === "launching" ? "bg-blue-500/20 text-blue-400" : campaign.status === "completed" ? "bg-purple-500/20 text-purple-400" : "bg-yellow-500/20 text-yellow-400"}>
                        {campaign.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div className="rounded-lg bg-background p-3 border border-border">
                        <p className="text-white/40">Budget</p>
                        <p className="text-white font-semibold">${(campaign.budget_cents / 100).toLocaleString()}</p>
                      </div>
                      <div className="rounded-lg bg-background p-3 border border-border">
                        <p className="text-white/40">Launch</p>
                        <p className="text-white font-semibold">{new Date(campaign.launch_date).toLocaleDateString()}</p>
                      </div>
                      <div className="rounded-lg bg-background p-3 border border-border">
                        <p className="text-white/40">Goals</p>
                        <p className="text-white font-semibold">{campaign.goals.length}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {campaign.goals.map((goal) => (
                        <Badge key={goal} variant="outline" className="border-white/20 text-white/70">{goal}</Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" className="border-white/20 bg-transparent text-white hover:bg-white/10" onClick={() => { CRMStore.updateCampaignStatus(campaign.id, "launching"); loadData() }}>Move to Launching</Button>
                      <Button variant="outline" className="border-white/20 bg-transparent text-white hover:bg-white/10" onClick={() => { CRMStore.updateCampaignStatus(campaign.id, "active"); loadData() }}>Mark Active</Button>
                      <Button variant="outline" className="border-white/20 bg-transparent text-white hover:bg-white/10" onClick={() => { CRMStore.updateCampaignStatus(campaign.id, "completed"); loadData() }}>Complete</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="teamChat" className="space-y-4">
            <Card className="bg-muted/50 border-border">
              <CardHeader>
                <CardTitle className="text-white text-lg">Create Team Channel</CardTitle>
                <CardDescription className="text-white/50">Set up internal coordination channels for delivery, creative review, and field work.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-3">
                <Input value={newTeamChannelName} onChange={(e) => setNewTeamChannelName(e.target.value)} placeholder="Channel name" className="bg-background border-border text-white placeholder:text-white/40" />
                <Input value={newTeamChannelTopic} onChange={(e) => setNewTeamChannelTopic(e.target.value)} placeholder="Topic" className="bg-background border-border text-white placeholder:text-white/40" />
                <Button className="bg-white text-black hover:bg-white/90" onClick={handleCreateTeamChat}>Create Channel</Button>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {workspaceTeamChats.map((chat) => (
                <Card key={chat.id} className="bg-muted/50 border-border">
                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-white font-semibold">#{chat.name}</h3>
                        <p className="text-white/50 text-sm">{chat.topic}</p>
                      </div>
                      <Badge className="bg-blue-500/20 text-blue-400">{chat.member_ids.length} members</Badge>
                    </div>
                    <div className="rounded-lg bg-background border border-border p-4">
                      <p className="text-white text-sm">{chat.last_message}</p>
                      <p className="text-white/40 text-xs mt-2">Updated {new Date(chat.last_message_at).toLocaleString()} • {chat.unread_count} unread • {chat.candidate_name}</p>
                    </div>
                    <div className="flex gap-2">
                      <Input value={chatDrafts[chat.id] || ""} onChange={(e) => setChatDrafts(prev => ({ ...prev, [chat.id]: e.target.value }))} placeholder="Post an update" className="bg-background border-border text-white placeholder:text-white/40" />
                      <Button className="bg-white text-black hover:bg-white/90" onClick={() => handlePostTeamChatMessage(chat.id)}>Send</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="clientChat" className="space-y-4">
            <Card className="bg-muted/50 border-border">
              <CardHeader>
                <CardTitle className="text-white text-lg">Open Client Thread</CardTitle>
                <CardDescription className="text-white/50">Start and manage direct conversations with candidates and voter clients.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-3">
                <Select value={newClientChatUserId} onValueChange={setNewClientChatUserId}>
                  <SelectTrigger className="bg-background border-border text-white">
                    <SelectValue placeholder="Choose client" />
                  </SelectTrigger>
                  <SelectContent>
                    {demoUsers.map((user) => (
                      <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input value={newClientChatSubject} onChange={(e) => setNewClientChatSubject(e.target.value)} placeholder="Conversation subject" className="bg-background border-border text-white placeholder:text-white/40" />
                <Button className="bg-white text-black hover:bg-white/90" onClick={handleCreateClientChat}>Open Thread</Button>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {filteredClientChats.map((thread) => (
                <Card key={thread.id} className="bg-muted/50 border-border">
                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-white font-semibold">{thread.client_name}</h3>
                        <p className="text-white/50 text-sm">{thread.subject} • Owner: {thread.owner_name}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={thread.priority === "high" ? "bg-red-500/20 text-red-400" : thread.priority === "medium" ? "bg-yellow-500/20 text-yellow-400" : "bg-gray-500/20 text-gray-400"}>{thread.priority}</Badge>
                        <Badge className={thread.status === "resolved" ? "bg-green-500/20 text-green-400" : thread.status === "waiting" ? "bg-yellow-500/20 text-yellow-400" : "bg-blue-500/20 text-blue-400"}>{thread.status}</Badge>
                      </div>
                    </div>
                    <div className="rounded-lg bg-background border border-border p-4">
                      <p className="text-white text-sm">{thread.last_message}</p>
                      <p className="text-white/40 text-xs mt-2">Last reply {new Date(thread.last_message_at).toLocaleString()}</p>
                    </div>
                    <div className="flex gap-2">
                      <Input value={chatDrafts[thread.id] || ""} onChange={(e) => setChatDrafts(prev => ({ ...prev, [thread.id]: e.target.value }))} placeholder="Reply to client" className="bg-background border-border text-white placeholder:text-white/40" />
                      <Button className="bg-white text-black hover:bg-white/90" onClick={() => handlePostClientChatMessage(thread.id)}>Send</Button>
                      <Button variant="outline" className="border-white/20 bg-transparent text-white hover:bg-white/10" onClick={() => { CRMStore.updateClientChatStatus(thread.id, thread.status === "resolved" ? "open" : "resolved"); loadData() }}>
                        {thread.status === "resolved" ? "Reopen" : "Resolve"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="teamSetup" className="space-y-4">
            <Card className="bg-muted/50 border-border">
              <CardHeader>
                <CardTitle className="text-white text-lg">Invite Team Member</CardTitle>
                <CardDescription className="text-white/50">Manage seats, roles, and access for the campaign team.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-4">
                <Input value={newTeamMemberName} onChange={(e) => setNewTeamMemberName(e.target.value)} placeholder="Full name" className="bg-background border-border text-white placeholder:text-white/40" />
                <Input value={newTeamMemberEmail} onChange={(e) => setNewTeamMemberEmail(e.target.value)} placeholder="Email address" className="bg-background border-border text-white placeholder:text-white/40" />
                <Select value={newTeamMemberRole} onValueChange={(value) => setNewTeamMemberRole(value as TeamMember["role"])}>
                  <SelectTrigger className="bg-background border-border text-white">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="campaign_manager">Campaign Manager</SelectItem>
                    <SelectItem value="field_director">Field Director</SelectItem>
                    <SelectItem value="designer">Designer</SelectItem>
                    <SelectItem value="volunteer_coordinator">Volunteer Coordinator</SelectItem>
                    <SelectItem value="analyst">Analyst</SelectItem>
                  </SelectContent>
                </Select>
                <Button className="bg-white text-black hover:bg-white/90" onClick={handleInviteTeamMember}>Send Invite</Button>
              </CardContent>
            </Card>

            <Card className="bg-muted/50 border-border">
              <CardHeader>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-white text-lg">Workspace Control</CardTitle>
                    <CardDescription className="text-white/50">Open the candidate workspace or preview a team member portal with role-scoped access.</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="border-white/20 bg-transparent text-white hover:bg-white/10" onClick={handleAddSharedFile}>
                      <FileText className="w-4 h-4 mr-2" />
                      Add File
                    </Button>
                    <Button variant="outline" className="border-white/20 bg-transparent text-white hover:bg-white/10" onClick={handleScheduleMeeting}>
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule Meeting
                    </Button>
                    <Button className="bg-white text-black hover:bg-white/90" onClick={handlePreviewCandidateWorkspace}>
                      <ArrowUpRight className="w-4 h-4 mr-2" />
                      Open Workspace
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card className="bg-muted/50 border-border">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-white/60">Member</TableHead>
                    <TableHead className="text-white/60">Role</TableHead>
                    <TableHead className="text-white/60">Permissions</TableHead>
                    <TableHead className="text-white/60">Status</TableHead>
                    <TableHead className="text-white/60">Joined</TableHead>
                    <TableHead className="text-white/60 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workspaceTeamMembers.map((member) => (
                    <TableRow key={member.id} className="border-border hover:bg-muted/50">
                      <TableCell>
                        <div>
                          <p className="text-white font-medium">{member.name}</p>
                          <p className="text-white/50 text-sm">{member.email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-white/70 capitalize">{member.role.replaceAll("_", " ")}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {member.permissions.map((permission) => (
                            <Badge key={permission} variant="outline" className="border-white/20 text-white/70">{permission}</Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={member.status === "active" ? "bg-green-500/20 text-green-400" : member.status === "invited" ? "bg-yellow-500/20 text-yellow-400" : "bg-gray-500/20 text-gray-400"}>{member.status}</Badge>
                      </TableCell>
                      <TableCell className="text-white/50">{new Date(member.joined_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" className="border-white/20 bg-transparent text-white hover:bg-white/10" onClick={() => handlePreviewMemberWorkspace(member)}>
                            Preview Portal
                          </Button>
                          <Button variant="outline" className="border-white/20 bg-transparent text-white hover:bg-white/10" onClick={() => { CRMStore.updateTeamMemberRole(member.id, member.role === "campaign_manager" ? "field_director" : "campaign_manager"); loadData() }}>Rotate Role</Button>
                          <Button variant="outline" className="border-white/20 bg-transparent text-white hover:bg-white/10" onClick={() => { CRMStore.updateTeamMemberStatus(member.id, member.status === "active" ? "inactive" : "active"); loadData() }}>
                            {member.status === "active" ? "Deactivate" : "Activate"}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <Card className="bg-muted/50 border-border">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Shared Files</CardTitle>
                  <CardDescription className="text-white/50">Role-aware files for briefs, design assets, finance packs, and field plans.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {workspaceFiles.map((file) => (
                    <div key={file.id} className="rounded-lg border border-border bg-background p-4 flex items-start justify-between gap-4">
                      <div>
                        <p className="text-white font-medium">{file.name}</p>
                        <p className="text-white/50 text-sm">{file.category} • uploaded by {file.uploaded_by} • {file.size_label}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {file.role_visibility.map((role) => (
                            <Badge key={role} variant="outline" className="border-white/20 text-white/70">{role.replaceAll("_", " ")}</Badge>
                          ))}
                        </div>
                      </div>
                      <p className="text-white/40 text-xs">{new Date(file.updated_at).toLocaleDateString()}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-muted/50 border-border">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Meetings</CardTitle>
                  <CardDescription className="text-white/50">Standups, strategy calls, and client reviews for the selected candidate team.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {workspaceMeetings.map((meeting) => (
                    <div key={meeting.id} className="rounded-lg border border-border bg-background p-4 flex items-start justify-between gap-4">
                      <div>
                        <p className="text-white font-medium">{meeting.title}</p>
                        <p className="text-white/50 text-sm">{meeting.meeting_type.replaceAll("_", " ")} • {meeting.duration_minutes} min</p>
                        <p className="text-white/50 text-sm mt-1">{meeting.notes}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {meeting.attendees.map((attendee) => (
                            <Badge key={attendee} variant="outline" className="border-white/20 text-white/70">{attendee}</Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={meeting.status === "scheduled" ? "bg-blue-500/20 text-blue-400" : meeting.status === "live" ? "bg-green-500/20 text-green-400" : "bg-white/10 text-white/70"}>{meeting.status}</Badge>
                        <p className="text-white/40 text-xs mt-2">{new Date(meeting.starts_at).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Lead Details Dialog */}
      <Dialog open={!!selectedDeal} onOpenChange={() => setSelectedDeal(null)}>
        <DialogContent className="bg-[#1a1a1b] border-border text-white max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between gap-4">
              <span>{selectedDeal?.title}</span>
              {selectedDeal && <Badge className={getDealStageColor(selectedDeal.stage)}>{selectedDeal.stage.replace("_", " ")}</Badge>}
            </DialogTitle>
            <DialogDescription className="text-white/60">
              Full project details for this pipeline opportunity.
            </DialogDescription>
          </DialogHeader>

          {selectedDeal && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-muted/50 border-border">
                  <CardContent className="p-4">
                    <p className="text-white/50 text-xs">Project Value</p>
                    <p className="text-white text-xl font-semibold">{formatCurrency(selectedDeal.value)}</p>
                  </CardContent>
                </Card>
                <Card className="bg-muted/50 border-border">
                  <CardContent className="p-4">
                    <p className="text-white/50 text-xs">Win Probability</p>
                    <p className="text-white text-xl font-semibold">{selectedDeal.probability}%</p>
                  </CardContent>
                </Card>
                <Card className="bg-muted/50 border-border">
                  <CardContent className="p-4">
                    <p className="text-white/50 text-xs">Expected Close</p>
                    <p className="text-white text-sm font-medium">{new Date(selectedDeal.expected_close).toLocaleDateString()}</p>
                  </CardContent>
                </Card>
                <Card className="bg-muted/50 border-border">
                  <CardContent className="p-4">
                    <p className="text-white/50 text-xs">Created</p>
                    <p className="text-white text-sm font-medium">{new Date(selectedDeal.created_at).toLocaleDateString()}</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-white/60">Client</Label>
                    <p className="text-white text-base font-medium">{selectedDeal.client_name}</p>
                  </div>
                  <div>
                    <Label className="text-white/60">Client Record</Label>
                    <p className="text-white/80">{selectedDealClient ? `${selectedDealClient.email}${selectedDealClient.phone ? ` • ${selectedDealClient.phone}` : ""}` : "No client record linked yet"}</p>
                  </div>
                  <div>
                    <Label className="text-white/60">Lead Context</Label>
                    <p className="text-white/80">
                      {selectedDealLead ? `${selectedDealLead.source}${selectedDealLead.company ? ` • ${selectedDealLead.company}` : ""}` : "No source linked yet"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-white/60">Current Status</Label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedDealLead && <Badge className={getLeadStatusColor(selectedDealLead.status)}>{selectedDealLead.status}</Badge>}
                      {selectedDealClient && <Badge variant="outline" className="border-white/20 text-white/80">{selectedDealClient.status}</Badge>}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-white/60">Project Notes</Label>
                    <div className="mt-2 rounded-lg border border-border bg-muted/40 p-4 text-white/80 text-sm leading-6">
                      {selectedDeal.notes || "No written project notes yet. Use the task list and stage controls to move this opportunity forward."}
                    </div>
                  </div>
                  <div>
                    <Label className="text-white/60">Quick Actions</Label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Button variant="outline" className="border-white/20 bg-transparent text-white hover:bg-white/10" onClick={() => moveDealRelative(selectedDeal.id, -1)} disabled={selectedDeal.stage === "discovery"}>
                        Move Back
                      </Button>
                      <Button variant="outline" className="border-white/20 bg-transparent text-white hover:bg-white/10" onClick={() => moveDealRelative(selectedDeal.id, 1)} disabled={selectedDeal.stage === "closed_won" || selectedDeal.stage === "closed_lost"}>
                        Move Forward
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-white/60 mb-2 block">Related Tasks</Label>
                <div className="space-y-3">
                  {selectedDealTasks.length > 0 ? selectedDealTasks.map((task) => (
                    <div key={task.id} className="rounded-lg border border-border bg-muted/40 p-4 flex items-start justify-between gap-4">
                      <div>
                        <p className="text-white font-medium">{task.title}</p>
                        <p className="text-white/60 text-sm mt-1">{task.description || task.related_name || "No additional task context"}</p>
                      </div>
                      <div className="text-right space-y-2">
                        <Badge className={getTaskPriorityColor(task.priority)}>{task.priority}</Badge>
                        <p className="text-white/50 text-xs">Due {new Date(task.due_date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  )) : (
                    <div className="rounded-lg border border-dashed border-white/10 bg-muted/20 p-4 text-sm text-white/50">
                      No tasks linked to this project yet.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Lead Details Dialog */}
      <Dialog open={showPipelineMath} onOpenChange={setShowPipelineMath}>
        <DialogContent className="bg-[#1a1a1b] border-border text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>Open Deal Pipeline Math</DialogTitle>
            <DialogDescription className="text-white/60">
              This modal explains the CRM forecast number shown on the pipeline card.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-5">
            <div className="rounded-lg border border-border bg-muted/40 p-4">
              <p className="text-white text-sm font-medium">Formula</p>
              <p className="text-white/70 text-sm mt-2">
                Open Deal Pipeline = sum of all deals in discovery, proposal, and negotiation.
              </p>
              <p className="text-amber-300 text-sm mt-2">
                {formatCurrency(stats.pipelineValue)} = {dealsByStage.discovery.length} discovery + {dealsByStage.proposal.length} proposal + {dealsByStage.negotiation.length} negotiation deals.
              </p>
            </div>

            <div className="space-y-3">
              {(["discovery", "proposal", "negotiation"] as DealStage[]).map((stage) => (
                <div key={stage} className="rounded-lg border border-border bg-background p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Badge className={getDealStageColor(stage)}>{stage.replace("_", " ")}</Badge>
                      <span className="text-white/60 text-sm">{dealsByStage[stage].length} deal(s)</span>
                    </div>
                    <span className="text-white font-medium">{formatCurrency(dealsByStage[stage].reduce((sum, deal) => sum + deal.value, 0))}</span>
                  </div>
                  <div className="space-y-2">
                    {dealsByStage[stage].map((deal) => (
                      <div key={deal.id} className="flex items-center justify-between text-sm text-white/75">
                        <span>{deal.title}</span>
                        <span>{formatCurrency(deal.value)}</span>
                      </div>
                    ))}
                    {dealsByStage[stage].length === 0 && <p className="text-white/40 text-sm">No deals in this stage.</p>}
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-lg border border-border bg-background p-4">
              <p className="text-white text-sm font-medium">What This Is Not</p>
              <p className="text-white/60 text-sm mt-2">
                This is not an election filing total, legal spending cap, or compliance ledger. It is an internal CRM forecast based on open service opportunities.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Lead Details Dialog */}
      <Dialog open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
        <DialogContent className="bg-[#1a1a1b] border-border text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  {selectedLead?.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              {selectedLead?.name}
            </DialogTitle>
            <DialogDescription className="text-white/60">
              Lead details and activity history
            </DialogDescription>
          </DialogHeader>
          
          {selectedLead && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white/60">Email</Label>
                  <p className="text-white">{selectedLead.email}</p>
                </div>
                <div>
                  <Label className="text-white/60">Phone</Label>
                  <p className="text-white">{selectedLead.phone || "Not provided"}</p>
                </div>
                <div>
                  <Label className="text-white/60">Company</Label>
                  <p className="text-white">{selectedLead.company || "Not provided"}</p>
                </div>
                <div>
                  <Label className="text-white/60">Source</Label>
                  <p className="text-white">{selectedLead.source}</p>
                </div>
                <div>
                  <Label className="text-white/60">Status</Label>
                  <div className="mt-1">
                    <Badge className={getLeadStatusColor(selectedLead.status)}>
                      {selectedLead.status.charAt(0).toUpperCase() + selectedLead.status.slice(1)}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-white/60">Created</Label>
                  <p className="text-white">{new Date(selectedLead.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              <div>
                <Label className="text-white/60">Notes</Label>
                <Textarea 
                  placeholder="Add notes about this lead..."
                  className="mt-2 bg-muted/50 border-border text-white placeholder:text-white/40"
                  rows={4}
                />
              </div>

              <div className="flex gap-3">
                <Button className="flex-1 bg-white text-black hover:bg-white/90" onClick={() => convertToClient(selectedLead)}>
                  Convert to Client
                </Button>
                <Button variant="outline" className="border-white/20 bg-transparent text-white hover:bg-white/10">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Email
                </Button>
                <Button variant="outline" className="border-white/20 bg-transparent text-white hover:bg-white/10">
                  <Phone className="w-4 h-4 mr-2" />
                  Call
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Client Details Dialog */}
      <Dialog open={!!selectedClient} onOpenChange={() => setSelectedClient(null)}>
        <DialogContent className="bg-[#1a1a1b] border-border text-white max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                  {selectedClient?.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              {selectedClient?.name}
            </DialogTitle>
            <DialogDescription className="text-white/60">
              Client profile and service history
            </DialogDescription>
          </DialogHeader>
          
          {selectedClient && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <Card className="bg-muted/50 border-border">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-white">${(selectedClient.total_revenue / 100).toLocaleString()}</p>
                    <p className="text-xs text-white/60">Total Revenue</p>
                  </CardContent>
                </Card>
                <Card className="bg-muted/50 border-border">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-white">{selectedClient.services.length}</p>
                    <p className="text-xs text-white/60">Active Services</p>
                  </CardContent>
                </Card>
                <Card className="bg-muted/50 border-border">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-white">
                      {Math.floor((new Date().getTime() - new Date(selectedClient.created_at).getTime()) / (1000 * 60 * 60 * 24 * 30))}
                    </p>
                    <p className="text-xs text-white/60">Months as Client</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white/60">Email</Label>
                  <p className="text-white">{selectedClient.email}</p>
                </div>
                <div>
                  <Label className="text-white/60">Phone</Label>
                  <p className="text-white">{selectedClient.phone || "Not provided"}</p>
                </div>
              </div>

              <div>
                <Label className="text-white/60 mb-2 block">Active Services</Label>
                <div className="flex flex-wrap gap-2">
                  {selectedClient.services.map((service, i) => (
                    <Badge key={i} className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-white/60">Add Note</Label>
                <Textarea 
                  placeholder="Add a note about this client..."
                  className="mt-2 bg-muted/50 border-border text-white placeholder:text-white/40"
                  rows={3}
                />
              </div>

              <div className="flex gap-3">
                <Button className="flex-1 bg-white text-black hover:bg-white/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Service
                </Button>
                <Button variant="outline" className="border-white/20 bg-transparent text-white hover:bg-white/10">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Communication History
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Order Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="bg-[#1a1a1b] border-border text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Receipt className="w-5 h-5 text-blue-400" />
              </div>
              Order {selectedOrder?.order_number}
            </DialogTitle>
            <DialogDescription className="text-white/60">
              Order details and line items
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white/60">Client</Label>
                  <p className="text-white font-medium">{selectedOrder.client_name}</p>
                </div>
                <div>
                  <Label className="text-white/60">Client Type</Label>
                  <Badge className={selectedOrder.client_type === "candidate" ? "bg-blue-500/20 text-blue-400" : "bg-green-500/20 text-green-400"}>
                    {selectedOrder.client_type}
                  </Badge>
                </div>
                <div>
                  <Label className="text-white/60">Order Status</Label>
                  <Badge className={getOrderStatusColor(selectedOrder.status)}>{selectedOrder.status}</Badge>
                </div>
                <div>
                  <Label className="text-white/60">Payment Status</Label>
                  <Badge className={getPaymentStatusColor(selectedOrder.payment_status)}>{selectedOrder.payment_status}</Badge>
                </div>
              </div>

              <div>
                <Label className="text-white/60 mb-3 block">Services</Label>
                <div className="space-y-2">
                  {selectedOrder.services.map((service, i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span className="text-white">{service.name}</span>
                      <span className="font-semibold text-white">${(service.price / 100).toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg border border-border">
                    <span className="font-semibold text-white">Total</span>
                    <span className="text-xl font-bold text-white">${(selectedOrder.total / 100).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                {selectedOrder.payment_status === "unpaid" && (
                  <Button className="flex-1 bg-green-600 text-white hover:bg-green-700">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Process Payment
                  </Button>
                )}
                {selectedOrder.status === "pending" && (
                  <Button className="flex-1 bg-blue-600 text-white hover:bg-blue-700">
                    <Play className="w-4 h-4 mr-2" />
                    Start Processing
                  </Button>
                )}
                <Button variant="outline" className="border-white/20 bg-transparent text-white hover:bg-white/10">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Receipt
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Subscription Details Dialog */}
      <Dialog open={!!selectedSubscription} onOpenChange={() => setSelectedSubscription(null)}>
        <DialogContent className="bg-[#1a1a1b] border-border text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <RefreshCw className="w-5 h-5 text-purple-400" />
              </div>
              Subscription Details
            </DialogTitle>
            <DialogDescription className="text-white/60">
              Manage subscription settings
            </DialogDescription>
          </DialogHeader>
          
          {selectedSubscription && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white/60">Client</Label>
                  <p className="text-white font-medium">{selectedSubscription.client_name}</p>
                </div>
                <div>
                  <Label className="text-white/60">Client Type</Label>
                  <Badge className={selectedSubscription.client_type === "candidate" ? "bg-blue-500/20 text-blue-400" : "bg-green-500/20 text-green-400"}>
                    {selectedSubscription.client_type}
                  </Badge>
                </div>
                <div>
                  <Label className="text-white/60">Service</Label>
                  <p className="text-white">{selectedSubscription.service_name}</p>
                </div>
                <div>
                  <Label className="text-white/60">Plan</Label>
                  <Badge variant="outline" className="border-white/20 text-white capitalize">{selectedSubscription.plan}</Badge>
                </div>
                <div>
                  <Label className="text-white/60">Status</Label>
                  <Badge className={getSubscriptionStatusColor(selectedSubscription.status)}>{selectedSubscription.status}</Badge>
                </div>
                <div>
                  <Label className="text-white/60">Price</Label>
                  <p className="text-xl font-bold text-white">${(selectedSubscription.price / 100).toLocaleString()}/{selectedSubscription.plan === "annual" ? "year" : selectedSubscription.plan === "quarterly" ? "quarter" : "month"}</p>
                </div>
                <div>
                  <Label className="text-white/60">Start Date</Label>
                  <p className="text-white">{new Date(selectedSubscription.start_date).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-white/60">Next Billing</Label>
                  <p className="text-white">{new Date(selectedSubscription.next_billing).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Auto-Renewal</p>
                    <p className="text-sm text-white/60">Automatically renew on next billing date</p>
                  </div>
                  <Badge className={selectedSubscription.auto_renew ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"}>
                    {selectedSubscription.auto_renew ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
              </div>

              <div className="flex gap-3">
                {selectedSubscription.status === "active" && (
                  <Button variant="outline" className="flex-1 border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10">
                    <Pause className="w-4 h-4 mr-2" />
                    Pause Subscription
                  </Button>
                )}
                {selectedSubscription.status === "paused" && (
                  <Button className="flex-1 bg-green-600 text-white hover:bg-green-700">
                    <Play className="w-4 h-4 mr-2" />
                    Resume Subscription
                  </Button>
                )}
                <Button variant="outline" className="border-white/20 bg-transparent text-white hover:bg-white/10">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Change Plan
                </Button>
                <Button variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                  <XCircle className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
