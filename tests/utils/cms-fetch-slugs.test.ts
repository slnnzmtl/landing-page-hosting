import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  approvedClaimsQuery,
  fetchProductSlugs,
  fetchCaseSlugs,
  resetPortfolioCache,
} from '~/utils/cms/load'
import { HOMEPAGE_SETTINGS_FIELDS, PRODUCT_FIELDS, PROJECT_FIELDS } from '~/utils/cms/fields'

describe('approvedClaimsQuery', () => {
  it('filters by key only when refs are not UUIDs', () => {
    const path = approvedClaimsQuery([
      'homepage-proof-tenure-years',
      'upwork-reputation-team-outcome-1',
    ])
    expect(path).toContain('filter[key][_in]=')
    expect(path).not.toContain('filter[id]')
    expect(path).not.toContain('filter[_or]')
  })

  it('filters by id only when refs are UUIDs', () => {
    const path = approvedClaimsQuery(['aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee'])
    expect(path).toContain('filter[id][_in]=aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee')
    expect(path).not.toContain('filter[key]')
  })

  it('ors key and id filters without putting keys on uuid id', () => {
    const path = approvedClaimsQuery([
      'homepage-proof-users',
      'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
    ])
    expect(path).toContain('filter[_or][0][key][_in]=homepage-proof-users')
    expect(path).toContain('filter[_or][1][id][_in]=aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee')
    expect(path).not.toContain('filter[id][_in]=homepage-proof-users')
  })
})

describe('Directus nested field allowlists', () => {
  it('prefixes every button field so Directus does not treat them as root fields', () => {
    expect(PRODUCT_FIELDS).toContain('launch_ctas.buttons_id.href_source')
    expect(PRODUCT_FIELDS).not.toMatch(/buttons_id\.id,key,/)
    expect(HOMEPAGE_SETTINGS_FIELDS).toContain('primary_ctas.buttons_id.label')
    expect(HOMEPAGE_SETTINGS_FIELDS).toContain('experience_preview_cta.href_source')
    expect(HOMEPAGE_SETTINGS_FIELDS).not.toMatch(/buttons_id\.id,key,/)
  })

  it('prefixes case section and claim nested fields', () => {
    expect(PROJECT_FIELDS).toContain('case_sections.media.alt')
    expect(PROJECT_FIELDS).toContain('case_claims.approved_claims_id.public_wording')
    expect(PROJECT_FIELDS).not.toContain('confidentiality_notes')
  })
})

describe('fetchProductSlugs', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    resetPortfolioCache()
  })

  it('requests published product slugs sorted by sort', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        data: [{ slug: 'alpha' }, { slug: 'beta' }],
      }),
    })
    vi.stubGlobal('fetch', fetchMock)

    const slugs = await fetchProductSlugs({
      baseUrl: 'https://cms.example.test',
      token: 'test-token',
    })

    expect(slugs).toEqual(['alpha', 'beta'])
    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(url).toBe(
      'https://cms.example.test/items/products'
      + '?filter[status][_eq]=published'
      + '&fields=slug'
      + '&sort=sort'
      + '&limit=-1',
    )
    expect(init.headers).toEqual({ Authorization: 'Bearer test-token' })
  })
})

describe('fetchCaseSlugs', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    resetPortfolioCache()
  })

  it('requests published case-enabled project slugs', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        data: [{ slug: 'ai-appointment-crm-automation' }],
      }),
    })
    vi.stubGlobal('fetch', fetchMock)

    const slugs = await fetchCaseSlugs({
      baseUrl: 'https://cms.example.test',
      token: 'test-token',
    })

    expect(slugs).toEqual(['ai-appointment-crm-automation'])
    const [url] = fetchMock.mock.calls[0] as [string]
    expect(url).toContain('/items/projects')
    expect(url).toContain('filter[status][_eq]=published')
    expect(url).toContain('filter[case_enabled][_eq]=true')
    expect(url).toContain('fields=slug')
  })
})
