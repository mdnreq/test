"use client"

import { useRegion } from "@/lib/region-context"
import { Globe } from "lucide-react"

export function RegionToggle() {
  const { region, setRegion } = useRegion()

  return (
    <div className="flex items-center gap-1 bg-[#0d121b] border border-white/10 rounded-full p-1">
      <button
        onClick={() => setRegion("canada")}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
          region === "canada"
            ? "bg-blue-600 text-white"
            : "text-white/60 hover:text-white hover:bg-white/5"
        }`}
      >
        <span>🇨🇦</span>
        <span className="hidden sm:inline">Canada</span>
      </button>
      <button
        onClick={() => setRegion("uk")}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
          region === "uk"
            ? "bg-blue-600 text-white"
            : "text-white/60 hover:text-white hover:bg-white/5"
        }`}
      >
        <span>🇬🇧</span>
        <span className="hidden sm:inline">UK</span>
      </button>
    </div>
  )
}

export function RegionToggleLarge() {
  const { region, setRegion, data } = useRegion()

  return (
    <div className="bg-[#0b0f16] border border-white/10 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <Globe className="h-5 w-5 text-blue-500" />
        <h3 className="font-bold text-sm uppercase tracking-wider">Select Region</h3>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setRegion("canada")}
          className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
            region === "canada"
              ? "bg-blue-600/20 border-blue-500 text-white"
              : "border-white/10 text-white/60 hover:text-white hover:border-white/20"
          }`}
        >
          <span className="text-3xl">🇨🇦</span>
          <span className="font-bold">Canada</span>
          <span className="text-[10px] text-white/50">1,690 Municipalities</span>
        </button>
        <button
          onClick={() => setRegion("uk")}
          className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
            region === "uk"
              ? "bg-blue-600/20 border-blue-500 text-white"
              : "border-white/10 text-white/60 hover:text-white hover:border-white/20"
          }`}
        >
          <span className="text-3xl">🇬🇧</span>
          <span className="font-bold">United Kingdom</span>
          <span className="text-[10px] text-white/50">136 Local Authorities</span>
        </button>
      </div>
      <div className="mt-4 p-3 bg-white/5 rounded-lg">
        <div className="text-xs text-white/60">
          Currently viewing: <span className="text-white font-bold">{data.countryName}</span> - {data.totalUnits} {data.electoralUnits}
        </div>
      </div>
    </div>
  )
}
