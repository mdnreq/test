import { CAMPAIGN_PACKAGE_PRESETS, type CampaignStackId } from "@/lib/campaign-package-presets"

export interface CampaignServiceDefinition {
  id: string
  name: string
  description: string
  category: string
  price_monthly: number
  price_display: string
  features: string[]
  popular: boolean
}

export type CampaignCommercialModel = "monthly-retainer" | "launch-project"

export interface PublicServiceStackMetric {
  value: string
  label: string
  accentClass: string
}

export interface PublicServiceStack {
  id: string
  badge: string
  title: string
  description: string
  animation: "design" | "seo" | "reputation" | "web" | "crisis" | "media" | "analytics" | "field" | "youth" | "fundraising" | "content" | "digital" | "research" | "video" | "email"
  gradientClass: string
  textClass: string
  badgeClass: string
  metrics: PublicServiceStackMetric[]
}

export interface DerivedCampaignBlueprint {
  id: string
  label: string
  candidateName: string
  benchmarkType: string
  election: string
  cycleMonths: number
  targetedVoters: number
  expectedVotes: number
  monthlyCoreCents: number
  oneTimeLaunchCents: number
  addOnValueCents: number
  fullCampaignValueCents: number
  mustHaveServices: string[]
  recommendedServices: string[]
  gapAnalysis: Array<{
    area: string
    gap: string
    subscription: string
  }>
  addOnSubscriptions: string[]
  costPerTargetedVoterCents: number
  costPerExpectedVoteCents: number
}

export const CAMPAIGN_SERVICE_CATALOG: CampaignServiceDefinition[] = [
  { id: "1", name: "Municipal Branding & Identity", description: "Build a compelling local political brand that resonates with your community and persuades Gen Z and Millennial voters", category: "Design", price_monthly: 495, price_display: "$495/month", features: ["Logo & visual identity", "Brand guidelines", "Campaign messaging framework", "Generational voter positioning"], popular: true },
  { id: "36", name: "Campaign Logo Design", description: "Professional logo design that captures your campaign's vision and appeals to modern voters", category: "Design", price_monthly: 395, price_display: "$395 one-time", features: ["3 initial concepts", "Unlimited revisions", "Multiple file formats", "Social media versions", "Print-ready files"], popular: true },
  { id: "37", name: "Campaign Print Materials", description: "Eye-catching flyers, brochures, door hangers, and yard signs that get noticed", category: "Design", price_monthly: 545, price_display: "$545/month", features: ["Flyer design", "Brochure layouts", "Door hangers", "Yard sign design", "Business cards"], popular: false },
  { id: "38", name: "Social Media Graphics Package", description: "Consistent, professional graphics for all your social media platforms", category: "Design", price_monthly: 445, price_display: "$445/month", features: ["Profile & cover images", "Post templates", "Story templates", "Infographics", "Quote cards"], popular: true },
  { id: "39", name: "Campaign Merchandise Design", description: "Design for t-shirts, buttons, stickers, and other campaign merchandise", category: "Design", price_monthly: 345, price_display: "$345/month", features: ["T-shirt designs", "Button designs", "Sticker designs", "Tote bags", "Promotional items"], popular: false },
  { id: "40", name: "Email Template Design", description: "Professional email templates that drive engagement and donations", category: "Design", price_monthly: 295, price_display: "$295/month", features: ["Newsletter templates", "Fundraising emails", "Event invitations", "Thank you emails", "Mobile-optimized"], popular: false },
  { id: "41", name: "Presentation & Deck Design", description: "Compelling presentation designs for town halls, debates, and fundraisers", category: "Design", price_monthly: 445, price_display: "$445/month", features: ["PowerPoint/Keynote design", "Pitch decks", "Town hall visuals", "Infographic slides", "Speaker notes templates"], popular: false },
  { id: "42", name: "Video Thumbnails & Graphics", description: "Attention-grabbing thumbnails and graphics for your campaign videos", category: "Design", price_monthly: 295, price_display: "$295/month", features: ["YouTube thumbnails", "Video end cards", "Lower thirds", "Intro/outro graphics", "Social video covers"], popular: false },
  { id: "2", name: "Local Messaging & Communication", description: "Craft powerful messages that connect with Gen Z and Millennial municipal voters", category: "Content Creation", price_monthly: 595, price_display: "$595/month", features: ["Message development", "Speech writing", "Social media content", "Crisis communication"], popular: true },
  { id: "3", name: "SEO (Search Engine Optimization)", description: "Rank higher in Google for your name, campaign, and key municipal issues", category: "SEO & Optimization", price_monthly: 695, price_display: "$695/month", features: ["Keyword research & strategy", "On-page SEO optimization", "Backlink building", "Mobile-first optimization", "Local SEO for municipalities"], popular: true },
  { id: "4", name: "AEO (Answer Engine Optimization)", description: "Optimize your content for AI assistants, voice search, and featured snippets", category: "SEO & Optimization", price_monthly: 745, price_display: "$745/month", features: ["FAQ schema markup", "Structured content creation", "Voice search optimization", "NLP-friendly copy", "Featured snippet targeting"], popular: true },
  { id: "5", name: "GEO (Generative Engine Optimization)", description: "Ensure AI tools like ChatGPT and Perplexity reference you accurately", category: "SEO & Optimization", price_monthly: 895, price_display: "$895/month", features: ["AI citation optimization", "Context-rich content", "Brand mention structuring", "Knowledge graph optimization", "AI training data presence"], popular: true },
  { id: "43", name: "Backlink Building & Outreach", description: "Build high-quality backlinks from authoritative sites to boost your search rankings", category: "SEO & Optimization", price_monthly: 795, price_display: "$795/month", features: ["Guest posting outreach", "Editorial link building", "Broken link reclamation", "Competitor backlink analysis", "Authority site placements"], popular: true },
  { id: "44", name: "Technical SEO Audit", description: "Comprehensive technical analysis to fix issues hurting your search performance", category: "SEO & Optimization", price_monthly: 595, price_display: "$595 one-time", features: ["Site speed optimization", "Mobile usability fixes", "Crawl error resolution", "Schema markup implementation", "Core Web Vitals optimization"], popular: false },
  { id: "45", name: "Local SEO for Candidates", description: "Dominate local search results in your municipality and electoral district", category: "SEO & Optimization", price_monthly: 545, price_display: "$545/month", features: ["Google Business Profile optimization", "Local citation building", "NAP consistency", "Local keyword targeting", "Map pack optimization"], popular: true },
  { id: "46", name: "Wikipedia Page Creation", description: "Establish credibility with a professionally written Wikipedia presence", category: "SEO & Optimization", price_monthly: 1495, price_display: "$1,495 one-time", features: ["Notability assessment", "Article drafting & submission", "Citation sourcing", "Ongoing monitoring", "Edit protection strategy"], popular: true },
  { id: "47", name: "Google Knowledge Panel Setup", description: "Get your own Google Knowledge Panel when voters search your name", category: "SEO & Optimization", price_monthly: 995, price_display: "$995 one-time", features: ["Entity establishment", "Structured data markup", "Knowledge graph submission", "Image & bio optimization", "Social profile linking"], popular: true },
  { id: "48", name: "Content SEO Strategy", description: "Strategic content planning optimized for search visibility and voter engagement", category: "SEO & Optimization", price_monthly: 645, price_display: "$645/month", features: ["Content gap analysis", "Topic cluster strategy", "Keyword mapping", "Content calendar", "Performance tracking"], popular: false },
  { id: "49", name: "Link Reclamation & Cleanup", description: "Recover lost links and remove toxic backlinks harming your rankings", category: "SEO & Optimization", price_monthly: 445, price_display: "$445/month", features: ["Lost link recovery", "Toxic link identification", "Disavow file management", "Brand mention conversion", "Link audit reports"], popular: false },
  { id: "50", name: "SERP Feature Optimization", description: "Capture featured snippets, People Also Ask, and other SERP features", category: "SEO & Optimization", price_monthly: 595, price_display: "$595/month", features: ["Featured snippet targeting", "PAA optimization", "Rich result implementation", "Image SEO", "Video carousel optimization"], popular: false },
  { id: "51", name: "Identity Architecture", description: "Build a cohesive digital identity system across all platforms and touchpoints", category: "Reputation", price_monthly: 895, price_display: "$895/month", features: ["Cross-platform identity audit", "Unified brand voice development", "Digital footprint optimization", "Identity consistency framework", "Personal brand positioning"], popular: true },
  { id: "52", name: "Identity Crisis Management", description: "Rapid response and recovery when your online identity is attacked or compromised", category: "Risk & Crisis", price_monthly: 1295, price_display: "$1,295/month", features: ["24/7 identity monitoring", "Impersonation takedowns", "Narrative correction", "Search result repair", "Reputation recovery plan"], popular: true },
  { id: "53", name: "Digital Identity Audit", description: "Comprehensive assessment of your online presence and identity vulnerabilities", category: "Reputation", price_monthly: 595, price_display: "$595 one-time", features: ["Full digital footprint scan", "Social media audit", "Search result analysis", "Vulnerability assessment", "Action plan delivery"], popular: false },
  { id: "54", name: "Personal Brand Strategy", description: "Strategic positioning to differentiate you from opponents and build voter trust", category: "Reputation", price_monthly: 745, price_display: "$745/month", features: ["Competitor analysis", "Unique value proposition", "Messaging hierarchy", "Brand story development", "Authenticity coaching"], popular: true },
  { id: "55", name: "Identity Protection & Monitoring", description: "Continuous monitoring to protect your identity from attacks and misrepresentation", category: "Risk & Crisis", price_monthly: 545, price_display: "$545/month", features: ["Real-time alerts", "Fake account detection", "Deepfake monitoring", "Impersonation alerts", "Monthly security reports"], popular: false },
  { id: "56", name: "Narrative Control & Messaging", description: "Take control of your story before opponents define you", category: "Reputation", price_monthly: 695, price_display: "$695/month", features: ["Core narrative development", "Talking points creation", "Counter-narrative strategies", "Message testing", "Rapid response scripts"], popular: false },
  { id: "6", name: "Wikipedia Page Creation & Management", description: "Establish credibility with a professionally written and maintained Wikipedia presence", category: "Reputation", price_monthly: 1495, price_display: "$1,495 one-time", features: ["Notability assessment", "Article drafting & submission", "Citation sourcing", "Ongoing monitoring", "Edit protection strategy"], popular: true },
  { id: "7", name: "Google Knowledge Panel Setup", description: "Get your own Google Knowledge Panel displaying when voters search your name", category: "Reputation", price_monthly: 995, price_display: "$995 one-time", features: ["Entity establishment", "Structured data markup", "Knowledge graph submission", "Image & bio optimization", "Social profile linking"], popular: true },
  { id: "8", name: "Online Reputation Management", description: "Monitor and improve how you appear across search engines and social platforms", category: "Reputation", price_monthly: 645, price_display: "$645/month", features: ["Search result monitoring", "Negative content suppression", "Review management", "Sentiment analysis", "Personal brand protection"], popular: false },
  { id: "9", name: "Digital Presence", description: "Establish a dominant online presence across all digital channels", category: "Web Development", price_monthly: 795, price_display: "$795/month", features: ["Website development", "SEO optimization", "Social media management", "Email campaigns"], popular: true },
  { id: "10", name: "Campaign Website Pro", description: "High-converting campaign website with donation system and volunteer signup", category: "Web Development", price_monthly: 1295, price_display: "$1,295 one-time", features: ["Custom design", "Donation integration", "Volunteer portal", "Event calendar", "Mobile-optimized"], popular: false },
  { id: "57", name: "Landing Page Builder", description: "High-converting landing pages for events, fundraisers, and issue campaigns", category: "Web Development", price_monthly: 445, price_display: "$445/page", features: ["Conversion-optimized design", "A/B testing ready", "Lead capture forms", "Analytics integration", "Fast loading speed"], popular: true },
  { id: "58", name: "Donation Platform Setup", description: "Secure, compliant donation system integrated with your campaign website", category: "Web Development", price_monthly: 695, price_display: "$695 one-time", features: ["Payment processing", "Recurring donations", "Donor management", "Tax receipt automation", "Compliance reporting"], popular: true },
  { id: "59", name: "Volunteer Portal Development", description: "Custom portal for volunteer signup, scheduling, and coordination", category: "Web Development", price_monthly: 595, price_display: "$595 one-time", features: ["Online registration", "Shift scheduling", "Task management", "Communication tools", "Hour tracking"], popular: false },
  { id: "60", name: "Event Registration System", description: "Professional event pages with ticketing, RSVPs, and attendee management", category: "Web Development", price_monthly: 395, price_display: "$395/month", features: ["Event pages", "Ticket sales", "RSVP tracking", "Email reminders", "Check-in system"], popular: false },
  { id: "61", name: "Email Newsletter Platform", description: "Professional email marketing system for voter outreach and fundraising", category: "Web Development", price_monthly: 345, price_display: "$345/month", features: ["Email templates", "List management", "Automation workflows", "Analytics dashboard", "A/B testing"], popular: false },
  { id: "62", name: "Mobile App Development", description: "Custom mobile app for your campaign with push notifications and voter tools", category: "Web Development", price_monthly: 2495, price_display: "$2,495 one-time", features: ["iOS & Android apps", "Push notifications", "Event calendar", "Donation integration", "Canvassing tools"], popular: false },
  { id: "63", name: "Website Maintenance & Support", description: "Ongoing technical support, updates, and security for your campaign website", category: "Web Development", price_monthly: 295, price_display: "$295/month", features: ["Security updates", "Content updates", "Performance monitoring", "Backup management", "Technical support"], popular: false },
  { id: "64", name: "Accessibility Compliance", description: "Ensure your website meets WCAG accessibility standards for all voters", category: "Web Development", price_monthly: 495, price_display: "$495 one-time", features: ["Accessibility audit", "WCAG compliance", "Screen reader optimization", "Keyboard navigation", "Alt text implementation"], popular: false },
  { id: "11", name: "Crisis Management", description: "24/7 rapid response to protect your campaign from reputational threats", category: "Risk & Crisis", price_monthly: 995, price_display: "$995/month", features: ["24/7 crisis monitoring", "Rapid response team", "Crisis communication protocols", "Media damage control", "Post-crisis recovery"], popular: true },
  { id: "12", name: "Political Risk Assessment", description: "Identify and mitigate risks before they become campaign-ending crises", category: "Risk & Crisis", price_monthly: 745, price_display: "$745/month", features: ["Opposition research", "Vulnerability audit", "Risk scoring matrix", "Mitigation strategies", "Scenario planning"], popular: false },
  { id: "13", name: "Opposition Research & Defense", description: "Know what opponents might use against you and prepare defensive strategies", category: "Risk & Crisis", price_monthly: 895, price_display: "$895/month", features: ["Deep background research", "Social media audit", "Public records search", "Defense brief preparation", "Rapid response playbook"], popular: false },
  { id: "14", name: "Legal & Compliance Advisory", description: "Navigate municipal election laws and campaign finance regulations", category: "Risk & Crisis", price_monthly: 595, price_display: "$595/month", features: ["Election law guidance", "Finance compliance", "Filing deadline tracking", "Disclosure requirements", "Ethics consultation"], popular: false },
  { id: "15", name: "Local Media Relations", description: "Build relationships with community newspapers, radio, and local journalists", category: "Content Creation", price_monthly: 545, price_display: "$545/month", features: ["Community media outreach", "Local press releases", "Interview prep", "Hyperlocal storytelling"], popular: false },
  { id: "16", name: "Podcast & Video Appearance Booking", description: "Get booked on relevant podcasts and video shows to expand your reach", category: "Content Creation", price_monthly: 495, price_display: "$495/month", features: ["Podcast outreach", "Interview preparation", "Talking points development", "Media training", "Clip distribution"], popular: false },
  { id: "17", name: "Municipal Advertising Campaigns", description: "Run data-driven ad campaigns targeting Gen Z, Millennial, and persuasion-ready municipal voters", category: "Digital Marketing", price_monthly: 895, price_display: "$895/month + ad spend", features: ["Digital ads", "Geotargeting strategy", "A/B testing", "Performance analytics"], popular: true },
  { id: "18", name: "Google Ads Management", description: "Dominate search results when voters look for candidates in your area", category: "Digital Marketing", price_monthly: 595, price_display: "$595/month", features: ["Search campaigns", "Display advertising", "YouTube pre-roll", "Remarketing", "Conversion tracking"], popular: false },
  { id: "19", name: "Social Media Advertising", description: "Targeted ads on Facebook, Instagram, TikTok, and emerging platforms", category: "Digital Marketing", price_monthly: 695, price_display: "$695/month", features: ["Meta Ads management", "TikTok campaigns", "Audience targeting", "Creative development", "ROI optimization"], popular: false },
  { id: "20", name: "Door-to-Door Campaign Planning", description: "Optimize local canvassing with AI-powered route planning and voter contact strategies", category: "Analytics", price_monthly: 445, price_display: "$445/month", features: ["Route optimization", "Canvasser training", "Real-time tracking", "Voter contact records"], popular: false },
  { id: "21", name: "Canvassing Route Optimization", description: "AI-powered door-to-door route planning for maximum voter contact efficiency", category: "Analytics", price_monthly: 395, price_display: "$395/month", features: ["GPS route mapping", "Voter density analysis", "Time optimization", "Mobile app integration"], popular: false },
  { id: "22", name: "Volunteer Management System", description: "Recruit, train, and coordinate campaign volunteers effectively", category: "Analytics", price_monthly: 445, price_display: "$445/month", features: ["Volunteer database", "Shift scheduling", "Task assignment", "Performance tracking", "Communication tools"], popular: false },
  { id: "23", name: "Municipal Voter Management", description: "Comprehensive local voter database and municipal outreach management system", category: "Analytics", price_monthly: 745, price_display: "$745/month", features: ["Local voter database", "Contact management", "Canvassing tools", "Municipal GOTV operations"], popular: true },
  { id: "24", name: "Municipal Data Analytics", description: "Local voter turnout analysis, generational cohort modeling, and ward-level targeting insights", category: "Analytics", price_monthly: 745, price_display: "$745/month", features: ["Turnout trend analysis", "Demographic modeling", "Gen Z and Millennial voter cohorts", "Ward-level insights"], popular: false },
  { id: "25", name: "Predictive Voter Modeling", description: "AI-powered predictions of voter behavior and election outcomes", category: "Analytics", price_monthly: 995, price_display: "$995/month", features: ["Machine learning models", "Persuadability scoring", "Turnout predictions", "Resource allocation optimization"], popular: false },
  { id: "26", name: "Municipal Fundraising", description: "Maximize campaign contributions with proven fundraising strategies for local campaigns", category: "Digital Marketing", price_monthly: 695, price_display: "$695/month", features: ["Donor management", "Online fundraising", "Local event planning", "Grant writing"], popular: false },
  { id: "27", name: "Crowdfunding Campaign", description: "Launch viral crowdfunding campaigns that build momentum and community", category: "Digital Marketing", price_monthly: 495, price_display: "$495 one-time", features: ["Campaign page setup", "Reward tier strategy", "Email sequences", "Social promotion", "Stretch goals"], popular: false },
  { id: "28", name: "Global Expert Marketplace", description: "Access vetted political consultants and campaign experts worldwide", category: "Research", price_monthly: 395, price_display: "$395/month", features: ["Expert directory access", "Consultation matching", "Quality assurance", "Contract management"], popular: false },
  { id: "29", name: "Municipal Policy Advisory", description: "Expert guidance on progressive municipal policies that resonate with Gen Z and Millennial voters", category: "Research", price_monthly: 645, price_display: "$645/month", features: ["Policy research", "Position papers", "Municipal strategy", "Coalition building"], popular: false },
  { id: "30", name: "School Board Relations", description: "Build long-term civic turnout pipelines with education leaders, student councils, and campus organizers", category: "Research", price_monthly: 545, price_display: "$545/month", features: ["School board outreach", "Student council partnerships", "Civic education programs", "Youth leadership summits"], popular: false },
  { id: "65", name: "Opposition Research", description: "Comprehensive research on opponents to prepare defensive and offensive strategies", category: "Research", price_monthly: 895, price_display: "$895/month", features: ["Background investigations", "Public records search", "Social media deep dive", "Voting record analysis", "Vulnerability report"], popular: true },
  { id: "66", name: "Polling & Survey Research", description: "Professional polling to understand voter sentiment and track campaign progress", category: "Research", price_monthly: 1295, price_display: "$1,295/month", features: ["Custom survey design", "Statistical analysis", "Trend tracking", "Focus group coordination", "Actionable insights"], popular: true },
  { id: "67", name: "Issue Research & Briefings", description: "In-depth research on municipal issues to inform your policy positions", category: "Research", price_monthly: 495, price_display: "$495/month", features: ["Issue deep dives", "Fact-checking", "Talking points", "Debate preparation", "White papers"], popular: false },
  { id: "68", name: "Demographic Analysis", description: "Detailed analysis of your electorate's demographics, behaviors, and preferences", category: "Research", price_monthly: 595, price_display: "$595/month", features: ["Census data analysis", "Voting pattern research", "Community profiling", "Micro-targeting data", "Heat maps"], popular: false },
  { id: "69", name: "Competitive Intelligence", description: "Monitor and analyze competitor campaigns, messaging, and strategies", category: "Research", price_monthly: 745, price_display: "$745/month", features: ["Campaign monitoring", "Ad tracking", "Message analysis", "Strategy assessment", "Weekly briefings"], popular: false },
  { id: "70", name: "Legislative Research", description: "Track and analyze municipal legislation, bylaws, and council decisions", category: "Research", price_monthly: 445, price_display: "$445/month", features: ["Bylaw monitoring", "Council vote tracking", "Policy impact analysis", "Historical research", "Regulation summaries"], popular: false },
  { id: "71", name: "Public Records Research", description: "Access and analyze public records for campaign intelligence and transparency", category: "Research", price_monthly: 395, price_display: "$395/month", features: ["FOIA requests", "Property records", "Campaign finance data", "Court records", "Document analysis"], popular: false },
  { id: "72", name: "Academic & Think Tank Network", description: "Connect with academics and policy experts for credible endorsements and research", category: "Research", price_monthly: 545, price_display: "$545/month", features: ["Expert introductions", "Research partnerships", "Policy review", "Academic citations", "Speaking opportunities"], popular: false },
  
  // CRITICAL GAP SERVICES - REVENUE DRIVERS
  { id: "73", name: "Paid Media Management - Standard", description: "Facebook, Instagram, and Google Ads management for your campaign with budget optimization", category: "Digital Marketing", price_monthly: 2495, price_display: "$2,495/month + ad spend", features: ["Facebook/Instagram ad setup", "Google Search ads", "Audience targeting", "Weekly optimization", "Monthly reporting"], popular: true },
  { id: "73a", name: "Paid Media Management - Elite", description: "Premium paid media with TikTok, LinkedIn, YouTube, and advanced AI-powered optimization", category: "Digital Marketing", price_monthly: 4995, price_display: "$4,995/month + ad spend", features: ["All platform ads (Meta, Google, TikTok, LinkedIn, YouTube)", "AI budget allocation", "Real-time bidding optimization", "A/B testing automation", "Daily performance reports", "Conversion tracking"], popular: true },
  
  { id: "74", name: "Voter Data Enrichment - Standard", description: "Municipal voter database with demographic targeting and basic segmentation", category: "Analytics", price_monthly: 395, price_display: "$395/month", features: ["Voter database access", "Demographic segmentation", "Email append", "Phone validation", "100K records/month"], popular: true },
  { id: "74a", name: "Voter Data Enrichment - Elite", description: "Premium voter data with behavioral segmentation, predictive scoring, and microsegmentation", category: "Analytics", price_monthly: 1295, price_display: "$1,295/month", features: ["Complete voter universe (1M+ records)", "Behavioral segmentation", "Predictive persuasion scoring", "Issue-based microsegmentation", "Donor propensity modeling", "Real-time data feeds"], popular: true },
  
  { id: "75", name: "Phone Banking System - Standard", description: "Professional phone banking platform with caller scripts and reporting", category: "Field Operations", price_monthly: 595, price_display: "$595/month", features: ["Calling platform", "Pre-recorded scripts", "Call recording", "Real-time reporting", "50 concurrent callers"], popular: true },
  { id: "75a", name: "Phone Banking System - Elite", description: "Advanced phone banking with AI transcription, sentiment analysis, and optimization", category: "Field Operations", price_monthly: 1595, price_display: "$1,595/month", features: ["Unlimited concurrent callers", "AI call transcription", "Sentiment analysis", "Auto dialing", "Live call coaching", "Performance leaderboards", "Predictive dialing"], popular: true },
  
  { id: "76", name: "Debate Prep & Media Training", description: "Professional coaching for debates, interviews, and media appearances", category: "Content Creation", price_monthly: 1495, price_display: "$1,495/session", features: ["Debate simulation", "Message coaching", "Interview prep", "Difficult question responses", "Body language training"], popular: true },
  { id: "76a", name: "Debate Prep & Media Training - Executive", description: "Premium executive coaching with video analysis, opposition briefings, and crisis scenarios", category: "Content Creation", price_monthly: 3495, price_display: "$3,495/session", features: ["Multiple debate simulations", "Video analysis & playback", "Opposition research briefing", "Crisis scenario training", "Media interview coaching", "Post-debate analysis"], popular: true },
  
  { id: "77", name: "Campaign Video Production - Standard", description: "Professional campaign videos including testimonials, issue explainers, and promotional content", category: "Content Creation", price_monthly: 1995, price_display: "$1,995/month", features: ["Monthly video production", "2-3 videos/month", "Social media edits", "Basic animation", "HD delivery"], popular: true },
  { id: "77a", name: "Campaign Video Production - Elite", description: "Premium video production with 4K delivery, drone footage, animation, and broadcast quality", category: "Content Creation", price_monthly: 4495, price_display: "$4,495/month", features: ["Unlimited video production", "4K broadcast quality", "Drone footage", "3D animation", "Motion graphics", "Color grading", "Sound design", "Weekly delivery"], popular: true },
  
  { id: "78", name: "Campaign Branding Pro - Standard", description: "Comprehensive branding package including identity, guidelines, and collateral design", category: "Design", price_monthly: 1295, price_display: "$1,295 one-time", features: ["Logo design (5 concepts)", "Brand guidelines document", "Social media templates", "Email templates", "Print collateral kit"], popular: true },
  { id: "78a", name: "Campaign Branding Pro - Elite", description: "Premium branding with custom typography, brand voice development, and comprehensive guidelines", category: "Design", price_monthly: 2495, price_display: "$2,495 one-time", features: ["Logo design (10 concepts, unlimited revisions)", "300-page brand guidelines", "Custom typography", "Brand voice & messaging guidelines", "All digital & print templates", "Style guide animations", "Brand evolution planning"], popular: true },
  
  { id: "79", name: "Campaign Website Pro - Enhanced", description: "Website Pro with e-commerce, advanced CRM integration, and multi-language support", category: "Web Development", price_monthly: 2495, price_display: "$2,495 one-time", features: ["All Website Pro features", "Multi-language support", "Advanced CRM integration", "Donation recurring billing", "Volunteer gamification", "Real-time analytics"], popular: false },
  { id: "79a", name: "Campaign Website Elite", description: "Premium website with mobile app companion, AI chatbot, and enterprise features", category: "Web Development", price_monthly: 4995, price_display: "$4,995 one-time", features: ["All Enhanced features", "Mobile app (iOS/Android)", "AI voter chatbot", "Multi-currency support", "API integrations", "White-label ready", "1-year hosting/support"], popular: false },
  
  { id: "80", name: "Press Release Distribution", description: "Professional press release writing and distribution to local media outlets", category: "Content Creation", price_monthly: 595, price_display: "$595/release", features: ["Professional writing", "Local media distribution", "50+ media contacts", "Newswire distribution", "Follow-up tracking"], popular: false },
  
  { id: "81", name: "Municipal Analytics Dashboard", description: "Custom real-time dashboard tracking campaign KPIs, spending, and performance metrics", category: "Analytics", price_monthly: 895, price_display: "$895/month", features: ["Real-time KPI tracking", "Multi-channel integration", "Spending dashboard", "Voter contact tracking", "Donation tracking", "Custom reports"], popular: true },
  
  { id: "31", name: "Municipal Event Management", description: "Plan and execute impactful local campaign events that mobilize supporters", category: "Content Creation", price_monthly: 495, price_display: "$495/month", features: ["Event planning", "Venue coordination", "Logistics management", "Post-event analysis"], popular: false },
  { id: "32", name: "Community Engagement", description: "Foster meaningful relationships with local communities and organizations", category: "Content Creation", price_monthly: 445, price_display: "$445/month", features: ["Stakeholder mapping", "Partnership development", "Town halls", "Feedback systems"], popular: false },
  { id: "33", name: "Youth Voter Outreach", description: "Specialized strategies for engaging Gen Z voters and building first-time turnout momentum", category: "Digital Marketing", price_monthly: 595, price_display: "$595/month", features: ["18-24 demographic targeting", "Campus and school engagement", "Youth ambassador network", "Social media activation"], popular: true },
  { id: "34", name: "Gen Z Engagement Strategy", description: "AI-powered strategies to authentically connect with Gen Z voters (1997-2012)", category: "Digital Marketing", price_monthly: 695, price_display: "$695/month", features: ["TikTok & Instagram Reels content", "Meme-driven messaging", "Discord/Twitch community building", "Climate & social justice positioning"], popular: true },
  { id: "35", name: "Millennial Mobilization", description: "Data-driven approaches to engage Millennial voters (1981-1996) on key issues", category: "Digital Marketing", price_monthly: 745, price_display: "$745/month", features: ["Housing affordability messaging", "Student debt relief positioning", "Work-life balance advocacy", "Facebook & LinkedIn targeting"], popular: false },
  
  // CAMPAIGN MEDIA SERVICES - PRODUCTION & CREATIVE
  { id: "82", name: "Creative Direction & Art Direction", description: "Professional creative direction for all campaign materials, ensuring consistent visual storytelling", category: "Design", price_monthly: 1295, price_display: "$1,295/month", features: ["Creative strategy", "Visual direction", "Style guides", "Design oversight", "Material review & feedback"], popular: true },
  
  { id: "83", name: "Event Media Coverage & Live Streaming", description: "Professional photography, videography, and live streaming for campaign events and town halls", category: "Content Creation", price_monthly: 1595, price_display: "$1,595/month", features: ["Event photography (high-res)", "Event videography (4K)", "Live stream setup", "Social media clips", "Post-event editing"], popular: true },
  
  { id: "84", name: "Podcast Production & Distribution", description: "Full podcast production including recording, editing, and distribution across all platforms", category: "Content Creation", price_monthly: 1295, price_display: "$1,295/month", features: ["Episode planning & scripts", "Professional recording", "Audio editing & mixing", "Distribution to all platforms", "Show artwork & branding"], popular: true },
  
  { id: "85", name: "Podcast Production - Elite", description: "Premium podcast production with interviews, graphics, analytics, and multi-platform promotion", category: "Content Creation", price_monthly: 2495, price_display: "$2,495/month", features: ["Unlimited episode production", "Guest interview coordination", "Video podcast creation", "Social media graphics per episode", "Analytics & listener reports", "Multi-platform scheduling"], popular: true },
  
  { id: "86", name: "Event Production & Staging", description: "End-to-end event production including technical setup, lighting, sound, and stage design", category: "Content Creation", price_monthly: 2495, price_display: "$2,495/month", features: ["Technical production planning", "Lighting & sound setup", "Stage design", "Video/slide integration", "Sound check & rehearsal"], popular: false },
  
  { id: "87", name: "Content Studio Access", description: "24/7 access to professional content creation studio with green screen, lighting, and editing", category: "Content Creation", price_monthly: 995, price_display: "$995/month", features: ["Studio space rental", "Green screen setup", "Professional lighting", "Audio recording booth", "Post-production software access"], popular: false },
  
  { id: "88", name: "Content Calendar & Strategy", description: "AI-powered content calendar with editorial strategy, audience insights, and performance optimization", category: "Content Creation", price_monthly: 795, price_display: "$795/month", features: ["Content planning (12 weeks)", "AI topic generation", "Platform-specific optimization", "Scheduling integration", "Performance dashboards"], popular: true },
  
  { id: "89", name: "Social Media Content Production", description: "High-volume social media content creation including graphics, videos, and copy", category: "Digital Marketing", price_monthly: 1895, price_display: "$1,895/month", features: ["50+ posts/month", "Reels & TikToks", "Story content", "Carousel posts", "Audience engagement"], popular: true },
  
  { id: "90", name: "Social Media Content Production - Elite", description: "Premium social media production with unlimited posts, influencer coordination, and viral strategies", category: "Digital Marketing", price_monthly: 3495, price_display: "$3,495/month", features: ["Unlimited content", "Influencer partnerships", "Viral trend optimization", "Community management", "Real-time monitoring", "Crisis response"], popular: true },
]

export const PUBLIC_SERVICE_STACKS: PublicServiceStack[] = [
  {
    id: "design-branding",
    badge: "Design & Branding",
    title: "Municipal Branding & Identity",
    description: "Build a compelling local political brand that resonates with your community. Includes logo design, brand guidelines, social media graphics, and print materials.",
    animation: "design",
    gradientClass: "from-purple-900/80 via-purple-900/40 to-transparent",
    textClass: "text-purple-100/80",
    badgeClass: "border-purple-400/30 bg-purple-500/20 text-purple-300",
    metrics: [
      { value: "$395", label: "Logo Design", accentClass: "text-white" },
      { value: "$495", label: "Full Branding", accentClass: "text-cyan-400" },
      { value: "8+", label: "Services", accentClass: "text-green-400" },
    ],
  },
  {
    id: "seo-digital-optimization",
    badge: "SEO & Digital Optimization",
    title: "Search Engine Dominance",
    description: "Rank higher in Google, optimize for AI assistants, and ensure ChatGPT references you accurately. Includes traditional SEO, AEO, GEO, and Knowledge Panel setup.",
    animation: "seo",
    gradientClass: "from-blue-900/80 via-blue-900/40 to-transparent",
    textClass: "text-blue-100/80",
    badgeClass: "border-blue-400/30 bg-blue-500/20 text-blue-300",
    metrics: [
      { value: "$695", label: "SEO/month", accentClass: "text-white" },
      { value: "$895", label: "GEO/month", accentClass: "text-cyan-400" },
      { value: "$995", label: "Knowledge Panel", accentClass: "text-yellow-400" },
    ],
  },
  {
    id: "identity-reputation",
    badge: "Identity & Reputation",
    title: "Wikipedia & Reputation Management",
    description: "Establish credibility with Wikipedia presence, protect your online reputation, and build a cohesive digital identity across all platforms.",
    animation: "reputation",
    gradientClass: "from-indigo-900/80 via-indigo-900/40 to-transparent",
    textClass: "text-indigo-100/80",
    badgeClass: "border-indigo-400/30 bg-indigo-500/20 text-indigo-300",
    metrics: [
      { value: "$1,495", label: "Wikipedia", accentClass: "text-white" },
      { value: "$645", label: "ORM/month", accentClass: "text-cyan-400" },
      { value: "6+", label: "Services", accentClass: "text-green-400" },
    ],
  },
  {
    id: "web-digital-presence",
    badge: "Web & Digital Presence",
    title: "Campaign Website & Digital Platform",
    description: "High-converting campaign websites with donation systems, volunteer portals, event management, and mobile apps to power your digital campaign.",
    animation: "web",
    gradientClass: "from-cyan-900/80 via-cyan-900/40 to-transparent",
    textClass: "text-cyan-100/80",
    badgeClass: "border-cyan-400/30 bg-cyan-500/20 text-cyan-300",
    metrics: [
      { value: "$795", label: "Digital/month", accentClass: "text-white" },
      { value: "$1,295", label: "Website Pro", accentClass: "text-cyan-400" },
      { value: "9+", label: "Services", accentClass: "text-yellow-400" },
    ],
  },
  {
    id: "crisis-risk",
    badge: "Crisis & Risk Management",
    title: "24/7 Crisis Response & Protection",
    description: "Rapid response to reputational threats, opposition research, political risk assessment, and legal compliance advisory to protect your campaign.",
    animation: "crisis",
    gradientClass: "from-red-900/80 via-red-900/40 to-transparent",
    textClass: "text-red-100/80",
    badgeClass: "border-red-400/30 bg-red-500/20 text-red-300",
    metrics: [
      { value: "$995", label: "Crisis/month", accentClass: "text-white" },
      { value: "$895", label: "Oppo Research", accentClass: "text-cyan-400" },
      { value: "24/7", label: "Monitoring", accentClass: "text-yellow-400" },
    ],
  },
  {
    id: "media-content",
    badge: "Media & Content",
    title: "Local Media Relations & PR",
    description: "Build relationships with community newspapers, radio, podcasts, and local journalists. Get booked on shows and control your narrative.",
    animation: "media",
    gradientClass: "from-violet-900/80 via-violet-900/40 to-transparent",
    textClass: "text-violet-100/80",
    badgeClass: "border-violet-400/30 bg-violet-500/20 text-violet-300",
    metrics: [
      { value: "$545", label: "Media/month", accentClass: "text-white" },
      { value: "$495", label: "Podcasts", accentClass: "text-cyan-400" },
      { value: "50+", label: "Media Contacts", accentClass: "text-green-400" },
    ],
  },
  {
    id: "analytics-data",
    badge: "Voter Analytics & Data",
    title: "AI-Powered Voter Intelligence",
    description: "Comprehensive voter database, predictive modeling, demographic analysis, and generational turnout projections with machine learning.",
    animation: "analytics",
    gradientClass: "from-emerald-900/80 via-emerald-900/40 to-transparent",
    textClass: "text-emerald-100/80",
    badgeClass: "border-emerald-400/30 bg-emerald-500/20 text-emerald-300",
    metrics: [
      { value: "$745", label: "Data/month", accentClass: "text-white" },
      { value: "$995", label: "Predictive AI", accentClass: "text-cyan-400" },
      { value: "1M+", label: "Voter Records", accentClass: "text-yellow-400" },
    ],
  },
  {
    id: "field-operations",
    badge: "Field Operations",
    title: "Door-to-Door, Volunteer & GOTV Operations",
    description: "AI-powered route optimization for canvassing, volunteer recruitment and coordination, voter-universe management, and municipal GOTV execution for maximum turnout.",
    animation: "field",
    gradientClass: "from-orange-900/80 via-orange-900/40 to-transparent",
    textClass: "text-orange-100/80",
    badgeClass: "border-orange-400/30 bg-orange-500/20 text-orange-300",
    metrics: [
      { value: "$445", label: "Planning/month", accentClass: "text-white" },
      { value: "$745", label: "GOTV/month", accentClass: "text-cyan-400" },
      { value: "3x", label: "Turnout Ops", accentClass: "text-green-400" },
    ],
  },
  {
    id: "youth-engagement",
    badge: "Gen Z & Millennial Voters",
    title: "Gen Z & Millennial Voter Mobilization",
    description: "Specialized strategies for engaging Gen Z voters, converting Millennial households, and building turnout momentum with TikTok content, ambassador networks, and community-based organizing.",
    animation: "youth",
    gradientClass: "from-pink-900/80 via-pink-900/40 to-transparent",
    textClass: "text-pink-100/80",
    badgeClass: "border-pink-400/30 bg-pink-500/20 text-pink-300",
    metrics: [
      { value: "$595", label: "Gen Z/month", accentClass: "text-white" },
      { value: "$695", label: "Gen Z/month", accentClass: "text-cyan-400" },
      { value: "$745", label: "Millennial/month", accentClass: "text-yellow-400" },
    ],
  },
  {
    id: "fundraising-donations",
    badge: "Fundraising & Donations",
    title: "Campaign Fundraising & Crowdfunding",
    description: "Maximize campaign contributions with proven fundraising strategies, online donation systems, crowdfunding campaigns, and donor management.",
    animation: "fundraising",
    gradientClass: "from-green-900/80 via-green-900/40 to-transparent",
    textClass: "text-green-100/80",
    badgeClass: "border-green-400/30 bg-green-500/20 text-green-300",
    metrics: [
      { value: "$695", label: "Fundraising", accentClass: "text-white" },
      { value: "$495", label: "Crowdfunding", accentClass: "text-cyan-400" },
      { value: "$50K+", label: "Avg Raised", accentClass: "text-yellow-400" },
    ],
  },
  {
    id: "content-creation",
    badge: "Content Creation",
    title: "Local Messaging & Communication",
    description: "Craft powerful messages that connect with Gen Z and Millennial municipal voters. Includes speech writing, social media content, and crisis communication.",
    animation: "content",
    gradientClass: "from-fuchsia-900/80 via-fuchsia-900/40 to-transparent",
    textClass: "text-fuchsia-100/80",
    badgeClass: "border-fuchsia-400/30 bg-fuchsia-500/20 text-fuchsia-300",
    metrics: [
      { value: "$595", label: "Content/month", accentClass: "text-white" },
      { value: "$495", label: "Copywriting", accentClass: "text-cyan-400" },
      { value: "10+", label: "Services", accentClass: "text-yellow-400" },
    ],
  },
  {
    id: "digital-marketing",
    badge: "Digital Marketing",
    title: "Campaign Digital Advertising",
    description: "Targeted digital ad campaigns across Google, Facebook, Instagram, and TikTok to reach voters where they spend their time.",
    animation: "digital",
    gradientClass: "from-sky-900/80 via-sky-900/40 to-transparent",
    textClass: "text-sky-100/80",
    badgeClass: "border-sky-400/30 bg-sky-500/20 text-sky-300",
    metrics: [
      { value: "$795", label: "Ads/month", accentClass: "text-white" },
      { value: "$595", label: "Social/month", accentClass: "text-cyan-400" },
      { value: "5x", label: "Avg ROI", accentClass: "text-green-400" },
    ],
  },
  {
    id: "research-intelligence",
    badge: "Research & Intelligence",
    title: "Opposition Research & Voter Analysis",
    description: "Deep-dive research on opponents, voter sentiment analysis, policy research, and strategic intelligence to inform your campaign decisions.",
    animation: "research",
    gradientClass: "from-amber-900/80 via-amber-900/40 to-transparent",
    textClass: "text-amber-100/80",
    badgeClass: "border-amber-400/30 bg-amber-500/20 text-amber-300",
    metrics: [
      { value: "$895", label: "Research/month", accentClass: "text-white" },
      { value: "$695", label: "Polling", accentClass: "text-cyan-400" },
      { value: "100+", label: "Data Points", accentClass: "text-yellow-400" },
    ],
  },
  {
    id: "video-production",
    badge: "Video Production",
    title: "Campaign Video & Visual Content",
    description: "Professional campaign videos, social media reels, debate prep recordings, testimonial videos, and live event streaming.",
    animation: "video",
    gradientClass: "from-rose-900/80 via-rose-900/40 to-transparent",
    textClass: "text-rose-100/80",
    badgeClass: "border-rose-400/30 bg-rose-500/20 text-rose-300",
    metrics: [
      { value: "$1,495", label: "Video/month", accentClass: "text-white" },
      { value: "$495", label: "Reels/month", accentClass: "text-cyan-400" },
      { value: "4K", label: "Quality", accentClass: "text-yellow-400" },
    ],
  },
  {
    id: "email-marketing",
    badge: "Email Marketing",
    title: "Voter Email Outreach & Automation",
    description: "Automated email campaigns for voter outreach, fundraising appeals, event invitations, and newsletter distribution with advanced segmentation.",
    animation: "email",
    gradientClass: "from-lime-900/80 via-lime-900/40 to-transparent",
    textClass: "text-lime-100/80",
    badgeClass: "border-lime-400/30 bg-lime-500/20 text-lime-300",
    metrics: [
      { value: "$445", label: "Email/month", accentClass: "text-white" },
      { value: "$295", label: "Automation", accentClass: "text-cyan-400" },
      { value: "45%", label: "Open Rate", accentClass: "text-green-400" },
    ],
  },
]

const BLUEPRINT_METRICS: Record<string, { benchmarkType: string; election: string; targetedVoters: number; expectedVotes: number }> = {
  "top-tier-mayor": { benchmarkType: "official benchmark", election: "2023 Toronto By-Election for Mayor", targetedVoters: 450000, expectedVotes: 250000 },
  "lean-mayor": { benchmarkType: "modeled package", election: "Smaller-city mayoral run", targetedVoters: 65000, expectedVotes: 18000 },
  "top-tier-councillor": { benchmarkType: "modeled package", election: "Competitive urban ward race", targetedVoters: 22000, expectedVotes: 7500 },
  "lean-councillor": { benchmarkType: "modeled package", election: "Lean local ward race", targetedVoters: 9000, expectedVotes: 2600 },
}

const STACK_ID_BY_CATEGORY: Record<string, PublicServiceStack["id"]> = {
  Design: "design-branding",
  "SEO & Optimization": "seo-digital-optimization",
  Reputation: "identity-reputation",
  "Web Development": "web-digital-presence",
  "Risk & Crisis": "crisis-risk",
  "Content Creation": "content-creation",
  "Digital Marketing": "digital-marketing",
  Analytics: "analytics-data",
  Research: "research-intelligence",
  "Video Production": "video-production",
  "Email Marketing": "email-marketing",
}

const STACK_HIGHLIGHT_SERVICE_IDS: Record<CampaignStackId, string[]> = {
  "design-branding": ["36", "37", "38"],
  "seo-digital-optimization": ["3", "4", "5"],
  "identity-reputation": ["51", "54", "8"],
  "web-digital-presence": ["10", "58", "57"],
  "crisis-risk": ["11", "14", "13"],
  "media-content": ["15", "16", "31"],
  "analytics-data": ["23", "24", "25"],
  "field-operations": ["20", "21", "22", "23"],
  "youth-engagement": ["33", "34", "35"],
  "fundraising-donations": ["26", "27", "61"],
  "content-creation": ["2", "15", "31"],
  "digital-marketing": ["17", "19", "18"],
  "research-intelligence": ["65", "66", "67"],
  "video-production": ["42", "16", "31"],
  "email-marketing": ["61", "40", "26"],
}

function isLaunchProjectLabel(priceDisplay: string): boolean {
  return /one-time|\/page/i.test(priceDisplay.toLowerCase())
}

export function getCampaignServiceById(serviceId: string): CampaignServiceDefinition | undefined {
  return CAMPAIGN_SERVICE_CATALOG.find((service) => service.id === serviceId)
}

export function getCampaignServicesByIds(serviceIds: string[]): CampaignServiceDefinition[] {
  return serviceIds
    .map((serviceId) => getCampaignServiceById(serviceId))
    .filter((service): service is CampaignServiceDefinition => Boolean(service))
}

export function getCampaignCommercialModel(service: CampaignServiceDefinition): CampaignCommercialModel {
  return isLaunchProjectLabel(service.price_display) ? "launch-project" : "monthly-retainer"
}

export function getCampaignStackForService(service: CampaignServiceDefinition): PublicServiceStack | undefined {
  const stackId = STACK_ID_BY_CATEGORY[service.category]
  return PUBLIC_SERVICE_STACKS.find((stack) => stack.id === stackId)
}

export function getCampaignStackById(stackId: CampaignStackId): PublicServiceStack | undefined {
  return PUBLIC_SERVICE_STACKS.find((stack) => stack.id === stackId)
}

export function slugifyCampaignLabel(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function getCampaignServiceBySlug(slug: string): CampaignServiceDefinition | undefined {
  return CAMPAIGN_SERVICE_CATALOG.find((service) => slugifyCampaignLabel(service.name) === slug)
}

export function getCampaignStackBySlug(slug: string): PublicServiceStack | undefined {
  return PUBLIC_SERVICE_STACKS.find((stack) => slugifyCampaignLabel(stack.title) === slug || stack.id === slug)
}

export function getCampaignServicesForStack(stackId: CampaignStackId): CampaignServiceDefinition[] {
  return getCampaignServicesByIds(STACK_HIGHLIGHT_SERVICE_IDS[stackId] ?? [])
}

export function getCampaignStackHighlights(stackIds: CampaignStackId[]): CampaignServiceDefinition[] {
  const uniqueServiceIds = Array.from(new Set(stackIds.flatMap((stackId) => STACK_HIGHLIGHT_SERVICE_IDS[stackId] ?? [])))
  return getCampaignServicesByIds(uniqueServiceIds)
}

export function getCampaignBlueprintForCandidate(candidateName: string): DerivedCampaignBlueprint | undefined {
  return FULL_CAMPAIGN_BLUEPRINTS.find((blueprint) => blueprint.candidateName === candidateName)
}

export const FULL_CAMPAIGN_BLUEPRINTS: DerivedCampaignBlueprint[] = CAMPAIGN_PACKAGE_PRESETS.map((preset) => {
  const metrics = BLUEPRINT_METRICS[preset.id]
  const monthlyCoreCents = getCampaignServicesByIds(preset.mustHaveMonthlyRetainers).reduce((sum, service) => sum + (service.price_monthly * 100), 0)
  const oneTimeLaunchCents = getCampaignServicesByIds(preset.oneTimeLaunchWork).reduce((sum, service) => sum + (service.price_monthly * 100), 0)
  const addOnValueCents = getCampaignServicesByIds(preset.recommendedAddOns).reduce((sum, service) => sum + (service.price_monthly * 100), 0)
  const fullCampaignValueCents = monthlyCoreCents * preset.cycleMonths + oneTimeLaunchCents + addOnValueCents

  return {
    id: preset.id,
    label: preset.label,
    candidateName: preset.demoCandidateName,
    benchmarkType: metrics.benchmarkType,
    election: metrics.election,
    cycleMonths: preset.cycleMonths,
    targetedVoters: metrics.targetedVoters,
    expectedVotes: metrics.expectedVotes,
    monthlyCoreCents,
    oneTimeLaunchCents,
    addOnValueCents,
    fullCampaignValueCents,
    mustHaveServices: getCampaignServicesByIds(preset.mustHaveMonthlyRetainers).map((service) => service.name),
    recommendedServices: getCampaignServicesByIds(preset.recommendedAddOns).map((service) => service.name),
    gapAnalysis: preset.gapAnalysis.map((gap) => ({
      area: gap.area,
      gap: gap.summary,
      subscription: getCampaignServicesByIds(gap.recommendedServiceIds).map((service) => service.name).join(", "),
    })),
    addOnSubscriptions: getCampaignServicesByIds(preset.recommendedAddOns).map((service) => service.name),
    costPerTargetedVoterCents: Math.round(fullCampaignValueCents / metrics.targetedVoters),
    costPerExpectedVoteCents: Math.round(fullCampaignValueCents / metrics.expectedVotes),
  }
})