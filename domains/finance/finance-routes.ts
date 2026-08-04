import { readdirSync } from 'node:fs'
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
    return slugs.map(s => `/finance/${s}`)
  }
  catch (e) {
    console.warn('[finance-routes] Failed to compute finance routes', e)
    return []
  }
}
