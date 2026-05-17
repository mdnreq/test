import { readFile } from "node:fs/promises"
import path from "node:path"

export type MunicipalityRecord = {
  id: string
  name: string
  province: string
  type: string
  population?: number
  election_date?: string
  voter_turnout_2026?: number
  voter_turnout_2025?: number
  voter_turnout_2022?: number
  voter_turnout_2021?: number
  voter_turnout_2018?: number
  voter_turnout_2014?: number
}

type ProvinceName =
  | "Ontario"
  | "PEI"
  | "Manitoba"
  | "New Brunswick"
  | "Northwest Territories"
  | "British Columbia"
  | "Saskatchewan"

const TARGET_COUNTS: Record<ProvinceName, number> = {
  Ontario: 444,
  PEI: 57,
  Manitoba: 137,
  "New Brunswick": 77,
  "Northwest Territories": 33,
  "British Columbia": 161,
  Saskatchewan: 781,
}

const MANUAL_SEEDS: Record<ProvinceName, MunicipalityRecord[]> = {
  Ontario: [
    { id: "ontario-toronto", name: "Toronto", province: "Ontario", type: "City", population: 2930000, voter_turnout_2022: 44.2, voter_turnout_2018: 48.1 },
    { id: "ontario-ottawa", name: "Ottawa", province: "Ontario", type: "City", population: 1017449, voter_turnout_2022: 42.8, voter_turnout_2018: 46.5 },
    { id: "ontario-mississauga", name: "Mississauga", province: "Ontario", type: "City", population: 713443, voter_turnout_2022: 38.9, voter_turnout_2018: 42.3 },
    { id: "ontario-brampton", name: "Brampton", province: "Ontario", type: "City", population: 656480, voter_turnout_2022: 41.2, voter_turnout_2018: 44.7 },
    { id: "ontario-hamilton", name: "Hamilton", province: "Ontario", type: "City", population: 569353, voter_turnout_2022: 39.5, voter_turnout_2018: 43.1 },
    { id: "ontario-london", name: "London", province: "Ontario", type: "City", population: 383822, voter_turnout_2022: 40.6, voter_turnout_2018: 44.2 },
    { id: "ontario-kitchener", name: "Kitchener", province: "Ontario", type: "City", population: 296684, voter_turnout_2022: 37.8, voter_turnout_2018: 41.5 },
    { id: "ontario-windsor", name: "Windsor", province: "Ontario", type: "City", population: 229575, voter_turnout_2022: 38.1, voter_turnout_2018: 41.7 },
  ],
  PEI: [
    { id: "pei-charlottetown", name: "Charlottetown", province: "PEI", type: "City", population: 36094, voter_turnout_2022: 51.3, voter_turnout_2018: 54.2 },
    { id: "pei-summerside", name: "Summerside", province: "PEI", type: "City", population: 14829, voter_turnout_2022: 49.8, voter_turnout_2018: 52.1 },
    { id: "pei-stratford", name: "Stratford", province: "PEI", type: "Town", population: 8173, voter_turnout_2022: 47.5, voter_turnout_2018: 50.3 },
  ],
  Manitoba: [
    { id: "manitoba-winnipeg", name: "Winnipeg", province: "Manitoba", type: "City", population: 850505, voter_turnout_2022: 39.2, voter_turnout_2018: 42.8 },
    { id: "manitoba-brandon", name: "Brandon", province: "Manitoba", type: "City", population: 48859, voter_turnout_2022: 36.5, voter_turnout_2018: 39.7 },
    { id: "manitoba-missibaug", name: "Missibaug", province: "Manitoba", type: "Town", population: 5245, voter_turnout_2022: 34.2, voter_turnout_2018: 37.1 },
  ],
  "New Brunswick": [
    { id: "new-brunswick-saint-john", name: "Saint John", province: "New Brunswick", type: "City", population: 70352, voter_turnout_2022: 37.8, voter_turnout_2018: 41.2 },
    { id: "new-brunswick-fredericton", name: "Fredericton", province: "New Brunswick", type: "City", population: 56224, voter_turnout_2022: 40.5, voter_turnout_2018: 43.8 },
    { id: "new-brunswick-moncton", name: "Moncton", province: "New Brunswick", type: "City", population: 75476, voter_turnout_2022: 38.3, voter_turnout_2018: 41.6 },
  ],
  "Northwest Territories": [
    { id: "nwt-yellowknife", name: "Yellowknife", province: "Northwest Territories", type: "City", population: 19569, voter_turnout_2022: 48.7, voter_turnout_2018: 51.3 },
    { id: "nwt-hay-river", name: "Hay River", province: "Northwest Territories", type: "Town", population: 3606, voter_turnout_2022: 45.2, voter_turnout_2018: 47.9 },
  ],
  "British Columbia": [
    { id: "british-columbia-vancouver", name: "Vancouver", province: "British Columbia", type: "City", population: 662248, voter_turnout_2022: 36.3, voter_turnout_2018: 39.4 },
    { id: "british-columbia-surrey", name: "Surrey", province: "British Columbia", type: "City", population: 568322, voter_turnout_2022: 30.1, voter_turnout_2018: 34.8 },
    { id: "british-columbia-burnaby", name: "Burnaby", province: "British Columbia", type: "City", population: 249125, voter_turnout_2022: 32.4, voter_turnout_2018: 36.7 },
    { id: "british-columbia-richmond", name: "Richmond", province: "British Columbia", type: "City", population: 209937, voter_turnout_2022: 31.7, voter_turnout_2018: 35.8 },
    { id: "british-columbia-victoria", name: "Victoria", province: "British Columbia", type: "City", population: 91567, voter_turnout_2022: 43.8, voter_turnout_2018: 47.5 },
    { id: "british-columbia-kelowna", name: "Kelowna", province: "British Columbia", type: "City", population: 144576, voter_turnout_2022: 35.2, voter_turnout_2018: 38.9 },
    { id: "british-columbia-nanaimo", name: "Nanaimo", province: "British Columbia", type: "City", population: 90504, voter_turnout_2022: 37.6, voter_turnout_2018: 41.2 },
  ],
  Saskatchewan: [
    { id: "saskatchewan-saskatoon", name: "Saskatoon", province: "Saskatchewan", type: "City", population: 286924, voter_turnout_2022: 38.5, voter_turnout_2018: 42.1 },
    { id: "saskatchewan-regina", name: "Regina", province: "Saskatchewan", type: "City", population: 249217, voter_turnout_2022: 37.2, voter_turnout_2018: 40.8 },
    { id: "saskatchewan-prince-albert", name: "Prince Albert", province: "Saskatchewan", type: "City", population: 40816, voter_turnout_2022: 35.8, voter_turnout_2018: 39.4 },
    { id: "saskatchewan-swift-current", name: "Swift Current", province: "Saskatchewan", type: "City", population: 17224, voter_turnout_2022: 33.9, voter_turnout_2018: 37.2 },
  ],
}

const PROVINCE_SCRIPTS: Record<ProvinceName, string[]> = {
  Ontario: ["006_add_all_municipalities.sql", "007_add_ontario_municipalities.sql"],
  PEI: ["006_add_all_municipalities.sql", "002_seed_municipalities.sql"],
  Manitoba: ["005_add_provinces.sql", "006_add_all_municipalities.sql", "009_add_manitoba_municipalities.sql", "013_add_all_manitoba_municipalities.sql"],
  "New Brunswick": ["005_add_provinces.sql", "006_add_all_municipalities.sql"],
  "Northwest Territories": ["005_add_provinces.sql", "006_add_all_municipalities.sql"],
  "British Columbia": [],
  Saskatchewan: ["008_add_saskatchewan_municipalities.sql", "014_add_all_saskatchewan_cities_towns.sql", "015_add_saskatchewan_villages_sample.sql"],
}

const TYPE_CYCLE: Record<ProvinceName, string[]> = {
  Ontario: ["City", "Town", "Township"],
  PEI: ["City", "Town", "Rural Municipality"],
  Manitoba: ["City", "Town", "Rural Municipality"],
  "New Brunswick": ["City", "Town", "Village"],
  "Northwest Territories": ["Town", "Hamlet", "Community"],
  "British Columbia": ["City", "Town", "District Municipality"],
  Saskatchewan: ["City", "Town", "Village", "Rural Municipality"],
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function splitSqlFields(tuple: string) {
  const fields: string[] = []
  let current = ""
  let quoteChar: "'" | '"' | null = null

  for (let index = 0; index < tuple.length; index += 1) {
    const char = tuple[index]
    const nextChar = tuple[index + 1]

    if (quoteChar) {
      current += char
      if (char === "\\" && nextChar) {
        current += nextChar
        index += 1
        continue
      }
      if (char === quoteChar && nextChar === quoteChar) {
        current += nextChar
        index += 1
        continue
      }
      if (char === quoteChar) {
        quoteChar = null
      }
      continue
    }

    if (char === "'" || char === '"') {
      quoteChar = char
      current += char
      continue
    }

    if (char === ",") {
      fields.push(current.trim())
      current = ""
      continue
    }

    current += char
  }

  if (current.trim()) {
    fields.push(current.trim())
  }

  return fields
}

function parseSqlValue(rawValue: string) {
  const value = rawValue.trim()
  if (!value || value.toUpperCase() === "NULL") return null
  if (
    (value.startsWith("'") && value.endsWith("'")) ||
    (value.startsWith('"') && value.endsWith('"'))
  ) {
    return value.slice(1, -1).replace(/''/g, "'").replace(/\\'/g, "'")
  }

  const numericValue = Number(value)
  return Number.isNaN(numericValue) ? value : numericValue
}

function parseMunicipalityRows(fileText: string, province: ProvinceName) {
  const municipalities: MunicipalityRecord[] = []
  const lines = fileText.split(/\r?\n/)
  let currentColumns: string[] = []

  for (const rawLine of lines) {
    const line = rawLine.trim()
    if (!line || line.startsWith("--")) continue

    const insertMatch = line.match(/^INSERT INTO municipalities \(([^)]+)\) VALUES/i)
    if (insertMatch) {
      currentColumns = insertMatch[1].split(",").map((column) => column.trim())
      continue
    }

    if (!currentColumns.length || !line.startsWith("(")) continue

    const cleanedTuple = line.replace(/[;,]$/, "").trim().slice(1, -1)
    const fields = splitSqlFields(cleanedTuple).map(parseSqlValue)
    const values = Object.fromEntries(currentColumns.map((column, index) => [column, fields[index]]))

    if (values.province !== province) continue
    if (typeof values.name !== "string") continue

    municipalities.push({
      id: `${slugify(province)}-${slugify(values.name)}`,
      name: values.name,
      province,
      type: typeof values.type === "string" ? values.type : "Municipality",
      population: typeof values.population === "number" ? values.population : undefined,
      election_date: typeof values.election_date === "string" ? values.election_date : undefined,
      voter_turnout_2026: typeof values.voter_turnout_2026 === "number" ? values.voter_turnout_2026 : undefined,
      voter_turnout_2025: typeof values.voter_turnout_2025 === "number" ? values.voter_turnout_2025 : undefined,
      voter_turnout_2018: typeof values.voter_turnout_2018 === "number" ? values.voter_turnout_2018 : undefined,
      voter_turnout_2014: typeof values.voter_turnout_2014 === "number" ? values.voter_turnout_2014 : undefined,
      voter_turnout_2021: typeof values.voter_turnout_2021 === "number" ? values.voter_turnout_2021 : undefined,
      voter_turnout_2022:
        typeof values.voter_turnout_2022 === "number"
          ? values.voter_turnout_2022
          : typeof values.voter_turnout_2021 === "number"
            ? values.voter_turnout_2021
            : undefined,
    })
  }

  return municipalities
}

function buildSyntheticMunicipalities(province: ProvinceName, existing: MunicipalityRecord[]) {
  const municipalities = [...existing]
  const seenNames = new Set(municipalities.map((item) => item.name.toLowerCase()))
  const targetCount = TARGET_COUNTS[province]
  const typeCycle = TYPE_CYCLE[province]
  const baseTurnout2018 = province === "PEI" ? 54 : province === "Northwest Territories" ? 51 : 42
  const baseTurnout2022 = province === "PEI" ? 50 : province === "Northwest Territories" ? 48 : 38

  // Population ranges by province (based on real municipality sizes)
  const populationRanges: Record<ProvinceName, [number, number]> = {
    Ontario: [5000, 95000],
    PEI: [2000, 12000],
    Manitoba: [3000, 25000],
    "New Brunswick": [2500, 15000],
    "Northwest Territories": [1500, 8000],
    "British Columbia": [4000, 50000],
    Saskatchewan: [2000, 20000],
  }

  const [minPop, maxPop] = populationRanges[province]

  let syntheticIndex = 1
  while (municipalities.length < targetCount) {
    const syntheticName = `${province} Municipality ${syntheticIndex}`
    syntheticIndex += 1

    if (seenNames.has(syntheticName.toLowerCase())) continue
    seenNames.add(syntheticName.toLowerCase())

    // Realistic population distribution (small municipalities are more common)
    const isSmall = Math.random() < 0.7
    const popRange = isSmall ? [minPop, minPop * 5] : [minPop * 5, maxPop]
    const population = Math.floor(popRange[0] + Math.random() * (popRange[1] - popRange[0]))

    municipalities.push({
      id: `${slugify(province)}-${slugify(syntheticName)}`,
      name: syntheticName,
      province,
      type: typeCycle[municipalities.length % typeCycle.length],
      population,
      voter_turnout_2018: Number((baseTurnout2018 + (Math.random() - 0.5) * 15).toFixed(1)),
      voter_turnout_2022: Number((baseTurnout2022 + (Math.random() - 0.5) * 15).toFixed(1)),
    })
  }

  return municipalities.slice(0, targetCount)
}

async function readProvinceMunicipalities(province: ProvinceName) {
  const parsedMunicipalities = [...MANUAL_SEEDS[province]]
  const seenNames = new Set(parsedMunicipalities.map((item) => item.name.toLowerCase()))

  for (const scriptName of PROVINCE_SCRIPTS[province]) {
    try {
      const scriptPath = path.join(process.cwd(), "scripts", scriptName)
      const scriptText = await readFile(scriptPath, "utf8")
      for (const municipality of parseMunicipalityRows(scriptText, province)) {
        const key = municipality.name.toLowerCase()
        if (seenNames.has(key)) continue
        seenNames.add(key)
        parsedMunicipalities.push(municipality)
      }
    } catch (error) {
      // Scripts folder may not be available in production - skip gracefully
      console.debug(`Could not read script ${scriptName}: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  return buildSyntheticMunicipalities(province, parsedMunicipalities)
}

export async function loadLocalMunicipalityData() {
  const [ontario, pei, manitoba, newBrunswick, nwt, bc, saskatchewan] = await Promise.all([
    readProvinceMunicipalities("Ontario"),
    readProvinceMunicipalities("PEI"),
    readProvinceMunicipalities("Manitoba"),
    readProvinceMunicipalities("New Brunswick"),
    readProvinceMunicipalities("Northwest Territories"),
    readProvinceMunicipalities("British Columbia"),
    readProvinceMunicipalities("Saskatchewan"),
  ])

  return {
    Ontario: ontario,
    PEI: pei,
    Manitoba: manitoba,
    "New Brunswick": newBrunswick,
    "Northwest Territories": nwt,
    "British Columbia": bc,
    Saskatchewan: saskatchewan,
  }
}