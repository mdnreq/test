"use client"

import { Suspense, useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  Filter,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Vote,
  Megaphone,
  School,
  UserCircle,
  Building2,
  ChevronRight,
  Eye,
  Share2,
  Flag,
  Flame,
  Zap,
  Scale,
  Timer,
  ShieldCheck,
  HandshakeIcon,
  Send,
  BarChart3,
  Calendar,
  MapPin
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

// Types
interface Issue {
  id: string
  title: string
  description: string
  category: string
  author: {
    name: string
    type: "voter" | "candidate" | "school_council" | "organization"
    avatar: string
    verified: boolean
  }
  location?: string
  createdAt: string
  status: "open" | "under_review" | "proposal_created" | "resolved" | "rejected"
  upvotes: number
  downvotes: number
  comments: number
  tags: string[]
  hasVoted?: "up" | "down" | null
}

interface Proposal {
  id: string
  title: string
  description: string
  author: {
    name: string
    type: "voter" | "candidate" | "school_council" | "organization"
    avatar: string
  }
  linkedIssue?: string
  consensusMechanism: "quadratic" | "conviction" | "holographic" | "optimistic" | "multisig" | "liquid"
  category: string
  status: "active" | "passed" | "rejected" | "pending" | "vetoed"
  createdAt: string
  endsAt: string
  votes: {
    for: number
    against: number
    abstain: number
    quorum: number
    quorumReached: boolean
  }
  // Mechanism-specific data
  quadraticCost?: number
  convictionAccumulated?: number
  boosted?: boolean
  vetoWindow?: string
  signaturesRequired?: number
  signaturesCollected?: number
  delegatedVotes?: number
  userVote?: "for" | "against" | "abstain" | null
  userVotePower?: number
}

interface LiveSession {
  id: string
  title: string
  host: string
  hostType: "candidate" | "council_member" | "organization"
  startTime: string
  attendees: number
  maxAttendees: number
  status: "live" | "upcoming" | "ended"
  topics: string[]
}

function TownHallBoardContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState("issues")
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showCreateIssue, setShowCreateIssue] = useState(false)
  const [showCreateProposal, setShowCreateProposal] = useState(false)
  const [selectedMechanism, setSelectedMechanism] = useState<string>("quadratic")
  const [voteAmount, setVoteAmount] = useState(1)
  const [highlightedProposalId, setHighlightedProposalId] = useState<string | null>(null)
  const [actionMessage, setActionMessage] = useState("")
  const [joinedSessionIds, setJoinedSessionIds] = useState<string[]>([])
  const [reminderSessionIds, setReminderSessionIds] = useState<string[]>([])
  const [issueForm, setIssueForm] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    tags: "",
  })
  const [proposalForm, setProposalForm] = useState({
    title: "",
    description: "",
    linkedIssue: "",
    category: "",
    durationDays: "7",
  })

  // Demo data
  const [issues, setIssues] = useState<Issue[]>([
    {
      id: "1",
      title: "Extend public transit hours for night shift workers",
      description: "Many essential workers finish their shifts after midnight but have no safe public transit options. We need extended bus routes until 2 AM.",
      category: "Transportation",
      author: { name: "Maria Santos", type: "voter", avatar: "MS", verified: true },
      location: "Downtown District",
      createdAt: "2026-01-25",
      status: "proposal_created",
      upvotes: 847,
      downvotes: 23,
      comments: 156,
      tags: ["transit", "workers", "safety"],
      hasVoted: "up"
    },
    {
      id: "2",
      title: "More youth recreational spaces in Ward 5",
      description: "There are no safe spaces for teenagers to gather after school. We need a youth center with activities, study rooms, and mentorship programs.",
      category: "Youth Services",
      author: { name: "Jayden Chen", type: "school_council", avatar: "JC", verified: true },
      location: "Ward 5",
      createdAt: "2026-01-24",
      status: "under_review",
      upvotes: 623,
      downvotes: 45,
      comments: 89,
      tags: ["youth", "recreation", "community"],
      hasVoted: null
    },
    {
      id: "3",
      title: "Implement ranked-choice voting for municipal elections",
      description: "To better represent voter preferences and reduce strategic voting, we should adopt ranked-choice voting for all municipal positions.",
      category: "Electoral Reform",
      author: { name: "Councillor Patel", type: "candidate", avatar: "CP", verified: true },
      createdAt: "2026-01-23",
      status: "open",
      upvotes: 1204,
      downvotes: 312,
      comments: 445,
      tags: ["democracy", "voting", "reform"],
      hasVoted: null
    },
    {
      id: "4",
      title: "Green spaces maintenance in residential areas",
      description: "Parks and community gardens are not being maintained properly. Grass is overgrown and playground equipment needs repair.",
      category: "Environment",
      author: { name: "Northside Community Assoc.", type: "organization", avatar: "NC", verified: true },
      location: "Northside",
      createdAt: "2026-01-22",
      status: "resolved",
      upvotes: 534,
      downvotes: 12,
      comments: 67,
      tags: ["parks", "maintenance", "community"],
      hasVoted: "up"
    },
    {
      id: "5",
      title: "Lower voting age to 16 for municipal elections",
      description: "Millennials have untapped civic potential. Digital engagement campaigns can increase voter turnout by 8-12% and better represent our community.",
      category: "Electoral Reform",
      author: { name: "Youth Assembly Council", type: "school_council", avatar: "YA", verified: true },
      createdAt: "2026-01-20",
      status: "proposal_created",
      upvotes: 2341,
      downvotes: 567,
      comments: 892,
      tags: ["youth", "voting", "democracy"],
      hasVoted: "up"
    }
  ])

  const [proposals, setProposals] = useState<Proposal[]>([
    {
      id: "p1",
      title: "Millennial Mobilization: Digital Campaigns for Municipal Engagement",
      description: "Amend municipal charter to allow 16 and 17 year olds to vote in local elections, with civic education requirements.",
      author: { name: "Youth Assembly", type: "school_council", avatar: "YA" },
      linkedIssue: "5",
      consensusMechanism: "quadratic",
      category: "Electoral Reform",
      status: "active",
      createdAt: "2026-01-21",
      endsAt: "2026-02-05",
      votes: { for: 15234, against: 4521, abstain: 892, quorum: 20000, quorumReached: true },
      quadraticCost: 4,
      userVote: "for",
      userVotePower: 2
    },
    {
      id: "p2",
      title: "Extended Transit Hours Initiative",
      description: "Extend bus routes 1, 4, 7, and 12 until 2 AM on weekdays to support night shift workers. Estimated cost: $1.2M annually.",
      author: { name: "Maria Santos", type: "voter", avatar: "MS" },
      linkedIssue: "1",
      consensusMechanism: "conviction",
      category: "Transportation",
      status: "active",
      createdAt: "2026-01-26",
      endsAt: "2026-02-10",
      votes: { for: 8934, against: 1245, abstain: 234, quorum: 10000, quorumReached: false },
      convictionAccumulated: 67,
      userVote: null,
      userVotePower: 0
    },
    {
      id: "p3",
      title: "Emergency Climate Action Fund",
      description: "Allocate $5M from treasury to immediate climate resilience projects including flood barriers and cooling centers.",
      author: { name: "Green Coalition", type: "organization", avatar: "GC" },
      consensusMechanism: "holographic",
      category: "Environment",
      status: "active",
      createdAt: "2026-01-24",
      endsAt: "2026-02-01",
      votes: { for: 12456, against: 3421, abstain: 567, quorum: 15000, quorumReached: true },
      boosted: true,
      userVote: null,
      userVotePower: 0
    },
    {
      id: "p4",
      title: "Community Policing Reform Package",
      description: "Implement community oversight board, mandatory de-escalation training, and redirect 10% of police budget to social services.",
      author: { name: "Councillor Williams", type: "candidate", avatar: "CW" },
      consensusMechanism: "optimistic",
      category: "Public Safety",
      status: "pending",
      createdAt: "2026-01-27",
      endsAt: "2026-02-03",
      votes: { for: 0, against: 0, abstain: 0, quorum: 0, quorumReached: false },
      vetoWindow: "5 days remaining",
      userVote: null,
      userVotePower: 0
    },
    {
      id: "p5",
      title: "Treasury Release: Youth Center Construction",
      description: "Release $2.5M from DAO treasury for Ward 5 Youth Center construction. Requires 5/7 council signatures.",
      author: { name: "Ward 5 Representative", type: "candidate", avatar: "W5" },
      linkedIssue: "2",
      consensusMechanism: "multisig",
      category: "Youth Services",
      status: "active",
      createdAt: "2026-01-25",
      endsAt: "2026-02-08",
      votes: { for: 0, against: 0, abstain: 0, quorum: 0, quorumReached: false },
      signaturesRequired: 7,
      signaturesCollected: 4,
      userVote: null,
      userVotePower: 0
    }
  ])

  const [liveSessions, setLiveSessions] = useState<LiveSession[]>([
    {
      id: "l1",
      title: "Youth Voting Rights Town Hall",
      host: "Youth Assembly Council",
      hostType: "council_member",
      startTime: "Live Now",
      attendees: 234,
      maxAttendees: 500,
      status: "live",
      topics: ["Gen Z & Millennial Engagement", "Digital Mobilization", "Turnout Optimization"]
    },
    {
      id: "l2",
      title: "Transit Workers Q&A Session",
      host: "Maria Santos",
      hostType: "candidate",
      startTime: "Today 7:00 PM",
      attendees: 0,
      maxAttendees: 200,
      status: "upcoming",
      topics: ["Night Routes", "Worker Safety", "Budget"]
    },
    {
      id: "l3",
      title: "Climate Action Planning Meeting",
      host: "Green Coalition",
      hostType: "organization",
      startTime: "Tomorrow 2:00 PM",
      attendees: 0,
      maxAttendees: 300,
      status: "upcoming",
      topics: ["Flood Prevention", "Green Infrastructure", "Funding"]
    }
  ])

  const categories = [
    "All Categories",
    "Transportation",
    "Youth Services",
    "Electoral Reform",
    "Environment",
    "Public Safety",
    "Housing",
    "Education",
    "Healthcare",
    "Economy"
  ]

  const consensusMechanisms = [
    { id: "quadratic", name: "Quadratic Voting", icon: Scale, description: "Cost increases quadratically - prevents whale dominance" },
    { id: "conviction", name: "Conviction Voting", icon: Timer, description: "Votes gain power over time - rewards commitment" },
    { id: "holographic", name: "Holographic Consensus", icon: Zap, description: "Prediction markets boost important proposals" },
    { id: "optimistic", name: "Optimistic Governance", icon: ShieldCheck, description: "Passes unless vetoed by Youth Assembly" },
    { id: "multisig", name: "Multi-Signature", icon: HandshakeIcon, description: "Requires multiple council signatures" },
    { id: "liquid", name: "Liquid Democracy", icon: Users, description: "Delegate your votes to representatives" }
  ]

  useEffect(() => {
    const savedBoard = localStorage.getItem("tnm-town-hall-board")
    if (!savedBoard) return

    try {
      const parsed = JSON.parse(savedBoard)
      if (Array.isArray(parsed.issues)) setIssues(parsed.issues)
      if (Array.isArray(parsed.proposals)) setProposals(parsed.proposals)
      if (Array.isArray(parsed.liveSessions)) setLiveSessions(parsed.liveSessions)
      if (Array.isArray(parsed.joinedSessionIds)) setJoinedSessionIds(parsed.joinedSessionIds)
      if (Array.isArray(parsed.reminderSessionIds)) setReminderSessionIds(parsed.reminderSessionIds)
    } catch {
      localStorage.removeItem("tnm-town-hall-board")
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(
      "tnm-town-hall-board",
      JSON.stringify({ issues, proposals, liveSessions, joinedSessionIds, reminderSessionIds }),
    )
  }, [issues, proposals, liveSessions, joinedSessionIds, reminderSessionIds])

  useEffect(() => {
    const requestedTab = searchParams.get("tab")
    const requestedProposal = searchParams.get("proposal")

    if (requestedTab && ["issues", "proposals", "sessions", "results"].includes(requestedTab)) {
      setActiveTab(requestedTab)
    }

    if (!requestedProposal) return

    const matchedProposal = proposals.find(
      (proposal) =>
        proposal.id === requestedProposal ||
        proposal.id === `p${requestedProposal}` ||
        proposal.id.replace(/^p/, "") === requestedProposal,
    )

    if (matchedProposal) {
      setActiveTab("proposals")
      setHighlightedProposalId(matchedProposal.id)
    }
  }, [proposals, searchParams])

  useEffect(() => {
    if (!actionMessage) return

    const timeoutId = window.setTimeout(() => setActionMessage(""), 2500)
    return () => window.clearTimeout(timeoutId)
  }, [actionMessage])

  useEffect(() => {
    if (!highlightedProposalId) return

    const timeoutId = window.setTimeout(() => setHighlightedProposalId(null), 3000)
    return () => window.clearTimeout(timeoutId)
  }, [highlightedProposalId])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "under_review": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "proposal_created": return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      case "resolved": return "bg-green-500/20 text-green-400 border-green-500/30"
      case "rejected": return "bg-red-500/20 text-red-400 border-red-500/30"
      case "active": return "bg-green-500/20 text-green-400 border-green-500/30"
      case "passed": return "bg-green-500/20 text-green-400 border-green-500/30"
      case "pending": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "vetoed": return "bg-red-500/20 text-red-400 border-red-500/30"
      default: return "bg-white/10 text-white/70 border-white/20"
    }
  }

  const getAuthorTypeIcon = (type: string) => {
    switch (type) {
      case "voter": return UserCircle
      case "candidate": return Megaphone
      case "school_council": return School
      case "organization": return Building2
      default: return UserCircle
    }
  }

  const getMechanismIcon = (mechanism: string) => {
    const found = consensusMechanisms.find(m => m.id === mechanism)
    return found?.icon || Vote
  }

  const handleVoteIssue = (issueId: string, voteType: "up" | "down") => {
    setIssues(issues.map(issue => {
      if (issue.id === issueId) {
        const wasUp = issue.hasVoted === "up"
        const wasDown = issue.hasVoted === "down"
        const isNewVote = issue.hasVoted === null

        let newUpvotes = issue.upvotes
        let newDownvotes = issue.downvotes

        if (voteType === "up") {
          if (wasUp) {
            newUpvotes -= 1
            return { ...issue, upvotes: newUpvotes, hasVoted: null }
          } else {
            newUpvotes += 1
            if (wasDown) newDownvotes -= 1
            return { ...issue, upvotes: newUpvotes, downvotes: newDownvotes, hasVoted: "up" as const }
          }
        } else {
          if (wasDown) {
            newDownvotes -= 1
            return { ...issue, downvotes: newDownvotes, hasVoted: null }
          } else {
            newDownvotes += 1
            if (wasUp) newUpvotes -= 1
            return { ...issue, upvotes: newUpvotes, downvotes: newDownvotes, hasVoted: "down" as const }
          }
        }
      }
      return issue
    }))
  }

  const handleOpenProposalComposer = (issue?: Issue) => {
    setSelectedMechanism(issue?.status === "proposal_created" ? selectedMechanism : "quadratic")
    setProposalForm((current) => ({
      ...current,
      title: issue ? `${issue.title} Proposal` : current.title,
      linkedIssue: issue?.id || current.linkedIssue,
      category: issue?.category || current.category,
      description: issue ? `Proposal responding to: ${issue.description}` : current.description,
    }))
    setShowCreateProposal(true)
  }

  const handleSubmitIssue = () => {
    if (!issueForm.title.trim() || !issueForm.description.trim() || !issueForm.category) {
      setActionMessage("Issue title, description, and category are required.")
      return
    }

    const demoUser = JSON.parse(localStorage.getItem("tnm-demo-user") || "{}")
    const nextIssue: Issue = {
      id: `${Date.now()}`,
      title: issueForm.title.trim(),
      description: issueForm.description.trim(),
      category: issueForm.category,
      author: {
        name: demoUser.full_name || "Community Member",
        type: demoUser.user_type === "candidate" ? "candidate" : demoUser.user_type === "school_council" ? "school_council" : "voter",
        avatar: (demoUser.full_name || "CM")
          .split(" ")
          .map((part: string) => part[0])
          .join("")
          .slice(0, 2)
          .toUpperCase(),
        verified: true,
      },
      location: issueForm.location.trim() || undefined,
      createdAt: new Date().toISOString().split("T")[0],
      status: "open",
      upvotes: 1,
      downvotes: 0,
      comments: 0,
      tags: issueForm.tags
        .split(",")
        .map((tag) => tag.trim().replace(/^#/, ""))
        .filter(Boolean),
      hasVoted: "up",
    }

    setIssues((current) => [nextIssue, ...current])
    setIssueForm({ title: "", description: "", category: "", location: "", tags: "" })
    setShowCreateIssue(false)
    setActionMessage("Issue submitted to the board.")
  }

  const handleSubmitProposal = () => {
    if (!proposalForm.title.trim() || !proposalForm.description.trim() || !proposalForm.category) {
      setActionMessage("Proposal title, description, and category are required.")
      return
    }

    const demoUser = JSON.parse(localStorage.getItem("tnm-demo-user") || "{}")
    const durationDays = Number(proposalForm.durationDays || 7)
    const proposalId = `p${Date.now()}`
    const nextProposal: Proposal = {
      id: proposalId,
      title: proposalForm.title.trim(),
      description: proposalForm.description.trim(),
      author: {
        name: demoUser.full_name || "Community Member",
        type: demoUser.user_type === "candidate" ? "candidate" : demoUser.user_type === "school_council" ? "school_council" : "voter",
        avatar: (demoUser.full_name || "CM")
          .split(" ")
          .map((part: string) => part[0])
          .join("")
          .slice(0, 2)
          .toUpperCase(),
      },
      linkedIssue: proposalForm.linkedIssue || undefined,
      consensusMechanism: selectedMechanism as Proposal["consensusMechanism"],
      category: proposalForm.category,
      status: "active",
      createdAt: new Date().toISOString().split("T")[0],
      endsAt: new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      votes: { for: 0, against: 0, abstain: 0, quorum: 1000, quorumReached: false },
      userVote: null,
      userVotePower: 0,
      quadraticCost: selectedMechanism === "quadratic" ? 1 : undefined,
      convictionAccumulated: selectedMechanism === "conviction" ? 0 : undefined,
      boosted: selectedMechanism === "holographic" ? false : undefined,
      vetoWindow: selectedMechanism === "optimistic" ? `${durationDays} days remaining` : undefined,
      signaturesRequired: selectedMechanism === "multisig" ? 5 : undefined,
      signaturesCollected: selectedMechanism === "multisig" ? 1 : undefined,
      delegatedVotes: selectedMechanism === "liquid" ? 0 : undefined,
    }

    setProposals((current) => [nextProposal, ...current])
    if (proposalForm.linkedIssue) {
      setIssues((current) =>
        current.map((issue) =>
          issue.id === proposalForm.linkedIssue ? { ...issue, status: "proposal_created" } : issue,
        ),
      )
    }
    setProposalForm({ title: "", description: "", linkedIssue: "", category: "", durationDays: "7" })
    setShowCreateProposal(false)
    setActiveTab("proposals")
    setHighlightedProposalId(proposalId)
    setActionMessage("Proposal created and added to the board.")
    router.replace(`/governance/town-hall?proposal=${proposalId}`)
  }

  const handleFocusProposal = (issue: Issue) => {
    const linkedProposal = proposals.find((proposal) => proposal.linkedIssue === issue.id)
    if (linkedProposal) {
      setActiveTab("proposals")
      setHighlightedProposalId(linkedProposal.id)
      router.replace(`/governance/town-hall?proposal=${linkedProposal.id}`)
      return
    }

    handleOpenProposalComposer(issue)
  }

  const handleShareItem = async (itemType: "issue" | "proposal", itemId: string) => {
    const url = `${window.location.origin}/governance/town-hall?${itemType}=${itemId}`
    try {
      await navigator.clipboard.writeText(url)
      setActionMessage(`${itemType === "issue" ? "Issue" : "Proposal"} link copied.`)
    } catch {
      setActionMessage("Unable to copy link on this device.")
    }
  }

  const handleSessionAction = (sessionId: string) => {
    const session = liveSessions.find((item) => item.id === sessionId)
    if (!session) return

    if (session.status === "live") {
      const isJoined = joinedSessionIds.includes(sessionId)
      setJoinedSessionIds((current) =>
        isJoined ? current.filter((id) => id !== sessionId) : [...current, sessionId],
      )
      setLiveSessions((current) =>
        current.map((item) => {
          if (item.id !== sessionId) return item
          const attendees = isJoined ? Math.max(0, item.attendees - 1) : Math.min(item.maxAttendees, item.attendees + 1)
          return { ...item, attendees }
        }),
      )
      setActionMessage(isJoined ? "Left live session." : "Joined live session.")
      return
    }

    const hasReminder = reminderSessionIds.includes(sessionId)
    setReminderSessionIds((current) =>
      hasReminder ? current.filter((id) => id !== sessionId) : [...current, sessionId],
    )
    setActionMessage(hasReminder ? "Reminder removed." : "Session reminder set.")
  }

  const handleScheduleSession = () => {
    const demoUser = JSON.parse(localStorage.getItem("tnm-demo-user") || "{}")
    const nextSession: LiveSession = {
      id: `l${Date.now()}`,
      title: `${demoUser.full_name || "Community"} Town Hall`,
      host: demoUser.full_name || "Verified Host",
      hostType: demoUser.user_type === "organization" ? "organization" : "candidate",
      startTime: "Tomorrow 6:00 PM",
      attendees: 0,
      maxAttendees: 150,
      status: "upcoming",
      topics: ["Community priorities", "Board follow-up"],
    }
    setLiveSessions((current) => [nextSession, ...current])
    setActiveTab("sessions")
    setActionMessage("Town hall session scheduled.")
  }

  const openIssueCount = issues.filter((issue) => issue.status !== "resolved" && issue.status !== "rejected").length
  const totalVotesCast = proposals.reduce(
    (sum, proposal) => sum + proposal.votes.for + proposal.votes.against + proposal.votes.abstain,
    0,
  )
  const participationRate = Math.round(
    ((issues.filter((issue) => issue.hasVoted).length + proposals.filter((proposal) => proposal.userVote).length) /
      Math.max(1, issues.length + proposals.length)) *
      100,
  )
  const passedProposals = proposals.filter((proposal) => proposal.status === "passed")
  const rejectedProposals = proposals.filter((proposal) => proposal.status === "rejected" || proposal.status === "vetoed")
  const resolvedIssues = issues.filter((issue) => issue.status === "resolved")

  const handleVoteProposal = (proposalId: string, voteType: "for" | "against" | "abstain", power: number = 1) => {
    setProposals(proposals.map(proposal => {
      if (proposal.id === proposalId) {
        const newVotes = { ...proposal.votes }
        if (voteType === "for") newVotes.for += power
        else if (voteType === "against") newVotes.against += power
        else newVotes.abstain += power
        
        return { 
          ...proposal, 
          votes: newVotes, 
          userVote: voteType, 
          userVotePower: power 
        }
      }
      return proposal
    }))
  }

  const filteredIssues = issues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         issue.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || issue.category === categoryFilter
    const matchesStatus = statusFilter === "all" || issue.status === statusFilter
    return matchesSearch && matchesCategory && matchesStatus
  })

  const filteredProposals = proposals.filter(proposal => {
    const matchesSearch = proposal.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || proposal.category === categoryFilter
    const matchesStatus = statusFilter === "all" || proposal.status === statusFilter
    return matchesSearch && matchesCategory && matchesStatus
  })

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <div className="border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/governance">
                <Button variant="ghost" size="sm" className="text-white/70 hover:text-white">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Governance
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-white">Town Hall Board</h1>
                <p className="text-white/50 text-sm">Raise issues, create proposals, vote together</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                onClick={() => setShowCreateIssue(true)}
              >
                <Flag className="w-4 h-4 mr-2" />
                Raise Issue
              </Button>
              <Button 
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500"
                onClick={() => setShowCreateProposal(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Proposal
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {actionMessage && (
          <div className="mb-4 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-200">
            {actionMessage}
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-white">{openIssueCount}</div>
              <div className="text-sm text-white/50">Open Issues</div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-white">{proposals.filter(p => p.status === "active").length}</div>
              <div className="text-sm text-white/50">Active Proposals</div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-white">{liveSessions.filter(s => s.status === "live").length}</div>
              <div className="text-sm text-white/50">Live Sessions</div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-white">{totalVotesCast.toLocaleString()}</div>
              <div className="text-sm text-white/50">Total Votes Cast</div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-white">{participationRate}%</div>
              <div className="text-sm text-white/50">Participation Rate</div>
            </CardContent>
          </Card>
        </div>

        {/* Live Sessions Banner */}
        {liveSessions.some(s => s.status === "live") && (
          <Card className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border-red-500/30 mb-8">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                    <span className="text-red-400 font-semibold">LIVE NOW</span>
                  </div>
                  <div>
                    <div className="text-white font-medium">{liveSessions.find(s => s.status === "live")?.title}</div>
                    <div className="text-white/50 text-sm">{liveSessions.find(s => s.status === "live")?.attendees} attending</div>
                  </div>
                </div>
                <Button className="bg-red-500 hover:bg-red-600 text-white" onClick={() => handleSessionAction(liveSessions.find(s => s.status === "live")?.id || "") }>
                  {joinedSessionIds.includes(liveSessions.find(s => s.status === "live")?.id || "") ? "Leave Session" : "Join Session"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
            <Input
              placeholder="Search issues and proposals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full md:w-48 bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.slice(1).map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-40 bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="under_review">Under Review</SelectItem>
              <SelectItem value="proposal_created">Has Proposal</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-white/5 border border-white/10 mb-6">
            <TabsTrigger value="issues" className="data-[state=active]:bg-white/10">
              <Flag className="w-4 h-4 mr-2" />
              Issues ({issues.length})
            </TabsTrigger>
            <TabsTrigger value="proposals" className="data-[state=active]:bg-white/10">
              <Vote className="w-4 h-4 mr-2" />
              Proposals ({proposals.length})
            </TabsTrigger>
            <TabsTrigger value="sessions" className="data-[state=active]:bg-white/10">
              <Users className="w-4 h-4 mr-2" />
              Live Sessions
            </TabsTrigger>
            <TabsTrigger value="results" className="data-[state=active]:bg-white/10">
              <BarChart3 className="w-4 h-4 mr-2" />
              Results
            </TabsTrigger>
          </TabsList>

          {/* Issues Tab */}
          <TabsContent value="issues" className="space-y-4">
            {filteredIssues.map(issue => {
              const AuthorIcon = getAuthorTypeIcon(issue.author.type)
              return (
                <Card key={issue.id} className="bg-white/5 border-white/10 hover:bg-white/[0.07] transition-colors">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      {/* Vote Buttons */}
                      <div className="flex flex-col items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`p-2 ${issue.hasVoted === "up" ? "text-green-400 bg-green-500/20" : "text-white/50 hover:text-green-400"}`}
                          onClick={() => handleVoteIssue(issue.id, "up")}
                        >
                          <ThumbsUp className="w-5 h-5" />
                        </Button>
                        <span className={`font-bold ${issue.upvotes - issue.downvotes > 0 ? "text-green-400" : issue.upvotes - issue.downvotes < 0 ? "text-red-400" : "text-white/50"}`}>
                          {issue.upvotes - issue.downvotes}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`p-2 ${issue.hasVoted === "down" ? "text-red-400 bg-red-500/20" : "text-white/50 hover:text-red-400"}`}
                          onClick={() => handleVoteIssue(issue.id, "down")}
                        >
                          <ThumbsDown className="w-5 h-5" />
                        </Button>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge className={getStatusColor(issue.status)}>
                                {issue.status.replace("_", " ")}
                              </Badge>
                              <Badge variant="outline" className="border-white/20 text-white/70">
                                {issue.category}
                              </Badge>
                              {issue.status === "proposal_created" && (
                                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                                  <Vote className="w-3 h-3 mr-1" />
                                  Vote Now
                                </Badge>
                              )}
                            </div>
                            <h3 className="text-lg font-semibold text-white hover:text-blue-400 cursor-pointer" onClick={() => handleFocusProposal(issue)}>
                              {issue.title}
                            </h3>
                          </div>
                        </div>

                        <p className="text-white/60 text-sm mb-3 line-clamp-2">
                          {issue.description}
                        </p>

                        <div className="flex items-center gap-4 text-sm text-white/50">
                          <div className="flex items-center gap-2">
                            <Avatar className="w-6 h-6">
                              <AvatarFallback className="text-xs bg-white/10">{issue.author.avatar}</AvatarFallback>
                            </Avatar>
                            <span>{issue.author.name}</span>
                            <AuthorIcon className="w-4 h-4" />
                            {issue.author.verified && (
                              <CheckCircle2 className="w-4 h-4 text-blue-400" />
                            )}
                          </div>
                          {issue.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {issue.location}
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {issue.createdAt}
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="w-4 h-4" />
                            {issue.comments} comments
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mt-3">
                          {issue.tags.map(tag => (
                            <Badge key={tag} variant="outline" className="border-white/10 text-white/50 text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2">
                        <Button variant="ghost" size="sm" className="text-white/50 hover:text-white">
                          <Eye className="w-4 h-4" onClick={() => handleFocusProposal(issue)} />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-white/50 hover:text-white" onClick={() => handleShareItem("issue", issue.id)}>
                          <Share2 className="w-4 h-4" />
                        </Button>
                        {issue.status === "open" && (
                          <Button 
                            size="sm" 
                            className="bg-purple-500/20 text-purple-400 hover:bg-purple-500/30"
                            onClick={() => handleOpenProposalComposer(issue)}
                          >
                            <Vote className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </TabsContent>

          {/* Proposals Tab */}
          <TabsContent value="proposals" className="space-y-4">
            {/* Consensus Mechanism Filter */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
              <Button
                variant={selectedMechanism === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedMechanism("all")}
                className={selectedMechanism === "all" ? "bg-white/20" : "bg-transparent border-white/20 text-white/70"}
              >
                All Mechanisms
              </Button>
              {consensusMechanisms.map(mech => {
                const Icon = mech.icon
                return (
                  <Button
                    key={mech.id}
                    variant={selectedMechanism === mech.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedMechanism(mech.id)}
                    className={selectedMechanism === mech.id ? "bg-white/20" : "bg-transparent border-white/20 text-white/70"}
                  >
                    <Icon className="w-4 h-4 mr-1" />
                    {mech.name}
                  </Button>
                )
              })}
            </div>

            {filteredProposals
              .filter(p => selectedMechanism === "all" || p.consensusMechanism === selectedMechanism)
              .map(proposal => {
                const MechIcon = getMechanismIcon(proposal.consensusMechanism)
                const totalVotes = proposal.votes.for + proposal.votes.against + proposal.votes.abstain
                const forPercent = totalVotes > 0 ? (proposal.votes.for / totalVotes) * 100 : 0
                const againstPercent = totalVotes > 0 ? (proposal.votes.against / totalVotes) * 100 : 0

                return (
                  <Card key={proposal.id} className={`bg-white/5 border-white/10 transition-all ${highlightedProposalId === proposal.id ? "ring-2 ring-cyan-400/80 border-cyan-400/60" : ""}`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getStatusColor(proposal.status)}>
                              {proposal.status}
                            </Badge>
                            <Badge variant="outline" className="border-white/20 text-white/70">
                              <MechIcon className="w-3 h-3 mr-1" />
                              {consensusMechanisms.find(m => m.id === proposal.consensusMechanism)?.name}
                            </Badge>
                            <Badge variant="outline" className="border-white/20 text-white/70">
                              {proposal.category}
                            </Badge>
                            {proposal.boosted && (
                              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                                <Flame className="w-3 h-3 mr-1" />
                                Boosted
                              </Badge>
                            )}
                          </div>
                          <h3 className="text-xl font-semibold text-white mb-2">{proposal.title}</h3>
                          <p className="text-white/60 text-sm mb-4">{proposal.description}</p>

                          {/* Mechanism-specific UI */}
                          {proposal.consensusMechanism === "quadratic" && (
                            <div className="bg-white/5 rounded-lg p-4 mb-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-white/70 text-sm">Quadratic Vote Cost</span>
                                <span className="text-white font-medium">{voteAmount}x vote = {voteAmount * voteAmount} tokens</span>
                              </div>
                              <Slider
                                value={[voteAmount]}
                                onValueChange={([v]) => setVoteAmount(v)}
                                min={1}
                                max={10}
                                step={1}
                                className="mb-2"
                              />
                              <div className="text-xs text-white/50">
                                Formula: Cost = (Votes)². More votes cost exponentially more tokens.
                              </div>
                            </div>
                          )}

                          {proposal.consensusMechanism === "conviction" && (
                            <div className="bg-white/5 rounded-lg p-4 mb-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-white/70 text-sm">Conviction Accumulated</span>
                                <span className="text-cyan-400 font-medium">{proposal.convictionAccumulated}%</span>
                              </div>
                              <Progress value={proposal.convictionAccumulated} className="h-2 mb-2" />
                              <div className="text-xs text-white/50">
                                Votes gain power over time. Current conviction threshold: 75%
                              </div>
                            </div>
                          )}

                          {proposal.consensusMechanism === "optimistic" && (
                            <div className="bg-yellow-500/10 rounded-lg p-4 mb-4 border border-yellow-500/20">
                              <div className="flex items-center gap-2 mb-2">
                                <ShieldCheck className="w-5 h-5 text-yellow-400" />
                                <span className="text-yellow-400 font-medium">Optimistic Governance</span>
                              </div>
                              <p className="text-white/70 text-sm">
                                This proposal will automatically pass unless vetoed by the Youth Assembly.
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <Clock className="w-4 h-4 text-yellow-400" />
                                <span className="text-yellow-400">{proposal.vetoWindow}</span>
                              </div>
                            </div>
                          )}

                          {proposal.consensusMechanism === "multisig" && (
                            <div className="bg-white/5 rounded-lg p-4 mb-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-white/70 text-sm">Council Signatures</span>
                                <span className="text-white font-medium">{proposal.signaturesCollected} / {proposal.signaturesRequired}</span>
                              </div>
                              <div className="flex gap-2">
                                {Array.from({ length: proposal.signaturesRequired || 0 }).map((_, i) => (
                                  <div
                                    key={i}
                                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                      i < (proposal.signaturesCollected || 0)
                                        ? "bg-green-500/20 border-2 border-green-500"
                                        : "bg-white/5 border-2 border-white/20"
                                    }`}
                                  >
                                    {i < (proposal.signaturesCollected || 0) ? (
                                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                                    ) : (
                                      <span className="text-xs text-white/30">{i + 1}</span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Vote Results */}
                          {proposal.consensusMechanism !== "multisig" && proposal.consensusMechanism !== "optimistic" && (
                            <div className="space-y-3">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-green-400">For: {proposal.votes.for.toLocaleString()}</span>
                                <span className="text-white/50">|</span>
                                <span className="text-red-400">Against: {proposal.votes.against.toLocaleString()}</span>
                                <span className="text-white/50">|</span>
                                <span className="text-white/50">Abstain: {proposal.votes.abstain.toLocaleString()}</span>
                              </div>
                              <div className="h-3 bg-white/10 rounded-full overflow-hidden flex">
                                <div 
                                  className="bg-green-500 transition-all"
                                  style={{ width: `${forPercent}%` }}
                                />
                                <div 
                                  className="bg-red-500 transition-all"
                                  style={{ width: `${againstPercent}%` }}
                                />
                              </div>
                              <div className="flex items-center justify-between text-xs text-white/50">
                                <span>Quorum: {proposal.votes.quorumReached ? "Reached" : `${totalVotes.toLocaleString()} / ${proposal.votes.quorum.toLocaleString()}`}</span>
                                <span>Ends: {proposal.endsAt}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Voting Actions */}
                      {proposal.status === "active" && !proposal.userVote && proposal.consensusMechanism !== "multisig" && proposal.consensusMechanism !== "optimistic" && (
                        <div className="flex gap-3 pt-4 border-t border-white/10">
                          <Button
                            className="flex-1 bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30"
                            onClick={() => handleVoteProposal(proposal.id, "for", proposal.consensusMechanism === "quadratic" ? voteAmount : 1)}
                          >
                            <ThumbsUp className="w-4 h-4 mr-2" />
                            Vote For
                          </Button>
                          <Button
                            className="flex-1 bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30"
                            onClick={() => handleVoteProposal(proposal.id, "against", proposal.consensusMechanism === "quadratic" ? voteAmount : 1)}
                          >
                            <ThumbsDown className="w-4 h-4 mr-2" />
                            Vote Against
                          </Button>
                          <Button
                            variant="outline"
                            className="bg-transparent border-white/20 text-white/70 hover:bg-white/10"
                            onClick={() => handleVoteProposal(proposal.id, "abstain", 1)}
                          >
                            Abstain
                          </Button>
                        </div>
                      )}

                      {proposal.userVote && (
                        <div className="flex items-center gap-2 pt-4 border-t border-white/10">
                          <CheckCircle2 className="w-5 h-5 text-green-400" />
                          <span className="text-white/70">
                            You voted <span className={proposal.userVote === "for" ? "text-green-400" : proposal.userVote === "against" ? "text-red-400" : "text-white/50"}>{proposal.userVote}</span>
                            {proposal.userVotePower && proposal.userVotePower > 1 && ` with ${proposal.userVotePower}x power`}
                          </span>
                        </div>
                      )}

                      <div className="flex justify-end pt-4 border-t border-white/10">
                        <Button variant="ghost" size="sm" className="text-white/50 hover:text-white" onClick={() => handleShareItem("proposal", proposal.id)}>
                          <Share2 className="w-4 h-4 mr-2" />
                          Share
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
          </TabsContent>

          {/* Live Sessions Tab */}
          <TabsContent value="sessions" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {liveSessions.map(session => (
                <Card 
                  key={session.id} 
                  className={`border-white/10 ${
                    session.status === "live" 
                      ? "bg-gradient-to-br from-red-500/10 to-orange-500/10 border-red-500/30" 
                      : "bg-white/5"
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        {session.status === "live" && (
                          <div className="flex items-center gap-2 mb-2">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                            </span>
                            <span className="text-red-400 text-sm font-medium">LIVE NOW</span>
                          </div>
                        )}
                        <h3 className="text-lg font-semibold text-white">{session.title}</h3>
                        <p className="text-white/50 text-sm">Hosted by {session.host}</p>
                      </div>
                      <Badge className={
                        session.status === "live" 
                          ? "bg-red-500/20 text-red-400 border-red-500/30"
                          : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                      }>
                        {session.status === "live" ? "Live" : session.startTime}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {session.topics.map(topic => (
                        <Badge key={topic} variant="outline" className="border-white/20 text-white/70">
                          {topic}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-white/50 text-sm">
                        <Users className="w-4 h-4" />
                        {session.status === "live" 
                          ? `${session.attendees} / ${session.maxAttendees} attending`
                          : `${session.maxAttendees} spots available`
                        }
                      </div>
                      <Button 
                        className={
                          session.status === "live"
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                        }
                        onClick={() => handleSessionAction(session.id)}
                      >
                        {session.status === "live"
                          ? joinedSessionIds.includes(session.id)
                            ? "Leave Session"
                            : "Join Now"
                          : reminderSessionIds.includes(session.id)
                            ? "Reminder Set"
                            : "Set Reminder"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Schedule New Session */}
            <Card className="bg-white/5 border-white/10 border-dashed">
              <CardContent className="p-6 text-center">
                <Calendar className="w-12 h-12 text-white/30 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Schedule a Town Hall</h3>
                <p className="text-white/50 text-sm mb-4">
                  Candidates and verified organizations can host live sessions
                </p>
                <Button variant="outline" className="bg-transparent border-white/20 text-white hover:bg-white/10" onClick={handleScheduleSession}>
                  <Plus className="w-4 h-4 mr-2" />
                  Schedule Session
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="results" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Passed Proposals */}
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    Recently Passed
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {(passedProposals.length ? passedProposals : [{ id: "fallback-pass", title: "No passed proposals yet", endsAt: "Waiting", votes: { for: 0, against: 0, abstain: 0, quorum: 0, quorumReached: false } }]).map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                      <div>
                        <div className="text-white font-medium">{item.title}</div>
                        <div className="text-white/50 text-sm">{item.endsAt}</div>
                      </div>
                      <Badge className="bg-green-500/20 text-green-400">{item.votes.for.toLocaleString()} For</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Rejected Proposals */}
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-red-400" />
                    Recently Rejected
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {(rejectedProposals.length ? rejectedProposals : [{ id: "fallback-reject", title: "No rejected proposals yet", endsAt: "Waiting", votes: { for: 0, against: 0, abstain: 0, quorum: 0, quorumReached: false } }]).map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                      <div>
                        <div className="text-white font-medium">{item.title}</div>
                        <div className="text-white/50 text-sm">{item.endsAt}</div>
                      </div>
                      <Badge className="bg-red-500/20 text-red-400">{item.votes.for.toLocaleString()} For</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Issues Resolved */}
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-blue-400" />
                    Issues Resolved
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {(resolvedIssues.length ? resolvedIssues : [{ id: "fallback-resolved", title: "No resolved issues yet", createdAt: "Waiting" } as Issue]).map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                      <div>
                        <div className="text-white font-medium">{item.title}</div>
                        <div className="text-white/50 text-sm">Raised: {item.createdAt} {"→"} Status: {item.status || "waiting"}</div>
                      </div>
                      <CheckCircle2 className="w-5 h-5 text-blue-400" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Participation Stats */}
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-cyan-400" />
                    Participation Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Total Voters</span>
                    <span className="text-white font-bold">{issues.filter((issue) => issue.hasVoted).length + proposals.filter((proposal) => proposal.userVote).length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Issues Raised (This Month)</span>
                    <span className="text-white font-bold">{issues.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Proposals Created</span>
                    <span className="text-white font-bold">{proposals.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Avg. Voter Turnout</span>
                    <span className="text-white font-bold">{participationRate}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Youth Participation</span>
                    <span className="text-cyan-400 font-bold">{Math.round((issues.filter((issue) => issue.author.type === "school_council").length / Math.max(1, issues.length)) * 100)}%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Issue Modal */}
      {showCreateIssue && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="bg-[#0d1117] border-white/10 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Flag className="w-5 h-5 text-blue-400" />
                Raise an Issue
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white">Issue Title</Label>
                <Input placeholder="Brief, descriptive title for your issue" className="bg-white/5 border-white/10 text-white" value={issueForm.title} onChange={(event) => setIssueForm((current) => ({ ...current, title: event.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Description</Label>
                <Textarea placeholder="Describe the issue in detail. What's the problem? Who is affected? What would a solution look like?" className="bg-white/5 border-white/10 text-white min-h-32" value={issueForm.description} onChange={(event) => setIssueForm((current) => ({ ...current, description: event.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white">Category</Label>
                  <Select value={issueForm.category} onValueChange={(value) => setIssueForm((current) => ({ ...current, category: value }))}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.slice(1).map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Location (Optional)</Label>
                  <Input placeholder="Ward or neighborhood" className="bg-white/5 border-white/10 text-white" value={issueForm.location} onChange={(event) => setIssueForm((current) => ({ ...current, location: event.target.value }))} />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-white">Tags</Label>
                <Input placeholder="Add tags separated by commas" className="bg-white/5 border-white/10 text-white" value={issueForm.tags} onChange={(event) => setIssueForm((current) => ({ ...current, tags: event.target.value }))} />
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1 bg-transparent border-white/20 text-white" onClick={() => setShowCreateIssue(false)}>
                  Cancel
                </Button>
                <Button className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600" onClick={handleSubmitIssue}>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Issue
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Create Proposal Modal */}
      {showCreateProposal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="bg-[#0d1117] border-white/10 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Vote className="w-5 h-5 text-purple-400" />
                Create Proposal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white">Proposal Title</Label>
                <Input placeholder="Clear, actionable proposal title" className="bg-white/5 border-white/10 text-white" value={proposalForm.title} onChange={(event) => setProposalForm((current) => ({ ...current, title: event.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Description</Label>
                <Textarea placeholder="Describe your proposal. Include objectives, implementation plan, expected outcomes, and any budget requirements." className="bg-white/5 border-white/10 text-white min-h-32" value={proposalForm.description} onChange={(event) => setProposalForm((current) => ({ ...current, description: event.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Link to Issue (Optional)</Label>
                <Select value={proposalForm.linkedIssue} onValueChange={(value) => setProposalForm((current) => ({ ...current, linkedIssue: value }))}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Link to an existing issue" />
                  </SelectTrigger>
                  <SelectContent>
                    {issues.filter(i => i.status === "open").map(issue => (
                      <SelectItem key={issue.id} value={issue.id}>{issue.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-white">Consensus Mechanism</Label>
                <div className="grid grid-cols-2 gap-3">
                  {consensusMechanisms.map(mech => {
                    const Icon = mech.icon
                    return (
                      <div
                        key={mech.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedMechanism === mech.id
                            ? "bg-purple-500/20 border-purple-500/50"
                            : "bg-white/5 border-white/10 hover:bg-white/10"
                        }`}
                        onClick={() => setSelectedMechanism(mech.id)}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className={`w-4 h-4 ${selectedMechanism === mech.id ? "text-purple-400" : "text-white/50"}`} />
                          <span className="text-white font-medium text-sm">{mech.name}</span>
                        </div>
                        <p className="text-white/50 text-xs">{mech.description}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white">Category</Label>
                  <Select value={proposalForm.category} onValueChange={(value) => setProposalForm((current) => ({ ...current, category: value }))}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.slice(1).map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Voting Duration</Label>
                  <Select value={proposalForm.durationDays} onValueChange={(value) => setProposalForm((current) => ({ ...current, durationDays: value }))}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 days</SelectItem>
                      <SelectItem value="7">7 days</SelectItem>
                      <SelectItem value="14">14 days</SelectItem>
                      <SelectItem value="30">30 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1 bg-transparent border-white/20 text-white" onClick={() => setShowCreateProposal(false)}>
                  Cancel
                </Button>
                <Button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600" onClick={handleSubmitProposal}>
                  <Vote className="w-4 h-4 mr-2" />
                  Submit Proposal
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default function TownHallBoardPage() {
  return (
    <Suspense fallback={null}>
      <TownHallBoardContent />
    </Suspense>
  )
}
