"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  ArrowLeft, Calendar, ChevronLeft, ChevronRight, Clock, 
  MapPin, Users, Video, Plus, Download, ExternalLink,
  Bell, Filter, Vote, Megaphone, Award
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type EventType = "town_hall" | "vote_deadline" | "proposal" | "meeting" | "workshop"

interface CalendarEvent {
  id: string
  title: string
  type: EventType
  date: string
  time: string
  endTime?: string
  location?: string
  virtual?: boolean
  attendees?: number
  description?: string
  reminder?: boolean
}

const events: CalendarEvent[] = [
  { id: "1", title: "Youth Transit Vote Deadline", type: "vote_deadline", date: "2024-11-22", time: "23:59", description: "Final deadline to cast your vote" },
  { id: "2", title: "Municipal Budget Town Hall", type: "town_hall", date: "2024-11-23", time: "19:00", endTime: "21:00", virtual: true, attendees: 156, reminder: true },
  { id: "3", title: "Green Spaces Proposal Discussion", type: "proposal", date: "2024-11-25", time: "14:00", endTime: "15:30", location: "City Hall Room 204", attendees: 45 },
  { id: "4", title: "Youth Assembly Monthly Meeting", type: "meeting", date: "2024-11-27", time: "18:00", endTime: "20:00", virtual: true, attendees: 89, reminder: true },
  { id: "5", title: "DAO Governance Workshop", type: "workshop", date: "2024-11-29", time: "10:00", endTime: "12:00", location: "Community Center", attendees: 32 },
  { id: "6", title: "School Board Transparency Vote", type: "vote_deadline", date: "2024-11-30", time: "23:59" },
  { id: "7", title: "Climate Action Town Hall", type: "town_hall", date: "2024-12-02", time: "19:00", endTime: "21:00", virtual: true, attendees: 203 },
  { id: "8", title: "Q4 Impact Report Review", type: "meeting", date: "2024-12-05", time: "15:00", endTime: "16:30", virtual: true, attendees: 67 },
]

const eventTypeConfig: Record<EventType, { color: string; bgColor: string; icon: typeof Calendar }> = {
  town_hall: { color: "text-purple-400", bgColor: "bg-purple-500/20 border-purple-500/30", icon: Users },
  vote_deadline: { color: "text-red-400", bgColor: "bg-red-500/20 border-red-500/30", icon: Vote },
  proposal: { color: "text-blue-400", bgColor: "bg-blue-500/20 border-blue-500/30", icon: Megaphone },
  meeting: { color: "text-green-400", bgColor: "bg-green-500/20 border-green-500/30", icon: Video },
  workshop: { color: "text-amber-400", bgColor: "bg-amber-500/20 border-amber-500/30", icon: Award },
}

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 10, 1)) // November 2024
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [filter, setFilter] = useState<EventType | "all">("all")

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))

  const getEventsForDate = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return events.filter(e => e.date === dateStr && (filter === "all" || e.type === filter))
  }

  const filteredEvents = events.filter(e => filter === "all" || e.type === filter)
  const upcomingEvents = filteredEvents
    .filter(e => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5)

  const generateICS = (event: CalendarEvent) => {
    const start = new Date(`${event.date}T${event.time}:00`)
    const end = event.endTime 
      ? new Date(`${event.date}T${event.endTime}:00`)
      : new Date(start.getTime() + 60 * 60 * 1000)
    
    const ics = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${start.toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTEND:${end.toISOString().replace(/[-:]/g, '').split('.')[0]}Z
SUMMARY:${event.title}
DESCRIPTION:${event.description || ''}
LOCATION:${event.virtual ? 'Virtual' : event.location || ''}
END:VEVENT
END:VCALENDAR`
    
    const blob = new Blob([ics], { type: 'text/calendar' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${event.title.replace(/\s+/g, '-')}.ics`
    a.click()
  }

  const addToGoogleCalendar = (event: CalendarEvent) => {
    const start = new Date(`${event.date}T${event.time}:00`).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    const end = event.endTime 
      ? new Date(`${event.date}T${event.endTime}:00`).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
      : new Date(new Date(`${event.date}T${event.time}:00`).getTime() + 60 * 60 * 1000).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${start}/${end}&details=${encodeURIComponent(event.description || '')}&location=${encodeURIComponent(event.virtual ? 'Virtual' : event.location || '')}`
    window.open(url, '_blank')
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/governance">
              <Button variant="ghost" size="icon" className="text-white/70 hover:text-white">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">Governance Calendar</h1>
              <p className="text-white/60">Track town halls, voting deadlines, and events</p>
            </div>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-500">
            <Plus className="w-4 h-4 mr-2" />
            Add Event
          </Button>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          <Filter className="w-4 h-4 text-white/50 flex-shrink-0" />
          {(["all", "town_hall", "vote_deadline", "proposal", "meeting", "workshop"] as const).map((type) => (
            <Button
              key={type}
              size="sm"
              variant={filter === type ? "default" : "ghost"}
              className={filter === type ? "bg-blue-600" : "text-white/70"}
              onClick={() => setFilter(type)}
            >
              {type === "all" ? "All" : type.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
            </Button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <Card className="lg:col-span-2 bg-white/5 border-white/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">{months[month]} {year}</CardTitle>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="text-white/60" onClick={prevMonth}>
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-white/60" onClick={nextMonth}>
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Days Header */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {days.map(day => (
                  <div key={day} className="text-center text-sm text-white/50 py-2">{day}</div>
                ))}
              </div>
              
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {/* Empty cells for days before month starts */}
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square" />
                ))}
                
                {/* Days of the month */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1
                  const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                  const dayEvents = getEventsForDate(day)
                  const isToday = dateStr === new Date().toISOString().split('T')[0]
                  const isSelected = selectedDate === dateStr
                  
                  return (
                    <div
                      key={day}
                      className={`aspect-square p-1 rounded-lg cursor-pointer transition-colors ${
                        isSelected ? 'bg-blue-500/30 ring-2 ring-blue-500' :
                        isToday ? 'bg-white/10' :
                        'hover:bg-white/5'
                      }`}
                      onClick={() => setSelectedDate(dateStr)}
                    >
                      <div className={`text-sm ${isToday ? 'text-blue-400 font-bold' : 'text-white/80'}`}>{day}</div>
                      <div className="flex flex-wrap gap-0.5 mt-1">
                        {dayEvents.slice(0, 3).map(event => (
                          <div 
                            key={event.id} 
                            className={`w-1.5 h-1.5 rounded-full ${eventTypeConfig[event.type].color.replace('text-', 'bg-')}`}
                          />
                        ))}
                        {dayEvents.length > 3 && (
                          <span className="text-[10px] text-white/50">+{dayEvents.length - 3}</span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Selected Date Events */}
              {selectedDate && (
                <div className="mt-6 pt-6 border-t border-white/10">
                  <h3 className="text-white font-medium mb-3">
                    {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </h3>
                  {getEventsForDate(parseInt(selectedDate.split('-')[2])).length === 0 ? (
                    <p className="text-white/50 text-sm">No events scheduled</p>
                  ) : (
                    <div className="space-y-2">
                      {getEventsForDate(parseInt(selectedDate.split('-')[2])).map(event => {
                        const config = eventTypeConfig[event.type]
                        const Icon = config.icon
                        return (
                          <div 
                            key={event.id}
                            className={`p-3 rounded-lg border ${config.bgColor} cursor-pointer`}
                            onClick={() => setSelectedEvent(event)}
                          >
                            <div className="flex items-start gap-3">
                              <Icon className={`w-5 h-5 ${config.color} flex-shrink-0 mt-0.5`} />
                              <div className="flex-1">
                                <p className="text-white font-medium">{event.title}</p>
                                <p className="text-sm text-white/60">{event.time}{event.endTime && ` - ${event.endTime}`}</p>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Events Sidebar */}
          <div className="space-y-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-lg">Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingEvents.map(event => {
                  const config = eventTypeConfig[event.type]
                  const Icon = config.icon
                  return (
                    <div 
                      key={event.id}
                      className="p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors"
                      onClick={() => setSelectedEvent(event)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${config.bgColor}`}>
                          <Icon className={`w-4 h-4 ${config.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium text-sm truncate">{event.title}</p>
                          <p className="text-xs text-white/50">
                            {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {event.time}
                          </p>
                        </div>
                        {event.reminder && <Bell className="w-4 h-4 text-blue-400 flex-shrink-0" />}
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start border-white/20 text-white bg-transparent">
                  <Download className="w-4 h-4 mr-2" />
                  Export Calendar (.ics)
                </Button>
                <Button variant="outline" className="w-full justify-start border-white/20 text-white bg-transparent">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Subscribe to Calendar
                </Button>
                <Button variant="outline" className="w-full justify-start border-white/20 text-white bg-transparent">
                  <Bell className="w-4 h-4 mr-2" />
                  Manage Reminders
                </Button>
              </CardContent>
            </Card>

            {/* Legend */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-lg">Event Types</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {Object.entries(eventTypeConfig).map(([type, config]) => {
                  const Icon = config.icon
                  return (
                    <div key={type} className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${config.color}`} />
                      <span className="text-sm text-white/70 capitalize">{type.replace("_", " ")}</span>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Event Detail Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setSelectedEvent(null)}>
            <Card className="max-w-md w-full bg-[#0d1117] border-white/10" onClick={e => e.stopPropagation()}>
              <CardContent className="p-6">
                <div className={`w-12 h-12 rounded-full mb-4 flex items-center justify-center ${eventTypeConfig[selectedEvent.type].bgColor}`}>
                  {(() => {
                    const Icon = eventTypeConfig[selectedEvent.type].icon
                    return <Icon className={`w-6 h-6 ${eventTypeConfig[selectedEvent.type].color}`} />
                  })()}
                </div>
                <Badge className={`mb-2 ${eventTypeConfig[selectedEvent.type].bgColor} ${eventTypeConfig[selectedEvent.type].color}`}>
                  {selectedEvent.type.replace("_", " ")}
                </Badge>
                <h3 className="text-xl font-bold text-white mb-2">{selectedEvent.title}</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-white/70">
                    <Calendar className="w-4 h-4" />
                    {new Date(selectedEvent.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                  <div className="flex items-center gap-2 text-white/70">
                    <Clock className="w-4 h-4" />
                    {selectedEvent.time}{selectedEvent.endTime && ` - ${selectedEvent.endTime}`}
                  </div>
                  {(selectedEvent.location || selectedEvent.virtual) && (
                    <div className="flex items-center gap-2 text-white/70">
                      {selectedEvent.virtual ? <Video className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                      {selectedEvent.virtual ? "Virtual Event" : selectedEvent.location}
                    </div>
                  )}
                  {selectedEvent.attendees && (
                    <div className="flex items-center gap-2 text-white/70">
                      <Users className="w-4 h-4" />
                      {selectedEvent.attendees} attending
                    </div>
                  )}
                </div>

                {selectedEvent.description && (
                  <p className="text-white/60 text-sm mb-6">{selectedEvent.description}</p>
                )}

                <div className="flex gap-2">
                  <Button 
                    className="flex-1 bg-blue-600 hover:bg-blue-500"
                    onClick={() => addToGoogleCalendar(selectedEvent)}
                  >
                    Add to Google
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 border-white/20 text-white bg-transparent"
                    onClick={() => generateICS(selectedEvent)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download .ics
                  </Button>
                </div>
                
                <Button 
                  variant="ghost" 
                  className="w-full mt-2 text-white/60"
                  onClick={() => setSelectedEvent(null)}
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
