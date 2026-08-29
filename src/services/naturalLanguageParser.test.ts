import { describe, expect, it } from 'vitest'
import { parseJourneyText } from './naturalLanguageParser'

describe('natural language journey parser', () => {
  it('parses an English route with a relative date and time', () => {
    const result = parseJourneyText('Mumbai to Pune tomorrow morning', 'english', { travelDate: '2026-08-28', className: 'Any class', passengers: 1 })
    expect(result.requestPatch.from).toBe('Mumbai Central')
    expect(result.requestPatch.to).toBe('Pune')
    expect(result.requestPatch.timePreference).toBe('morning')
    expect(result.requestPatch.travelDate).toBe('2026-08-29')
  })

  it('parses a transliterated Indian-language route', () => {
    const result = parseJourneyText('Mumbai se Pune kal raat', 'hindi', { travelDate: '2026-08-28' })
    expect(result.requestPatch.from).toBe('Mumbai Central')
    expect(result.requestPatch.to).toBe('Pune')
    expect(result.requestPatch.timePreference).toBe('night')
  })

  it('reports missing fields instead of guessing', () => {
    const result = parseJourneyText('find me a train tomorrow', 'english', { travelDate: '2026-08-28' })
    expect(result.missingFields).toContain('from')
    expect(result.missingFields).toContain('to')
  })
})
