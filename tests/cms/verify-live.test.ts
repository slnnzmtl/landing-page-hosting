/**
 * Live Directus contract check. Skips when DIRECTUS_TOKEN is unset
 * (unit CI / nuxt prepare). Run explicitly with:
 *   pnpm cms:verify
 *
 * Asserts published shape and that loadPortfolio/mapPortfolio succeeds —
 * not a golden-copy diff against TypeScript fixtures. Directus is the
 * authoring source of truth. Uses the same fetch+map path as generate.
 */
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { resolveDirectusConfig } from '~/utils/cms/client'
import { loadPortfolio, resetPortfolioCache } from '~/utils/cms/load'
import {
  homepageExperienceKeys,
  homepageFeaturedSlugs,
  homepageProofKeys,
  homepageSpotlightSlugs,
} from '~/utils/cms/map'

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

describeLive('live Directus portfolio contract', () => {
  it('loads published content that maps into a full homepage payload', async () => {
    resetPortfolioCache()
    const config = resolveDirectusConfig()
    const mapped = await loadPortfolio(config)

    const { site, homepageSettings, experiencePage } = mapped
    expect(site.status).toBe('published')
    expect(homepageSettings.status).toBe('published')
    expect(experiencePage.status).toBe('published')
    expect(site.person_name?.trim()).toBeTruthy()
    expect(site.site_name?.trim()).toBeTruthy()
    expect(site.menu?.length).toBeGreaterThan(0)
    expect(site.page_copy).toBeTruthy()
    expect(homepageSettings.proof_heading?.trim()).toBeTruthy()
    expect(homepageSettings.featured_work_heading?.trim()).toBeTruthy()
    expect(homepageSettings.flagship_label?.trim()).toBeTruthy()
    expect(experiencePage.title?.trim()).toBeTruthy()
    expect(experiencePage.seo_description?.trim()).toBeTruthy()

    expect(mapped.experience.length).toBeGreaterThan(0)
    expect(mapped.projects.length).toBeGreaterThan(0)
    expect(mapped.products.length).toBeGreaterThan(0)

    const featuredSlugs = homepageFeaturedSlugs(homepageSettings)
    const spotlightSlugs = homepageSpotlightSlugs(homepageSettings)
    const previewKeys = homepageExperienceKeys(homepageSettings)
    const proofKeys = homepageProofKeys(homepageSettings)

    expect(featuredSlugs.length).toBeGreaterThan(0)
    expect(spotlightSlugs.length).toBeGreaterThan(0)
    expect(previewKeys.length).toBeGreaterThan(0)
    expect(proofKeys.length).toBeGreaterThan(0)

    const projectSlugs = new Set(mapped.projects.map(p => p.slug))
    const productSlugs = new Set(mapped.products.map(p => p.slug))
    const experienceKeys = new Set(mapped.experience.map(e => e.id))

    for (const slug of featuredSlugs) {
      expect(projectSlugs.has(slug)).toBe(true)
    }
    for (const slug of spotlightSlugs) {
      expect(productSlugs.has(slug)).toBe(true)
    }
    for (const key of previewKeys) {
      expect(experienceKeys.has(key)).toBe(true)
    }

    // Products catalog must not overlap project case slugs.
    for (const product of mapped.products) {
      expect(projectSlugs.has(product.slug)).toBe(false)
      expect(product.logo).toBeTruthy()
    }

    const claimKeySet = new Set(mapped.claims.map(c => c.key))
    for (const key of proofKeys) {
      expect(claimKeySet.has(key)).toBe(true)
    }

    const serialized = JSON.stringify(mapped)
    expect(serialized).not.toMatch(/evidence_origin|evidence_note|confidentiality_notes|private_evidence/)

    expect(mapped.homepage.navItems.length).toBeGreaterThan(0)
    expect(mapped.homepage.proof.length).toBeGreaterThan(1)
    expect(mapped.homepage.proofHeading).toBe(homepageSettings.proof_heading)
    expect(mapped.homepage.featuredWorkHeading).toBe(homepageSettings.featured_work_heading)
    expect(mapped.homepage.flagshipLabel).toBe(homepageSettings.flagship_label)
    expect(mapped.homepage.featuredCases.length).toBe(featuredSlugs.length)
    expect(mapped.homepage.featuredCases[0]?.featured).toBe(true)
    expect(mapped.homepage.products.items.length).toBe(spotlightSlugs.length)
    expect(mapped.homepage.siteName).toBe(site.site_name)
    expect(mapped.products.length).toBe(productSlugs.size)
    expect(mapped.experiencePage.title).toBe(experiencePage.title)
  }, 60_000)
})
