export type DirectusStatus = 'draft' | 'published' | 'archived'

export type CmsButtonType = 'primary' | 'secondary' | 'tertiary' | 'link'
export type CmsButtonHrefSource = 'static' | 'github_macos_release'

export interface CmsLink {
  label: string
  href: string
}

/** Reusable CTA / link button from the `buttons` collection. */
export interface CmsButton {
  id?: string
  key?: string
  status: DirectusStatus
  label: string
  href: string
  type: CmsButtonType
  href_source: CmsButtonHrefSource
  sort?: number | null
}

/** Identity, navigation, SEO, favicons — site_settings singleton. */
export interface CmsSiteSettings {
  status: DirectusStatus
  person_name: string
  person_role: string
  /** Sidebar nav: [{ label, href }] */
  menu?: CmsLink[] | null
  site_name?: string | null
  seo_title?: string | null
  seo_description?: string | null
  og_image?: string | null
  favicon_ico?: string | null
  favicon_png_32?: string | null
  favicon_png_16?: string | null
  apple_touch_icon?: string | null
}

/** M2M junction rows from Directus REST (`featured_projects.projects_id.slug`, …). */
export interface CmsM2mProjectRow {
  projects_id?: { slug?: string } | null
}

export interface CmsM2mExperienceRow {
  experience_entries_id?: { key?: string } | null
}

export interface CmsM2mProductRow {
  products_id?: { slug?: string } | null
}

export interface CmsM2mClaimRow {
  approved_claims_id?: { key?: string, id?: string } | null
}

export interface CmsM2mButtonRow {
  buttons_id?: CmsButton | null
}

/** Homepage composition — homepage_settings singleton. */
export interface CmsHomepageSettings {
  status: DirectusStatus
  value_proposition?: string | null
  primary_ctas?: CmsM2mButtonRow[] | null
  profile_links?: CmsM2mButtonRow[] | null
  hero_focus_heading: string
  hero_focus_items: Array<{ title: string, summary: string }>
  proof_heading: string
  featured_work_heading: string
  featured_work_intro: string
  flagship_label: string
  featured_projects: CmsM2mProjectRow[]
  experience_preview_heading: string
  experience_preview: CmsM2mExperienceRow[]
  experience_preview_cta?: CmsButton | null
  products_heading: string
  products_description: string
  product_spotlights: CmsM2mProductRow[]
  proof_claims: CmsM2mClaimRow[]
  spotlight_cta: string
  contact_heading?: string | null
  contact_summary?: string | null
  contact_links?: CmsLink[] | null
}

/** /experience page chrome — experience_page_settings singleton. */
export interface CmsExperiencePageSettings {
  status: DirectusStatus
  title: string
  page_intro: string
  back_label: string
  back_href: string
  seo_description: string
}

/** /products index + detail chrome — products_page_settings singleton. */
export interface CmsProductsPageSettings {
  status: DirectusStatus
  title: string
  description: string
  seo_description: string
  back_label: string
  back_href: string
  item_cta: string
  kicker: string
  detail_back_label: string
  detail_back_href: string
  benefits_heading_with_stack: string
  benefits_heading_default: string
  trust_heading: string
  download_warning_title: string
}

export interface CmsFile {
  id: string
  filename_download: string
  /** Original public path, e.g. /images/experience/upwork.png */
  title?: string | null
}

export interface CmsExperienceOutcomeRef {
  claim_id: string
  qualifier: 'personal' | 'team' | 'platform'
}

export interface CmsExperienceEntry {
  id: string
  key: string
  status: DirectusStatus
  sort?: number | null
  organization: string
  title: string
  engagement_type: 'full-time' | 'part-time' | 'freelance' | 'contractor' | 'independent'
  location: string
  work_mode: 'remote' | 'on-site' | 'hybrid'
  start: string
  end: string | null
  scope: string
  contributions: Array<{ text: string }> | string[]
  outcomes: CmsExperienceOutcomeRef[]
  homepage_summary?: string | null
  technologies: string[]
  links?: CmsLink[] | null
  icon?: string | null
  icon_alt?: string | null
}

export interface CmsApprovedClaim {
  id: string
  key?: string | null
  public_wording: string
  status: DirectusStatus
}

export interface CmsProject {
  id: string
  slug: string
  status: DirectusStatus
  sort?: number | null
  name: string
  role?: string | null
  short_description?: string | null
  problem?: string | null
  contribution?: string | null
  outcome?: string | null
  stack_tags?: string[] | null
  evidence_links?: CmsLink[] | null
}

export interface CmsProduct {
  id: string
  slug: string
  status: DirectusStatus
  sort?: number | null
  name: string
  short_description: string
  description?: string | null
  stack_tags?: string[] | null
  benefits?: Array<{ title: string, description: string }> | null
  guide?: {
    title: string
    warning?: string
    steps: Array<{
      title: string
      body: string
      image?: {
        src: string
        srcThumb?: string
        srcset?: string
        sizes?: string
        alt: string
        width: number
        height: number
        caption?: string
      }
    }>
  } | null
  launch_lead?: string | null
  launch_supporting_line?: string | null
  launch_ctas?: CmsM2mButtonRow[] | null
  macos_download_warning?: string | null
  trust_facts?: Array<{ label: string, value: string, href?: string }> | null
  trademark?: string | null
  github_owner?: string | null
  github_repo?: string | null
  application_category?: string | null
  operating_system?: string | null
  license_url?: string | null
  evidence_links?: CmsLink[] | null
  logo?: string | null
  social_image?: string | null
  seo_title?: string | null
  seo_description?: string | null
  seo_title_suffix?: string | null
}

export interface CmsPortfolioRaw {
  site: CmsSiteSettings
  homepageSettings: CmsHomepageSettings
  experiencePage: CmsExperiencePageSettings
  productsPage: CmsProductsPageSettings
  experience: CmsExperienceEntry[]
  projects: CmsProject[]
  products: CmsProduct[]
  claims: CmsApprovedClaim[]
  files?: CmsFile[]
}
