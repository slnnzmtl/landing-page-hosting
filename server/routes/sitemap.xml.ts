import { setHeader } from 'h3'
import { buildSitemapXml, resolveSiteUrl } from '../../utils/seo'
import { resolveDirectusConfig } from '~/utils/cms/client'
import { fetchCaseSlugs, fetchProductSlugs } from '~/utils/cms/load'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const cms = resolveDirectusConfig(config)
  const [productSlugs, caseSlugs] = await Promise.all([
    fetchProductSlugs(cms),
    fetchCaseSlugs(cms),
  ])
  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return buildSitemapXml(
    resolveSiteUrl(config.public.siteUrl as string),
    undefined,
    productSlugs,
    caseSlugs,
  )
})
