import Link from "next/link"
import { CheckCircle, AlertTriangle, Scale, Shield, FileText, Users, School, Vote } from "lucide-react"

export const metadata = {
  title: "Legal & Constitutional Verification | The Next Majority",
  description: "Legal framework and constitutional analysis for Votes at 16 in Canadian municipal elections",
}

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-[#0a0a0a]/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold">The Next Majority</span>
          </Link>
          <Link href="/" className="text-sm text-gray-400 hover:text-white">
            ← Back to Home
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-full px-4 py-2 mb-6">
            <Scale className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-sm font-medium">Legal Framework Verified</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Legal & Constitutional
            <br />
            Verification
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Comprehensive legal analysis of Votes at 16 for Canadian municipal elections, including constitutional
            compatibility, provincial jurisdiction, and safeguards.
          </p>
        </div>

        {/* Key Legal Status */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <Shield className="w-6 h-6 text-blue-400" />
            Legal Status Summary
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <h3 className="text-lg font-semibold text-green-400">Constitutionally Permissible</h3>
              </div>
              <p className="text-gray-300 text-sm">
                The Canadian Charter of Rights and Freedoms (Section 3) guarantees the right to vote but does not
                prescribe a minimum age. Courts have treated 18 as a reasonable limit, not a constitutional minimum.
              </p>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-blue-400" />
                <h3 className="text-lg font-semibold text-blue-400">Provincial Jurisdiction</h3>
              </div>
              <p className="text-gray-300 text-sm">
                Municipal elections are governed by provincial legislation, not federal law. Provinces have full
                authority to set voting age for municipal contests under s. 92(8) of the Constitution Act, 1867.
              </p>
            </div>

            <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-purple-400" />
                <h3 className="text-lg font-semibold text-purple-400">No Constitutional Amendment Required</h3>
              </div>
              <p className="text-gray-300 text-sm">
                Voting age is a statutory matter, not a constitutional entrenchment. Provincial legislatures may vary
                franchise rules for municipal elections through ordinary legislation.
              </p>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-yellow-400" />
                <h3 className="text-lg font-semibold text-yellow-400">Current Status: Not Yet Enacted</h3>
              </div>
              <p className="text-gray-300 text-sm">
                As of 2026, no Canadian province has lowered the municipal voting age to 16. Some provinces (PEI, Nova
                Scotia, Ontario, Yukon) maintain provisional voter registers for 16-17 year olds.
              </p>
            </div>
          </div>
        </section>

        {/* Constitutional Framework */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <FileText className="w-6 h-6 text-blue-400" />
            A. Canadian Constitutional Framework
          </h2>

          <div className="space-y-6">
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">1. Is Votes at 16 lawful in Canada?</h3>
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-4">
                <p className="text-green-400 font-semibold">Yes — Constitutionally Permissible</p>
              </div>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                  <span>Charter Section 3 guarantees the right to vote but does not specify an age</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                  <span>Courts have not held that 18 is a constitutional requirement</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                  <span>Provincial legislatures have jurisdiction over municipal elections</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                  <span>No constitutional amendment required for provincial legislative change</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">2. Legal Precedent: Bill S-201</h3>
              <p className="text-gray-300 text-sm mb-4">
                Senator Marilou McPhedran's Bill S-201 (44-1) proposes lowering the federal voting age to 16, arguing
                the current 18-year threshold violates:
              </p>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">•</span>
                  <span>
                    <strong>Charter Section 3:</strong> Right to vote
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">•</span>
                  <span>
                    <strong>Charter Section 15:</strong> Equality rights (age-based discrimination)
                  </span>
                </li>
              </ul>
              <p className="text-gray-400 text-sm mt-4 italic">
                Source: Parliament of Canada LEGISinfo, Asper Centre Constitutional Challenge (2021)
              </p>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">3. Provincial Jurisdiction Over Municipal Elections</h3>
              <p className="text-gray-300 text-sm mb-4">
                Under the Constitution Act, 1867, municipalities are "creatures of the province" and can only exercise
                powers conferred by provincial statutes. Each province sets voting eligibility through:
              </p>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <p className="font-semibold text-white mb-2">Ontario</p>
                  <p className="text-gray-400">Municipal Elections Act, 1996</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <p className="font-semibold text-white mb-2">British Columbia</p>
                  <p className="text-gray-400">Local Government Act</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <p className="font-semibold text-white mb-2">Saskatchewan</p>
                  <p className="text-gray-400">Local Government Election Act, 2015</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <p className="font-semibold text-white mb-2">Manitoba</p>
                  <p className="text-gray-400">Municipal Councils and School Boards Elections Act</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* School-to-Ballot Safeguards */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <School className="w-6 h-6 text-blue-400" />
            B. School-to-Ballot Model — Legal Safeguards
          </h2>

          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-6">
            <p className="text-gray-300 mb-6">
              A school-based voter registration facilitation model is lawful if it meets the following conditions:
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-400 font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Strict Non-Partisanship</h4>
                    <ul className="text-gray-400 text-sm mt-1">
                      <li>• No campaigning in schools</li>
                      <li>• Neutral, standardized materials only</li>
                      <li>• No endorsement of candidates or parties</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-400 font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Opt-In Participation</h4>
                    <ul className="text-gray-400 text-sm mt-1">
                      <li>• No compulsory registration</li>
                      <li>• No compulsory voting</li>
                      <li>• Voluntary civic education</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-400 font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Privacy Compliance (PIPEDA)</h4>
                    <ul className="text-gray-400 text-sm mt-1">
                      <li>• Data minimization</li>
                      <li>• Explicit consent required</li>
                      <li>• Purpose limitation</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-400 font-bold text-sm">4</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Independent Oversight</h4>
                    <ul className="text-gray-400 text-sm mt-1">
                      <li>• Elections Canada/provincial guidance</li>
                      <li>• School board approval</li>
                      <li>• Transparent procedures</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <p className="text-green-400 text-sm">
                <strong>Legal Status:</strong> With these safeguards in place, there is no constitutional or legal
                barrier to school-based voter registration facilitation in Canada.
              </p>
            </div>
          </div>
        </section>

        {/* Risk Assessment */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-yellow-400" />
            C. Risk Assessment Matrix
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-4 px-4 text-gray-400 font-medium">Measure</th>
                  <th className="text-center py-4 px-4 text-gray-400 font-medium">Legal Risk</th>
                  <th className="text-center py-4 px-4 text-gray-400 font-medium">Constitutional Risk</th>
                  <th className="text-center py-4 px-4 text-gray-400 font-medium">Political Risk</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-800">
                  <td className="py-4 px-4 text-white">Votes at 16 (provincial legislation)</td>
                  <td className="text-center py-4 px-4">
                    <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">Low</span>
                  </td>
                  <td className="text-center py-4 px-4">
                    <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">Low</span>
                  </td>
                  <td className="text-center py-4 px-4">
                    <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-sm">Medium</span>
                  </td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-4 px-4 text-white">School-to-Ballot (with safeguards)</td>
                  <td className="text-center py-4 px-4">
                    <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">Low</span>
                  </td>
                  <td className="text-center py-4 px-4">
                    <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">Low</span>
                  </td>
                  <td className="text-center py-4 px-4">
                    <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">Low</span>
                  </td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-4 px-4 text-white">Candidate Registry (verified)</td>
                  <td className="text-center py-4 px-4">
                    <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">Low</span>
                  </td>
                  <td className="text-center py-4 px-4">
                    <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">Low</span>
                  </td>
                  <td className="text-center py-4 px-4">
                    <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">Low</span>
                  </td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-4 px-4 text-white">DAO Governance (advisory only)</td>
                  <td className="text-center py-4 px-4">
                    <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">Low</span>
                  </td>
                  <td className="text-center py-4 px-4">
                    <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">Low</span>
                  </td>
                  <td className="text-center py-4 px-4">
                    <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-sm">Medium</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Human Rights Compatibility */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <Users className="w-6 h-6 text-blue-400" />
            D. Human Rights Compatibility
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 text-white">Canadian Charter of Rights</h3>
              <ul className="space-y-3 text-gray-300 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-1" />
                  <span>
                    <strong>Section 3:</strong> Democratic rights — right to vote
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-1" />
                  <span>
                    <strong>Section 15:</strong> Equality rights — protection from age discrimination
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-1" />
                  <span>
                    <strong>Section 2(b):</strong> Freedom of expression — civic participation
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 text-white">International Standards</h3>
              <ul className="space-y-3 text-gray-300 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-1" />
                  <span>
                    <strong>UN Convention on the Rights of the Child (UNCRC):</strong> Encourages youth participation in
                    civic life
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-1" />
                  <span>
                    <strong>ICCPR Article 25:</strong> Right to participate in public affairs
                  </span>
                </li>
              </ul>
              <p className="text-gray-400 text-sm mt-4 italic">
                No adverse human-rights judgments exist against Votes at 16 internationally.
              </p>
            </div>
          </div>
        </section>

        {/* Defensible Position */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <Vote className="w-6 h-6 text-blue-400" />
            E. Defensible Constitutional Position
          </h2>

          <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl p-8">
            <blockquote className="text-xl text-white leading-relaxed mb-6">
              "Lowering the voting age to 16 for municipal elections is{" "}
              <strong className="text-blue-400">lawful</strong>,
              <strong className="text-purple-400"> constitutionally compatible</strong>, supported by
              <strong className="text-green-400"> international precedent</strong>, and
              <strong className="text-yellow-400"> proportionate</strong> to the goal of strengthening democratic
              participation and civic engagement among young Canadians."
            </blockquote>
            <p className="text-gray-400 text-sm">
              Provincial legislatures have clear constitutional authority to enact Votes at 16 for municipal elections
              without federal approval or constitutional amendment.
            </p>
          </div>
        </section>

        {/* Sources */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8">Sources & References</h2>
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <ul className="space-y-3 text-gray-400 text-sm">
              <li>• Constitution Act, 1867, s. 92(8) — Provincial jurisdiction over municipal institutions</li>
              <li>• Canadian Charter of Rights and Freedoms, ss. 3, 15 — Democratic and equality rights</li>
              <li>• Canada Elections Act, R.S.C., 1985, c. E-2 — Federal voting age provisions</li>
              <li>• Bill S-201 (44-1) — An Act to amend the Canada Elections Act (voting age)</li>
              <li>• Ontario Municipal Elections Act, 1996, S.O. 1996, c. 32, Sched.</li>
              <li>• Federation of Canadian Municipalities — Municipal Youth Engagement Handbook (2018)</li>
              <li>• Elections Canada Compendium of Election Administration (2024)</li>
              <li>• Asper Centre Constitutional Challenge (2021) — Youth voting rights litigation</li>
            </ul>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-yellow-400 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Legal Disclaimer
          </h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            This analysis is provided for informational and educational purposes only and does not constitute legal
            advice. The Next Majority is an independent civic initiative advocating for democratic reform. The legal
            status of Votes at 16 may vary by jurisdiction and is subject to change through legislative action. Consult
            qualified legal counsel for advice specific to your situation. This platform does not engage in lobbying
            activities that require registration under federal or provincial lobbying legislation.
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 mt-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm">© 2026 The Next Majority — A Civic Initiative by TechnocracyAI</p>
          <div className="flex justify-center gap-6 mt-4">
            <Link href="/privacy" className="text-gray-500 hover:text-white text-sm">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-500 hover:text-white text-sm">
              Terms of Service
            </Link>
            <Link href="/acknowledgements" className="text-gray-500 hover:text-white text-sm">
              Acknowledgements
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
