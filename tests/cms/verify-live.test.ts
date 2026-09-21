/**
 * Live Directus inventory check. Skips when DIRECTUS_TOKEN is unset
 * (unit CI / nuxt prepare). Run explicitly with:
 *   pnpm cms:verify
 */
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  BUILD_CLAIM_FIELDS,
  EXPERIENCE_FIELDS,
  PRODUCT_FIELDS,
  PROJECT_FIELDS,
  SITE_FIELDS,
} from '~/utils/cms/fields'
import { directusGet, resolveDirectusConfig } from '~/utils/cms/client'
import { resetPortfolioCache } from '~/utils/cms/load'
import { mapPortfolio } from '~/utils/cms/map'
import { cmsPortfolioFixture } from '~/tests/fixtures/cms-portfolio'
import type {
  CmsApprovedClaim,
  CmsExperienceEntry,
  CmsFile,
  CmsProduct,
  CmsProject,
  CmsSiteSettings,
} from '~/utils/cms/types'

function loadEnvFile() {
  const envPath = join(process.cwd(), '.env')
  if (!existsSync(envPath)) return
  const text = readFileSync(envPath, 'utf8')
  for (const line of text.split('\n')) {
    if (!line || line.startsWith('#') || !line.includes('=')) continue
    const i = line.indexOf('=')
    const key = line.slice(0, i).trim()
    let value = line.slice(i + 1).trim()
    if (
      (value.startsWith('\'') && value.endsWith('\''))
      || (value.startsWith('"') && value.endsWith('"'))
    ) {
      value = value.slice(1, -1)
    }
    if (!(key in process.env)) process.env[key] = value
  }
}

loadEnvFile()

const hasToken = Boolean(process.env.DIRECTUS_TOKEN)
const requireLive = process.env.CMS_VERIFY === '1'

if (requireLive && !hasToken) {
  throw new Error(
    'DIRECTUS_TOKEN is required for pnpm cms:verify. Set it in .env (server-only).',
  )
}

const describeLive = hasToken && requireLive ? describe : describe.skip

describeLive('live Directus portfolio verification', () => {
  it('matches seeded inventory and public copy', async () => {
    resetPortfolioCache()
    const config = resolveDirectusConfig()

    const site = await directusGet<CmsSiteSettings>(
      config,
      `/items/site_settings?fields=${SITE_FIELDS}`,
    )
    expect(site.status).toBe('published')

    const experience = await directusGet<CmsExperienceEntry[]>(
      config,
      `/items/experience_entries?filter[status][_eq]=published&fields=${EXPERIENCE_FIELDS}&sort=sort&limit=-1`,
    )
    const projects = await directusGet<CmsProject[]>(
      config,
      `/items/projects?filter[status][_eq]=published&fields=${PROJECT_FIELDS}&sort=sort&limit=-1`,
    )
    const products = await directusGet<CmsProduct[]>(
      config,
      `/items/products?filter[status][_eq]=published&fields=${PRODUCT_FIELDS}&sort=sort&limit=-1`,
    )

    const expectedExperienceKeys = cmsPortfolioFixture.experience.map(e => e.key)
    const expectedProjectSlugs = cmsPortfolioFixture.projects.map(p => p.slug)
    const expectedProductSlugs = cmsPortfolioFixture.products.map(p => p.slug)

    expect(experience.map(e => e.key)).toEqual(expectedExperienceKeys)
    expect(projects.map(p => p.slug)).toEqual(expectedProjectSlugs)
    expect(products.map(p => p.slug)).toEqual(expectedProductSlugs)
    expect(projects.some(p => p.slug === 'rekordbox-playlist-converter')).toBe(false)

    const rekordbox = products.find(p => p.slug === 'rekordbox-playlist-converter')
    expect(rekordbox?.logo).toBeTruthy()
    expect(rekordbox?.guide).toBeTruthy()
    expect(rekordbox?.launch).toBeTruthy()

    const upwork = projects.find(p => p.slug === 'upwork-reputation-team')
    expect(upwork?.experience_id).toBeTruthy()

    expect(site.featured_project_slugs).toEqual(expectedProjectSlugs)
    expect(site.product_spotlight_slugs).toEqual(expectedProductSlugs)
    expect(site.proof_claim_ids).toEqual(cmsPortfolioFixture.site.proof_claim_ids)
    expect(site.person_name).toBe(cmsPortfolioFixture.site.person_name)
    expect(site.person_role).toBe(cmsPortfolioFixture.site.person_role)
    expect(site.value_proposition).toBe(cmsPortfolioFixture.site.value_proposition)
    expect(site.contact_email).toBe(cmsPortfolioFixture.site.contact_email)
    expect(site.menu?.map(item => item.label)).toEqual(
      cmsPortfolioFixture.site.menu?.map(item => item.label),
    )
    expect(site.menu?.map(item => item.href)).toEqual(
      cmsPortfolioFixture.site.menu?.map(item => item.href),
    )
    expect(site.site_name).toBe(cmsPortfolioFixture.site.site_name)
    expect(site.seo_title).toBe(cmsPortfolioFixture.site.seo_title)
    expect(site.seo_description).toBe(cmsPortfolioFixture.site.seo_description)
    expect(site.page_copy?.experience.title).toBe(
      cmsPortfolioFixture.site.page_copy?.experience.title,
    )
    expect(site.page_copy?.products_index.item_cta).toBe(
      cmsPortfolioFixture.site.page_copy?.products_index.item_cta,
    )
    expect(site.page_copy?.contact.card_heading).toBe(
      cmsPortfolioFixture.site.page_copy?.contact.card_heading,
    )
    expect(site.page_copy?.product_detail.trust_heading).toBe(
      cmsPortfolioFixture.site.page_copy?.product_detail.trust_heading,
    )

    for (const expected of cmsPortfolioFixture.projects) {
      const live = projects.find(p => p.slug === expected.slug)
      expect(live?.name).toBe(expected.name)
      expect(live?.problem).toBe(expected.problem)
      expect(live?.role).toBe(expected.role)
      expect(live?.contribution).toBe(expected.contribution)
      expect(live?.outcome).toBe(expected.outcome)
    }

    for (const expected of cmsPortfolioFixture.experience) {
      const live = experience.find(e => e.key === expected.key)
      expect(live?.organization).toBe(expected.organization)
      expect(live?.title).toBe(expected.title)
      expect(live?.start).toBe(expected.start)
      expect(live?.end ?? null).toBe(expected.end ?? null)
    }

    const claimKeys = [
      ...cmsPortfolioFixture.site.proof_claim_ids,
      ...experience.flatMap(e => (e.outcomes || []).map(o => o.claim_id).filter(Boolean)),
    ]
    const uniqueClaimKeys = [...new Set(claimKeys)]
    const claims = await directusGet<CmsApprovedClaim[]>(
      config,
      `/items/approved_claims?filter[status][_eq]=published&filter[key][_in]=${uniqueClaimKeys.map(encodeURIComponent).join(',')}&fields=${BUILD_CLAIM_FIELDS}&limit=-1`,
    )
    const files = await directusGet<CmsFile[]>(
      config,
      `/files?fields=id,filename_download,title&limit=-1`,
    )
    expect(files.map(f => f.title).filter(Boolean)).toEqual(
      expect.arrayContaining([
        '/favicon.ico',
        '/favicon-16x16.png',
        '/favicon-32x32.png',
        '/apple-touch-icon.png',
        '/images/experience/upwork.png',
      ]),
    )

    const mapped = mapPortfolio(
      { site, experience, projects, products, claims, files },
      config,
    )
    const serialized = JSON.stringify(mapped)
    expect(serialized).not.toMatch(/evidence_origin|evidence_note|confidentiality_notes|private_evidence/)
    expect(mapped.homepage.proof).toHaveLength(4)
    expect(mapped.homepage.featuredCases[0]?.featured).toBe(true)
    expect(mapped.homepage.navItems.map(item => item.label)).toEqual([
      'Work',
      'Experience',
      'Products',
      'Contact',
      'GitHub',
    ])
    expect(mapped.homepage.products.items[0]?.image.src).toBe(
      '/projects/rekordbox-playlist-converter/macos-app-main-window.webp',
    )
    expect(mapped.homepage.siteName).toBe('Kazansky.dev')
    expect(mapped.homepage.pageCopy.products_index.spotlight_cta).toBe('View product')
    expect(mapped.experience.find(r => r.id === 'upwork-reputation-team')?.icon).toBe(
      '/images/experience/upwork.png',
    )
    expect(mapped.products).toHaveLength(1)
    expect(mapped.experience).toHaveLength(9)
  }, 60_000)
})
