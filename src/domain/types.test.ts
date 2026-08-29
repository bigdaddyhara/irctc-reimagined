import { describe, expect, it } from 'vitest'
import { routeFamilies, stations, trains } from '../data'

describe('synthetic railway domain data', () => {
  it('includes the primary route and five additional route families', () => {
    expect(routeFamilies.length).toBeGreaterThanOrEqual(6)
    expect(routeFamilies).toEqual(expect.arrayContaining([
      expect.objectContaining({ from: 'Chennai Central', to: 'Bengaluru' }),
    ]))
  })

  it('includes direct and connecting-only route examples', () => {
    expect(routeFamilies.some((route) => route.direct)).toBe(true)
    expect(routeFamilies.some((route) => !route.direct)).toBe(true)
  })

  it('includes available, waitlist, and full train states', () => {
    expect(new Set(trains.map((train) => train.availability))).toEqual(new Set(['available', 'waitlist', 'full']))
    expect(stations.length).toBeGreaterThanOrEqual(20)
  })
})
