import { describe, expect, it } from 'vitest'
import {
  conversionEventName,
  homepageContent,
  homepageHrefKind,
  opensInNewTab,
} from '~/data/homepage'
import { homepageProfessionalCards } from '~/data/experience'
import { CONVERSION_EVENT, trackConversion } from '~/utils/track-conversion'

describe('homepage content model', () => {
  const published = homepageContent

  it('identifies the person, role, and experience for a first-time visitor', () => {
    expect(published.person.name).toBe('Daniel Kazansky')
    expect(published.person.role).toBe('AI-Native Full-Stack Engineer')
    expect(published.person.experience).toBe('7+ years')
    expect(published.person.heroSubtitle).toBe(
      '7+ years across digital products and software delivery',
    )
    expect(published.person.heroSubtitle.toLowerCase()).not.toMatch(
      /7\+ years as a software engineer/,
    )
    expect(published.valueProposition).toMatch(/AI agents/)
    expect(published.valueProposition).toMatch(/full-stack/)
  })

  it('includes selected-work and contact CTAs plus GitHub, LinkedIn', () => {
    expect(published.primaryCtas.map(item => item.href)).toEqual(['#selected-work', '#contact'])
    const labels = published.profileLinks.map(item => item.label)
    expect(labels).toEqual(['GitHub', 'LinkedIn'])
    expect(published.profileLinks.find(item => item.label === 'GitHub')?.href).toBe('https://github.com/slnnzmtl')
    expect(published.profileLinks.find(item => item.label === 'LinkedIn')?.href).toContain('linkedin.com/in/daniel-kazansky')
  })

  it('uses only the approved proof facts', () => {
    expect(published.proof.map(item => item.value)).toEqual([
      '7+',
      '20M+',
      '10M+',
      '25%',
    ])
    expect(published.proof[3].label).toContain('500+ users')
  })

  it('does not publish a separate three-track intro', () => {
    expect(published).not.toHaveProperty('tracks')
    expect(published).not.toHaveProperty('tracksIntro')
  })

  it('groups selected work into professional, independent, and open-source', () => {
    expect(published.selectedWorkIntro).toBe(
      'Commercial product engineering, independent delivery, and publicly inspectable open-source systems.',
    )
    expect(published.workSections.map(section => section.id)).toEqual([
      'professional',
      'independent',
      'open-source',
    ])
    expect(published.workSections.map(section => section.title)).toEqual([
      'Professional Experience',
      'Independent Work',
      'Open-Source Engineering',
    ])
    expect(published.workSections[0].description).toContain('marketplace, analytics, and SaaS')
    expect(published.workSections[1].description).toContain('AI-native workflows')
    expect(published.workSections[2].description).toContain('Publicly inspectable systems')
  })

  it('lists condensed selected-work cards with Woki under independent and Rekordbox under products', () => {
    const slugs = published.workSections.flatMap(section => section.items.map(item => item.slug))
    expect(slugs).toEqual([
      'upwork-reputation-team',
      'subbly-senior-software-developer',
      'capgemini-software-developer',
      'ai-appointment-crm-automation',
      'woki-crm',
      'kml-map-viewer',
      'langgraph-personal-assistant',
      'directus-website-builder',
    ])

    const professional = published.workSections.find(section => section.id === 'professional')
    expect(professional?.items.map(item => item.subtitle)).toEqual([
      'Upwork · Long-term contractor · Jan 2025 – May 2026 · Remote',
      'Subbly® · Full-time · Nov 2023 – Dec 2024 · Remote',
      'Capgemini Engineering · Full-time · Jun 2022 – May 2023 · Remote',
    ])
    expect(professional?.items.map(item => item.title)).toEqual([
      'Senior Software Engineer (Reputation Team)',
      'Senior Software Developer',
      'Software Developer',
    ])
    expect(professional?.items.map(item => item.icon)).toEqual([
      '/images/experience/upwork.png',
      '/images/experience/subbly.png',
      '/images/experience/capgemini.png',
    ])
    expect(professional?.items.every(item => !item.hrefLabel)).toBe(true)
    expect(professional?.items.every(item => !item.href)).toBe(true)
    expect(professional?.items[0].summary.split(/\n{2,}/)).toHaveLength(1)
    expect(professional?.items[0].summary).toContain('tens of millions of users')
    expect(professional?.items[0].summary).not.toContain('Core Feature Ownership')
    expect(professional?.items[0].summary).not.toMatch(/massive scale/i)
    expect(professional?.items[0].summary).not.toMatch(/state-of-the-art/i)
    expect(professional?.items[0].summary).not.toMatch(/cutting-edge productivity/i)
    expect(professional?.items[0].summary).not.toMatch(/evaluation scoring paradigm/i)

    const independent = published.workSections.find(section => section.id === 'independent')
    expect(independent?.items.map(item => item.slug)).toEqual([
      'ai-appointment-crm-automation',
      'woki-crm',
      'kml-map-viewer',
    ])
    expect(independent?.items[0].featured).toBe(true)
    expect(independent?.items[0].hrefLabel).toBe('View project')
    const woki = independent?.items.find(item => item.slug === 'woki-crm')
    expect(woki?.title).toBe('Woki CRM')
    expect(woki?.subtitle).toContain('Woki.one')

    const openSource = published.workSections.find(section => section.id === 'open-source')
    expect(openSource?.items.map(item => item.slug)).toEqual([
      'langgraph-personal-assistant',
      'directus-website-builder',
    ])
    expect(
      published.workSections.some(section =>
        section.items.some(item => item.slug.includes('rekordbox')),
      ),
    ).toBe(false)
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

  it('includes approved Subbly metrics from LinkedIn professional experience', () => {
    const subbly = published.workSections
      .flatMap(section => section.items)
      .find(item => item.slug === 'subbly-senior-software-developer')
    expect(subbly?.subtitle).toContain('Subbly®')
    expect(subbly?.title).toBe('Senior Software Developer')
    expect(subbly?.summary).toMatch(/20%/)
    expect(subbly?.summary).toMatch(/25%/)
    expect(subbly?.summary).toMatch(/15%/)
    expect(subbly?.summary).toMatch(/500\+/)
  })

  it('derives professional selected-work cards from canonical experience roles', () => {
    expect(published.workSections[0].items).toEqual(homepageProfessionalCards())
  })

  it('covers agentic, full-stack, and production capabilities', () => {
    expect(published.capabilities.map(item => item.title)).toEqual([
      'Agentic AI systems',
      'Full-stack product engineering',
      'Production product engineering',
    ])
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
      ...published.proof.map(item => `${item.value} ${item.label}`),
      published.selectedWorkIntro,
      ...published.workSections.flatMap(section => [
        section.title,
        section.description,
        ...section.items.flatMap(item => [
          item.title,
          item.subtitle ?? '',
          item.summary,
          item.href ?? '',
          item.hrefLabel ?? '',
          ...(item.tags ?? []),
        ]),
      ]),
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
      ...published.capabilities.map(item => `${item.title} ${item.summary}`),
      published.contact.heading,
      published.contact.summary,
      published.contact.email.label,
      published.contact.email.href,
      published.contact.telegram.label,
      published.contact.telegram.href,
    ].join(' ').toLowerCase()

    expect(userFacingCopy).not.toMatch(/password|secret|api[_-]?key|webhook token/)
    expect(userFacingCopy).not.toMatch(/40% conversion|3x roi|70% time saved|85% better decisions/)
    expect(published.proof.some(item => item.value === 'Outcomes')).toBe(false)
    expect(userFacingCopy).not.toMatch(/home address/)
    expect(userFacingCopy).not.toMatch(/whoppah/)

    const userFacingWithSubtitles = [
      ...published.workSections.flatMap(section =>
        section.items.map(item => `${item.subtitle ?? ''} ${item.summary}`),
      ),
    ].join(' ')
    expect(userFacingWithSubtitles).toContain('Upwork')
    expect(userFacingWithSubtitles).toContain('Subbly®')
    expect(userFacingWithSubtitles).toContain('Capgemini Engineering')
    expect(userFacingWithSubtitles).toContain('Woki.one')

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

  it('maps contact and case hrefs to conversion event names', () => {
    expect(conversionEventName('mailto:kazanskydaniel@gmail.com')).toBe('contact_email')
    expect(conversionEventName('https://t.me/slnnzmtl')).toBe('contact_telegram')
    expect(conversionEventName('#contact')).toBe('contact')
    expect(conversionEventName('https://github.com/slnnzmtl/langgraph-appointment-bot')).toBe(
      'case_outbound',
    )
    expect(conversionEventName('/projects/rekordbox-playlist-converter')).toBeNull()
    expect(conversionEventName('#selected-work')).toBeNull()
  })

  it('trackConversion dispatches a window event without PII', () => {
    const seen: Array<{ name: string, props?: Record<string, string> }> = []
    const onConversion = (event: Event) => {
      const detail = (event as CustomEvent).detail as { name: string, props?: Record<string, string> }
      seen.push(detail)
    }
    window.addEventListener(CONVERSION_EVENT, onConversion)
    trackConversion('contact_email')
    trackConversion('case_outbound', { slug: 'woki-crm' })
    window.removeEventListener(CONVERSION_EVENT, onConversion)
    expect(seen).toEqual([
      { name: 'contact_email', props: undefined },
      { name: 'case_outbound', props: { slug: 'woki-crm' } },
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
