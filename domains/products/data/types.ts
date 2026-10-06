export interface ProductImage {
  src: string
  alt: string
  width: number
  height: number
  caption?: string
  /** Optional smaller source for grid/hero; full `src` stays for lightbox. */
  srcThumb?: string
}

export interface ProductLink {
  label: string
  href: string
}

export interface ProductLaunchCta {
  label: string
  href: string
  kind: 'primary' | 'secondary'
  /** Resolve href from the latest GitHub macOS universal asset when a release is available */
  macosDownload?: boolean
}

export interface ProductTrustFact {
  label: string
  value: string
  href?: string
}

export interface ProductLaunch {
  lead: string
  supportingLine: string
  ctas: ProductLaunchCta[]
  /** Shown before macOS app download (ad hoc signing, Gatekeeper, etc.) */
  macosDownloadWarning?: string
  /** Evergreen trust copy; version and release date are filled from GitHub when linked */
  trustFacts: ProductTrustFact[]
  trademark?: string
}

export interface ProductBenefit {
  title: string
  description: string
}

export interface ProductGuideStep {
  title: string
  body: string
  /** Optional screenshot shown under this walkthrough step. */
  image?: ProductImage
}

export interface ProductGuide {
  title: string
  warning?: string
  steps: ProductGuideStep[]
}

export interface GithubRepoRef {
  owner: string
  repo: string
}

export interface ProductSeo {
  title: string
  description: string
  /** Overrides the default site suffix in the document title, e.g. Daniel Kazansky */
  titleSuffix?: string
}

export interface ProductSoftwareApplication {
  applicationCategory: string
  operatingSystem: string
  license?: string
  priceAmount?: number
  priceCurrency?: string
  installUrl?: string
  softwareRequirements?: string
}

export type ProductDetailTemplate = 'application' | 'extension'

export type ProductMediaPresentation
  = 'comparison_before'
    | 'comparison_after'
    | 'gallery'
    | 'hero'

export interface ProductMedia extends ProductImage {
  presentation: ProductMediaPresentation
}

export interface ProductBase {
  slug: string
  name: string
  shortDescription: string
  detailTemplate: ProductDetailTemplate
  description?: string
  logo?: ProductImage
  socialImage?: ProductImage
  benefits?: ProductBenefit[]
  guide?: ProductGuide
  links?: ProductLink[]
  launch?: ProductLaunch
  gallery?: ProductImage[]
  github?: GithubRepoRef
  seo?: ProductSeo
  softwareApplication?: ProductSoftwareApplication
  stackTags?: string[]
}

export interface ApplicationProduct extends ProductBase {
  detailTemplate: 'application'
}

export interface ExtensionProduct extends ProductBase {
  detailTemplate: 'extension'
  kicker: string
  price: {
    amount: number
    currency: string
  }
  softwareRequirements: string
  mediaHeading: string
  mediaIntro?: string
  media: ProductMedia[]
}

export type Product = ApplicationProduct | ExtensionProduct

export function productPath(slug: string): string {
  return `/products/${slug}`
}
