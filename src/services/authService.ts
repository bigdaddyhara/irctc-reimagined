import { demoUsers } from '../data'
import type { Language, Session } from '../domain/types'
const key = 'irctc-demo-session'
export const loginDemo = (credentials: { email: string; password: string }): Session => { const user = demoUsers.find((item) => (item.email === credentials.email || item.mobile === credentials.email) && item.password === credentials.password); if (!user) throw new Error('Invalid demo credentials. Try demo@irctc-reimagined.test / demo123.'); const { password: _password, ...safeUser } = user; return { token: `demo-${user.id}`, user: safeUser, createdAt: new Date().toISOString() } }
export const signupDemo = (input: { name: string; email: string; preferredLanguage: Language }): Session => ({ token: `demo-signup-${Date.now()}`, createdAt: new Date().toISOString(), user: { id: `user-${Date.now()}`, name: input.name, email: input.email, mobile: '', preferredLanguage: input.preferredLanguage, preferredClass: 'Any class', savedPassengers: [input.name] } })
export const saveSession = (session: Session) => localStorage.setItem(key, JSON.stringify(session))
export const getStoredSession = (): Session | null => { try { const value = localStorage.getItem(key); return value ? JSON.parse(value) as Session : null } catch { return null } }
export const logoutDemo = () => localStorage.removeItem(key)
