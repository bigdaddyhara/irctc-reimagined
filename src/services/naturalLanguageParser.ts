import { stations } from '../data'
import type { JourneyRequest, Language, TimePreference } from '../domain/types'
import { timeWords, tomorrowWords } from './languageCatalog'

export type ParseResult = { requestPatch: Partial<JourneyRequest>; matchedStations: string[]; confidence: number; missingFields: string[]; message: string }

const stationFor = (text: string) => stations.find((station) => station.aliases.some((alias) => text.toLocaleLowerCase().includes(alias.toLocaleLowerCase())))?.name
const datePlus = (date: string | undefined, days: number) => { const parsed = new Date(`${date ?? new Date().toISOString().slice(0, 10)}T00:00:00Z`); parsed.setUTCDate(parsed.getUTCDate() + days); return parsed.toISOString().slice(0, 10) }

export const parseJourneyText = (text: string, _language: Language, defaults: Partial<JourneyRequest> = {}): ParseResult => {
  const lower = text.toLocaleLowerCase()
  const matches = stations.filter((station) => station.aliases.some((alias) => lower.includes(alias.toLocaleLowerCase()))).map((station) => station.name)
  const connectors = /\s+(?:to|from|via|से|से|तक|को|থেকে|থেকে|నుంచి|కు|पासून|ते|முதல்|இருந்து|થી|ಗೆ|ನಿಂದ|కు|ରୁ|ਤੋਂ)\s+/i
  const parts = text.split(connectors).map((part) => part.trim()).filter(Boolean)
  const from = parts.length >= 2 ? stationFor(parts[0]) : matches[0]
  const to = parts.length >= 2 ? stationFor(parts[1]) : matches[1]
  const preference = (Object.entries(timeWords).find(([, words]) => words.some((word) => lower.includes(word.toLocaleLowerCase())))?.[0] as TimePreference | undefined)
  const patch: Partial<JourneyRequest> = { ...defaults, ...(from ? { from } : {}), ...(to ? { to } : {}), ...(preference ? { timePreference: preference } : {}) }
  if (tomorrowWords.some((word) => lower.includes(word.toLocaleLowerCase()))) patch.travelDate = datePlus(defaults.travelDate, 1)
  const count = lower.match(/\b(\d+)\s*(?:adult|passenger|people|यात्री|प्रवासी)\b/i)
  if (count) patch.passengers = Number(count[1])
  const missingFields = [!patch.from && 'from', !patch.to && 'to'].filter(Boolean) as string[]
  return { requestPatch: patch, matchedStations: matches, confidence: missingFields.length ? 0.45 : 0.92, missingFields, message: missingFields.length ? 'Please check the missing station fields.' : 'We understood your journey. Please confirm the details.' }
}
