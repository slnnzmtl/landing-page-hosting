import { describe, expect, it } from 'vitest'
import { DEFAULT_DIRECTUS_URL, resolveDirectusConfig } from '~/utils/cms/client'

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
