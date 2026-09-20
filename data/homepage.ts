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
  href: string
  hrefLabel: string
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
  proof: ProofItem[]
  featuredWorkIntro: string
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
