import Link from "next/link"
import { Check, MapPin, Users, Vote, BarChart3 } from "lucide-react"
import { AnimatedServiceBackground } from "@/components/animated-service-background"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#06080c] text-white">
      {/* Gradient Line */}
      <div className="h-1.5 bg-gradient-to-r from-blue-600 via-cyan-500 via-purple-600 to-pink-500" />

      {/* Hero Section */}
      <section className="container max-w-6xl mx-auto px-4 py-16">
        <div className="bg-[#0b0f16] border border-white/10 rounded-3xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600/20 via-purple-600/10 to-transparent border-b border-white/10 p-6">
            <div className="text-xs tracking-[0.18em] uppercase text-white/80 mb-3">
              7 Provinces | 1,690 Municipalities Execution Package
            </div>
            <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tight">
              THE FUTURE
              <br />
              VOTES NOW.
            </h1>
          </div>
          <div className="p-6">
            <p className="text-white/70 mb-4 leading-relaxed">
              Canada's largest concentration of Gen Z and Millennial voters lives across{" "}
              <strong className="text-white">1,690 municipalities</strong> in Ontario, British Columbia, Saskatchewan,
              Manitoba, PEI, New Brunswick, and Northwest Territories. Municipal elections are the most direct
              governance layer—yet turnout decline and low-information voting persist across every province.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-xs uppercase tracking-wide">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                Turnout Data
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-xs uppercase tracking-wide">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                Gen Z + Millennial turnout
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="container max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: "4:1", label: "Senior/Youth Ratio" },
            { value: "72%", label: "Info Friction" },
            { value: "32.9%", label: "Turnout Floor", source: "Ontario AMO 2022" },
            { value: "1,690", label: "Municipalities" },
          ].map((stat, i) => (
            <div key={i} className="bg-[#0d121b] border border-white/10 rounded-2xl p-6 text-center">
              <div className="text-4xl font-black mb-2">{stat.value}</div>
              <div className="text-[10px] text-white/70 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Policy Goals */}
      <section className="container max-w-6xl mx-auto px-4 py-16">
        <div className="max-w-3xl">
          <div className="inline-block border-2 border-yellow-500 rounded-full px-6 py-2 mb-8">
            <span className="text-yellow-500 font-bold">• For Municipal Elections 2026 •</span>
          </div>
          <p className="text-2xl mb-6 text-gray-300 font-medium">
            We are a new generation reclaiming our democracy.
            <br />
            We're rewriting the rules to secure our future.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-xl">
              <Check className="h-7 w-7 text-blue-500 flex-shrink-0" strokeWidth={3} />
              <span className="font-bold text-blue-400">Win Gen Z and Millennial voters</span>
            </div>
            <div className="flex items-center gap-4 text-xl">
              <Check className="h-7 w-7 text-blue-500 flex-shrink-0" strokeWidth={3} />
              <span className="font-bold text-blue-400">60% under 40 in every legislature</span>
            </div>
            <div className="flex items-center gap-4 text-xl">
              <Check className="h-7 w-7 text-blue-500 flex-shrink-0" strokeWidth={3} />
              <span className="font-bold text-blue-400">Next-generation municipal councils</span>
            </div>
          </div>
        </div>
      </section>

      {/* BCG Matrix Section */}
      <section className="container max-w-6xl mx-auto px-4 py-16 border-t border-white/10">
        <div className="bg-[#0b0f16] border border-white/10 rounded-3xl overflow-hidden">
          <div className="bg-[#0d121b] border-b border-white/10 p-6 flex justify-between items-center">
            <h2 className="text-sm font-bold tracking-[0.18em] uppercase">Future Voter Segmentation (BCG Matrix)</h2>
            <span className="px-4 py-2 rounded-full border border-purple-600/40 bg-purple-600/20 text-white/80 text-[11px] uppercase tracking-wider">
              Segment Analysis
            </span>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-0 border border-white/10 rounded-2xl overflow-hidden">
              {/* Question Marks */}
              <div className="bg-[#1a2d4d] p-12 border-r border-b border-white/10 text-center">
                <div className="text-[11px] tracking-wider uppercase text-white/90 font-bold mb-6">QUESTION MARKS</div>
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-purple-600 border-2 border-purple-400">
                  <div>
                    <div className="text-sm font-bold">Gen Alpha</div>
                    <div className="text-xs text-white/75">(16-18)</div>
                  </div>
                </div>
              </div>
              {/* Stars */}
              <div className="bg-[#1a3a5d] p-12 border-b border-white/10 text-center">
                <div className="text-[11px] tracking-wider uppercase text-white/90 font-bold mb-6">STARS</div>
                <div className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-blue-600 border-2 border-blue-400">
                  <div>
                    <div className="text-sm font-bold">Gen Z +</div>
                    <div className="text-sm font-bold">Millennials</div>
                  </div>
                </div>
              </div>
              {/* Cash Cows */}
              <div className="bg-[#2d3339] p-12 border-r border-white/10 text-center">
                <div className="text-[11px] tracking-wider uppercase text-white/90 font-bold mb-6">CASH COWS</div>
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-600 border-2 border-gray-400">
                  <div className="text-sm font-bold">Gen X</div>
                </div>
              </div>
              {/* Pets */}
              <div className="bg-[#3d2327] p-12 text-center">
                <div className="text-[11px] tracking-wider uppercase text-pink-500 font-bold mb-6">PETS</div>
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-900 border-2 border-red-700">
                  <div className="text-sm font-bold">Boomers</div>
                </div>
              </div>
            </div>
            <p className="mt-4 text-center text-xs text-white/60 leading-relaxed">
              Use for messaging prioritization: Stars = mobilize + convert; Question Marks = onboarding + civic
              literacy;
              <br />
              Cash Cows = retention + stability; Pets = low growth.
            </p>
          </div>
        </div>
      </section>

      {/* Generational Turnout Section */}
      <section className="container max-w-6xl mx-auto px-4 py-16 border-t border-white/10">
        <div className="bg-[#0b0f16] border border-white/10 rounded-3xl overflow-hidden">
          <div className="bg-[#0d121b] border-b border-white/10 p-6 flex justify-between items-center">
            <h2 className="text-sm font-bold tracking-[0.18em] uppercase">03. Generational Turnout Engine</h2>
            <span className="px-4 py-2 rounded-full border border-purple-600/40 bg-purple-600/20 text-white/80 text-[11px] uppercase tracking-wider">
              Voter Growth Engine
            </span>
          </div>
          <div className="p-6">
            <div className="bg-gradient-to-r from-blue-600/10 to-transparent border border-white/10 rounded-xl p-6 mb-6">
              <div className="font-bold text-lg mb-2">The Pivot:</div>
              <p className="text-white/70">
                Stop treating municipal campaigns like generic persuasion programs. Build around Gen Z voter acquisition,
                Millennial household conversion, and repeat turnout systems that compound across neighbourhoods.
              </p>
            </div>
            <div className="text-center py-12">
              <div className="text-6xl font-black mb-4 bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
                18-42
              </div>
              <div className="text-xl font-bold tracking-wider">CORE GROWTH VOTER BAND</div>
              <p className="mt-4 text-white/60">
                Gen Z plus Millennial voters are where municipal campaigns earn durable turnout growth, issue traction, and volunteer energy.
              </p>
              <p className="mt-2 text-[10px] text-white/40">
                Use the demographic and municipal data pages for policy-specific and turnout-specific research detail.
              </p>
            </div>
            <div className="text-center mt-8">
              <Link
                href="/simulation"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold rounded-xl transition uppercase tracking-wider text-sm"
              >
                <Vote className="h-5 w-5" />
                View Turnout Simulation
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="container max-w-6xl mx-auto px-4 py-16 border-t border-white/10">
        <h2 className="text-4xl md:text-5xl font-black mb-12 tracking-tight text-center">PLATFORM FEATURES</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Link
            href="/candidates"
            className="bg-[#0b0f16] border border-white/10 rounded-2xl p-8 hover:border-blue-500/50 transition group"
          >
            <Users className="h-12 w-12 text-blue-500 mb-4 group-hover:scale-110 transition" />
            <h3 className="text-xl font-bold mb-2">Verified Candidate Registry</h3>
            <p className="text-white/60 text-sm">
              Browse and register next-generation candidates across all 1,690 municipalities in 7 provinces.
            </p>
          </Link>
          <Link
            href="/governance"
            className="bg-[#0b0f16] border border-white/10 rounded-2xl p-8 hover:border-blue-500/50 transition group"
          >
            <Vote className="h-12 w-12 text-blue-500 mb-4 group-hover:scale-110 transition" />
            <h3 className="text-xl font-bold mb-2">DAO Governance</h3>
            <p className="text-white/60 text-sm">
              Create proposals, vote on municipal initiatives, and shape community decisions democratically.
            </p>
          </Link>
          <Link
            href="/municipalities"
            className="bg-[#0b0f16] border border-white/10 rounded-2xl p-8 hover:border-blue-500/50 transition group"
          >
            <BarChart3 className="h-12 w-12 text-blue-500 mb-4 group-hover:scale-110 transition" />
            <h3 className="text-xl font-bold mb-2">Municipal Analytics</h3>
            <p className="text-white/60 text-sm">
              Track voter turnout trends, demographics, and engagement metrics across all communities.
            </p>
          </Link>
        </div>
      </section>

      {/* Track the Old Guard */}
      <section className="container max-w-6xl mx-auto px-4 py-16 border-t border-white/10">
        <div className="max-w-4xl">
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">TRACK THE OLD GUARD</h2>
          <p className="text-lg text-gray-400 mb-12 max-w-2xl">
            Monitor live data on the age demographics of municipal councils across Canada—and hold the old guard
            accountable.
          </p>
          <div className="space-y-6">
            <div className="text-sm text-gray-500 mb-4 font-bold uppercase tracking-wider">
              Example: Municipal Councillors (1,690 Municipalities)
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="w-24 text-sm text-white/60">60+</div>
                <div className="flex-1 bg-gray-900 rounded-lg h-14 overflow-hidden">
                  <div
                    className="bg-blue-700 h-full flex items-center justify-end pr-4 transition-all"
                    style={{ width: "58%" }}
                  >
                    <span className="font-black text-white text-lg">58%</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-24 text-sm text-white/60">40-59</div>
                <div className="flex-1 bg-gray-900 rounded-lg h-14 overflow-hidden">
                  <div
                    className="bg-blue-600 h-full flex items-center justify-end pr-4 transition-all"
                    style={{ width: "35%" }}
                  >
                    <span className="font-black text-white text-lg">35%</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-24 text-sm text-white/60">Under 40</div>
                <div className="flex-1 bg-gray-900 rounded-lg h-14 overflow-hidden">
                  <div
                    className="bg-blue-500 h-full flex items-center justify-end pr-4 transition-all"
                    style={{ width: "7%" }}
                  >
                    <span className="font-black text-white">7%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demographic Opportunity */}
      <section className="container max-w-6xl mx-auto px-4 py-16 border-t border-white/10">
        <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-white/10 rounded-3xl p-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">THE OPPORTUNITY</h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Municipal elections represent the largest untapped opportunity for generational power transfer in Canadian
              democracy
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
            <div className="bg-[#0b0f16] border border-white/10 rounded-2xl p-4 md:p-6 text-center min-w-0">
              <div className="text-2xl md:text-3xl lg:text-4xl font-black mb-2 text-blue-500 truncate">~24,000</div>
              <div className="text-[10px] md:text-xs text-white/70 uppercase tracking-wider">Total Candidates</div>
              <div className="text-[9px] md:text-[10px] text-white/50 mt-2">Across 1,690 municipalities</div>
            </div>

            <div className="bg-[#0b0f16] border border-white/10 rounded-2xl p-4 md:p-6 text-center min-w-0">
              <div className="text-2xl md:text-3xl lg:text-4xl font-black mb-2 text-cyan-500 truncate">~18,000</div>
              <div className="text-[10px] md:text-xs text-white/70 uppercase tracking-wider">Eligible Pool</div>
              <div className="text-[9px] md:text-[10px] text-white/50 mt-2">Gen X & younger (74%)</div>
            </div>

            <div className="bg-[#0b0f16] border border-white/10 rounded-2xl p-4 md:p-6 text-center min-w-0">
              <div className="text-2xl md:text-3xl lg:text-4xl font-black mb-2 text-purple-500">55+</div>
              <div className="text-[10px] md:text-xs text-white/70 uppercase tracking-wider">Avg Age</div>
              <div className="text-[9px] md:text-[10px] text-white/50 mt-2">Estimated average</div>
            </div>

            <div className="bg-[#0b0f16] border border-white/10 rounded-2xl p-4 md:p-6 text-center min-w-0">
              <div className="text-2xl md:text-3xl lg:text-4xl font-black mb-2 text-pink-500">28-31%</div>
              <div className="text-[10px] md:text-xs text-white/70 uppercase tracking-wider">Women</div>
              <div className="text-[9px] md:text-[10px] text-white/50 mt-2">FCM 2023 data</div>
            </div>
          </div>

          <div className="bg-[#0b0f16] border border-white/10 rounded-3xl p-8">
            <h3 className="text-xl font-bold mb-6 text-center">Generational Breakdown</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-36 text-sm font-bold text-purple-400">Gen Z (18-26)</div>
                <div className="flex-1 bg-gray-900 rounded-lg h-12 overflow-hidden relative">
                  <div className="bg-purple-600 h-full flex items-center px-4" style={{ width: "10%" }}>
                    <span className="font-bold text-white text-sm whitespace-nowrap">~2,400</span>
                  </div>
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-white/70 text-sm">10%</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-36 text-sm font-bold text-blue-400">Millennials (27-42)</div>
                <div className="flex-1 bg-gray-900 rounded-lg h-12 overflow-hidden relative">
                  <div className="bg-blue-600 h-full flex items-center px-4" style={{ width: "27%" }}>
                    <span className="font-bold text-white text-sm whitespace-nowrap">~6,500</span>
                  </div>
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-white/70 text-sm">27%</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-36 text-sm font-bold text-cyan-400">Gen X (43-58)</div>
                <div className="flex-1 bg-gray-900 rounded-lg h-12 overflow-hidden relative">
                  <div className="bg-cyan-600 h-full flex items-center px-4" style={{ width: "37%" }}>
                    <span className="font-bold text-white text-sm whitespace-nowrap">~8,900</span>
                  </div>
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-white/70 text-sm">37%</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-36 text-sm font-bold text-red-400">Boomers (59+)</div>
                <div className="flex-1 bg-gray-900 rounded-lg h-12 overflow-hidden relative">
                  <div className="bg-red-900 h-full flex items-center px-4" style={{ width: "26%" }}>
                    <span className="font-bold text-white text-sm whitespace-nowrap">~6,200</span>
                  </div>
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-white/70 text-sm">26%</span>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-blue-900/20 border border-blue-500/30 rounded-xl">
              <p className="text-center text-white/80">
                <strong className="text-blue-400">The Next Majority Target:</strong> ~18,000 progressive candidates
                under 59 years old positioned to win Gen Z and Millennial voters across Canada's 1,690 municipalities
              </p>
            </div>

            <p className="mt-4 text-center text-[10px] text-white/40">
              Sources: Ontario AMO Election Statistics 2022 (6,306 candidates), FCM Women in Local Government Report
              2023 (31%), BC Elections 2022. 2.5x lifetime engagement verified by UK SSRN study 2023.
            </p>
          </div>
        </div>
      </section>

      {/* Meet the Candidates */}
      <section className="container max-w-6xl mx-auto px-4 py-16 border-t border-white/10">
        <h2 className="text-4xl md:text-5xl font-black mb-12 tracking-tight">MEET THE CANDIDATES</h2>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="bg-[#0b0f16] border border-white/10 rounded-2xl p-16 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl font-black mb-2">NEXT</div>
              <div className="text-3xl font-black text-gray-500">MAJORITY</div>
              <div className="text-blue-500 text-7xl font-black mt-2">›</div>
            </div>
          </div>
          <div>
            <div className="bg-gradient-to-br from-blue-900 via-blue-700 to-blue-600 rounded-2xl p-16 relative overflow-hidden mb-6">
              <MapPin className="absolute top-8 left-12 h-10 w-10 text-white fill-white animate-pulse" />
              <MapPin
                className="absolute top-12 right-16 h-10 w-10 text-white fill-white animate-pulse"
                style={{ animationDelay: "0.3s" }}
              />
              <MapPin
                className="absolute bottom-12 left-20 h-10 w-10 text-white fill-white animate-pulse"
                style={{ animationDelay: "0.6s" }}
              />
              <div className="text-7xl font-black text-white/10 text-center">CANADA</div>
            </div>
            <Link
              href="/candidates"
              className="w-full block text-center px-8 py-5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl transition uppercase tracking-wider"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="container max-w-6xl mx-auto px-4 py-16 border-t border-white/10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">CAMPAIGN SERVICES</h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Powered by TechnocracyAI - Comprehensive tools for progressive candidates competing for the next majority
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Voter Management */}
          <div className="bg-[#0b0f16] border border-white/10 rounded-2xl overflow-hidden hover:border-emerald-500/50 transition group">
            {/* Animated Neon Background */}
            <div className="relative h-24 overflow-hidden bg-[#050608]">
              <AnimatedServiceBackground type="analytics" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0b0f16]" />
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="text-emerald-400 font-black text-sm uppercase tracking-wider">Voter Management</div>
                <div className="text-2xl font-black text-emerald-400">$745</div>
              </div>
              <p className="text-white/60 text-sm mb-6">Comprehensive voter database and outreach management system</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-white/70">Voter database</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-white/70">Contact management</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-white/70">Canvassing tools</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-white/70">GOTV operations</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Digital Presence */}
          <div className="bg-[#0b0f16] border border-white/10 rounded-2xl overflow-hidden hover:border-cyan-500/50 transition group">
            {/* Animated Neon Background */}
            <div className="relative h-24 overflow-hidden bg-[#050608]">
              <AnimatedServiceBackground type="web" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0b0f16]" />
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="text-cyan-400 font-black text-sm uppercase tracking-wider">Digital Presence</div>
                <div className="text-2xl font-black text-cyan-400">$795</div>
              </div>
              <p className="text-white/60 text-sm mb-6">Establish dominant online presence across all digital channels</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-white/70">Website development</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-white/70">SEO optimization</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-white/70">Social media management</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-white/70">Email campaigns</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Grassroots Engagement */}
          <div className="bg-[#0b0f16] border border-white/10 rounded-2xl overflow-hidden hover:border-orange-500/50 transition group">
            {/* Animated Neon Background */}
            <div className="relative h-24 overflow-hidden bg-[#050608]">
              <AnimatedServiceBackground type="field" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0b0f16]" />
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="text-orange-400 font-black text-sm uppercase tracking-wider">Grassroots Engagement</div>
                <div className="text-2xl font-black text-orange-400">$545</div>
              </div>
              <p className="text-white/60 text-sm mb-6">Build authentic connections through community organizing</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-white/70">Door-to-door campaigns</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-white/70">Phone banking</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-white/70">Community events</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-white/70">Volunteer management</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-xl rounded-xl transition uppercase tracking-wider text-sm"
          >
            View All Services
            <span>→</span>
          </Link>
          <p className="mt-4 text-xs text-white/50">
            20 comprehensive services • For verified municipal candidates only
          </p>
        </div>
      </section>

      {/* DAO Launch CTA */}
      <section className="container mx-auto px-4 py-20 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tight">LAUNCH THE DAO</h2>
          <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
            Join the decentralized governance platform. Create proposals, vote on initiatives, and shape the future of
            municipal democracy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/governance"
              className="px-12 py-5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xl rounded-xl transition uppercase tracking-wider"
            >
              Launch the DAO
            </Link>
            <Link
              href="/dashboard"
              className="px-12 py-5 border-2 border-blue-600 hover:bg-blue-600/10 text-white font-black text-xl rounded-xl transition uppercase tracking-wider"
            >
              View Dashboard
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
