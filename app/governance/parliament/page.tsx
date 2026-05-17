"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  ArrowLeft, 
  Video,
  Users,
  Calendar,
  MessageSquare,
  Hand,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Monitor,
  Vote,
  Clock,
  Play,
  Eye,
  ThumbsUp,
  ThumbsDown,
  BarChart3,
  Layers,
  Maximize2,
  Share2,
  Settings,
  Bell,
  ChevronRight,
  Sparkles,
  Globe,
  Headphones
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"

const liveDebates = [
  {
    id: 1,
    title: "Municipal Budget 2026: Youth Priorities",
    status: "live",
    viewers: 1245,
    participants: 8,
    duration: "1:23:45",
    topic: "Budget Allocation",
    speakers: [
      { name: "Sarah Chen", role: "Youth Representative", speaking: true },
      { name: "Mayor Williams", role: "City Official", speaking: false },
      { name: "James Park", role: "Student Council", speaking: false }
    ]
  },
  {
    id: 2,
    title: "Millennial Mobilization: Implementation Roadmap",
    status: "scheduled",
    scheduledFor: "Tomorrow, 3:00 PM",
    registeredViewers: 456,
    topic: "Youth Voting Rights"
  },
  {
    id: 3,
    title: "Climate Action Plan Review",
    status: "scheduled",
    scheduledFor: "Friday, 5:00 PM",
    registeredViewers: 234,
    topic: "Environment"
  }
]

const policySimulations = [
  {
    id: 1,
    title: "Universal Basic Income Impact",
    description: "Simulate the effects of implementing UBI at municipal level",
    variables: ["Amount", "Eligibility Age", "Funding Source"],
    participants: 567,
    avgEngagement: "12 min"
  },
  {
    id: 2,
    title: "Public Transit Expansion",
    description: "Model transit coverage and ridership predictions",
    variables: ["Routes", "Frequency", "Fare Structure"],
    participants: 345,
    avgEngagement: "8 min"
  },
  {
    id: 3,
    title: "Affordable Housing Zoning",
    description: "Visualize density changes and housing availability",
    variables: ["Zones", "Height Limits", "Affordable Units %"],
    participants: 234,
    avgEngagement: "15 min"
  }
]

export default function DigitalParliamentPage() {
  const [activeTab, setActiveTab] = useState("chamber")
  const [isMuted, setIsMuted] = useState(true)
  const [isCameraOn, setIsCameraOn] = useState(false)
  const [handRaised, setHandRaised] = useState(false)
  const [selectedPolicy, setSelectedPolicy] = useState<number | null>(null)
  const [simulationValues, setSimulationValues] = useState({
    amount: 500,
    age: 18,
    coverage: 50
  })

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
                  <Globe className="w-5 h-5 text-cyan-400" />
                  AR / Digital Parliament
                </h1>
                <p className="text-sm text-white/50">Immersive deliberation & policy visualization</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-red-500 text-white border-0 animate-pulse">
                <span className="w-2 h-2 bg-white rounded-full mr-2 inline-block" />
                1 Live Session
              </Badge>
              <Button variant="outline" className="border-white/20 text-white bg-transparent">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-white/5 border border-white/10 mb-6">
            <TabsTrigger value="chamber" className="data-[state=active]:bg-white/10">
              <Video className="w-4 h-4 mr-2" />
              Live Chamber
            </TabsTrigger>
            <TabsTrigger value="simulations" className="data-[state=active]:bg-white/10">
              <Layers className="w-4 h-4 mr-2" />
              Policy Simulations
            </TabsTrigger>
            <TabsTrigger value="schedule" className="data-[state=active]:bg-white/10">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule
            </TabsTrigger>
            <TabsTrigger value="ar" className="data-[state=active]:bg-white/10">
              <Sparkles className="w-4 h-4 mr-2" />
              AR Experience
            </TabsTrigger>
          </TabsList>

          {/* Live Chamber Tab */}
          <TabsContent value="chamber">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Main Video Area */}
              <div className="lg:col-span-3 space-y-4">
                <Card className="bg-white/5 border-white/10 overflow-hidden">
                  <div className="aspect-video bg-gradient-to-br from-slate-900 to-slate-800 relative">
                    {/* Video Stream Placeholder */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-24 h-24 rounded-full bg-cyan-500/20 flex items-center justify-center mx-auto mb-4">
                          <Video className="w-12 h-12 text-cyan-400" />
                        </div>
                        <h3 className="text-white text-xl font-semibold">Municipal Budget 2026: Youth Priorities</h3>
                        <p className="text-white/60 mt-2">Live Debate in Progress</p>
                      </div>
                    </div>
                    
                    {/* Live indicator */}
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <Badge className="bg-red-500 text-white border-0">
                        <span className="w-2 h-2 bg-white rounded-full mr-2 inline-block animate-pulse" />
                        LIVE
                      </Badge>
                      <Badge className="bg-black/50 text-white border-0">
                        <Eye className="w-3 h-3 mr-1" />
                        1,245 watching
                      </Badge>
                      <Badge className="bg-black/50 text-white border-0">
                        <Clock className="w-3 h-3 mr-1" />
                        1:23:45
                      </Badge>
                    </div>

                    {/* Current Speaker */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 bg-black/70 backdrop-blur-sm rounded-lg px-4 py-2">
                          <Avatar className="w-10 h-10 border-2 border-cyan-400">
                            <AvatarFallback className="bg-cyan-500/20 text-cyan-400">SC</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-white font-medium">Sarah Chen</p>
                            <p className="text-white/60 text-sm">Youth Representative • Speaking</p>
                          </div>
                          <div className="flex items-center gap-1 ml-4">
                            <div className="w-1 h-4 bg-cyan-400 rounded animate-pulse" />
                            <div className="w-1 h-6 bg-cyan-400 rounded animate-pulse delay-75" />
                            <div className="w-1 h-3 bg-cyan-400 rounded animate-pulse delay-150" />
                            <div className="w-1 h-5 bg-cyan-400 rounded animate-pulse delay-200" />
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="bg-black/50 text-white">
                          <Maximize2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Controls */}
                  <CardContent className="p-4 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button 
                          variant={isMuted ? "outline" : "default"}
                          size="sm"
                          onClick={() => setIsMuted(!isMuted)}
                          className={isMuted ? "border-white/20 text-white bg-transparent" : "bg-cyan-600"}
                        >
                          {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                        </Button>
                        <Button 
                          variant={isCameraOn ? "default" : "outline"}
                          size="sm"
                          onClick={() => setIsCameraOn(!isCameraOn)}
                          className={isCameraOn ? "bg-cyan-600" : "border-white/20 text-white bg-transparent"}
                        >
                          {isCameraOn ? <Camera className="w-4 h-4" /> : <CameraOff className="w-4 h-4" />}
                        </Button>
                        <Button variant="outline" size="sm" className="border-white/20 text-white bg-transparent">
                          <Monitor className="w-4 h-4" />
                        </Button>
                        <div className="h-6 w-px bg-white/20 mx-2" />
                        <Button 
                          variant={handRaised ? "default" : "outline"}
                          size="sm"
                          onClick={() => setHandRaised(!handRaised)}
                          className={handRaised ? "bg-yellow-600" : "border-white/20 text-white bg-transparent"}
                        >
                          <Hand className="w-4 h-4 mr-2" />
                          {handRaised ? "Hand Raised" : "Raise Hand"}
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="border-white/20 text-white bg-transparent">
                          <Share2 className="w-4 h-4 mr-2" />
                          Share
                        </Button>
                        <Button variant="outline" size="sm" className="border-white/20 text-white bg-transparent">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Live Polling */}
                <Card className="bg-white/5 border-white/10">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-lg flex items-center gap-2">
                      <Vote className="w-5 h-5 text-purple-400" />
                      Live Poll: Should youth budget allocation increase by 15%?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-white flex items-center gap-2">
                            <ThumbsUp className="w-4 h-4 text-green-400" />
                            Yes, increase allocation
                          </span>
                          <span className="text-white">68%</span>
                        </div>
                        <Progress value={68} className="h-3 bg-white/10" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-white flex items-center gap-2">
                            <ThumbsDown className="w-4 h-4 text-red-400" />
                            No, maintain current levels
                          </span>
                          <span className="text-white">32%</span>
                        </div>
                        <Progress value={32} className="h-3 bg-white/10" />
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-sm text-white/50">845 votes cast</span>
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-green-600 hover:bg-green-500">Vote Yes</Button>
                          <Button size="sm" variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10 bg-transparent">Vote No</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-4">
                {/* Speakers */}
                <Card className="bg-white/5 border-white/10">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-sm">Participants (8)</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {liveDebates[0].speakers?.map((speaker, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Avatar className={`w-10 h-10 ${speaker.speaking ? "ring-2 ring-cyan-400" : ""}`}>
                          <AvatarFallback className="bg-cyan-500/20 text-cyan-400 text-sm">
                            {speaker.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium truncate">{speaker.name}</p>
                          <p className="text-white/50 text-xs truncate">{speaker.role}</p>
                        </div>
                        {speaker.speaking && (
                          <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 text-xs">
                            Speaking
                          </Badge>
                        )}
                      </div>
                    ))}
                    <Button variant="ghost" size="sm" className="w-full text-white/50 hover:text-white">
                      View all participants
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </CardContent>
                </Card>

                {/* Chat */}
                <Card className="bg-white/5 border-white/10">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-sm flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Live Chat
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-48 overflow-y-auto space-y-2 mb-3">
                      <div className="text-sm">
                        <span className="text-cyan-400">@youth_voter:</span>
                        <span className="text-white/70 ml-2">Great points on education funding!</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-purple-400">@student_council:</span>
                        <span className="text-white/70 ml-2">We need more transit investment</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-green-400">@civic_minded:</span>
                        <span className="text-white/70 ml-2">What about housing affordability?</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Send a message..."
                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
                      />
                      <Button size="sm" className="bg-cyan-600 hover:bg-cyan-500">Send</Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Queue */}
                <Card className="bg-white/5 border-white/10">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-sm flex items-center gap-2">
                      <Hand className="w-4 h-4 text-yellow-400" />
                      Speaker Queue (3)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-white/50">1.</span>
                      <span className="text-white">Alex Rivera</span>
                      <Badge className="bg-yellow-500/20 text-yellow-400 border-0 text-xs ml-auto">Next</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-white/50">2.</span>
                      <span className="text-white">Jordan Lee</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-white/50">3.</span>
                      <span className="text-white">Taylor Kim</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Policy Simulations Tab */}
          <TabsContent value="simulations">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Simulation List */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-white">Available Simulations</h2>
                {policySimulations.map((sim) => (
                  <Card 
                    key={sim.id} 
                    className={`bg-white/5 border-white/10 cursor-pointer transition-colors ${
                      selectedPolicy === sim.id ? "border-cyan-500/50 bg-cyan-500/5" : "hover:border-white/20"
                    }`}
                    onClick={() => setSelectedPolicy(sim.id)}
                  >
                    <CardContent className="p-4">
                      <h3 className="text-white font-medium">{sim.title}</h3>
                      <p className="text-sm text-white/60 mt-1">{sim.description}</p>
                      <div className="flex items-center gap-4 mt-3 text-sm text-white/50">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {sim.participants}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {sim.avgEngagement}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-3">
                        {sim.variables.map((v, i) => (
                          <Badge key={i} variant="outline" className="border-white/20 text-white/60 text-xs">
                            {v}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Simulation Workspace */}
              <div className="lg:col-span-2">
                {selectedPolicy ? (
                  <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Layers className="w-5 h-5 text-cyan-400" />
                        Universal Basic Income Impact Simulator
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Visualization Area */}
                      <div className="aspect-video bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl flex items-center justify-center">
                        <div className="text-center">
                          <BarChart3 className="w-16 h-16 text-cyan-400/50 mx-auto mb-4" />
                          <p className="text-white/60">Interactive Policy Visualization</p>
                          <p className="text-sm text-white/40 mt-2">Adjust parameters below to see impact</p>
                        </div>
                      </div>

                      {/* Parameter Controls */}
                      <div className="space-y-6">
                        <div>
                          <div className="flex justify-between mb-2">
                            <label className="text-white text-sm">Monthly UBI Amount</label>
                            <span className="text-cyan-400 font-medium">${simulationValues.amount}</span>
                          </div>
                          <Slider
                            value={[simulationValues.amount]}
                            onValueChange={([v]) => setSimulationValues(prev => ({ ...prev, amount: v }))}
                            min={100}
                            max={2000}
                            step={50}
                          />
                        </div>
                        <div>
                          <div className="flex justify-between mb-2">
                            <label className="text-white text-sm">Minimum Eligibility Age</label>
                            <span className="text-cyan-400 font-medium">{simulationValues.age} years</span>
                          </div>
                          <Slider
                            value={[simulationValues.age]}
                            onValueChange={([v]) => setSimulationValues(prev => ({ ...prev, age: v }))}
                            min={16}
                            max={25}
                            step={1}
                          />
                        </div>
                        <div>
                          <div className="flex justify-between mb-2">
                            <label className="text-white text-sm">Population Coverage</label>
                            <span className="text-cyan-400 font-medium">{simulationValues.coverage}%</span>
                          </div>
                          <Slider
                            value={[simulationValues.coverage]}
                            onValueChange={([v]) => setSimulationValues(prev => ({ ...prev, coverage: v }))}
                            min={10}
                            max={100}
                            step={5}
                          />
                        </div>
                      </div>

                      {/* Projected Impact */}
                      <div className="grid grid-cols-3 gap-4">
                        <Card className="bg-white/5 border-white/10">
                          <CardContent className="p-4 text-center">
                            <p className="text-2xl font-bold text-green-400">-12%</p>
                            <p className="text-sm text-white/50">Poverty Rate</p>
                          </CardContent>
                        </Card>
                        <Card className="bg-white/5 border-white/10">
                          <CardContent className="p-4 text-center">
                            <p className="text-2xl font-bold text-cyan-400">$45M</p>
                            <p className="text-sm text-white/50">Annual Cost</p>
                          </CardContent>
                        </Card>
                        <Card className="bg-white/5 border-white/10">
                          <CardContent className="p-4 text-center">
                            <p className="text-2xl font-bold text-purple-400">+8%</p>
                            <p className="text-sm text-white/50">Economic Activity</p>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="flex gap-3">
                        <Button className="flex-1 bg-cyan-600 hover:bg-cyan-500">
                          <Play className="w-4 h-4 mr-2" />
                          Run Full Simulation
                        </Button>
                        <Button variant="outline" className="border-white/20 text-white bg-transparent">
                          <Share2 className="w-4 h-4 mr-2" />
                          Share Results
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="bg-white/5 border-white/10 h-full flex items-center justify-center">
                    <CardContent className="text-center py-16">
                      <Layers className="w-16 h-16 text-white/20 mx-auto mb-4" />
                      <h3 className="text-white text-lg font-medium">Select a Simulation</h3>
                      <p className="text-white/50 mt-2">Choose a policy simulation from the left to begin exploring</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Schedule Tab */}
          <TabsContent value="schedule">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">Upcoming Sessions</h2>
                <Button className="bg-cyan-600 hover:bg-cyan-500">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule New Session
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {liveDebates.map((debate) => (
                  <Card key={debate.id} className="bg-white/5 border-white/10">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <Badge className={
                          debate.status === "live" 
                            ? "bg-red-500 text-white border-0" 
                            : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                        }>
                          {debate.status === "live" ? "LIVE NOW" : "Scheduled"}
                        </Badge>
                        <Badge variant="outline" className="border-white/20 text-white/60">
                          {debate.topic}
                        </Badge>
                      </div>
                      <h3 className="text-white font-medium mb-2">{debate.title}</h3>
                      {debate.status === "live" ? (
                        <div className="flex items-center gap-4 text-sm text-white/50 mb-4">
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {debate.viewers?.toLocaleString()} watching
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {debate.participants} speakers
                          </span>
                        </div>
                      ) : (
                        <div className="text-sm text-white/50 mb-4">
                          <p className="flex items-center gap-2">
                            <Calendar className="w-3 h-3" />
                            {debate.scheduledFor}
                          </p>
                          <p className="flex items-center gap-2 mt-1">
                            <Users className="w-3 h-3" />
                            {debate.registeredViewers} registered
                          </p>
                        </div>
                      )}
                      <Button 
                        className={debate.status === "live" ? "w-full bg-red-600 hover:bg-red-500" : "w-full bg-cyan-600 hover:bg-cyan-500"}
                      >
                        {debate.status === "live" ? "Join Now" : "Set Reminder"}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* AR Experience Tab */}
          <TabsContent value="ar">
            <Card className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border-cyan-500/20">
              <CardContent className="p-8 text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">Immersive AR Parliament Experience</h2>
                <p className="text-white/60 max-w-2xl mx-auto mb-6">
                  Step into a virtual parliament chamber where you can participate in debates, 
                  visualize policy impacts in 3D, and collaborate with other citizens in an immersive environment.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <Card className="bg-white/5 border-white/10">
                    <CardContent className="p-4">
                      <Headphones className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                      <h3 className="text-white font-medium">Spatial Audio</h3>
                      <p className="text-sm text-white/50">Hear speakers as if you're in the room</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-white/5 border-white/10">
                    <CardContent className="p-4">
                      <Layers className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                      <h3 className="text-white font-medium">3D Policy Models</h3>
                      <p className="text-sm text-white/50">Interact with data visualizations</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-white/5 border-white/10">
                    <CardContent className="p-4">
                      <Users className="w-8 h-8 text-green-400 mx-auto mb-2" />
                      <h3 className="text-white font-medium">Avatar Presence</h3>
                      <p className="text-sm text-white/50">Represent yourself in the chamber</p>
                    </CardContent>
                  </Card>
                </div>
                <div className="flex justify-center gap-4">
                  <Button className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500">
                    <Play className="w-4 h-4 mr-2" />
                    Launch AR Experience
                  </Button>
                  <Button variant="outline" className="border-white/20 text-white bg-transparent">
                    Download Mobile App
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
