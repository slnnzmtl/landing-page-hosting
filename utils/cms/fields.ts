/** Explicit Directus field allowlists for the Nuxt build reader. Never use fields=*. */

export const SITE_FIELDS = [
  'status',
  'person_name',
  'person_role',
  'value_proposition',
  'professional_tenure',
  'primary_ctas',
  'profile_links',
  'hero_focus',
  'featured_work_intro',
  'featured_project_slugs',
  'experience_preview_heading',
  'experience_preview_ids',
  'experience_preview_cta',
  'products_heading',
  'products_description',
  'product_spotlight_slugs',
  'proof_claim_ids',
  'contact_heading',
  'contact_summary',
  'contact_email',
  'contact_telegram',
  'menu',
  'site_name',
  'seo_title',
  'seo_description',
  'page_copy',
].join(',')

export const FILE_FIELDS = 'id,filename_download,title'

export const EXPERIENCE_FIELDS = [
  'id',
  'key',
  'status',
  'sort',
  'organization',
  'title',
  'engagement_type',
  'location',
  'work_mode',
  'start',
  'end',
  'scope',
  'contributions',
  'outcomes',
  'homepage_summary',
  'technologies',
  'links',
  'icon',
  'icon_alt',
].join(',')

export const PROJECT_FIELDS = [
  'id',
  'slug',
  'status',
  'sort',
  'name',
  'track',
  'role',
  'confidentiality_level',
  'experience_id',
  'short_description',
  'description',
  'problem',
  'contribution',
  'solution',
  'outcome',
  'stack_tags',
  'capability_tags',
  'evidence_links',
  'logo',
  'social_image',
  'seo',
].join(',')

export const PRODUCT_FIELDS = [
  'id',
  'slug',
  'status',
  'sort',
  'name',
  'short_description',
  'description',
  'stack_tags',
  'benefits',
  'guide',
  'launch',
  'github',
  'software_application',
  'evidence_links',
  'logo',
  'social_image',
  'seo',
].join(',')

export const BUILD_CLAIM_FIELDS = 'id,key,public_wording,status'

/** Private fields — never request these from Directus. */
export const PRIVATE_FIELDS = [
  'confidentiality_notes',
  'private_evidence',
  'evidence_origin',
  'evidence_note',
] as const
