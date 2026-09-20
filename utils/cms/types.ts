export type DirectusStatus = 'draft' | 'published' | 'archived'

export interface CmsLink {
  label: string
  href: string
}

export interface CmsProfessionalTenure {
  short: string
  label: string
  heroSubtitle: string
  softwareEngineeringSince: string
  pageIntro: string
}

export interface CmsSiteSettings {
  status: DirectusStatus
  person_name: string
  person_role: string
  value_proposition: string
  professional_tenure: CmsProfessionalTenure
  primary_ctas: CmsLink[]
  profile_links: CmsLink[]
  hero_focus: {
    heading: string
    items: Array<{ title: string, summary: string }>
  }
  featured_work_intro: string
  featured_project_slugs: string[]
  experience_preview_heading: string
  experience_preview_ids: string[]
  experience_preview_cta: CmsLink
  products_heading: string
  products_description: string
  product_spotlight_slugs: string[]
  proof_claim_ids: string[]
  contact_heading: string
  contact_summary: string
  contact_email: string
  contact_telegram: string
  /** Sidebar nav: [{ label, href }] */
  menu?: CmsLink[] | null
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
  track?: string | null
  role?: string | null
  confidentiality_level?: string | null
  experience_id?: string | null
  short_description?: string | null
  description?: string | null
  problem?: string | null
  contribution?: string | null
  solution?: string | null
  outcome?: string | null
  stack_tags?: string[] | null
  capability_tags?: string[] | null
  evidence_links?: CmsLink[] | null
  logo?: string | null
  social_image?: string | null
  seo?: {
    title?: string
    description?: string
    titleSuffix?: string
  } | null
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
  experience: CmsExperienceEntry[]
  projects: CmsProject[]
  products: CmsProduct[]
  claims: CmsApprovedClaim[]
  files?: CmsFile[]
}
