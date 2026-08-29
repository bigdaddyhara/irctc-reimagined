import { json, body } from './_shared.js'
import { disruptions } from '../src/data/index.js'
import { getRecoveryOptions } from '../src/services/recoveryService.js'
import type { SearchReference } from '../src/domain/types.js'
export default async function handler(request: Request) { const input = await body<{ reference: SearchReference; disruptionId?: string }>(request); const disruption = disruptions.find((item) => item.id === input.disruptionId) ?? disruptions[0]; return json({ data: getRecoveryOptions(input.reference, disruption) }) }
