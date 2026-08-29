import { routeFamilies, trains } from '../data/index.js'
import type { JourneyRequest, RecommendationResponse, Train } from '../domain/types.js'

const minutes = (value: string) => { const [hours, mins] = value.split(':').map(Number); return hours * 60 + mins }
const preferenceTarget: Record<NonNullable<JourneyRequest['timePreference']>, number> = { 'early-morning': 360, morning: 540, afternoon: 840, evening: 1080, night: 1320 }

export const normalizeStationName = (value: string) => value.trim().toLocaleLowerCase().replace(/\s+/g, ' ')

const score = (train: Train, request: JourneyRequest) => {
  if (!request.timePreference) return train.fare
  const distance = Math.abs(minutes(train.departure) - preferenceTarget[request.timePreference])
  return Math.floor(distance / 60) * 10000 + distance * 10 + train.fare
}

const compatible = (train: Train, request: JourneyRequest) => request.className === 'Any class' || train.className === request.className

const routeKey = (from: string, to: string) => `${normalizeStationName(from)}-${normalizeStationName(to)}`

const routeNumber = (from: string, to: string, index: number) => {
  let hash = 0
  for (const character of routeKey(from, to)) hash = (hash * 31 + character.charCodeAt(0)) % 80000
  return String(10000 + hash + index).padStart(5, '0')
}

/**
 * Keeps the demo useful for any station pair entered by a user. These are
 * clearly synthetic journeys, but each one is derived from the requested
 * endpoints so the UI never presents an unrelated train for a route.
 */
export const generateRouteTrains = (request: JourneyRequest): Train[] => {
  const { from, to } = request
  const label = `${from}–${to}`
  const classes = request.className === 'Any class' ? ['AC 3 Tier', 'AC Chair Car', 'Sleeper', 'Second Sitting'] : Array(4).fill(request.className)
  const options = [
    { suffix: 'Express', departure: '05:45', arrival: '11:10', duration: '5h 25m', fare: 540, availability: 'available' as const, seats: 28, tags: ['Direct', 'Good availability'], reason: 'A reliable morning option for this route' },
    { suffix: 'Intercity', departure: '08:20', arrival: '14:05', duration: '5h 45m', fare: 430, availability: 'available' as const, seats: 42, tags: ['Direct', 'Lowest fare'], reason: 'A lower-cost direct option for this route' },
    { suffix: 'Superfast', departure: '14:10', arrival: '19:20', duration: '5h 10m', fare: 720, availability: 'waitlist' as const, waitlist: 5, probability: 78, tags: ['Direct', 'Waitlist explained'], reason: 'The fastest option, with a short waiting list' },
    { suffix: 'Night Service', departure: '21:30', arrival: '04:50', duration: '7h 20m', fare: 390, availability: 'available' as const, seats: 19, tags: ['Direct', 'Overnight'], reason: 'An overnight option that saves daytime travel' },
  ]

  return options.map((option, index) => ({
    id: `synthetic-${routeKey(from, to)}-${index + 1}`,
    name: `${label} ${option.suffix}`,
    number: routeNumber(from, to, index),
    from,
    to,
    departure: option.departure,
    arrival: option.arrival,
    duration: option.duration,
    fare: option.fare,
    className: classes[index],
    availability: option.availability,
    seats: option.seats,
    waitlist: option.waitlist,
    probability: option.probability,
    tags: option.tags,
    reason: option.reason,
  }))
}

export const findDirectTrains = (request: JourneyRequest) => trains.filter((train) => normalizeStationName(train.from) === normalizeStationName(request.from) && normalizeStationName(train.to) === normalizeStationName(request.to) && !train.transferStation && compatible(train, request)).sort((a, b) => score(a, request) - score(b, request))

export const findConnectingTrains = (request: JourneyRequest) => trains.filter((train) => normalizeStationName(train.from) === normalizeStationName(request.from) && normalizeStationName(train.to) === normalizeStationName(request.to) && Boolean(train.transferStation) && compatible(train, request)).sort((a, b) => score(a, request) - score(b, request))

export const getRecommendations = (request: JourneyRequest): RecommendationResponse => {
  const directResults = findDirectTrains(request)
  const connectingResults = findConnectingTrains(request)
  const knownResults = directResults.length ? directResults : connectingResults
  const results = knownResults.length ? knownResults : generateRouteTrains(request).filter((train) => compatible(train, request))
  const family = routeFamilies.find((item) => normalizeStationName(item.from) === normalizeStationName(request.from) && normalizeStationName(item.to) === normalizeStationName(request.to))
  const generated = knownResults.length === 0
  const directAvailable = directResults.length > 0 || generated
  const summary = generated ? `${results.length} route-specific demo journeys found for your journey` : directAvailable ? `${results.length} direct train${results.length === 1 ? '' : 's'} found for your journey` : family && !family.direct ? 'No direct trains found. Here is the safest one-change option.' : 'No direct train matches this class or time. Here are the closest options.'
  return { directAvailable, results, summary, suggestions: directAvailable ? [] : ['Try a nearby station', 'Try a different class', 'Choose a wider time window'], searchReference: { id: `search-${Date.now()}`, request, createdAt: new Date().toISOString() } }
}
