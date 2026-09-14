import { describe, it, expect } from 'vitest'
import { findProject, listProjectSlugs, projects } from '~/domains/projects/data/registry'
import { projectPath } from '~/domains/projects/data/types'
import { getProjectRoutes } from '~/domains/projects/project-routes'

describe('project registry', () => {
  it('registers at least the Rekordbox converter', () => {
    expect(projects.length).toBeGreaterThan(0)
    expect(listProjectSlugs()).toContain('rekordbox-playlist-converter')
  })

  it('looks up a project by slug', () => {
    const found = findProject('rekordbox-playlist-converter')
    expect(found?.name).toBe('Simple Rekordbox Converter')
    expect(found?.slug).toBe('rekordbox-playlist-converter')
  })

  it('returns undefined for unknown or empty slugs', () => {
    expect(findProject('not-a-real-project')).toBeUndefined()
    expect(findProject('')).toBeUndefined()
  })

  it('is case sensitive', () => {
    expect(findProject('Rekordbox-Playlist-Converter')).toBeUndefined()
  })
})

describe('getProjectRoutes', () => {
  it('includes the projects index and every registered slug', () => {
    const routes = getProjectRoutes()
    expect(routes).toContain('/projects')
    for (const slug of listProjectSlugs()) {
      expect(routes).toContain(projectPath(slug))
    }
  })

  it('does not invent unregistered slugs', () => {
    expect(getProjectRoutes()).not.toContain('/projects/not-a-real-project')
  })
})
