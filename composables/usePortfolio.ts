import type { PortfolioContent } from '~/utils/cms/map'

export type PortfolioPayload = Pick<
  PortfolioContent,
  'homepage' | 'experience' | 'products' | 'professionalTenure' | 'experiencePage'
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

/** Fail closed when portfolio async data is missing or errored. */
export async function requirePortfolio() {
  const result = await usePortfolio()
  if (result.error.value) {
    throw createError({
      statusCode: 500,
      statusMessage: result.error.value.message || 'Failed to load portfolio content',
    })
  }
  if (!result.data.value) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Portfolio content missing',
    })
  }
  return result.data.value
}
