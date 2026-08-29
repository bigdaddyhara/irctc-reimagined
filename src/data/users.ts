import type { User } from '../domain/types.js'

export const demoUsers: Array<User & { password: string }> = [
  { id: 'user-rk', name: 'Riya Kumar', email: 'riya@example.com', mobile: '9876543210', password: 'demo123', preferredLanguage: 'english', preferredClass: 'AC 3 Tier', savedPassengers: ['Riya Kumar'] },
  { id: 'user-demo', name: 'Demo Passenger', email: 'demo@irctc-reimagined.test', mobile: '9000000000', password: 'demo123', preferredLanguage: 'english', preferredClass: 'Any class', savedPassengers: ['Demo Passenger'] },
]
