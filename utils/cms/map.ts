import type {
  ExperienceOutcome,
  ExperienceRole,
  OutcomeQualifier,
} from '../../data/experience'
import { homepageExperiencePreview } from '../../data/experience'
import type {
  FeaturedCase,
  HomepageContent,
  ProductSpotlight,
  ProofItem,
} from '../../data/homepage'
import type { Project, ProjectImage } from '../../domains/projects/data/types'
import { assetUrl, type DirectusClientConfig } from './client'
import type {
  CmsApprovedClaim,
  CmsExperienceEntry,
  CmsFile,
  CmsPortfolioRaw,
  CmsProduct,
  CmsProfessionalTenure,
  CmsProject,
  CmsSiteSettings,
} from './types'

export interface PortfolioContent {
  site: CmsSiteSettings
  homepage: HomepageContent
  experience: ExperienceRole[]
  products: Project[]
  projects: CmsProject[]
  claims: CmsApprovedClaim[]
  professionalTenure: CmsProfessionalTenure
  productSlugs: string[]
}

export interface FileCatalog {
  byId: Map<string, CmsFile>
  byTitle: Map<string, CmsFile>
}

export function buildFileCatalog(files: CmsFile[] = []): FileCatalog {
  const byId = new Map<string, CmsFile>()
  const byTitle = new Map<string, CmsFile>()
  for (const file of files) {
    byId.set(file.id, file)
    if (file.title) byTitle.set(file.title, file)
  }
  return { byId, byTitle }
}

const EMPTY_CATALOG = buildFileCatalog()

/** Directus `files.title` stores the original site path (folder layout). */
export function publicPathForFile(file: CmsFile): string {
  const title = file.title?.trim()
  if (
    title
    && title.startsWith('/')
    && !title.includes('..')
    && !title.includes('\\')
  ) {
    return title
  }
  const name = file.filename_download || file.id
  return `/cms-files/${file.id}/${name}`
}

function resolveFileUrl(
  config: Pick<DirectusClientConfig, 'baseUrl'>,
  catalog: FileCatalog,
  fileId?: string | null,
): string | undefined {
  if (!fileId) return undefined
  const file = catalog.byId.get(fileId)
  return file ? publicPathForFile(file) : assetUrl(config, fileId)
}

function rewritePublicPath(
  catalog: FileCatalog,
  path?: string,
): string | undefined {
  if (!path) return undefined
  if (catalog.byTitle.size > 0 && !catalog.byTitle.has(path)) {
    throw new Error(`CMS file missing for public path: ${path}`)
  }
  return path
}

function rewriteSrcset(
  catalog: FileCatalog,
  srcset?: string,
): string | undefined {
  if (!srcset) return undefined
  return srcset
    .split(',')
    .map((part) => {
      const trimmed = part.trim()
      const [url, ...rest] = trimmed.split(/\s+/)
      const rewritten = rewritePublicPath(catalog, url) || url
      return [rewritten, ...rest].join(' ')
    })
    .join(', ')
}

function thumbTitle(title: string, marker: string): string {
  return title.replace(/(\.[a-z0-9]+)$/i, `${marker}$1`)
}

function fileImage(
  config: Pick<DirectusClientConfig, 'baseUrl'>,
  catalog: FileCatalog,
  fileId: string | null | undefined,
  alt: string,
  size: { width: number, height: number },
  thumbMarker?: string,
): ProjectImage | undefined {
  if (!fileId) return undefined
  const file = catalog.byId.get(fileId)
  const src = file ? publicPathForFile(file) : assetUrl(config, fileId)
  const thumb = file?.title && thumbMarker
    ? catalog.byTitle.get(thumbTitle(file.title, thumbMarker))
    : undefined
  const srcThumb = thumb ? publicPathForFile(thumb) : undefined
  const widthHint = thumbMarker === '-256w' ? 256 : thumbMarker === '-600w' ? 600 : undefined
  return {
    src,
    srcThumb,
    srcset: srcThumb && widthHint
      ? `${srcThumb} ${widthHint}w, ${src} ${size.width}w`
      : undefined,
    alt,
    width: size.width,
    height: size.height,
  }
}

function rewriteGuideImage(
  catalog: FileCatalog,
  image: NonNullable<NonNullable<CmsProduct['guide']>['steps'][number]['image']>,
): ProjectImage {
  return {
    src: rewritePublicPath(catalog, image.src) || image.src,
    srcThumb: rewritePublicPath(catalog, image.srcThumb) || image.srcThumb,
    srcset: rewriteSrcset(catalog, image.srcset) || image.srcset,
    sizes: image.sizes,
    alt: image.alt,
    width: image.width,
    height: image.height,
    caption: image.caption,
  }
}
function orderByKeys<T>(
  items: T[],
  keys: string[],
  getKey: (item: T) => string,
): T[] {
  const byKey = new Map(items.map(item => [getKey(item), item]))
  return keys
    .map(key => byKey.get(key))
    .filter((item): item is T => item != null)
}

function contributionTexts(
  contributions: CmsExperienceEntry['contributions'],
): string[] {
  if (!Array.isArray(contributions)) return []
  return contributions.map((item) => {
    if (typeof item === 'string') return item
    return item.text
  }).filter(Boolean)
}

function claimWording(
  claimsByKey: Map<string, CmsApprovedClaim>,
  claimId: string,
): string {
  const byKey = claimsByKey.get(claimId)
  if (byKey) return byKey.public_wording
  for (const claim of claimsByKey.values()) {
    if (claim.id === claimId) return claim.public_wording
  }
  throw new Error(`Missing published claim for id/key: ${claimId}`)
}

function splitProofWording(wording: string): ProofItem {
  const sep = ' — '
  const idx = wording.indexOf(sep)
  if (idx === -1) {
    return { value: wording, label: wording }
  }
  return {
    value: wording.slice(0, idx).trim(),
    label: wording.slice(idx + sep.length).trim(),
  }
}

export function mapExperienceRoles(
  entries: CmsExperienceEntry[],
  claims: CmsApprovedClaim[],
  config: Pick<DirectusClientConfig, 'baseUrl'>,
  catalog: FileCatalog = EMPTY_CATALOG,
): ExperienceRole[] {
  const claimsByKey = new Map(
    claims.filter(c => c.key).map(c => [c.key, c]),
  )
  for (const claim of claims) {
    claimsByKey.set(claim.id, claim)
  }

  return entries.map((entry) => {
    const outcomes: ExperienceOutcome[] = (entry.outcomes || []).map((o) => {
      const qualifier = o.qualifier as OutcomeQualifier
      return {
        text: claimWording(claimsByKey, o.claim_id),
        qualifier,
      }
    })

    return {
      id: entry.key,
      organization: entry.organization,
      title: entry.title,
      engagementType: entry.engagement_type,
      location: entry.location,
      workMode: entry.work_mode,
      start: entry.start,
      end: entry.end ?? null,
      scope: entry.scope,
      contributions: contributionTexts(entry.contributions),
      outcomes,
      technologies: entry.technologies || [],
      links: entry.links ?? undefined,
      icon: resolveFileUrl(config, catalog, entry.icon),
      iconAlt: entry.icon_alt ?? undefined,
      homepageSummary: entry.homepage_summary ?? undefined,
    }
  })
}

export function mapFeaturedCases(
  site: CmsSiteSettings,
  projects: CmsProject[],
): FeaturedCase[] {
  const ordered = orderByKeys(projects, site.featured_project_slugs || [], p => p.slug)
  return ordered.map((project, index) => {
    const link = project.evidence_links?.[0]
    return {
      slug: project.slug,
      title: project.name,
      featured: index === 0,
      problem: project.problem || project.short_description || '',
      role: project.role || '',
      contribution: project.contribution || '',
      outcome: project.outcome || '',
      stack: project.stack_tags || [],
      href: link?.href || `/projects/${project.slug}`,
      hrefLabel: link?.label || 'View case',
    }
  })
}

export function mapProductSpotlights(
  site: CmsSiteSettings,
  products: CmsProduct[],
  catalog: FileCatalog = EMPTY_CATALOG,
  spotlightCtaLabel: string,
): ProductSpotlight[] {
  const ordered = orderByKeys(
    products,
    site.product_spotlight_slugs || [],
    p => p.slug,
  )
  return ordered.map((product) => {
    const guideImage = product.guide?.steps?.find(step => step.image)?.image
    if (!guideImage) {
      throw new Error(
        `Product spotlight "${product.slug}" requires a guide step image`,
      )
    }
    const launch = product.launch
    const rewritten = rewriteGuideImage(catalog, guideImage)
    return {
      slug: product.slug,
      title: product.name,
      lead: launch?.lead || product.short_description,
      supportingLine: launch?.supportingLine || '',
      image: {
        src: rewritten.src,
        srcThumb: rewritten.srcThumb,
        srcset: rewritten.srcset,
        sizes: rewritten.sizes || '(max-width: 768px) 100vw, 50vw',
        alt: rewritten.alt,
        width: rewritten.width,
        height: rewritten.height,
      },
      cta: {
        label: spotlightCtaLabel,
        href: `/projects/${product.slug}`,
      },
      tags: (product.stack_tags || []).slice(0, 5),
    }
  })
}

export function mapHomepageContent(
  site: CmsSiteSettings,
  projects: CmsProject[],
  products: CmsProduct[],
  experience: ExperienceRole[],
  claims: CmsApprovedClaim[],
  catalog: FileCatalog = EMPTY_CATALOG,
): HomepageContent {
  if (!site.page_copy) {
    throw new Error('site_settings.page_copy is required')
  }
  if (!site.site_name) {
    throw new Error('site_settings.site_name is required')
  }

  const pageCopy = site.page_copy
  const claimsByKey = new Map(claims.filter(c => c.key).map(c => [c.key, c]))
  const tenure = site.professional_tenure
  const proof: ProofItem[] = [
    {
      value: tenure.short.replace(/ years$/, ''),
      label: tenure.label,
    },
    ...(site.proof_claim_ids || []).map((id) => {
      const claim = claimsByKey.get(id) || claims.find(c => c.id === id || c.key === id)
      if (!claim) throw new Error(`Missing proof claim: ${id}`)
      return splitProofWording(claim.public_wording)
    }),
  ]

  const previewItems = homepageExperiencePreview(
    site.experience_preview_ids || [],
    experience,
  )

  if (!site.menu?.length) {
    throw new Error('site_settings.menu is required')
  }
  const navItems = site.menu.map(item => ({
    label: item.label,
    href: item.href,
  }))

  return {
    person: {
      name: site.person_name,
      role: site.person_role,
    },
    valueProposition: site.value_proposition,
    primaryCtas: site.primary_ctas || [],
    profileLinks: site.profile_links || [],
    heroFocus: site.hero_focus,
    proof,
    featuredWorkIntro: site.featured_work_intro,
    featuredCases: mapFeaturedCases(site, projects),
    experiencePreview: {
      heading: site.experience_preview_heading,
      items: previewItems,
      cta: site.experience_preview_cta,
    },
    products: {
      heading: site.products_heading,
      description: site.products_description,
      items: mapProductSpotlights(
        site,
        products,
        catalog,
        pageCopy.products_index.spotlight_cta,
      ),
    },
    navItems,
    contact: {
      heading: site.contact_heading,
      summary: site.contact_summary,
      email: {
        label: pageCopy.contact.email_label,
        href: site.contact_email.startsWith('mailto:')
          ? site.contact_email
          : `mailto:${site.contact_email}`,
      },
      telegram: {
        label: pageCopy.contact.telegram_label,
        href: site.contact_telegram,
      },
    },
    siteName: site.site_name,
    seoTitle: site.seo_title ?? undefined,
    seoDescription: site.seo_description ?? undefined,
    pageCopy,
  }
}

export function mapProductToProject(
  product: CmsProduct,
  config: Pick<DirectusClientConfig, 'baseUrl'>,
  catalog: FileCatalog = EMPTY_CATALOG,
): Project {
  const logo = fileImage(
    config,
    catalog,
    product.logo,
    `${product.name} logo`,
    { width: 512, height: 512 },
    '-256w',
  )
  const socialImage = fileImage(
    config,
    catalog,
    product.social_image,
    `${product.name} social image`,
    { width: 1200, height: 630 },
  )

  const guide = product.guide
    ? {
        title: product.guide.title,
        warning: product.guide.warning,
        steps: product.guide.steps.map(step => ({
          title: step.title,
          body: step.body,
          image: step.image
            ? rewriteGuideImage(catalog, step.image)
            : undefined,
        })),
      }
    : undefined

  return {
    slug: product.slug,
    name: product.name,
    shortDescription: product.short_description,
    description: product.description ?? undefined,
    logo: logo
      ? { ...logo, sizes: '(max-width: 1024px) 14rem, 14rem' }
      : undefined,
    socialImage,
    benefits: product.benefits ?? undefined,
    guide,
    links: product.evidence_links ?? undefined,
    launch: product.launch ?? undefined,
    github: product.github ?? undefined,
    seo: product.seo
      ? {
          title: product.seo.title || product.name,
          description: product.seo.description || product.short_description,
          titleSuffix: product.seo.titleSuffix,
        }
      : undefined,
    softwareApplication: product.software_application ?? undefined,
    stackTags: product.stack_tags ?? undefined,
  }
}

export function mapProductsToProjects(
  products: CmsProduct[],
  config: Pick<DirectusClientConfig, 'baseUrl'>,
  catalog: FileCatalog = EMPTY_CATALOG,
): Project[] {
  return [...products]
    .sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
    .map(product => mapProductToProject(product, config, catalog))
}

export function mapPortfolio(
  raw: CmsPortfolioRaw,
  config: Pick<DirectusClientConfig, 'baseUrl'>,
): PortfolioContent {
  const catalog = buildFileCatalog(raw.files)
  const experience = mapExperienceRoles(raw.experience, raw.claims, config, catalog)
  const homepage = mapHomepageContent(
    raw.site,
    raw.projects,
    raw.products,
    experience,
    raw.claims,
    catalog,
  )
  const products = mapProductsToProjects(raw.products, config, catalog)

  return {
    site: raw.site,
    homepage,
    experience,
    products,
    projects: raw.projects,
    claims: raw.claims,
    professionalTenure: raw.site.professional_tenure,
    productSlugs: products.map(p => p.slug),
  }
}
