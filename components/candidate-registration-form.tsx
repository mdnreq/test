"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

interface Municipality {
  id: string
  name: string
  province: string
}

interface CandidateRegistrationFormProps {
  municipalities: Municipality[]
  userId: string
}

function getGeneration(birthYear: number): string {
  if (birthYear >= 2013) return "Gen Alpha"
  if (birthYear >= 1997) return "Gen Z"
  if (birthYear >= 1981) return "Millennial"
  if (birthYear >= 1965) return "Gen X"
  if (birthYear >= 1946) return "Boomer"
  return "Silent Generation"
}

export function CandidateRegistrationForm({ municipalities, userId }: CandidateRegistrationFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [birthYear, setBirthYear] = useState<number | null>(null)
  const [generation, setGeneration] = useState<string | null>(null)
  const [supportsVotesAt16, setSupportsVotesAt16] = useState(false)

  const handleBirthYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const year = Number.parseInt(e.target.value)
    if (year && year > 1900 && year <= new Date().getFullYear() - 18) {
      setBirthYear(year)
      const gen = getGeneration(year)
      setGeneration(gen)

      // Check if candidate is a Boomer
      if (year >= 1946 && year <= 1964) {
        setError(
          "The Next Majority platform is focused on youth-led municipal governance. Candidates must be from Gen X or younger generations.",
        )
      } else {
        setError(null)
      }
    } else {
      setBirthYear(null)
      setGeneration(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (!birthYear || birthYear < 1965) {
      setError(
        "Only candidates from Gen X, Millennials, Gen Z, and Gen Alpha are eligible for The Next Majority platform.",
      )
      setIsLoading(false)
      return
    }

    if (!supportsVotesAt16) {
      setError("Candidates must support lowering the municipal voting age to 16.")
      setIsLoading(false)
      return
    }

    const formData = new FormData(e.currentTarget)
    const supabase = createClient()

    try {
      const { error } = await supabase.from("candidates").insert({
        user_id: userId,
        full_name: formData.get("fullName") as string,
        email: formData.get("email") as string,
        municipality_id: formData.get("municipality") as string,
        position: formData.get("position") as string,
        platform_summary: formData.get("platformSummary") as string,
        birth_year: birthYear,
        generation: generation,
        supports_votes_at_16: supportsVotesAt16,
        verified: false,
      })

      if (error) throw error

      router.push("/candidates")
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Candidate Information</CardTitle>
        <CardDescription>All information will be reviewed before being published</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" name="fullName" required />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="birthYear">Birth Year</Label>
            <Input
              id="birthYear"
              name="birthYear"
              type="number"
              min="1965"
              max={new Date().getFullYear() - 18}
              placeholder="YYYY"
              onChange={handleBirthYearChange}
              required
            />
            {generation && (
              <p className="text-sm text-muted-foreground">
                Generation: <span className="font-semibold text-blue-400">{generation}</span>
                {generation !== "Boomer" && " ✓ Eligible"}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="municipality">Municipality</Label>
            <Select name="municipality" required>
              <SelectTrigger>
                <SelectValue placeholder="Select your municipality" />
              </SelectTrigger>
              <SelectContent>
                {municipalities.map((municipality) => (
                  <SelectItem key={municipality.id} value={municipality.id}>
                    {municipality.name}, {municipality.province}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="position">Position</Label>
            <Select name="position" required>
              <SelectTrigger>
                <SelectValue placeholder="Select position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Mayor">Mayor</SelectItem>
                <SelectItem value="Deputy Mayor">Deputy Mayor</SelectItem>
                <SelectItem value="Councillor">Councillor</SelectItem>
                <SelectItem value="Regional Councillor">Regional Councillor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-start space-x-3 space-y-0 rounded-md border border-blue-500/50 bg-blue-500/10 p-4">
            <Checkbox
              id="votesAt16"
              checked={supportsVotesAt16}
              onCheckedChange={(checked) => setSupportsVotesAt16(checked as boolean)}
              required
            />
            <div className="space-y-1 leading-none">
              <Label htmlFor="votesAt16" className="font-semibold text-sm cursor-pointer">
                I support lowering the municipal voting age to 16
              </Label>
              <p className="text-sm text-muted-foreground">
                Required: The Next Majority platform advocates for millennial engagement to create a 1.8X digital engagement
                multiplier and reverse the municipal turnout crisis.
              </p>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="platformSummary">Platform Summary</Label>
            <Textarea
              id="platformSummary"
              name="platformSummary"
              rows={6}
              placeholder="Describe your platform and key priorities... Please mention your vision for millennial voter mobilization and how digital engagement fits into your municipal strategy."
              required
            />
          </div>

          {error && (
            <div className="rounded-md bg-red-500/10 border border-red-500/50 p-3">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !birthYear || birthYear < 1965 || !supportsVotesAt16}
          >
            {isLoading ? "Submitting..." : "Submit for Verification"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
