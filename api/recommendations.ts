import { json, body } from './_shared.js'
import { getRecommendations } from '../src/services/recommendationService.js'
import type { JourneyRequest } from '../src/domain/types.js'
export default async function handler(request: Request) { if (request.method !== 'POST') return json({ error: { code: 'METHOD_NOT_ALLOWED', message: 'Use POST.' } }, 405); const input = await body<JourneyRequest>(request); if (!input?.from || !input?.to) return json({ error: { code: 'INVALID_REQUEST', message: 'Origin and destination are required.' } }, 400); return json({ data: getRecommendations(input) }) }
