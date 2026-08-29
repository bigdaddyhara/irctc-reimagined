import { foundItems, serviceDefinitions, type FoundItem, type ServiceId } from '../data/services.js'

export type ServiceRequest = { reference: string; serviceId: ServiceId; userId: string; status: 'submitted' | 'under-review' | 'approved' | 'completed'; data: Record<string, string>; message: string; nextSteps: string[]; createdAt: string }

const storageKey = (userId: string) => `irctc-service-requests-${userId}`

export const getServiceDefinition = (serviceId: ServiceId) => serviceDefinitions.find((service) => service.id === serviceId)

export const searchFoundItems = (query: Partial<{ item: string; station: string; date: string }>): FoundItem[] => foundItems.filter((found) => (!query.item || `${found.item} ${found.details}`.toLowerCase().includes(query.item.toLowerCase())) && (!query.station || found.station.toLowerCase().includes(query.station.toLowerCase())) && (!query.date || found.date === query.date))

const makeReference = (serviceId: ServiceId) => `${serviceId.toUpperCase().replaceAll('-', '')}-${Date.now().toString().slice(-8)}`

export const validateServiceData = (serviceId: ServiceId, data: Record<string, string>) => {
  const definition = getServiceDefinition(serviceId)
  if (!definition) return 'Choose a service to continue.'
  const missing = definition.fields.find((field) => !data[field.key]?.trim())
  return missing ? `${missing.label} is required.` : ''
}

export const submitServiceRequest = (serviceId: ServiceId, data: Record<string, string>, userId = 'guest'): ServiceRequest => {
  const error = validateServiceData(serviceId, data)
  if (error) throw new Error(error)
  const request: ServiceRequest = { reference: makeReference(serviceId), serviceId, userId, status: serviceId === 'delay-refund' || serviceId === 'payment-issue' ? 'under-review' : 'submitted', data, message: serviceId === 'lost-found' ? 'Your return request has been submitted for review.' : 'Your demo request has been received.', nextSteps: ['Keep this reference number.', 'We will update the request in your profile.', 'No real railway or payment action was taken.'], createdAt: new Date().toISOString() }
  saveServiceRequest(request)
  return request
}

export const getServiceHistory = (userId = 'guest'): ServiceRequest[] => {
  try { return JSON.parse(localStorage.getItem(storageKey(userId)) ?? '[]') as ServiceRequest[] } catch { return [] }
}

export const saveServiceRequest = (request: ServiceRequest) => {
  const history = getServiceHistory(request.userId)
  localStorage.setItem(storageKey(request.userId), JSON.stringify([request, ...history]))
}
