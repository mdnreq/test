import Link from "next/link"

const FOOTER_PROVINCES = [
  { value: "444", label: "Ontario", accentClass: "text-blue-500", detail: "Ontario (444 municipalities)" },
  { value: "781", label: "Saskatchewan", accentClass: "text-green-500", detail: "Saskatchewan (781 municipalities)" },
  { value: "161", label: "British Columbia", accentClass: "text-purple-500", detail: "British Columbia (161 municipalities)" },
  { value: "137", label: "Manitoba", accentClass: "text-orange-500", detail: "Manitoba (137 municipalities)" },
  { value: "77", label: "New Brunswick", accentClass: "text-red-500", detail: "New Brunswick (77 municipalities)" },
  { value: "57", label: "PEI", accentClass: "text-cyan-500", detail: "PEI (57 municipalities)" },
  { value: "33", label: "NWT", accentClass: "text-yellow-500", detail: "NWT (33 communities)" },
] as const

export function SiteFooter() {
  return (
    <>
      <section className="border-t border-white/10 bg-[#0b0f16]">
        <div className="container mx-auto max-w-6xl px-4 py-12">
          <div className="grid grid-cols-2 gap-6 text-center md:grid-cols-4 lg:grid-cols-7">
            {FOOTER_PROVINCES.map((province) => (
              <div key={province.label}>
                <div className={`mb-2 text-3xl font-black md:text-4xl ${province.accentClass}`}>{province.value}</div>
                <div className="text-xs font-bold uppercase tracking-wider text-gray-500">{province.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-black">
        <div className="container mx-auto max-w-7xl px-4 py-12">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <div className="mb-4 text-2xl font-black">THE NEXT MAJORITY</div>
              <p className="mb-4 text-sm text-gray-500">
                Independent civic initiative mobilizing Gen Z and Millennial voters across Canadian municipalities.
              </p>
              <div className="mt-4 border-t border-white/5 pt-4 text-xs text-gray-600">
                <p className="mb-1">A civic initiative by</p>
                <p className="font-bold tracking-wider text-blue-500">TECHNICRACY AI</p>
                <p className="mt-1 text-[10px] text-gray-700">Data-driven democracy tools</p>
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider">Platform</h3>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><Link href="/candidates" className="transition hover:text-white">Candidate Registry</Link></li>
                <li><Link href="/governance" className="transition hover:text-white">DAO Governance</Link></li>
                <li><Link href="/municipalities" className="transition hover:text-white">Municipal Data</Link></li>
                <li><Link href="/dashboard" className="transition hover:text-white">Dashboard</Link></li>
                <li><Link href="/legal" className="transition hover:text-white">Legal Framework</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider">Provinces (Verified 2024)</h3>
              <ul className="space-y-2 text-sm text-gray-500">
                {FOOTER_PROVINCES.map((province) => (
                  <li key={province.detail}>{province.detail}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-white/10 pt-8">
            <div className="mb-6 grid gap-8 md:grid-cols-2">
              <div>
                <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-white/70">Disclaimer</h4>
                <p className="text-xs leading-relaxed text-gray-600">
                  The Next Majority is an independent civic initiative and is not affiliated with any political party,
                  government entity, or electoral organization. All voter turnout data, demographic statistics, and
                  projections are provided for informational and educational purposes only. This platform does not
                  constitute legal advice.
                </p>
              </div>

              <div>
                <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-white/70">Data Accuracy</h4>
                <p className="text-xs leading-relaxed text-gray-600">
                  Municipal counts verified from: Ontario Open Data (444), Saskatchewan SORC (781), BC Stats (161),
                  AMM (137), NB post-2023 reform (77), PEI Municipal Affairs (57), NWT MACA (33). Voter turnout:
                  Ontario AMO 2022 (32.9%). Women representation: FCM 2023 (31%). 2.5x engagement: UK SSRN 2023.
                </p>
              </div>
            </div>

            <div className="mb-6 rounded-lg border border-blue-500/20 bg-blue-900/10 p-4">
              <p className="text-center text-xs text-gray-500">
                Detailed legal and data-policy analysis lives on the dedicated research pages. <Link href="/legal" className="text-blue-400 hover:underline">Legal analysis</Link> • <Link href="/data-sources" className="text-blue-400 hover:underline">Data sources</Link>
              </p>
            </div>

            <div className="mb-6 flex flex-wrap justify-center gap-4 text-xs text-gray-600">
              <Link href="/privacy" className="transition hover:text-blue-500">Privacy Policy</Link>
              <span className="text-white/20">•</span>
              <Link href="/terms" className="transition hover:text-blue-500">Terms of Service</Link>
              <span className="text-white/20">•</span>
              <Link href="/data-sources" className="transition hover:text-blue-500">Data Sources</Link>
              <span className="text-white/20">•</span>
              <Link href="/legal" className="transition hover:text-blue-500">Legal Framework</Link>
              <span className="text-white/20">•</span>
              <Link href="/acknowledgements" className="transition hover:text-blue-500">Acknowledgements</Link>
              <span className="text-white/20">•</span>
              <Link href="/contact" className="transition hover:text-blue-500">Contact</Link>
            </div>
          </div>

          <div className="mt-6 border-t border-white/10 pt-6 text-center">
            <p className="mb-2 text-xs text-gray-500">© 2026 The Next Majority. Building municipal democracy for the next generation.</p>
            <p className="text-[10px] text-gray-700">Powered by Technicracy AI • Non-partisan civic engagement platform</p>
          </div>
        </div>
      </footer>
    </>
  )
}