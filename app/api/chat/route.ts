import { createGroq } from "@ai-sdk/groq"
import { streamText, convertToModelMessages } from "ai"

export const maxDuration = 30

const systemPrompt = `You are the AI Assistant for The Next Majority, a progressive political platform focused on municipal democracy and millennial voter engagement in Canada.

Your knowledge areas:
1. Campaign Strategy: Help candidates with messaging for Gen Z/Millennial voters, canvassing tips, social media content.
2. Voter Education: Explain municipal elections, what councillors do, why Gen Z & millennial engagement matters.
3. Legal/Compliance: Campaign finance rules, election regulations by province.
4. Platform Navigation: Help users find municipalities, understand services.

Key facts:
- Covers 1,690 municipalities across 7 Canadian provinces/territories
- Municipal voter turnout: 32.9% average
- Women representation: 28-31%
- Services: $395-$995/month for campaign tools

Be helpful, concise, and supportive of democratic engagement.`

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()
    console.log("[v0] Chat API called with messages:", messages?.length)

    const apiKey = process.env.GROQ_API_KEY
    
    if (!apiKey) {
      console.log("[v0] No GROQ_API_KEY found")
      return new Response(
        JSON.stringify({ error: "API key not configured" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      )
    }

    const groq = createGroq({ apiKey })

    const result = streamText({
      model: groq("llama-3.3-70b-versatile"),
      system: systemPrompt,
      messages: await convertToModelMessages(messages),
      maxOutputTokens: 500,
    })

    console.log("[v0] Streaming response...")
    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error("[v0] Chat API error:", error)
    return new Response(
      JSON.stringify({ error: "Failed to process request", details: String(error) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
}
