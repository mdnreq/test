"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Vote,
  Users,
  MessageSquare,
  Send,
  Calendar,
  Video,
  FileText,
  TrendingUp,
  Heart,
  Share2,
  Eye,
  Clock,
  CheckCircle2,
  AlertCircle,
  Coins,
  Shield,
  Wallet,
  ChevronRight,
  Plus,
  Search,
  Bell,
  Star,
  ThumbsUp,
  ThumbsDown,
  MapPin,
  Megaphone,
  HandshakeIcon,
  Target,
  BarChart3,
  PieChart,
  Zap,
  ArrowLeft,
  Globe,
  Twitter,
  Instagram,
  Mail,
  Phone,
  ExternalLink
} from "lucide-react"

interface VoterQuestion {
  id: string
  voter_name: string
  voter_avatar?: string
  question: string
  created_at: string
  answered: boolean
  answer?: string
  upvotes: number
  category: string
}

interface TownHall {
  id: string
  title: string
  description: string
  scheduled_at: string
  status: "upcoming" | "live" | "completed"
  attendees: number
  max_attendees: number
  topics: string[]
}

interface Endorsement {
  id: string
  endorser_name: string
  endorser_title: string
  endorser_avatar?: string
  message: string
  verified: boolean
  created_at: string
}

interface CampaignUpdate {
  id: string
  title: string
  content: string
  created_at: string
  type: "announcement" | "policy" | "event" | "milestone"
  likes: number
  shares: number
  comments: number
}

interface VoterStats {
  total_followers: number
  total_questions: number
  answered_questions: number
  total_endorsements: number
  engagement_rate: number
  sentiment_score: number
}

export default function CandidateDAOPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [newUpdate, setNewUpdate] = useState({ title: "", content: "", type: "announcement" })
  const [newAnswer, setNewAnswer] = useState("")
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null)
  const [newTownHall, setNewTownHall] = useState({ title: "", description: "", date: "", topics: "" })
  
  // Demo data
  const [stats] = useState<VoterStats>({
    total_followers: 1247,
    total_questions: 89,
    answered_questions: 72,
    total_endorsements: 15,
    engagement_rate: 68.5,
    sentiment_score: 82
  })

  const [questions] = useState<VoterQuestion[]>([
    {
      id: "1",
      voter_name: "Sarah M.",
      question: "How would you engage first-time Gen Z voters and Millennial households in this municipality?",
      created_at: "2026-01-25T10:30:00Z",
      answered: true,
      answer: "I want this campaign to win younger turnout the practical way: campus and neighbourhood organizing, transit and housing messaging, and better digital follow-up for Gen Z voters and Millennial households.",
      upvotes: 45,
      category: "Youth Engagement"
    },
    {
      id: "2",
      voter_name: "Michael T.",
      question: "How do you plan to address the housing affordability crisis in our municipality?",
      created_at: "2026-01-24T14:20:00Z",
      answered: true,
      answer: "My housing plan includes: 1) Increasing density near transit, 2) Fast-tracking permits for affordable units, 3) Partnering with non-profits for community land trusts, 4) Implementing vacant home taxes.",
      upvotes: 67,
      category: "Housing"
    },
    {
      id: "3",
      voter_name: "Jennifer L.",
      question: "What will you do to improve public transit frequency in suburban areas?",
      created_at: "2026-01-26T09:15:00Z",
      answered: false,
      upvotes: 23,
      category: "Transit"
    },
    {
      id: "4",
      voter_name: "David K.",
      question: "Do you support implementing a municipal basic income pilot program?",
      created_at: "2026-01-26T11:00:00Z",
      answered: false,
      upvotes: 31,
      category: "Social Services"
    }
  ])

  const [townHalls] = useState<TownHall[]>([
    {
      id: "1",
      title: "Youth Voice Town Hall",
      description: "Open discussion on Gen Z turnout, youth mental health services, and student transit passes",
      scheduled_at: "2026-02-01T18:00:00Z",
      status: "upcoming",
      attendees: 89,
      max_attendees: 200,
      topics: ["Gen Z Turnout", "Mental Health", "Transit"]
    },
    {
      id: "2",
      title: "Housing Solutions Forum",
      description: "Community input session on affordable housing initiatives and zoning reforms",
      scheduled_at: "2026-02-08T19:00:00Z",
      status: "upcoming",
      attendees: 156,
      max_attendees: 250,
      topics: ["Housing", "Zoning", "Affordability"]
    },
    {
      id: "3",
      title: "Climate Action Q&A",
      description: "Discussion on municipal climate targets and green infrastructure",
      scheduled_at: "2026-01-15T18:30:00Z",
      status: "completed",
      attendees: 203,
      max_attendees: 200,
      topics: ["Climate", "Environment", "Infrastructure"]
    }
  ])

  const [endorsements] = useState<Endorsement[]>([
    {
      id: "1",
      endorser_name: "Youth Climate Coalition",
      endorser_title: "Environmental Advocacy Group",
      message: "We endorse this candidate for their strong commitment to climate action and youth engagement in environmental policy.",
      verified: true,
      created_at: "2026-01-20T00:00:00Z"
    },
    {
      id: "2",
      endorser_name: "Local Teachers Union",
      endorser_title: "Education Workers Association",
      message: "This candidate has consistently supported education funding and student welfare initiatives.",
      verified: true,
      created_at: "2026-01-18T00:00:00Z"
    },
    {
      id: "3",
      endorser_name: "Jane Smith",
      endorser_title: "Former City Councillor",
      message: "I've worked with this candidate on community projects. They bring integrity, vision, and a genuine commitment to public service.",
      verified: true,
      created_at: "2026-01-15T00:00:00Z"
    }
  ])

  const [updates] = useState<CampaignUpdate[]>([
    {
      id: "1",
      title: "Launching Youth Advisory Council Initiative",
      content: "Today I'm announcing my plan to create a permanent Youth Advisory Council that will have real input on municipal decisions affecting young people. This isn't just about listening - it's about sharing power.",
      created_at: "2026-01-25T12:00:00Z",
      type: "policy",
      likes: 234,
      shares: 56,
      comments: 28
    },
    {
      id: "2",
      title: "1000 Followers Milestone!",
      content: "Thank you to everyone who has joined our campaign community. Your support, questions, and engagement keep us accountable and inspired. Let's keep building together!",
      created_at: "2026-01-22T15:30:00Z",
      type: "milestone",
      likes: 456,
      shares: 89,
      comments: 67
    },
    {
      id: "3",
      title: "Town Hall: Housing Crisis Solutions - Feb 8",
      content: "Join us for an open community discussion on housing affordability. Bring your questions, concerns, and ideas. Virtual and in-person options available.",
      created_at: "2026-01-20T10:00:00Z",
      type: "event",
      likes: 189,
      shares: 34,
      comments: 21
    }
  ])

  const handlePostUpdate = () => {
    if (newUpdate.title && newUpdate.content) {
      // In production, save to database
      alert("Update posted successfully!")
      setNewUpdate({ title: "", content: "", type: "announcement" })
    }
  }

  const handleAnswerQuestion = (questionId: string) => {
    if (newAnswer) {
      // In production, save to database
      alert("Answer submitted successfully!")
      setNewAnswer("")
      setSelectedQuestion(null)
    }
  }

  const handleScheduleTownHall = () => {
    if (newTownHall.title && newTownHall.date) {
      // In production, save to database
      alert("Town Hall scheduled successfully!")
      setNewTownHall({ title: "", description: "", date: "", topics: "" })
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <div className="border-b border-white/10 bg-gradient-to-r from-blue-950/50 to-purple-950/50">
        <div className="container mx-auto max-w-7xl px-6 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" asChild className="text-white/70 hover:text-white">
              <Link href="/candidate-portal">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Portal
              </Link>
            </Button>
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white">Candidate DAO Dashboard</h1>
              <p className="text-white/60 mt-1">Connect with voters, answer questions, and build community</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 px-3 py-1">
                <Shield className="w-3 h-3 mr-1" />
                Verified Candidate
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 px-3 py-1">
                <Coins className="w-3 h-3 mr-1" />
                245 $NEXT
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4 text-center">
              <Users className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{stats.total_followers.toLocaleString()}</div>
              <div className="text-xs text-white/50">Followers</div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4 text-center">
              <MessageSquare className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{stats.total_questions}</div>
              <div className="text-xs text-white/50">Questions</div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4 text-center">
              <CheckCircle2 className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{Math.round((stats.answered_questions / stats.total_questions) * 100)}%</div>
              <div className="text-xs text-white/50">Response Rate</div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4 text-center">
              <Star className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{stats.total_endorsements}</div>
              <div className="text-xs text-white/50">Endorsements</div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{stats.engagement_rate}%</div>
              <div className="text-xs text-white/50">Engagement</div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4 text-center">
              <Heart className="w-6 h-6 text-red-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{stats.sentiment_score}%</div>
              <div className="text-xs text-white/50">Sentiment</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white/5 border border-white/10 p-1 flex-wrap h-auto">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600">Overview</TabsTrigger>
            <TabsTrigger value="questions" className="data-[state=active]:bg-blue-600">Voter Questions</TabsTrigger>
            <TabsTrigger value="townhalls" className="data-[state=active]:bg-blue-600">Town Halls</TabsTrigger>
            <TabsTrigger value="updates" className="data-[state=active]:bg-blue-600">Campaign Updates</TabsTrigger>
            <TabsTrigger value="endorsements" className="data-[state=active]:bg-blue-600">Endorsements</TabsTrigger>
            <TabsTrigger value="transparency" className="data-[state=active]:bg-blue-600">Transparency</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Quick Actions */}
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start bg-blue-600/20 hover:bg-blue-600/30 text-blue-400" onClick={() => setActiveTab("questions")}>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Answer Pending Questions ({questions.filter(q => !q.answered).length})
                  </Button>
                  <Button className="w-full justify-start bg-purple-600/20 hover:bg-purple-600/30 text-purple-400" onClick={() => setActiveTab("updates")}>
                    <Megaphone className="w-4 h-4 mr-2" />
                    Post Campaign Update
                  </Button>
                  <Button className="w-full justify-start bg-green-600/20 hover:bg-green-600/30 text-green-400" onClick={() => setActiveTab("townhalls")}>
                    <Video className="w-4 h-4 mr-2" />
                    Schedule Town Hall
                  </Button>
                  <Button className="w-full justify-start bg-orange-600/20 hover:bg-orange-600/30 text-orange-400" asChild>
                    <Link href="/governance">
                      <Vote className="w-4 h-4 mr-2" />
                      View DAO Proposals
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Pending Questions */}
              <Card className="bg-white/5 border-white/10 lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-purple-400" />
                    Pending Voter Questions
                  </CardTitle>
                  <CardDescription>Questions awaiting your response</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {questions.filter(q => !q.answered).slice(0, 3).map(question => (
                    <div key={question.id} className="bg-white/5 rounded-xl p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-purple-600 text-white text-xs">
                              {question.voter_name.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <span className="text-white text-sm font-medium">{question.voter_name}</span>
                            <Badge variant="outline" className="ml-2 text-xs border-white/20 text-white/60">
                              {question.category}
                            </Badge>
                          </div>
                        </div>
                        <span className="text-white/40 text-xs">{new Date(question.created_at).toLocaleDateString()}</span>
                      </div>
                      <p className="text-white/80 text-sm mb-3">{question.question}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-white/50 text-xs">
                          <ThumbsUp className="w-3 h-3" />
                          <span>{question.upvotes} upvotes</span>
                        </div>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => {
                          setSelectedQuestion(question.id)
                          setActiveTab("questions")
                        }}>
                          Answer
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button variant="ghost" className="w-full text-blue-400 hover:text-blue-300" onClick={() => setActiveTab("questions")}>
                    View All Questions
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Upcoming Town Halls */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-green-400" />
                  Upcoming Town Halls
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {townHalls.filter(th => th.status === "upcoming").map(townhall => (
                    <div key={townhall.id} className="bg-gradient-to-br from-green-950/30 to-emerald-950/30 border border-green-500/20 rounded-xl p-4">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="text-white font-semibold">{townhall.title}</h4>
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                          {townhall.status}
                        </Badge>
                      </div>
                      <p className="text-white/60 text-sm mb-3">{townhall.description}</p>
                      <div className="flex items-center gap-4 text-sm text-white/50 mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(townhall.scheduled_at).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(townhall.scheduled_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-white/50" />
                          <span className="text-white/70 text-sm">{townhall.attendees}/{townhall.max_attendees}</span>
                        </div>
                        <div className="flex gap-2">
                          {townhall.topics.map(topic => (
                            <Badge key={topic} variant="outline" className="text-xs border-white/20 text-white/60">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Campaign Updates */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Megaphone className="w-5 h-5 text-orange-400" />
                  Recent Campaign Updates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {updates.slice(0, 2).map(update => (
                  <div key={update.id} className="bg-white/5 rounded-xl p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge className={
                          update.type === "policy" ? "bg-blue-500/20 text-blue-400 border-blue-500/30" :
                          update.type === "milestone" ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" :
                          update.type === "event" ? "bg-green-500/20 text-green-400 border-green-500/30" :
                          "bg-purple-500/20 text-purple-400 border-purple-500/30"
                        }>
                          {update.type}
                        </Badge>
                        <span className="text-white/40 text-xs">{new Date(update.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <h4 className="text-white font-semibold mb-2">{update.title}</h4>
                    <p className="text-white/60 text-sm mb-3 line-clamp-2">{update.content}</p>
                    <div className="flex items-center gap-4 text-white/50 text-sm">
                      <span className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        {update.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <Share2 className="w-4 h-4" />
                        {update.shares}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        {update.comments}
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Voter Questions Tab */}
          <TabsContent value="questions" className="space-y-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Voter Questions</CardTitle>
                <CardDescription>Answer questions from your constituents to build trust and engagement</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Unanswered Questions */}
                <div>
                  <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-orange-400" />
                    Pending Questions ({questions.filter(q => !q.answered).length})
                  </h3>
                  <div className="space-y-4">
                    {questions.filter(q => !q.answered).map(question => (
                      <div key={question.id} className="bg-orange-950/20 border border-orange-500/20 rounded-xl p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Avatar className="w-10 h-10">
                              <AvatarFallback className="bg-orange-600 text-white">
                                {question.voter_name.split(" ").map(n => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <span className="text-white font-medium">{question.voter_name}</span>
                              <div className="flex items-center gap-2 mt-0.5">
                                <Badge variant="outline" className="text-xs border-white/20 text-white/60">
                                  {question.category}
                                </Badge>
                                <span className="text-white/40 text-xs">{new Date(question.created_at).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-white/50 text-sm">
                            <ThumbsUp className="w-4 h-4" />
                            <span>{question.upvotes}</span>
                          </div>
                        </div>
                        <p className="text-white mb-4">{question.question}</p>
                        
                        {selectedQuestion === question.id ? (
                          <div className="space-y-3">
                            <Textarea
                              placeholder="Write your answer..."
                              value={newAnswer}
                              onChange={(e) => setNewAnswer(e.target.value)}
                              className="bg-white/5 border-white/20 text-white min-h-[120px]"
                            />
                            <div className="flex gap-2">
                              <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => handleAnswerQuestion(question.id)}>
                                <Send className="w-4 h-4 mr-2" />
                                Submit Answer
                              </Button>
                              <Button variant="ghost" className="text-white/70" onClick={() => {
                                setSelectedQuestion(null)
                                setNewAnswer("")
                              }}>
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setSelectedQuestion(question.id)}>
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Answer This Question
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Answered Questions */}
                <div>
                  <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    Answered Questions ({questions.filter(q => q.answered).length})
                  </h3>
                  <div className="space-y-4">
                    {questions.filter(q => q.answered).map(question => (
                      <div key={question.id} className="bg-green-950/20 border border-green-500/20 rounded-xl p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Avatar className="w-10 h-10">
                              <AvatarFallback className="bg-green-600 text-white">
                                {question.voter_name.split(" ").map(n => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <span className="text-white font-medium">{question.voter_name}</span>
                              <div className="flex items-center gap-2 mt-0.5">
                                <Badge variant="outline" className="text-xs border-white/20 text-white/60">
                                  {question.category}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                            Answered
                          </Badge>
                        </div>
                        <p className="text-white mb-3">{question.question}</p>
                        <div className="bg-white/5 rounded-lg p-3 border-l-2 border-blue-500">
                          <p className="text-white/80 text-sm italic">"{question.answer}"</p>
                        </div>
                        <div className="flex items-center gap-4 mt-3 text-white/50 text-sm">
                          <span className="flex items-center gap-1">
                            <ThumbsUp className="w-4 h-4" />
                            {question.upvotes} found helpful
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Town Halls Tab */}
          <TabsContent value="townhalls" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Schedule New Town Hall */}
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Plus className="w-5 h-5 text-green-400" />
                    Schedule Town Hall
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-white">Title</Label>
                    <Input
                      placeholder="e.g., Housing Policy Q&A"
                      value={newTownHall.title}
                      onChange={(e) => setNewTownHall({ ...newTownHall, title: e.target.value })}
                      className="bg-white/5 border-white/20 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Description</Label>
                    <Textarea
                      placeholder="Describe the topics and format..."
                      value={newTownHall.description}
                      onChange={(e) => setNewTownHall({ ...newTownHall, description: e.target.value })}
                      className="bg-white/5 border-white/20 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Date & Time</Label>
                    <Input
                      type="datetime-local"
                      value={newTownHall.date}
                      onChange={(e) => setNewTownHall({ ...newTownHall, date: e.target.value })}
                      className="bg-white/5 border-white/20 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Topics (comma separated)</Label>
                    <Input
                      placeholder="Housing, Transit, Climate"
                      value={newTownHall.topics}
                      onChange={(e) => setNewTownHall({ ...newTownHall, topics: e.target.value })}
                      className="bg-white/5 border-white/20 text-white"
                    />
                  </div>
                  <Button className="w-full bg-green-600 hover:bg-green-700" onClick={handleScheduleTownHall}>
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Town Hall
                  </Button>
                </CardContent>
              </Card>

              {/* Town Halls List */}
              <Card className="bg-white/5 border-white/10 lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-white">Your Town Halls</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {townHalls.map(townhall => (
                    <div key={townhall.id} className={`rounded-xl p-4 border ${
                      townhall.status === "upcoming" ? "bg-green-950/20 border-green-500/20" :
                      townhall.status === "live" ? "bg-red-950/20 border-red-500/20" :
                      "bg-white/5 border-white/10"
                    }`}>
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="text-white font-semibold">{townhall.title}</h4>
                        <Badge className={
                          townhall.status === "upcoming" ? "bg-green-500/20 text-green-400 border-green-500/30" :
                          townhall.status === "live" ? "bg-red-500/20 text-red-400 border-red-500/30 animate-pulse" :
                          "bg-white/10 text-white/60 border-white/20"
                        }>
                          {townhall.status === "live" && <span className="w-2 h-2 bg-red-500 rounded-full mr-1 animate-pulse" />}
                          {townhall.status}
                        </Badge>
                      </div>
                      <p className="text-white/60 text-sm mb-3">{townhall.description}</p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-white/50 mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(townhall.scheduled_at).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {new Date(townhall.scheduled_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {townhall.attendees}/{townhall.max_attendees} registered
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {townhall.topics.map(topic => (
                          <Badge key={topic} variant="outline" className="text-xs border-white/20 text-white/60">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                      {townhall.status === "upcoming" && (
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            <Video className="w-4 h-4 mr-2" />
                            Start Early
                          </Button>
                          <Button size="sm" variant="outline" className="border-white/20 text-white bg-transparent">
                            Edit Details
                          </Button>
                        </div>
                      )}
                      {townhall.status === "live" && (
                        <Button size="sm" className="bg-red-600 hover:bg-red-700">
                          <Video className="w-4 h-4 mr-2" />
                          Join Now
                        </Button>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Campaign Updates Tab */}
          <TabsContent value="updates" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Post New Update */}
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Plus className="w-5 h-5 text-purple-400" />
                    Post Update
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-white">Update Type</Label>
                    <Select value={newUpdate.type} onValueChange={(value) => setNewUpdate({ ...newUpdate, type: value })}>
                      <SelectTrigger className="bg-white/5 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="announcement">Announcement</SelectItem>
                        <SelectItem value="policy">Policy Position</SelectItem>
                        <SelectItem value="event">Event</SelectItem>
                        <SelectItem value="milestone">Milestone</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Title</Label>
                    <Input
                      placeholder="Update title..."
                      value={newUpdate.title}
                      onChange={(e) => setNewUpdate({ ...newUpdate, title: e.target.value })}
                      className="bg-white/5 border-white/20 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Content</Label>
                    <Textarea
                      placeholder="Share your update with voters..."
                      value={newUpdate.content}
                      onChange={(e) => setNewUpdate({ ...newUpdate, content: e.target.value })}
                      className="bg-white/5 border-white/20 text-white min-h-[150px]"
                    />
                  </div>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={handlePostUpdate}>
                    <Send className="w-4 h-4 mr-2" />
                    Post Update
                  </Button>
                </CardContent>
              </Card>

              {/* Updates List */}
              <Card className="bg-white/5 border-white/10 lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-white">Your Updates</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {updates.map(update => (
                    <div key={update.id} className="bg-white/5 rounded-xl p-4">
                      <div className="flex items-start justify-between mb-3">
                        <Badge className={
                          update.type === "policy" ? "bg-blue-500/20 text-blue-400 border-blue-500/30" :
                          update.type === "milestone" ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" :
                          update.type === "event" ? "bg-green-500/20 text-green-400 border-green-500/30" :
                          "bg-purple-500/20 text-purple-400 border-purple-500/30"
                        }>
                          {update.type}
                        </Badge>
                        <span className="text-white/40 text-xs">{new Date(update.created_at).toLocaleDateString()}</span>
                      </div>
                      <h4 className="text-white font-semibold mb-2">{update.title}</h4>
                      <p className="text-white/60 text-sm mb-4">{update.content}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-white/50 text-sm">
                          <span className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            {update.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <Share2 className="w-4 h-4" />
                            {update.shares}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="w-4 h-4" />
                            {update.comments}
                          </span>
                        </div>
                        <Button size="sm" variant="ghost" className="text-white/50 hover:text-white">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Endorsements Tab */}
          <TabsContent value="endorsements" className="space-y-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  Endorsements
                </CardTitle>
                <CardDescription>Organizations and individuals who have endorsed your campaign</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {endorsements.map(endorsement => (
                  <div key={endorsement.id} className="bg-gradient-to-br from-yellow-950/20 to-orange-950/20 border border-yellow-500/20 rounded-xl p-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-yellow-600 text-white">
                          {endorsement.endorser_name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-white font-semibold">{endorsement.endorser_name}</h4>
                          {endorsement.verified && (
                            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        <p className="text-white/50 text-sm mb-2">{endorsement.endorser_title}</p>
                        <p className="text-white/80 italic">"{endorsement.message}"</p>
                        <p className="text-white/40 text-xs mt-2">Endorsed on {new Date(endorsement.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transparency Tab */}
          <TabsContent value="transparency" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Campaign Vault */}
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-green-400" />
                    Crypto-Campaign Vault
                  </CardTitle>
                  <CardDescription>Transparent, on-chain campaign financing</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-green-950/30 border border-green-500/20 rounded-xl p-4">
                    <div className="text-center mb-4">
                      <div className="text-3xl font-bold text-white">$12,450</div>
                      <div className="text-white/50 text-sm">Total Raised</div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60">Individual Donations</span>
                        <span className="text-white">$8,200</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60">$NEXT Token Contributions</span>
                        <span className="text-white">$3,500</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60">DAO Matching Funds</span>
                        <span className="text-white">$750</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full border-white/20 text-white bg-transparent">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View On-Chain Records
                  </Button>
                </CardContent>
              </Card>

              {/* Spending Breakdown */}
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-purple-400" />
                    Spending Transparency
                  </CardTitle>
                  <CardDescription>How campaign funds are being used</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-white/60">Digital Advertising</span>
                        <span className="text-white">$3,200 (35%)</span>
                      </div>
                      <Progress value={35} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-white/60">Print Materials</span>
                        <span className="text-white">$2,100 (23%)</span>
                      </div>
                      <Progress value={23} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-white/60">Events & Town Halls</span>
                        <span className="text-white">$1,800 (20%)</span>
                      </div>
                      <Progress value={20} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-white/60">Staff & Operations</span>
                        <span className="text-white">$1,500 (16%)</span>
                      </div>
                      <Progress value={16} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-white/60">Technology</span>
                        <span className="text-white">$550 (6%)</span>
                      </div>
                      <Progress value={6} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Voting Record */}
              <Card className="bg-white/5 border-white/10 lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Vote className="w-5 h-5 text-blue-400" />
                    DAO Voting Record
                  </CardTitle>
                  <CardDescription>Your votes on DAO governance proposals</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-white/5 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-white mb-1">23</div>
                      <div className="text-white/50 text-sm">Total Votes Cast</div>
                    </div>
                    <div className="bg-green-950/30 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-green-400 mb-1">18</div>
                      <div className="text-white/50 text-sm">Voted For</div>
                    </div>
                    <div className="bg-red-950/30 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-red-400 mb-1">5</div>
                      <div className="text-white/50 text-sm">Voted Against</div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button variant="outline" className="w-full border-white/20 text-white bg-transparent" asChild>
                      <Link href="/governance">
                        View Full Voting History
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
