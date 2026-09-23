import { describe, expect, it } from 'vitest'
import { mapPortfolio } from '~/utils/cms/map'
import { mapCaseStudy, plainTextParagraphs } from '~/utils/cms/map-cases'
import { PRIVATE_FIELDS, PROJECT_FIELDS, FILE_FIELDS } from '~/utils/cms/fields'
import { caseDetailSeo } from '~/domains/cases/utils/case-seo'
import { CASE_SECTION_KINDS, caseEvidenceLinkLabel, caseNavGroups } from '~/domains/cases/data/types'
import { cmsPortfolioFixture } from '~/tests/fixtures/cms-portfolio'
import type { CmsProject } from '~/utils/cms/types'

const BASE = { baseUrl: 'https://cms.example.test' }

describe('case CMS projection', () => {
  const mapped = mapPortfolio(cmsPortfolioFixture, BASE)

  it('requests case fields and never private fields', () => {
    expect(PROJECT_FIELDS).toContain('case_enabled')
    expect(PROJECT_FIELDS).toContain('case_sections.kind')
    expect(PROJECT_FIELDS).toContain('case_claims.approved_claims_id.public_wording')
    expect(FILE_FIELDS).toContain('width')
    expect(FILE_FIELDS).toContain('height')
    for (const field of PRIVATE_FIELDS) {
      expect(PROJECT_FIELDS).not.toContain(field)
    }
  })

  it('maps published case-enabled projects only', () => {
    expect(mapped.caseSlugs).toEqual(['sample-flagship-case'])
    expect(mapped.cases).toHaveLength(1)
    expect(mapped.cases[0]?.slug).toBe('sample-flagship-case')
  })

  it('filters draft sections and claims, keeps Directus sort order', () => {
    const caseStudy = mapped.cases[0]!
    expect(caseStudy.sections.map(s => s.kind)).toEqual(
      CASE_SECTION_KINDS.filter(kind => kind !== 'limitations'),
    )
    expect(caseStudy.sections.map(s => s.anchor)).not.toContain('hidden-draft')
    expect(caseStudy.claims).toHaveLength(1)
    expect(caseStudy.claims[0]?.publicWording).toMatch(/pilot window/)
    expect(JSON.stringify(caseStudy)).not.toMatch(/Should never appear|Must never render/)
  })

  it('splits case_lead into plain-text paragraphs', () => {
    expect(mapped.cases[0]?.caseLeadParagraphs).toHaveLength(2)
    expect(plainTextParagraphs('One.\n\nTwo.\n\n')).toEqual(['One.', 'Two.'])
  })

  it('uses stored media dimensions, alt, and captions', () => {
    const caseStudy = mapped.cases[0]!
    expect(caseStudy.heroMedia?.width).toBe(1400)
    expect(caseStudy.heroMedia?.height).toBe(900)
    expect(caseStudy.heroMedia?.alt).toMatch(/Architecture diagram/)
    expect(caseStudy.heroMedia?.caption).toMatch(/Telegram, LangGraph/)
    expect(caseStudy.engagementLabel).toMatch(/Independent product/)
    const gallery = caseStudy.sections.find(s => s.kind === 'gallery')!
    expect(gallery.media).toHaveLength(2)
    expect(gallery.media[0]?.alt).toMatch(/Approval queue/)
    expect(gallery.media[0]?.caption).toMatch(/Operator/)
  })

  it('keeps architecture media even when hero uses a related diagram', () => {
    const caseStudy = mapped.cases[0]!
    const architecture = caseStudy.sections.find(s => s.kind === 'architecture')!
    expect(architecture.media).toHaveLength(1)
    expect(architecture.bodyParagraphs).toHaveLength(2)
    expect(architecture.items).toHaveLength(4)
  })

  it('omits section media when CMS alt is [hidden]', () => {
    const project = structuredClone(cmsPortfolioFixture.projects[0]) as CmsProject
    project.case_sections = project.case_sections!.map((section) => {
      if (section.kind !== 'workflow') return section
      return {
        ...section,
        media: [{
          id: 'sec-wf-hidden',
          sort: 0,
          file: 'file-case-hero',
          alt: '[hidden]',
          presentation: 'diagram',
        }],
      }
    })
    const caseStudy = mapCaseStudy(project, BASE, {
      byId: new Map(cmsPortfolioFixture.files!.map(f => [f.id, f])),
      byTitle: new Map(
        cmsPortfolioFixture.files!.filter(f => f.title).map(f => [f.title!, f]),
      ),
    })
    const workflow = caseStudy.sections.find(s => s.kind === 'workflow')!
    expect(workflow.media).toEqual([])
  })

  it('maps decisions with two responsibility labels for comparison layout', () => {
    const decisions = mapped.cases[0]!.sections.find(s => s.kind === 'decisions')!
    const labels = [...new Set(decisions.items.map(item => item.label))]
    expect(labels).toEqual([
      'Model responsibility',
      'Application / CRM guarantees',
    ])
    expect(decisions.items).toHaveLength(7)
  })

  it('excludes private fields from the mapped portfolio', () => {
    const blob = JSON.stringify(mapped)
    expect(blob).not.toMatch(/evidence_origin|evidence_note|confidentiality_notes|private_evidence/)
  })
})

describe('case section validation', () => {
  it('defines all eight section kinds', () => {
    expect(CASE_SECTION_KINDS).toEqual([
      'narrative',
      'workflow',
      'architecture',
      'evolution',
      'decisions',
      'gallery',
      'evidence',
      'limitations',
    ])
  })

  it('rejects unknown section kinds', () => {
    const project = structuredClone(cmsPortfolioFixture.projects[0]) as CmsProject
    ;(project.case_sections![0] as { kind: string }).kind = 'unknown'

    expect(() =>
      mapCaseStudy(project, BASE, {
        byId: new Map(cmsPortfolioFixture.files!.map(f => [f.id, f])),
        byTitle: new Map(
          cmsPortfolioFixture.files!.filter(f => f.title).map(f => [f.title!, f]),
        ),
      }),
    ).toThrow(/unknown kind/)
  })

  it('rejects malformed section items', () => {
    const project = structuredClone(cmsPortfolioFixture.projects[0]) as CmsProject
    project.case_sections![1]!.items = [{ title: 'ok' }, { bad: true } as never]

    expect(() =>
      mapCaseStudy(project, BASE, {
        byId: new Map(cmsPortfolioFixture.files!.map(f => [f.id, f])),
        byTitle: new Map(
          cmsPortfolioFixture.files!.filter(f => f.title).map(f => [f.title!, f]),
        ),
      }),
    ).toThrow(/malformed items/)
  })

  it('fails when case_enabled lacks case_lead', () => {
    const project = structuredClone(cmsPortfolioFixture.projects[0]) as CmsProject
    project.case_lead = ''

    expect(() =>
      mapCaseStudy(project, BASE, {
        byId: new Map(),
        byTitle: new Map(),
      }),
    ).toThrow(/case_lead/)
  })

  it('fails when hero media is missing alt', () => {
    const project = structuredClone(cmsPortfolioFixture.projects[0]) as CmsProject
    project.hero_media_alt = ''

    expect(() =>
      mapCaseStudy(project, BASE, {
        byId: new Map(cmsPortfolioFixture.files!.map(f => [f.id, f])),
        byTitle: new Map(),
      }),
    ).toThrow(/hero_media_alt/)
  })
})

describe('case SEO', () => {
  const mapped = mapPortfolio(cmsPortfolioFixture, BASE)
  const caseStudy = mapped.cases[0]!

  it('emits canonical, social, CreativeWork, and SoftwareSourceCode', () => {
    const seo = caseDetailSeo('https://example.test', caseStudy, {
      siteName: 'Example.dev',
      personName: 'Ada Example',
      featuredWorkHeading: 'Featured work',
    })
    expect(seo.path).toBe('/work/sample-flagship-case')
    expect(seo.title).toContain('Sample Flagship Case')
    expect(seo.ogType).toBe('article')
    expect(seo.image?.src).toContain('social.webp')
    expect(seo.image?.width).toBe(1200)
    const graph = seo.jsonLd['@graph'] as Array<Record<string, unknown>>
    const crumbs = graph.find(node => node['@type'] === 'BreadcrumbList') as {
      itemListElement: Array<{ name: string }>
    }
    expect(crumbs.itemListElement[1]?.name).toBe('Featured work')
    expect(graph.some(node =>
      Array.isArray(node['@type'])
        ? node['@type'].includes('CreativeWork')
        : node['@type'] === 'CreativeWork',
    )).toBe(true)
    expect(graph.some(node => node['@type'] === 'SoftwareSourceCode')).toBe(true)
  })
})

describe('case grouped navigation', () => {
  it('groups published sections into five sticky labels', () => {
    const mapped = mapPortfolio(cmsPortfolioFixture, BASE)
    const groups = caseNavGroups(mapped.cases[0]!.sections)
    expect(groups.map(g => g.label)).toEqual([
      'Context',
      'Operator workflow',
      'Architecture',
      'How it evolved',
      'Screenshots',
    ])
    expect(groups.find(g => g.id === 'overview')?.anchor).toBe('context')
    expect(groups.find(g => g.id === 'engineering')).toEqual({
      id: 'engineering',
      label: 'How it evolved',
      anchor: 'evolution',
      anchors: ['evolution', 'decisions'],
    })
    expect(groups.find(g => g.id === 'evidence')?.anchors).toEqual([
      'gallery',
      'evidence',
    ])
  })

  it('omits groups with no published sections', () => {
    const mapped = mapPortfolio(cmsPortfolioFixture, BASE)
    const narrativeOnly = mapped.cases[0]!.sections.filter(s => s.kind === 'narrative')
    expect(caseNavGroups(narrativeOnly).map(g => g.id)).toEqual(['overview'])
  })
})

describe('case evidence link labels', () => {
  it('passes through CMS labels', () => {
    expect(caseEvidenceLinkLabel('https://github.com/org/repo', 'Inspect repository'))
      .toBe('Inspect repository')
    expect(caseEvidenceLinkLabel('/experience#role', 'View role details'))
      .toBe('View role details')
  })

  it('maps published evidence links from CMS', () => {
    const mapped = mapPortfolio(cmsPortfolioFixture, BASE)
    expect(mapped.cases[0]?.evidenceLinks).toEqual([
      {
        label: 'Source repository',
        href: 'https://github.com/example-org/sample-flagship',
      },
    ])
  })
})
