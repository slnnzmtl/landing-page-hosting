import { readdirSync, appendFileSync } from 'node:fs'
import { join } from 'node:path'

/**
 * Discover finance app routes from domains/finance/pages
 * Used for Nuxt static generation to prerender /finance/* pages
 */
export function getFinanceRoutes(): string[] {
  try {
    const dir = join(process.cwd(), 'domains', 'finance', 'pages')
    const files = readdirSync(dir).filter(f => f.endsWith('.vue'))
    const slugs = files.map(f => f.replace(/\.vue$/, ''))
    const routes = slugs.map(s => `/finance/${s}`)

    // #region agent log
    const payload = { sessionId: '044f29', runId: 'pre-fix', hypothesisId: 'A', location: 'finance-routes.ts', message: 'getFinanceRoutes', data: { dir, files, routes }, timestamp: Date.now() }
    try { appendFileSync('/Users/danielraptom/Git/landing-hosting/.cursor/debug-044f29.log', `${JSON.stringify(payload)}\n`) } catch { /* ignore */ }
    fetch('http://127.0.0.1:7492/ingest/68de19a8-f098-430f-bc8f-b26c529e37fc', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '044f29' }, body: JSON.stringify(payload) }).catch(() => {})
    // #endregion

    return routes
  }
  catch (e) {
    console.warn('[finance-routes] Failed to compute finance routes', e)
    return []
  }
}
