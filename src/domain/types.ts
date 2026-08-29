export type Language = 'english' | 'hindi' | 'bengali' | 'telugu' | 'marathi' | 'tamil' | 'gujarati' | 'kannada' | 'malayalam' | 'odia' | 'punjabi' | 'assamese'
export type Availability = 'available' | 'waitlist' | 'full'
export type TimePreference = 'early-morning' | 'morning' | 'afternoon' | 'evening' | 'night'

export type JourneyRequest = {
  from: string
  to: string
  travelDate: string
  timePreference?: TimePreference
  arriveBy?: string
  className: string
  passengers: number
  source: 'typed' | 'voice'
  language: Language
  originalText?: string
}

export type Station = { id: string; name: string; aliases: string[]; city: string }
export type ConnectionLeg = { from: string; to: string; departure: string; arrival: string; duration: string }
export type Train = {
  id: string; name: string; number: string; from: string; to: string; departure: string; arrival: string
  duration: string; fare: number; className: string; availability: Availability; seats?: number; waitlist?: number
  probability?: number; tags: string[]; reason: string; transferStation?: string; legs?: ConnectionLeg[]
}
export type TrainResult = Train
export type RouteFamily = { id: string; from: string; to: string; direct: boolean; nearbyStations?: string[] }
export type SearchReference = { id: string; request: JourneyRequest; createdAt: string; selectedTrainId?: string }
export type User = { id: string; name: string; email: string; mobile: string; preferredLanguage: Language; preferredClass: string; savedPassengers: string[] }
export type Session = { token: string; user: User; createdAt: string }
export type Disruption = { id: string; trainId: string; type: 'delay' | 'cancellation' | 'platform-change'; minutes?: number; message: string }
export type RecoveryOption = { train: Train; score: number; explanation: string; tradeoffs: string[] }
export type QueueState = { status: 'clear' | 'queued' | 'admitted'; position?: number; estimatedWaitSeconds?: number; message: string }
export type RecommendationResponse = { directAvailable: boolean; results: TrainResult[]; summary: string; suggestions: string[]; searchReference: SearchReference }
