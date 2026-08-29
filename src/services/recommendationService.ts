import { routeFamilies, trains } from '../data/index.js'
import { stations } from '../data/stations.js'
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
export const generateConnectingTrains = (request: JourneyRequest, count = 4): Train[] => {
  const { from, to } = request
  const eligibleInterchanges = stations.filter((station) => {
    const normalized = normalizeStationName(station.name)
    return normalized !== normalizeStationName(from) && normalized !== normalizeStationName(to)
  })
  const classes = request.className === 'Any class' ? ['AC 3 Tier', 'AC Chair Car', 'Sleeper', 'Second Sitting'] : Array(4).fill(request.className)
  const options = [
    { suffix: 'Connector', departure: '05:45', arrival: '13:10', duration: '7h 25m', fare: 540, availability: 'available' as const, seats: 28, tags: ['1 change', 'Protected transfer'], reason: 'A reliable morning connection for this route' },
    { suffix: 'Intercity Link', departure: '08:20', arrival: '16:05', duration: '7h 45m', fare: 430, availability: 'available' as const, seats: 42, tags: ['1 change', 'Lowest fare'], reason: 'A lower-cost connection for this route' },
    { suffix: 'Superfast Link', departure: '14:10', arrival: '21:20', duration: '7h 10m', fare: 720, availability: 'waitlist' as const, waitlist: 5, probability: 78, tags: ['1 change', 'Waitlist explained'], reason: 'The fastest connection, with a short waiting list' },
    { suffix: 'Night Connector', departure: '21:30', arrival: '06:50', duration: '9h 20m', fare: 390, availability: 'available' as const, seats: 19, tags: ['1 change', 'Overnight'], reason: 'An overnight connection that saves daytime travel' },
  ]

  return options.slice(0, count).map((option, index) => {
    const interchange = eligibleInterchanges[(index * 7 + from.length + to.length) % eligibleInterchanges.length]
    return {
    id: `connecting-${routeKey(from, to)}-${index + 1}`,
    name: `${from}–${to} via ${interchange.name} ${option.suffix}`,
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
    transferStation: interchange.name,
    legs: [
      { from, to: interchange.name, departure: option.departure, arrival: '09:05', duration: '3h 20m' },
      { from: interchange.name, to, departure: '10:05', arrival: option.arrival, duration: option.duration },
    ],
  }})
}

export const findDirectTrains = (request: JourneyRequest) => trains.filter((train) => normalizeStationName(train.from) === normalizeStationName(request.from) && normalizeStationName(train.to) === normalizeStationName(request.to) && !train.transferStation && compatible(train, request)).sort((a, b) => score(a, request) - score(b, request))

export const findConnectingTrains = (request: JourneyRequest) => trains.filter((train) => normalizeStationName(train.from) === normalizeStationName(request.from) && normalizeStationName(train.to) === normalizeStationName(request.to) && Boolean(train.transferStation) && compatible(train, request)).sort((a, b) => score(a, request) - score(b, request))

export const getRecommendations = (request: JourneyRequest): RecommendationResponse => {
  const directResults = findDirectTrains(request)
  const connectingResults = findConnectingTrains(request)
  const knownResults = directResults.length ? directResults : connectingResults
  const connectingNeeded = Math.max(0, 4 - knownResults.length)
  const results = [...knownResults, ...generateConnectingTrains(request, connectingNeeded)].filter((train) => compatible(train, request))
  const family = routeFamilies.find((item) => normalizeStationName(item.from) === normalizeStationName(request.from) && normalizeStationName(item.to) === normalizeStationName(request.to))
  const generated = connectingNeeded > 0
  const directAvailable = directResults.length > 0
  const summary = generated && directAvailable ? `${directResults.length} direct and ${results.length - directResults.length} connecting demo journeys found` : generated ? `No direct trains found. Here are ${results.length} connecting demo journeys.` : directAvailable ? `${results.length} direct train${results.length === 1 ? '' : 's'} found for your journey` : family && !family.direct ? 'No direct trains found. Here is the safest one-change option.' : 'No direct train matches this class or time. Here are the closest options.'
  return { directAvailable, results, summary, suggestions: directAvailable ? [] : ['Try a nearby station', 'Try a different class', 'Choose a wider time window'], searchReference: { id: `search-${Date.now()}`, request, createdAt: new Date().toISOString() } }
}
