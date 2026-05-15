"use client"

// Shared CRM Store - connects frontend (candidate portal) to backend (admin CRM)
// Uses localStorage for demo mode, can be replaced with Supabase when stable

export interface DemoUser {
  id: string
  name: string
  email: string
  type: "candidate" | "voter" | "admin"
  password: string // For demo login
  status: "active" | "pending" | "suspended"
  created_at: string
}

export interface Order {
  id: string
  order_number: string
  user_id: string
  user_name: string
  user_type: "candidate" | "voter"
  items: { service_id: string; service_name: string; price_cents: number }[]
  total_cents: number
  status: "pending" | "processing" | "completed" | "cancelled" | "refunded"
  payment_status: "unpaid" | "paid" | "partial" | "refunded"
  created_at: string
}

export interface Subscription {
  id: string
  user_id: string
  user_name: string
  user_type: "candidate" | "voter"
  service_id: string
  service_name: string
  plan: "monthly" | "quarterly" | "annual"
  price_cents: number
  status: "active" | "paused" | "cancelled" | "expired"
  start_date: string
  next_billing: string
  auto_renew: boolean
}

export interface Lead {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  source: string
  status: "new" | "contacted" | "qualified" | "proposal" | "negotiation" | "won" | "lost"
  created_at: string
}

export interface Deal {
  id: string
  title: string
  client_name: string
  value_cents: number
  stage: "discovery" | "proposal" | "negotiation" | "closed_won" | "closed_lost"
  probability: number
  expected_close: string
  created_at: string
}

export interface Task {
  id: string
  title: string
  description?: string
  related_to?: string
  priority: "low" | "medium" | "high" | "urgent"
  status: "pending" | "in_progress" | "completed" | "cancelled"
  due_date: string
  created_at: string
}

export interface TeamMember {
  id: string
  candidate_user_id: string
  candidate_name: string
  name: string
  email: string
  role: "campaign_manager" | "field_director" | "designer" | "volunteer_coordinator" | "analyst"
  status: "active" | "invited" | "inactive"
  portal_access: boolean
  permissions: string[]
  joined_at: string
}

export interface TeamChatChannel {
  id: string
  candidate_user_id: string
  candidate_name: string
  name: string
  topic: string
  member_ids: string[]
  last_message: string
  last_message_at: string
  unread_count: number
}

export interface TeamChatMessage {
  id: string
  channel_id: string
  candidate_user_id: string
  author_name: string
  author_role: string
  content: string
  created_at: string
}

export interface ClientChatThread {
  id: string
  client_id: string
  client_name: string
  owner_name: string
  subject: string
  priority: "low" | "medium" | "high"
  status: "open" | "waiting" | "resolved"
  last_message: string
  last_message_at: string
}

export interface Campaign {
  id: string
  owner_user_id: string
  name: string
  owner_name: string
  status: "planning" | "launching" | "active" | "completed"
  budget_cents: number
  target_region: string
  launch_date: string
  goals: string[]
}

export interface SharedFile {
  id: string
  candidate_user_id: string
  candidate_name: string
  name: string
  category: "brief" | "design" | "finance" | "field" | "legal"
  uploaded_by: string
  role_visibility: string[]
  size_label: string
  updated_at: string
}

export interface Meeting {
  id: string
  candidate_user_id: string
  candidate_name: string
  title: string
  meeting_type: "standup" | "strategy" | "client_review" | "volunteer"
  starts_at: string
  duration_minutes: number
  attendees: string[]
  status: "scheduled" | "live" | "completed"
  notes: string
}

export interface TeamWorkspaceSession {
  candidate_user_id: string
  member_id: string
}

// Initial demo data
const INITIAL_USERS: DemoUser[] = [
  { id: "demo-admin", name: "Admin User", email: "admin@campaigncore.com", password: "admin123", type: "admin", status: "active", created_at: "2024-01-01T00:00:00Z" },
  { id: "demo-cand-1", name: "Maria Rodriguez", email: "maria@rodriguez2024.com", password: "demo123", type: "candidate", status: "active", created_at: "2024-01-15T00:00:00Z" },
  { id: "demo-cand-2", name: "James Wilson", email: "james@wilsonformayor.com", password: "demo123", type: "candidate", status: "active", created_at: "2024-02-01T00:00:00Z" },
  { id: "demo-cand-3", name: "Olivia Chow", email: "olivia@mayorbenchmark.demo", password: "demo123", type: "candidate", status: "active", created_at: "2024-02-20T00:00:00Z" },
  { id: "demo-cand-4", name: "Regional Mayor Demo", email: "regional.mayor@tnm.demo", password: "demo123", type: "candidate", status: "active", created_at: "2024-02-25T00:00:00Z" },
  { id: "demo-cand-5", name: "Metro Councillor Demo", email: "metro.councillor@tnm.demo", password: "demo123", type: "candidate", status: "active", created_at: "2024-03-03T00:00:00Z" },
  { id: "demo-cand-6", name: "Neighbourhood Councillor Demo", email: "neighbourhood.councillor@tnm.demo", password: "demo123", type: "candidate", status: "active", created_at: "2024-03-08T00:00:00Z" },
  { id: "demo-voter-1", name: "Emily Thompson", email: "emily.t@gmail.com", password: "demo123", type: "voter", status: "active", created_at: "2024-02-15T00:00:00Z" },
  { id: "demo-voter-2", name: "David Park", email: "dpark@outlook.com", password: "demo123", type: "voter", status: "pending", created_at: "2024-03-01T00:00:00Z" },
]

const INITIAL_ORDERS: Order[] = [
  { id: "ord-1", order_number: "ORD-2024-00001", user_id: "demo-cand-1", user_name: "Maria Rodriguez", user_type: "candidate", items: [{ service_id: "3", service_name: "SEO Optimization", price_cents: 69500 }], total_cents: 69500, status: "completed", payment_status: "paid", created_at: "2024-01-20T00:00:00Z" },
  { id: "ord-2", order_number: "ORD-2024-00002", user_id: "demo-cand-1", user_name: "Maria Rodriguez", user_type: "candidate", items: [{ service_id: "17", service_name: "Digital Ads Management", price_cents: 89500 }], total_cents: 89500, status: "completed", payment_status: "paid", created_at: "2024-02-10T00:00:00Z" },
  { id: "ord-3", order_number: "ORD-2024-00003", user_id: "demo-cand-2", user_name: "James Wilson", user_type: "candidate", items: [{ service_id: "9", service_name: "Campaign Website", price_cents: 129500 }, { service_id: "2", service_name: "Content Strategy", price_cents: 59500 }], total_cents: 189000, status: "processing", payment_status: "paid", created_at: "2024-03-01T00:00:00Z" },
  { id: "ord-4", order_number: "ORD-2024-00004", user_id: "demo-voter-1", user_name: "Emily Thompson", user_type: "voter", items: [{ service_id: "28", service_name: "Voter Research Report", price_cents: 9900 }], total_cents: 9900, status: "completed", payment_status: "paid", created_at: "2024-03-05T00:00:00Z" },
  { id: "ord-5", order_number: "ORD-2024-00005", user_id: "demo-cand-3", user_name: "Olivia Chow", user_type: "candidate", items: [{ service_id: "10", service_name: "Campaign Website Pro", price_cents: 129500 }, { service_id: "58", service_name: "Donation Platform Setup", price_cents: 69500 }, { service_id: "36", service_name: "Campaign Logo Design", price_cents: 39500 }], total_cents: 238500, status: "completed", payment_status: "paid", created_at: "2024-03-10T00:00:00Z" },
  { id: "ord-6", order_number: "ORD-2024-00006", user_id: "demo-cand-4", user_name: "Regional Mayor Demo", user_type: "candidate", items: [{ service_id: "10", service_name: "Campaign Website Pro", price_cents: 129500 }, { service_id: "58", service_name: "Donation Platform Setup", price_cents: 69500 }], total_cents: 199000, status: "completed", payment_status: "paid", created_at: "2024-03-11T00:00:00Z" },
  { id: "ord-7", order_number: "ORD-2024-00007", user_id: "demo-cand-5", user_name: "Metro Councillor Demo", user_type: "candidate", items: [{ service_id: "10", service_name: "Campaign Website Pro", price_cents: 129500 }, { service_id: "36", service_name: "Campaign Logo Design", price_cents: 39500 }], total_cents: 169000, status: "completed", payment_status: "paid", created_at: "2024-03-12T00:00:00Z" },
  { id: "ord-8", order_number: "ORD-2024-00008", user_id: "demo-cand-6", user_name: "Neighbourhood Councillor Demo", user_type: "candidate", items: [{ service_id: "10", service_name: "Campaign Website Pro", price_cents: 129500 }], total_cents: 129500, status: "completed", payment_status: "paid", created_at: "2024-03-13T00:00:00Z" },
]

const INITIAL_SUBSCRIPTIONS: Subscription[] = [
  { id: "sub-1", user_id: "demo-cand-1", user_name: "Maria Rodriguez", user_type: "candidate", service_id: "3", service_name: "SEO Optimization", plan: "monthly", price_cents: 69500, status: "active", start_date: "2024-01-20", next_billing: "2024-04-20", auto_renew: true },
  { id: "sub-2", user_id: "demo-cand-1", user_name: "Maria Rodriguez", user_type: "candidate", service_id: "17", service_name: "Digital Ads Management", plan: "monthly", price_cents: 89500, status: "active", start_date: "2024-02-10", next_billing: "2024-04-10", auto_renew: true },
  { id: "sub-3", user_id: "demo-cand-2", user_name: "James Wilson", user_type: "candidate", service_id: "9", service_name: "Campaign Website", plan: "quarterly", price_cents: 349500, status: "active", start_date: "2024-03-01", next_billing: "2024-06-01", auto_renew: true },
  { id: "sub-4", user_id: "demo-cand-3", user_name: "Olivia Chow", user_type: "candidate", service_id: "2", service_name: "Local Messaging & Communication", plan: "monthly", price_cents: 59500, status: "active", start_date: "2024-03-10", next_billing: "2024-04-10", auto_renew: true },
  { id: "sub-5", user_id: "demo-cand-3", user_name: "Olivia Chow", user_type: "candidate", service_id: "17", service_name: "Municipal Advertising Campaigns", plan: "monthly", price_cents: 89500, status: "active", start_date: "2024-03-10", next_billing: "2024-04-10", auto_renew: true },
  { id: "sub-6", user_id: "demo-cand-3", user_name: "Olivia Chow", user_type: "candidate", service_id: "23", service_name: "Municipal Voter Management", plan: "monthly", price_cents: 74500, status: "active", start_date: "2024-03-10", next_billing: "2024-04-10", auto_renew: true },
  { id: "sub-7", user_id: "demo-cand-3", user_name: "Olivia Chow", user_type: "candidate", service_id: "26", service_name: "Municipal Fundraising", plan: "monthly", price_cents: 69500, status: "active", start_date: "2024-03-10", next_billing: "2024-04-10", auto_renew: true },
  { id: "sub-8", user_id: "demo-cand-3", user_name: "Olivia Chow", user_type: "candidate", service_id: "66", service_name: "Polling & Survey Research", plan: "monthly", price_cents: 129500, status: "active", start_date: "2024-03-10", next_billing: "2024-04-10", auto_renew: true },
  { id: "sub-9", user_id: "demo-cand-3", user_name: "Olivia Chow", user_type: "candidate", service_id: "11", service_name: "Crisis Management", plan: "monthly", price_cents: 99500, status: "active", start_date: "2024-03-10", next_billing: "2024-04-10", auto_renew: true },
  { id: "sub-10", user_id: "demo-cand-4", user_name: "Regional Mayor Demo", user_type: "candidate", service_id: "2", service_name: "Local Messaging & Communication", plan: "monthly", price_cents: 59500, status: "active", start_date: "2024-03-11", next_billing: "2024-04-11", auto_renew: true },
  { id: "sub-11", user_id: "demo-cand-4", user_name: "Regional Mayor Demo", user_type: "candidate", service_id: "17", service_name: "Municipal Advertising Campaigns", plan: "monthly", price_cents: 89500, status: "active", start_date: "2024-03-11", next_billing: "2024-04-11", auto_renew: true },
  { id: "sub-12", user_id: "demo-cand-4", user_name: "Regional Mayor Demo", user_type: "candidate", service_id: "22", service_name: "Volunteer Management System", plan: "monthly", price_cents: 44500, status: "active", start_date: "2024-03-11", next_billing: "2024-04-11", auto_renew: true },
  { id: "sub-13", user_id: "demo-cand-4", user_name: "Regional Mayor Demo", user_type: "candidate", service_id: "23", service_name: "Municipal Voter Management", plan: "monthly", price_cents: 74500, status: "active", start_date: "2024-03-11", next_billing: "2024-04-11", auto_renew: true },
  { id: "sub-14", user_id: "demo-cand-5", user_name: "Metro Councillor Demo", user_type: "candidate", service_id: "2", service_name: "Local Messaging & Communication", plan: "monthly", price_cents: 59500, status: "active", start_date: "2024-03-12", next_billing: "2024-04-12", auto_renew: true },
  { id: "sub-15", user_id: "demo-cand-5", user_name: "Metro Councillor Demo", user_type: "candidate", service_id: "17", service_name: "Municipal Advertising Campaigns", plan: "monthly", price_cents: 89500, status: "active", start_date: "2024-03-12", next_billing: "2024-04-12", auto_renew: true },
  { id: "sub-16", user_id: "demo-cand-5", user_name: "Metro Councillor Demo", user_type: "candidate", service_id: "20", service_name: "Door-to-Door Campaign Planning", plan: "monthly", price_cents: 44500, status: "active", start_date: "2024-03-12", next_billing: "2024-04-12", auto_renew: true },
  { id: "sub-17", user_id: "demo-cand-5", user_name: "Metro Councillor Demo", user_type: "candidate", service_id: "22", service_name: "Volunteer Management System", plan: "monthly", price_cents: 44500, status: "active", start_date: "2024-03-12", next_billing: "2024-04-12", auto_renew: true },
  { id: "sub-18", user_id: "demo-cand-5", user_name: "Metro Councillor Demo", user_type: "candidate", service_id: "23", service_name: "Municipal Voter Management", plan: "monthly", price_cents: 74500, status: "active", start_date: "2024-03-12", next_billing: "2024-04-12", auto_renew: true },
  { id: "sub-19", user_id: "demo-cand-6", user_name: "Neighbourhood Councillor Demo", user_type: "candidate", service_id: "2", service_name: "Local Messaging & Communication", plan: "monthly", price_cents: 59500, status: "active", start_date: "2024-03-13", next_billing: "2024-04-13", auto_renew: true },
  { id: "sub-20", user_id: "demo-cand-6", user_name: "Neighbourhood Councillor Demo", user_type: "candidate", service_id: "22", service_name: "Volunteer Management System", plan: "monthly", price_cents: 44500, status: "active", start_date: "2024-03-13", next_billing: "2024-04-13", auto_renew: true },
  { id: "sub-21", user_id: "demo-cand-6", user_name: "Neighbourhood Councillor Demo", user_type: "candidate", service_id: "23", service_name: "Municipal Voter Management", plan: "monthly", price_cents: 74500, status: "active", start_date: "2024-03-13", next_billing: "2024-04-13", auto_renew: true },
]

const INITIAL_LEADS: Lead[] = [
  { id: "lead-1", name: "Sarah Johnson", email: "sarah@example.com", phone: "555-0101", company: "City Council Campaign", source: "Website", status: "new", created_at: "2024-03-10T00:00:00Z" },
  { id: "lead-2", name: "Michael Chen", email: "mchen@example.com", phone: "555-0102", company: "School Board 2024", source: "Referral", status: "contacted", created_at: "2024-03-08T00:00:00Z" },
  { id: "lead-3", name: "Lisa Williams", email: "lwilliams@campaign.com", phone: "555-0103", company: "State Senate Race", source: "Social Media", status: "qualified", created_at: "2024-03-05T00:00:00Z" },
]

const INITIAL_DEALS: Deal[] = [
  { id: "deal-1", title: "Full Campaign Package - Johnson", client_name: "Sarah Johnson", value_cents: 450000, stage: "proposal", probability: 60, expected_close: "2024-04-15", created_at: "2024-03-10T00:00:00Z" },
  { id: "deal-2", title: "Digital Marketing - Chen", client_name: "Michael Chen", value_cents: 180000, stage: "negotiation", probability: 80, expected_close: "2024-04-01", created_at: "2024-03-08T00:00:00Z" },
  { id: "deal-3", title: "Website + SEO - Williams", client_name: "Lisa Williams", value_cents: 250000, stage: "discovery", probability: 40, expected_close: "2024-05-01", created_at: "2024-03-05T00:00:00Z" },
  { id: "deal-4", title: "Top-Tier Mayor Campaign Account", client_name: "Olivia Chow", value_cents: 3853000, stage: "closed_won", probability: 100, expected_close: "2024-03-10", created_at: "2024-03-10T00:00:00Z" },
  { id: "deal-5", title: "Lean Mayor Campaign Account", client_name: "Regional Mayor Demo", value_cents: 1467000, stage: "closed_won", probability: 100, expected_close: "2024-03-11", created_at: "2024-03-11T00:00:00Z" },
  { id: "deal-6", title: "Top-Tier Councillor Campaign Account", client_name: "Metro Councillor Demo", value_cents: 1280500, stage: "closed_won", probability: 100, expected_close: "2024-03-12", created_at: "2024-03-12T00:00:00Z" },
  { id: "deal-7", title: "Lean Councillor Campaign Account", client_name: "Neighbourhood Councillor Demo", value_cents: 618000, stage: "closed_won", probability: 100, expected_close: "2024-03-13", created_at: "2024-03-13T00:00:00Z" },
]

const INITIAL_TASKS: Task[] = [
  { id: "task-1", title: "Follow up with Sarah Johnson", description: "Send proposal for full campaign package", related_to: "Sarah Johnson", priority: "high", status: "pending", due_date: "2024-03-15", created_at: "2024-03-10T00:00:00Z" },
  { id: "task-2", title: "Prepare contract for Chen deal", related_to: "Michael Chen", priority: "urgent", status: "in_progress", due_date: "2024-03-12", created_at: "2024-03-08T00:00:00Z" },
  { id: "task-3", title: "Schedule discovery call - Williams", related_to: "Lisa Williams", priority: "medium", status: "pending", due_date: "2024-03-18", created_at: "2024-03-05T00:00:00Z" },
  { id: "task-4", title: "Review fundraising throughput gap", description: "Confirm donor operations and campaign email stack are active.", related_to: "Olivia Chow", priority: "high", status: "pending", due_date: "2024-03-14", created_at: "2024-03-10T00:00:00Z" },
  { id: "task-5", title: "Set volunteer coordination workflow", description: "Launch volunteer scheduling and field reporting workflow.", related_to: "Regional Mayor Demo", priority: "high", status: "in_progress", due_date: "2024-03-15", created_at: "2024-03-11T00:00:00Z" },
  { id: "task-6", title: "Close persuasion coverage gap", description: "Coordinate digital, print, and field persuasion assets.", related_to: "Metro Councillor Demo", priority: "high", status: "pending", due_date: "2024-03-16", created_at: "2024-03-12T00:00:00Z" },
  { id: "task-7", title: "Activate neighbourhood voter capture", description: "Ensure voter data is collected for follow-up and GOTV.", related_to: "Neighbourhood Councillor Demo", priority: "medium", status: "pending", due_date: "2024-03-17", created_at: "2024-03-13T00:00:00Z" },
]

const INITIAL_TEAM_MEMBERS: TeamMember[] = [
  { id: "member-1", candidate_user_id: "demo-cand-1", candidate_name: "Maria Rodriguez", name: "Avery Brooks", email: "avery@campaigncore.com", role: "campaign_manager", status: "active", portal_access: true, permissions: ["campaigns", "chat", "reporting", "files", "meetings"], joined_at: "2024-01-05T00:00:00Z" },
  { id: "member-2", candidate_user_id: "demo-cand-1", candidate_name: "Maria Rodriguez", name: "Noah Singh", email: "noah@campaigncore.com", role: "field_director", status: "active", portal_access: true, permissions: ["field", "volunteers", "chat", "meetings"], joined_at: "2024-01-18T00:00:00Z" },
  { id: "member-3", candidate_user_id: "demo-cand-1", candidate_name: "Maria Rodriguez", name: "Priya Chen", email: "priya@campaigncore.com", role: "designer", status: "invited", portal_access: true, permissions: ["brand", "assets", "files"], joined_at: "2024-03-01T00:00:00Z" },
  { id: "member-4", candidate_user_id: "demo-cand-2", candidate_name: "James Wilson", name: "Sofia Malik", email: "sofia@campaigncore.com", role: "campaign_manager", status: "active", portal_access: true, permissions: ["campaigns", "chat", "files", "meetings", "reporting"], joined_at: "2024-02-08T00:00:00Z" },
  { id: "member-5", candidate_user_id: "demo-cand-2", candidate_name: "James Wilson", name: "Ethan Cole", email: "ethan@campaigncore.com", role: "analyst", status: "active", portal_access: true, permissions: ["reporting", "campaigns", "files"], joined_at: "2024-02-14T00:00:00Z" },
  { id: "member-6", candidate_user_id: "demo-cand-3", candidate_name: "Olivia Chow", name: "Jordan Park", email: "jordan.olivia@campaigncore.com", role: "campaign_manager", status: "active", portal_access: true, permissions: ["campaigns", "chat", "reporting", "files", "meetings"], joined_at: "2024-03-10T00:00:00Z" },
  { id: "member-7", candidate_user_id: "demo-cand-3", candidate_name: "Olivia Chow", name: "Mina Patel", email: "mina.olivia@campaigncore.com", role: "analyst", status: "active", portal_access: true, permissions: ["reporting", "campaigns", "files"], joined_at: "2024-03-10T00:00:00Z" },
  { id: "member-8", candidate_user_id: "demo-cand-4", candidate_name: "Regional Mayor Demo", name: "Liam Foster", email: "liam.regional@campaigncore.com", role: "campaign_manager", status: "active", portal_access: true, permissions: ["campaigns", "chat", "files", "meetings"], joined_at: "2024-03-11T00:00:00Z" },
  { id: "member-9", candidate_user_id: "demo-cand-4", candidate_name: "Regional Mayor Demo", name: "Harper Moss", email: "harper.regional@campaigncore.com", role: "field_director", status: "active", portal_access: true, permissions: ["field", "volunteers", "chat", "meetings"], joined_at: "2024-03-11T00:00:00Z" },
  { id: "member-10", candidate_user_id: "demo-cand-5", candidate_name: "Metro Councillor Demo", name: "Tessa Green", email: "tessa.metro@campaigncore.com", role: "campaign_manager", status: "active", portal_access: true, permissions: ["campaigns", "chat", "files", "meetings"], joined_at: "2024-03-12T00:00:00Z" },
  { id: "member-11", candidate_user_id: "demo-cand-5", candidate_name: "Metro Councillor Demo", name: "Owen Blake", email: "owen.metro@campaigncore.com", role: "field_director", status: "active", portal_access: true, permissions: ["field", "volunteers", "chat"], joined_at: "2024-03-12T00:00:00Z" },
  { id: "member-12", candidate_user_id: "demo-cand-6", candidate_name: "Neighbourhood Councillor Demo", name: "Riya Hall", email: "riya.neighbourhood@campaigncore.com", role: "campaign_manager", status: "active", portal_access: true, permissions: ["campaigns", "chat", "files", "meetings"], joined_at: "2024-03-13T00:00:00Z" },
  { id: "member-13", candidate_user_id: "demo-cand-6", candidate_name: "Neighbourhood Councillor Demo", name: "Evan Scott", email: "evan.neighbourhood@campaigncore.com", role: "analyst", status: "active", portal_access: true, permissions: ["reporting", "files"], joined_at: "2024-03-13T00:00:00Z" },
]

const INITIAL_TEAM_CHATS: TeamChatChannel[] = [
  { id: "team-chat-1", candidate_user_id: "demo-cand-1", candidate_name: "Maria Rodriguez", name: "Launch Ops", topic: "Daily launch blockers and approvals", member_ids: ["member-1", "member-2"], last_message: "Volunteer scripts approved for Saturday canvass.", last_message_at: "2024-03-14T15:00:00Z", unread_count: 2 },
  { id: "team-chat-2", candidate_user_id: "demo-cand-1", candidate_name: "Maria Rodriguez", name: "Creative Review", topic: "Design feedback and ad approvals", member_ids: ["member-1", "member-3"], last_message: "Homepage hero variations are ready for review.", last_message_at: "2024-03-13T18:30:00Z", unread_count: 0 },
  { id: "team-chat-3", candidate_user_id: "demo-cand-2", candidate_name: "James Wilson", name: "Field Intelligence", topic: "Ward briefings and canvass updates", member_ids: ["member-4", "member-5"], last_message: "Ward 3 sentiment report uploaded.", last_message_at: "2024-03-12T09:10:00Z", unread_count: 1 },
  { id: "team-chat-4", candidate_user_id: "demo-cand-3", candidate_name: "Olivia Chow", name: "Mayoral War Room", topic: "City-wide approvals and rapid response", member_ids: ["member-6", "member-7"], last_message: "Fundraising and polling dashboard synced.", last_message_at: "2024-03-14T10:00:00Z", unread_count: 3 },
  { id: "team-chat-5", candidate_user_id: "demo-cand-4", candidate_name: "Regional Mayor Demo", name: "Field Launch", topic: "Volunteer recruitment and canvass rollout", member_ids: ["member-8", "member-9"], last_message: "Volunteer route packs are ready for Friday.", last_message_at: "2024-03-14T12:15:00Z", unread_count: 1 },
  { id: "team-chat-6", candidate_user_id: "demo-cand-5", candidate_name: "Metro Councillor Demo", name: "Ward Persuasion", topic: "Digital + print + field coordination", member_ids: ["member-10", "member-11"], last_message: "Persuasion mail drop approved for ward 11.", last_message_at: "2024-03-14T09:45:00Z", unread_count: 2 },
  { id: "team-chat-7", candidate_user_id: "demo-cand-6", candidate_name: "Neighbourhood Councillor Demo", name: "Neighbourhood Ops", topic: "Lean race execution and voter capture", member_ids: ["member-12", "member-13"], last_message: "Doorstep issue logging sheet is live.", last_message_at: "2024-03-14T08:20:00Z", unread_count: 0 },
]

const INITIAL_TEAM_CHAT_MESSAGES: TeamChatMessage[] = [
  { id: "team-message-1", channel_id: "team-chat-1", candidate_user_id: "demo-cand-1", author_name: "Avery Brooks", author_role: "campaign_manager", content: "Volunteer scripts approved for Saturday canvass.", created_at: "2024-03-14T15:00:00Z" },
  { id: "team-message-2", channel_id: "team-chat-2", candidate_user_id: "demo-cand-1", author_name: "Priya Chen", author_role: "designer", content: "Homepage hero variations are ready for review.", created_at: "2024-03-13T18:30:00Z" },
  { id: "team-message-3", channel_id: "team-chat-3", candidate_user_id: "demo-cand-2", author_name: "Ethan Cole", author_role: "analyst", content: "Ward 3 sentiment report uploaded.", created_at: "2024-03-12T09:10:00Z" },
  { id: "team-message-4", channel_id: "team-chat-4", candidate_user_id: "demo-cand-3", author_name: "Jordan Park", author_role: "campaign_manager", content: "Fundraising and polling dashboard synced.", created_at: "2024-03-14T10:00:00Z" },
  { id: "team-message-5", channel_id: "team-chat-5", candidate_user_id: "demo-cand-4", author_name: "Liam Foster", author_role: "campaign_manager", content: "Volunteer route packs are ready for Friday.", created_at: "2024-03-14T12:15:00Z" },
  { id: "team-message-6", channel_id: "team-chat-6", candidate_user_id: "demo-cand-5", author_name: "Tessa Green", author_role: "campaign_manager", content: "Persuasion mail drop approved for ward 11.", created_at: "2024-03-14T09:45:00Z" },
  { id: "team-message-7", channel_id: "team-chat-7", candidate_user_id: "demo-cand-6", author_name: "Riya Hall", author_role: "campaign_manager", content: "Doorstep issue logging sheet is live.", created_at: "2024-03-14T08:20:00Z" },
]

const INITIAL_CLIENT_CHATS: ClientChatThread[] = [
  { id: "client-chat-1", client_id: "demo-cand-1", client_name: "Maria Rodriguez", owner_name: "Avery Brooks", subject: "Website launch checklist", priority: "high", status: "open", last_message: "Need final bio and donation copy before Friday.", last_message_at: "2024-03-14T14:00:00Z" },
  { id: "client-chat-2", client_id: "demo-cand-2", client_name: "James Wilson", owner_name: "Noah Singh", subject: "Canvassing route approvals", priority: "medium", status: "waiting", last_message: "Awaiting ward 3 volunteer lead confirmation.", last_message_at: "2024-03-13T11:15:00Z" },
  { id: "client-chat-3", client_id: "demo-cand-3", client_name: "Olivia Chow", owner_name: "Jordan Park", subject: "Mayoral package onboarding", priority: "high", status: "open", last_message: "Core retainers and launch work are active in CRM.", last_message_at: "2024-03-14T13:00:00Z" },
  { id: "client-chat-4", client_id: "demo-cand-4", client_name: "Regional Mayor Demo", owner_name: "Liam Foster", subject: "Lean mayor kickoff", priority: "high", status: "open", last_message: "Volunteer workflow and donor stack are queued for review.", last_message_at: "2024-03-14T13:20:00Z" },
  { id: "client-chat-5", client_id: "demo-cand-5", client_name: "Metro Councillor Demo", owner_name: "Tessa Green", subject: "Ward persuasion rollout", priority: "medium", status: "waiting", last_message: "Mail + digital + canvass plan shared for approval.", last_message_at: "2024-03-14T13:40:00Z" },
  { id: "client-chat-6", client_id: "demo-cand-6", client_name: "Neighbourhood Councillor Demo", owner_name: "Riya Hall", subject: "Lean ward package onboarding", priority: "medium", status: "open", last_message: "Neighbourhood voter capture checklist is ready.", last_message_at: "2024-03-14T14:10:00Z" },
]

const INITIAL_CAMPAIGNS: Campaign[] = [
  { id: "campaign-1", owner_user_id: "demo-cand-1", name: "Ward 6 Youth Outreach", owner_name: "Maria Rodriguez", status: "active", budget_cents: 325000, target_region: "Toronto Ward 6", launch_date: "2024-03-01", goals: ["Volunteer recruitment", "Door-to-door coverage", "Issue awareness"] },
  { id: "campaign-2", owner_user_id: "demo-cand-2", name: "Transit First Digital Push", owner_name: "James Wilson", status: "launching", budget_cents: 210000, target_region: "Downtown Core", launch_date: "2024-03-20", goals: ["Landing page conversion", "Email capture", "Ad performance"] },
  { id: "campaign-3", owner_user_id: "demo-cand-3", name: "Top-Tier Mayor Full Campaign", owner_name: "Olivia Chow", status: "active", budget_cents: 3853000, target_region: "Toronto City-wide", launch_date: "2024-03-10", goals: ["Fundraising scale", "Paid media dominance", "Election-day turnout"] },
  { id: "campaign-4", owner_user_id: "demo-cand-4", name: "Lean Mayor Full Campaign", owner_name: "Regional Mayor Demo", status: "active", budget_cents: 1467000, target_region: "Regional municipality", launch_date: "2024-03-11", goals: ["Volunteer recruitment", "Message consistency", "Small-city GOTV"] },
  { id: "campaign-5", owner_user_id: "demo-cand-5", name: "Top-Tier Councillor Full Campaign", owner_name: "Metro Councillor Demo", status: "active", budget_cents: 1280500, target_region: "Competitive urban ward", launch_date: "2024-03-12", goals: ["Ward persuasion", "Volunteer throughput", "Election-week execution"] },
  { id: "campaign-6", owner_user_id: "demo-cand-6", name: "Lean Councillor Full Campaign", owner_name: "Neighbourhood Councillor Demo", status: "active", budget_cents: 618000, target_region: "Neighbourhood ward", launch_date: "2024-03-13", goals: ["Doorstep outreach", "Neighbourhood data capture", "Candidate consistency"] },
]

const INITIAL_SHARED_FILES: SharedFile[] = [
  { id: "file-1", candidate_user_id: "demo-cand-1", candidate_name: "Maria Rodriguez", name: "Ward-6-Messaging-Brief.pdf", category: "brief", uploaded_by: "Avery Brooks", role_visibility: ["campaign_manager", "field_director", "designer", "analyst"], size_label: "2.4 MB", updated_at: "2024-03-14T16:30:00Z" },
  { id: "file-2", candidate_user_id: "demo-cand-1", candidate_name: "Maria Rodriguez", name: "Canvass-Weekend-RunSheet.xlsx", category: "field", uploaded_by: "Noah Singh", role_visibility: ["campaign_manager", "field_director"], size_label: "860 KB", updated_at: "2024-03-13T13:00:00Z" },
  { id: "file-3", candidate_user_id: "demo-cand-2", candidate_name: "James Wilson", name: "Transit-Ad-Creative-v4.fig", category: "design", uploaded_by: "Sofia Malik", role_visibility: ["campaign_manager", "designer", "analyst"], size_label: "4.8 MB", updated_at: "2024-03-12T11:45:00Z" },
  { id: "file-4", candidate_user_id: "demo-cand-3", candidate_name: "Olivia Chow", name: "Mayoral-War-Room-Brief.pdf", category: "brief", uploaded_by: "Jordan Park", role_visibility: ["campaign_manager", "analyst"], size_label: "3.1 MB", updated_at: "2024-03-14T15:10:00Z" },
  { id: "file-5", candidate_user_id: "demo-cand-4", candidate_name: "Regional Mayor Demo", name: "Regional-Mayor-Volunteer-Playbook.pdf", category: "field", uploaded_by: "Liam Foster", role_visibility: ["campaign_manager", "field_director"], size_label: "1.2 MB", updated_at: "2024-03-14T15:20:00Z" },
  { id: "file-6", candidate_user_id: "demo-cand-5", candidate_name: "Metro Councillor Demo", name: "Ward-Persuasion-Plan.pdf", category: "design", uploaded_by: "Tessa Green", role_visibility: ["campaign_manager", "field_director", "analyst"], size_label: "1.8 MB", updated_at: "2024-03-14T15:30:00Z" },
  { id: "file-7", candidate_user_id: "demo-cand-6", candidate_name: "Neighbourhood Councillor Demo", name: "Neighbourhood-Voter-Capture-Sheet.xlsx", category: "field", uploaded_by: "Riya Hall", role_visibility: ["campaign_manager", "analyst"], size_label: "540 KB", updated_at: "2024-03-14T15:40:00Z" },
]

const INITIAL_MEETINGS: Meeting[] = [
  { id: "meeting-1", candidate_user_id: "demo-cand-1", candidate_name: "Maria Rodriguez", title: "Daily Standup", meeting_type: "standup", starts_at: "2024-03-15T14:00:00Z", duration_minutes: 20, attendees: ["Avery Brooks", "Noah Singh", "Priya Chen"], status: "scheduled", notes: "Review canvass targets and asset approvals." },
  { id: "meeting-2", candidate_user_id: "demo-cand-1", candidate_name: "Maria Rodriguez", title: "Client Review", meeting_type: "client_review", starts_at: "2024-03-16T17:00:00Z", duration_minutes: 45, attendees: ["Maria Rodriguez", "Avery Brooks"], status: "scheduled", notes: "Finalize donation CTA and launch checklist." },
  { id: "meeting-3", candidate_user_id: "demo-cand-2", candidate_name: "James Wilson", title: "Strategy Review", meeting_type: "strategy", starts_at: "2024-03-17T18:00:00Z", duration_minutes: 60, attendees: ["James Wilson", "Sofia Malik", "Ethan Cole"], status: "scheduled", notes: "Review transit-first messaging and new ward targets." },
  { id: "meeting-4", candidate_user_id: "demo-cand-3", candidate_name: "Olivia Chow", title: "Mayoral Package Kickoff", meeting_type: "strategy", starts_at: "2024-03-18T15:00:00Z", duration_minutes: 60, attendees: ["Olivia Chow", "Jordan Park", "Mina Patel"], status: "scheduled", notes: "Review top-tier mayor package, polling, and fundraising stack." },
  { id: "meeting-5", candidate_user_id: "demo-cand-4", candidate_name: "Regional Mayor Demo", title: "Lean Mayor Launch", meeting_type: "client_review", starts_at: "2024-03-18T16:00:00Z", duration_minutes: 45, attendees: ["Regional Mayor Demo", "Liam Foster", "Harper Moss"], status: "scheduled", notes: "Confirm volunteer workflow and donor capture setup." },
  { id: "meeting-6", candidate_user_id: "demo-cand-5", candidate_name: "Metro Councillor Demo", title: "Ward Persuasion Review", meeting_type: "strategy", starts_at: "2024-03-19T17:00:00Z", duration_minutes: 45, attendees: ["Metro Councillor Demo", "Tessa Green", "Owen Blake"], status: "scheduled", notes: "Align digital, print, and field persuasion plan." },
  { id: "meeting-7", candidate_user_id: "demo-cand-6", candidate_name: "Neighbourhood Councillor Demo", title: "Neighbourhood Package Kickoff", meeting_type: "client_review", starts_at: "2024-03-19T18:00:00Z", duration_minutes: 45, attendees: ["Neighbourhood Councillor Demo", "Riya Hall", "Evan Scott"], status: "scheduled", notes: "Review lean ward package and voter capture workflow." },
]

function mergeSeedData<T extends { id: string }>(key: string, seedData: T[]): void {
  const currentData = getStorage<T[]>(key, [])
  if (currentData.length === 0) {
    setStorage(key, dedupeRecordsById(seedData))
    return
  }

  const existingIds = new Set(currentData.map(item => item.id))
  const missingSeedItems = seedData.filter(item => !existingIds.has(item.id))
  const mergedData = missingSeedItems.length > 0 ? [...currentData, ...missingSeedItems] : currentData
  const normalizedData = dedupeRecordsById(mergedData)

  if (normalizedData.length !== currentData.length || missingSeedItems.length > 0) {
    setStorage(key, normalizedData)
  }
}

function dedupeRecordsById<T extends { id: string }>(records: T[]): T[] {
  const uniqueRecords = new Map<string, T>()

  for (const record of records) {
    // Keep the most recent instance we saw for a given id so stale duplicates are discarded.
    uniqueRecords.set(record.id, record)
  }

  return Array.from(uniqueRecords.values())
}

// Store keys
const STORE_KEYS = {
  users: "crm_users",
  orders: "crm_orders",
  subscriptions: "crm_subscriptions",
  leads: "crm_leads",
  deals: "crm_deals",
  tasks: "crm_tasks",
  teamMembers: "crm_team_members",
  teamChats: "crm_team_chats",
  teamChatMessages: "crm_team_chat_messages",
  clientChats: "crm_client_chats",
  campaigns: "crm_campaigns",
  sharedFiles: "crm_shared_files",
  meetings: "crm_meetings",
  workspaceMemberSession: "crm_workspace_member_session",
  currentUser: "crm_current_user",
}

// Helper to safely access localStorage
function getStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch {
    return defaultValue
  }
}

function setStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.error("Failed to save to localStorage:", e)
  }
}

function nextId(prefix: string): string {
  if (typeof window === "undefined") {
    return `${prefix}-${Date.now()}`
  }

  const sequenceKey = `crm_id_sequence_${prefix}`
  const current = Number(localStorage.getItem(sequenceKey) || "0") + 1
  localStorage.setItem(sequenceKey, String(current))
  return `${prefix}-${Date.now()}-${current}`
}

// Initialize store with demo data if empty
export function initializeStore(): void {
  if (typeof window === "undefined") return
  
  mergeSeedData(STORE_KEYS.users, INITIAL_USERS)
  mergeSeedData(STORE_KEYS.orders, INITIAL_ORDERS)
  mergeSeedData(STORE_KEYS.subscriptions, INITIAL_SUBSCRIPTIONS)
  mergeSeedData(STORE_KEYS.leads, INITIAL_LEADS)
  mergeSeedData(STORE_KEYS.deals, INITIAL_DEALS)
  mergeSeedData(STORE_KEYS.tasks, INITIAL_TASKS)
  mergeSeedData(STORE_KEYS.teamMembers, INITIAL_TEAM_MEMBERS)
  mergeSeedData(STORE_KEYS.teamChats, INITIAL_TEAM_CHATS)
  mergeSeedData(STORE_KEYS.teamChatMessages, INITIAL_TEAM_CHAT_MESSAGES)
  mergeSeedData(STORE_KEYS.clientChats, INITIAL_CLIENT_CHATS)
  mergeSeedData(STORE_KEYS.campaigns, INITIAL_CAMPAIGNS)
  mergeSeedData(STORE_KEYS.sharedFiles, INITIAL_SHARED_FILES)
  mergeSeedData(STORE_KEYS.meetings, INITIAL_MEETINGS)
}

// Reset store to initial demo data
export function resetStore(): void {
  setStorage(STORE_KEYS.users, dedupeRecordsById(INITIAL_USERS))
  setStorage(STORE_KEYS.orders, dedupeRecordsById(INITIAL_ORDERS))
  setStorage(STORE_KEYS.subscriptions, dedupeRecordsById(INITIAL_SUBSCRIPTIONS))
  setStorage(STORE_KEYS.leads, dedupeRecordsById(INITIAL_LEADS))
  setStorage(STORE_KEYS.deals, dedupeRecordsById(INITIAL_DEALS))
  setStorage(STORE_KEYS.tasks, dedupeRecordsById(INITIAL_TASKS))
  setStorage(STORE_KEYS.teamMembers, dedupeRecordsById(INITIAL_TEAM_MEMBERS))
  setStorage(STORE_KEYS.teamChats, dedupeRecordsById(INITIAL_TEAM_CHATS))
  setStorage(STORE_KEYS.teamChatMessages, dedupeRecordsById(INITIAL_TEAM_CHAT_MESSAGES))
  setStorage(STORE_KEYS.clientChats, dedupeRecordsById(INITIAL_CLIENT_CHATS))
  setStorage(STORE_KEYS.campaigns, dedupeRecordsById(INITIAL_CAMPAIGNS))
  setStorage(STORE_KEYS.sharedFiles, dedupeRecordsById(INITIAL_SHARED_FILES))
  setStorage(STORE_KEYS.meetings, dedupeRecordsById(INITIAL_MEETINGS))
  localStorage.removeItem(STORE_KEYS.workspaceMemberSession)
  localStorage.removeItem(STORE_KEYS.currentUser)
}

// User operations
export function getUsers(): DemoUser[] {
  return getStorage(STORE_KEYS.users, INITIAL_USERS)
}

export function getUser(id: string): DemoUser | undefined {
  return getUsers().find(u => u.id === id)
}

export function getUserByEmail(email: string): DemoUser | undefined {
  return getUsers().find(u => u.email.toLowerCase() === email.toLowerCase())
}

export function authenticateUser(email: string, password: string): DemoUser | null {
  const user = getUserByEmail(email)
  if (user && user.password === password) {
    setStorage(STORE_KEYS.currentUser, user)
    return user
  }
  return null
}

export function getCurrentUser(): DemoUser | null {
  return getStorage<DemoUser | null>(STORE_KEYS.currentUser, null)
}

export function setCurrentUser(user: DemoUser | null): void {
  if (typeof window === "undefined") return
  if (!user) {
    localStorage.removeItem(STORE_KEYS.currentUser)
    return
  }

  setStorage(STORE_KEYS.currentUser, user)
}

export function logoutUser(): void {
  localStorage.removeItem(STORE_KEYS.currentUser)
}

// Order operations
export function getOrders(): Order[] {
  return getStorage(STORE_KEYS.orders, INITIAL_ORDERS)
}

export function getOrdersByUser(userId: string): Order[] {
  return getOrders().filter(o => o.user_id === userId)
}

export function createOrder(order: Omit<Order, "id" | "order_number" | "created_at">): Order {
  const orders = getOrders()
  const newOrder: Order = {
    ...order,
    id: nextId("ord"),
    order_number: `ORD-${new Date().getFullYear()}-${String(orders.length + 1).padStart(5, "0")}`,
    created_at: new Date().toISOString(),
  }
  setStorage(STORE_KEYS.orders, [...orders, newOrder])
  return newOrder
}

export function updateOrderStatus(orderId: string, status: Order["status"], paymentStatus?: Order["payment_status"]): void {
  const orders = getOrders()
  const updated = orders.map(o => 
    o.id === orderId 
      ? { ...o, status, ...(paymentStatus && { payment_status: paymentStatus }) }
      : o
  )
  setStorage(STORE_KEYS.orders, updated)
}

// Subscription operations
export function getSubscriptions(): Subscription[] {
  return getStorage(STORE_KEYS.subscriptions, INITIAL_SUBSCRIPTIONS)
}

export function getSubscriptionsByUser(userId: string): Subscription[] {
  return getSubscriptions().filter(s => s.user_id === userId)
}

export function createSubscription(sub: Omit<Subscription, "id" | "start_date" | "next_billing">): Subscription {
  const subs = getSubscriptions()
  const startDate = new Date().toISOString().split("T")[0]
  const nextBilling = new Date()
  if (sub.plan === "monthly") nextBilling.setMonth(nextBilling.getMonth() + 1)
  else if (sub.plan === "quarterly") nextBilling.setMonth(nextBilling.getMonth() + 3)
  else nextBilling.setFullYear(nextBilling.getFullYear() + 1)
  
  const newSub: Subscription = {
    ...sub,
    id: nextId("sub"),
    start_date: startDate,
    next_billing: nextBilling.toISOString().split("T")[0],
  }
  setStorage(STORE_KEYS.subscriptions, [...subs, newSub])
  return newSub
}

export function updateSubscriptionStatus(subId: string, status: Subscription["status"]): void {
  const subs = getSubscriptions()
  const updated = subs.map(s => s.id === subId ? { ...s, status } : s)
  setStorage(STORE_KEYS.subscriptions, updated)
}

export function cancelSubscription(subId: string): void {
  updateSubscriptionStatus(subId, "cancelled")
}

// Lead operations
export function getLeads(): Lead[] {
  return getStorage(STORE_KEYS.leads, INITIAL_LEADS)
}

export function createLead(lead: Omit<Lead, "id" | "created_at">): Lead {
  const leads = getLeads()
  const newLead: Lead = {
    ...lead,
    id: nextId("lead"),
    created_at: new Date().toISOString(),
  }
  setStorage(STORE_KEYS.leads, [...leads, newLead])
  return newLead
}

export function updateLeadStatus(leadId: string, status: Lead["status"]): void {
  const leads = getLeads()
  const updated = leads.map(l => l.id === leadId ? { ...l, status } : l)
  setStorage(STORE_KEYS.leads, updated)
}

// Deal operations
export function getDeals(): Deal[] {
  return getStorage(STORE_KEYS.deals, INITIAL_DEALS)
}

export function createDeal(deal: Omit<Deal, "id" | "created_at">): Deal {
  const deals = getDeals()
  const newDeal: Deal = {
    ...deal,
    id: nextId("deal"),
    created_at: new Date().toISOString(),
  }
  setStorage(STORE_KEYS.deals, [...deals, newDeal])
  return newDeal
}

export function updateDealStage(dealId: string, stage: Deal["stage"]): void {
  const deals = getDeals()
  const updated = deals.map(d => d.id === dealId ? { ...d, stage } : d)
  setStorage(STORE_KEYS.deals, updated)
}

// Task operations
export function getTasks(): Task[] {
  return getStorage(STORE_KEYS.tasks, INITIAL_TASKS)
}

export function createTask(task: Omit<Task, "id" | "created_at">): Task {
  const tasks = getTasks()
  const newTask: Task = {
    ...task,
    id: nextId("task"),
    created_at: new Date().toISOString(),
  }
  setStorage(STORE_KEYS.tasks, [...tasks, newTask])
  return newTask
}

export function updateTaskStatus(taskId: string, status: Task["status"]): void {
  const tasks = getTasks()
  const updated = tasks.map(t => t.id === taskId ? { ...t, status } : t)
  setStorage(STORE_KEYS.tasks, updated)
}

// Team setup operations
export function getTeamMembers(): TeamMember[] {
  return getStorage(STORE_KEYS.teamMembers, INITIAL_TEAM_MEMBERS)
}

export function getTeamMembersByCandidate(candidateUserId: string): TeamMember[] {
  return getTeamMembers().filter(member => member.candidate_user_id === candidateUserId)
}

export function createTeamMember(member: Omit<TeamMember, "id" | "joined_at">): TeamMember {
  const members = getTeamMembers()
  const newMember: TeamMember = {
    ...member,
    id: nextId("member"),
    joined_at: new Date().toISOString(),
  }
  setStorage(STORE_KEYS.teamMembers, [...members, newMember])
  return newMember
}

export function updateTeamMemberRole(memberId: string, role: TeamMember["role"]): void {
  const members = getTeamMembers()
  const updated = members.map(member => member.id === memberId ? { ...member, role } : member)
  setStorage(STORE_KEYS.teamMembers, updated)
}

export function updateTeamMemberStatus(memberId: string, status: TeamMember["status"]): void {
  const members = getTeamMembers()
  const updated = members.map(member => member.id === memberId ? { ...member, status } : member)
  setStorage(STORE_KEYS.teamMembers, updated)
}

// Team chat operations
export function getTeamChats(): TeamChatChannel[] {
  return getStorage(STORE_KEYS.teamChats, INITIAL_TEAM_CHATS)
}

export function getTeamChatsByCandidate(candidateUserId: string): TeamChatChannel[] {
  return getTeamChats().filter(chat => chat.candidate_user_id === candidateUserId)
}

export function getTeamChatMessages(): TeamChatMessage[] {
  return getStorage(STORE_KEYS.teamChatMessages, INITIAL_TEAM_CHAT_MESSAGES)
}

export function getMessagesForChannel(channelId: string): TeamChatMessage[] {
  return getTeamChatMessages().filter(message => message.channel_id === channelId)
}

export function createTeamChat(chat: Omit<TeamChatChannel, "id" | "last_message_at">): TeamChatChannel {
  const chats = getTeamChats()
  const newChat: TeamChatChannel = {
    ...chat,
    id: nextId("team-chat"),
    last_message_at: new Date().toISOString(),
  }
  setStorage(STORE_KEYS.teamChats, [...chats, newChat])
  return newChat
}

export function postTeamChatMessage(chatId: string, message: string): void {
  const chats = getTeamChats()
  const channel = chats.find(chat => chat.id === chatId)
  const updated = chats.map(chat =>
    chat.id === chatId
      ? {
          ...chat,
          last_message: message,
          last_message_at: new Date().toISOString(),
          unread_count: chat.unread_count + 1,
        }
      : chat,
  )
  setStorage(STORE_KEYS.teamChats, updated)

  if (channel) {
    const messages = getTeamChatMessages()
    const author = getTeamMembers().find(member => channel.member_ids.includes(member.id))
    const newMessage: TeamChatMessage = {
      id: nextId("team-message"),
      channel_id: chatId,
      candidate_user_id: channel.candidate_user_id,
      author_name: author?.name || channel.candidate_name,
      author_role: author?.role || "campaign_manager",
      content: message,
      created_at: new Date().toISOString(),
    }
    setStorage(STORE_KEYS.teamChatMessages, [...messages, newMessage])
  }
}

// Client chat operations
export function getClientChats(): ClientChatThread[] {
  return getStorage(STORE_KEYS.clientChats, INITIAL_CLIENT_CHATS)
}

export function createClientChat(thread: Omit<ClientChatThread, "id" | "last_message_at">): ClientChatThread {
  const threads = getClientChats()
  const newThread: ClientChatThread = {
    ...thread,
    id: nextId("client-chat"),
    last_message_at: new Date().toISOString(),
  }
  setStorage(STORE_KEYS.clientChats, [...threads, newThread])
  return newThread
}

export function updateClientChatStatus(threadId: string, status: ClientChatThread["status"]): void {
  const threads = getClientChats()
  const updated = threads.map(thread => thread.id === threadId ? { ...thread, status } : thread)
  setStorage(STORE_KEYS.clientChats, updated)
}

export function postClientChatMessage(threadId: string, message: string): void {
  const threads = getClientChats()
  const updated = threads.map(thread =>
    thread.id === threadId
      ? {
          ...thread,
          last_message: message,
          last_message_at: new Date().toISOString(),
        }
      : thread,
  )
  setStorage(STORE_KEYS.clientChats, updated)
}

// Campaign operations
export function getCampaigns(): Campaign[] {
  return getStorage(STORE_KEYS.campaigns, INITIAL_CAMPAIGNS)
}

export function getCampaignsByUser(userId: string): Campaign[] {
  return getCampaigns().filter(campaign => campaign.owner_user_id === userId)
}

export function createCampaign(campaign: Omit<Campaign, "id">): Campaign {
  const campaigns = getCampaigns()
  const newCampaign: Campaign = {
    ...campaign,
    id: nextId("campaign"),
  }
  setStorage(STORE_KEYS.campaigns, [...campaigns, newCampaign])
  return newCampaign
}

export function updateCampaignStatus(campaignId: string, status: Campaign["status"]): void {
  const campaigns = getCampaigns()
  const updated = campaigns.map(campaign => campaign.id === campaignId ? { ...campaign, status } : campaign)
  setStorage(STORE_KEYS.campaigns, updated)
}

// File sharing operations
export function getSharedFiles(): SharedFile[] {
  return getStorage(STORE_KEYS.sharedFiles, INITIAL_SHARED_FILES)
}

export function getSharedFilesByCandidate(candidateUserId: string): SharedFile[] {
  return getSharedFiles().filter(file => file.candidate_user_id === candidateUserId)
}

export function createSharedFile(file: Omit<SharedFile, "id" | "updated_at">): SharedFile {
  const files = getSharedFiles()
  const newFile: SharedFile = {
    ...file,
    id: nextId("file"),
    updated_at: new Date().toISOString(),
  }
  setStorage(STORE_KEYS.sharedFiles, [...files, newFile])
  return newFile
}

// Meeting operations
export function getMeetings(): Meeting[] {
  return getStorage(STORE_KEYS.meetings, INITIAL_MEETINGS)
}

export function getMeetingsByCandidate(candidateUserId: string): Meeting[] {
  return getMeetings().filter(meeting => meeting.candidate_user_id === candidateUserId)
}

export function createMeeting(meeting: Omit<Meeting, "id">): Meeting {
  const meetings = getMeetings()
  const newMeeting: Meeting = {
    ...meeting,
    id: nextId("meeting"),
  }
  setStorage(STORE_KEYS.meetings, [...meetings, newMeeting])
  return newMeeting
}

export function updateMeetingStatus(meetingId: string, status: Meeting["status"]): void {
  const meetings = getMeetings()
  const updated = meetings.map(meeting => meeting.id === meetingId ? { ...meeting, status } : meeting)
  setStorage(STORE_KEYS.meetings, updated)
}

// Workspace session operations
export function setWorkspaceMemberSession(session: TeamWorkspaceSession): void {
  setStorage(STORE_KEYS.workspaceMemberSession, session)
}

export function getWorkspaceMemberSession(): TeamWorkspaceSession | null {
  return getStorage<TeamWorkspaceSession | null>(STORE_KEYS.workspaceMemberSession, null)
}

export function clearWorkspaceMemberSession(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(STORE_KEYS.workspaceMemberSession)
}

// Stats helpers
export function getStats() {
  const users = getUsers()
  const orders = getOrders()
  const subs = getSubscriptions()
  const leads = getLeads()
  const deals = getDeals()
  const tasks = getTasks()
  const teamMembers = getTeamMembers()
  const clientChats = getClientChats()
  const campaigns = getCampaigns()
  const sharedFiles = getSharedFiles()
  const meetings = getMeetings()

  return {
    totalUsers: users.filter(u => u.type !== "admin").length,
    totalCandidates: users.filter(u => u.type === "candidate").length,
    totalVoters: users.filter(u => u.type === "voter").length,
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === "pending").length,
    totalRevenue: orders.filter(o => o.payment_status === "paid").reduce((sum, o) => sum + o.total_cents, 0),
    activeSubscriptions: subs.filter(s => s.status === "active").length,
    mrr: subs.filter(s => s.status === "active" && s.plan === "monthly").reduce((sum, s) => sum + s.price_cents, 0),
    newLeads: leads.filter(l => l.status === "new").length,
    totalLeads: leads.length,
    openDeals: deals.filter(d => !["closed_won", "closed_lost"].includes(d.stage)).length,
    dealPipeline: deals.filter(d => !["closed_won", "closed_lost"].includes(d.stage)).reduce((sum, d) => sum + d.value_cents, 0),
    pendingTasks: tasks.filter(t => t.status === "pending").length,
    overdueTasks: tasks.filter(t => t.status !== "completed" && new Date(t.due_date) < new Date()).length,
    activeCampaigns: campaigns.filter(c => c.status === "active").length,
    activeTeamMembers: teamMembers.filter(m => m.status === "active").length,
    openClientChats: clientChats.filter(chat => chat.status !== "resolved").length,
    sharedFiles: sharedFiles.length,
    scheduledMeetings: meetings.filter(meeting => meeting.status === "scheduled").length,
  }
}
