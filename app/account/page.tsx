"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PaymentSetup } from "@/components/payment-setup"
import { User, Lock, Bell, CreditCard } from "lucide-react"

type TabType = "profile" | "security" | "billing" | "notifications"

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<TabType>("profile")
  const [user] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 (555) 000-0000",
  })

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Lock },
    { id: "billing", label: "Billing", icon: CreditCard },
    { id: "notifications", label: "Notifications", icon: Bell },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Account Settings</h1>
          <p className="text-slate-400">Manage your account preferences and settings</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 md:gap-4 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-primary text-white"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <Card className="border-slate-700 bg-slate-900/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-100">Full Name</label>
                  <input
                    type="text"
                    defaultValue={user.name}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-100">Email Address</label>
                  <input
                    type="email"
                    defaultValue={user.email}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-100">Phone Number</label>
                  <input
                    type="tel"
                    defaultValue={user.phone}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
              <Button className="w-full md:w-auto">Save Changes</Button>
            </CardContent>
          </Card>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <Card className="border-slate-700 bg-slate-900/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your security preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                  <h3 className="font-medium text-white mb-2">Change Password</h3>
                  <div className="space-y-3">
                    <input
                      type="password"
                      placeholder="Current Password"
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-400"
                    />
                    <input
                      type="password"
                      placeholder="New Password"
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-400"
                    />
                    <input
                      type="password"
                      placeholder="Confirm New Password"
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-400"
                    />
                    <Button className="w-full">Update Password</Button>
                  </div>
                </div>

                <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                  <h3 className="font-medium text-white mb-2">Two-Factor Authentication</h3>
                  <p className="text-sm text-slate-400 mb-3">
                    Add an extra layer of security to your account
                  </p>
                  <Button variant="outline">Enable 2FA</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Billing Tab */}
        {activeTab === "billing" && <PaymentSetup />}

        {/* Notifications Tab */}
        {activeTab === "notifications" && (
          <Card className="border-slate-700 bg-slate-900/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose how you want to be notified</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {[
                  { id: "email-updates", label: "Email Updates", description: "Receive email notifications" },
                  { id: "sms-alerts", label: "SMS Alerts", description: "Get text message alerts" },
                  { id: "push-notifications", label: "Push Notifications", description: "Browser push notifications" },
                  { id: "campaign-news", label: "Campaign News", description: "Updates about campaigns" },
                  { id: "security-alerts", label: "Security Alerts", description: "Important security notifications" },
                ].map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-slate-800 rounded-lg border border-slate-700"
                  >
                    <div>
                      <p className="font-medium text-white">{item.label}</p>
                      <p className="text-sm text-slate-400">{item.description}</p>
                    </div>
                    <input type="checkbox" defaultChecked className="h-4 w-4" />
                  </div>
                ))}
              </div>
              <Button className="w-full md:w-auto">Save Preferences</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
