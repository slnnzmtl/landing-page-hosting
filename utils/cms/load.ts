import { existsSync } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'
import { basename, dirname, join } from 'node:path'
import {
  directusGet,
  resolveDirectusConfig,
  type DirectusClientConfig,
} from './client'
import {
  BUILD_CLAIM_FIELDS,
  EXPERIENCE_FIELDS,
  EXPERIENCE_PAGE_FIELDS,
  FILE_FIELDS,
  HOMEPAGE_SETTINGS_FIELDS,
  PRODUCT_FIELDS,
  PROJECT_FIELDS,
  SITE_FIELDS,
} from './fields'
import {
  homepageExperienceKeys,
  homepageFeaturedSlugs,
  homepageProofKeys,
  homepageSpotlightSlugs,
  mapPortfolio,
  publicPathForFile,
  type PortfolioContent,
} from './map'
import type {
  CmsApprovedClaim,
  CmsExperienceEntry,
  CmsExperiencePageSettings,
  CmsHomepageSettings,
  CmsPortfolioRaw,
  CmsProduct,
  CmsProject,
  CmsSiteSettings,
  CmsFile,
} from './types'

let portfolioPromise: Promise<PortfolioContent> | null = null

async function claimsByKeys(
  config: DirectusClientConfig,
  keys: string[],
): Promise<CmsApprovedClaim[]> {
  if (!keys.length) return []
  const unique = [...new Set(keys.filter(Boolean))]
  const encoded = unique.map(encodeURIComponent).join(',')
  return directusGet<CmsApprovedClaim[]>(
    config,
    `/items/approved_claims`
    + `?filter[status][_eq]=published`
    + `&filter[key][_in]=${encoded}`
    + `&fields=${BUILD_CLAIM_FIELDS}`
    + `&limit=-1`,
  )
}

function requireHomepageKeys(list: string[], label: string): string[] {
  if (!list.length) throw new Error(`homepage_settings.${label} is required`)
  return list
}

async function fetchPortfolioRaw(
  config: DirectusClientConfig,
): Promise<CmsPortfolioRaw> {
  const [site, homepageSettings, experiencePage, experience, projects, products, files]
    = await Promise.all([
      directusGet<CmsSiteSettings>(
        config,
        `/items/site_settings?fields=${SITE_FIELDS}`,
      ),
      directusGet<CmsHomepageSettings>(
        config,
        `/items/homepage_settings?fields=${HOMEPAGE_SETTINGS_FIELDS}`,
      ),
      directusGet<CmsExperiencePageSettings>(
        config,
        `/items/experience_page_settings?fields=${EXPERIENCE_PAGE_FIELDS}`,
      ),
      directusGet<CmsExperienceEntry[]>(
        config,
        `/items/experience_entries`
        + `?filter[status][_eq]=published`
        + `&fields=${EXPERIENCE_FIELDS}`
        + `&sort=sort`
        + `&limit=-1`,
      ),
      directusGet<CmsProject[]>(
        config,
        `/items/projects`
        + `?filter[status][_eq]=published`
        + `&fields=${PROJECT_FIELDS}`
        + `&sort=sort`
        + `&limit=-1`,
      ),
      directusGet<CmsProduct[]>(
        config,
        `/items/products`
        + `?filter[status][_eq]=published`
        + `&fields=${PRODUCT_FIELDS}`
        + `&sort=sort`
        + `&limit=-1`,
      ),
      directusGet<CmsFile[]>(
        config,
        `/files?fields=${FILE_FIELDS}&limit=-1`,
      ),
    ])

  if (site.status !== 'published') {
    throw new Error('site_settings not published')
  }
  if (homepageSettings.status !== 'published') {
    throw new Error('homepage_settings not published')
  }
  if (experiencePage.status !== 'published') {
    throw new Error('experience_page_settings not published')
  }

  // Fail closed early if M2M lists are empty (Directus may return null/[]).
  requireHomepageKeys(homepageFeaturedSlugs(homepageSettings), 'featured_projects')
  requireHomepageKeys(homepageExperienceKeys(homepageSettings), 'experience_preview')
  requireHomepageKeys(homepageSpotlightSlugs(homepageSettings), 'product_spotlights')
  const proofKeys = requireHomepageKeys(
    homepageProofKeys(homepageSettings),
    'proof_claims',
  )

  const outcomeClaimKeys = experience.flatMap(entry =>
    (entry.outcomes || []).map(o => o.claim_id).filter(Boolean),
  )
  const claims = await claimsByKeys(config, [...outcomeClaimKeys, ...proofKeys])

  await materializeCmsFiles(config, files)

  return {
    site,
    homepageSettings,
    experiencePage,
    experience,
    projects,
    products,
    claims,
    files,
  }
}

/** Committed files in public/ — never overwrite from Directus titles. */
const COMMITTED_PUBLIC_FILES = new Set(['u.js'])

/**
 * Write Directus files into `public/` so Vite/Nuxt serve them in dev and generate.
 * Extra `nitro.publicAssets` dirs are not served by the Vite dev server.
 */
async function materializeCmsFiles(
  config: DirectusClientConfig,
  files: CmsFile[],
): Promise<void> {
  const root = join(process.cwd(), 'public')
  for (const file of files) {
    const pub = publicPathForFile(file)
    if (COMMITTED_PUBLIC_FILES.has(basename(pub))) continue
    const dest = join(root, pub.replace(/^\//, ''))
    if (existsSync(dest)) continue
    await mkdir(dirname(dest), { recursive: true })
    const res = await fetch(`${config.baseUrl}/assets/${file.id}`, {
      headers: { Authorization: `Bearer ${config.token}` },
    })
    if (!res.ok) {
      const body = await res.text()
      throw new Error(`Directus ${res.status} /assets/${file.id} (${pub}): ${body}`)
    }
    await writeFile(dest, Buffer.from(await res.arrayBuffer()))
  }
}

export async function loadPortfolio(
  config?: DirectusClientConfig,
): Promise<PortfolioContent> {
  if (!portfolioPromise) {
    portfolioPromise = (async () => {
      const resolved = config || resolveDirectusConfig()
      const raw = await fetchPortfolioRaw(resolved)
      return mapPortfolio(raw, resolved)
    })()
  }
  return portfolioPromise
}

/** Clear memoization (tests / verify script). */
export function resetPortfolioCache(): void {
  portfolioPromise = null
}

export async function fetchProductSlugs(
  config?: DirectusClientConfig,
): Promise<string[]> {
  const resolved = config || resolveDirectusConfig()
  const products = await directusGet<Array<{ slug: string }>>(
    resolved,
    `/items/products`
    + `?filter[status][_eq]=published`
    + `&fields=slug`
    + `&sort=sort`
    + `&limit=-1`,
  )
  return products.map(p => p.slug)
}
