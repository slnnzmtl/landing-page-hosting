import { describe, expect, it } from 'vitest'
import {
  conversionEventName,
  homepageHrefKind,
  opensInNewTab,
} from '~/data/homepage'
import { homepageExperiencePreview } from '~/data/experience'
import { CONVERSION_EVENT, trackConversion } from '~/utils/track-conversion'
import { mapPortfolio } from '~/utils/cms/map'
import { cmsPortfolioFixture } from '~/tests/fixtures/cms-portfolio'

const BASE = { baseUrl: 'https://cms.kazansky.dev' }

describe('homepage content model (CMS-mapped)', () => {
  const { homepage: published, experience, professionalTenure: tenure } = mapPortfolio(
    cmsPortfolioFixture,
    BASE,
  )

  it('identifies the person, role, and experience for a first-time visitor', () => {
    expect(published.person.name).toBe('Daniel Kazansky')
    expect(published.person.role).toBe('AI-Native Full-Stack Engineer')
    expect(tenure.short).toBe('8+ years')
    expect(tenure.heroSubtitle).toBe(
      '8+ years across digital products and software delivery',
    )
    expect(tenure.heroSubtitle.toLowerCase()).not.toMatch(
      /8\+ years as a software engineer/,
    )
    expect(published.valueProposition).toMatch(/AI-enabled products/)
    expect(published.valueProposition).toMatch(/APIs, CRMs, databases/)
    expect(published.valueProposition).toMatch(/8\+ years/)
  })

  it('includes flagship and contact CTAs plus GitHub, LinkedIn', () => {
    expect(published.primaryCtas.map(item => item.href)).toEqual(['#flagship-case', '#contact'])
    expect(published.primaryCtas[0].label).toBe('View flagship case')
    expect(published.primaryCtas[1].label).toBe('Discuss a project')
    const labels = published.profileLinks.map(item => item.label)
    expect(labels).toEqual(['GitHub', 'LinkedIn'])
    expect(published.profileLinks.find(item => item.label === 'GitHub')?.href).toBe('https://github.com/slnnzmtl')
    expect(published.profileLinks.find(item => item.label === 'LinkedIn')?.href).toContain('linkedin.com/in/daniel-kazansky')
  })

  it('publishes a current-focus panel instead of standalone capability cards', () => {
    expect(published).not.toHaveProperty('capabilities')
    expect(published.heroFocus.heading).toBe('Current focus')
    expect(published.heroFocus.items.map(item => item.title)).toEqual([
      'Agent workflows',
      'APIs / CRM / data',
      'Production delivery',
    ])
  })

  it('uses selected-outcomes copy without internal approved-facts wording', () => {
    expect(published.proof.map(item => `${item.value} ${item.label}`)).toEqual([
      '8+ years across digital products',
      'Millions Marketplace products serving millions',
      '10M+ analytics data points',
      '25% higher onboarding completion',
    ])
    expect(published.proof[3].label).not.toMatch(/500\+/)
    expect(published.proof[1].label.toLowerCase()).not.toMatch(/20m/)
  })

  it('does not publish a separate three-track intro', () => {
    expect(published).not.toHaveProperty('tracks')
    expect(published).not.toHaveProperty('tracksIntro')
    expect(published).not.toHaveProperty('workSections')
  })

  it('features three cases without professional / independent / open-source taxonomy', () => {
    expect(published.featuredCases.map(item => item.slug)).toEqual([
      'ai-appointment-crm-automation',
      'upwork-reputation-team',
      'directus-website-builder',
    ])
    expect(published.featuredCases.find(item => item.slug === 'upwork-reputation-team')?.href).toBe(
      '/experience#upwork-reputation-team',
    )
    expect(published.featuredCases[0].featured).toBe(true)
    expect(published.featuredCases.filter(item => item.featured)).toHaveLength(1)
    for (const item of published.featuredCases) {
      expect(item.problem.length).toBeGreaterThan(0)
      expect(item.role.length).toBeGreaterThan(0)
      expect(item.contribution.length).toBeGreaterThan(0)
      expect(item.outcome.length).toBeGreaterThan(0)
      expect(item.stack.length).toBeGreaterThan(0)
    }
  })

  it('spotlights Rekordbox with a guide screenshot, not the product logo', () => {
    expect(published.products.items).toHaveLength(1)
    const rekordbox = published.products.items[0]
    expect(rekordbox.slug).toBe('rekordbox-playlist-converter')
    expect(rekordbox.image.src).toContain('macos-app-main-window')
    expect(rekordbox.cta.href).toBe('/products/rekordbox-playlist-converter')
  })

  it('seeds primary nav from site_settings.menu including GitHub', () => {
    expect(published.navItems.map(item => `${item.label}:${item.href}`)).toEqual([
      'Work:/',
      'Experience:/experience',
      'Products:/products',
      'Contact:/#contact',
      'GitHub:https://github.com/slnnzmtl',
    ])
  })

  it('derives experience preview chips from CMS preview ids', () => {
    const chips = homepageExperiencePreview(
      cmsPortfolioFixture.site.experience_preview_ids,
      experience,
    )
    expect(chips.map(chip => chip.id)).toEqual([
      'upwork-reputation-team',
      'subbly-senior-software-developer',
      'woki-lead-software-developer',
    ])
    expect(published.experiencePreview.items.map(i => i.organization)).toEqual([
      'Upwork',
      'Subbly®',
      'Woki.one',
    ])
  })

  it('keeps confidential client details and unapproved metrics out of published copy', () => {
    const blob = JSON.stringify(published)
    expect(blob).not.toMatch(/evidence_origin|evidence_note|confidentiality_notes|private_evidence/)
    expect(blob.toLowerCase()).not.toMatch(/whoppah|smoke alert/)
    expect(blob).not.toMatch(/3x ROI|40% conversion|70% time saved/)
  })

  it('exposes contact email and telegram with code-owned labels', () => {
    expect(published.contact.email.label).toBe('Email')
    expect(published.contact.telegram.label).toBe('Telegram')
    expect(published.contact.email.href).toBe('mailto:kazanskydaniel@gmail.com')
    expect(published.contact.telegram.href).toBe('https://t.me/slnnzmtl')
  })
})

describe('homepage href helpers', () => {
  it('classifies native vs route hrefs', () => {
    expect(homepageHrefKind('https://github.com/slnnzmtl')).toBe('native')
    expect(homepageHrefKind('mailto:kazanskydaniel@gmail.com')).toBe('native')
    expect(homepageHrefKind('#contact')).toBe('native')
    expect(homepageHrefKind('/experience')).toBe('route')
    expect(homepageHrefKind('/experience#upwork-reputation-team')).toBe('route')
  })

  it('opens only http(s) links in a new tab', () => {
    expect(opensInNewTab('https://github.com')).toBe(true)
    expect(opensInNewTab('mailto:kazanskydaniel@gmail.com')).toBe(false)
    expect(opensInNewTab('/products')).toBe(false)
  })

  it('maps conversion events for flagship, case, product, and contact', () => {
    expect(conversionEventName('mailto:kazanskydaniel@gmail.com')).toBe('contact')
    expect(conversionEventName('https://t.me/slnnzmtl')).toBe('contact')
    expect(conversionEventName('#contact')).toBe('contact')
    expect(conversionEventName('#flagship-case')).toBe(null)
    expect(conversionEventName('https://github.com/x', { featured: true })).toBe('flagship-case-open')
    expect(conversionEventName('/experience#upwork', {})).toBe('case-open')
    expect(conversionEventName('/products/rekordbox-playlist-converter', { product: true })).toBe('product-open')
  })

  it('emits the conversion custom event without PII in detail', () => {
    const seen: Array<{ name: string, props?: Record<string, string> }> = []
    const handler = (event: Event) => {
      const detail = (event as CustomEvent).detail as { name: string, props?: Record<string, string> }
      seen.push(detail)
    }
    window.addEventListener(CONVERSION_EVENT, handler)
    trackConversion('contact')
    trackConversion('case-open', { slug: 'directus-website-builder' })
    window.removeEventListener(CONVERSION_EVENT, handler)
    expect(seen).toEqual([
      { name: 'contact', props: undefined },
      { name: 'case-open', props: { slug: 'directus-website-builder' } },
    ])
    expect(JSON.stringify(seen)).not.toMatch(/mailto:|@gmail|kazanskydaniel/i)
  })
})
