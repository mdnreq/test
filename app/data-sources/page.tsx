export default function DataSourcesPage() {
  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black mb-4">Data Sources</h1>
        <p className="text-muted-foreground mb-8">
          Transparency in data: All voter turnout statistics and municipal data sources
        </p>

        <div className="space-y-8 text-foreground">
          <section>
            <h2 className="text-2xl font-bold mb-3">Data Collection Methodology</h2>
            <p className="leading-relaxed">
              The Next Majority aggregates publicly available municipal election data from official government sources,
              Statistics Canada, and provincial/territorial election authorities. All data is verified against multiple
              sources where possible.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">Ontario</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Ontario Ministry of Municipal Affairs and Housing</li>
              <li>Municipal election clerk reports (2014, 2018, 2022)</li>
              <li>Association of Municipalities of Ontario (AMO)</li>
              <li>Statistics Canada Census data</li>
            </ul>
            <p className="text-sm text-muted-foreground mt-2">Next Election: October 26, 2026</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">Prince Edward Island</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Elections PEI</li>
              <li>Municipal election results (2014, 2018, 2022)</li>
              <li>Federation of Prince Edward Island Municipalities (FPEIM)</li>
              <li>Statistics Canada Census data</li>
            </ul>
            <p className="text-sm text-muted-foreground mt-2">Next Election: November 2, 2026</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">Manitoba</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Elections Manitoba</li>
              <li>Municipal election results (2014, 2018, 2022)</li>
              <li>Association of Manitoba Municipalities (AMM)</li>
              <li>Statistics Canada Census data</li>
            </ul>
            <p className="text-sm text-muted-foreground mt-2">Next Election: October 28, 2026</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">New Brunswick</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Elections New Brunswick</li>
              <li>Municipal election results (2016, 2021)</li>
              <li>Cities of New Brunswick Association (CNBA)</li>
              <li>Statistics Canada Census data</li>
            </ul>
            <p className="text-sm text-muted-foreground mt-2">Next Election: May 10, 2026</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">British Columbia</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Elections BC</li>
              <li>Municipal election results (2014, 2018, 2022)</li>
              <li>Union of BC Municipalities (UBCM)</li>
              <li>Statistics Canada Census data</li>
            </ul>
            <p className="text-sm text-muted-foreground mt-2">Next Election: October 15, 2026</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">Saskatchewan</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Elections Saskatchewan</li>
              <li>Municipal election results (2016, 2020, 2024)</li>
              <li>Saskatchewan Association of Rural Municipalities (SARM)</li>
              <li>Statistics Canada Census data</li>
            </ul>
            <p className="text-sm text-muted-foreground mt-2">Next Election: November 13, 2026</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">Northwest Territories</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Municipal and Community Affairs, GNWT</li>
              <li>Community election results (2018, 2021)</li>
              <li>NWT Association of Communities</li>
              <li>Statistics Canada Census data</li>
            </ul>
            <p className="text-sm text-muted-foreground mt-2">Next Election: December 14, 2026</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">Research on Votes at 16</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Generation Squeeze (research on intergenerational equity)</li>
              <li>Samara Centre for Democracy</li>
              <li>Electoral Reform Society (UK) - votes at 16 studies</li>
              <li>
                Austrian Federal Ministry for Europe, Integration and Foreign Affairs - longitudinal studies on
                16-year-old voters
              </li>
              <li>University of Edinburgh - youth voter retention studies</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">Data Accuracy Disclaimer</h2>
            <p className="leading-relaxed bg-card border border-border rounded-lg p-4">
              While we make every effort to ensure data accuracy, voter turnout statistics are compiled from various
              sources and may contain errors or omissions. Official election results should be verified with the
              relevant provincial/territorial election authority. The Next Majority and Technicracy AI are not
              responsible for decisions made based on this data.
            </p>
            <p className="text-sm text-muted-foreground mt-4">Last Data Update: January 14, 2026</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">Data Requests</h2>
            <p className="leading-relaxed">
              For data correction requests or questions about our methodology, contact:
              <br />
              Email: data@technicracy.ai
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
