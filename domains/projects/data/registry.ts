import type { Project } from './types'
import { projectPath } from './types'

export function findProject(slug: string, projects: Project[]): Project | undefined {
  if (!slug) return undefined
  return projects.find(project => project.slug === slug)
}

export function listProjectSlugs(projects: Project[]): string[] {
  return projects.map(project => project.slug)
}

export function getProjectRoutes(slugs: string[]): string[] {
  return [
    '/projects',
    ...slugs.map(slug => projectPath(slug)),
  ]
}

export { projectPath }
