"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

type Region = "canada" | "uk"

interface RegionContextType {
  region: Region
  setRegion: (region: Region) => void
  data: RegionData
}

interface RegionData {
  // Basic Info
  countryName: string
  flag: string
  currency: string
  
  // Electoral Units
  electoralUnits: string
  electoralUnitsSingular: string
  totalUnits: number
  totalSeats: number
  
  // Elections
  electionYear: string
  electionDate: string
  
  // Statistics
  turnoutFloor: string
  turnoutSource: string
  womenRepresentation: string
  womenSource: string
  avgAge: string
  totalCandidates: string
  eligiblePool: string
  
  // Legal
  legalFramework: string[]
  votingAgeStatus: string
  
  // Provinces/Regions
  regions: {
    name: string
    units: number
    seats?: number
    color: string
  }[]
  
  // Generational
  generations: {
    name: string
    ageRange: string
    percentage: number
    count: string
    color: string
  }[]
}

const canadaData: RegionData = {
  countryName: "Canada",
  flag: "🇨🇦",
  currency: "CAD",
  
  electoralUnits: "Municipalities",
  electoralUnitsSingular: "Municipality",
  totalUnits: 1690,
  totalSeats: 24000,
  
  electionYear: "2026",
  electionDate: "October 2026",
  
  turnoutFloor: "32.9%",
  turnoutSource: "Ontario AMO 2022",
  womenRepresentation: "28-31%",
  womenSource: "FCM 2023",
  avgAge: "55+",
  totalCandidates: "~24,000",
  eligiblePool: "~18,000",
  
  legalFramework: [
    "Constitution Act, 1867 (s. 92)",
    "Provincial Municipal Acts",
    "Charter of Rights (s. 3)",
    "Bill S-201 (Proposed)"
  ],
  votingAgeStatus: "Proposed - Municipal Jurisdiction",
  
  regions: [
    { name: "Ontario", units: 444, color: "text-blue-500" },
    { name: "Saskatchewan", units: 781, color: "text-purple-500" },
    { name: "British Columbia", units: 161, color: "text-cyan-500" },
    { name: "Manitoba", units: 137, color: "text-green-500" },
    { name: "New Brunswick", units: 77, color: "text-orange-500" },
    { name: "PEI", units: 57, color: "text-yellow-500" },
    { name: "NWT", units: 33, color: "text-red-500" }
  ],
  
  generations: [
    { name: "Gen Z", ageRange: "18-26", percentage: 10, count: "~2,400", color: "bg-purple-600" },
    { name: "Millennials", ageRange: "27-42", percentage: 27, count: "~6,500", color: "bg-blue-600" },
    { name: "Gen X", ageRange: "43-58", percentage: 37, count: "~8,900", color: "bg-cyan-600" },
    { name: "Boomers", ageRange: "59+", percentage: 26, count: "~6,200", color: "bg-red-900" }
  ]
}

const ukData: RegionData = {
  countryName: "United Kingdom",
  flag: "🇬🇧",
  currency: "GBP",
  
  electoralUnits: "Local Authorities",
  electoralUnitsSingular: "Local Authority",
  totalUnits: 136,
  totalSeats: 5036,
  
  electionYear: "2026",
  electionDate: "May 2026",
  
  turnoutFloor: "31.1%",
  turnoutSource: "Electoral Commission 2024",
  womenRepresentation: "35%",
  womenSource: "LGA 2023",
  avgAge: "59+",
  totalCandidates: "~15,000",
  eligiblePool: "~11,000",
  
  legalFramework: [
    "Representation of the People Act 1983",
    "Local Government Act 2000",
    "Elections Act 2022",
    "Scottish Elections Act 2015",
    "Senedd and Elections Act 2020"
  ],
  votingAgeStatus: "Enacted in Scotland & Wales",
  
  regions: [
    { name: "London Boroughs", units: 32, seats: 1851, color: "text-blue-500" },
    { name: "Metropolitan Boroughs", units: 32, seats: 1200, color: "text-purple-500" },
    { name: "District Councils", units: 50, seats: 1200, color: "text-cyan-500" },
    { name: "Unitary Authorities", units: 18, seats: 600, color: "text-green-500" },
    { name: "Wales (Senedd)", units: 16, seats: 96, color: "text-red-500" },
    { name: "Mayoral Elections", units: 6, seats: 6, color: "text-yellow-500" }
  ],
  
  generations: [
    { name: "Gen Z", ageRange: "18-26", percentage: 8, count: "~1,200", color: "bg-purple-600" },
    { name: "Millennials", ageRange: "27-42", percentage: 22, count: "~3,300", color: "bg-blue-600" },
    { name: "Gen X", ageRange: "43-58", percentage: 35, count: "~5,250", color: "bg-cyan-600" },
    { name: "Boomers", ageRange: "59+", percentage: 35, count: "~5,250", color: "bg-red-900" }
  ]
}

const RegionContext = createContext<RegionContextType | undefined>(undefined)

export function RegionProvider({ children }: { children: ReactNode }) {
  const [region, setRegion] = useState<Region>("canada")
  
  useEffect(() => {
    const saved = localStorage.getItem("tnm-region") as Region
    if (saved && (saved === "canada" || saved === "uk")) {
      setRegion(saved)
    }
  }, [])
  
  const handleSetRegion = (newRegion: Region) => {
    setRegion(newRegion)
    localStorage.setItem("tnm-region", newRegion)
  }
  
  const data = region === "canada" ? canadaData : ukData
  
  return (
    <RegionContext.Provider value={{ region, setRegion: handleSetRegion, data }}>
      {children}
    </RegionContext.Provider>
  )
}

export function useRegion() {
  const context = useContext(RegionContext)
  if (!context) {
    throw new Error("useRegion must be used within a RegionProvider")
  }
  return context
}
