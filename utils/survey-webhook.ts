const INERT_WEBHOOK_HOSTS = new Set([
  'example.com',
  'example.org',
  'example.net',
  'www.example.com',
])

export function isInertWebhookUrl(url: string | undefined): boolean {
  const trimmed = url?.trim() ?? ''
  if (!trimmed) return true

  try {
    const { hostname } = new URL(trimmed)
    return INERT_WEBHOOK_HOSTS.has(hostname)
  }
  catch {
    return true
  }
}

/**
 * Prefer a runtime/env webhook. JSON `action` values are only used when they
 * are not inert placeholders (example.com and empty).
 */
export function resolveSurveyWebhookUrl(
  surveyAction: string | undefined,
  envWebhookUrl?: string,
): string {
  const fromEnv = envWebhookUrl?.trim()
  if (fromEnv) return fromEnv

  const fromSurvey = surveyAction?.trim() ?? ''
  if (isInertWebhookUrl(fromSurvey)) return ''

  return fromSurvey
}
