export type ServiceId = 'pass-change' | 'delay-refund' | 'payment-issue' | 'journey-correction' | 'lost-found'

export type ServiceDefinition = {
  id: ServiceId
  title: string
  description: string
  detail: string
  fields: Array<{ key: string; label: string; placeholder: string; type?: 'date' | 'number' }>
}

export const serviceDefinitions: ServiceDefinition[] = [
  { id: 'pass-change', title: 'Change travel pass', description: 'Update a demo pass or route plan.', detail: 'Choose your current pass and the new option you want.', fields: [{ key: 'currentPass', label: 'Current pass', placeholder: 'Monthly Local Pass' }, { key: 'newPass', label: 'New pass', placeholder: 'Quarterly Local Pass' }, { key: 'startDate', label: 'Change from', placeholder: 'Choose a date', type: 'date' }] },
  { id: 'delay-refund', title: 'Refund for delay or cancellation', description: 'Check a delayed journey and request a demo refund.', detail: 'We will use your booking reference to check the synthetic journey record.', fields: [{ key: 'bookingReference', label: 'Booking or PNR reference', placeholder: 'PNR48271930' }, { key: 'reason', label: 'What happened?', placeholder: 'Train delayed by 90 minutes' }, { key: 'travelDate', label: 'Travel date', placeholder: 'Choose a date', type: 'date' }] },
  { id: 'payment-issue', title: 'Payment deducted but ticket not received', description: 'Check a payment and resolve a missing ticket.', detail: 'Enter the demo transaction details so we can trace the payment.', fields: [{ key: 'transactionReference', label: 'Transaction reference', placeholder: 'UPI-IRCTC-829193' }, { key: 'amount', label: 'Amount paid', placeholder: '620', type: 'number' }, { key: 'paymentMethod', label: 'Payment method', placeholder: 'UPI' }] },
  { id: 'journey-correction', title: 'Forgot to check out', description: 'Correct an unfinished digital journey.', detail: 'Tell us where you meant to finish your demo journey.', fields: [{ key: 'journeyReference', label: 'Journey reference', placeholder: 'JRN-482719' }, { key: 'exitStation', label: 'Exit station', placeholder: 'Bengaluru' }, { key: 'travelDate', label: 'Travel date', placeholder: 'Choose a date', type: 'date' }] },
  { id: 'lost-found', title: 'Lost and found', description: 'Search found items and submit a return request.', detail: 'Search by item, station, or journey date. Matches are synthetic.', fields: [{ key: 'item', label: 'What did you lose?', placeholder: 'Black backpack' }, { key: 'station', label: 'Where did you lose it?', placeholder: 'Chennai Central' }, { key: 'lostDate', label: 'Date lost', placeholder: 'Choose a date', type: 'date' }] },
]

export type FoundItem = { id: string; item: string; category: string; station: string; date: string; details: string }

export const foundItems: FoundItem[] = [
  { id: 'found-1', item: 'Black backpack', category: 'Bag', station: 'Chennai Central', date: '2026-08-27', details: 'Small black backpack with a blue keychain' },
  { id: 'found-2', item: 'Blue phone', category: 'Electronics', station: 'Bengaluru', date: '2026-08-28', details: 'Blue case, small scratch near the camera' },
  { id: 'found-3', item: 'Brown wallet', category: 'Wallet', station: 'Mumbai Central', date: '2026-08-26', details: 'Brown leather wallet with no cards inside' },
  { id: 'found-4', item: 'Earphones case', category: 'Electronics', station: 'Pune', date: '2026-08-25', details: 'White case with one pair of earphones' },
]
