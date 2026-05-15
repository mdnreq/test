import Link from "next/link"
import { ArrowLeft, TrendingDown } from "lucide-react"

export default function ManitobaDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black tracking-tight">MANITOBA DASHBOARD</h1>
              <p className="text-muted-foreground mt-2">137 municipalities • Next election: Oct 28, 2026</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-card border rounded-xl p-6">
            <div className="text-4xl font-black mb-2">137</div>
            <div className="text-sm text-muted-foreground">Municipalities</div>
          </div>
          <div className="bg-card border rounded-xl p-6">
            <div className="text-4xl font-black mb-2">42.3%</div>
            <div className="text-sm text-muted-foreground">Avg Turnout 2022</div>
          </div>
          <div className="bg-card border rounded-xl p-6">
            <div className="text-4xl font-black mb-2">749K</div>
            <div className="text-sm text-muted-foreground">Winnipeg Pop</div>
          </div>
          <div className="bg-card border rounded-xl p-6">
            <div className="text-4xl font-black mb-2">+6.5%</div>
            <div className="text-sm text-muted-foreground">Votes at 16 Impact</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-amber-600/10 to-orange-600/10 border border-amber-600/20 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold mb-2">The Prairie Opportunity</h2>
          <p className="text-muted-foreground">
            Manitoba's municipal democracy faces declining engagement across urban and rural communities. Winnipeg's
            turnout dropped from 48.5% to 42.3%, while smaller municipalities struggle even more. Votes at 16 could
            reverse this trend and create a generation of engaged prairie voters.
          </p>
        </div>

        <div className="bg-card border rounded-xl overflow-hidden mb-8">
          <div className="border-b p-6">
            <h2 className="text-2xl font-bold">VOTES AT 16 IMPACT PROJECTION</h2>
            <p className="text-sm text-muted-foreground mt-1">How lowering voting age would transform Manitoba</p>
          </div>
          <div className="p-6">
            <div className="text-center py-12 bg-gradient-to-r from-amber-600/5 to-orange-600/5 rounded-xl mb-8">
              <div className="text-7xl font-black bg-gradient-to-r from-amber-500 to-orange-400 bg-clip-text text-transparent mb-4">
                2.5X
              </div>
              <div className="text-xl font-bold mb-2">LIFETIME ENGAGEMENT MULTIPLIER</div>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Voting at 16 creates a retention lock-in that transforms civic participation for decades
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-xl overflow-hidden mb-8">
          <div className="border-b p-6">
            <h2 className="text-2xl font-bold">03. HABIT FORMATION: VOTES AT 16</h2>
            <div className="inline-block px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold mt-2">
              POLICY ENGINE
            </div>
          </div>
          <div className="p-6">
            <div className="mb-8">
              <p className="text-muted-foreground mb-4">
                <strong className="text-foreground">The Pivot:</strong> We move the "Civic Initiation" from the
                transient university years back to the stable high school environment. 16-year-olds voting in schools
                creates a <strong className="text-foreground">retention lock-in</strong>.
              </p>

              <div className="bg-blue-600/10 border-2 border-blue-600/30 rounded-xl p-6 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded border-2 border-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Votes at 16</h3>
                    <p className="text-sm text-blue-300">
                      Policy discussion + youth readiness: civic onboarding, municipal literacy, and early engagement
                      pipeline.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-muted/30 rounded-xl p-6 mb-8">
              <h3 className="font-bold mb-4 text-sm uppercase tracking-wide">RETENTION MULTIPLIER</h3>
              <div className="relative h-48 flex items-end gap-1">
                {[...Array(10)].map((_, i) => {
                  const height = 20 + i * 8
                  return <div key={i} className="flex-1 bg-amber-500 rounded-t" style={{ height: `${height}%` }} />
                })}
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-muted-foreground">Age 16</span>
                <span className="font-bold text-amber-400">2.5X LIFETIME ENGAGEMENT</span>
                <span className="text-muted-foreground">Age 35</span>
              </div>
            </div>

            <div className="bg-muted/30 rounded-xl p-6">
              <h3 className="font-bold mb-4 text-sm uppercase tracking-wide">SCHOOL-TO-BALLOT PIPELINE</h3>
              <div className="space-y-3">
                <div className="bg-blue-600/10 border-2 border-blue-600/30 rounded-lg p-4 flex items-start gap-3">
                  <div className="w-5 h-5 rounded border-2 border-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Classroom Integration</h4>
                    <p className="text-xs text-muted-foreground">Verify identities via school IDs during Grade 11.</p>
                  </div>
                </div>

                <div className="bg-purple-600/10 border-2 border-purple-600/30 rounded-lg p-4 flex items-start gap-3">
                  <div className="w-5 h-5 rounded border-2 border-purple-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Generational Spillover</h4>
                    <p className="text-xs text-muted-foreground">Youth-led "Ballot Parties" boost parent turnout.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-xl overflow-hidden mb-8">
          <div className="border-b p-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">04. YOUTH CONCENTRATION ACROSS MANITOBA</h2>
              <div className="inline-block px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-bold mt-2">
                MUNICIPAL DISTRIBUTION
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4 mb-6">
              {[
                { name: "Winnipeg", level: "High", width: "75%" },
                { name: "Brandon", level: "Med-High", width: "60%" },
                { name: "Steinbach", level: "Medium", width: "50%" },
                { name: "Portage la Prairie", level: "Med", width: "42%" },
              ].map((city) => (
                <div key={city.name}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">{city.name}</span>
                    <span className="text-amber-400 font-bold">{city.level}</span>
                  </div>
                  <div className="h-8 bg-muted/50 rounded-lg overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-lg" style={{ width: city.width }} />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              This chart supports the message: "youth is distributed across all <strong>137</strong> Manitoba
              municipalities," not only concentrated in a few cities.
            </p>
          </div>
        </div>

        <div className="bg-card border rounded-xl overflow-hidden mb-8">
          <div className="border-b p-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">05. GOTV OPERATING FUNNEL</h2>
              <div className="inline-block px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-bold mt-2">
                MUNICIPAL EXECUTION MODEL
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="max-w-2xl mx-auto space-y-3">
              <div className="bg-blue-500 rounded-lg p-6 text-center">
                <div className="font-black text-xl">AWARENESS (1.2M)</div>
              </div>
              <div className="bg-purple-500 rounded-lg p-6 text-center mx-8">
                <div className="font-black text-xl">VERIFIED REG</div>
              </div>
              <div className="bg-cyan-500 rounded-lg p-6 text-center mx-16">
                <div className="font-black text-xl">EDUCATION</div>
              </div>
              <div className="bg-pink-500 rounded-lg p-6 text-center mx-24">
                <div className="font-black text-xl">BALLOT CAST</div>
              </div>
            </div>
            <div className="text-center mt-6">
              <div className="font-bold">TARGET: 15% NET CONVERSION</div>
              <p className="text-sm text-muted-foreground mt-2">
                This chart supports "turnout decline is operational." The fix is a funnel with awareness, friction
                reduction, education, and conversion.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-xl overflow-hidden">
          <div className="border-b p-6">
            <h2 className="text-2xl font-bold">MAJOR MANITOBA MUNICIPALITIES</h2>
            <p className="text-sm text-muted-foreground mt-1">Historical turnout data (2018-2022)</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-bold">Municipality</th>
                  <th className="text-right p-4 font-bold">2018</th>
                  <th className="text-right p-4 font-bold">2022</th>
                  <th className="text-right p-4 font-bold">Change</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="p-4 font-medium">Winnipeg</td>
                  <td className="p-4 text-right">48.5%</td>
                  <td className="p-4 text-right">42.3%</td>
                  <td className="p-4 text-right text-red-500 flex items-center justify-end gap-1">
                    <TrendingDown className="h-4 w-4" />
                    -6.2%
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">Brandon</td>
                  <td className="p-4 text-right">44.2%</td>
                  <td className="p-4 text-right">38.7%</td>
                  <td className="p-4 text-right text-red-500 flex items-center justify-end gap-1">
                    <TrendingDown className="h-4 w-4" />
                    -5.5%
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">Steinbach</td>
                  <td className="p-4 text-right">52.1%</td>
                  <td className="p-4 text-right">45.8%</td>
                  <td className="p-4 text-right text-red-500 flex items-center justify-end gap-1">
                    <TrendingDown className="h-4 w-4" />
                    -6.3%
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">Portage la Prairie</td>
                  <td className="p-4 text-right">41.7%</td>
                  <td className="p-4 text-right">36.9%</td>
                  <td className="p-4 text-right text-red-500 flex items-center justify-end gap-1">
                    <TrendingDown className="h-4 w-4" />
                    -4.8%
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">Winkler</td>
                  <td className="p-4 text-right">47.3%</td>
                  <td className="p-4 text-right">43.2%</td>
                  <td className="p-4 text-right text-red-500 flex items-center justify-end gap-1">
                    <TrendingDown className="h-4 w-4" />
                    -4.1%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
