import { json } from '../_shared.js'
import { getQueueState } from '../../src/services/queueService.js'
export default function handler(request: Request) { const id = new URL(request.url).pathname.split('/').pop() ?? 'unknown'; return json({ data: getQueueState(id, 'heavy') }) }
