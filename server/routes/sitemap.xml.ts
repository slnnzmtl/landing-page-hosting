import { setHeader } from 'h3'
import { buildSitemapXml, resolveSiteUrl } from '../../utils/seo'
import { resolveDirectusConfig } from '~/utils/cms/client'
import { loadPortfolio } from '~/utils/cms/load'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const portfolio = await loadPortfolio(resolveDirectusConfig(config))
  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return buildSitemapXml(
    resolveSiteUrl(config.public.siteUrl as string),
    undefined,
    portfolio.productSlugs,
  )
})
