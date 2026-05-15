export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black mb-4">Contact Us</h1>
        <p className="text-muted-foreground mb-8">Get in touch with The Next Majority team</p>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <section className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-bold mb-3">General Inquiries</h2>
              <p className="text-muted-foreground mb-4">
                Questions about the platform, civic engagement, or municipal democracy
              </p>
              <a href="mailto:hello@technicracy.ai" className="text-primary hover:underline">
                hello@technicracy.ai
              </a>
            </section>

            <section className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-bold mb-3">Candidate Support</h2>
              <p className="text-muted-foreground mb-4">Help with candidate registration and verification</p>
              <a href="mailto:candidates@technicracy.ai" className="text-primary hover:underline">
                candidates@technicracy.ai
              </a>
            </section>

            <section className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-bold mb-3">Privacy & Legal</h2>
              <p className="text-muted-foreground mb-4">Privacy concerns, data requests, or legal inquiries</p>
              <a href="mailto:privacy@technicracy.ai" className="text-primary hover:underline">
                privacy@technicracy.ai
              </a>
              <br />
              <a href="mailto:legal@technicracy.ai" className="text-primary hover:underline">
                legal@technicracy.ai
              </a>
            </section>
          </div>

          <div className="space-y-6">
            <section className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-bold mb-3">Data Corrections</h2>
              <p className="text-muted-foreground mb-4">Report data inaccuracies or request data updates</p>
              <a href="mailto:data@technicracy.ai" className="text-primary hover:underline">
                data@technicracy.ai
              </a>
            </section>

            <section className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-bold mb-3">Press & Media</h2>
              <p className="text-muted-foreground mb-4">Media inquiries and press kit requests</p>
              <a href="mailto:press@technicracy.ai" className="text-primary hover:underline">
                press@technicracy.ai
              </a>
            </section>

            <section className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-bold mb-3">Partnerships</h2>
              <p className="text-muted-foreground mb-4">
                Collaborate with municipalities, civic organizations, or research institutions
              </p>
              <a href="mailto:partnerships@technicracy.ai" className="text-primary hover:underline">
                partnerships@technicracy.ai
              </a>
            </section>
          </div>
        </div>

        <div className="mt-12 bg-card border border-border rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">About Technicracy AI</h2>
          <p className="leading-relaxed text-muted-foreground mb-4">
            The Next Majority is a civic initiative by <strong className="text-foreground">Technicracy AI</strong>, an
            organization dedicated to building data-driven democracy tools that empower citizens and strengthen
            democratic participation.
          </p>
          <p className="leading-relaxed text-muted-foreground">
            Our mission is to leverage technology to create more transparent, accessible, and youth-inclusive democratic
            systems at the municipal, provincial, and federal levels across Canada.
          </p>
        </div>
      </div>
    </div>
  )
}
