import type { ProjectSummary } from '~/domains/projects/data/types'

/** CMS-controlled UI chrome for Projects and Products. */
export interface PageCopy {
  projects_index: {
    title: string
    description: string
    seo_description: string
    back_label: string
    back_href: string
    item_cta: string
  }
  products_index: {
    title: string
    description: string
    seo_description: string
    back_label: string
    back_href: string
    item_cta: string
    spotlight_cta: string
  }
  product_detail: {
    kicker: string
    back_label: string
    back_href: string
    benefits_heading_with_stack: string
    benefits_heading_default: string
    trust_heading: string
    download_warning_title: string
  }
}

export interface HomepageLink {
  label: string
  href: string
}

export interface ContactLink extends HomepageLink {
  /** Visible hyperlink text from Directus `contact_links.title`. */
  title: string
}

export interface ProofItem {
  value: string
  label: string
}

export interface ExperiencePreviewItem {
  id: string
  organization: string
  title: string
  dateRange: string
  summary?: string
  icon?: string
  iconAlt?: string
}

export interface ExperiencePreview {
  heading: string
  items: ExperiencePreviewItem[]
  cta: HomepageLink
}

export interface ProductSpotlightImage {
  src: string
  srcThumb?: string
  srcset?: string
  sizes?: string
  alt: string
  width: number
  height: number
}

export interface ProductSpotlight {
  slug: string
  title: string
  lead: string
  supportingLine: string
  image: ProductSpotlightImage
  cta: HomepageLink
  tags: string[]
  detail_template: string
}

export interface ProductsSection {
  heading: string
  description: string
  items: ProductSpotlight[]
  totalCount: number
  allProductsCta: HomepageLink
}

export interface HomepageContent {
  person: {
    name: string
    role: string
  }
  valueProposition: string
  credibilityLine?: string
  primaryCtas: HomepageLink[]
  profileLinks: HomepageLink[]
  proofHeading: string
  proof: ProofItem[]
  featuredWorkHeading: string
  featuredWorkIntro: string
  featuredProjects: ProjectSummary[]
  projectsCta: HomepageLink
  experiencePreview: ExperiencePreview
  products: ProductsSection
  /** Primary site nav from Directus `site_settings.menu`. */
  navItems: HomepageLink[]
  contact: {
    heading: string
    summary: string
    links: ContactLink[]
  }
  /** From Directus `site_settings.site_name`. */
  siteName: string
  /** Homepage meta overrides from `seo_title` / `seo_description`. */
  seoTitle?: string
  seoDescription?: string
  /** Optional homepage Open Graph image from `site_settings.og_image`. */
  ogImage?: { src: string, alt: string, width: number, height: number }
  /** CMS page chrome for Projects and Products. */
  pageCopy: PageCopy
}

export type HomepageHrefKind = 'native' | 'route'

export type ConversionEventName
  = 'project-open'
    | 'case-study-open'
    | 'product-open'
    | 'contact'

/** `native` = plain `<a>` (https, mailto, tel, hash). `route` = in-app `NuxtLink`. */
export function homepageHrefKind(href: string): HomepageHrefKind {
  return /^(?:https?:|mailto:|tel:|#)/i.test(href) ? 'native' : 'route'
}

export function opensInNewTab(href: string): boolean {
  return /^https?:/i.test(href)
}

export function externalLinkRel(href: string): string | undefined {
  return opensInNewTab(href) ? 'noopener noreferrer' : undefined
}

export function isContactHref(href: string): boolean {
  return /^mailto:/i.test(href)
    || /^https?:\/\/(?:www\.)?t\.me\//i.test(href)
    || href === '#contact'
}

/** Map homepage CTAs to the four Umami events. Hash-only nav anchors return null. */
export function conversionEventName(
  href: string,
  options?: { project?: boolean, caseStudy?: boolean, product?: boolean, contact?: boolean },
): ConversionEventName | null {
  if (options?.contact || isContactHref(href)) return 'contact'
  if (options?.product) return 'product-open'
  if (options?.caseStudy) return 'case-study-open'
  if (options?.project) return 'project-open'
  if (/^https?:/i.test(href) || homepageHrefKind(href) === 'route') {
    return 'project-open'
  }
  return null
}
