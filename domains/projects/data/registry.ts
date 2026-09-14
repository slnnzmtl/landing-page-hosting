import { rekordboxPlaylistConverter } from './rekordbox-playlist-converter'
import type { Project } from './types'

export const projects: Project[] = [
  rekordboxPlaylistConverter,
]

export function findProject(slug: string): Project | undefined {
  if (!slug) return undefined
  return projects.find(project => project.slug === slug)
}

export function listProjectSlugs(): string[] {
  return projects.map(project => project.slug)
}
