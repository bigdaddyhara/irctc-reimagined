import { describe, expect, it } from 'vitest'
import { getQueueState } from './queueService'

describe('heavy traffic queue', () => {
  it('returns clear or deterministic queued states', () => {
    expect(getQueueState('search-1', 'normal').status).toBe('clear')
    const queued = getQueueState('search-1', 'heavy')
    expect(queued.status).toBe('queued')
    expect(queued.position).toBeGreaterThan(0)
    expect(queued.message).toMatch(/traffic/i)
  })
})
