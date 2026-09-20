import { describe, expect, it } from 'vitest'
import { findProject, getProjectRoutes, listProjectSlugs } from '~/domains/projects/data/registry'
import { mapPortfolio } from '~/utils/cms/map'
import { cmsPortfolioFixture } from '~/tests/fixtures/cms-portfolio'

const BASE = { baseUrl: 'https://cms.kazansky.dev' }
const { products } = mapPortfolio(cmsPortfolioFixture, BASE)

describe('projects registry helpers (CMS products)', () => {
  it('lists product slugs for prerender discovery', () => {
    expect(listProjectSlugs(products)).toEqual(['rekordbox-playlist-converter'])
    expect(getProjectRoutes(listProjectSlugs(products))).toEqual([
      '/projects',
      '/projects/rekordbox-playlist-converter',
    ])
  })

  it('finds a product by exact slug', () => {
    const found = findProject('rekordbox-playlist-converter', products)
    expect(found?.name).toBe('Simple Rekordbox Converter')
  })

  it('returns undefined for unknown or empty slugs', () => {
    expect(findProject('not-a-real-project', products)).toBeUndefined()
    expect(findProject('', products)).toBeUndefined()
  })

  it('is case-sensitive on slug lookup', () => {
    expect(findProject('Rekordbox-Playlist-Converter', products)).toBeUndefined()
  })
})
