export default function AcknowledgementsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8">Acknowledgements</h1>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4 text-blue-400">Foundation & Inspiration</h2>
            <p className="text-gray-300 leading-relaxed">
              The Next Majority is built upon the groundbreaking work of municipal democracy advocates, researchers, and
              legislators who recognize that youth civic engagement is essential to the future of Canadian democracy. We
              are deeply grateful to the following organizations and individuals whose work has informed and inspired
              this platform.
            </p>
          </section>

          <section className="border-l-4 border-blue-500 pl-6">
            <h3 className="text-xl font-bold mb-3">Federation of Canadian Municipalities (FCM)</h3>
            <p className="text-gray-300 mb-3">
              <strong className="text-blue-400">Municipal Youth Engagement Handbook</strong>
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">
              The FCM's Municipal Youth Engagement Handbook has been instrumental in shaping our approach to youth
              participation in municipal democracy. This comprehensive resource provides practical strategies for
              elected officials and administrators to engage young Canadians aged 14-25 in municipal governance.
            </p>
            <div className="bg-gray-900 p-4 rounded-lg mb-4">
              <h4 className="font-bold mb-2 text-blue-400">Key Insights We've Adopted:</h4>
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                <li>
                  <strong>Educate and Inform:</strong> Breaking down barriers through accessible information about
                  municipal institutions
                </li>
                <li>
                  <strong>Engage and Participate:</strong> Creating opportunities for youth to actively participate in
                  municipal affairs
                </li>
                <li>
                  <strong>Recruit and Retain:</strong> Addressing Canada's demographic shift by recruiting young
                  municipal leaders
                </li>
                <li>
                  <strong>Digital Engagement:</strong> Leveraging social media and online tools to reach youth where
                  they are
                </li>
              </ul>
            </div>
            <p className="text-gray-300 leading-relaxed">
              The handbook's emphasis on the urgent need to engage youth—particularly in light of the fact that 30-50%
              of municipal employees are expected to retire within the next decade—has directly informed our platform's
              focus on building the next generation of municipal leaders.
            </p>
            <p className="text-sm text-gray-400 mt-3">
              Source: Federation of Canadian Municipalities (FCM), <em>Municipal Youth Engagement Handbook</em>
              <br />
              Available at:{" "}
              <a href="https://fcm.ca" className="text-blue-400 hover:underline">
                fcm.ca
              </a>
            </p>
          </section>

          <section className="border-l-4 border-green-500 pl-6">
            <h3 className="text-xl font-bold mb-3">Senator Marilou McPhedran</h3>
            <p className="text-gray-300 mb-3">
              <strong className="text-green-400">Bill S-201 (44th Parliament, 1st Session)</strong>
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">
              Senator Marilou McPhedran's Bill S-201, <em>An Act to amend the Canada Elections Act (voting age)</em>,
              represents historic legislative action to lower the federal voting age from 18 to 16 years. Introduced in
              the Senate and reaching second reading in 2024, this bill embodies the evidence-based case for youth
              enfranchisement.
            </p>
            <div className="bg-gray-900 p-4 rounded-lg mb-4">
              <h4 className="font-bold mb-2 text-green-400">Why Bill S-201 Matters:</h4>
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                <li>Recognizes 16 and 17-year-olds as capable, informed citizens</li>
                <li>Aligns with international jurisdictions that have successfully lowered voting ages</li>
                <li>Creates habit formation during formative civic engagement years</li>
                <li>Addresses declining youth voter turnout through early engagement</li>
              </ul>
            </div>
            <p className="text-gray-300 leading-relaxed">
              While Bill S-201 focuses on federal elections, our platform applies these same principles to municipal
              democracy, where the impact of youth voting can be even more direct and immediate. Senator McPhedran's
              advocacy has demonstrated that{" "}
              <strong className="text-green-400">2.5X lifetime engagement multiplier</strong> research shows voters who
              start at 16 maintain higher civic participation throughout their lives.
            </p>
            <p className="text-sm text-gray-400 mt-3">
              Source: Bill S-201 (44-1), Senator Marilou McPhedran
              <br />
              Parliament of Canada LEGISinfo:{" "}
              <a
                href="https://www.parl.ca/LegisInfo/en/bill/44-1/S-201"
                className="text-green-400 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Bill S-201
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-400">Additional Acknowledgements</h2>

            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-purple-400">Provincial & Territorial Election Authorities</h4>
                <p className="text-gray-300 text-sm">
                  Elections Ontario, Elections PEI, Elections Manitoba, Elections New Brunswick, Elections NWT,
                  Elections BC, and Elections Saskatchewan for providing comprehensive voter turnout data that powers
                  our municipal democracy analytics.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-purple-400">Youth Engagement Organizations</h4>
                <p className="text-gray-300 text-sm">
                  Apathy is Boring, Student Vote Canada, and other organizations working tirelessly to engage young
                  Canadians in democratic processes.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-purple-400">Municipal Governments</h4>
                <p className="text-gray-300 text-sm">
                  The 1,700+ municipalities across Canada whose transparency in sharing election data and demographic
                  information makes this platform possible.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-purple-400">Research & Academia</h4>
                <p className="text-gray-300 text-sm">
                  Researchers studying youth civic engagement, voter turnout patterns, and the impacts of lowering
                  voting ages internationally whose work validates the 2.5X engagement multiplier.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-blue-950 p-6 rounded-lg border border-blue-800">
            <h2 className="text-2xl font-bold mb-4">Our Commitment</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              The Next Majority is committed to advancing the vision articulated in both the FCM's Municipal Youth
              Engagement Handbook and Senator McPhedran's Bill S-201: a Canada where young people are not just future
              leaders, but <strong>present participants</strong> in shaping their communities.
            </p>
            <p className="text-gray-300 leading-relaxed">
              By focusing on municipal democracy—the most direct form of governance—we believe we can create the
              engagement multiplier that transforms millennial voters into lifelong civic champions through digital platforms. This is how we build{" "}
              <strong className="text-blue-400">The Next Majority</strong>.
            </p>
          </section>

          <section className="text-center pt-8 border-t border-gray-800">
            <p className="text-gray-400 text-sm">
              The Next Majority is a civic initiative by{" "}
              <a
                href="https://technicracy.ai"
                className="text-blue-400 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Technicracy AI
              </a>
            </p>
            <p className="text-gray-500 text-xs mt-2">Data-driven democracy tools for the digital age</p>
          </section>
        </div>
      </div>
    </div>
  )
}
