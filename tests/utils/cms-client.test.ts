import { describe, expect, it } from 'vitest'
import {
  DEFAULT_DIRECTUS_URL,
  normalizeDirectusToken,
  resolveDirectusConfig,
  shouldFetchCmsPrerenderSlugs,
} from '~/utils/cms/client'

describe('normalizeDirectusToken', () => {
  it('trims whitespace and wrapping quotes', () => {
    expect(normalizeDirectusToken('  "abc" \n')).toBe('abc')
    expect(normalizeDirectusToken('\'abc\'')).toBe('abc')
    expect(normalizeDirectusToken(undefined)).toBe('')
  })
})

describe('shouldFetchCmsPrerenderSlugs', () => {
  const tokenEnv = { DIRECTUS_TOKEN: 'secret' }

  it('fetches during generate when a token is set', () => {
    expect(shouldFetchCmsPrerenderSlugs(tokenEnv, ['node', 'nuxt', 'generate'])).toBe(true)
  })

  it('skips nuxt prepare even when Vercel injects a token', () => {
    expect(shouldFetchCmsPrerenderSlugs(tokenEnv, ['node', 'nuxt', 'prepare'])).toBe(false)
    expect(shouldFetchCmsPrerenderSlugs(
      { ...tokenEnv, npm_lifecycle_event: 'postinstall' },
      ['node', 'nuxt', 'dev'],
    )).toBe(false)
  })

  it('skips Vitest and missing tokens', () => {
    expect(shouldFetchCmsPrerenderSlugs({ VITEST: '1', DIRECTUS_TOKEN: 'secret' }, ['node'])).toBe(false)
    expect(shouldFetchCmsPrerenderSlugs({}, ['node', 'nuxt', 'generate'])).toBe(false)
  })
})

describe('resolveDirectusConfig', () => {
  it('defaults the Directus origin when URL env is omitted', () => {
    expect(resolveDirectusConfig({ DIRECTUS_TOKEN: 'secret' })).toEqual({
      baseUrl: DEFAULT_DIRECTUS_URL,
      token: 'secret',
    })
  })

  it('still requires a server-only token', () => {
    expect(() => resolveDirectusConfig({})).toThrow(/DIRECTUS_TOKEN/)
  })

  it('prefers an explicit URL over the default', () => {
    expect(resolveDirectusConfig({
      DIRECTUS_URL: 'https://cms.example.test/',
      DIRECTUS_TOKEN: 'secret',
    })).toEqual({
      baseUrl: 'https://cms.example.test',
      token: 'secret',
    })
  })
})
