import type {
  ExperienceOutcome,
  ExperienceRole,
  OutcomeQualifier,
} from '../../data/experience'
import { homepageExperiencePreview } from '../../data/experience'
import type {
  ContactLink,
  FeaturedCase,
  HomepageContent,
  HomepageLink,
  PageCopy,
  ProductSpotlight,
  ProofItem,
} from '../../data/homepage'
import { catalogPageHref, type Project, type ProjectImage, type ProjectLaunchCta } from '../../domains/projects/data/types'
import { assetUrl, type DirectusClientConfig } from './client'
import type {
  CmsApprovedClaim,
  CmsButton,
  CmsExperienceEntry,
  CmsExperiencePageSettings,
  CmsFile,
  CmsHomepageSettings,
  CmsLink,
  CmsM2mButtonRow,
  CmsPortfolioRaw,
  CmsProduct,
  CmsProductsPageSettings,
  CmsProject,
  CmsSiteSettings,
} from './types'

export interface PortfolioContent {
  homepage: HomepageContent
  experience: ExperienceRole[]
  products: Project[]
  experiencePage: CmsExperiencePageSettings
  productSlugs: string[]
}

interface FileCatalog {
  byId: Map<string, CmsFile>
  byTitle: Map<string, CmsFile>
}

function buildFileCatalog(files: CmsFile[] = []): FileCatalog {
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

function isPublishedButton(button: CmsButton | null | undefined): button is CmsButton {
  return Boolean(button && button.status === 'published' && button.label && button.href)
}

function mapButtonLink(button: CmsButton): HomepageLink {
  return { label: button.label, href: button.href }
}

function mapButtonRows(rows: CmsM2mButtonRow[] | null | undefined): HomepageLink[] {
  return (rows || [])
    .map(row => row.buttons_id)
    .filter(isPublishedButton)
    .map(mapButtonLink)
}

function mapLaunchCtas(rows: CmsM2mButtonRow[] | null | undefined): ProjectLaunchCta[] {
  return (rows || [])
    .map(row => row.buttons_id)
    .filter(isPublishedButton)
    .map((button) => {
      const kind: ProjectLaunchCta['kind'] = button.type === 'primary' ? 'primary' : 'secondary'
      return {
        label: button.label,
        href: button.href,
        kind,
        ...(button.href_source === 'github_macos_release'
          ? { macosDownload: true }
          : {}),
      }
    })
}

function indexClaimsByRef(claims: CmsApprovedClaim[]): Map<string, CmsApprovedClaim> {
  const byRef = new Map<string, CmsApprovedClaim>()
  for (const claim of claims) {
    if (claim.key) byRef.set(claim.key, claim)
    byRef.set(claim.id, claim)
  }
  return byRef
}

function claimWording(
  claimsByRef: Map<string, CmsApprovedClaim>,
  claimId: string,
): string {
  const claim = claimsByRef.get(claimId)
  if (!claim) throw new Error(`Missing published claim for id/key: ${claimId}`)
  return claim.public_wording
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

function isEmailHref(href: string): boolean {
  if (/^mailto:/i.test(href)) return true
  const at = href.indexOf('@')
  return at > 0 && !href.includes('/') && !href.includes(' ') && at === href.lastIndexOf('@')
}

function mapContactLinks(links: CmsLink[] | null | undefined): ContactLink[] {
  if (!links?.length) {
    throw new Error('homepage_settings.contact_links is required')
  }
  return links.map((link, index) => {
    const label = link.label?.trim()
    const hrefRaw = link.href?.trim()
    const title = link.title?.trim()
    if (!label || !hrefRaw || !title) {
      throw new Error(
        `homepage_settings.contact_links[${index}] requires label, href, and title`,
      )
    }
    const href = isEmailHref(hrefRaw) && !/^mailto:/i.test(hrefRaw)
      ? `mailto:${hrefRaw}`
      : hrefRaw
    return { label, href, title }
  })
}

function mapExperienceRoles(
  entries: CmsExperienceEntry[],
  claims: CmsApprovedClaim[],
  config: Pick<DirectusClientConfig, 'baseUrl'>,
  catalog: FileCatalog = EMPTY_CATALOG,
): ExperienceRole[] {
  const claimsByRef = indexClaimsByRef(claims)

  return entries.map((entry) => {
    const outcomes: ExperienceOutcome[] = (entry.outcomes || []).map((o) => {
      const qualifier = o.qualifier as OutcomeQualifier
      return {
        text: claimWording(claimsByRef, o.claim_id),
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

function mapFeaturedCases(
  featuredProjectSlugs: string[],
  projects: CmsProject[],
): FeaturedCase[] {
  const ordered = orderByKeys(projects, featuredProjectSlugs, p => p.slug)
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
      ...(link
        ? { href: link.href, hrefLabel: link.label || 'View case' }
        : {}),
    }
  })
}

function mapProductSpotlights(
  productSpotlightSlugs: string[],
  products: CmsProduct[],
  catalog: FileCatalog = EMPTY_CATALOG,
  spotlightCtaLabel: string,
): ProductSpotlight[] {
  const ordered = orderByKeys(
    products,
    productSpotlightSlugs,
    p => p.slug,
  )
  return ordered.map((product) => {
    const guideImage = product.guide?.steps?.find(step => step.image)?.image
    if (!guideImage) {
      throw new Error(
        `Product spotlight "${product.slug}" requires a guide step image`,
      )
    }
    const rewritten = rewriteGuideImage(catalog, guideImage)
    const thumb = rewritten.srcThumb
    // Homepage uses the 600w file only — CMS `sizes` would pick 2240w on DPR>1.
    return {
      slug: product.slug,
      title: product.name,
      lead: product.launch_lead || product.short_description,
      supportingLine: product.launch_supporting_line || '',
      image: {
        src: thumb || rewritten.src,
        srcThumb: thumb,
        alt: rewritten.alt,
        width: thumb ? 600 : rewritten.width,
        height: thumb
          ? Math.max(1, Math.round(rewritten.height * (600 / rewritten.width)))
          : rewritten.height,
      },
      cta: {
        label: spotlightCtaLabel,
        href: `/products/${product.slug}`,
      },
      tags: (product.stack_tags || []).slice(0, 5),
    }
  })
}

export function homepageFeaturedSlugs(home: CmsHomepageSettings): string[] {
  return (home.featured_projects || [])
    .map(row => row.projects_id?.slug)
    .filter((slug): slug is string => Boolean(slug))
}

export function homepageExperienceKeys(home: CmsHomepageSettings): string[] {
  return (home.experience_preview || [])
    .map(row => row.experience_entries_id?.key)
    .filter((key): key is string => Boolean(key))
}

export function homepageSpotlightSlugs(home: CmsHomepageSettings): string[] {
  return (home.product_spotlights || [])
    .map(row => row.products_id?.slug)
    .filter((slug): slug is string => Boolean(slug))
}

/** Proof claim keys or UUIDs from M2M (key preferred when set). */
export function homepageProofKeys(home: CmsHomepageSettings): string[] {
  return (home.proof_claims || [])
    .map(row => row.approved_claims_id?.key || row.approved_claims_id?.id)
    .filter((key): key is string => Boolean(key))
}

function mapPageCopy(
  productsPage: CmsProductsPageSettings,
  spotlightCta: string,
): PageCopy {
  return {
    products_index: {
      title: productsPage.title,
      description: productsPage.description,
      seo_description: productsPage.seo_description,
      back_label: productsPage.back_label,
      back_href: catalogPageHref(productsPage.back_href),
      item_cta: productsPage.item_cta,
      spotlight_cta: spotlightCta,
    },
    product_detail: {
      kicker: productsPage.kicker,
      back_label: productsPage.detail_back_label,
      back_href: catalogPageHref(productsPage.detail_back_href),
      benefits_heading_with_stack: productsPage.benefits_heading_with_stack,
      benefits_heading_default: productsPage.benefits_heading_default,
      trust_heading: productsPage.trust_heading,
      download_warning_title: productsPage.download_warning_title,
    },
  }
}

function mapHomepageContent(
  site: CmsSiteSettings,
  homepageSettings: CmsHomepageSettings,
  productsPage: CmsProductsPageSettings,
  projects: CmsProject[],
  products: CmsProduct[],
  experience: ExperienceRole[],
  claims: CmsApprovedClaim[],
  catalog: FileCatalog = EMPTY_CATALOG,
  config: Pick<DirectusClientConfig, 'baseUrl'> = { baseUrl: '' },
): HomepageContent {
  if (!site.site_name) {
    throw new Error('site_settings.site_name is required')
  }
  if (!homepageSettings.value_proposition?.trim()) {
    throw new Error('homepage_settings.value_proposition is required')
  }
  if (!homepageSettings.contact_heading?.trim()) {
    throw new Error('homepage_settings.contact_heading is required')
  }
  if (!homepageSettings.contact_summary?.trim()) {
    throw new Error('homepage_settings.contact_summary is required')
  }
  if (!homepageSettings.spotlight_cta?.trim()) {
    throw new Error('homepage_settings.spotlight_cta is required')
  }
  if (!isPublishedButton(homepageSettings.experience_preview_cta)) {
    throw new Error('homepage_settings.experience_preview_cta is required')
  }

  const featuredProjectSlugs = homepageFeaturedSlugs(homepageSettings)
  const experiencePreviewIds = homepageExperienceKeys(homepageSettings)
  const productSpotlightSlugs = homepageSpotlightSlugs(homepageSettings)
  const proofClaimKeys = homepageProofKeys(homepageSettings)

  if (!featuredProjectSlugs.length) {
    throw new Error('homepage_settings.featured_projects is required')
  }
  if (!experiencePreviewIds.length) {
    throw new Error('homepage_settings.experience_preview is required')
  }
  if (!productSpotlightSlugs.length) {
    throw new Error('homepage_settings.product_spotlights is required')
  }
  if (!proofClaimKeys.length) {
    throw new Error('homepage_settings.proof_claims is required')
  }
  if (!homepageSettings.proof_heading?.trim()) {
    throw new Error('homepage_settings.proof_heading is required')
  }
  if (!homepageSettings.featured_work_heading?.trim()) {
    throw new Error('homepage_settings.featured_work_heading is required')
  }
  if (!homepageSettings.flagship_label?.trim()) {
    throw new Error('homepage_settings.flagship_label is required')
  }
  if (!homepageSettings.hero_focus_heading?.trim()) {
    throw new Error('homepage_settings.hero_focus_heading is required')
  }
  if (!homepageSettings.hero_focus_items?.length) {
    throw new Error('homepage_settings.hero_focus_items is required')
  }

  const pageCopy = mapPageCopy(productsPage, homepageSettings.spotlight_cta)
  const claimsByRef = indexClaimsByRef(claims)

  const proof: ProofItem[] = proofClaimKeys.map((id) => {
    const claim = claimsByRef.get(id)
    if (!claim) throw new Error(`Missing proof claim: ${id}`)
    return splitProofWording(claim.public_wording)
  })

  const previewItems = homepageExperiencePreview(
    experiencePreviewIds,
    experience,
  )

  if (!site.menu?.length) {
    throw new Error('site_settings.menu is required')
  }
  const navItems = site.menu.map(item => ({
    label: item.label,
    href: catalogPageHref(item.href),
  }))

  const primaryCtas = mapButtonRows(homepageSettings.primary_ctas)
  const profileLinks = mapButtonRows(homepageSettings.profile_links)
  if (!primaryCtas.length) {
    throw new Error('homepage_settings.primary_ctas is required')
  }

  const contactLinks = mapContactLinks(homepageSettings.contact_links)
  const ogImage = fileImage(
    config,
    catalog,
    site.og_image,
    site.site_name,
    { width: 1200, height: 630 },
  )

  return {
    person: {
      name: site.person_name,
      role: site.person_role,
    },
    valueProposition: homepageSettings.value_proposition,
    primaryCtas,
    profileLinks,
    heroFocus: {
      heading: homepageSettings.hero_focus_heading,
      items: homepageSettings.hero_focus_items,
    },
    proofHeading: homepageSettings.proof_heading,
    proof,
    featuredWorkHeading: homepageSettings.featured_work_heading,
    featuredWorkIntro: homepageSettings.featured_work_intro,
    flagshipLabel: homepageSettings.flagship_label,
    featuredCases: mapFeaturedCases(featuredProjectSlugs, projects),
    experiencePreview: {
      heading: homepageSettings.experience_preview_heading,
      items: previewItems,
      cta: mapButtonLink(homepageSettings.experience_preview_cta),
    },
    products: {
      heading: homepageSettings.products_heading,
      description: homepageSettings.products_description,
      items: mapProductSpotlights(
        productSpotlightSlugs,
        products,
        catalog,
        pageCopy.products_index.spotlight_cta,
      ),
    },
    navItems,
    contact: {
      heading: homepageSettings.contact_heading,
      summary: homepageSettings.contact_summary,
      links: contactLinks,
    },
    siteName: site.site_name,
    seoTitle: site.seo_title ?? undefined,
    seoDescription: site.seo_description ?? undefined,
    ogImage: ogImage
      ? {
          src: ogImage.src,
          alt: ogImage.alt,
          width: ogImage.width,
          height: ogImage.height,
        }
      : undefined,
    pageCopy,
  }
}

function mapCmsProduct(
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

  const launchCtas = mapLaunchCtas(product.launch_ctas)
  const hasLaunch = Boolean(
    product.launch_lead
    || product.launch_supporting_line
    || launchCtas.length
    || product.macos_download_warning
    || product.trust_facts?.length
    || product.trademark,
  )

  const github = product.github_owner && product.github_repo
    ? { owner: product.github_owner, repo: product.github_repo }
    : undefined

  const softwareApplication
    = product.application_category
      && product.operating_system
      && product.license_url
      ? {
          applicationCategory: product.application_category,
          operatingSystem: product.operating_system,
          license: product.license_url,
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
    launch: hasLaunch
      ? {
          lead: product.launch_lead || product.short_description,
          supportingLine: product.launch_supporting_line || '',
          ctas: launchCtas,
          macosDownloadWarning: product.macos_download_warning ?? undefined,
          trustFacts: product.trust_facts || [],
          trademark: product.trademark ?? undefined,
        }
      : undefined,
    github,
    seo: product.seo_title || product.seo_description || product.seo_title_suffix
      ? {
          title: product.seo_title || product.name,
          description: product.seo_description || product.short_description,
          titleSuffix: product.seo_title_suffix ?? undefined,
        }
      : undefined,
    softwareApplication,
    stackTags: product.stack_tags ?? undefined,
  }
}

function mapCmsProducts(
  products: CmsProduct[],
  config: Pick<DirectusClientConfig, 'baseUrl'>,
  catalog: FileCatalog = EMPTY_CATALOG,
): Project[] {
  return [...products]
    .sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
    .map(product => mapCmsProduct(product, config, catalog))
}

function requirePublished(status: string | undefined, collection: string): void {
  if (status !== 'published') {
    throw new Error(`${collection} not published`)
  }
}

export function mapPortfolio(
  raw: CmsPortfolioRaw,
  config: Pick<DirectusClientConfig, 'baseUrl'>,
): PortfolioContent {
  requirePublished(raw.site.status, 'site_settings')
  requirePublished(raw.homepageSettings.status, 'homepage_settings')
  requirePublished(raw.experiencePage.status, 'experience_page_settings')
  requirePublished(raw.productsPage.status, 'products_page_settings')
  const catalog = buildFileCatalog(raw.files)
  const experience = mapExperienceRoles(raw.experience, raw.claims, config, catalog)
  const homepage = mapHomepageContent(
    raw.site,
    raw.homepageSettings,
    raw.productsPage,
    raw.projects,
    raw.products,
    experience,
    raw.claims,
    catalog,
    config,
  )
  const products = mapCmsProducts(raw.products, config, catalog)

  return {
    homepage,
    experience,
    products,
    experiencePage: raw.experiencePage,
    productSlugs: products.map(p => p.slug),
  }
}
