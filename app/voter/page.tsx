import Link from "next/link"
import { ArrowRight, MapPin, MessageSquare } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function VoterAccessPage() {
  return (
    <div className="min-h-screen bg-[#05070a] text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-4 py-12">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/70">Voter Access</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">Voters cannot buy campaign services.</h1>
          <p className="mt-4 text-lg text-white/60">
            Voter accounts are limited to civic participation. Use this area to register your municipality or ward and send proposal requests to the candidates you support.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <Card className="border-white/10 bg-[#0b0f16]">
            <CardHeader>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-300">
                <MapPin className="h-6 w-6" />
              </div>
              <CardTitle className="text-white">Register Your Ward</CardTitle>
              <CardDescription className="text-white/55">
                Set your municipality during sign-up so the platform can place you in the right local election and candidate registry.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-white/65">
                The current voter flow uses municipal registration data from account onboarding. That keeps voters in their ward-level experience instead of the candidate services checkout flow.
              </p>
              <Button asChild className="w-full justify-between bg-white text-black hover:bg-white/90">
                <Link href="/auth/sign-up">
                  Open Ward Registration
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-[#0b0f16]">
            <CardHeader>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-300">
                <MessageSquare className="h-6 w-6" />
              </div>
              <CardTitle className="text-white">Ask Candidates For Proposals</CardTitle>
              <CardDescription className="text-white/55">
                Browse verified candidates, then use the town hall issue flow to request a proposal or local commitment from your ward candidates.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild variant="outline" className="flex-1 border-white/15 bg-transparent text-white hover:bg-white/10">
                  <Link href="/candidates">Browse Candidates</Link>
                </Button>
                <Button asChild className="flex-1 justify-between bg-blue-600 text-white hover:bg-blue-500">
                  <Link href="/governance/town-hall?tab=issues">
                    Request Proposal
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}