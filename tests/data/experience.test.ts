import { describe, expect, it } from 'vitest'
import {
  experienceUserFacingCopy,
  formatExperienceRange,
  experienceRolePath,
  homepageExperiencePreview,
} from '~/data/experience'
import { mapPortfolio } from '~/utils/cms/map'
import { cmsPortfolioFixture } from '~/tests/fixtures/cms-portfolio'

const BASE = { baseUrl: 'https://cms.example.test' }

describe('experience content model (CMS-mapped)', () => {
  const { experience: roles, experiencePage } = mapPortfolio(
    cmsPortfolioFixture,
    BASE,
  )

  it('maps published experience entries in CMS sort order', () => {
    expect(roles).toHaveLength(1)
    expect(roles.map(role => role.id)).toEqual(['acme-senior-engineer'])
  })

  it('requires structured fields, ISO dates, engagement, and location', () => {
    for (const role of roles) {
      expect(role.start).toMatch(/^\d{4}-\d{2}$/)
      if (role.end !== null) {
        expect(role.end).toMatch(/^\d{4}-\d{2}$/)
      }
      expect(role.organization.length).toBeGreaterThan(0)
      expect(role.title.length).toBeGreaterThan(0)
      expect(role.location.length).toBeGreaterThan(0)
      expect(role.scope.length).toBeGreaterThan(0)
      expect(role.contributions.length).toBeGreaterThanOrEqual(1)
      expect(role.outcomes.length).toBeGreaterThanOrEqual(1)
      expect(role.technologies.length).toBeGreaterThan(0)
      for (const outcome of role.outcomes) {
        expect(['personal', 'team', 'platform']).toContain(outcome.qualifier)
        expect(outcome.text.length).toBeGreaterThan(0)
      }
    }
  })

  it('passes through engagement type and formats date ranges', () => {
    const acme = roles.find(role => role.id === 'acme-senior-engineer')
    expect(acme?.engagementType).toBe('full-time')
    expect(formatExperienceRange(acme!)).toBe('Jan 2022 – Present')
    expect(roles.every(role => !('overlapNote' in role))).toBe(true)
  })

  it('passes through experience links from CMS', () => {
    const acme = roles.find(role => role.id === 'acme-senior-engineer')
    expect(acme?.links?.some(link =>
      link.href === 'https://github.com/example-org/sample-flagship',
    )).toBe(true)
  })

  it('never includes private evidence fields in mapped roles', () => {
    const serialized = JSON.stringify(roles)
    expect(serialized).not.toMatch(/evidence_origin|evidence_note/)
    expect(roles.every(role => !('source' in role))).toBe(true)
    expect(experienceUserFacingCopy(roles)).toContain('Acme Corp')
  })

  it('passes through experience page chrome from CMS', () => {
    expect(experiencePage.title).toBe(cmsPortfolioFixture.experiencePage.title)
    expect(experiencePage.page_intro).toBe(cmsPortfolioFixture.experiencePage.page_intro)
  })

  it('builds experience role anchor paths for timeline scrolling', () => {
    expect(experienceRolePath('acme-senior-engineer')).toBe(
      '/experience#acme-senior-engineer',
    )
  })

  it('derives homepage experience preview chips from role ids', () => {
    const chips = homepageExperiencePreview(['acme-senior-engineer'], roles)
    expect(chips.map(chip => chip.id)).toEqual(['acme-senior-engineer'])
    expect(chips.map(chip => chip.organization)).toEqual(['Acme Corp'])
    expect(chips.every(chip => chip.icon)).toBe(true)
  })
})
