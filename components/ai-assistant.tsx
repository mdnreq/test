"use client"

import { useState, useRef, useEffect, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MessageCircle, X, Send, Bot, User, Sparkles, Vote, Users, Scale, MapPin } from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

const suggestedQuestions = [
  { icon: Vote, text: "How does Votes at 16 work?", category: "Education" },
  { icon: Users, text: "How do I register as a candidate?", category: "Platform" },
  { icon: Scale, text: "What are campaign finance rules?", category: "Legal" },
  { icon: MapPin, text: "Find municipalities in Ontario", category: "Navigation" },
]

// Fallback responses when AI is unavailable
const fallbackResponses: Record<string, string> = {
  "votes at 16": `**Votes at 16** is a movement to lower the municipal voting age from 18 to 16.

**Key facts:**
- Already enacted in Scotland (2015) and Wales (2020)
- In Canada, provinces have jurisdiction over municipal elections under Constitution Act, 1867 (s. 92)
- Bill S-201 has been proposed federally
- The Next Majority supports candidates who endorse lowering the municipal voting age to 16

**Why it matters:**
- Research shows early voting creates lifelong civic habits
- 2.5x lifetime engagement multiplier when youth vote while still in school
- Addresses declining municipal voter turnout (currently ~33%)`,
  
  "register": `**How to Register as a Candidate:**

1. **Create an Account** - Sign up at /auth/sign-up
2. **Select "I am registering as a municipal candidate"**
3. **Provide Details:**
   - Full name
   - Birth year (must be Gen X or younger, under 59)
   - Province/Territory
   - Municipality
4. **Pledge Support** - Confirm you support Votes at 16
5. **Verify Email** - Check your inbox for verification link

Once verified, you'll get access to campaign services ($395-$995/month).`,

  "campaign finance": `**Campaign Finance Rules in Canada:**

Rules vary by province, but general guidelines:

**Ontario:**
- Contribution limits: $1,200 from individuals
- No corporate/union donations
- Must file financial statements

**Key Requirements:**
- Register as a candidate with your municipality
- Appoint a financial agent
- Keep detailed records
- File disclosure reports by deadline

Visit your provincial elections website for specific rules.`,

  "ontario": `**Ontario Municipalities:**

Ontario has **444 municipalities** including:
- Cities: Toronto, Ottawa, Mississauga, Hamilton, London, etc.
- Towns: Oakville, Milton, Ajax, etc.
- Townships and counties

Use our Municipalities page to search and filter all Ontario municipalities.

**Next Election:** October 2026`,

  "default": `I'm The Next Majority AI Assistant! I can help with:

**Campaign Strategy** - Messaging, outreach, Gen Z/Millennial engagement
**Voter Education** - Municipal elections, Votes at 16, councillor roles  
**Legal Compliance** - Campaign finance, regulations, deadlines
**Platform Navigation** - Finding municipalities, services, registration

What would you like to know more about?`
}

function getFallbackResponse(query: string): string {
  const lowerQuery = query.toLowerCase()
  
  if (lowerQuery.includes("vote") && lowerQuery.includes("16")) {
    return fallbackResponses["votes at 16"]
  }
  if (lowerQuery.includes("register") || lowerQuery.includes("candidate")) {
    return fallbackResponses["register"]
  }
  if (lowerQuery.includes("finance") || lowerQuery.includes("campaign")) {
    return fallbackResponses["campaign finance"]
  }
  if (lowerQuery.includes("ontario") || lowerQuery.includes("municipalit")) {
    return fallbackResponses["ontario"]
  }
  
  return fallbackResponses["default"]
}

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    }

    const userQuery = input.trim()
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      console.log("[v0] Response status:", response.status)

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "",
      }

      setMessages((prev) => [...prev, assistantMessage])

      if (reader) {
        let fullContent = ""
        let buffer = ""
        
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          
          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split("\n")
          buffer = lines.pop() || ""
          
          for (const line of lines) {
            const trimmed = line.trim()
            
            // Handle SSE data format from toUIMessageStreamResponse
            if (trimmed.startsWith("data:")) {
              const data = trimmed.slice(5).trim()
              if (data === "[DONE]") continue
              
              try {
                const parsed = JSON.parse(data)
                
                // Handle text-delta chunks
                if (parsed.type === "text-delta" && parsed.delta) {
                  fullContent += parsed.delta
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === assistantMessage.id ? { ...m, content: fullContent } : m
                    )
                  )
                }
              } catch {
                // Skip invalid JSON
              }
            }
            // Also handle old data stream format: 0:"text" as fallback
            else if (trimmed.startsWith("0:")) {
              try {
                const text = JSON.parse(trimmed.slice(2))
                fullContent += text
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMessage.id ? { ...m, content: fullContent } : m
                  )
                )
              } catch {
                // Skip
              }
            }
          }
        }
        
        // If no content was received, use fallback
        if (!fullContent.trim()) {
          throw new Error("Empty response")
        }
      }
    } catch (error) {
      console.error("[v0] Chat error:", error)
      
      // Use fallback response
      const fallbackContent = getFallbackResponse(userQuery)
      setMessages((prev) => [
        ...prev.filter(m => m.role === "user" || m.content), // Remove empty assistant message
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: fallbackContent,
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestedQuestion = (question: string) => {
    if (isLoading) return
    setInput(question)
  }

  return (
    <>
      {/* Floating Chat Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center ${
          isOpen 
            ? "bg-gray-700 hover:bg-gray-600" 
            : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500"
        }`}
        aria-label={isOpen ? "Close chat" : "Open AI Assistant"}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 z-50 w-[380px] h-[550px] bg-[#0a0a0a] border border-gray-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-b border-gray-800 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">TNM Assistant</h3>
                <p className="text-xs text-gray-400">Campaign Strategy & Voter Education</p>
              </div>
              <div className="ml-auto flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-gray-400">Online</span>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="space-y-4">
                {/* Welcome Message */}
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-gray-800/50 rounded-2xl rounded-tl-none p-3 max-w-[280px]">
                    <p className="text-sm text-gray-200">
                      Welcome to The Next Majority! I can help with:
                    </p>
                    <ul className="text-sm text-gray-400 mt-2 space-y-1">
                      <li className="flex items-center gap-2">
                        <Sparkles className="w-3 h-3 text-blue-400" />
                        Campaign strategy
                      </li>
                      <li className="flex items-center gap-2">
                        <Sparkles className="w-3 h-3 text-purple-400" />
                        Voter education
                      </li>
                      <li className="flex items-center gap-2">
                        <Sparkles className="w-3 h-3 text-cyan-400" />
                        Legal compliance
                      </li>
                      <li className="flex items-center gap-2">
                        <Sparkles className="w-3 h-3 text-green-400" />
                        Platform navigation
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Suggested Questions */}
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Suggested Questions</p>
                  <div className="grid grid-cols-1 gap-2">
                    {suggestedQuestions.map((q, i) => (
                      <button
                        type="button"
                        key={i}
                        onClick={() => handleSuggestedQuestion(q.text)}
                        className="flex items-center gap-2 p-2 rounded-lg bg-gray-800/30 hover:bg-gray-800/60 transition-colors text-left group"
                      >
                        <q.icon className="w-4 h-4 text-gray-500 group-hover:text-blue-400 transition-colors" />
                        <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{q.text}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === "user"
                        ? "bg-blue-600"
                        : "bg-gradient-to-r from-blue-600 to-purple-600"
                    }`}
                  >
                    {message.role === "user" ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div
                    className={`rounded-2xl p-3 max-w-[280px] ${
                      message.role === "user"
                        ? "bg-blue-600 text-white rounded-tr-none"
                        : "bg-gray-800/50 text-gray-200 rounded-tl-none"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content || "..."}</p>
                  </div>
                </div>
              ))
            )}
            
            {/* Loading indicator */}
            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-gray-800/50 rounded-2xl rounded-tl-none p-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-800">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                disabled={isLoading}
                className="flex-1 bg-gray-800/50 border border-gray-700 rounded-full px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50"
              />
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim() || isLoading}
                className="rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 text-center mt-2">
              Powered by Llama 3.3 via Groq
            </p>
          </form>
        </Card>
      )}
    </>
  )
}
