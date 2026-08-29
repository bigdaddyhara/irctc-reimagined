import { describe, expect, it } from 'vitest'
import { getRecoveryOptions } from './recoveryService'
import type { SearchReference } from '../domain/types'

describe('disruption recovery', () => {
  it('finds a next-best option using the stored route intent', () => {
    const reference: SearchReference = { id: 'search-1', createdAt: '2026-08-28T00:00:00Z', request: { from: 'Chennai Central', to: 'Bengaluru', travelDate: '2026-08-28', className: 'Any class', passengers: 1, source: 'typed', language: 'english' }, selectedTrainId: 'brindavan' }
    const options = getRecoveryOptions(reference, { id: 'd1', trainId: 'brindavan', type: 'delay', minutes: 90, message: 'Delayed' })
    expect(options.length).toBeGreaterThan(0)
    expect(options[0].train.from).toBe('Chennai Central')
    expect(options[0].explanation).toMatch(/original/i)
  })
})
