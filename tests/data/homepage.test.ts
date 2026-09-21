import { describe, expect, it } from 'vitest'
import {
  conversionEventName,
  homepageHrefKind,
  opensInNewTab,
} from '~/data/homepage'
import { homepageExperiencePreview } from '~/data/experience'
import { CONVERSION_EVENT, trackConversion } from '~/utils/track-conversion'
import { mapPortfolio, homepageExperienceKeys } from '~/utils/cms/map'
import { cmsPortfolioFixture } from '~/tests/fixtures/cms-portfolio'

const BASE = { baseUrl: 'https://cms.example.test' }

describe('homepage content model (CMS-mapped)', () => {
  const { homepage: published, experience, professionalTenure: tenure } = mapPortfolio(
    cmsPortfolioFixture,
    BASE,
  )

  it('passes through person, role, and tenure from CMS', () => {
    expect(published.person.name).toBe(cmsPortfolioFixture.site.person_name)
    expect(published.person.role).toBe(cmsPortfolioFixture.site.person_role)
    expect(tenure.short).toBe(cmsPortfolioFixture.site.professional_tenure.short)
    expect(tenure.heroSubtitle).toBe(
      cmsPortfolioFixture.site.professional_tenure.heroSubtitle,
    )
    expect(published.valueProposition).toBe(cmsPortfolioFixture.site.value_proposition)
  })

  it('passes through primary CTAs and profile links', () => {
    expect(published.primaryCtas).toEqual(cmsPortfolioFixture.homepageSettings.primary_ctas)
    expect(published.profileLinks).toEqual(cmsPortfolioFixture.homepageSettings.profile_links)
  })

  it('passes through hero focus and homepage chrome headings', () => {
    expect(published).not.toHaveProperty('capabilities')
    expect(published.heroFocus).toEqual(cmsPortfolioFixture.homepageSettings.hero_focus)
    expect(published.proofHeading).toBe(cmsPortfolioFixture.homepageSettings.proof_heading)
    expect(published.featuredWorkHeading).toBe(
      cmsPortfolioFixture.homepageSettings.featured_work_heading,
    )
    expect(published.flagshipLabel).toBe(cmsPortfolioFixture.homepageSettings.flagship_label)
  })

  it('builds proof chips from tenure plus CMS claim keys', () => {
    expect(published.proof[0]).toEqual({
      value: '5+',
      label: cmsPortfolioFixture.site.professional_tenure.label,
    })
    expect(published.proof.slice(1).map(item => `${item.value} ${item.label}`)).toEqual([
      '10K+ active users on platform tools',
    ])
  })

  it('does not publish a separate three-track intro', () => {
    expect(published).not.toHaveProperty('tracks')
    expect(published).not.toHaveProperty('tracksIntro')
    expect(published).not.toHaveProperty('workSections')
  })

  it('orders featured cases from homepage M2M slugs', () => {
    expect(published.featuredCases.map(item => item.slug)).toEqual([
      'sample-flagship-case',
      'sample-secondary-case',
    ])
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

  it('spotlights the CMS product with a guide screenshot', () => {
    expect(published.products.items).toHaveLength(1)
    const spotlight = published.products.items[0]
    expect(spotlight.slug).toBe('sample-converter')
    expect(spotlight.image.src).toContain('main-window')
    expect(spotlight.cta.href).toBe('/products/sample-converter')
  })

  it('seeds primary nav from site_settings.menu', () => {
    expect(published.navItems.map(item => `${item.label}:${item.href}`)).toEqual(
      cmsPortfolioFixture.site.menu!.map(item => `${item.label}:${item.href}`),
    )
  })

  it('derives experience preview chips from CMS preview ids', () => {
    const previewKeys = homepageExperienceKeys(cmsPortfolioFixture.homepageSettings)
    const chips = homepageExperiencePreview(previewKeys, experience)
    expect(chips.map(chip => chip.id)).toEqual(previewKeys)
    expect(published.experiencePreview.items.map(i => i.organization)).toEqual([
      'Acme Corp',
    ])
  })

  it('keeps confidential client details and private fields out of published copy', () => {
    const blob = JSON.stringify(published)
    expect(blob).not.toMatch(/evidence_origin|evidence_note|confidentiality_notes|private_evidence/)
  })

  it('exposes contact email and telegram with CMS labels', () => {
    expect(published.contact.email.label).toBe(
      cmsPortfolioFixture.site.page_copy!.contact.email_label,
    )
    expect(published.contact.telegram.label).toBe(
      cmsPortfolioFixture.site.page_copy!.contact.telegram_label,
    )
    expect(published.contact.email.href).toBe('mailto:ada@example.test')
    expect(published.contact.telegram.href).toBe('https://t.me/ada-example')
  })
})

describe('homepage href helpers', () => {
  it('classifies native vs route hrefs', () => {
    expect(homepageHrefKind('https://github.com/example-org')).toBe('native')
    expect(homepageHrefKind('mailto:ada@example.test')).toBe('native')
    expect(homepageHrefKind('#contact')).toBe('native')
    expect(homepageHrefKind('/experience')).toBe('route')
    expect(homepageHrefKind('/experience#acme-senior-engineer')).toBe('route')
  })

  it('opens only http(s) links in a new tab', () => {
    expect(opensInNewTab('https://github.com')).toBe(true)
    expect(opensInNewTab('mailto:ada@example.test')).toBe(false)
    expect(opensInNewTab('/products')).toBe(false)
  })

  it('maps conversion events for flagship, case, product, and contact', () => {
    expect(conversionEventName('mailto:ada@example.test')).toBe('contact')
    expect(conversionEventName('https://t.me/ada-example')).toBe('contact')
    expect(conversionEventName('#contact')).toBe('contact')
    expect(conversionEventName('#flagship-case')).toBe(null)
    expect(conversionEventName('https://github.com/x', { featured: true })).toBe('flagship-case-open')
    expect(conversionEventName('/experience#acme', {})).toBe('case-open')
    expect(conversionEventName('/products/sample-converter', { product: true })).toBe('product-open')
  })

  it('emits the conversion custom event without PII in detail', () => {
    const seen: Array<{ name: string, props?: Record<string, string> }> = []
    const handler = (event: Event) => {
      const detail = (event as CustomEvent).detail as { name: string, props?: Record<string, string> }
      seen.push(detail)
    }
    window.addEventListener(CONVERSION_EVENT, handler)
    trackConversion('contact')
    trackConversion('case-open', { slug: 'sample-flagship-case' })
    window.removeEventListener(CONVERSION_EVENT, handler)
    expect(seen).toEqual([
      { name: 'contact', props: undefined },
      { name: 'case-open', props: { slug: 'sample-flagship-case' } },
    ])
    expect(JSON.stringify(seen)).not.toMatch(/mailto:|@example\.test|ada@/i)
  })
})
