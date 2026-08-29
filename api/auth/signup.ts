import { json, body } from '../_shared'
import { signupDemo } from '../../src/services/authService'
import type { Language } from '../../src/domain/types'
export default async function handler(request: Request) { const input = await body<{ name: string; email: string; preferredLanguage: Language }>(request); if (!input.name || !input.email) return json({ error: { code: 'INVALID_REQUEST', message: 'Name and email are required.' } }, 400); return json({ data: signupDemo(input) }, 201) }
