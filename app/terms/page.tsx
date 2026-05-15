export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black mb-4">Terms of Service</h1>
        <p className="text-muted-foreground mb-8">Last Updated: January 14, 2026</p>

        <div className="space-y-8 text-foreground">
          <section>
            <h2 className="text-2xl font-bold mb-3">1. Acceptance of Terms</h2>
            <p className="leading-relaxed">
              By accessing or using The Next Majority platform ("Platform"), you agree to be bound by these Terms of
              Service ("Terms"). If you do not agree to these Terms, do not use the Platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">2. Platform Purpose</h2>
            <p className="leading-relaxed">
              The Next Majority is a civic engagement platform operated by Technicracy AI designed to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Facilitate municipal democracy and voter engagement</li>
              <li>Provide verified candidate registry for municipal elections</li>
              <li>Enable DAO-based governance for civic initiatives</li>
              <li>Advocate for lowering the municipal voting age to 16</li>
              <li>Track and analyze municipal voter turnout data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">3. User Eligibility and Registration</h2>
            <h3 className="text-xl font-semibold mt-4 mb-2">3.1 Age Requirements</h3>
            <p className="leading-relaxed">You must be at least 16 years old to create an account.</p>

            <h3 className="text-xl font-semibold mt-4 mb-2">3.2 Candidate Registration</h3>
            <p className="leading-relaxed mb-2">To register as a verified candidate, you must:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Be born in 1965 or later (Gen X or younger)</li>
              <li>Support lowering the municipal voting age to 16</li>
              <li>Provide accurate municipality and riding information</li>
              <li>Comply with applicable municipal election laws</li>
            </ul>

            <h3 className="text-xl font-semibold mt-4 mb-2">3.3 Account Security</h3>
            <p className="leading-relaxed">
              You are responsible for maintaining the confidentiality of your account credentials and all activities
              under your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">4. Prohibited Conduct</h2>
            <p className="leading-relaxed mb-2">You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide false or misleading information</li>
              <li>Impersonate any person or entity</li>
              <li>Engage in harassment, hate speech, or discriminatory behavior</li>
              <li>Attempt to manipulate voting or governance processes</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Use automated systems (bots) to access the Platform</li>
              <li>Interfere with the Platform's security or functionality</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">5. Content and Intellectual Property</h2>
            <h3 className="text-xl font-semibold mt-4 mb-2">5.1 User Content</h3>
            <p className="leading-relaxed">
              You retain ownership of content you submit (candidate platforms, governance proposals). By submitting
              content, you grant us a non-exclusive license to display and distribute it on the Platform.
            </p>

            <h3 className="text-xl font-semibold mt-4 mb-2">5.2 Platform Content</h3>
            <p className="leading-relaxed">
              All Platform content, including design, code, data visualizations, and branding, is owned by Technicracy
              AI and protected by copyright laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">6. Disclaimers and Limitations of Liability</h2>
            <h3 className="text-xl font-semibold mt-4 mb-2">6.1 No Warranty</h3>
            <p className="leading-relaxed">
              THE PLATFORM IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. We do not guarantee
              accuracy, completeness, or reliability of information.
            </p>

            <h3 className="text-xl font-semibold mt-4 mb-2">6.2 Not Legal or Political Advice</h3>
            <p className="leading-relaxed">
              The Platform provides civic engagement tools and data but does not constitute legal, political, or
              professional advice. Users should consult appropriate professionals.
            </p>

            <h3 className="text-xl font-semibold mt-4 mb-2">6.3 Data Accuracy</h3>
            <p className="leading-relaxed">
              While we strive for accuracy, we do not guarantee the completeness or timeliness of voter turnout
              statistics or municipal data. Users should verify critical information with official sources.
            </p>

            <h3 className="text-xl font-semibold mt-4 mb-2">6.4 Limitation of Liability</h3>
            <p className="leading-relaxed">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, TECHNICRACY AI SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
              SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE PLATFORM.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">7. Indemnification</h2>
            <p className="leading-relaxed">
              You agree to indemnify and hold harmless Technicracy AI from any claims, damages, or expenses arising from
              your use of the Platform or violation of these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">8. Termination</h2>
            <p className="leading-relaxed">
              We reserve the right to suspend or terminate your account at any time for violation of these Terms or for
              any other reason at our discretion.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">9. Governing Law</h2>
            <p className="leading-relaxed">
              These Terms are governed by the laws of Canada and the applicable provincial jurisdiction. Any disputes
              shall be resolved in the courts of competent jurisdiction.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">10. Changes to Terms</h2>
            <p className="leading-relaxed">
              We may modify these Terms at any time. Continued use of the Platform after changes constitutes acceptance
              of the modified Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">11. Contact</h2>
            <p className="leading-relaxed">
              For questions about these Terms, contact:
              <br />
              Email: legal@technicracy.ai
              <br />
              The Next Majority / Technicracy AI
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
