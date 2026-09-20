import type { PortfolioContent } from '~/utils/cms/map'

export type PortfolioPayload = Pick<
  PortfolioContent,
  'homepage' | 'experience' | 'products' | 'professionalTenure' | 'productSlugs'
>

/**
 * Shared SSG payload from Directus. Fetched once per generate via /api/portfolio.
 * Payload is baked into HTML; the browser never talks to Directus.
 */
export function usePortfolio() {
  return useAsyncData<PortfolioPayload>(
    'portfolio',
    () => $fetch('/api/portfolio'),
    { server: true },
  )
}
