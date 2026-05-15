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

interface Municipality {
  id: string
  name: string
  province: string
}

interface CreateProposalFormProps {
  municipalities: Municipality[]
  userId: string
}

export function CreateProposalForm({ municipalities, userId }: CreateProposalFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const supabase = createClient()

    const expiresInDays = Number.parseInt(formData.get("expiresInDays") as string)
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + expiresInDays)

    try {
      const { error } = await supabase.from("governance_proposals").insert({
        created_by: userId,
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        proposal_type: formData.get("proposalType") as string,
        municipality_id: formData.get("municipality") as string,
        expires_at: expiresAt.toISOString(),
        status: "Active",
      })

      if (error) throw error

      router.push("/governance")
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Proposal Details</CardTitle>
        <CardDescription>All proposals are reviewed by the community</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="title">Proposal Title</Label>
            <Input id="title" name="title" placeholder="Implement Votes at 16 initiative" required />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              rows={6}
              placeholder="Describe your proposal in detail..."
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="proposalType">Proposal Type</Label>
            <Select name="proposalType" required>
              <SelectTrigger>
                <SelectValue placeholder="Select proposal type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Policy Change">Policy Change</SelectItem>
                <SelectItem value="Budget Allocation">Budget Allocation</SelectItem>
                <SelectItem value="Municipal Initiative">Municipal Initiative</SelectItem>
                <SelectItem value="Youth Program">Youth Program</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="municipality">Municipality</Label>
            <Select name="municipality" required>
              <SelectTrigger>
                <SelectValue placeholder="Select municipality" />
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
            <Label htmlFor="expiresInDays">Voting Period (days)</Label>
            <Select name="expiresInDays" defaultValue="30" required>
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 days</SelectItem>
                <SelectItem value="14">14 days</SelectItem>
                <SelectItem value="30">30 days</SelectItem>
                <SelectItem value="60">60 days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Proposal"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
