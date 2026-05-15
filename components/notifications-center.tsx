"use client"

import { useState, useEffect } from "react"
import { 
  Bell, X, Check, CheckCheck, Settings, Vote, MessageSquare,
  Calendar, AlertTriangle, Award, Users, Megaphone, Trash2,
  Filter, Volume2, VolumeX, Mail, Smartphone
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Notification {
  id: string
  type: "vote" | "proposal" | "town_hall" | "mention" | "badge" | "deadline" | "result" | "system"
  title: string
  message: string
  timestamp: Date
  read: boolean
  actionUrl?: string
  priority: "low" | "medium" | "high"
}

const demoNotifications: Notification[] = [
  { id: "1", type: "deadline", title: "Voting Deadline", message: "Youth Transit Pass vote ends in 2 hours", timestamp: new Date(Date.now() - 1000 * 60 * 30), read: false, actionUrl: "/governance/town-hall", priority: "high" },
  { id: "2", type: "mention", title: "You were mentioned", message: "Maya T. mentioned you in a comment on School Board Transparency proposal", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), read: false, actionUrl: "/governance/town-hall", priority: "medium" },
  { id: "3", type: "badge", title: "New Badge Earned!", message: "You earned the 'Active Voter' badge for participating in 10 votes", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), read: false, priority: "low" },
  { id: "4", type: "town_hall", title: "Town Hall Starting Soon", message: "Climate Action Discussion starts in 15 minutes", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), read: true, actionUrl: "/governance/town-hall", priority: "high" },
  { id: "5", type: "result", title: "Vote Results", message: "Green Spaces Initiative passed with 78% approval!", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), read: true, actionUrl: "/governance/impact", priority: "medium" },
  { id: "6", type: "proposal", title: "New Proposal", message: "A proposal matching your interests was submitted: Youth Mental Health Support", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), read: true, actionUrl: "/governance/town-hall", priority: "medium" },
]

const notificationSettings = {
  votes: { label: "Voting reminders", email: true, push: true },
  deadlines: { label: "Deadline alerts", email: true, push: true },
  townHalls: { label: "Town hall notifications", email: true, push: false },
  mentions: { label: "When someone mentions you", email: true, push: true },
  proposals: { label: "New proposals in your interests", email: false, push: true },
  results: { label: "Voting results", email: true, push: false },
  badges: { label: "Badge achievements", email: false, push: true },
  system: { label: "System announcements", email: true, push: false },
}

export function NotificationsCenter() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState(demoNotifications)
  const [activeTab, setActiveTab] = useState("all")
  const [showSettings, setShowSettings] = useState(false)
  const [settings, setSettings] = useState(notificationSettings)
  const [soundEnabled, setSoundEnabled] = useState(true)

  const unreadCount = notifications.filter(n => !n.read).length

  const getIcon = (type: string) => {
    switch (type) {
      case "vote": return <Vote className="w-4 h-4" />
      case "proposal": return <Megaphone className="w-4 h-4" />
      case "town_hall": return <Users className="w-4 h-4" />
      case "mention": return <MessageSquare className="w-4 h-4" />
      case "badge": return <Award className="w-4 h-4" />
      case "deadline": return <AlertTriangle className="w-4 h-4" />
      case "result": return <Check className="w-4 h-4" />
      default: return <Bell className="w-4 h-4" />
    }
  }

  const getIconColor = (type: string, priority: string) => {
    if (priority === "high") return "text-red-400 bg-red-500/20"
    switch (type) {
      case "vote": return "text-blue-400 bg-blue-500/20"
      case "proposal": return "text-purple-400 bg-purple-500/20"
      case "town_hall": return "text-green-400 bg-green-500/20"
      case "mention": return "text-cyan-400 bg-cyan-500/20"
      case "badge": return "text-amber-400 bg-amber-500/20"
      case "deadline": return "text-orange-400 bg-orange-500/20"
      case "result": return "text-emerald-400 bg-emerald-500/20"
      default: return "text-white/60 bg-white/10"
    }
  }

  const formatTime = (date: Date) => {
    const diff = Date.now() - date.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id))
  }

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === "all") return true
    if (activeTab === "unread") return !n.read
    return n.type === activeTab
  })

  return (
    <>
      {/* Notification Bell Button */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="relative text-white/70 hover:text-white"
        onClick={() => setIsOpen(true)}
        aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ""}`}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-medium">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-[#0d1117] border-l border-white/10 shadow-2xl overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-white" />
                <h2 className="text-lg font-semibold text-white">Notifications</h2>
                {unreadCount > 0 && (
                  <Badge className="bg-red-500/20 text-red-400 border-red-500/30">{unreadCount} new</Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-white/60 hover:text-white"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  aria-label={soundEnabled ? "Mute notifications" : "Unmute notifications"}
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-white/60 hover:text-white"
                  onClick={() => setShowSettings(!showSettings)}
                  aria-label="Notification settings"
                >
                  <Settings className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-white/60 hover:text-white"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close notifications"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {showSettings ? (
              /* Settings View */
              <div className="flex-1 overflow-y-auto p-4">
                <h3 className="text-white font-medium mb-4">Notification Preferences</h3>
                <div className="space-y-4">
                  {Object.entries(settings).map(([key, value]) => (
                    <div key={key} className="bg-white/5 rounded-lg p-4">
                      <p className="text-white font-medium mb-3">{value.label}</p>
                      <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <Switch 
                            checked={value.email}
                            onCheckedChange={(checked) => setSettings({ ...settings, [key]: { ...value, email: checked } })}
                          />
                          <Mail className="w-4 h-4 text-white/60" />
                          <span className="text-sm text-white/60">Email</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <Switch 
                            checked={value.push}
                            onCheckedChange={(checked) => setSettings({ ...settings, [key]: { ...value, push: checked } })}
                          />
                          <Smartphone className="w-4 h-4 text-white/60" />
                          <span className="text-sm text-white/60">Push</span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Notifications View */
              <>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
                  <div className="border-b border-white/10 px-4">
                    <TabsList className="bg-transparent h-auto p-0 gap-4">
                      <TabsTrigger value="all" className="data-[state=active]:bg-transparent data-[state=active]:text-white text-white/60 pb-3 px-0 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500">
                        All
                      </TabsTrigger>
                      <TabsTrigger value="unread" className="data-[state=active]:bg-transparent data-[state=active]:text-white text-white/60 pb-3 px-0 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500">
                        Unread
                      </TabsTrigger>
                      <TabsTrigger value="deadline" className="data-[state=active]:bg-transparent data-[state=active]:text-white text-white/60 pb-3 px-0 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500">
                        Deadlines
                      </TabsTrigger>
                      <TabsTrigger value="mention" className="data-[state=active]:bg-transparent data-[state=active]:text-white text-white/60 pb-3 px-0 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500">
                        Mentions
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  {/* Actions Bar */}
                  <div className="px-4 py-2 flex items-center justify-between border-b border-white/5">
                    <span className="text-sm text-white/40">{filteredNotifications.length} notifications</span>
                    {unreadCount > 0 && (
                      <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300 text-xs" onClick={markAllAsRead}>
                        <CheckCheck className="w-3 h-3 mr-1" /> Mark all read
                      </Button>
                    )}
                  </div>

                  <div className="flex-1 overflow-y-auto">
                    {filteredNotifications.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center p-8">
                        <Bell className="w-12 h-12 text-white/20 mb-4" />
                        <p className="text-white/60">No notifications</p>
                        <p className="text-sm text-white/40">You&apos;re all caught up!</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-white/5">
                        {filteredNotifications.map((notification) => (
                          <div 
                            key={notification.id}
                            className={`p-4 hover:bg-white/5 cursor-pointer transition-colors ${!notification.read ? "bg-blue-500/5" : ""}`}
                            onClick={() => {
                              markAsRead(notification.id)
                              if (notification.actionUrl) {
                                window.location.href = notification.actionUrl
                              }
                            }}
                          >
                            <div className="flex gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getIconColor(notification.type, notification.priority)}`}>
                                {getIcon(notification.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <p className={`font-medium text-sm ${notification.read ? "text-white/80" : "text-white"}`}>
                                    {notification.title}
                                  </p>
                                  <span className="text-xs text-white/40 whitespace-nowrap">{formatTime(notification.timestamp)}</span>
                                </div>
                                <p className="text-sm text-white/60 mt-0.5 line-clamp-2">{notification.message}</p>
                                {!notification.read && (
                                  <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2" />
                                )}
                              </div>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="text-white/40 hover:text-red-400 flex-shrink-0 opacity-0 group-hover:opacity-100"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  deleteNotification(notification.id)
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Tabs>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
