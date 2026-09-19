import type { ConversionEventName } from '~/data/homepage'
import { trackUmami } from '~/utils/track-umami'

export const CONVERSION_EVENT = 'kazansky:conversion'

export interface ConversionDetail {
  name: ConversionEventName
  props?: Record<string, string>
}

/**
 * Privacy-conscious conversion hook for homepage CTAs.
 * Dispatches CONVERSION_EVENT for tests and forwards to Umami when loaded (slug only, no PII).
 */
export function trackConversion(
  name: ConversionEventName,
  props?: Record<string, string>,
): void {
  if (typeof window === 'undefined') return
  window.dispatchEvent(
    new CustomEvent<ConversionDetail>(CONVERSION_EVENT, {
      detail: { name, props },
    }),
  )
  trackUmami(name, props)
}
