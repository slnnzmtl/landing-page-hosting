import { describe, expect, it } from 'vitest'
import {
  experienceUserFacingCopy,
  formatExperienceRange,
  experienceRolePath,
  homepageExperiencePreview,
} from '~/data/experience'
import { mapPortfolio } from '~/utils/cms/map'
import { cmsPortfolioFixture } from '~/tests/fixtures/cms-portfolio'

const BASE = { baseUrl: 'https://cms.kazansky.dev' }

describe('experience content model (CMS-mapped)', () => {
  const { experience: roles, professionalTenure: tenure } = mapPortfolio(
    cmsPortfolioFixture,
    BASE,
  )

  it('publishes all nine verified timeline roles in independent-first reverse-chronological order', () => {
    expect(roles).toHaveLength(9)
    expect(roles.map(role => role.id)).toEqual([
      'independent-ai-fullstack',
      'upwork-reputation-team',
      'subbly-senior-software-developer',
      'woki-lead-software-developer',
      'capgemini-software-developer',
      'kazansky-dev-fullstack',
      'malevich-frontend-developer',
      'woman-insight-web-developer',
      'dals-media-project-manager',
    ])
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
      expect(role.contributions.length).toBeGreaterThanOrEqual(2)
      expect(role.contributions.length).toBeLessThanOrEqual(4)
      expect(role.outcomes.length).toBeGreaterThanOrEqual(1)
      expect(role.outcomes.length).toBeLessThanOrEqual(2)
      expect(role.technologies.length).toBeGreaterThan(0)
      for (const outcome of role.outcomes) {
        expect(['personal', 'team', 'platform']).toContain(outcome.qualifier)
        expect(outcome.text.length).toBeGreaterThan(0)
      }
    }
  })

  it('keeps independent, contractor, freelance, and part-time engagement types without overlap copy', () => {
    const independent = roles.find(role => role.id === 'independent-ai-fullstack')
    const upwork = roles.find(role => role.id === 'upwork-reputation-team')
    const woki = roles.find(role => role.id === 'woki-lead-software-developer')
    const kazansky = roles.find(role => role.id === 'kazansky-dev-fullstack')
    expect(independent?.engagementType).toBe('independent')
    expect(upwork?.engagementType).toBe('contractor')
    expect(woki?.engagementType).toBe('part-time')
    expect(kazansky?.engagementType).toBe('freelance')
    expect(roles.every(role => !('overlapNote' in role))).toBe(true)
    expect(experienceUserFacingCopy(roles, tenure).toLowerCase()).not.toMatch(/overlap/)
  })

  it('asserts corrected LinkedIn/CV facts', () => {
    const woki = roles.find(role => role.id === 'woki-lead-software-developer')
    expect(woki?.title).toBe('Lead Software Developer in a startup')
    expect(woki?.start).toBe('2023-06')
    expect(woki?.end).toBe('2023-12')
    expect(woki?.contributions.join(' ')).toMatch(/4-person/)
    expect(formatExperienceRange(woki!)).toBe('Jun 2023 – Dec 2023')

    const capgemini = roles.find(role => role.id === 'capgemini-software-developer')
    expect(capgemini?.start).toBe('2022-06')
    expect(capgemini?.end).toBe('2023-05')

    const malevich = roles.find(role => role.id === 'malevich-frontend-developer')
    expect(malevich?.start).toBe('2020-11')
    expect(malevich?.end).toBe('2022-06')

    const womanInsight = roles.find(role => role.id === 'woman-insight-web-developer')
    expect(womanInsight?.outcomes.map(o => o.text).join(' ')).toMatch(/300K\+ contacts/)

    expect(roles.some(role => role.id === 'dals-media-project-manager')).toBe(true)
    expect(roles.some(role => role.id === 'kazansky-dev-fullstack')).toBe(true)

    const dals = roles.find(role => role.id === 'dals-media-project-manager')
    expect(dals?.start).toBe('2018-04')
    expect(dals?.workMode).toBe('on-site')
  })

  it('keeps Upwork and Subbly titles as currently published', () => {
    const upwork = roles.find(role => role.id === 'upwork-reputation-team')
    const subbly = roles.find(role => role.id === 'subbly-senior-software-developer')
    expect(upwork?.title).toBe('Senior Software Engineer (Reputation Team)')
    expect(subbly?.title).toBe('Senior Software Developer')
  })

  it('links independent AI work to the public appointment bot', () => {
    const independent = roles.find(role => role.id === 'independent-ai-fullstack')
    expect(independent?.links?.some(link =>
      link.href === 'https://github.com/slnnzmtl/langgraph-appointment-bot',
    )).toBe(true)
  })

  it('rejects unsupported claims and never includes private evidence fields', () => {
    const copy = experienceUserFacingCopy(roles, tenure).toLowerCase()
    expect(copy).not.toMatch(/3-person/)
    expect(copy).not.toMatch(/three-person/)
    expect(copy).not.toMatch(/2022-05/)
    expect(copy).not.toMatch(/may 2022/)
    expect(copy).not.toMatch(/500k\+ deals/)
    expect(copy).not.toMatch(/500\+k deals/)
    expect(copy).not.toMatch(/8\+ years as a software engineer/)
    expect(copy).not.toMatch(/recommendation/)

    const serialized = JSON.stringify(roles)
    expect(serialized).not.toMatch(/evidence_origin|evidence_note/)
    expect(roles.every(role => !('source' in role))).toBe(true)
  })

  it('qualifies tenure without claiming 8+ years specifically as a software engineer', () => {
    expect(tenure.short).toBe('8+ years')
    expect(tenure.label).toMatch(/digital products/i)
    expect(tenure.heroSubtitle).toMatch(/digital products and software delivery/i)
    expect(tenure.softwareEngineeringSince).toBe('Building software since 2019')
    expect(tenure.pageIntro).toMatch(/evidence-based timeline/i)
    expect(tenure.heroSubtitle.toLowerCase()).not.toMatch(
      /8\+ years as a software engineer/,
    )
  })

  it('builds experience role anchor paths for timeline scrolling', () => {
    expect(experienceRolePath('upwork-reputation-team')).toBe(
      '/experience#upwork-reputation-team',
    )
  })

  it('derives homepage experience preview chips from recent role ids', () => {
    const chips = homepageExperiencePreview(
      [
        'upwork-reputation-team',
        'subbly-senior-software-developer',
        'woki-lead-software-developer',
      ],
      roles,
    )
    expect(chips.map(chip => chip.id)).toEqual([
      'upwork-reputation-team',
      'subbly-senior-software-developer',
      'woki-lead-software-developer',
    ])
    expect(chips.map(chip => chip.organization)).toEqual([
      'Upwork',
      'Subbly®',
      'Woki.one',
    ])
    expect(chips.every(chip => chip.icon)).toBe(true)
  })
})
