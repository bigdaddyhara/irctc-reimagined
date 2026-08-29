import type { QueueState } from '../domain/types.js'
export type TrafficMode = 'normal' | 'heavy'
export const getQueueState = (requestId: string, mode: TrafficMode): QueueState => mode === 'normal' ? { status: 'clear', message: 'Search is ready.' } : { status: 'queued', position: (requestId.length * 17) % 80 + 12, estimatedWaitSeconds: 24, message: 'Heavy traffic right now. Your search is safely in line.' }
export const advanceQueue = (requestId: string): QueueState => ({ status: 'admitted', message: `Search ${requestId} is ready.` })
