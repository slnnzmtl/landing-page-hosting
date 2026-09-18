import type { ConversionEventName } from '~/data/homepage'

export const CONVERSION_EVENT = 'kazansky:conversion'

export interface ConversionDetail {
  name: ConversionEventName
  props?: Record<string, string>
}

/**
 * Privacy-conscious conversion hook for contact and case-study CTAs.
 * Dispatches a window CustomEvent with event name and optional slug only — no PII.
 * A cookieless analytics provider can listen for CONVERSION_EVENT later.
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
}
