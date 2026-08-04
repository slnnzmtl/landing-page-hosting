import { readdirSync } from 'node:fs'
import { join } from 'node:path'

/**
 * Discover service landing routes from domains/service/pages
 * Used for Nuxt static generation to prerender /service/* pages
 */
export function getServiceRoutes(): string[] {
  try {
    const dir = join(process.cwd(), 'domains', 'service', 'pages')
    const files = readdirSync(dir).filter(f => f.endsWith('.vue'))
    const slugs = files.map(f => f.replace(/\.vue$/, ''))
    return slugs.map(s => `/service/${s}`)
  }
  catch (e) {
    console.warn('[service-routes] Failed to compute service routes', e)
    return []
  }
}
