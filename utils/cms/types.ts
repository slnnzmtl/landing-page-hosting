export type DirectusStatus = 'draft' | 'published' | 'archived'

export interface CmsLink {
  label: string
  href: string
}

/** Tenure chips on site_settings (page intro lives on experience_page_settings). */
export interface CmsProfessionalTenure {
  short: string
  label: string
  heroSubtitle: string
  softwareEngineeringSince: string
}

/** Nested UI chrome from site_settings.page_copy — products + contact only. */
export interface CmsPageCopy {
  products_index: {
    title: string
    description: string
    seo_description: string
    back_label: string
    back_href: string
    item_cta: string
    spotlight_cta: string
  }
  contact: {
    card_heading: string
    email_label: string
    telegram_label: string
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

/** Identity, contact, SEO, menu — site_settings singleton. */
export interface CmsSiteSettings {
  status: DirectusStatus
  person_name: string
  person_role: string
  value_proposition: string
  professional_tenure: CmsProfessionalTenure
  contact_heading: string
  contact_summary: string
  contact_email: string
  contact_telegram: string
  /** Sidebar nav: [{ label, href }] */
  menu?: CmsLink[] | null
  site_name?: string | null
  seo_title?: string | null
  seo_description?: string | null
  page_copy?: CmsPageCopy | null
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
  approved_claims_id?: { key?: string } | null
}

/** Homepage composition — homepage_settings singleton. */
export interface CmsHomepageSettings {
  status: DirectusStatus
  primary_ctas: CmsLink[]
  profile_links: CmsLink[]
  hero_focus: {
    heading: string
    items: Array<{ title: string, summary: string }>
  }
  proof_heading: string
  featured_work_heading: string
  featured_work_intro: string
  flagship_label: string
  featured_projects: CmsM2mProjectRow[]
  experience_preview_heading: string
  experience_preview: CmsM2mExperienceRow[]
  experience_preview_cta: CmsLink
  products_heading: string
  products_description: string
  product_spotlights: CmsM2mProductRow[]
  proof_claims: CmsM2mClaimRow[]
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
  key: string
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
  launch?: {
    lead: string
    supportingLine: string
    ctas: Array<{
      label: string
      href: string
      kind: 'primary' | 'secondary'
      macosDownload?: boolean
    }>
    macosDownloadWarning?: string
    trustFacts: Array<{ label: string, value: string, href?: string }>
    trademark?: string
  } | null
  github?: { owner: string, repo: string } | null
  software_application?: {
    applicationCategory: string
    operatingSystem: string
    license: string
  } | null
  evidence_links?: CmsLink[] | null
  logo?: string | null
  social_image?: string | null
  seo?: {
    title?: string
    description?: string
    titleSuffix?: string
  } | null
}

export interface CmsPortfolioRaw {
  site: CmsSiteSettings
  homepageSettings: CmsHomepageSettings
  experiencePage: CmsExperiencePageSettings
  experience: CmsExperienceEntry[]
  projects: CmsProject[]
  products: CmsProduct[]
  claims: CmsApprovedClaim[]
  files?: CmsFile[]
}
