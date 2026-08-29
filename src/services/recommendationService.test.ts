import { describe, expect, it } from 'vitest'
import { getRecommendations } from './recommendationService'
import type { JourneyRequest } from '../domain/types'

const request = (overrides: Partial<JourneyRequest> = {}): JourneyRequest => ({ from: 'Chennai Central', to: 'Bengaluru', travelDate: '2026-08-28', className: 'Any class', passengers: 1, source: 'typed', language: 'english', ...overrides })

describe('route recommendation service', () => {
  it('returns route-specific direct results and a stored reference', () => {
    const result = getRecommendations(request({ from: 'Mumbai Central', to: 'Pune' }))
    expect(result.directAvailable).toBe(true)
    expect(result.results.every((train) => train.from === 'Mumbai Central' && train.to === 'Pune')).toBe(true)
    expect(result.searchReference.request.from).toBe('Mumbai Central')
  })

  it('returns a clearly labeled connecting option when no direct service exists', () => {
    const result = getRecommendations(request({ from: 'Kochi Ernakulam', to: 'Bengaluru', timePreference: 'morning' }))
    expect(result.directAvailable).toBe(false)
    expect(result.results[0].transferStation).toBe('Coimbatore')
    expect(result.summary).toMatch(/no direct/i)
  })

  it('filters incompatible class results and changes ordering for timing preference', () => {
    const result = getRecommendations(request({ from: 'Chennai Egmore', className: 'Sleeper', timePreference: 'night' }))
    expect(result.results.every((train) => train.className === 'Sleeper')).toBe(true)
    expect(result.results[0].departure).toBe('21:15')
  })
})
