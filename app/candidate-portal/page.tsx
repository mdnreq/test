"use client"

export const dynamic = 'force-static'

import React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { CandidateServicesCatalog } from "@/app/candidate-portal/services/page"
import * as CRMStore from "@/lib/store/crm-store"
import {
  CAMPAIGN_SERVICE_CATALOG,
  getCampaignBlueprintForCandidate,
  getCampaignCommercialModel,
  getCampaignStackForService,
} from "@/lib/campaign-system"
import { 
  LayoutDashboard, 
  Package, 
  FileText, 
  Settings, 
  CreditCard,
  TrendingUp,
  Users,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronRight,
  Plus,
  BarChart3,
  Megaphone,
  Mail,
  Globe,
  Palette,
  Video,
  FileSearch,
  PenTool,
  X,
  Check,
  Send,
  MessageSquare,
  FolderOpen,
  UserPlus,
  ClipboardList,
  ShieldCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface UserProfile {
  id: string
  full_name: string
  user_type: string
  is_verified: boolean
  municipality_id: string | null
  province: string | null
}

interface Service {
  id: string
  name: string
  slug?: string
  description: string
  category: string
  price_monthly: number
  price_display: string
  features: string[]
  popular: boolean
  active?: boolean
}

interface CandidateService {
  id: string
  service_id: string
  status: string
  subscribed_at: string
  expires_at: string | null
  services: Service
  source?: "subscription" | "order"
  billing_cents?: number
  commercial_model?: "monthly-retainer" | "launch-project"
}

interface ServiceRequest {
  id: string
  service_id: string
  status: string
  priority: string
  notes: string | null
  created_at: string
  services: Service
}

const categoryIcons: Record<string, React.ReactNode> = {
  "Digital Marketing": <Megaphone className="w-5 h-5" />,
  "Content Creation": <PenTool className="w-5 h-5" />,
  "Web Development": <Globe className="w-5 h-5" />,
  "Video Production": <Video className="w-5 h-5" />,
  "Email Marketing": <Mail className="w-5 h-5" />,
  "Design": <Palette className="w-5 h-5" />,
  "Research": <FileSearch className="w-5 h-5" />,
  "Analytics": <BarChart3 className="w-5 h-5" />
}

function fallbackServiceForName(serviceId: string, serviceName: string): Service {
  return {
    id: serviceId,
    name: serviceName,
    description: "Campaign service",
    category: "Services",
    price_monthly: 0,
    price_display: "Contact for pricing",
    features: [],
    popular: false,
  }
}

function catalogServiceForId(serviceId: string, serviceName?: string): Service {
  const match = CAMPAIGN_SERVICE_CATALOG.find((service) => service.id === serviceId)
  return match ?? fallbackServiceForName(serviceId, serviceName ?? "Campaign service")
}

function mapSubscriptionToCandidateService(subscription: CRMStore.Subscription): CandidateService {
  const service = catalogServiceForId(subscription.service_id, subscription.service_name)
  return {
    id: subscription.id,
    service_id: subscription.service_id,
    status: subscription.status,
    subscribed_at: subscription.start_date,
    expires_at: subscription.next_billing,
    services: service,
    source: "subscription",
    billing_cents: subscription.price_cents,
    commercial_model: getCampaignCommercialModel(service),
  }
}

function mapOrderToCandidateServices(order: CRMStore.Order): CandidateService[] {
  return order.items.map((item) => {
    const service = catalogServiceForId(item.service_id, item.service_name)
    return {
      id: `${order.id}-${item.service_id}`,
      service_id: item.service_id,
      status: order.status,
      subscribed_at: order.created_at,
      expires_at: null,
      services: service,
      source: "order",
      billing_cents: item.price_cents,
      commercial_model: getCampaignCommercialModel(service),
    }
  })
}

function matchServiceForTask(task: CRMStore.Task, candidateServices: CandidateService[]): Service {
  const normalized = `${task.title} ${task.description ?? ""}`.toLowerCase()
  const directMatch = candidateServices.find((entry) => normalized.includes(entry.services.name.toLowerCase()))
  if (directMatch) {
    return directMatch.services
  }

  return candidateServices[0]?.services ?? CAMPAIGN_SERVICE_CATALOG[0]
}

function cleanTaskNote(task: CRMStore.Task): string {
  const cleaned = (task.description ?? task.title)
    .replace(/\bundefined\b/gi, "")
    .replace(/Recommended retainer:\s*(?=\.|$)/gi, "")
    .replace(/Fix with:\s*(?=\.|$)/gi, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([.,:])/g, "$1")
    .replace(/\s*\.\s*$/, "")
    .trim()

  return cleaned || task.title
}

function mapTaskToServiceRequest(task: CRMStore.Task, candidateServices: CandidateService[]): ServiceRequest {
  const service = matchServiceForTask(task, candidateServices)
  return {
    id: task.id,
    service_id: service.id,
    status: task.status === "in_progress" ? "in_progress" : task.status === "completed" ? "completed" : "pending",
    priority: task.priority,
    notes: cleanTaskNote(task),
    created_at: task.created_at,
    services: service,
  }
}

export default function CandidatePortalPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [myServices, setMyServices] = useState<CandidateService[]>([])
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([])
  const [activeTab, setActiveTab] = useState("browse-services")
  const [managingService, setManagingService] = useState<CandidateService | null>(null)
  const [campaignAccounts, setCampaignAccounts] = useState<CRMStore.Campaign[]>([])
  const [campaignOrders, setCampaignOrders] = useState<CRMStore.Order[]>([])
  const [deliveryTasks, setDeliveryTasks] = useState<CRMStore.Task[]>([])
  const [teamMembers, setTeamMembers] = useState<CRMStore.TeamMember[]>([])
  const [clientThreads, setClientThreads] = useState<CRMStore.ClientChatThread[]>([])
  const [sharedFiles, setSharedFiles] = useState<CRMStore.SharedFile[]>([])
  const [meetings, setMeetings] = useState<CRMStore.Meeting[]>([])
  const [teamNameDraft, setTeamNameDraft] = useState("")
  const [teamEmailDraft, setTeamEmailDraft] = useState("")
  const [teamRoleDraft, setTeamRoleDraft] = useState<CRMStore.TeamMember["role"]>("campaign_manager")
  const [fileNameDraft, setFileNameDraft] = useState("")
  const [fileCategoryDraft, setFileCategoryDraft] = useState<CRMStore.SharedFile["category"]>("brief")
  const [meetingTitleDraft, setMeetingTitleDraft] = useState("")
  const [meetingTypeDraft, setMeetingTypeDraft] = useState<CRMStore.Meeting["meeting_type"]>("strategy")
  const [meetingDateDraft, setMeetingDateDraft] = useState("")
  const [threadReplyDrafts, setThreadReplyDrafts] = useState<Record<string, string>>({})

  const refreshDemoCandidateAccount = (candidateId: string, candidateName: string) => {
    const demoSubscriptions = CRMStore.getSubscriptionsByUser(candidateId).map(mapSubscriptionToCandidateService)
    const demoOrders = CRMStore.getOrdersByUser(candidateId)
    const demoLaunchWork = demoOrders.flatMap(mapOrderToCandidateServices)
    const demoMyServices: CandidateService[] = [...demoSubscriptions, ...demoLaunchWork]
    const crmCampaigns = CRMStore.getCampaignsByUser(candidateId)
    const crmTasks = CRMStore.getTasks().filter((task) => task.related_to === candidateName)
    const crmTeamMembers = CRMStore.getTeamMembersByCandidate(candidateId)
    const crmClientThreads = CRMStore.getClientChats().filter((thread) => thread.client_id === candidateId)
    const crmFiles = CRMStore.getSharedFilesByCandidate(candidateId)
    const crmMeetings = CRMStore.getMeetingsByCandidate(candidateId)

    setMyServices(demoMyServices)
    setCampaignOrders(demoOrders)
    setCampaignAccounts(crmCampaigns)
    setDeliveryTasks(crmTasks)
    setTeamMembers(crmTeamMembers)
    setClientThreads(crmClientThreads)
    setSharedFiles(crmFiles)
    setMeetings(crmMeetings)
    setServiceRequests(crmTasks.map((task) => mapTaskToServiceRequest(task, demoMyServices)))
  }

  useEffect(() => {
    async function loadData() {
      // Check for demo mode first
      const isDemoMode = localStorage.getItem("tnm-demo-mode") === "true"
      setIsDemoMode(isDemoMode)
      
      if (isDemoMode) {
        CRMStore.initializeStore()

        const demoUser = JSON.parse(localStorage.getItem("tnm-demo-user") || "{}")
        const crmUser = CRMStore.getCurrentUser() ?? (demoUser.id ? CRMStore.getUser(demoUser.id) : null)

        if (!crmUser || crmUser.type !== "candidate") {
          router.push("/auth/demo-login")
          return
        }

        setProfile({
          id: crmUser.id,
          full_name: crmUser.name,
          user_type: "candidate",
          is_verified: true,
          municipality_id: null,
          province: demoUser.province || "Ontario"
        })

        const demoServices: Service[] = CAMPAIGN_SERVICE_CATALOG
        setServices(demoServices)

        refreshDemoCandidateAccount(crmUser.id, crmUser.name)

        setLoading(false)
        return
      }

      // Regular authentication flow
      const supabase = createClient()
      
      // Check authentication
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/login?redirect=/candidate-portal")
        return
      }

      // Get profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      if (!profileData || profileData.user_type !== "candidate") {
        router.push("/")
        return
      }

      if (!profileData.is_verified) {
        router.push("/candidates?verification=pending")
        return
      }

      setProfile(profileData)

      // Get all available services
      const { data: servicesData } = await supabase
        .from("services")
        .select("*")
        .eq("active", true)
        .order("popular", { ascending: false })

      if (servicesData) setServices(servicesData)

      // Get candidate's subscribed services
      const { data: myServicesData } = await supabase
        .from("candidate_services")
        .select("*, services(*)")
        .eq("candidate_id", user.id)

      if (myServicesData) setMyServices(myServicesData)

      // Get service requests
      const { data: requestsData } = await supabase
        .from("service_requests")
        .select("*, services(*)")
        .eq("candidate_id", user.id)
        .order("created_at", { ascending: false })

      if (requestsData) setServiceRequests(requestsData)

      setLoading(false)
    }

    loadData()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05070a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-white/70">Loading your portal...</p>
        </div>
      </div>
    )
  }

  const activeServices = myServices.filter(s => s.status === "active").length
  const pendingRequests = serviceRequests.filter(r => r.status === "pending").length
  const completedRequests = serviceRequests.filter(r => r.status === "completed").length
  const activeRetainers = myServices.filter((service) => service.status === "active" && service.commercial_model === "monthly-retainer").length
  const launchProjects = myServices.filter((service) => service.commercial_model === "launch-project").length
  const monthlyRecurringCents = myServices
    .filter((service) => service.status === "active" && service.commercial_model === "monthly-retainer")
    .reduce((sum, service) => sum + (service.billing_cents ?? Math.round(service.services.price_monthly * 100)), 0)
  const launchValueCents = myServices
    .filter((service) => service.commercial_model === "launch-project")
    .reduce((sum, service) => sum + (service.billing_cents ?? Math.round(service.services.price_monthly * 100)), 0)
  const blueprint = profile ? getCampaignBlueprintForCandidate(profile.full_name) : undefined
  const modeledCampaignValueCents = campaignAccounts.reduce((sum, campaign) => sum + campaign.budget_cents, 0)
  const fullCampaignValueCents = blueprint?.fullCampaignValueCents ?? (modeledCampaignValueCents || (monthlyRecurringCents * 6 + launchValueCents))
  const stackCoverage = Array.from(new Map(
    myServices
      .map((service) => getCampaignStackForService(service.services))
      .filter((stack): stack is NonNullable<ReturnType<typeof getCampaignStackForService>> => Boolean(stack))
      .map((stack) => [stack.id, stack]),
  ).values())
  const totalWorkspaceItems = teamMembers.length + clientThreads.length + sharedFiles.length + meetings.length
  const completedTaskCount = deliveryTasks.filter((task) => task.status === "completed").length
  const inProgressTaskCount = deliveryTasks.filter((task) => task.status === "in_progress").length
  const openClientThreads = clientThreads.filter((thread) => thread.status !== "resolved").length
  const campaignScore = Math.min(
    100,
    20 +
      activeRetainers * 10 +
      Math.min(launchProjects, 3) * 8 +
      Math.min(stackCoverage.length, 6) * 6 +
      Math.min(campaignAccounts.length, 2) * 12 +
      Math.min(totalWorkspaceItems, 10) * 2 +
      Math.min(completedTaskCount, 5) * 3,
  )

  const handleCreateTeamMember = () => {
    if (!isDemoMode || !profile || !teamNameDraft.trim() || !teamEmailDraft.trim()) return

    CRMStore.createTeamMember({
      candidate_user_id: profile.id,
      candidate_name: profile.full_name,
      name: teamNameDraft.trim(),
      email: teamEmailDraft.trim(),
      role: teamRoleDraft,
      status: "invited",
      portal_access: true,
      permissions:
        teamRoleDraft === "campaign_manager"
          ? ["campaigns", "chat", "files", "meetings", "reporting"]
          : teamRoleDraft === "field_director"
            ? ["field", "volunteers", "chat", "meetings"]
            : teamRoleDraft === "designer"
              ? ["brand", "assets", "files"]
              : teamRoleDraft === "volunteer_coordinator"
                ? ["volunteers", "field", "chat"]
                : ["reporting", "campaigns", "files"],
    })

    setTeamNameDraft("")
    setTeamEmailDraft("")
    setTeamRoleDraft("campaign_manager")
    refreshDemoCandidateAccount(profile.id, profile.full_name)
  }

  const handleTeamStatusChange = (memberId: string, status: CRMStore.TeamMember["status"]) => {
    if (!isDemoMode || !profile) return
    CRMStore.updateTeamMemberStatus(memberId, status)
    refreshDemoCandidateAccount(profile.id, profile.full_name)
  }

  const handleCreateFile = () => {
    if (!isDemoMode || !profile || !fileNameDraft.trim()) return
    CRMStore.createSharedFile({
      candidate_user_id: profile.id,
      candidate_name: profile.full_name,
      name: fileNameDraft.trim(),
      category: fileCategoryDraft,
      uploaded_by: profile.full_name,
      role_visibility: ["campaign_manager", "field_director", "analyst", "candidate"],
      size_label: "1.0 MB",
    })
    setFileNameDraft("")
    setFileCategoryDraft("brief")
    refreshDemoCandidateAccount(profile.id, profile.full_name)
  }

  const handleCreateMeeting = () => {
    if (!isDemoMode || !profile || !meetingTitleDraft.trim() || !meetingDateDraft) return
    CRMStore.createMeeting({
      candidate_user_id: profile.id,
      candidate_name: profile.full_name,
      title: meetingTitleDraft.trim(),
      meeting_type: meetingTypeDraft,
      starts_at: new Date(meetingDateDraft).toISOString(),
      duration_minutes: 45,
      attendees: [profile.full_name, ...teamMembers.slice(0, 2).map((member) => member.name)],
      status: "scheduled",
      notes: "Portal-created coordination meeting.",
    })
    setMeetingTitleDraft("")
    setMeetingTypeDraft("strategy")
    setMeetingDateDraft("")
    refreshDemoCandidateAccount(profile.id, profile.full_name)
  }

  const handleMeetingStatus = (meetingId: string, status: CRMStore.Meeting["status"]) => {
    if (!isDemoMode || !profile) return
    CRMStore.updateMeetingStatus(meetingId, status)
    refreshDemoCandidateAccount(profile.id, profile.full_name)
  }

  const handlePostClientUpdate = (threadId: string) => {
    if (!isDemoMode || !profile) return
    const draft = threadReplyDrafts[threadId]?.trim()
    if (!draft) return
    CRMStore.postClientChatMessage(threadId, draft)
    setThreadReplyDrafts((current) => ({ ...current, [threadId]: "" }))
    refreshDemoCandidateAccount(profile.id, profile.full_name)
  }

  return (
    <div className="min-h-screen bg-[#05070a]">
      {/* Header */}
      <div className="border-b border-white/10 bg-[#06080c]">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                Welcome back, {profile?.full_name?.split(" ")[0] || "Candidate"}
              </h1>
              <p className="text-white/60 mt-1">
                Manage your campaign services and track your progress
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Verified Candidate
              </Badge>
              <Button
                onClick={() => setActiveTab("browse-services")}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Service
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {[
            { id: "overview", label: "Overview", icon: <LayoutDashboard className="w-4 h-4" /> },
            { id: "progress", label: "Progress", icon: <ClipboardList className="w-4 h-4" /> },
            { id: "services", label: "My Services", icon: <Package className="w-4 h-4" /> },
            { id: "browse-services", label: "Browse Services", icon: <Plus className="w-4 h-4" /> },
            { id: "campaigns", label: "Campaigns", icon: <ShieldCheck className="w-4 h-4" /> },
            { id: "requests", label: "Requests", icon: <FileText className="w-4 h-4" /> },
            { id: "files", label: "Files", icon: <FolderOpen className="w-4 h-4" /> },
            { id: "team", label: "Team", icon: <UserPlus className="w-4 h-4" /> },
            { id: "meetings", label: "Meetings", icon: <Calendar className="w-4 h-4" /> },
            { id: "billing", label: "Billing", icon: <CreditCard className="w-4 h-4" /> },
            { id: "settings", label: "Settings", icon: <Settings className="w-4 h-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white"
                  : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-[#0b0f16] border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/60 text-sm">Active Retainers</p>
                      <p className="text-3xl font-bold text-white mt-1">{activeRetainers}</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                      <Package className="w-6 h-6 text-blue-400" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <span className="text-white/50">MRR ${(monthlyRecurringCents / 100).toLocaleString()}/month</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#0b0f16] border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/60 text-sm">Launch Projects</p>
                      <p className="text-3xl font-bold text-white mt-1">{launchProjects}</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-yellow-400" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <span className="text-white/50">One-time value ${(launchValueCents / 100).toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#0b0f16] border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/60 text-sm">Campaign Account</p>
                      <p className="text-3xl font-bold text-white mt-1">{campaignAccounts.length}</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-green-400" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <span className="text-white/50">Full value ${(fullCampaignValueCents / 100).toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#0b0f16] border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/60 text-sm">Campaign Score</p>
                      <p className="text-3xl font-bold text-white mt-1">{campaignScore}%</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-purple-400" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Progress value={campaignScore} className="h-2 bg-white/10" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr] gap-6">
              <Card className="bg-[#0b0f16] border-white/10">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Commercial Model Snapshot</CardTitle>
                  <CardDescription className="text-white/50">
                    Monthly retainers run as recurring campaign operations. Launch work covers one-time setup and production. The full campaign value rolls both into one managed account.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-4">
                      <p className="text-xs uppercase tracking-wide text-green-300">Monthly retainers</p>
                      <p className="mt-2 text-2xl font-bold text-white">${(monthlyRecurringCents / 100).toLocaleString()}</p>
                      <p className="mt-1 text-sm text-white/60">{activeRetainers} active recurring services</p>
                    </div>
                    <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-4">
                      <p className="text-xs uppercase tracking-wide text-cyan-300">Launch work</p>
                      <p className="mt-2 text-2xl font-bold text-white">${(launchValueCents / 100).toLocaleString()}</p>
                      <p className="mt-1 text-sm text-white/60">{launchProjects} one-time delivery items</p>
                    </div>
                    <div className="rounded-xl border border-purple-500/20 bg-purple-500/10 p-4">
                      <p className="text-xs uppercase tracking-wide text-purple-300">Full campaign value</p>
                      <p className="mt-2 text-2xl font-bold text-white">${(fullCampaignValueCents / 100).toLocaleString()}</p>
                      <p className="mt-1 text-sm text-white/60">{blueprint ? `${blueprint.cycleMonths}-month modeled account` : "Derived from active CRM campaign account"}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-white">Active stack coverage</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {stackCoverage.length > 0 ? stackCoverage.map((stack) => (
                        <Badge key={stack.id} className="bg-white/10 text-white/80 border-white/15">
                          {stack.badge}
                        </Badge>
                      )) : (
                        <span className="text-sm text-white/50">No stack coverage yet.</span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#0b0f16] border-white/10">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Operations Totals</CardTitle>
                  <CardDescription className="text-white/50">
                    CRM-managed delivery items visible from the candidate side.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-3"><span className="text-white/60">Open delivery tasks</span><span className="font-semibold text-white">{pendingRequests}</span></div>
                  <div className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-3"><span className="text-white/60">Completed tasks</span><span className="font-semibold text-white">{completedRequests}</span></div>
                  <div className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-3"><span className="text-white/60">Team members</span><span className="font-semibold text-white">{teamMembers.length}</span></div>
                  <div className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-3"><span className="text-white/60">Client threads</span><span className="font-semibold text-white">{clientThreads.length}</span></div>
                  <div className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-3"><span className="text-white/60">Shared files</span><span className="font-semibold text-white">{sharedFiles.length}</span></div>
                  <div className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-3"><span className="text-white/60">Meetings</span><span className="font-semibold text-white">{meetings.length}</span></div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Quick Actions */}
              <Card className="bg-[#0b0f16] border-white/10">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Quick Actions</CardTitle>
                  <CardDescription className="text-white/50">
                    Common tasks for your campaign
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/candidate-portal/workspace" className="block">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                          <LayoutDashboard className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm">Team Workspace</p>
                          <p className="text-white/50 text-xs">Open chat, files, and meetings</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-white/30" />
                    </div>
                  </Link>

                  <Link href="/candidate-portal/services" className="block">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                          <Package className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm">Browse Services</p>
                          <p className="text-white/50 text-xs">Explore campaign tools</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-white/30" />
                    </div>
                  </Link>

                  <Link href="/candidate-portal/request" className="block">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm">New Request</p>
                          <p className="text-white/50 text-xs">Submit a service request</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-white/30" />
                    </div>
                  </Link>

                  <Link href="/simulation" className="block">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                          <Users className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm">Voter Simulation</p>
                          <p className="text-white/50 text-xs">Model Gen Z and Millennial turnout</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-white/30" />
                    </div>
                  </Link>

                  <Link href="/governance" className="block">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-orange-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm">Governance</p>
                          <p className="text-white/50 text-xs">Vote on proposals</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-white/30" />
                    </div>
                  </Link>
                </CardContent>
              </Card>

              {/* Recent Service Requests */}
              <Card className="bg-[#0b0f16] border-white/10 lg:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-white text-lg">Delivery Queue</CardTitle>
                    <CardDescription className="text-white/50">
                      CRM-backed delivery items for this candidate account
                    </CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
                    View All
                  </Button>
                </CardHeader>
                <CardContent>
                  {serviceRequests.length > 0 ? (
                    <div className="space-y-4">
                      {serviceRequests.slice(0, 4).map((request) => (
                        <div
                          key={request.id}
                          className="flex items-center justify-between p-4 rounded-lg bg-white/5"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                              {categoryIcons[request.services?.category] || <Package className="w-5 h-5 text-white/60" />}
                            </div>
                            <div>
                              <p className="text-white font-medium">{request.notes || request.services?.name}</p>
                              <p className="text-white/50 text-sm">
                                {request.services?.name} • {new Date(request.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Badge
                            className={
                              request.status === "completed"
                                ? "bg-green-500/20 text-green-400 border-green-500/30"
                                : request.status === "in_progress"
                                ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                                : request.status === "pending"
                                ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                                : "bg-white/10 text-white/60 border-white/20"
                            }
                          >
                            {request.status.replace("_", " ")}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-8 h-8 text-white/30" />
                      </div>
                      <p className="text-white/70 mb-2">No requests yet</p>
                      <p className="text-white/50 text-sm mb-4">
                        Start by subscribing to a service
                      </p>
                      <Link href="/candidate-portal/services">
                        <Button className="bg-blue-600 hover:bg-blue-500">
                          Browse Services
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Popular Services */}
            <Card className="bg-[#0b0f16] border-white/10">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-white text-lg">Recommended Services</CardTitle>
                  <CardDescription className="text-white/50">
                    Popular services for municipal candidates
                  </CardDescription>
                </div>
                <Link href="/candidate-portal/services">
                  <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
                    View All Services
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {services.filter(s => s.popular).slice(0, 4).map((service) => (
                    <Link
                      key={service.id}
                      href={`/candidate-portal/checkout?service=${service.id}`}
                      className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-blue-500/50 transition-all cursor-pointer group block"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                          {categoryIcons[service.category] || <Package className="w-5 h-5 text-blue-400" />}
                        </div>
                        {service.popular && (
                          <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-xs">
                            Popular
                          </Badge>
                        )}
                      </div>
                      <h3 className="text-white font-semibold mb-1 group-hover:text-blue-400 transition-colors">
                        {service.name}
                      </h3>
                      <p className="text-white/50 text-sm mb-3 line-clamp-2">
                        {service.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-blue-400 font-bold text-sm">
                          {service.price_display}
                        </span>
                        <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-blue-400 transition-colors" />
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "progress" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-white">Campaign Progress</h2>
              <p className="text-white/50 mt-1">Track delivery progress, stack completion, and live account operations from the client side.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-[#0b0f16] border-white/10"><CardContent className="p-5"><p className="text-white/50 text-sm">Pending Tasks</p><p className="text-3xl font-bold mt-1 text-white">{pendingRequests}</p></CardContent></Card>
              <Card className="bg-[#0b0f16] border-white/10"><CardContent className="p-5"><p className="text-white/50 text-sm">In Progress</p><p className="text-3xl font-bold mt-1 text-white">{inProgressTaskCount}</p></CardContent></Card>
              <Card className="bg-[#0b0f16] border-white/10"><CardContent className="p-5"><p className="text-white/50 text-sm">Completed</p><p className="text-3xl font-bold mt-1 text-white">{completedTaskCount}</p></CardContent></Card>
            </div>

            <Card className="bg-[#0b0f16] border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-lg">Delivery Timeline</CardTitle>
                <CardDescription className="text-white/50">Each CRM delivery task tied to your campaign account.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {deliveryTasks.map((task) => (
                  <div key={task.id} className="rounded-lg border border-white/10 bg-white/5 p-4 flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-white">{task.title}</p>
                      <p className="text-white/60 text-sm mt-1">{task.description || task.related_to}</p>
                      <p className="text-white/40 text-xs mt-2">Due {new Date(task.due_date).toLocaleDateString()}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className="bg-white/10 text-white/80 border-white/20">{task.priority}</Badge>
                      <Badge className={task.status === "completed" ? "bg-green-500/20 text-green-400 border-green-500/30" : task.status === "in_progress" ? "bg-blue-500/20 text-blue-400 border-blue-500/30" : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"}>{task.status.replaceAll("_", " ")}</Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {/* My Services Tab */}
        {activeTab === "services" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Campaign Delivery Items</h2>
              <Link href="/candidate-portal/services">
                <Button className="bg-blue-600 hover:bg-blue-500">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Service
                </Button>
              </Link>
            </div>

            {myServices.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {myServices.map((subscription) => {
                  const stack = getCampaignStackForService(subscription.services)

                  return (
                  <Card key={subscription.id} className="bg-[#0b0f16] border-white/10">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                          {categoryIcons[subscription.services?.category] || <Package className="w-6 h-6 text-blue-400" />}
                        </div>
                        <Badge
                          className={
                            subscription.status === "active"
                              ? "bg-green-500/20 text-green-400 border-green-500/30"
                              : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                          }
                        >
                          {subscription.status}
                        </Badge>
                      </div>
                      <h3 className="text-white font-semibold text-lg mb-1">
                        {subscription.services?.name}
                      </h3>
                      <p className="text-white/50 text-sm mb-4">
                        {subscription.services?.category} • {subscription.commercial_model === "launch-project" ? "Launch project" : "Monthly retainer"}
                      </p>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-white/45">Price</span>
                          <span className="font-medium text-white">{subscription.services?.price_display || "Contact for pricing"}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-white/45">Stack</span>
                          <span className="text-white/75 text-right">{stack?.badge || "General campaign ops"}</span>
                        </div>
                      </div>
                      {stack && (
                        <div className="rounded-lg border border-white/10 bg-white/5 p-3 mb-4">
                          <p className="text-xs font-semibold uppercase tracking-wide text-white/45">Stack details</p>
                          <p className="mt-1 text-sm text-white">{stack.title}</p>
                          <p className="mt-1 text-xs text-white/55 line-clamp-2">{stack.description}</p>
                        </div>
                      )}
                      <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <span className="text-white/50 text-sm">
                          Since {new Date(subscription.subscribed_at).toLocaleDateString()}
                        </span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-blue-400 hover:text-blue-300"
                          onClick={() => setManagingService(subscription)}
                        >
                          Manage
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )})}
              </div>
            ) : (
              <Card className="bg-[#0b0f16] border-white/10">
                <CardContent className="py-16 text-center">
                  <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                    <Package className="w-10 h-10 text-white/30" />
                  </div>
                  <h3 className="text-white text-xl font-semibold mb-2">No active services</h3>
                  <p className="text-white/50 mb-6 max-w-md mx-auto">
                    Start building your campaign with our professional services designed for municipal candidates.
                  </p>
                  <Link href="/candidate-portal/services">
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500">
                      Browse Services
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === "browse-services" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-white">Browse Services</h2>
              <p className="text-white/50 mt-1">Explore campaign templates, launch projects, and monthly retainers without leaving the portal.</p>
            </div>
            <CandidateServicesCatalog embedded />
          </div>
        )}

        {activeTab === "campaigns" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-white">Campaign Accounts</h2>
              <p className="text-white/50 mt-1">See the full campaign account, open client threads, and operational context attached to your services.</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {campaignAccounts.map((campaign) => (
                <Card key={campaign.id} className="bg-[#0b0f16] border-white/10">
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-white">{campaign.name}</p>
                        <p className="text-white/50 text-sm">{campaign.target_region}</p>
                      </div>
                      <Badge className="bg-white/10 text-white/80 border-white/20">{campaign.status}</Badge>
                    </div>
                    <p className="text-white/70 text-sm">Budget ${(campaign.budget_cents / 100).toLocaleString()} • Launch {new Date(campaign.launch_date).toLocaleDateString()}</p>
                    <div className="flex flex-wrap gap-2">
                      {campaign.goals.map((goal) => (
                        <Badge key={goal} variant="outline" className="border-white/20 text-white/70">{goal}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-[#0b0f16] border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-lg">Client Threads</CardTitle>
                <CardDescription className="text-white/50">Post account updates and review active communication threads.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="rounded-lg bg-white/5 p-4"><p className="text-white/50 text-sm">Open Threads</p><p className="text-2xl font-bold text-white mt-1">{openClientThreads}</p></div>
                  <div className="rounded-lg bg-white/5 p-4"><p className="text-white/50 text-sm">Resolved</p><p className="text-2xl font-bold text-white mt-1">{clientThreads.filter((thread) => thread.status === "resolved").length}</p></div>
                  <div className="rounded-lg bg-white/5 p-4"><p className="text-white/50 text-sm">High Priority</p><p className="text-2xl font-bold text-white mt-1">{clientThreads.filter((thread) => thread.priority === "high").length}</p></div>
                </div>
                {clientThreads.map((thread) => (
                  <div key={thread.id} className="rounded-lg border border-white/10 bg-white/5 p-4 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium text-white">{thread.subject}</p>
                        <p className="text-white/50 text-sm">Owner: {thread.owner_name}</p>
                        <p className="text-white/70 text-sm mt-2">{thread.last_message}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge className="bg-white/10 text-white/80 border-white/20">{thread.status}</Badge>
                        <Badge className={thread.priority === "high" ? "bg-red-500/20 text-red-400 border-red-500/30" : thread.priority === "medium" ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" : "bg-white/10 text-white/70 border-white/20"}>{thread.priority}</Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Textarea value={threadReplyDrafts[thread.id] || ""} onChange={(event) => setThreadReplyDrafts((current) => ({ ...current, [thread.id]: event.target.value }))} placeholder={isDemoMode ? "Post an account update to this thread" : "Demo mode required for posting updates"} className="bg-white/5 border-white/10 text-white placeholder:text-white/40" />
                      <Button onClick={() => handlePostClientUpdate(thread.id)} disabled={!isDemoMode}>Send</Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Requests Tab */}
        {activeTab === "requests" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Delivery Requests</h2>
              <Link href="/candidate-portal/request">
                <Button className="bg-blue-600 hover:bg-blue-500">
                  <Plus className="w-4 h-4 mr-2" />
                  New Request
                </Button>
              </Link>
            </div>

            {serviceRequests.length > 0 ? (
              <div className="space-y-4">
                {serviceRequests.map((request) => (
                  <Card key={request.id} className="bg-[#0b0f16] border-white/10">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                            {categoryIcons[request.services?.category] || <Package className="w-6 h-6 text-white/60" />}
                          </div>
                          <div>
                            <h3 className="text-white font-semibold">{request.notes || request.services?.name}</h3>
                            <p className="text-white/50 text-sm">
                              {request.services?.name} • {new Date(request.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge
                            className={
                              request.priority === "high"
                                ? "bg-red-500/20 text-red-400 border-red-500/30"
                                : request.priority === "medium"
                                ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                                : "bg-white/10 text-white/60 border-white/20"
                            }
                          >
                            {request.priority} priority
                          </Badge>
                          <Badge
                            className={
                              request.status === "completed"
                                ? "bg-green-500/20 text-green-400 border-green-500/30"
                                : request.status === "in_progress"
                                ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                                : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                            }
                          >
                            {request.status.replace("_", " ")}
                          </Badge>
                        </div>
                      </div>
                      {request.notes && (
                        <div className="mt-4 p-3 rounded-lg bg-white/5">
                          <p className="text-white/70 text-sm">{request.notes}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-[#0b0f16] border-white/10">
                <CardContent className="py-16 text-center">
                  <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                    <FileText className="w-10 h-10 text-white/30" />
                  </div>
                  <h3 className="text-white text-xl font-semibold mb-2">No requests yet</h3>
                  <p className="text-white/50 mb-6 max-w-md mx-auto">
                    Submit a request to get started with your campaign services.
                  </p>
                  <Link href="/candidate-portal/request">
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500">
                      Create Request
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === "files" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-white">File System</h2>
              <p className="text-white/50 mt-1">Campaign briefs, legal docs, field sheets, and creative files attached to your account.</p>
            </div>

            <Card className="bg-[#0b0f16] border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-lg">Add Shared File</CardTitle>
                <CardDescription className="text-white/50">Create a demo-side file record visible to your campaign workspace.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_180px_auto] gap-3">
                <Input value={fileNameDraft} onChange={(event) => setFileNameDraft(event.target.value)} placeholder="Campaign file name" className="bg-white/5 border-white/10 text-white placeholder:text-white/40" />
                <select value={fileCategoryDraft} onChange={(event) => setFileCategoryDraft(event.target.value as CRMStore.SharedFile["category"])} className="h-10 rounded-md border border-white/10 bg-white/5 px-3 text-white">
                  <option value="brief">Brief</option>
                  <option value="design">Design</option>
                  <option value="finance">Finance</option>
                  <option value="field">Field</option>
                  <option value="legal">Legal</option>
                </select>
                <Button onClick={handleCreateFile} disabled={!isDemoMode}>Add File</Button>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {sharedFiles.map((file) => (
                <Card key={file.id} className="bg-[#0b0f16] border-white/10">
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium text-white">{file.name}</p>
                        <p className="text-white/50 text-sm">{file.category} • {file.size_label}</p>
                      </div>
                      <FileText className="w-5 h-5 text-white/40" />
                    </div>
                    <p className="text-white/70 text-sm">Uploaded by {file.uploaded_by}</p>
                    <div className="flex flex-wrap gap-2">
                      {file.role_visibility.map((role) => (
                        <Badge key={`${file.id}-${role}`} variant="outline" className="border-white/20 text-white/70">{role.replaceAll("_", " ")}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === "team" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-white">Team Setup & Management</h2>
              <p className="text-white/50 mt-1">Invite campaign staff, assign roles, and manage who can work inside your account.</p>
            </div>

            <Card className="bg-[#0b0f16] border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-lg">Invite Team Member</CardTitle>
                <CardDescription className="text-white/50">Create a new team seat tied to this candidate account.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_180px_auto] gap-3">
                <Input value={teamNameDraft} onChange={(event) => setTeamNameDraft(event.target.value)} placeholder="Team member name" className="bg-white/5 border-white/10 text-white placeholder:text-white/40" />
                <Input value={teamEmailDraft} onChange={(event) => setTeamEmailDraft(event.target.value)} placeholder="email@campaign.demo" className="bg-white/5 border-white/10 text-white placeholder:text-white/40" />
                <select value={teamRoleDraft} onChange={(event) => setTeamRoleDraft(event.target.value as CRMStore.TeamMember["role"])} className="h-10 rounded-md border border-white/10 bg-white/5 px-3 text-white">
                  <option value="campaign_manager">Campaign Manager</option>
                  <option value="field_director">Field Director</option>
                  <option value="designer">Designer</option>
                  <option value="volunteer_coordinator">Volunteer Coordinator</option>
                  <option value="analyst">Analyst</option>
                </select>
                <Button onClick={handleCreateTeamMember} disabled={!isDemoMode}>Invite</Button>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {teamMembers.map((member) => (
                <Card key={member.id} className="bg-[#0b0f16] border-white/10">
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium text-white">{member.name}</p>
                        <p className="text-white/50 text-sm">{member.email}</p>
                      </div>
                      <Badge className="bg-white/10 text-white/80 border-white/20">{member.status}</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-white/70 text-sm">
                      <Users className="w-4 h-4" />
                      {member.role.replaceAll("_", " ")}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {member.permissions.map((permission) => (
                        <Badge key={`${member.id}-${permission}`} variant="outline" className="border-white/20 text-white/70">{permission.replaceAll("_", " ")}</Badge>
                      ))}
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" className="border-white/20 bg-transparent text-white hover:bg-white/10" onClick={() => handleTeamStatusChange(member.id, member.status === "active" ? "inactive" : "active")} disabled={!isDemoMode}>
                        {member.status === "active" ? "Deactivate" : "Activate"}
                      </Button>
                      {member.status === "invited" && (
                        <Button variant="outline" className="border-white/20 bg-transparent text-white hover:bg-white/10" onClick={() => handleTeamStatusChange(member.id, "active")} disabled={!isDemoMode}>
                          Approve Invite
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === "meetings" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-white">Meetings & Reviews</h2>
              <p className="text-white/50 mt-1">Schedule campaign reviews, strategy sessions, and working meetings tied to your account.</p>
            </div>

            <Card className="bg-[#0b0f16] border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-lg">Schedule Meeting</CardTitle>
                <CardDescription className="text-white/50">Create a new demo meeting for your team and client account.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_180px_220px_auto] gap-3">
                <Input value={meetingTitleDraft} onChange={(event) => setMeetingTitleDraft(event.target.value)} placeholder="Meeting title" className="bg-white/5 border-white/10 text-white placeholder:text-white/40" />
                <select value={meetingTypeDraft} onChange={(event) => setMeetingTypeDraft(event.target.value as CRMStore.Meeting["meeting_type"])} className="h-10 rounded-md border border-white/10 bg-white/5 px-3 text-white">
                  <option value="strategy">Strategy</option>
                  <option value="standup">Standup</option>
                  <option value="client_review">Client Review</option>
                  <option value="volunteer">Volunteer</option>
                </select>
                <Input type="datetime-local" value={meetingDateDraft} onChange={(event) => setMeetingDateDraft(event.target.value)} className="bg-white/5 border-white/10 text-white" />
                <Button onClick={handleCreateMeeting} disabled={!isDemoMode}>Schedule</Button>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {meetings.map((meeting) => (
                <Card key={meeting.id} className="bg-[#0b0f16] border-white/10">
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium text-white">{meeting.title}</p>
                        <p className="text-white/50 text-sm">{meeting.meeting_type.replaceAll("_", " ")} • {meeting.duration_minutes} minutes</p>
                      </div>
                      <Badge className="bg-white/10 text-white/80 border-white/20">{meeting.status}</Badge>
                    </div>
                    <p className="text-white/70 text-sm">{new Date(meeting.starts_at).toLocaleString()}</p>
                    <p className="text-white/70 text-sm">{meeting.notes}</p>
                    <div className="flex flex-wrap gap-2">
                      {meeting.attendees.map((attendee) => (
                        <Badge key={`${meeting.id}-${attendee}`} variant="outline" className="border-white/20 text-white/70">{attendee}</Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" className="border-white/20 bg-transparent text-white hover:bg-white/10" onClick={() => handleMeetingStatus(meeting.id, "live")} disabled={!isDemoMode}>Go Live</Button>
                      <Button variant="outline" className="border-white/20 bg-transparent text-white hover:bg-white/10" onClick={() => handleMeetingStatus(meeting.id, "completed")} disabled={!isDemoMode}>Complete</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Billing Tab */}
        {activeTab === "billing" && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white">Commercials & Billing</h2>
            <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_1fr] gap-6">
              <Card className="bg-[#0b0f16] border-white/10">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Billing Logic</CardTitle>
                  <CardDescription className="text-white/50">
                    Retainers bill monthly. Launch work lands as one-time orders. Full campaign value combines both into one candidate account.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-4">
                    <p className="text-sm font-medium text-green-300">Recurring retainers</p>
                    <p className="mt-1 text-2xl font-bold text-white">${(monthlyRecurringCents / 100).toLocaleString()}/month</p>
                    <div className="mt-3 space-y-2 text-sm text-white/70">
                      {myServices.filter((service) => service.commercial_model === "monthly-retainer").map((service) => (
                        <div key={service.id} className="flex items-center justify-between gap-3">
                          <span>{service.services.name}</span>
                          <span>${((service.billing_cents ?? Math.round(service.services.price_monthly * 100)) / 100).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-4">
                    <p className="text-sm font-medium text-cyan-300">Launch projects and setup</p>
                    <p className="mt-1 text-2xl font-bold text-white">${(launchValueCents / 100).toLocaleString()}</p>
                    <div className="mt-3 space-y-2 text-sm text-white/70">
                      {myServices.filter((service) => service.commercial_model === "launch-project").map((service) => (
                        <div key={service.id} className="flex items-center justify-between gap-3">
                          <span>{service.services.name}</span>
                          <span>${((service.billing_cents ?? Math.round(service.services.price_monthly * 100)) / 100).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#0b0f16] border-white/10">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Campaign Account Totals</CardTitle>
                  <CardDescription className="text-white/50">
                    What the candidate can see from their side of the CRM-managed account.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-3"><span className="text-white/60">Modeled campaign value</span><span className="font-semibold text-white">${(fullCampaignValueCents / 100).toLocaleString()}</span></div>
                  <div className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-3"><span className="text-white/60">CRM orders</span><span className="font-semibold text-white">{campaignOrders.length}</span></div>
                  <div className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-3"><span className="text-white/60">Active services</span><span className="font-semibold text-white">{activeServices}</span></div>
                  <div className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-3"><span className="text-white/60">Campaign accounts</span><span className="font-semibold text-white">{campaignAccounts.length}</span></div>
                  <div className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-3"><span className="text-white/60">Workspace items</span><span className="font-semibold text-white">{totalWorkspaceItems}</span></div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white">Account Settings</h2>
            <Card className="bg-[#0b0f16] border-white/10">
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                    <div>
                      <p className="text-white font-medium">Profile Information</p>
                      <p className="text-white/50 text-sm">Update your candidate profile</p>
                    </div>
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
                      Edit
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                    <div>
                      <p className="text-white font-medium">Email Notifications</p>
                      <p className="text-white/50 text-sm">Manage your email preferences</p>
                    </div>
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
                      Configure
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                    <div>
                      <p className="text-white font-medium">Security</p>
                      <p className="text-white/50 text-sm">Password and authentication</p>
                    </div>
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
                      Manage
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Manage Service Modal */}
      {managingService && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0d1117] border border-white/10 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Manage Service</h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setManagingService(null)}
                  className="text-white/50 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {(() => {
                const stack = getCampaignStackForService(managingService.services)

                return (
                  <>
              {/* Service Info */}
              <div className="bg-white/5 rounded-xl p-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                    <Package className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-lg">{managingService.services?.name}</h3>
                    <p className="text-white/50 text-sm">{managingService.services?.category}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={
                        managingService.status === "active" 
                          ? "bg-green-500/20 text-green-400 border-green-500/30"
                          : managingService.status === "completed"
                          ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                          : "bg-white/10 text-white/50 border-white/20"
                      }>
                        {managingService.status}
                      </Badge>
                      <span className="text-white/40 text-sm">
                        Since {new Date(managingService.subscribed_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-white/5 rounded-xl p-4">
                <h4 className="text-white font-medium mb-3">Commercial Details</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50">Price</span>
                    <span className="text-white font-medium">{managingService.services?.price_display || "Contact for pricing"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50">Type</span>
                    <span className="text-white">{managingService.commercial_model === "launch-project" ? "Launch project" : "Monthly retainer"}</span>
                  </div>
                  <div className="flex justify-between text-sm gap-4">
                    <span className="text-white/50">Stack</span>
                    <span className="text-white text-right">{stack?.badge || "General campaign ops"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50">Start Date</span>
                    <span className="text-white">{new Date(managingService.subscribed_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50">Status</span>
                    <span className="text-white capitalize">{managingService.status}</span>
                  </div>
                </div>
              </div>

              {stack && (
                <div className="bg-white/5 rounded-xl p-4">
                  <h4 className="text-white font-medium mb-3">Stack Details</h4>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm font-medium text-white">{stack.title}</p>
                      <p className="mt-1 text-sm text-white/60">{stack.description}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {stack.metrics.map((metric) => (
                        <Badge key={`${stack.id}-${metric.label}`} variant="outline" className="border-white/15 text-white/70 bg-white/5">
                          {metric.label}: {metric.value}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Features */}
              {managingService.services?.features && managingService.services.features.length > 0 && (
                <div className="bg-white/5 rounded-xl p-4">
                  <h4 className="text-white font-medium mb-3">Included Features</h4>
                  <ul className="space-y-2">
                    {managingService.services.features.map((feature: string, index: number) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-white/70">
                        <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-3">
                <Button 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500"
                  onClick={() => {
                    setManagingService(null)
                    setActiveTab("requests")
                  }}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  View Service Requests
                </Button>
                
                <Link href="/candidate-portal/request" className="block">
                  <Button 
                    variant="outline" 
                    className="w-full border-white/20 text-white hover:bg-white/10 bg-transparent"
                    onClick={() => setManagingService(null)}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Submit New Request
                  </Button>
                </Link>

                {managingService.status === "active" && (
                  <Button 
                    variant="ghost" 
                    className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    onClick={() => {
                      if (managingService.source === "subscription") {
                        CRMStore.cancelSubscription(managingService.id)
                      }
                      setMyServices(myServices.map((service) =>
                        service.id === managingService.id ? { ...service, status: "cancelled" } : service,
                      ))
                      setManagingService(null)
                    }}
                  >
                    Cancel Subscription
                  </Button>
                )}
              </div>
                  </>
                )
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
