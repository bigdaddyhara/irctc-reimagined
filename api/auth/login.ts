import { json, body } from '../_shared'
import { loginDemo } from '../../src/services/authService'
export default async function handler(request: Request) { try { const session = loginDemo(await body<{ email: string; password: string }>(request)); return json({ data: session }) } catch (error) { return json({ error: { code: 'INVALID_CREDENTIALS', message: error instanceof Error ? error.message : 'Invalid demo credentials.' } }, 401) } }
