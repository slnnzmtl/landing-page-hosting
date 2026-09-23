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
    const { homepage, experience, products, cases, experiencePage, productSlugs, caseSlugs } = mapped

    expect(homepage.person.name.trim()).toBeTruthy()
    expect(homepage.siteName.trim()).toBeTruthy()
    expect(homepage.navItems.length).toBeGreaterThan(0)
    expect(homepage.proofHeading.trim()).toBeTruthy()
    expect(homepage.featuredWorkHeading.trim()).toBeTruthy()
    expect(homepage.flagshipLabel.trim()).toBeTruthy()
    expect(homepage.pageCopy.products_index.title.trim()).toBeTruthy()
    expect(homepage.pageCopy.products_index.spotlight_cta.trim()).toBeTruthy()
    expect(experiencePage.title.trim()).toBeTruthy()
    expect(experiencePage.seo_description.trim()).toBeTruthy()

    expect(experience.length).toBeGreaterThan(0)
    expect(homepage.featuredCases.length).toBeGreaterThan(0)
    expect(products.length).toBeGreaterThan(0)
    expect(homepage.proof.length).toBeGreaterThan(0)

    const featuredSlugs = homepage.featuredCases.map(item => item.slug)
    const spotlightSlugs = homepage.products.items.map(item => item.slug)
    const previewKeys = homepage.experiencePreview.items.map(item => item.id)
    const experienceKeys = new Set(experience.map(role => role.id))
    const productSlugSet = new Set(productSlugs)
    const caseSlugSet = new Set(caseSlugs)

    expect(featuredSlugs).toHaveLength(homepage.featuredCases.length)
    expect(spotlightSlugs.length).toBeGreaterThan(0)
    expect(previewKeys.length).toBeGreaterThan(0)

    for (const key of previewKeys) {
      expect(experienceKeys.has(key)).toBe(true)
    }
    for (const slug of spotlightSlugs) {
      expect(productSlugSet.has(slug)).toBe(true)
    }

    for (const product of products) {
      expect(featuredSlugs.includes(product.slug)).toBe(false)
      expect(product.logo).toBeTruthy()
    }

    const appointmentCase = cases.find(item => item.slug === 'ai-appointment-crm-automation')
    if (appointmentCase) {
      expect(caseSlugSet.has(appointmentCase.slug)).toBe(true)
      expect(appointmentCase.sections.length).toBeGreaterThanOrEqual(8)
      expect(appointmentCase.caseLeadParagraphs.length).toBeGreaterThan(0)
      expect(appointmentCase.heroMedia).toBeUndefined()
    }

    for (const item of homepage.featuredCases) {
      if (caseSlugSet.has(item.slug)) {
        expect(item.href).toBe(`/work/${item.slug}`)
      }
    }

    const serialized = JSON.stringify(mapped)
    expect(serialized).not.toMatch(/evidence_origin|evidence_note|confidentiality_notes|private_evidence/)

    expect(homepage.featuredCases[0]?.featured).toBe(true)
    expect(homepage.products.items.length).toBe(spotlightSlugs.length)
    expect(products.length).toBe(productSlugSet.size)
    expect(mapped.experiencePage.title).toBe(experiencePage.title)
  }, 60_000)
})
