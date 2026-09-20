import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchProductSlugs, resetPortfolioCache } from '~/utils/cms/load'

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
