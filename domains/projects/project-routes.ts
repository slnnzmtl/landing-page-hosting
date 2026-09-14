import { listProjectSlugs } from './data/registry'
import { projectPath } from './data/types'

/**
 * Discover public project routes for Nuxt static generation.
 * crawlLinks is false, so every registered slug must be listed explicitly.
 */
export function getProjectRoutes(): string[] {
  return [
    '/projects',
    ...listProjectSlugs().map(slug => projectPath(slug)),
  ]
}

export { listProjectSlugs, projectPath }
