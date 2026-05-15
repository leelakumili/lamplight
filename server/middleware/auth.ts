import type { Context, Next } from 'hono'
import { getCookie } from 'hono/cookie'
import { isValidSession } from '../lib/session'

const SKIP = ['/login', '/logout', '/health']

export async function authMiddleware(c: Context, next: Next) {
  if (SKIP.some(p => c.req.path === p || c.req.path.startsWith(p + '?'))) {
    return next()
  }
  const token = getCookie(c, 'lamplight_session') ?? ''
  if (isValidSession(token)) return next()

  const wantHtml = c.req.header('Accept')?.includes('text/html') ?? false
  return wantHtml ? c.redirect('/login') : c.json({ error: 'Unauthorized' }, 401)
}
