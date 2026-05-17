import Link from "next/link"
import { ArrowLeft, Users, TrendingUp, Calendar, ExternalLink } from "lucide-react"

export default function DemographicsPage() {
  return (
    <div className="min-h-screen bg-[#06080c] text-white">
      <div className="container max-w-7xl mx-auto px-4 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-8 transition">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl font-black mb-4 tracking-tight">MUNICIPAL CANDIDATE DEMOGRAPHICS</h1>
          <p className="text-xl text-white/70 max-w-3xl">
            Comprehensive analysis of Canada's ~24,000 municipal candidates across 1,690 municipalities in 7
            provinces/territories
          </p>
        </div>

        {/* Executive Summary */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border border-blue-500/30 rounded-2xl p-8">
            <Users className="h-12 w-12 text-blue-400 mb-4" />
            <h2 className="text-3xl font-black mb-2">~24,000</h2>
            <p className="text-white/70 mb-4">Total Municipal Candidates</p>
            <ul className="space-y-2 text-sm text-white/60">
              <li>• 1,690 municipalities across 7 provinces/territories</li>
              <li>• Based on Ontario 2022: 6,306 candidates for 444 municipalities</li>
              <li>• ~14 candidates per municipality average</li>
              <li>• Municipal elections every 4 years</li>
            </ul>
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-xs text-white/40">Source: Ontario AMO Election Statistics 2022</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-cyan-900/30 to-purple-900/30 border border-cyan-500/30 rounded-2xl p-8">
            <TrendingUp className="h-12 w-12 text-cyan-400 mb-4" />
            <h2 className="text-3xl font-black mb-2">~18,000</h2>
            <p className="text-white/70 mb-4">Next Majority Target Pool</p>
            <ul className="space-y-2 text-sm text-white/60">
              <li>• Gen X and younger (74% of all candidates)</li>
              <li>• Support millennial voter mobilization through digital campaigns</li>
              <li>• Progressive municipal platforms</li>
              <li>• Non-Boomer candidates (under 59)</li>
            </ul>
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-xs text-white/40">Extrapolation from generational distribution data</p>
            </div>
          </div>
        </div>

        {/* Age Distribution */}
        <div className="bg-[#0b0f16] border border-white/10 rounded-3xl p-8 mb-12">
          <div className="flex items-center gap-3 mb-8">
            <Calendar className="h-6 w-6 text-blue-400" />
            <h2 className="text-3xl font-black">Age Distribution</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <div className="text-center mb-6">
                <div className="text-5xl font-black text-blue-500 mb-2">55+</div>
                <div className="text-sm text-white/70 uppercase tracking-wider">Estimated Average Age</div>
                <div className="text-xs text-white/50 mt-1">Current municipal councillors (no official source)</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Youngest Average:</span>
                <span className="text-green-400 font-bold">~38 years (Gen Z candidates)</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Oldest Average:</span>
                <span className="text-red-400 font-bold">~67 years (Boomer candidates)</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Median Age:</span>
                <span className="text-blue-400 font-bold">~49 years (estimated)</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-900/30 to-transparent border border-purple-500/20 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-purple-400">Gen Z (Ages 18-26)</h3>
                  <p className="text-sm text-white/60">Born 2000-2008</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black text-purple-400">~2,400</div>
                  <div className="text-sm text-white/60">10% of candidates</div>
                </div>
              </div>
              <div className="w-full bg-gray-900 rounded-lg h-3 overflow-hidden">
                <div className="bg-purple-600 h-full" style={{ width: "10%" }} />
              </div>
              <p className="text-xs text-white/50 mt-3">
                Climate-focused, digital-native campaigners. Highest growth demographic.
              </p>
            </div>

            <div className="bg-gradient-to-r from-blue-900/30 to-transparent border border-blue-500/20 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-blue-400">Millennials (Ages 27-42)</h3>
                  <p className="text-sm text-white/60">Born 1984-1999</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black text-blue-400">~6,500</div>
                  <div className="text-sm text-white/60">27% of candidates</div>
                </div>
              </div>
              <div className="w-full bg-gray-900 rounded-lg h-3 overflow-hidden">
                <div className="bg-blue-600 h-full" style={{ width: "27%" }} />
              </div>
              <p className="text-xs text-white/50 mt-3">
                Housing, transit, affordability-focused. Most active on social media campaigns.
              </p>
            </div>

            <div className="bg-gradient-to-r from-cyan-900/30 to-transparent border border-cyan-500/20 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-cyan-400">Gen X (Ages 43-58)</h3>
                  <p className="text-sm text-white/60">Born 1966-1983</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black text-cyan-400">~8,900</div>
                  <div className="text-sm text-white/60">37% of candidates</div>
                </div>
              </div>
              <div className="w-full bg-gray-900 rounded-lg h-3 overflow-hidden">
                <div className="bg-cyan-600 h-full" style={{ width: "37%" }} />
              </div>
              <p className="text-xs text-white/50 mt-3">
                Experienced, pragmatic reformers. Bridge between old guard and youth movements.
              </p>
            </div>

            <div className="bg-gradient-to-r from-red-900/30 to-transparent border border-red-500/20 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-red-400">Boomers (Ages 59+)</h3>
                  <p className="text-sm text-white/60">Born before 1965</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black text-red-400">~6,200</div>
                  <div className="text-sm text-white/60">26% of candidates</div>
                </div>
              </div>
              <div className="w-full bg-gray-900 rounded-lg h-3 overflow-hidden">
                <div className="bg-red-900 h-full" style={{ width: "26%" }} />
              </div>
              <p className="text-xs text-white/50 mt-3">
                Excluded from Next Majority platform. Overrepresented in current councils.
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-xl">
            <p className="text-xs text-yellow-200/80 text-center">
              <strong>Note:</strong> Age distribution percentages are estimates based on general demographic patterns.
              No official Statistics Canada data exists for municipal candidate age demographics.
            </p>
          </div>
        </div>

        {/* Gender & Diversity */}
        <div className="bg-[#0b0f16] border border-white/10 rounded-3xl p-8 mb-12">
          <h2 className="text-3xl font-black mb-8">Gender & Diversity</h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-pink-900/20 to-purple-900/20 border border-pink-500/30 rounded-2xl p-6 text-center">
              <div className="text-4xl font-black text-pink-400 mb-2">31%</div>
              <div className="text-sm text-white/70 uppercase tracking-wider mb-2">Women Representatives</div>
              <div className="text-xs text-white/50">FCM 2023 Report - Verified</div>
            </div>

            <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border border-blue-500/30 rounded-2xl p-6 text-center">
              <div className="text-4xl font-black text-blue-400 mb-2">69%</div>
              <div className="text-sm text-white/70 uppercase tracking-wider mb-2">Men Representatives</div>
              <div className="text-xs text-white/50">FCM 2023 Report - Verified</div>
            </div>

            <div className="bg-gradient-to-br from-purple-900/20 to-cyan-900/20 border border-purple-500/30 rounded-2xl p-6 text-center">
              <div className="text-4xl font-black text-purple-400 mb-2">~15%</div>
              <div className="text-sm text-white/70 uppercase tracking-wider mb-2">BIPOC Candidates</div>
              <div className="text-xs text-white/50">Estimated - Underrepresented in data</div>
            </div>
          </div>

          <div className="mt-8 p-6 bg-blue-900/20 border border-blue-500/30 rounded-xl">
            <p className="text-sm text-white/70 text-center">
              <strong className="text-blue-400">Next Majority Goal:</strong> Achieve gender parity and proportional
              BIPOC representation in municipal councils by 2030 through targeted youth candidate recruitment
            </p>
          </div>

          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-white/40">
            <ExternalLink className="h-3 w-3" />
            <a
              href="https://www.fcm.ca/en/resources/women-in-local-government"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition"
            >
              FCM Women in Local Government Report 2023
            </a>
          </div>
        </div>

        {/* Provincial Breakdown - VERIFIED DATA */}
        <div className="bg-[#0b0f16] border border-white/10 rounded-3xl p-8">
          <h2 className="text-3xl font-black mb-4">Provincial Breakdown</h2>
          <p className="text-sm text-white/50 mb-8">
            Verified municipality counts from official government sources (2024)
          </p>

          <div className="space-y-4">
            {[
              {
                province: "Ontario",
                municipalities: 444,
                candidates: "~6,300",
                color: "blue",
                source: "Ontario Open Data",
              },
              {
                province: "Saskatchewan",
                municipalities: 781,
                candidates: "~10,900",
                color: "green",
                source: "Saskatchewan SORC",
              },
              {
                province: "British Columbia",
                municipalities: 161,
                candidates: "~2,300",
                color: "purple",
                source: "BC Stats",
              },
              { province: "Manitoba", municipalities: 137, candidates: "~1,900", color: "orange", source: "AMM" },
              {
                province: "New Brunswick",
                municipalities: 77,
                candidates: "~1,100",
                color: "red",
                source: "Post-2023 Reform",
              },
              {
                province: "PEI",
                municipalities: 57,
                candidates: "~800",
                color: "cyan",
                source: "PEI Municipal Affairs",
              },
              {
                province: "Northwest Territories",
                municipalities: 33,
                candidates: "~460",
                color: "yellow",
                source: "NWT MACA",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-[#0d121b] border border-white/10 rounded-xl p-6 hover:border-white/20 transition"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`text-xl font-bold text-${item.color}-400`}>{item.province}</h3>
                    <p className="text-sm text-white/60 mt-1">{item.municipalities} municipalities</p>
                    <p className="text-xs text-white/40 mt-1">Source: {item.source}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black">{item.candidates}</div>
                    <div className="text-xs text-white/50">estimated candidates</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-[#0d121b] border border-white/10 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">TOTAL</h3>
                <p className="text-sm text-white/60">7 provinces/territories</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-black text-blue-400">1,690</div>
                <div className="text-xs text-white/50">municipalities</div>
              </div>
            </div>
          </div>
        </div>

        {/* Data Sources */}
        <div className="mt-12 p-6 bg-[#0b0f16] border border-white/10 rounded-2xl">
          <h3 className="font-bold mb-4 text-sm uppercase tracking-wider text-white/70">Data Sources & Methodology</h3>
          <ul className="space-y-2 text-xs text-white/50">
            <li>
              • <strong>Municipality counts:</strong> Official government sources (Ontario Open Data, BC Stats,
              Saskatchewan SORC, AMM, PEI Municipal Affairs, NWT MACA, NB post-2023 reform)
            </li>
            <li>
              • <strong>Candidate estimates:</strong> Extrapolated from Ontario AMO 2022 data (6,306 candidates for 444
              municipalities = ~14 per municipality)
            </li>
            <li>
              • <strong>Women representation:</strong> FCM Women in Local Government Report 2023 (31%)
            </li>
            <li>
              • <strong>Voter turnout:</strong> Ontario AMO 2022 (32.9% average across 385 reporting municipalities)
            </li>
            <li>
              • <strong>2.5x lifetime engagement:</strong> UK regression-discontinuity study (SSRN 2023); Austrian &
              Scottish longitudinal data
            </li>
            <li>
              • <strong>Age demographics:</strong> Estimated - No official Statistics Canada data for municipal
              candidate ages
            </li>
          </ul>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            href="/auth/sign-up"
            className="inline-flex items-center gap-2 px-10 py-5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-black rounded-xl transition uppercase text-sm tracking-wider"
          >
            Join the Movement
          </Link>
        </div>
      </div>
    </div>
  )
}
