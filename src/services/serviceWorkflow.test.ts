import { beforeEach, describe, expect, it } from 'vitest'
import { getServiceHistory, submitServiceRequest, validateServiceData } from './serviceWorkflow'
import { searchFoundItems } from './serviceWorkflow'

describe('service workflows', () => {
  beforeEach(() => localStorage.clear())

  it('validates required fields before submission', () => {
    expect(validateServiceData('payment-issue', {})).toMatch(/transaction reference/i)
    expect(() => submitServiceRequest('payment-issue', {})).toThrow(/transaction reference/i)
  })

  it('submits a payment issue and stores it in request history', () => {
    const request = submitServiceRequest('payment-issue', { transactionReference: 'UPI-IRCTC-829193', amount: '620', paymentMethod: 'UPI' }, 'user-1')
    expect(request.reference).toMatch(/^PAYMENTISSUE-/)
    expect(request.status).toBe('under-review')
    expect(getServiceHistory('user-1')[0].reference).toBe(request.reference)
  })

  it('searches synthetic found items by item and station', () => {
    const matches = searchFoundItems({ item: 'backpack', station: 'Chennai' })
    expect(matches).toHaveLength(1)
    expect(matches[0].details).toMatch(/keychain/i)
  })
})
