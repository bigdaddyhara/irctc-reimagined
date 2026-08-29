import { routeFamilies, trains } from '../data'
import type { JourneyRequest, RecommendationResponse, Train } from '../domain/types'

const minutes = (value: string) => { const [hours, mins] = value.split(':').map(Number); return hours * 60 + mins }
const preferenceTarget: Record<NonNullable<JourneyRequest['timePreference']>, number> = { 'early-morning': 360, morning: 540, afternoon: 840, evening: 1080, night: 1320 }

export const normalizeStationName = (value: string) => value.trim().toLocaleLowerCase().replace(/\s+/g, ' ')

const score = (train: Train, request: JourneyRequest) => {
  if (!request.timePreference) return train.fare
  const distance = Math.abs(minutes(train.departure) - preferenceTarget[request.timePreference])
  return Math.floor(distance / 60) * 10000 + distance * 10 + train.fare
}

const compatible = (train: Train, request: JourneyRequest) => request.className === 'Any class' || train.className === request.className

export const findDirectTrains = (request: JourneyRequest) => trains.filter((train) => normalizeStationName(train.from) === normalizeStationName(request.from) && normalizeStationName(train.to) === normalizeStationName(request.to) && !train.transferStation && compatible(train, request)).sort((a, b) => score(a, request) - score(b, request))

export const findConnectingTrains = (request: JourneyRequest) => trains.filter((train) => normalizeStationName(train.from) === normalizeStationName(request.from) && normalizeStationName(train.to) === normalizeStationName(request.to) && Boolean(train.transferStation) && compatible(train, request)).sort((a, b) => score(a, request) - score(b, request))

export const getRecommendations = (request: JourneyRequest): RecommendationResponse => {
  const directResults = findDirectTrains(request)
  const connectingResults = findConnectingTrains(request)
  const results = directResults.length ? directResults : connectingResults
  const family = routeFamilies.find((item) => normalizeStationName(item.from) === normalizeStationName(request.from) && normalizeStationName(item.to) === normalizeStationName(request.to))
  const directAvailable = directResults.length > 0
  const summary = directAvailable ? `${results.length} direct train${results.length === 1 ? '' : 's'} found for your journey` : family && !family.direct ? 'No direct trains found. Here is the safest one-change option.' : results.length ? 'No direct train matches this class or time. Here are the closest options.' : 'No trains found for this route yet. Try nearby stations or change your time.'
  return { directAvailable, results, summary, suggestions: directAvailable ? [] : ['Try a nearby station', 'Try a different class', 'Choose a wider time window'], searchReference: { id: `search-${Date.now()}`, request, createdAt: new Date().toISOString() } }
}
