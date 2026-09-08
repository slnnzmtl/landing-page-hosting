import { describe, it, expect } from 'vitest'
import { isInertWebhookUrl, resolveSurveyWebhookUrl } from '~/utils/survey-webhook'

describe('isInertWebhookUrl', () => {
  it('treats empty and invalid values as inert', () => {
    expect(isInertWebhookUrl(undefined)).toBe(true)
    expect(isInertWebhookUrl('')).toBe(true)
    expect(isInertWebhookUrl('  ')).toBe(true)
    expect(isInertWebhookUrl('not-a-url')).toBe(true)
  })

  it('treats example hosts as inert', () => {
    expect(isInertWebhookUrl('https://example.com/webhook/survey/submit')).toBe(true)
    expect(isInertWebhookUrl('https://www.example.com/hook')).toBe(true)
    expect(isInertWebhookUrl('https://example.org/webhook')).toBe(true)
  })

  it('does not treat real hosts as inert', () => {
    expect(isInertWebhookUrl('https://hooks.example-company.test/survey')).toBe(false)
  })
})

describe('resolveSurveyWebhookUrl', () => {
  it('prefers a configured environment URL', () => {
    expect(resolveSurveyWebhookUrl(
      'https://example.com/webhook/survey/submit',
      'https://hooks.internal.test/survey/submit',
    )).toBe('https://hooks.internal.test/survey/submit')
  })

  it('returns empty when only an inert JSON action is present', () => {
    expect(resolveSurveyWebhookUrl('https://example.com/webhook/survey/submit')).toBe('')
  })

  it('uses a non-inert JSON action when env is unset', () => {
    expect(resolveSurveyWebhookUrl('https://hooks.internal.test/survey')).toBe(
      'https://hooks.internal.test/survey',
    )
  })
})
