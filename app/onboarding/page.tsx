"use client"

export const dynamic = 'force-static'

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2,
  Vote,
  Users,
  Coins,
  Shield,
  BookOpen,
  Play,
  Trophy,
  Star,
  Sparkles,
  Target,
  MessageSquare,
  FileText,
  Scale,
  Zap,
  Globe,
  Award,
  ChevronRight,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

const onboardingSteps = [
  {
    id: 1,
    title: "Welcome to Municipal DAO",
    subtitle: "Your voice matters in shaping our community",
    content: "welcome",
    icon: Sparkles
  },
  {
    id: 2,
    title: "How DAO Governance Works",
    subtitle: "Understanding decentralized decision-making",
    content: "governance",
    icon: Vote
  },
  {
    id: 3,
    title: "Your Digital Identity (SBT)",
    subtitle: "Soulbound Tokens & Credentials",
    content: "identity",
    icon: Shield
  },
  {
    id: 4,
    title: "Voting & Consensus",
    subtitle: "Different ways to make your voice heard",
    content: "voting",
    icon: Scale
  },
  {
    id: 5,
    title: "$NEXT Token & Treasury",
    subtitle: "Understanding the economic system",
    content: "treasury",
    icon: Coins
  },
  {
    id: 6,
    title: "Get Involved",
    subtitle: "Ways to participate and earn rewards",
    content: "participate",
    icon: Users
  },
  {
    id: 7,
    title: "You're Ready!",
    subtitle: "Complete your profile and start participating",
    content: "complete",
    icon: Trophy
  }
]

const quizQuestions = [
  {
    question: "What is quadratic voting?",
    options: [
      "Voting where everyone gets one vote",
      "Voting where vote cost increases quadratically",
      "Voting only for candidates",
      "Voting by age group"
    ],
    correct: 1
  },
  {
    question: "What is a Soulbound Token (SBT)?",
    options: [
      "A cryptocurrency you can trade",
      "A non-transferable credential tied to your identity",
      "A voting ticket",
      "A membership fee"
    ],
    correct: 1
  },
  {
    question: "Who can veto generationally harmful policies?",
    options: [
      "Only the mayor",
      "The Youth Assembly",
      "Anyone with $NEXT tokens",
      "No one can veto"
    ],
    correct: 1
  }
]

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [quizAnswers, setQuizAnswers] = useState<{[key: number]: number}>({})
  const [showQuiz, setShowQuiz] = useState(false)
  const [earnedBadges, setEarnedBadges] = useState<string[]>([])

  const progress = ((currentStep - 1) / (onboardingSteps.length - 1)) * 100

  const handleNext = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep])
    }
    if (currentStep < onboardingSteps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleQuizAnswer = (questionIndex: number, answerIndex: number) => {
    setQuizAnswers({ ...quizAnswers, [questionIndex]: answerIndex })
  }

  const completeQuiz = () => {
    const correct = Object.entries(quizAnswers).filter(
      ([qIndex, answer]) => quizQuestions[Number(qIndex)].correct === answer
    ).length
    
    if (correct >= 2) {
      setEarnedBadges([...earnedBadges, "DAO Scholar"])
    }
    setShowQuiz(false)
    handleNext()
  }

  const renderStepContent = () => {
    const step = onboardingSteps.find(s => s.id === currentStep)
    if (!step) return null

    switch (step.content) {
      case "welcome":
        return (
          <div className="text-center py-8">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mx-auto mb-8">
              <Sparkles className="w-16 h-16 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Welcome to the Future of Democracy</h2>
            <p className="text-white/60 max-w-xl mx-auto mb-8">
              Municipal DAO empowers youth voices in local governance. Through blockchain technology 
              and innovative voting mechanisms, your participation directly shapes community decisions.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-4 text-center">
                  <Vote className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <p className="text-white font-medium">Vote on Issues</p>
                  <p className="text-white/50 text-sm">Your vote counts</p>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-4 text-center">
                  <FileText className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <p className="text-white font-medium">Create Proposals</p>
                  <p className="text-white/50 text-sm">Shape policy</p>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-4 text-center">
                  <Coins className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                  <p className="text-white font-medium">Earn Rewards</p>
                  <p className="text-white/50 text-sm">Get $NEXT tokens</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case "governance":
        return (
          <div className="py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">How DAO Governance Works</h2>
                <p className="text-white/60 mb-6">
                  A DAO (Decentralized Autonomous Organization) is a community-led entity with no central authority. 
                  Decisions are made collectively through voting, with rules encoded on the blockchain.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-400 font-bold">1</span>
                    </div>
                    <div>
                      <h3 className="text-white font-medium">Issues are Raised</h3>
                      <p className="text-white/50 text-sm">Community members identify problems or opportunities</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-purple-400 font-bold">2</span>
                    </div>
                    <div>
                      <h3 className="text-white font-medium">Proposals are Created</h3>
                      <p className="text-white/50 text-sm">Solutions are formally proposed with implementation details</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-green-400 font-bold">3</span>
                    </div>
                    <div>
                      <h3 className="text-white font-medium">Community Votes</h3>
                      <p className="text-white/50 text-sm">Members vote using various consensus mechanisms</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-yellow-400 font-bold">4</span>
                    </div>
                    <div>
                      <h3 className="text-white font-medium">Execution</h3>
                      <p className="text-white/50 text-sm">Approved proposals are automatically implemented</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl p-6 border border-blue-500/20">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Play className="w-5 h-5 text-blue-400" />
                  Watch: DAO Governance Explained
                </h3>
                <div className="aspect-video bg-black/30 rounded-xl flex items-center justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                    <Play className="w-8 h-8 text-white" />
                  </div>
                </div>
                <p className="text-white/50 text-sm">2 minute explainer video</p>
              </div>
            </div>
          </div>
        )

      case "identity":
        return (
          <div className="py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Your Digital Identity</h2>
                <p className="text-white/60 mb-6">
                  Soulbound Tokens (SBTs) are non-transferable credentials that prove your identity, 
                  qualifications, and participation history without revealing personal information.
                </p>
                <div className="space-y-4">
                  <Card className="bg-white/5 border-white/10">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-green-400" />
                      </div>
                      <div>
                        <h3 className="text-white font-medium">Age Verification</h3>
                        <p className="text-white/50 text-sm">Proves you're eligible to vote (16+)</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-white/5 border-white/10">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                        <Globe className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-white font-medium">Residency</h3>
                        <p className="text-white/50 text-sm">Confirms your municipal district</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-white/5 border-white/10">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                        <Award className="w-6 h-6 text-purple-400" />
                      </div>
                      <div>
                        <h3 className="text-white font-medium">Participation History</h3>
                        <p className="text-white/50 text-sm">Tracks your civic engagement</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="w-64 h-80 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-6 relative shadow-2xl">
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-white/20 text-white border-0">SBT</Badge>
                  </div>
                  <div className="w-20 h-20 rounded-full bg-white/20 mx-auto mt-4 flex items-center justify-center">
                    <Shield className="w-10 h-10 text-white" />
                  </div>
                  <div className="text-center mt-6">
                    <p className="text-white/60 text-sm">Citizen ID</p>
                    <p className="text-white text-xl font-bold mt-1">Your Name</p>
                    <p className="text-white/60 text-sm mt-2">Municipal District</p>
                  </div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex items-center justify-between text-xs text-white/60">
                      <span>Verified</span>
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case "voting":
        return (
          <div className="py-8">
            <h2 className="text-2xl font-bold text-white mb-4">Voting & Consensus Mechanisms</h2>
            <p className="text-white/60 mb-6">
              Different types of decisions use different voting methods. This ensures fair representation 
              and prevents manipulation.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
                <CardContent className="p-4">
                  <Target className="w-8 h-8 text-blue-400 mb-3" />
                  <h3 className="text-white font-medium">Quadratic Voting</h3>
                  <p className="text-white/50 text-sm mt-2">
                    Cost to vote increases quadratically. Prevents wealthy users from dominating.
                  </p>
                  <Badge className="mt-3 bg-blue-500/20 text-blue-400 border-blue-500/30">
                    Budget Decisions
                  </Badge>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
                <CardContent className="p-4">
                  <Zap className="w-8 h-8 text-purple-400 mb-3" />
                  <h3 className="text-white font-medium">Conviction Voting</h3>
                  <p className="text-white/50 text-sm mt-2">
                    Vote strength grows over time. Rewards long-term commitment.
                  </p>
                  <Badge className="mt-3 bg-purple-500/20 text-purple-400 border-purple-500/30">
                    Long-term Projects
                  </Badge>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
                <CardContent className="p-4">
                  <Users className="w-8 h-8 text-green-400 mb-3" />
                  <h3 className="text-white font-medium">Liquid Democracy</h3>
                  <p className="text-white/50 text-sm mt-2">
                    Delegate your vote to trusted experts on specific topics.
                  </p>
                  <Badge className="mt-3 bg-green-500/20 text-green-400 border-green-500/30">
                    Technical Decisions
                  </Badge>
                </CardContent>
              </Card>
            </div>
            <div className="mt-8">
              <Button 
                className="bg-gradient-to-r from-blue-600 to-purple-600"
                onClick={() => setShowQuiz(true)}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Take Quick Quiz & Earn Badge
              </Button>
            </div>
          </div>
        )

      case "treasury":
        return (
          <div className="py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">$NEXT Token & Treasury</h2>
                <p className="text-white/60 mb-6">
                  $NEXT is an asset-backed token used for voting, rewards, and accessing DAO services. 
                  Unlike speculative cryptocurrencies, it's backed by real resources.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                      <Coins className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">Asset-Backed</p>
                      <p className="text-white/50 text-sm">Lithium, Hydrogen, Strategic Resources</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                      <Target className="w-5 h-5 text-green-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">Use Cases</p>
                      <p className="text-white/50 text-sm">UBI, Campaign Funding, Public Goods</p>
                    </div>
                  </div>
                </div>
              </div>
              <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
                <CardContent className="p-6">
                  <h3 className="text-white font-semibold mb-4">Treasury Distribution</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-white/60">Universal Basic Income</span>
                        <span className="text-white">40%</span>
                      </div>
                      <Progress value={40} className="h-2 bg-white/10" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-white/60">Campaign Funding</span>
                        <span className="text-white">30%</span>
                      </div>
                      <Progress value={30} className="h-2 bg-white/10" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-white/60">Public Goods</span>
                        <span className="text-white">20%</span>
                      </div>
                      <Progress value={20} className="h-2 bg-white/10" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-white/60">Operations</span>
                        <span className="text-white">10%</span>
                      </div>
                      <Progress value={10} className="h-2 bg-white/10" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case "participate":
        return (
          <div className="py-8">
            <h2 className="text-2xl font-bold text-white mb-4">Ways to Participate</h2>
            <p className="text-white/60 mb-6">
              There are many ways to get involved and earn $NEXT rewards for your contributions.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-white/5 border-white/10 hover:border-blue-500/30 transition-colors cursor-pointer">
                <CardContent className="p-4 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <Vote className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Vote on Proposals</h3>
                    <p className="text-white/50 text-sm">Earn 5-50 $NEXT per vote</p>
                    <Badge className="mt-2 bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                      Easy
                    </Badge>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10 hover:border-green-500/30 transition-colors cursor-pointer">
                <CardContent className="p-4 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Create Proposals</h3>
                    <p className="text-white/50 text-sm">Earn 100-500 $NEXT if passed</p>
                    <Badge className="mt-2 bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                      Medium
                    </Badge>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10 hover:border-purple-500/30 transition-colors cursor-pointer">
                <CardContent className="p-4 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Town Hall Participation</h3>
                    <p className="text-white/50 text-sm">Earn 20-100 $NEXT per session</p>
                    <Badge className="mt-2 bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
                      Easy
                    </Badge>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10 hover:border-yellow-500/30 transition-colors cursor-pointer">
                <CardContent className="p-4 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Bounty Board Tasks</h3>
                    <p className="text-white/50 text-sm">Earn 200-2000 $NEXT per task</p>
                    <Badge className="mt-2 bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">
                      Advanced
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case "complete":
        return (
          <div className="text-center py-8">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-8">
              <Trophy className="w-16 h-16 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">You're Ready!</h2>
            <p className="text-white/60 max-w-xl mx-auto mb-8">
              Congratulations! You've completed the onboarding tutorial. You now understand how 
              Municipal DAO works and how to participate in governance.
            </p>
            
            {earnedBadges.length > 0 && (
              <div className="mb-8">
                <h3 className="text-white font-medium mb-4">Badges Earned</h3>
                <div className="flex justify-center gap-4">
                  {earnedBadges.map((badge, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                        <Star className="w-8 h-8 text-white" />
                      </div>
                      <span className="text-white text-sm mt-2">{badge}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-center gap-4">
              <Link href="/governance">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500">
                  Go to Governance Hub
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button variant="outline" className="border-white/20 text-white bg-transparent">
                  Complete Profile
                </Button>
              </Link>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-[#030712]">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#030712]/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-white/70 hover:text-white">
                  <X className="w-4 h-4 mr-2" />
                  Skip Tutorial
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white/50 text-sm">Step {currentStep} of {onboardingSteps.length}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="container mx-auto px-4 py-6">
        <Progress value={progress} className="h-2 bg-white/10" />
        <div className="flex justify-between mt-4">
          {onboardingSteps.map((step) => (
            <div 
              key={step.id} 
              className={`flex flex-col items-center ${
                step.id === currentStep ? "opacity-100" : "opacity-50"
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                completedSteps.includes(step.id) 
                  ? "bg-green-500" 
                  : step.id === currentStep 
                    ? "bg-blue-500" 
                    : "bg-white/10"
              }`}>
                {completedSteps.includes(step.id) ? (
                  <CheckCircle2 className="w-5 h-5 text-white" />
                ) : (
                  <step.icon className="w-5 h-5 text-white" />
                )}
              </div>
              <span className="text-xs text-white/50 mt-2 hidden md:block max-w-[80px] text-center">
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <Card className="bg-white/5 border-white/10 max-w-4xl mx-auto">
          <CardHeader className="text-center border-b border-white/10">
            <CardTitle className="text-2xl text-white">
              {onboardingSteps[currentStep - 1]?.title}
            </CardTitle>
            <CardDescription className="text-white/60">
              {onboardingSteps[currentStep - 1]?.subtitle}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between max-w-4xl mx-auto mt-6">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="border-white/20 text-white bg-transparent disabled:opacity-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          {currentStep < onboardingSteps.length ? (
            <Button 
              onClick={handleNext}
              className="bg-gradient-to-r from-blue-600 to-purple-600"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Link href="/governance">
              <Button className="bg-gradient-to-r from-green-600 to-emerald-600">
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Quiz Modal */}
      {showQuiz && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="bg-[#0d1117] border-white/10 max-w-lg w-full">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-400" />
                Quick Quiz
              </CardTitle>
              <CardDescription className="text-white/60">
                Answer 2 out of 3 correctly to earn the "DAO Scholar" badge!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {quizQuestions.map((q, qIndex) => (
                <div key={qIndex}>
                  <p className="text-white font-medium mb-3">{qIndex + 1}. {q.question}</p>
                  <div className="space-y-2">
                    {q.options.map((option, oIndex) => (
                      <button
                        key={oIndex}
                        onClick={() => handleQuizAnswer(qIndex, oIndex)}
                        className={`w-full text-left p-3 rounded-lg border transition-colors ${
                          quizAnswers[qIndex] === oIndex 
                            ? "bg-blue-500/20 border-blue-500/50 text-white" 
                            : "bg-white/5 border-white/10 text-white/70 hover:border-white/20"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <Button 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
                onClick={completeQuiz}
                disabled={Object.keys(quizAnswers).length < 3}
              >
                Submit Answers
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
