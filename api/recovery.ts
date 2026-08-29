import { json, body } from './_shared'
import { disruptions } from '../src/data'
import { getRecoveryOptions } from '../src/services/recoveryService'
import type { SearchReference } from '../src/domain/types'
export default async function handler(request: Request) { const input = await body<{ reference: SearchReference; disruptionId?: string }>(request); const disruption = disruptions.find((item) => item.id === input.disruptionId) ?? disruptions[0]; return json({ data: getRecoveryOptions(input.reference, disruption) }) }
