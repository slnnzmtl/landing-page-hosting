import { z } from 'zod'
import {
  CASE_SECTION_KINDS,
  caseEvidenceLinkLabel,
  type CaseClaim,
  type CaseImage,
  type CaseSection,
  type CaseSectionItem,
  type CaseSectionKind,
  type CaseSectionLayout,
  type CaseStageLabel,
  type CaseStudy,
  type CaseMediaPresentation,
} from '../../domains/cases/data/types'
import type { DirectusClientConfig } from './client'
import { assetUrl, publicPathForFile } from './client'
import type {
  CmsFile,
  CmsProject,
  CmsProjectSection,
  CmsProjectSectionMedia,
} from './types'

interface FileCatalog {
  byId: Map<string, CmsFile>
  byTitle: Map<string, CmsFile>
}

const STAGE_LABELS = new Set<CaseStageLabel>([
  'prototype',
  'early_production',
  'production',
])

const LAYOUTS = new Set<CaseSectionLayout>(['text', 'split', 'wide', 'cards'])

const PRESENTATIONS = new Set<CaseMediaPresentation>([
  'diagram',
  'screenshot',
  'gallery',
  'code',
])

const KIND_SET = new Set<string>(CASE_SECTION_KINDS)

const sectionItemSchema = z.object({
  title: z.string().optional(),
  summary: z.string().optional(),
  label: z.string().optional(),
  detail: z.string().optional(),
}).strict()

const sectionItemsSchema = z.array(sectionItemSchema)

/** Split plain-text CMS body into paragraphs. Never treat as HTML. */
export function plainTextParagraphs(text: string | null | undefined): string[] {
  if (!text?.trim()) return []
  return text
    .split(/\n{2,}/)
    .map(paragraph => paragraph.trim())
    .filter(Boolean)
}

function resolveCaseImage(
  config: Pick<DirectusClientConfig, 'baseUrl'>,
  catalog: FileCatalog,
  fileId: string,
  alt: string,
  caption?: string | null,
  presentation?: CaseMediaPresentation,
): CaseImage {
  const file = catalog.byId.get(fileId)
  const src = file ? publicPathForFile(file) : assetUrl(config, fileId)
  const width = file?.width && file.width > 0 ? file.width : 1200
  const height = file?.height && file.height > 0 ? file.height : 800
  return {
    src,
    alt,
    width,
    height,
    ...(caption?.trim() ? { caption: caption.trim() } : {}),
    ...(presentation ? { presentation } : {}),
  }
}

function parseSectionItems(
  slug: string,
  sectionId: string,
  raw: unknown,
): CaseSectionItem[] {
  if (raw == null) return []
  const parsed = sectionItemsSchema.safeParse(raw)
  if (!parsed.success) {
    throw new Error(
      `Project "${slug}" section "${sectionId}" has malformed items: ${parsed.error.message}`,
    )
  }
  return parsed.data
}

function sortBySort<T extends { sort?: number | null }>(items: T[]): T[] {
  return [...items].sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
}

/** When delete is unavailable in CMS, set media alt to `[hidden]` to omit from the case page. */
function isHiddenSectionMedia(alt: string): boolean {
  return alt === '[hidden]'
}

function mapSectionMedia(
  config: Pick<DirectusClientConfig, 'baseUrl'>,
  catalog: FileCatalog,
  slug: string,
  sectionId: string,
  media: CmsProjectSectionMedia[] | null | undefined,
): CaseImage[] {
  const rows = sortBySort(media || [])
  const images: CaseImage[] = []
  rows.forEach((row, index) => {
    const alt = row.alt?.trim()
    if (!alt) {
      throw new Error(
        `Project "${slug}" section "${sectionId}" media[${index}] requires non-empty alt`,
      )
    }
    if (isHiddenSectionMedia(alt)) {
      return
    }
    if (!row.file) {
      throw new Error(
        `Project "${slug}" section "${sectionId}" media[${index}] requires file`,
      )
    }
    if (!PRESENTATIONS.has(row.presentation)) {
      throw new Error(
        `Project "${slug}" section "${sectionId}" media[${index}] has unknown presentation "${row.presentation}"`,
      )
    }
    images.push(resolveCaseImage(
      config,
      catalog,
      row.file,
      alt,
      row.caption,
      row.presentation,
    ))
  })
  return images
}

function mapCaseSection(
  config: Pick<DirectusClientConfig, 'baseUrl'>,
  catalog: FileCatalog,
  slug: string,
  section: CmsProjectSection,
): CaseSection {
  if (!KIND_SET.has(section.kind)) {
    throw new Error(
      `Project "${slug}" section "${section.id}" has unknown kind "${section.kind}"`,
    )
  }
  if (!LAYOUTS.has(section.layout)) {
    throw new Error(
      `Project "${slug}" section "${section.id}" has unknown layout "${section.layout}"`,
    )
  }
  const anchor = section.anchor?.trim()
  if (!anchor) {
    throw new Error(`Project "${slug}" section "${section.id}" requires anchor`)
  }
  const heading = section.heading?.trim()
  if (!heading) {
    throw new Error(`Project "${slug}" section "${section.id}" requires heading`)
  }

  return {
    id: section.id,
    anchor,
    kind: section.kind as CaseSectionKind,
    eyebrow: section.eyebrow?.trim() || undefined,
    heading,
    bodyParagraphs: plainTextParagraphs(section.body),
    layout: section.layout,
    items: parseSectionItems(slug, section.id, section.items),
    media: mapSectionMedia(config, catalog, slug, section.id, section.media),
  }
}

function mapCaseClaims(project: CmsProject): CaseClaim[] {
  return (project.case_claims || [])
    .map(row => row.approved_claims_id)
    .filter((claim): claim is NonNullable<typeof claim> =>
      Boolean(claim && claim.status === 'published' && claim.public_wording?.trim()),
    )
    .map(claim => ({
      id: claim.id,
      key: claim.key ?? undefined,
      publicWording: claim.public_wording.trim(),
    }))
}

/** Map a published, case-enabled project into a CaseStudy. Fails closed on invariants. */
export function mapCaseStudy(
  project: CmsProject,
  config: Pick<DirectusClientConfig, 'baseUrl'>,
  catalog: FileCatalog,
): CaseStudy {
  const slug = project.slug
  if (!project.case_enabled) {
    throw new Error(`Project "${slug}" is not case_enabled`)
  }
  if (project.status !== 'published') {
    throw new Error(`Project "${slug}" is not published`)
  }

  const caseLead = project.case_lead?.trim()
  if (!caseLead) {
    throw new Error(`Project "${slug}" requires non-empty case_lead when case_enabled`)
  }

  const publishedSections = sortBySort(
    (project.case_sections || []).filter(section => section.status === 'published'),
  )
  if (!publishedSections.length) {
    throw new Error(
      `Project "${slug}" requires at least one published case_sections row when case_enabled`,
    )
  }

  const anchors = new Set<string>()
  for (const section of publishedSections) {
    const anchor = section.anchor?.trim()
    if (!anchor) continue
    if (anchors.has(anchor)) {
      throw new Error(`Project "${slug}" has duplicate section anchor "${anchor}"`)
    }
    anchors.add(anchor)
  }

  if (project.hero_media && !project.hero_media_alt?.trim()) {
    throw new Error(
      `Project "${slug}" requires hero_media_alt when hero_media is set`,
    )
  }

  if (project.stage_label && !STAGE_LABELS.has(project.stage_label)) {
    throw new Error(
      `Project "${slug}" has invalid stage_label "${project.stage_label}"`,
    )
  }

  const sections = publishedSections.map(section =>
    mapCaseSection(config, catalog, slug, section),
  )

  const heroMedia = project.hero_media
    ? resolveCaseImage(
        config,
        catalog,
        project.hero_media,
        project.hero_media_alt!.trim(),
        project.hero_media_caption,
      )
    : undefined

  const socialImage = project.social_image
    ? resolveCaseImage(
        config,
        catalog,
        project.social_image,
        `${project.name} social image`,
        null,
      )
    : undefined

  const description
    = project.seo_description?.trim()
      || caseLead
      || project.short_description?.trim()
      || project.name

  return {
    slug,
    name: project.name,
    track: project.track ?? undefined,
    role: project.role ?? undefined,
    shortDescription: project.short_description ?? undefined,
    caseLeadParagraphs: plainTextParagraphs(caseLead),
    engagementLabel: project.engagement_label?.trim() || undefined,
    stageLabel: project.stage_label ?? undefined,
    stackTags: project.stack_tags || [],
    evidenceLinks: (project.evidence_links || [])
      .filter(link => link.label?.trim() && link.href)
      .map(link => ({
        label: caseEvidenceLinkLabel(link.href, link.label),
        href: link.href,
      })),
    heroMedia,
    sections,
    claims: mapCaseClaims(project),
    seo: {
      title: project.seo_title?.trim() || project.name,
      description,
    },
    socialImage: socialImage || heroMedia,
  }
}

export function mapCases(
  projects: CmsProject[],
  config: Pick<DirectusClientConfig, 'baseUrl'>,
  catalog: FileCatalog,
): CaseStudy[] {
  return projects
    .filter(project => project.status === 'published' && project.case_enabled)
    .sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
    .map(project => mapCaseStudy(project, config, catalog))
}
