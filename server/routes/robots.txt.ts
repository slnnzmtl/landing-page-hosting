import { setHeader } from 'h3'
import { buildRobotsTxt, resolveSiteUrl } from '../../utils/seo'

export default defineEventHandler((event) => {
  const config = useRuntimeConfig()
  setHeader(event, 'content-type', 'text/plain; charset=utf-8')
  return buildRobotsTxt(resolveSiteUrl(config.public.siteUrl as string))
})
