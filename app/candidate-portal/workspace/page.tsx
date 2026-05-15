"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Calendar, FileText, MessageSquare, Shield, Users } from "lucide-react"
import * as CRMStore from "@/lib/store/crm-store"

const permissionLabels: Record<string, string> = {
  campaigns: "Campaigns",
  chat: "Internal Chat",
  files: "Files",
  meetings: "Meetings",
  reporting: "Reporting",
  field: "Field Ops",
  volunteers: "Volunteers",
  brand: "Brand",
  assets: "Assets",
}

export default function CandidateWorkspacePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [candidateId, setCandidateId] = useState("")
  const [candidateName, setCandidateName] = useState("")
  const [viewerName, setViewerName] = useState("")
  const [viewerRole, setViewerRole] = useState("candidate")
  const [permissions, setPermissions] = useState<string[]>([])
  const [activeChannelId, setActiveChannelId] = useState("")
  const [chatDraft, setChatDraft] = useState("")
  const [newFileName, setNewFileName] = useState("")
  const [campaigns, setCampaigns] = useState<CRMStore.Campaign[]>([])
  const [teamMembers, setTeamMembers] = useState<CRMStore.TeamMember[]>([])
  const [teamChats, setTeamChats] = useState<CRMStore.TeamChatChannel[]>([])
  const [sharedFiles, setSharedFiles] = useState<CRMStore.SharedFile[]>([])
  const [meetings, setMeetings] = useState<CRMStore.Meeting[]>([])
  const [clientThreads, setClientThreads] = useState<CRMStore.ClientChatThread[]>([])
  const [chatMessages, setChatMessages] = useState<CRMStore.TeamChatMessage[]>([])

  const loadWorkspaceData = (nextCandidateId: string, nextViewerRole: string, nextChannelId?: string) => {
    const nextTeamChats = CRMStore.getTeamChatsByCandidate(nextCandidateId)
    const resolvedChannelId = nextChannelId || activeChannelId || nextTeamChats[0]?.id || ""

    setCampaigns(CRMStore.getCampaignsByUser(nextCandidateId))
    setTeamMembers(CRMStore.getTeamMembersByCandidate(nextCandidateId))
    setTeamChats(nextTeamChats)
    setSharedFiles(
      CRMStore.getSharedFilesByCandidate(nextCandidateId).filter(
        (file) => nextViewerRole === "candidate" || file.role_visibility.includes(nextViewerRole),
      ),
    )
    setMeetings(CRMStore.getMeetingsByCandidate(nextCandidateId))
    setClientThreads(CRMStore.getClientChats().filter((thread) => thread.client_id === nextCandidateId))
    setActiveChannelId(resolvedChannelId)
    setChatMessages(resolvedChannelId ? CRMStore.getMessagesForChannel(resolvedChannelId) : [])
  }

  useEffect(() => {
    CRMStore.initializeStore()

    const demoUser = JSON.parse(localStorage.getItem("tnm-demo-user") || "{}")
    const memberSession = CRMStore.getWorkspaceMemberSession()

    if (memberSession) {
      const member = CRMStore.getTeamMembersByCandidate(memberSession.candidate_user_id).find(
        (item) => item.id === memberSession.member_id,
      )
      const candidate = CRMStore.getUser(memberSession.candidate_user_id)

      if (!member || !candidate) {
        router.push("/candidate-portal")
        return
      }

      setCandidateId(candidate.id)
      setCandidateName(candidate.name)
      setViewerName(member.name)
      setViewerRole(member.role)
      setPermissions(member.permissions)
      loadWorkspaceData(candidate.id, member.role)
      setLoading(false)
      return
    }

    if (!demoUser?.id) {
      router.push("/auth/demo-login")
      return
    }

    const candidate = CRMStore.getUser(demoUser.id)
    if (!candidate || candidate.type !== "candidate") {
      router.push("/candidate-portal")
      return
    }

    setCandidateId(candidate.id)
    setCandidateName(candidate.name)
    setViewerName(candidate.name)
    setViewerRole("candidate")
    setPermissions(["campaigns", "chat", "files", "meetings", "reporting", "field", "volunteers", "brand", "assets"])
    loadWorkspaceData(candidate.id, "candidate")
    setLoading(false)
  }, [router])

  useEffect(() => {
    if (!candidateId) return
    loadWorkspaceData(candidateId, viewerRole, activeChannelId)
  }, [activeChannelId, candidateId, viewerRole])

  const canChat = permissions.includes("chat")
  const canManageFiles = permissions.includes("files") || permissions.includes("assets") || permissions.includes("brand")
  const canManageMeetings = permissions.includes("meetings") || permissions.includes("campaigns")

  const handleSendMessage = () => {
    if (!activeChannelId || !chatDraft.trim() || !canChat) return
    CRMStore.postTeamChatMessage(activeChannelId, chatDraft.trim())
    setChatDraft("")
    loadWorkspaceData(candidateId, viewerRole, activeChannelId)
  }

  const handleAddFile = () => {
    if (!newFileName.trim() || !canManageFiles) return
    CRMStore.createSharedFile({
      candidate_user_id: candidateId,
      candidate_name: candidateName,
      name: newFileName.trim(),
      category: "brief",
      uploaded_by: viewerName,
      role_visibility: [viewerRole, "campaign_manager", "candidate"].filter((value, index, values) => values.indexOf(value) === index),
      size_label: "950 KB",
    })
    setNewFileName("")
    loadWorkspaceData(candidateId, viewerRole, activeChannelId)
  }

  const handleMeetingStatus = (meetingId: string, status: CRMStore.Meeting["status"]) => {
    if (!canManageMeetings) return
    CRMStore.updateMeetingStatus(meetingId, status)
    loadWorkspaceData(candidateId, viewerRole, activeChannelId)
  }

  const handleReturnToCandidateView = () => {
    CRMStore.clearWorkspaceMemberSession()
    router.push("/candidate-portal/workspace")
  }

  if (loading) {
    return <div className="min-h-screen bg-[#05070a] text-white flex items-center justify-center">Loading workspace...</div>
  }

  return (
    <div className="min-h-screen bg-[#05070a] text-white">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <Link href="/candidate-portal" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-3">
              <ArrowLeft className="w-4 h-4" />
              Back to Candidate Portal
            </Link>
            <h1 className="text-3xl font-bold">{candidateName} Workspace</h1>
            <p className="text-white/60 mt-1">Role-aware campaign operations for team members, files, meetings, and internal delivery.</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">{viewerName}</Badge>
            <Badge className="bg-white/10 text-white/80 border-white/20">{viewerRole.replaceAll("_", " ")}</Badge>
            {viewerRole !== "candidate" && (
              <Button variant="outline" className="border-white/20 bg-transparent text-white hover:bg-white/10" onClick={handleReturnToCandidateView}>
                Candidate View
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-[#0b0f16] border-white/10"><CardContent className="p-5"><p className="text-white/50 text-sm">Campaigns</p><p className="text-3xl font-bold mt-1">{campaigns.length}</p></CardContent></Card>
          <Card className="bg-[#0b0f16] border-white/10"><CardContent className="p-5"><p className="text-white/50 text-sm">Team Members</p><p className="text-3xl font-bold mt-1">{teamMembers.length}</p></CardContent></Card>
          <Card className="bg-[#0b0f16] border-white/10"><CardContent className="p-5"><p className="text-white/50 text-sm">Files Visible</p><p className="text-3xl font-bold mt-1">{sharedFiles.length}</p></CardContent></Card>
          <Card className="bg-[#0b0f16] border-white/10"><CardContent className="p-5"><p className="text-white/50 text-sm">Meetings</p><p className="text-3xl font-bold mt-1">{meetings.length}</p></CardContent></Card>
        </div>

        <Card className="bg-[#0b0f16] border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center gap-2"><Shield className="w-5 h-5" />Role Access</CardTitle>
            <CardDescription className="text-white/50">This workspace only exposes the tools your current role should see in a normal campaign operations flow.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {permissions.map((permission) => (
              <Badge key={permission} variant="outline" className="border-white/20 text-white/70">{permissionLabels[permission] || permission}</Badge>
            ))}
          </CardContent>
        </Card>

        <Tabs defaultValue="campaigns" className="space-y-4">
          <TabsList className="bg-white/5 border border-white/10">
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="chat" disabled={!canChat}>Internal Chat</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
            <TabsTrigger value="meetings">Meetings</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
          </TabsList>

          <TabsContent value="campaigns" className="space-y-4">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {campaigns.map((campaign) => (
                <Card key={campaign.id} className="bg-[#0b0f16] border-white/10">
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-white font-semibold">{campaign.name}</h3>
                        <p className="text-white/50 text-sm">{campaign.target_region}</p>
                      </div>
                      <Badge className="bg-white/10 text-white/80 border-white/20">{campaign.status}</Badge>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {campaign.goals.map((goal) => <Badge key={goal} variant="outline" className="border-white/20 text-white/70">{goal}</Badge>)}
                    </div>
                    <p className="text-white/70 text-sm">Budget ${(campaign.budget_cents / 100).toLocaleString()} • Launch {new Date(campaign.launch_date).toLocaleDateString()}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-[#0b0f16] border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-lg">Client Coordination</CardTitle>
                <CardDescription className="text-white/50">Open client threads assigned to this candidate.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {clientThreads.map((thread) => (
                  <div key={thread.id} className="rounded-lg border border-white/10 bg-white/5 p-4 flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium">{thread.subject}</p>
                      <p className="text-white/50 text-sm">Owner: {thread.owner_name}</p>
                      <p className="text-white/70 text-sm mt-2">{thread.last_message}</p>
                    </div>
                    <Badge className="bg-white/10 text-white/80 border-white/20">{thread.status}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chat" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4">
              <Card className="bg-[#0b0f16] border-white/10">
                <CardHeader>
                  <CardTitle className="text-white text-lg flex items-center gap-2"><MessageSquare className="w-5 h-5" />Channels</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {teamChats.map((channel) => (
                    <button key={channel.id} onClick={() => setActiveChannelId(channel.id)} className={`w-full text-left rounded-lg border p-3 transition ${activeChannelId === channel.id ? "border-blue-500/40 bg-blue-500/10" : "border-white/10 bg-white/5 hover:bg-white/10"}`}>
                      <p className="font-medium">#{channel.name}</p>
                      <p className="text-white/50 text-sm">{channel.topic}</p>
                    </button>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-[#0b0f16] border-white/10">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Conversation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3 max-h-[420px] overflow-auto pr-2">
                    {chatMessages.map((message) => (
                      <div key={message.id} className="rounded-lg border border-white/10 bg-white/5 p-4">
                        <div className="flex items-center justify-between gap-3 mb-2">
                          <p className="font-medium">{message.author_name}</p>
                          <p className="text-white/40 text-xs">{new Date(message.created_at).toLocaleString()}</p>
                        </div>
                        <p className="text-white/50 text-xs mb-2">{message.author_role.replaceAll("_", " ")}</p>
                        <p className="text-white/80 text-sm">{message.content}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Textarea value={chatDraft} onChange={(event) => setChatDraft(event.target.value)} placeholder={canChat ? "Share an internal update" : "Your role cannot post in chat"} className="bg-white/5 border-white/10 text-white placeholder:text-white/40" />
                    <Button onClick={handleSendMessage} disabled={!canChat}>Send</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="files" className="space-y-4">
            {canManageFiles && (
              <Card className="bg-[#0b0f16] border-white/10">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Add Shared File</CardTitle>
                </CardHeader>
                <CardContent className="flex gap-2">
                  <Input value={newFileName} onChange={(event) => setNewFileName(event.target.value)} placeholder="File name" className="bg-white/5 border-white/10 text-white placeholder:text-white/40" />
                  <Button onClick={handleAddFile}>Add File</Button>
                </CardContent>
              </Card>
            )}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {sharedFiles.map((file) => (
                <Card key={file.id} className="bg-[#0b0f16] border-white/10">
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-white/50 text-sm">{file.category} • {file.size_label}</p>
                      </div>
                      <FileText className="w-5 h-5 text-white/40" />
                    </div>
                    <p className="text-white/70 text-sm">Uploaded by {file.uploaded_by}</p>
                    <div className="flex flex-wrap gap-2">
                      {file.role_visibility.map((role) => <Badge key={role} variant="outline" className="border-white/20 text-white/70">{role.replaceAll("_", " ")}</Badge>)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="meetings" className="space-y-4">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {meetings.map((meeting) => (
                <Card key={meeting.id} className="bg-[#0b0f16] border-white/10">
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium">{meeting.title}</p>
                        <p className="text-white/50 text-sm">{meeting.meeting_type.replaceAll("_", " ")} • {meeting.duration_minutes} minutes</p>
                      </div>
                      <Badge className="bg-white/10 text-white/80 border-white/20">{meeting.status}</Badge>
                    </div>
                    <p className="text-white/70 text-sm">{new Date(meeting.starts_at).toLocaleString()}</p>
                    <p className="text-white/70 text-sm">{meeting.notes}</p>
                    <div className="flex flex-wrap gap-2">
                      {meeting.attendees.map((attendee) => <Badge key={attendee} variant="outline" className="border-white/20 text-white/70">{attendee}</Badge>)}
                    </div>
                    {canManageMeetings && (
                      <div className="flex gap-2">
                        <Button variant="outline" className="border-white/20 bg-transparent text-white hover:bg-white/10" onClick={() => handleMeetingStatus(meeting.id, "live")}>Go Live</Button>
                        <Button variant="outline" className="border-white/20 bg-transparent text-white hover:bg-white/10" onClick={() => handleMeetingStatus(meeting.id, "completed")}>Complete</Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="team" className="space-y-4">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {teamMembers.map((member) => (
                <Card key={member.id} className="bg-[#0b0f16] border-white/10">
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-white/50 text-sm">{member.email}</p>
                      </div>
                      <Badge className="bg-white/10 text-white/80 border-white/20">{member.status}</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-white/70 text-sm">
                      <Users className="w-4 h-4" />
                      {member.role.replaceAll("_", " ")}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {member.permissions.map((permission) => <Badge key={permission} variant="outline" className="border-white/20 text-white/70">{permissionLabels[permission] || permission}</Badge>)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
