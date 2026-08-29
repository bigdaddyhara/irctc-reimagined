import { json, body } from './_shared'
import { getRecommendations } from '../src/services/recommendationService'
import { getQueueState } from '../src/services/queueService'
import type { JourneyRequest } from '../src/domain/types'
export default async function handler(request: Request) { if (request.method !== 'POST') return json({ error: { code: 'METHOD_NOT_ALLOWED', message: 'Use POST.' } }, 405); const input = await body<JourneyRequest>(request); if (!input?.from || !input?.to || !input?.travelDate) return json({ error: { code: 'INVALID_REQUEST', message: 'Origin, destination, and date are required.' } }, 400); const result = getRecommendations(input); return json({ data: { ...result, queue: getQueueState(result.searchReference.id, 'normal') } }) }
