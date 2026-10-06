/** Public URL for a case-enabled Directus project. */
export function casePath(slug: string): string {
  return `/projects/${slug}`
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
  srcThumb?: string
  srcset?: string
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
