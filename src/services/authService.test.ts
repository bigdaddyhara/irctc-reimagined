import { describe, expect, it } from 'vitest'
import { loginDemo, signupDemo } from './authService'

describe('mock authentication', () => {
  it('logs in with documented demo credentials', () => {
    expect(loginDemo({ email: 'demo@irctc-reimagined.test', password: 'demo123' }).user.name).toBe('Demo Passenger')
  })
  it('creates a short onboarding session', () => {
    expect(signupDemo({ name: 'Asha', email: 'asha@example.com', preferredLanguage: 'tamil' }).user.preferredLanguage).toBe('tamil')
  })
})
