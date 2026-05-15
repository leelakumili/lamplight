import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { setCookie, getCookie } from 'hono/cookie'
import { timingSafeEqual } from 'crypto'
import { readFileSync, existsSync } from 'fs'
import { hostname } from 'os'
import { resolve } from 'path'
import { config } from './lib/config'
import { createSession, destroySession } from './lib/session'
import { authMiddleware } from './middleware/auth'
import { proxy } from './routes/proxy'

const app = new Hono()

// ── Public ────────────────────────────────────────────────────────────────────

app.get('/health', (c) => c.json({ ok: true }))

app.get('/login', (c) => c.html(loginHtml()))

app.post('/login', async (c) => {
  const body = await c.req.json<{ pin?: string }>().catch(() => ({}))
  const pin = body.pin ?? ''
  const expected = Buffer.from(config.pin, 'utf8')
  const actual   = Buffer.from(pin, 'utf8')
  const ok = expected.length === actual.length && timingSafeEqual(expected, actual)
  if (!ok) return c.json({ error: 'Wrong PIN' }, 401)
  const token = createSession()
  setCookie(c, 'lamplight_session', token, {
    httpOnly: true,
    sameSite: 'Lax',
    maxAge:   60 * 60 * 24 * 365,
    path:     '/',
  })
  return c.json({ ok: true })
})

app.post('/logout', (c) => {
  const token = getCookie(c, 'lamplight_session') ?? ''
  destroySession(token)
  setCookie(c, 'lamplight_session', '', { maxAge: 0, path: '/' })
  return c.redirect('/login')
})

// ── Auth guard ────────────────────────────────────────────────────────────────

app.use('*', authMiddleware)

// ── Proxy routes ──────────────────────────────────────────────────────────────

app.route('/api/proxy', proxy)

// ── SPA static files ──────────────────────────────────────────────────────────

const distDir  = resolve(process.cwd(), 'dist')
const indexHtml = resolve(distDir, 'index.html')

if (!existsSync(indexHtml)) {
  console.error('\n  ERROR: dist/ not found. Run "npm run build" first.\n')
  process.exit(1)
}

app.use('/*', serveStatic({ root: distDir }))
app.get('/*', (c) => c.html(readFileSync(indexHtml, 'utf-8')))

// ── Boot ──────────────────────────────────────────────────────────────────────

serve({ fetch: app.fetch, port: config.port }, (info) => {
  const host = hostname().replace(/\.local$/, '')
  console.log(`\nLamplight running`)
  console.log(`  Local:   http://localhost:${info.port}`)
  console.log(`  Network: http://${host}.local:${info.port}`)
  console.log(`\n  Share this with family on your Wi-Fi ^\n`)
})

// ── Login page (self-contained HTML, no external deps) ───────────────────────

function loginHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Lamplight</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{min-height:100dvh;display:flex;align-items:center;justify-content:center;background:#faf4e8;font-family:system-ui,sans-serif}
    .wrap{display:flex;flex-direction:column;gap:20px;width:100%;max-width:300px;padding:0 24px}
    h1{font-size:22px;font-weight:400;color:#1f1b16;text-align:center;font-family:Georgia,serif}
    p{font-size:14px;color:#76705f;text-align:center;line-height:1.5}
    input{width:100%;padding:16px;border-radius:14px;border:1.5px solid #dfd5bd;background:#f3ead8;font-size:24px;text-align:center;letter-spacing:0.4em;color:#1f1b16;outline:none;transition:border-color .15s}
    input:focus{border-color:#c9924a}
    button{width:100%;height:52px;border-radius:14px;border:none;background:linear-gradient(135deg,#c9924a,#a35d3a);color:#faf4e8;font-size:16px;font-weight:500;cursor:pointer}
    .err{color:#a35d3a;font-size:13px;text-align:center;height:18px}
  </style>
</head>
<body>
  <div class="wrap">
    <h1>Lamplight</h1>
    <p>Enter the PIN to continue</p>
    <input id="pin" type="password" inputmode="numeric" autocomplete="current-password" autofocus placeholder="••••"/>
    <button onclick="submit()">Continue</button>
    <div class="err" id="err"></div>
  </div>
  <script>
    document.getElementById('pin').addEventListener('keydown', e => { if (e.key === 'Enter') submit() })
    async function submit() {
      const pin = document.getElementById('pin').value
      const res = await fetch('/login', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ pin }),
      })
      if (res.ok) { window.location.href = '/' }
      else {
        document.getElementById('err').textContent = 'Wrong PIN. Try again.'
        document.getElementById('pin').value = ''
        document.getElementById('pin').focus()
      }
    }
  </script>
</body>
</html>`
}
