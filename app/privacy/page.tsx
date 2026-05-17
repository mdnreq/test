export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black mb-4">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">Last Updated: January 14, 2026</p>

        <div className="space-y-8 text-foreground">
          <section>
            <h2 className="text-2xl font-bold mb-3">1. Introduction</h2>
            <p className="leading-relaxed">
              The Next Majority, a civic initiative operated by Technicracy AI ("we," "our," or "us"), is committed to
              protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your
              information when you use our municipal democracy platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">2. Information We Collect</h2>
            <h3 className="text-xl font-semibold mt-4 mb-2">2.1 Personal Information</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Account information (name, email address, password)</li>
              <li>Birth year (for age verification and generation classification)</li>
              <li>Location data (province, municipality, riding/electoral district)</li>
              <li>Candidate information (if registering as a candidate)</li>
              <li>Policy preferences and voting support declarations</li>
            </ul>

            <h3 className="text-xl font-semibold mt-4 mb-2">2.2 Usage Information</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>IP address and device information</li>
              <li>Browser type and operating system</li>
              <li>Pages visited and features used</li>
              <li>Voting and governance participation data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>To create and manage your account</li>
              <li>To verify candidate eligibility (age, generation, policy support)</li>
              <li>To facilitate DAO governance and voting</li>
              <li>To display verified candidate information in our registry</li>
              <li>To provide municipality-specific data and analytics</li>
              <li>To improve our platform and user experience</li>
              <li>To communicate important updates and civic engagement opportunities</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">4. Data Sharing and Disclosure</h2>
            <p className="leading-relaxed mb-4">
              We do not sell, trade, or rent your personal information to third parties. We may share your information
              only in the following circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Publicly Listed Candidates:</strong> If you register as a verified candidate, your name,
                municipality, and platform summary will be publicly displayed
              </li>
              <li>
                <strong>Legal Requirements:</strong> When required by law or to protect our legal rights
              </li>
              <li>
                <strong>Service Providers:</strong> With trusted service providers (e.g., Supabase) who assist in
                operating our platform
              </li>
              <li>
                <strong>Civic Research:</strong> Aggregated, anonymized data for municipal democracy research
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">5. Data Security</h2>
            <p className="leading-relaxed">
              We implement industry-standard security measures including encryption, secure authentication via Supabase,
              password hashing, and Row Level Security (RLS) policies to protect your data. However, no method of
              transmission over the internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">6. Your Rights</h2>
            <p className="leading-relaxed mb-4">
              Under Canadian privacy laws (PIPEDA) and applicable provincial legislation, you have the right to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your account and data</li>
              <li>Opt-out of communications</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">7. Children's Privacy</h2>
            <p className="leading-relaxed">
              Our platform is designed for millennial voters aged 18+ to maximize civic participation through digital engagement. We do
              not knowingly collect information from individuals under 16 without parental consent.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">8. Contact Us</h2>
            <p className="leading-relaxed">
              For privacy-related inquiries, contact us at:
              <br />
              Email: privacy@technicracy.ai
              <br />
              The Next Majority / Technicracy AI
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
