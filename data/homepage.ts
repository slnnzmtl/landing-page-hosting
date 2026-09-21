/** Nested UI chrome for products (assembled from products_page_settings + spotlight_cta). */
export interface PageCopy {
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

export interface ProofItem {
  value: string
  label: string
}

export interface HeroFocusItem {
  title: string
  summary: string
}

export interface HeroFocus {
  heading: string
  items: HeroFocusItem[]
}

export interface FeaturedCase {
  slug: string
  title: string
  featured?: boolean
  problem: string
  role: string
  contribution: string
  outcome: string
  stack: string[]
  /** Evidence link only; omit when the CMS case has no evidence_links. */
  href?: string
  hrefLabel?: string
}

export interface ExperiencePreviewItem {
  id: string
  organization: string
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
}

export interface ProductsSection {
  heading: string
  description: string
  items: ProductSpotlight[]
}

export interface HomepageContent {
  person: {
    name: string
    role: string
  }
  valueProposition: string
  primaryCtas: HomepageLink[]
  profileLinks: HomepageLink[]
  heroFocus: HeroFocus
  proofHeading: string
  proof: ProofItem[]
  featuredWorkHeading: string
  featuredWorkIntro: string
  flagshipLabel: string
  featuredCases: FeaturedCase[]
  experiencePreview: ExperiencePreview
  products: ProductsSection
  /** Primary site nav from Directus `site_settings.menu`. */
  navItems: HomepageLink[]
  contact: {
    heading: string
    summary: string
    email: HomepageLink
    telegram: HomepageLink
  }
  /** From Directus `site_settings.site_name`. */
  siteName: string
  /** Homepage meta overrides from `seo_title` / `seo_description`. */
  seoTitle?: string
  seoDescription?: string
  /** Optional homepage Open Graph image from `site_settings.og_image`. */
  ogImage?: { src: string, alt: string, width: number, height: number }
  /** Products chrome from Directus `products_page_settings` + spotlight CTA. */
  pageCopy: PageCopy
}

export type HomepageHrefKind = 'native' | 'route'

export type ConversionEventName
  = 'flagship-case-open'
    | 'case-open'
    | 'product-open'
    | 'contact'

/** `native` = plain `<a>` (https, mailto, hash). `route` = in-app `NuxtLink`. */
export function homepageHrefKind(href: string): HomepageHrefKind {
  return /^(?:https?:|mailto:|#)/i.test(href) ? 'native' : 'route'
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
  options?: { featured?: boolean, product?: boolean },
): ConversionEventName | null {
  if (isContactHref(href)) return 'contact'
  if (options?.product) return 'product-open'
  if (options?.featured) return 'flagship-case-open'
  if (href === '#flagship-case') return null
  if (/^https?:/i.test(href) || homepageHrefKind(href) === 'route') {
    return 'case-open'
  }
  return null
}
