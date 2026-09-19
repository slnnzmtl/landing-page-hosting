import { conversionEventName } from '~/data/homepage'
import { trackConversion } from '~/utils/track-conversion'

export function trackHomepageHref(
  href: string,
  options?: { featured?: boolean, product?: boolean, slug?: string },
): void {
  const name = conversionEventName(href, options)
  if (!name) return
  trackConversion(name, options?.slug ? { slug: options.slug } : undefined)
}
