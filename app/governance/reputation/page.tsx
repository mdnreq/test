"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  ArrowLeft, Award, Star, Trophy, Target, Flame, 
  Vote, MessageSquare, Users, Calendar, Shield, Zap,
  TrendingUp, Crown, Medal, Heart, Eye, Share2,
  Lock, CheckCircle2, Clock
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const userStats = {
  reputation: 2847,
  level: 12,
  rank: "Community Champion",
  nextLevel: 3000,
  streak: 14,
  longestStreak: 28,
  totalVotes: 47,
  proposalsCreated: 3,
  commentsPosted: 89,
  townHallsAttended: 12,
  badgesEarned: 18,
  totalBadges: 42
}

const badges = [
  // Earned badges
  { id: "1", name: "First Vote", description: "Cast your first vote", icon: Vote, color: "text-blue-400 bg-blue-500/20", earned: true, earnedDate: "2024-01-15", rarity: "common" },
  { id: "2", name: "Voice Heard", description: "Post your first comment", icon: MessageSquare, color: "text-green-400 bg-green-500/20", earned: true, earnedDate: "2024-01-16", rarity: "common" },
  { id: "3", name: "Town Hall Regular", description: "Attend 5 town halls", icon: Users, color: "text-purple-400 bg-purple-500/20", earned: true, earnedDate: "2024-02-20", rarity: "uncommon" },
  { id: "4", name: "Week Warrior", description: "7-day participation streak", icon: Flame, color: "text-orange-400 bg-orange-500/20", earned: true, earnedDate: "2024-03-01", rarity: "uncommon" },
  { id: "5", name: "Proposal Pioneer", description: "Create your first proposal", icon: Zap, color: "text-yellow-400 bg-yellow-500/20", earned: true, earnedDate: "2024-03-15", rarity: "rare" },
  { id: "6", name: "Consensus Builder", description: "Get 50+ votes on a proposal", icon: Target, color: "text-cyan-400 bg-cyan-500/20", earned: true, earnedDate: "2024-04-10", rarity: "rare" },
  { id: "7", name: "Active Voter", description: "Vote on 25 proposals", icon: CheckCircle2, color: "text-emerald-400 bg-emerald-500/20", earned: true, earnedDate: "2024-05-01", rarity: "uncommon" },
  { id: "8", name: "Community Champion", description: "Reach 2500 reputation", icon: Trophy, color: "text-amber-400 bg-amber-500/20", earned: true, earnedDate: "2024-06-15", rarity: "epic" },
  // Locked badges
  { id: "9", name: "Month Master", description: "30-day participation streak", icon: Crown, color: "text-white/40 bg-white/10", earned: false, progress: 47, total: 100, rarity: "epic" },
  { id: "10", name: "Delegate", description: "Receive 10 vote delegations", icon: Shield, color: "text-white/40 bg-white/10", earned: false, progress: 3, total: 10, rarity: "rare" },
  { id: "11", name: "Policy Maker", description: "Have 3 proposals pass", icon: Medal, color: "text-white/40 bg-white/10", earned: false, progress: 1, total: 3, rarity: "epic" },
  { id: "12", name: "Youth Ambassador", description: "Refer 5 new youth members", icon: Heart, color: "text-white/40 bg-white/10", earned: false, progress: 2, total: 5, rarity: "rare" },
  { id: "13", name: "Legendary Voter", description: "Vote on 100 proposals", icon: Star, color: "text-white/40 bg-white/10", earned: false, progress: 47, total: 100, rarity: "legendary" },
  { id: "14", name: "DAO Elder", description: "1 year of active participation", icon: Eye, color: "text-white/40 bg-white/10", earned: false, progress: 180, total: 365, rarity: "legendary" },
]

const leaderboard = [
  { rank: 1, name: "Maya Thompson", reputation: 5420, level: 18, badges: 32, avatar: "MT", change: 0 },
  { rank: 2, name: "James Rodriguez", reputation: 4890, level: 17, badges: 28, avatar: "JR", change: 1 },
  { rank: 3, name: "Sarah Chen", reputation: 4650, level: 16, badges: 30, avatar: "SC", change: -1 },
  { rank: 4, name: "Alex Kim", reputation: 4120, level: 15, badges: 25, avatar: "AK", change: 2 },
  { rank: 5, name: "Jordan Williams", reputation: 3980, level: 14, badges: 24, avatar: "JW", change: 0 },
  { rank: 6, name: "Taylor Brown", reputation: 3650, level: 14, badges: 22, avatar: "TB", change: -2 },
  { rank: 7, name: "Morgan Davis", reputation: 3420, level: 13, badges: 21, avatar: "MD", change: 1 },
  { rank: 8, name: "Casey Martinez", reputation: 3100, level: 12, badges: 19, avatar: "CM", change: 0 },
  { rank: 9, name: "You", reputation: 2847, level: 12, badges: 18, avatar: "YO", change: 3, isUser: true },
  { rank: 10, name: "Riley Johnson", reputation: 2650, level: 11, badges: 17, avatar: "RJ", change: -1 },
]

const reputationHistory = [
  { action: "Voted on Youth Transit Pass", points: 10, date: "2024-11-20" },
  { action: "Comment received 5 upvotes", points: 25, date: "2024-11-19" },
  { action: "Attended Town Hall", points: 50, date: "2024-11-18" },
  { action: "Proposal reached quorum", points: 100, date: "2024-11-15" },
  { action: "7-day streak bonus", points: 35, date: "2024-11-14" },
  { action: "Referred new member", points: 75, date: "2024-11-10" },
]

const rarityColors = {
  common: "border-gray-500/50 bg-gray-500/10",
  uncommon: "border-green-500/50 bg-green-500/10",
  rare: "border-blue-500/50 bg-blue-500/10",
  epic: "border-purple-500/50 bg-purple-500/10",
  legendary: "border-amber-500/50 bg-amber-500/10 shadow-amber-500/20 shadow-lg"
}

const rarityText = {
  common: "text-gray-400",
  uncommon: "text-green-400",
  rare: "text-blue-400",
  epic: "text-purple-400",
  legendary: "text-amber-400"
}

export default function ReputationPage() {
  const [selectedBadge, setSelectedBadge] = useState<typeof badges[0] | null>(null)

  const earnedBadges = badges.filter(b => b.earned)
  const lockedBadges = badges.filter(b => !b.earned)

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/governance">
            <Button variant="ghost" size="icon" className="text-white/70 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Reputation & Badges</h1>
            <p className="text-white/60">Track your participation and earn rewards</p>
          </div>
        </div>

        {/* User Stats Card */}
        <Card className="bg-gradient-to-br from-purple-500/20 via-blue-500/10 to-cyan-500/20 border-white/10 mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-2xl font-bold text-white">
                  {userStats.level}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-2xl font-bold text-white">{userStats.reputation.toLocaleString()}</h2>
                    <span className="text-white/60">reputation</span>
                  </div>
                  <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">{userStats.rank}</Badge>
                  <div className="mt-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white/60">Level {userStats.level}</span>
                      <span className="text-white/60">{userStats.nextLevel - userStats.reputation} to Level {userStats.level + 1}</span>
                    </div>
                    <Progress value={(userStats.reputation % 500) / 5} className="h-2 w-48" />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-orange-400 mb-1">
                    <Flame className="w-5 h-5" />
                    <span className="text-2xl font-bold">{userStats.streak}</span>
                  </div>
                  <p className="text-xs text-white/50">Day Streak</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-blue-400 mb-1">
                    <Vote className="w-5 h-5" />
                    <span className="text-2xl font-bold">{userStats.totalVotes}</span>
                  </div>
                  <p className="text-xs text-white/50">Votes Cast</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-green-400 mb-1">
                    <Users className="w-5 h-5" />
                    <span className="text-2xl font-bold">{userStats.townHallsAttended}</span>
                  </div>
                  <p className="text-xs text-white/50">Town Halls</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-amber-400 mb-1">
                    <Award className="w-5 h-5" />
                    <span className="text-2xl font-bold">{userStats.badgesEarned}/{userStats.totalBadges}</span>
                  </div>
                  <p className="text-xs text-white/50">Badges</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="badges" className="space-y-6">
          <TabsList className="bg-white/5 border border-white/10">
            <TabsTrigger value="badges">Badges</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
          </TabsList>

          <TabsContent value="badges" className="space-y-6">
            {/* Earned Badges */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                Earned Badges ({earnedBadges.length})
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {earnedBadges.map((badge) => {
                  const Icon = badge.icon
                  return (
                    <Card 
                      key={badge.id} 
                      className={`cursor-pointer transition-all hover:scale-105 ${rarityColors[badge.rarity as keyof typeof rarityColors]}`}
                      onClick={() => setSelectedBadge(badge)}
                    >
                      <CardContent className="p-4 text-center">
                        <div className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center ${badge.color}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <p className="text-white font-medium text-sm">{badge.name}</p>
                        <p className={`text-xs capitalize ${rarityText[badge.rarity as keyof typeof rarityText]}`}>{badge.rarity}</p>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>

            {/* Locked Badges */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-white/40" />
                Locked Badges ({lockedBadges.length})
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {lockedBadges.map((badge) => {
                  const Icon = badge.icon
                  return (
                    <Card 
                      key={badge.id} 
                      className="bg-white/5 border-white/10 cursor-pointer transition-all hover:bg-white/10"
                      onClick={() => setSelectedBadge(badge)}
                    >
                      <CardContent className="p-4 text-center">
                        <div className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center ${badge.color} opacity-50`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <p className="text-white/60 font-medium text-sm">{badge.name}</p>
                        <p className={`text-xs capitalize ${rarityText[badge.rarity as keyof typeof rarityText]} opacity-50`}>{badge.rarity}</p>
                        {badge.progress !== undefined && (
                          <div className="mt-2">
                            <Progress value={(badge.progress / (badge.total || 1)) * 100} className="h-1" />
                            <p className="text-xs text-white/40 mt-1">{badge.progress}/{badge.total}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="leaderboard">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Crown className="w-5 h-5 text-amber-400" />
                  Community Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {leaderboard.map((user) => (
                    <div 
                      key={user.rank}
                      className={`flex items-center gap-4 p-3 rounded-lg ${user.isUser ? 'bg-blue-500/20 border border-blue-500/30' : 'bg-white/5'}`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        user.rank === 1 ? 'bg-amber-500 text-black' :
                        user.rank === 2 ? 'bg-gray-400 text-black' :
                        user.rank === 3 ? 'bg-amber-700 text-white' :
                        'bg-white/10 text-white'
                      }`}>
                        {user.rank}
                      </div>
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-sm font-bold text-white">
                        {user.avatar}
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${user.isUser ? 'text-blue-400' : 'text-white'}`}>
                          {user.name} {user.isUser && <Badge className="ml-2 bg-blue-500/20 text-blue-400 text-xs">You</Badge>}
                        </p>
                        <p className="text-sm text-white/50">Level {user.level} • {user.badges} badges</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-bold">{user.reputation.toLocaleString()}</p>
                        <p className={`text-xs ${user.change > 0 ? 'text-green-400' : user.change < 0 ? 'text-red-400' : 'text-white/40'}`}>
                          {user.change > 0 ? `↑${user.change}` : user.change < 0 ? `↓${Math.abs(user.change)}` : '—'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  Reputation History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {reputationHistory.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div>
                        <p className="text-white">{item.action}</p>
                        <p className="text-sm text-white/50">{new Date(item.date).toLocaleDateString()}</p>
                      </div>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        +{item.points}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rewards">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-amber-500/20 to-orange-500/10 border-amber-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-400" />
                    Level Rewards
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { level: 10, reward: "Custom profile badge", unlocked: true },
                    { level: 15, reward: "Priority town hall seating", unlocked: false },
                    { level: 20, reward: "Proposal fast-track access", unlocked: false },
                    { level: 25, reward: "DAO Council nomination eligibility", unlocked: false },
                  ].map((item, idx) => (
                    <div key={idx} className={`flex items-center justify-between p-3 rounded-lg ${item.unlocked ? 'bg-amber-500/20' : 'bg-white/5'}`}>
                      <div className="flex items-center gap-3">
                        {item.unlocked ? <CheckCircle2 className="w-5 h-5 text-amber-400" /> : <Lock className="w-5 h-5 text-white/30" />}
                        <span className={item.unlocked ? 'text-white' : 'text-white/50'}>{item.reward}</span>
                      </div>
                      <Badge variant="outline" className={item.unlocked ? 'border-amber-500/50 text-amber-400' : 'border-white/20 text-white/50'}>
                        Level {item.level}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/10 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Zap className="w-5 h-5 text-purple-400" />
                    $NEXT Token Rewards
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-white/5 rounded-lg p-4 text-center">
                    <p className="text-3xl font-bold text-white">247</p>
                    <p className="text-sm text-white/50">$NEXT earned this month</p>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/60">Voting participation</span>
                      <span className="text-white">+120 $NEXT</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Town hall attendance</span>
                      <span className="text-white">+75 $NEXT</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Streak bonus</span>
                      <span className="text-white">+52 $NEXT</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Badge Detail Modal */}
        {selectedBadge && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setSelectedBadge(null)}>
            <Card className={`max-w-sm w-full ${rarityColors[selectedBadge.rarity as keyof typeof rarityColors]}`} onClick={e => e.stopPropagation()}>
              <CardContent className="p-6 text-center">
                <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${selectedBadge.earned ? selectedBadge.color : 'bg-white/10'}`}>
                  <selectedBadge.icon className={`w-10 h-10 ${selectedBadge.earned ? '' : 'opacity-50'}`} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{selectedBadge.name}</h3>
                <p className={`text-sm capitalize mb-2 ${rarityText[selectedBadge.rarity as keyof typeof rarityText]}`}>{selectedBadge.rarity}</p>
                <p className="text-white/60 mb-4">{selectedBadge.description}</p>
                {selectedBadge.earned ? (
                  <div className="flex items-center justify-center gap-2 text-green-400">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Earned {selectedBadge.earnedDate}</span>
                  </div>
                ) : (
                  <div>
                    <Progress value={(selectedBadge.progress! / selectedBadge.total!) * 100} className="h-2 mb-2" />
                    <p className="text-white/50 text-sm">{selectedBadge.progress}/{selectedBadge.total} progress</p>
                  </div>
                )}
                <Button 
                  variant="outline" 
                  className="mt-4 border-white/20 text-white bg-transparent"
                  onClick={() => setSelectedBadge(null)}
                >
                  Close
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
