"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, Loader2, CheckCircle } from "lucide-react"

interface PaymentMethod {
  id: string
  last4: string
  brand: string
  expiryMonth: number
  expiryYear: number
  isDefault: boolean
}

export function PaymentSetup() {
  const [loading, setLoading] = useState(false)
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [showForm, setShowForm] = useState(false)
  const [cardNumber, setCardNumber] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvc, setCvc] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleAddPaymentMethod = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      if (!cardNumber || !expiryDate || !cvc) {
        setError("Please fill in all fields")
        return
      }

      // TODO: Replace with actual Stripe/payment processor integration
      // For now, simulate adding a payment method
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newMethod: PaymentMethod = {
        id: `pm_${Date.now()}`,
        last4: cardNumber.slice(-4),
        brand: "Visa", // Would be detected from Stripe
        expiryMonth: parseInt(expiryDate.split("/")[0]),
        expiryYear: parseInt(expiryDate.split("/")[1]),
        isDefault: paymentMethods.length === 0,
      }

      setPaymentMethods([...paymentMethods, newMethod])
      setSuccess("Payment method added successfully!")
      setCardNumber("")
      setExpiryDate("")
      setCvc("")
      setShowForm(false)

      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add payment method")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-slate-700 bg-slate-900/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Methods
          </CardTitle>
          <CardDescription>Manage your payment methods for subscriptions and services</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Existing Payment Methods */}
          {paymentMethods.length > 0 ? (
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <div key={method.id} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg border border-slate-700">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-slate-400" />
                    <div>
                      <p className="font-medium text-white">
                        {method.brand} ending in {method.last4}
                      </p>
                      <p className="text-sm text-slate-400">
                        Expires {method.expiryMonth}/{method.expiryYear}
                      </p>
                    </div>
                  </div>
                  {method.isDefault && (
                    <span className="text-xs font-semibold bg-primary/20 text-primary px-2 py-1 rounded">Default</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-sm">No payment methods added yet</p>
          )}

          {/* Add Payment Method Form */}
          {showForm ? (
            <form onSubmit={handleAddPaymentMethod} className="space-y-4 pt-4 border-t border-slate-700">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-100">Card Number</label>
                <input
                  type="text"
                  placeholder="4111 1111 1111 1111"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, "").slice(0, 16))}
                  maxLength={19}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-primary"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-100">Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={expiryDate}
                    onChange={(e) => {
                      let val = e.target.value.replace(/\D/g, "").slice(0, 4)
                      if (val.length >= 2) {
                        val = val.slice(0, 2) + "/" + val.slice(2)
                      }
                      setExpiryDate(val)
                    }}
                    maxLength={5}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-primary"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-100">CVC</label>
                  <input
                    type="text"
                    placeholder="123"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    maxLength={4}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-primary"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-300 text-sm">{error}</div>
              )}

              {success && (
                <div className="p-3 bg-green-900/30 border border-green-700 rounded-lg text-green-300 text-sm flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  {success}
                </div>
              )}

              <div className="flex gap-2">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Add Card"
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <Button onClick={() => setShowForm(true)} className="w-full">
              Add Payment Method
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Billing Information Card */}
      <Card className="border-slate-700 bg-slate-900/50">
        <CardHeader>
          <CardTitle>Billing Information</CardTitle>
          <CardDescription>Update your billing address and information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Full Name"
              className="px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder:text-slate-400"
            />
            <input
              type="email"
              placeholder="Email Address"
              className="px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder:text-slate-400"
            />
            <input
              type="text"
              placeholder="Address"
              className="md:col-span-2 px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder:text-slate-400"
            />
            <input
              type="text"
              placeholder="City"
              className="px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder:text-slate-400"
            />
            <input
              type="text"
              placeholder="Postal Code"
              className="px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder:text-slate-400"
            />
          </div>
          <Button className="w-full">Save Billing Information</Button>
        </CardContent>
      </Card>
    </div>
  )
}
