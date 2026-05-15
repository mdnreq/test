"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { ThumbsUp, ThumbsDown } from "lucide-react"

interface VoteButtonsProps {
  proposalId: string
  userId: string
  currentVote?: boolean
}

export function VoteButtons({ proposalId, userId, currentVote }: VoteButtonsProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleVote = async (vote: boolean) => {
    setIsLoading(true)
    const supabase = createClient()

    try {
      // Remove existing vote if any
      if (currentVote !== undefined) {
        await supabase.from("proposal_votes").delete().eq("proposal_id", proposalId).eq("user_id", userId)

        // Update vote counts
        if (currentVote) {
          await supabase.rpc("decrement_votes_for", { proposal_id: proposalId })
        } else {
          await supabase.rpc("decrement_votes_against", { proposal_id: proposalId })
        }
      }

      // Add new vote if different from current or if no vote existed
      if (currentVote === undefined || currentVote !== vote) {
        await supabase.from("proposal_votes").insert({
          proposal_id: proposalId,
          user_id: userId,
          vote,
        })

        // Update vote counts
        if (vote) {
          await supabase.rpc("increment_votes_for", { proposal_id: proposalId })
        } else {
          await supabase.rpc("increment_votes_against", { proposal_id: proposalId })
        }
      }

      router.refresh()
    } catch (error) {
      console.error("Error voting:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex gap-2">
      <Button
        variant={currentVote === true ? "default" : "outline"}
        className="flex-1"
        onClick={() => handleVote(true)}
        disabled={isLoading}
      >
        <ThumbsUp className="mr-2 h-4 w-4" />
        Support
      </Button>
      <Button
        variant={currentVote === false ? "default" : "outline"}
        className="flex-1"
        onClick={() => handleVote(false)}
        disabled={isLoading}
      >
        <ThumbsDown className="mr-2 h-4 w-4" />
        Oppose
      </Button>
    </div>
  )
}
