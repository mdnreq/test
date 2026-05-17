"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  ArrowLeft, 
  Play, 
  Heart, 
  MessageSquare, 
  Share2, 
  Upload,
  TrendingUp,
  Users,
  DollarSign,
  Eye,
  Clock,
  Award,
  Filter,
  Search,
  Plus,
  Video,
  FileText,
  Mic,
  ImageIcon,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Bookmark,
  MoreHorizontal,
  Zap,
  Shield,
  PieChart
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

// Demo content data
const mediaContent = [
  {
    id: 1,
    type: "video",
    title: "Why Gen Z & Millennial Engagement Matters: Data-Driven Turnout Strategy",
    creator: "Maya Chen",
    creatorType: "Youth Creator",
    verified: true,
    views: 24500,
    likes: 1820,
    comments: 234,
    shares: 456,
    duration: "8:42",
    thumbnail: "/placeholder.jpg",
    revenueEarned: 245.50,
    trending: true,
    featured: true,
    publishedAt: "2 hours ago",
    tags: ["votes-at-16", "youth-politics", "democracy"]
  },
  {
    id: 2,
    type: "article",
    title: "Understanding Municipal Budget Allocation: A Guide for Young Voters",
    creator: "James Wilson",
    creatorType: "Student Journalist",
    verified: true,
    views: 8900,
    likes: 567,
    comments: 89,
    shares: 123,
    readTime: "6 min read",
    revenueEarned: 89.20,
    trending: false,
    featured: false,
    publishedAt: "1 day ago",
    tags: ["municipal-budget", "education", "guide"]
  },
  {
    id: 3,
    type: "podcast",
    title: "Town Hall Talk: Interview with School Board Candidate",
    creator: "Youth Politics Pod",
    creatorType: "Podcast Network",
    verified: true,
    views: 5600,
    likes: 890,
    comments: 156,
    shares: 234,
    duration: "45:30",
    revenueEarned: 156.80,
    trending: true,
    featured: false,
    publishedAt: "3 days ago",
    tags: ["podcast", "school-board", "interview"]
  },
  {
    id: 4,
    type: "video",
    title: "How to Register for Municipal Elections - Step by Step",
    creator: "Civic Education Hub",
    creatorType: "Organization",
    verified: true,
    views: 45000,
    likes: 3200,
    comments: 567,
    shares: 1200,
    duration: "12:15",
    revenueEarned: 520.00,
    trending: true,
    featured: true,
    publishedAt: "1 week ago",
    tags: ["tutorial", "registration", "elections"]
  }
]

const topCreators = [
  { name: "Maya Chen", subscribers: 12500, earnings: 2450, badge: "Rising Star", avatar: "MC" },
  { name: "Civic Education Hub", subscribers: 45000, earnings: 8900, badge: "Verified Org", avatar: "CE" },
  { name: "Youth Politics Pod", subscribers: 8900, earnings: 1560, badge: "Top Podcast", avatar: "YP" },
  { name: "James Wilson", subscribers: 3400, earnings: 890, badge: "Student Voice", avatar: "JW" }
]

export default function MediaDAOPage() {
  const [activeTab, setActiveTab] = useState("feed")
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [contentFilter, setContentFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video": return <Video className="w-4 h-4" />
      case "article": return <FileText className="w-4 h-4" />
      case "podcast": return <Mic className="w-4 h-4" />
      default: return <ImageIcon className="w-4 h-4" />
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
                  Back to Governance
                </Button>
              </Link>
              <div className="h-6 w-px bg-white/20" />
              <div>
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  <Play className="w-5 h-5 text-purple-400" />
                  Youth Media DAO
                </h1>
                <p className="text-sm text-white/50">Crowdsourced, decentralized media network</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                70% Revenue Share
              </Badge>
              <Button 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500"
                onClick={() => setShowUploadModal(true)}
              >
                <Upload className="w-4 h-4 mr-2" />
                Create Content
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">12,450</p>
                  <p className="text-sm text-white/50">Active Creators</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">$89,450</p>
                  <p className="text-sm text-white/50">Distributed This Month</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">2.4M</p>
                  <p className="text-sm text-white/50">Total Views</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">0%</p>
                  <p className="text-sm text-white/50">Algorithmic Suppression</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Anti-Algorithmic Notice */}
        <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20 mb-8">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <Zap className="w-6 h-6 text-purple-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold">Anti-Algorithmic Suppression Design</h3>
                <p className="text-white/60 text-sm">
                  All content is distributed fairly based on quality and community votes, not engagement-maximizing algorithms. 
                  Youth political content is never suppressed or shadow-banned.
                </p>
              </div>
              <Button variant="outline" className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10 bg-transparent">
                Learn More
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between mb-6">
            <TabsList className="bg-white/5 border border-white/10">
              <TabsTrigger value="feed" className="data-[state=active]:bg-white/10">
                <TrendingUp className="w-4 h-4 mr-2" />
                Feed
              </TabsTrigger>
              <TabsTrigger value="creators" className="data-[state=active]:bg-white/10">
                <Users className="w-4 h-4 mr-2" />
                Creators
              </TabsTrigger>
              <TabsTrigger value="earnings" className="data-[state=active]:bg-white/10">
                <DollarSign className="w-4 h-4 mr-2" />
                My Earnings
              </TabsTrigger>
              <TabsTrigger value="governance" className="data-[state=active]:bg-white/10">
                <PieChart className="w-4 h-4 mr-2" />
                Media Governance
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <Input
                  placeholder="Search content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-white/5 border-white/10 text-white w-64"
                />
              </div>
              <Select value={contentFilter} onValueChange={setContentFilter}>
                <SelectTrigger className="w-32 bg-white/5 border-white/10 text-white">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="video">Videos</SelectItem>
                  <SelectItem value="article">Articles</SelectItem>
                  <SelectItem value="podcast">Podcasts</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Feed Tab */}
          <TabsContent value="feed" className="space-y-6">
            {/* Featured Content */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-400" />
                Featured Content
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mediaContent.filter(c => c.featured).map((content) => (
                  <Card key={content.id} className="bg-white/5 border-white/10 overflow-hidden hover:border-purple-500/30 transition-colors cursor-pointer">
                    <div className="aspect-video bg-gradient-to-br from-purple-500/20 to-pink-500/20 relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                          <Play className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      {content.duration && (
                        <Badge className="absolute bottom-2 right-2 bg-black/70 text-white border-0">
                          {content.duration}
                        </Badge>
                      )}
                      {content.trending && (
                        <Badge className="absolute top-2 left-2 bg-orange-500 text-white border-0">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Trending
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-purple-500/20 text-purple-400">
                            {content.creator.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-medium line-clamp-2">{content.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-white/60">{content.creator}</span>
                            {content.verified && (
                              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                                Verified
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-sm text-white/50">
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {content.views.toLocaleString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Heart className="w-3 h-3" />
                              {content.likes.toLocaleString()}
                            </span>
                            <span>{content.publishedAt}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* All Content */}
            <div>
              <h2 className="text-lg font-semibold text-white mb-4">Latest Content</h2>
              <div className="space-y-4">
                {mediaContent.map((content) => (
                  <Card key={content.id} className="bg-white/5 border-white/10 hover:border-white/20 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="w-48 h-28 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center relative flex-shrink-0">
                          {getTypeIcon(content.type)}
                          {content.duration && (
                            <Badge className="absolute bottom-1 right-1 bg-black/70 text-white border-0 text-xs">
                              {content.duration}
                            </Badge>
                          )}
                          {content.readTime && (
                            <Badge className="absolute bottom-1 right-1 bg-black/70 text-white border-0 text-xs">
                              {content.readTime}
                            </Badge>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline" className="border-white/20 text-white/60 text-xs">
                                  {content.type}
                                </Badge>
                                {content.trending && (
                                  <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-xs">
                                    Trending
                                  </Badge>
                                )}
                              </div>
                              <h3 className="text-white font-medium">{content.title}</h3>
                            </div>
                            <Button variant="ghost" size="sm" className="text-white/50">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <Avatar className="w-6 h-6">
                              <AvatarFallback className="bg-purple-500/20 text-purple-400 text-xs">
                                {content.creator.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-white/60">{content.creator}</span>
                            <span className="text-white/30">•</span>
                            <span className="text-sm text-white/50">{content.publishedAt}</span>
                          </div>
                          <div className="flex items-center gap-4 mt-3">
                            <Button variant="ghost" size="sm" className="text-white/60 hover:text-white">
                              <ThumbsUp className="w-4 h-4 mr-1" />
                              {content.likes.toLocaleString()}
                            </Button>
                            <Button variant="ghost" size="sm" className="text-white/60 hover:text-white">
                              <MessageSquare className="w-4 h-4 mr-1" />
                              {content.comments}
                            </Button>
                            <Button variant="ghost" size="sm" className="text-white/60 hover:text-white">
                              <Share2 className="w-4 h-4 mr-1" />
                              {content.shares}
                            </Button>
                            <Button variant="ghost" size="sm" className="text-white/60 hover:text-white">
                              <Bookmark className="w-4 h-4" />
                            </Button>
                            <div className="flex-1" />
                            <span className="text-sm text-green-400">
                              Creator earned: ${content.revenueEarned.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Creators Tab */}
          <TabsContent value="creators" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {topCreators.map((creator, index) => (
                <Card key={index} className="bg-white/5 border-white/10 hover:border-purple-500/30 transition-colors">
                  <CardContent className="p-6 text-center">
                    <Avatar className="w-20 h-20 mx-auto mb-4">
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xl">
                        {creator.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="text-white font-semibold">{creator.name}</h3>
                    <Badge className="mt-2 bg-purple-500/20 text-purple-400 border-purple-500/30">
                      {creator.badge}
                    </Badge>
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/50">Subscribers</span>
                        <span className="text-white">{creator.subscribers.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/50">Total Earnings</span>
                        <span className="text-green-400">${creator.earnings.toLocaleString()}</span>
                      </div>
                    </div>
                    <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-500">
                      Follow
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Earnings Tab */}
          <TabsContent value="earnings" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30">
                <CardContent className="p-6">
                  <p className="text-green-400 text-sm mb-1">Total Earnings</p>
                  <p className="text-3xl font-bold text-white">$1,245.80</p>
                  <p className="text-sm text-white/50 mt-2">Lifetime earnings from content</p>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-6">
                  <p className="text-white/60 text-sm mb-1">This Month</p>
                  <p className="text-3xl font-bold text-white">$345.20</p>
                  <p className="text-sm text-green-400 mt-2">+23% from last month</p>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-6">
                  <p className="text-white/60 text-sm mb-1">Pending Payout</p>
                  <p className="text-3xl font-bold text-white">$89.50</p>
                  <Button size="sm" className="mt-2 bg-green-600 hover:bg-green-500">
                    Withdraw
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Revenue Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white/60">Creator Share (70%)</span>
                      <span className="text-white">$871.06</span>
                    </div>
                    <Progress value={70} className="h-3 bg-white/10" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white/60">DAO Treasury (20%)</span>
                      <span className="text-white">$249.16</span>
                    </div>
                    <Progress value={20} className="h-3 bg-white/10" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white/60">Platform Operations (10%)</span>
                      <span className="text-white">$124.58</span>
                    </div>
                    <Progress value={10} className="h-3 bg-white/10" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Governance Tab */}
          <TabsContent value="governance" className="space-y-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Media DAO Governance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-white/60">
                  As a creator, you have voting rights on platform policies, content guidelines, and revenue distribution.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-white/5 border-white/10">
                    <CardContent className="p-4">
                      <h4 className="text-white font-medium mb-2">Active Proposal</h4>
                      <p className="text-sm text-white/60 mb-3">
                        Increase creator revenue share from 70% to 75%
                      </p>
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-green-600 hover:bg-green-500">Vote For</Button>
                        <Button size="sm" variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10 bg-transparent">
                          Vote Against
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-white/5 border-white/10">
                    <CardContent className="p-4">
                      <h4 className="text-white font-medium mb-2">Your Voting Power</h4>
                      <p className="text-3xl font-bold text-purple-400 mb-1">245</p>
                      <p className="text-sm text-white/50">Based on content engagement & $NEXT holdings</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="bg-[#0d1117] border-white/10 max-w-lg w-full">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                Create New Content
                <Button variant="ghost" size="sm" onClick={() => setShowUploadModal(false)} className="text-white/50">
                  ×
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-white">Content Type</Label>
                <Select defaultValue="video">
                  <SelectTrigger className="bg-white/5 border-white/10 text-white mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="article">Article</SelectItem>
                    <SelectItem value="podcast">Podcast</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-white">Title</Label>
                <Input className="bg-white/5 border-white/10 text-white mt-2" placeholder="Enter content title..." />
              </div>
              <div>
                <Label className="text-white">Description</Label>
                <Textarea className="bg-white/5 border-white/10 text-white mt-2" placeholder="Describe your content..." rows={4} />
              </div>
              <div>
                <Label className="text-white">Upload File</Label>
                <div className="mt-2 border-2 border-dashed border-white/20 rounded-lg p-8 text-center">
                  <Upload className="w-8 h-8 text-white/40 mx-auto mb-2" />
                  <p className="text-white/60">Drag & drop or click to upload</p>
                </div>
              </div>
              <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
                Publish Content
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
