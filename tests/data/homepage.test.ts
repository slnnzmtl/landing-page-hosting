import { describe, expect, it } from 'vitest'
import {
  collectClaimSources,
  homepageContent,
  isApproved,
  homepageHrefKind,
  opensInNewTab,
  publishedHomepage,
  trackTitle,
} from '~/data/homepage'

describe('homepage content model', () => {
  const published = publishedHomepage()

  it('identifies the person, role, and experience for a first-time visitor', () => {
    expect(published.person.name.text).toBe('Daniel Kazansky')
    expect(published.person.role.text).toBe('AI-Native Full-Stack Engineer')
    expect(published.person.experience.text).toBe('8+ years')
    expect(published.person.heroSubtitle.text).toContain('shipping production software')
    expect(published.person.heroSubtitle.text).toContain('AI-native')
    expect(published.valueProposition.text.length).toBeGreaterThan(20)
    expect(published.workflow.text).toMatch(/LLMs/)
    expect(published.workflow.text).toMatch(/APIs/)
    expect(published.workflow.text).toMatch(/CRMs/)
  })

  it('requires a source or approval note on every claim', () => {
    const sources = collectClaimSources(homepageContent)
    expect(sources.length).toBeGreaterThan(10)
    for (const source of sources) {
      expect(source.origin.length).toBeGreaterThan(3)
      expect(source.note.length).toBeGreaterThan(10)
      expect(['approved', 'pending-validation', 'internal-only']).toContain(source.status)
    }
  })

  it('publishes only approved claims', () => {
    const sources = [
      ...published.proof.map(item => item.source),
      ...published.tracks.map(item => item.source),
      ...published.workSections.flatMap(section => [
        section.description.source,
        ...section.items.map(item => item.source),
      ]),
      ...published.capabilities.map(item => item.source),
    ]
    expect(sources.every(isApproved)).toBe(true)
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
      '8+',
      '20M+',
      '10M+',
      '25%',
    ])
    expect(published.proof[3].label).toContain('500+ users')
  })

  it('supports the three-track portfolio strategy', () => {
    expect(published.tracks.map(track => track.id)).toEqual([
      'enterprise',
      'independent',
      'open-source',
    ])
    expect(trackTitle(published.tracks, 'enterprise')).toBe('Enterprise')
    expect(trackTitle(published.tracks, 'independent')).toBe('Independent / Client Work')
    expect(trackTitle(published.tracks, 'open-source')).toBe('Open Source & Products')
  })

  it('groups selected work into three visible categories', () => {
    expect(published.selectedWorkIntro.text).toContain('Enterprise product engineering')
    expect(published.workSections.map(section => section.id)).toEqual([
      'professional',
      'independent',
      'products-open-source',
    ])
    expect(published.workSections.map(section => section.title)).toEqual([
      'Professional Experience',
      'Independent Work',
      'Products & Open Source',
    ])
    expect(published.workSections[0].description.text).toContain('marketplace, analytics, and SaaS')
    expect(published.workSections[1].description.text).toContain('AI-native workflows')
    expect(published.workSections[2].description.text).toContain('designed, built, tested, and released')
  })

  it('lists selected-work cards with LinkedIn professional roles and rekordbox under products', () => {
    const slugs = published.workSections.flatMap(section => section.items.map(item => item.slug))
    expect(slugs).toEqual([
      'upwork-reputation-team',
      'subbly-senior-software-developer',
      'woki-one-lead-software-developer',
      'capgemini-software-developer',
      'ai-appointment-crm-automation',
      'kml-map-viewer',
      'langgraph-personal-assistant',
      'directus-website-builder',
      'rekordbox-playlist-converter',
    ])

    const professional = published.workSections.find(section => section.id === 'professional')
    expect(professional?.items.map(item => item.subtitle)).toEqual([
      'Upwork · Jan 2025 – May 2026 · Remote',
      'Subbly® · Full-time · Nov 2023 – Dec 2024 · Remote',
      'Woki.one · Part-time · Jun 2023 – Dec 2023 · Remote',
      'Capgemini Engineering · Full-time · Jun 2022 – May 2023 · Remote',
    ])
    expect(professional?.items.map(item => item.title)).toEqual([
      'Senior Software Engineer (Reputation Team)',
      'Senior Software Developer',
      'Lead Software Developer in a startup',
      'Software Developer',
    ])

    expect(professional?.items.map(item => item.icon)).toEqual([
      '/images/experience/upwork.png',
      '/images/experience/subbly.png',
      '/images/experience/woki.png',
      '/images/experience/capgemini.png',
    ])
    expect(professional?.items.every(item => !item.hrefLabel)).toBe(true)
    expect(professional?.items.every(item => !item.href)).toBe(true)
    expect(professional?.items[0].summary.split(/\n{2,}/)).toHaveLength(5)
    expect(professional?.items[0].summary).toContain('Core Feature Ownership')

    const independent = published.workSections.find(section => section.id === 'independent')
    expect(independent?.items[0].slug).toBe('ai-appointment-crm-automation')
    expect(independent?.items[0].featured).toBe(true)
    expect(independent?.items[0].hrefLabel).toBe('View project')
    expect(independent?.items.some(item => item.slug === 'woki-crm')).toBe(false)

    const products = published.workSections.find(section => section.id === 'products-open-source')
    const rekordbox = products?.items.find(item => item.slug === 'rekordbox-playlist-converter')
    expect(rekordbox?.hrefLabel).toBe('View product')
    expect(rekordbox?.tags).toEqual([
      'Python',
      'Tkinter',
      'FFmpeg',
      'FFprobe',
      'PyInstaller',
      'macOS',
      'CLI',
      'Rekordbox XML',
      'GitHub Actions',
      'unittest',
    ])
    expect(
      published.workSections
        .filter(section => section.id !== 'products-open-source')
        .some(section => section.items.some(item => item.slug.includes('rekordbox'))),
    ).toBe(false)
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
    expect(isApproved(subbly!.source)).toBe(true)
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
      published.person.name.text,
      published.person.role.text,
      published.person.experience.text,
      published.person.heroSubtitle.text,
      published.valueProposition.text,
      published.workflow.text,
      ...published.primaryCtas.map(item => `${item.label} ${item.href}`),
      ...published.profileLinks.map(item => `${item.label} ${item.href}`),
      ...published.proof.map(item => `${item.value} ${item.label}`),
      published.tracksIntro.text,
      ...published.tracks.map(item => `${item.title} ${item.summary}`),
      published.selectedWorkIntro.text,
      ...published.workSections.flatMap(section => [
        section.title,
        section.description.text,
        ...section.items.flatMap(item => [
          item.title,
          item.subtitle ?? '',
          item.summary,
          item.href ?? '',
          item.hrefLabel ?? '',
          ...(item.tags ?? []),
        ]),
      ]),
      ...published.capabilities.map(item => `${item.title} ${item.summary}`),
      published.contact.heading.text,
      published.contact.summary.text,
      published.contact.email.label,
      published.contact.email.href,
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

    const rekordbox = published.workSections
      .flatMap(section => section.items)
      .find(item => item.slug === 'rekordbox-playlist-converter')
    const rekordboxCopy = [
      rekordbox?.title,
      rekordbox?.summary,
      ...(rekordbox?.tags ?? []),
    ].join(' ').toLowerCase()
    expect(rekordboxCopy).not.toMatch(/swift/)
    expect(rekordboxCopy).not.toMatch(/ai-powered/)
    expect(rekordboxCopy).not.toMatch(/macos-only|mac os only/)
  })

  it('classifies homepage hrefs for link rendering', () => {
    expect(homepageHrefKind('https://github.com/slnnzmtl')).toBe('native')
    expect(homepageHrefKind('mailto:kazanskydaniel@gmail.com')).toBe('native')
    expect(homepageHrefKind('#contact')).toBe('native')
    expect(homepageHrefKind('/projects/rekordbox-playlist-converter')).toBe('route')
    expect(opensInNewTab('https://github.com/slnnzmtl')).toBe(true)
    expect(opensInNewTab('mailto:kazanskydaniel@gmail.com')).toBe(false)
  })
})
