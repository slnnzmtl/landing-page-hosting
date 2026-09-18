import { resolveSiteUrl, seoHead, type PageSeo } from '../utils/seo'

export function usePageSeo(page: PageSeo) {
  const config = useRuntimeConfig()
  const siteUrl = resolveSiteUrl(config.public.siteUrl as string)
  useHead(seoHead(siteUrl, page))
}
