import { describe, expect, it } from 'vitest'
import {
  experienceRoles,
  experienceUserFacingCopy,
  formatExperienceRange,
  experienceRolePath,
  homepageExperiencePreview,
  professionalTenure,
  publishedExperienceRoles,
} from '~/data/experience'

describe('experience content model', () => {
  const roles = publishedExperienceRoles()

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

  it('requires structured fields, ISO dates, engagement, location, and approved provenance', () => {
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
      expect(role.source.status).toBe('approved')
      expect(role.source.origin.length).toBeGreaterThan(0)
      expect(role.source.note.length).toBeGreaterThan(0)
      for (const outcome of role.outcomes) {
        expect(['personal', 'team', 'platform']).toContain(outcome.qualifier)
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
    expect(experienceUserFacingCopy().toLowerCase()).not.toMatch(/overlap/)
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

  it('rejects unsupported claims and recommendation leakage', () => {
    const copy = experienceUserFacingCopy().toLowerCase()
    expect(copy).not.toMatch(/3-person/)
    expect(copy).not.toMatch(/three-person/)
    expect(copy).not.toMatch(/2022-05/)
    expect(copy).not.toMatch(/may 2022/)
    expect(copy).not.toMatch(/500k\+ deals/)
    expect(copy).not.toMatch(/500\+k deals/)
    expect(copy).not.toMatch(/8\+ years as a software engineer/)
    expect(copy).not.toMatch(/recommendation/)
    expect(roles.every(role => !JSON.stringify({
      scope: role.scope,
      contributions: role.contributions,
      outcomes: role.outcomes,
      homepageSummary: role.homepageSummary,
    }).includes(role.source.note))).toBe(true)

    for (const role of experienceRoles) {
      const rendered = [
        role.scope,
        ...role.contributions,
        ...role.outcomes.map(o => o.text),
        role.homepageSummary ?? '',
      ].join(' ')
      expect(rendered).not.toContain(role.source.note)
      expect(rendered).not.toContain(role.source.origin)
    }
  })

  it('qualifies tenure without claiming 8+ years specifically as a software engineer', () => {
    expect(professionalTenure.short).toBe('8+ years')
    expect(professionalTenure.label).toMatch(/digital products/i)
    expect(professionalTenure.heroSubtitle).toMatch(/digital products and software delivery/i)
    expect(professionalTenure.softwareEngineeringSince).toBe('Building software since 2019')
    expect(professionalTenure.pageIntro).toMatch(/evidence-based timeline/i)
    expect(professionalTenure.heroSubtitle.toLowerCase()).not.toMatch(
      /8\+ years as a software engineer/,
    )
  })

  it('builds experience role anchor paths for timeline scrolling', () => {
    expect(experienceRolePath('upwork-reputation-team')).toBe(
      '/experience#upwork-reputation-team',
    )
  })

  it('derives homepage experience preview chips from recent role ids', () => {
    const chips = homepageExperiencePreview()
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
