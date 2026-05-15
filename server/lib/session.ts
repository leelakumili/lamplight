import { randomBytes } from 'crypto'

const sessions = new Set<string>()

export function createSession(): string {
  const token = randomBytes(32).toString('hex')
  sessions.add(token)
  return token
}

export function isValidSession(token: string): boolean {
  return sessions.has(token)
}

export function destroySession(token: string): void {
  sessions.delete(token)
}
