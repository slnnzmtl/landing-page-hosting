import { describe, expect, it } from 'vitest'
import {
  conversionEventName,
  homepageContent,
  homepageHrefKind,
  opensInNewTab,
} from '~/data/homepage'
import { homepageExperiencePreview } from '~/data/experience'
import { CONVERSION_EVENT, trackConversion } from '~/utils/track-conversion'

describe('homepage content model', () => {
  const published = homepageContent

  it('identifies the person, role, and experience for a first-time visitor', () => {
    expect(published.person.name).toBe('Daniel Kazansky')
    expect(published.person.role).toBe('AI-Native Full-Stack Engineer')
    expect(published.person.experience).toBe('8+ years')
    expect(published.person.heroSubtitle).toBe(
      '8+ years across digital products and software delivery',
    )
    expect(published.person.heroSubtitle.toLowerCase()).not.toMatch(
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
    expect(published.featuredCases[0].featured).toBe(true)
    expect(published.featuredCases.filter(item => item.featured)).toHaveLength(1)
    for (const item of published.featuredCases) {
      expect(item.problem.length).toBeGreaterThan(0)
      expect(item.role.length).toBeGreaterThan(0)
      expect(item.contribution.length).toBeGreaterThan(0)
      expect(item.outcome.length).toBeGreaterThan(0)
      expect(item.stack.length).toBeGreaterThan(0)
      expect(item.href.length).toBeGreaterThan(0)
      expect(item.hrefLabel.length).toBeGreaterThan(0)
    }
    expect(published.featuredCases.some(item => item.slug.includes('rekordbox'))).toBe(false)
    expect(published.featuredCases.some(item => item.slug === 'subbly-senior-software-developer')).toBe(false)
  })

  it('publishes a Products section with a Rekordbox spotlight', () => {
    expect(published.products.heading).toBe('Products')
    expect(published.products.description).toContain('design, build, package, and maintain')
    expect(published.products.items).toHaveLength(1)
    const rekordbox = published.products.items[0]
    expect(rekordbox.slug).toBe('rekordbox-playlist-converter')
    expect(rekordbox.title).toBe('Simple Rekordbox Converter')
    expect(rekordbox.lead).toContain('without modifying your original files')
    expect(rekordbox.supportingLine).toContain('universal macOS app')
    expect(rekordbox.tags).toEqual([
      'Python',
      'Tkinter',
      'FFmpeg',
      'PyInstaller',
      'Rekordbox XML',
    ])
    expect(rekordbox.cta).toEqual({
      label: 'View product',
      href: '/projects/rekordbox-playlist-converter',
    })
    expect(rekordbox.image.src).toContain('macos-app-main-window')
  })

  it('keeps Subbly metrics off the homepage and in the experience preview only as a role chip', () => {
    expect(published.experiencePreview.items).toEqual(homepageExperiencePreview())
    expect(published.experiencePreview.items.map(item => item.id)).toEqual([
      'upwork-reputation-team',
      'subbly-senior-software-developer',
      'woki-lead-software-developer',
    ])
    expect(published.experiencePreview.cta).toEqual({
      label: 'View full timeline',
      href: '/experience',
    })
    const homepageCopy = [
      ...published.featuredCases.flatMap(item => [
        item.problem,
        item.role,
        item.contribution,
        item.outcome,
      ]),
      ...published.proof.map(item => `${item.value} ${item.label}`),
    ].join(' ')
    expect(homepageCopy).not.toMatch(/20%/)
    expect(homepageCopy).not.toMatch(/15%/)
    expect(homepageCopy).not.toMatch(/500\+/)
  })

  it('keeps confidential client details and unapproved metrics out of published copy', () => {
    const userFacingCopy = [
      published.person.name,
      published.person.role,
      published.person.experience,
      published.person.heroSubtitle,
      published.valueProposition,
      ...published.primaryCtas.map(item => `${item.label} ${item.href}`),
      ...published.profileLinks.map(item => `${item.label} ${item.href}`),
      ...published.heroFocus.items.map(item => `${item.title} ${item.summary}`),
      ...published.proof.map(item => `${item.value} ${item.label}`),
      published.featuredWorkIntro,
      ...published.featuredCases.flatMap(item => [
        item.title,
        item.problem,
        item.role,
        item.contribution,
        item.outcome,
        item.href,
        item.hrefLabel,
        ...item.stack,
      ]),
      published.experiencePreview.heading,
      ...published.experiencePreview.items.map(item => item.organization),
      published.experiencePreview.cta.label,
      published.products.heading,
      published.products.description,
      ...published.products.items.flatMap(item => [
        item.title,
        item.lead,
        item.supportingLine,
        item.cta.label,
        item.cta.href,
        ...item.tags,
      ]),
      published.contact.heading,
      published.contact.summary,
      published.contact.email.label,
      published.contact.email.href,
      published.contact.telegram.label,
      published.contact.telegram.href,
    ].join(' ').toLowerCase()

    expect(userFacingCopy).not.toMatch(/password|secret|api[_-]?key|webhook token/)
    expect(userFacingCopy).not.toMatch(/40% conversion|3x roi|70% time saved|85% better decisions/)
    expect(userFacingCopy).not.toMatch(/approved facts/)
    expect(published.proof.some(item => item.value === 'Outcomes')).toBe(false)
    expect(userFacingCopy).not.toMatch(/home address/)
    expect(userFacingCopy).not.toMatch(/whoppah/)
    expect(userFacingCopy).toContain('upwork')
    expect(userFacingCopy).toContain('subbly')
    expect(userFacingCopy).toContain('woki')

    const rekordbox = published.products.items[0]
    const rekordboxCopy = [
      rekordbox?.title,
      rekordbox?.lead,
      rekordbox?.supportingLine,
      ...(rekordbox?.tags ?? []),
    ].join(' ').toLowerCase()
    expect(rekordboxCopy).not.toMatch(/swift/)
    expect(rekordboxCopy).not.toMatch(/ai-powered/)
    expect(rekordboxCopy).not.toMatch(/macos-only|mac os only/)
  })

  it('classifies homepage hrefs for link rendering', () => {
    expect(homepageHrefKind('https://github.com/slnnzmtl')).toBe('native')
    expect(homepageHrefKind('mailto:kazanskydaniel@gmail.com')).toBe('native')
    expect(homepageHrefKind('https://t.me/slnnzmtl')).toBe('native')
    expect(homepageHrefKind('#contact')).toBe('native')
    expect(homepageHrefKind('/projects/rekordbox-playlist-converter')).toBe('route')
    expect(opensInNewTab('https://github.com/slnnzmtl')).toBe(true)
    expect(opensInNewTab('https://t.me/slnnzmtl')).toBe(true)
    expect(opensInNewTab('mailto:kazanskydaniel@gmail.com')).toBe(false)
  })

  it('maps contact, case, and product hrefs to the four Umami events', () => {
    expect(conversionEventName('mailto:kazanskydaniel@gmail.com')).toBe('contact')
    expect(conversionEventName('https://t.me/slnnzmtl')).toBe('contact')
    expect(conversionEventName('#contact')).toBe('contact')
    expect(conversionEventName(
      'https://github.com/slnnzmtl/langgraph-appointment-bot',
      { featured: true },
    )).toBe('flagship-case-open')
    expect(conversionEventName('https://github.com/slnnzmtl/directus-website-builder')).toBe(
      'case-open',
    )
    expect(conversionEventName('/experience')).toBe('case-open')
    expect(conversionEventName('/projects/rekordbox-playlist-converter', { product: true })).toBe(
      'product-open',
    )
    expect(conversionEventName('#flagship-case')).toBeNull()
  })

  it('trackConversion dispatches a window event without PII', () => {
    const seen: Array<{ name: string, props?: Record<string, string> }> = []
    const onConversion = (event: Event) => {
      const detail = (event as CustomEvent).detail as { name: string, props?: Record<string, string> }
      seen.push(detail)
    }
    window.addEventListener(CONVERSION_EVENT, onConversion)
    trackConversion('contact')
    trackConversion('case-open', { slug: 'directus-website-builder' })
    window.removeEventListener(CONVERSION_EVENT, onConversion)
    expect(seen).toEqual([
      { name: 'contact', props: undefined },
      { name: 'case-open', props: { slug: 'directus-website-builder' } },
    ])
    expect(JSON.stringify(seen)).not.toMatch(/mailto:|@gmail|kazanskydaniel/i)
  })

  it('publishes email and Telegram contact links', () => {
    expect(published.contact.email).toEqual({
      label: 'Email',
      href: 'mailto:kazanskydaniel@gmail.com',
    })
    expect(published.contact.telegram).toEqual({
      label: 'Telegram',
      href: 'https://t.me/slnnzmtl',
    })
  })
})
