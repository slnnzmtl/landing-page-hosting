import { setHeader } from 'h3'
import { buildSitemapXml, resolveSiteUrl } from '../../domains/projects/utils/seo'

export default defineEventHandler((event) => {
  const config = useRuntimeConfig()
  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return buildSitemapXml(resolveSiteUrl(config.public.siteUrl as string))
})
