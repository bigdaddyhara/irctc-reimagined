import type { Disruption } from '../domain/types'

export const disruptions: Disruption[] = [
  { id: 'delay-brindavan', trainId: 'brindavan', type: 'delay', minutes: 90, message: 'This train is running 90 minutes late. We checked options that still fit your original journey.' },
  { id: 'cancel-kochi', trainId: 'kochi-connect', type: 'cancellation', message: 'This connecting service has been cancelled. We checked the next safe alternatives.' },
]
