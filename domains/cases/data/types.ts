/** Public URL for a case-enabled Directus project. */
export function casePath(slug: string): string {
  return `/work/${slug}`
}

/** Pass through CMS evidence-link labels. Empty labels are dropped by the mapper. */
export function caseEvidenceLinkLabel(_href: string, cmsLabel?: string): string {
  return cmsLabel?.trim() || ''
}

export type CaseStageLabel = 'prototype' | 'early_production' | 'production'

export type CaseSectionKind
  = 'narrative'
    | 'workflow'
    | 'architecture'
    | 'evolution'
    | 'decisions'
    | 'gallery'
    | 'evidence'
    | 'limitations'

export type CaseSectionLayout = 'text' | 'split' | 'wide' | 'cards'

export type CaseMediaPresentation = 'diagram' | 'screenshot' | 'gallery' | 'code'

export interface CaseImage {
  src: string
  alt: string
  width: number
  height: number
  caption?: string
  presentation?: CaseMediaPresentation
}

export interface CaseLink {
  label: string
  href: string
}

export interface CaseSectionItem {
  title?: string
  summary?: string
  label?: string
  detail?: string
}

export interface CaseSection {
  id: string
  anchor: string
  kind: CaseSectionKind
  eyebrow?: string
  heading: string
  bodyParagraphs: string[]
  layout: CaseSectionLayout
  items: CaseSectionItem[]
  media: CaseImage[]
}

export interface CaseClaim {
  id: string
  key?: string
  publicWording: string
}

export interface CaseSeo {
  title: string
  description: string
}

export interface CaseStudy {
  slug: string
  name: string
  track?: string
  role?: string
  shortDescription?: string
  caseLeadParagraphs: string[]
  engagementLabel?: string
  stageLabel?: CaseStageLabel
  stackTags: string[]
  evidenceLinks: CaseLink[]
  heroMedia?: CaseImage
  sections: CaseSection[]
  claims: CaseClaim[]
  seo: CaseSeo
  socialImage?: CaseImage
}

export const STAGE_LABEL_DISPLAY: Record<CaseStageLabel, string> = {
  prototype: 'Prototype',
  early_production: 'Early production',
  production: 'Production',
}

export const CASE_SECTION_KINDS: readonly CaseSectionKind[] = [
  'narrative',
  'workflow',
  'architecture',
  'evolution',
  'decisions',
  'gallery',
  'evidence',
  'limitations',
] as const

export interface CaseNavGroup {
  id: string
  kinds: readonly CaseSectionKind[]
}

/** Sticky in-page nav groups. Display labels come from the first CMS section in the group. */
export const CASE_NAV_GROUPS: readonly CaseNavGroup[] = [
  { id: 'overview', kinds: ['narrative'] },
  { id: 'workflow', kinds: ['workflow'] },
  { id: 'architecture', kinds: ['architecture'] },
  { id: 'engineering', kinds: ['evolution', 'decisions'] },
  { id: 'evidence', kinds: ['gallery', 'evidence', 'limitations'] },
] as const

export interface CaseNavGroupLink {
  id: string
  label: string
  /** First published section anchor in this group. */
  anchor: string
  /** All section anchors covered by this group (for active-state matching). */
  anchors: string[]
}

/** Build sticky nav links from published sections; omit empty groups. */
export function caseNavGroups(sections: CaseSection[]): CaseNavGroupLink[] {
  return CASE_NAV_GROUPS.flatMap((group) => {
    const matched = sections.filter(section => group.kinds.includes(section.kind))
    if (!matched.length) return []
    const anchors = matched.map(section => section.anchor)
    const first = matched[0]!
    return [{
      id: group.id,
      label: first.eyebrow?.trim() || first.heading,
      anchor: anchors[0]!,
      anchors,
    }]
  })
}
