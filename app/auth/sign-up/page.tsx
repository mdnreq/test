"use client"

import { Suspense, type ReactNode } from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { CAMPAIGN_PACKAGE_PRESETS } from "@/lib/campaign-package-presets"

function SignUpPageContent() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [birthYear, setBirthYear] = useState("")
  const [province, setProvince] = useState("")
  const [municipality, setMunicipality] = useState("")
  const [isCandidate, setIsCandidate] = useState(false)
  const [isYouthVoter, setIsYouthVoter] = useState(false)
  const [supportsVotesAt16, setSupportsVotesAt16] = useState(false)
  const [municipalities, setMunicipalities] = useState<Array<{ id: string; name: string }>>([])
  const [generation, setGeneration] = useState("")
  const [isEligible, setIsEligible] = useState(true)
  const [votingAge, setVotingAge] = useState(0)
  const [canVoteAt16, setCanVoteAt16] = useState(false)
  const [isGovEmail, setIsGovEmail] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedTemplateId = searchParams.get("template")
  const selectedTemplate = CAMPAIGN_PACKAGE_PRESETS.find((preset) => preset.id === selectedTemplateId)

  const provinces = [
    "Ontario",
    "PEI",
    "Manitoba",
    "New Brunswick",
    "British Columbia",
    "Saskatchewan",
    "Northwest Territories",
  ]

  const completedProvinces = ["New Brunswick"]

  const validateGovEmail = (email: string): boolean => {
    const govDomains = [
      // Federal
      ".gc.ca",
      // Provincial/Territorial
      ".gov.on.ca",
      ".ontario.ca", // Ontario
      ".gov.pe.ca", // PEI
      ".gov.mb.ca", // Manitoba
      ".gnb.ca",
      ".gov.nb.ca", // New Brunswick
      ".gov.bc.ca", // British Columbia
      ".gov.sk.ca", // Saskatchewan
      ".gov.nt.ca", // Northwest Territories
      // Municipal patterns
      ".city.",
      ".town.",
      ".municipality.",
      // Common municipal suffixes
      "toronto.ca",
      "ottawa.ca",
      "vancouver.ca",
      "calgary.ca",
      "edmonton.ca",
      "winnipeg.ca",
      "saskatoon.ca",
      "regina.ca",
      "charlottetown.ca",
      "fredericton.ca",
      "moncton.ca",
      "halifax.ca",
      "victoria.bc.ca",
    ]

    const emailLower = email.toLowerCase()
    return govDomains.some((domain) => emailLower.includes(domain))
  }

  useEffect(() => {
    if (birthYear) {
      const year = Number.parseInt(birthYear)
      const currentYear = new Date().getFullYear()
      const age = currentYear - year
      setVotingAge(age)
      setCanVoteAt16(age >= 16)

      if (year >= 2013) {
        setGeneration("Gen Alpha (2013+)")
        setIsEligible(true)
      } else if (year >= 1997) {
        setGeneration("Gen Z (1997-2012)")
        setIsEligible(true)
      } else if (year >= 1981) {
        setGeneration("Millennial (1981-1996)")
        setIsEligible(true)
      } else if (year >= 1965) {
        setGeneration("Gen X (1965-1980)")
        setIsEligible(true)
      } else {
        setGeneration("Boomer (before 1965)")
        setIsEligible(false)
      }
    }
  }, [birthYear])

  useEffect(() => {
    if (province && (isCandidate || isYouthVoter)) {
      const fetchMunicipalities = async () => {
        const supabase = createClient()
        const { data } = await supabase.from("municipalities").select("id, name").eq("province", province).order("name")
        if (data) setMunicipalities(data)
      }
      fetchMunicipalities()
    }
  }, [province, isCandidate, isYouthVoter])

  useEffect(() => {
    if (isCandidate && email) {
      setIsGovEmail(validateGovEmail(email))
    }
  }, [email, isCandidate])

  useEffect(() => {
    if (selectedTemplate) {
      setIsCandidate(true)
      setIsYouthVoter(false)
    }
  }, [selectedTemplate])

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isCandidate) {
      if (!isEligible) {
        setError("The Next Majority platform is youth-led. Candidates must be Gen X or younger.")
        return
      }
      if (!supportsVotesAt16) {
        setError("You must support lowering the municipal voting age to 16 to register as a candidate.")
        return
      }
      if (!province || !municipality) {
        setError("Please select your province and municipality.")
        return
      }
    }

    if (isYouthVoter) {
      if (!canVoteAt16) {
        setError("Youth voter registration is for voters aged 16 and above.")
        return
      }
      if (!province || !municipality) {
        setError("Please select your province and municipality.")
        return
      }
    }

    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
          data: {
            full_name: fullName,
            birth_year: birthYear ? Number.parseInt(birthYear) : null,
            generation,
            is_candidate: isCandidate,
            is_youth_voter: isYouthVoter,
            voting_age: votingAge,
            supports_votes_at_16: supportsVotesAt16,
            province,
            municipality_id: municipality,
            selected_campaign_template: selectedTemplate?.id ?? null,
            selected_campaign_template_label: selectedTemplate?.label ?? null,
          },
        },
      })

      if (authError) throw authError

      if (isCandidate && authData.user) {
        const { error: candidateError } = await supabase.rpc("register_candidate", {
          p_user_id: authData.user.id,
          p_full_name: fullName,
          p_email: email,
          p_municipality_id: municipality,
          p_position: "Municipal Candidate",
          p_platform_summary: `Supporting Votes at 16 and youth engagement. ${generation} candidate committed to 2.5X lifetime engagement multiplier.`,
        })

        if (candidateError) {
          console.error("[v0] Error inserting candidate:", candidateError)
        }
      }

      router.push("/auth/check-email")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center p-4">
      {/* Background gradient effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-lg">
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Join The Next Majority</CardTitle>
            <CardDescription>Create your account to participate in municipal democracy</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp}>
              <div className="flex flex-col gap-6">
                <div className="space-y-3">
                  {selectedTemplate && (
                    <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-4">
                      <p className="text-sm font-medium text-blue-200">Campaign template selected</p>
                      <p className="mt-1 text-sm text-foreground">{selectedTemplate.label}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        This candidate account will be tagged with the selected campaign template so the portal setup flow knows which starting plan was chosen.
                      </p>
                    </div>
                  )}

                  <div className="flex items-center space-x-2 rounded-lg border-2 border-border bg-muted/50 p-4 hover:bg-muted transition-colors">
                    <Checkbox
                      id="isCandidate"
                      checked={isCandidate}
                      onCheckedChange={(checked) => {
                        setIsCandidate(checked === true)
                        if (checked) setIsYouthVoter(false)
                      }}
                    />
                    <Label htmlFor="isCandidate" className="text-sm font-medium leading-none cursor-pointer flex-1">
                      I am registering as a municipal candidate
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 rounded-lg border-2 border-border bg-muted/50 p-4 hover:bg-muted transition-colors">
                    <Checkbox
                      id="isYouthVoter"
                      checked={isYouthVoter}
                      onCheckedChange={(checked) => {
                        setIsYouthVoter(checked === true)
                        if (checked) setIsCandidate(false)
                      }}
                    />
                    <Label htmlFor="isYouthVoter" className="text-sm font-medium leading-none cursor-pointer flex-1">
                      I am a youth voter (ages 16+)
                    </Label>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="citizen@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />

                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                {isCandidate && (
                  <div className="space-y-6 rounded-lg border-2 border-blue-500/50 bg-blue-950/30 p-6">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                      <div className="text-sm font-semibold text-blue-400">Candidate Registration Details</div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="birthYear">Birth Year *</Label>
                      <Input
                        id="birthYear"
                        type="number"
                        placeholder="1990"
                        min="1940"
                        max={new Date().getFullYear()}
                        required
                        value={birthYear}
                        onChange={(e) => setBirthYear(e.target.value)}
                      />
                      {birthYear && (
                        <div
                          className={`flex items-center gap-2 rounded-md p-3 text-sm ${
                            isEligible ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                          }`}
                        >
                          {isEligible ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                          <span>
                            {generation} - {isEligible ? "Eligible" : "Not eligible for youth-led platform"}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="province">Province/Territory *</Label>
                      <Select value={province} onValueChange={setProvince} required>
                        <SelectTrigger id="province">
                          <SelectValue placeholder="Select province" />
                        </SelectTrigger>
                        <SelectContent>
                          {provinces.map((prov) => (
                            <SelectItem key={prov} value={prov} disabled={completedProvinces.includes(prov)}>
                              <div className="flex items-center gap-2">
                                {completedProvinces.includes(prov) && (
                                  <span className="text-red-500 font-bold">●</span>
                                )}
                                {prov}
                                {completedProvinces.includes(prov) && (
                                  <span className="text-xs text-red-500 ml-1">(Completed)</span>
                                )}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {province && (
                      <div className="grid gap-2">
                        <Label htmlFor="municipality">Municipality *</Label>
                        <Select value={municipality} onValueChange={setMunicipality} required>
                          <SelectTrigger id="municipality">
                            <SelectValue placeholder="Select municipality" />
                          </SelectTrigger>
                          <SelectContent>
                            {municipalities.map((mun) => (
                              <SelectItem key={mun.id} value={mun.id}>
                                {mun.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div className="flex items-start space-x-2 rounded-lg border border-blue-500/50 bg-blue-500/10 p-4">
                      <Checkbox
                        id="supportsVotesAt16"
                        checked={supportsVotesAt16}
                        onCheckedChange={(checked) => setSupportsVotesAt16(checked === true)}
                        required
                      />
                      <div className="grid gap-1.5 leading-none">
                        <Label htmlFor="supportsVotesAt16" className="text-sm font-medium leading-none cursor-pointer">
                          I support lowering the municipal voting age to 16 *
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Required for all candidates. Creates 2.5X lifetime engagement multiplier.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {isYouthVoter && (
                  <div className="space-y-6 rounded-lg border-2 border-green-500/50 bg-green-950/30 p-6">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                      <div className="text-sm font-semibold text-green-400">Youth Voter Registration (16+)</div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="voterBirthYear">Birth Year *</Label>
                      <Input
                        id="voterBirthYear"
                        type="number"
                        placeholder="2008"
                        min="1940"
                        max={new Date().getFullYear()}
                        required
                        value={birthYear}
                        onChange={(e) => setBirthYear(e.target.value)}
                      />
                      {birthYear && (
                        <div
                          className={`flex items-center gap-2 rounded-md p-3 text-sm ${
                            canVoteAt16 ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                          }`}
                        >
                          {canVoteAt16 ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                          <span>
                            Age {votingAge} -{" "}
                            {canVoteAt16 ? "Eligible for Votes at 16" : "Not yet eligible (must be 16+)"}
                          </span>
                        </div>
                      )}
                      {canVoteAt16 && birthYear && (
                        <div className="rounded-md bg-blue-500/10 p-3 text-xs text-blue-400">
                          <strong>2.5X Engagement Multiplier:</strong> Voting at 16 creates lifetime civic habits.
                          You're part of the movement!
                        </div>
                      )}
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="voterProvince">Province/Territory *</Label>
                      <Select value={province} onValueChange={setProvince} required>
                        <SelectTrigger id="voterProvince">
                          <SelectValue placeholder="Select province" />
                        </SelectTrigger>
                        <SelectContent>
                          {provinces.map((prov) => (
                            <SelectItem key={prov} value={prov} disabled={completedProvinces.includes(prov)}>
                              <div className="flex items-center gap-2">
                                {completedProvinces.includes(prov) && (
                                  <span className="text-red-500 font-bold">●</span>
                                )}
                                {prov}
                                {completedProvinces.includes(prov) && (
                                  <span className="text-xs text-red-500 ml-1">(Completed)</span>
                                )}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {province && (
                      <div className="grid gap-2">
                        <Label htmlFor="voterMunicipality">Municipality *</Label>
                        <Select value={municipality} onValueChange={setMunicipality} required>
                          <SelectTrigger id="voterMunicipality">
                            <SelectValue placeholder="Select municipality" />
                          </SelectTrigger>
                          <SelectContent>
                            {municipalities.map((mun) => (
                              <SelectItem key={mun.id} value={mun.id}>
                                {mun.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div className="rounded-lg border border-green-500/50 bg-green-500/10 p-4 text-sm text-green-400">
                      <strong>Why register?</strong>
                      <ul className="mt-2 ml-4 list-disc space-y-1 text-xs">
                        <li>Track municipal elections in your area</li>
                        <li>Connect with youth-led candidates</li>
                        <li>Vote on DAO governance proposals</li>
                        <li>Access civic education resources</li>
                      </ul>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="flex items-center gap-2 rounded-md bg-red-500/10 p-3 text-sm text-red-500">
                    <AlertCircle className="h-4 w-4" />
                    <p>{error}</p>
                  </div>
                )}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={
                    isLoading ||
                    (isCandidate && (!isEligible || !supportsVotesAt16)) ||
                    (isYouthVoter && !canVoteAt16)
                  }
                >
                  {isLoading
                    ? "Creating account..."
                    : isCandidate
                      ? "Register as Candidate"
                      : isYouthVoter
                        ? "Register as Youth Voter"
                        : "Sign up"}
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link href="/auth/login" className="underline underline-offset-4">
                  Login
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function SignUpPage() {
  return (
    <Suspense fallback={null as ReactNode}>
      <SignUpPageContent />
    </Suspense>
  )
}
