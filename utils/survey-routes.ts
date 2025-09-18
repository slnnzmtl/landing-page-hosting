import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

/**
 * Discover survey routes by reading JSON files from pages/survey/data directory
 * Used for Nuxt static generation to prerender dynamic survey pages
 */
export function getSurveyRoutes(): string[] {
  try {
    const dir = join(process.cwd(), 'pages', 'survey', 'data')
    const files = readdirSync(dir).filter(f => f.endsWith('.json'))
    const slugs = files.map((f) => {
      try {
        const json = JSON.parse(readFileSync(join(dir, f), 'utf-8'))
        return json?.slug as string | undefined
      } catch (e) {
        console.warn(`[survey-routes] Failed to parse survey JSON: ${f}`, e)
        return undefined
      }
    }).filter((s): s is string => Boolean(s))
    return slugs.map((s) => `/survey/${s}`)
  } catch (e) {
    console.warn('[survey-routes] Failed to compute survey routes', e)
    return []
  }
}