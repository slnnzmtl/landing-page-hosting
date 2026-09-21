/** Explicit Directus field allowlists for the Nuxt build reader. Never use fields=*. */

export const SITE_FIELDS = [
  'status',
  'person_name',
  'person_role',
  'menu',
  'site_name',
  'seo_title',
  'seo_description',
  'og_image',
  'favicon_ico',
  'favicon_png_32',
  'favicon_png_16',
  'apple_touch_icon',
].join(',')

/** Each nested field must be a full dotted path — commas in `fields=` split at the root. */
const BUTTON_FIELDS = [
  'id',
  'key',
  'status',
  'label',
  'href',
  'type',
  'href_source',
  'sort',
] as const

function nestedFields(prefix: string, fields: readonly string[]): string[] {
  return fields.map(field => `${prefix}.${field}`)
}

export const HOMEPAGE_SETTINGS_FIELDS = [
  'status',
  'value_proposition',
  ...nestedFields('primary_ctas.buttons_id', BUTTON_FIELDS),
  ...nestedFields('profile_links.buttons_id', BUTTON_FIELDS),
  'hero_focus_heading',
  'hero_focus_items',
  'proof_heading',
  'featured_work_heading',
  'featured_work_intro',
  'flagship_label',
  'featured_projects.projects_id.slug',
  'experience_preview_heading',
  'experience_preview.experience_entries_id.key',
  ...nestedFields('experience_preview_cta', BUTTON_FIELDS),
  'products_heading',
  'products_description',
  'product_spotlights.products_id.slug',
  'proof_claims.approved_claims_id.id',
  'proof_claims.approved_claims_id.key',
  'spotlight_cta',
  'contact_heading',
  'contact_summary',
  'contact_links',
].join(',')

export const EXPERIENCE_PAGE_FIELDS = [
  'status',
  'title',
  'page_intro',
  'back_label',
  'back_href',
  'seo_description',
].join(',')

export const PRODUCTS_PAGE_FIELDS = [
  'status',
  'title',
  'description',
  'seo_description',
  'back_label',
  'back_href',
  'item_cta',
  'kicker',
  'detail_back_label',
  'detail_back_href',
  'benefits_heading_with_stack',
  'benefits_heading_default',
  'trust_heading',
  'download_warning_title',
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
  'role',
  'short_description',
  'problem',
  'contribution',
  'outcome',
  'stack_tags',
  'evidence_links',
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
  'launch_lead',
  'launch_supporting_line',
  ...nestedFields('launch_ctas.buttons_id', BUTTON_FIELDS),
  'macos_download_warning',
  'trust_facts',
  'trademark',
  'github_owner',
  'github_repo',
  'application_category',
  'operating_system',
  'license_url',
  'evidence_links',
  'logo',
  'social_image',
  'seo_title',
  'seo_description',
  'seo_title_suffix',
].join(',')

export const BUILD_CLAIM_FIELDS = 'id,key,public_wording,status'

/** Private fields — never request these from Directus. */
export const PRIVATE_FIELDS = [
  'confidentiality_notes',
  'private_evidence',
  'evidence_origin',
  'evidence_note',
] as const
