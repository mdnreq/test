"use client"

import React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { 
  ArrowLeft,
  Package, 
  Send,
  Loader2,
  CheckCircle,
  AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Service {
  id: string
  name: string
  category: string
}

export default function ServiceRequestPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    serviceId: "",
    priority: "medium",
    notes: ""
  })

  useEffect(() => {
    async function loadData() {
      const supabase = createClient()
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/login?redirect=/candidate-portal/request")
        return
      }
      
      setUserId(user.id)

      // Get candidate's subscribed services
      const { data: subscriptions } = await supabase
        .from("candidate_services")
        .select("service_id, services(id, name, category)")
        .eq("candidate_id", user.id)
        .eq("status", "active")

      if (subscriptions) {
        const serviceList = subscriptions
          .map(s => s.services)
          .filter((s): s is Service => s !== null)
        setServices(serviceList)
      }

      setLoading(false)
    }

    loadData()
  }, [router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!userId || !formData.serviceId) return
    
    setSubmitting(true)
    setError(null)
    
    const supabase = createClient()

    const { error: submitError } = await supabase
      .from("service_requests")
      .insert({
        candidate_id: userId,
        service_id: formData.serviceId,
        priority: formData.priority,
        notes: formData.notes || null,
        status: "pending"
      })

    if (submitError) {
      setError("Failed to submit request. Please try again.")
      setSubmitting(false)
      return
    }

    setSuccess(true)
    setSubmitting(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05070a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-white/70">Loading...</p>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#05070a] flex items-center justify-center px-4">
        <Card className="bg-[#0b0f16] border-white/10 max-w-md w-full">
          <CardContent className="pt-8 pb-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Request Submitted!</h2>
            <p className="text-white/60 mb-6">
              We've received your service request and will get back to you within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/candidate-portal">
                <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500">
                  Back to Dashboard
                </Button>
              </Link>
              <Button 
                variant="outline" 
                onClick={() => { setSuccess(false); setFormData({ serviceId: "", priority: "medium", notes: "" }) }}
                className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10 bg-transparent"
              >
                Submit Another
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#05070a]">
      {/* Header */}
      <div className="border-b border-white/10 bg-[#06080c]">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link href="/candidate-portal">
              <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">
                New Service Request
              </h1>
              <p className="text-white/60 mt-1">
                Submit a request for your subscribed services
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {services.length === 0 ? (
          <Card className="bg-[#0b0f16] border-white/10">
            <CardContent className="py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-white/30" />
              </div>
              <h3 className="text-white text-lg font-semibold mb-2">No Active Services</h3>
              <p className="text-white/60 mb-6">
                You need to subscribe to a service before submitting requests.
              </p>
              <Link href="/candidate-portal/services">
                <Button className="bg-blue-600 hover:bg-blue-500">
                  Browse Services
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-[#0b0f16] border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Request Details</CardTitle>
              <CardDescription className="text-white/50">
                Fill out the form below to submit your service request
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert className="bg-red-500/10 border-red-500/30">
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <AlertDescription className="text-red-400">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="service" className="text-white">Service *</Label>
                  <Select
                    value={formData.serviceId}
                    onValueChange={(value) => setFormData({ ...formData, serviceId: value })}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0b0f16] border-white/10">
                      {services.map((service) => (
                        <SelectItem 
                          key={service.id} 
                          value={service.id}
                          className="text-white hover:bg-white/10 focus:bg-white/10"
                        >
                          {service.name} ({service.category})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority" className="text-white">Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => setFormData({ ...formData, priority: value })}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0b0f16] border-white/10">
                      <SelectItem value="low" className="text-white hover:bg-white/10 focus:bg-white/10">
                        Low - Can wait a few days
                      </SelectItem>
                      <SelectItem value="medium" className="text-white hover:bg-white/10 focus:bg-white/10">
                        Medium - Standard timeline
                      </SelectItem>
                      <SelectItem value="high" className="text-white hover:bg-white/10 focus:bg-white/10">
                        High - Urgent, need ASAP
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-white">Request Details</Label>
                  <Textarea
                    id="notes"
                    placeholder="Describe what you need, any specific requirements, deadlines, etc."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40 min-h-[150px]"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={!formData.serviceId || submitting}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Submit Request
                      </>
                    )}
                  </Button>
                  <Link href="/candidate-portal" className="flex-1 sm:flex-none">
                    <Button 
                      type="button"
                      variant="outline" 
                      className="w-full border-white/20 text-white hover:bg-white/10 bg-transparent"
                    >
                      Cancel
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
