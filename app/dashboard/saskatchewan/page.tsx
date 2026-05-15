"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, TrendingDown, Users, MapPin } from "lucide-react"
import { createBrowserClient } from "@/lib/supabase/client"

export default function SaskatchewanDashboard() {
  const [municipalities, setMunicipalities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createBrowserClient()

  useEffect(() => {
    async function fetchMunicipalities() {
      const { data } = await supabase
        .from("municipalities")
        .select("*")
        .eq("province", "Saskatchewan")
        .order("population", { ascending: false })

      if (data) setMunicipalities(data)
      setLoading(false)
    }
    fetchMunicipalities()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowRight className="h-4 w-4 rotate-180" />
          Back to Dashboard
        </Link>

        <div className="mb-8">
          <h1 className="text-5xl font-black tracking-tight mb-2">SASKATCHEWAN</h1>
          <p className="text-xl text-muted-foreground">Municipal democracy across SK - November 13, 2026 election</p>
        </div>

        {/* Land Acknowledgement */}
        <div className="bg-gradient-to-r from-amber-600/10 to-orange-600/10 border border-amber-600/20 rounded-xl p-6 mb-8">
          <p className="text-sm leading-relaxed">
            We acknowledge that Saskatchewan municipalities are situated on Treaty 2, 4, 5, 6, 8, and 10 territories and
            the homeland of the Métis Nation. These are the traditional lands of the Cree, Dakota, Lakota, Nakoda, and
            Saulteaux peoples.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card border rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <MapPin className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="text-3xl font-black mb-1">{municipalities.length}</div>
            <div className="text-sm text-muted-foreground">Municipalities</div>
          </div>
          <div className="bg-card border rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingDown className="h-5 w-5 text-red-500" />
            </div>
            <div className="text-3xl font-black mb-1 text-red-500">-5.7%</div>
            <div className="text-sm text-muted-foreground">Avg Turnout Decline</div>
          </div>
          <div className="bg-card border rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <Users className="h-5 w-5 text-blue-500" />
            </div>
            <div className="text-3xl font-black mb-1">36.5%</div>
            <div className="text-sm text-muted-foreground">Current Avg Turnout</div>
          </div>
          <div className="bg-gradient-to-br from-blue-600/10 to-cyan-600/10 border border-blue-500/20 rounded-xl p-6">
            <div className="text-3xl font-black mb-1 text-blue-500">+6.5%</div>
            <div className="text-sm text-muted-foreground">With Votes at 16</div>
          </div>
        </div>

        {/* Municipalities Table */}
        <div className="bg-card border rounded-xl overflow-hidden">
          <div className="border-b p-6">
            <h2 className="text-2xl font-bold">SASKATCHEWAN MUNICIPALITIES</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-bold">Municipality</th>
                  <th className="text-right p-4 font-bold">Population</th>
                  <th className="text-right p-4 font-bold">2018 Turnout</th>
                  <th className="text-right p-4 font-bold">2022 Turnout</th>
                  <th className="text-right p-4 font-bold">Change</th>
                  <th className="text-right p-4 font-bold">With Votes at 16</th>
                </tr>
              </thead>
              <tbody>
                {municipalities.map((muni, i) => {
                  const change = muni.voter_turnout_2022 - muni.voter_turnout_2018
                  const projected = muni.voter_turnout_2022 + 6.5
                  return (
                    <tr key={i} className="border-t">
                      <td className="p-4 font-medium">{muni.name}</td>
                      <td className="p-4 text-right">{muni.population?.toLocaleString()}</td>
                      <td className="p-4 text-right">{muni.voter_turnout_2018}%</td>
                      <td className="p-4 text-right">{muni.voter_turnout_2022}%</td>
                      <td className={`p-4 text-right font-bold ${change < 0 ? "text-red-500" : "text-green-500"}`}>
                        {change > 0 ? "+" : ""}
                        {change.toFixed(1)}%
                      </td>
                      <td className="p-4 text-right font-bold text-blue-500">{projected.toFixed(1)}%</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
