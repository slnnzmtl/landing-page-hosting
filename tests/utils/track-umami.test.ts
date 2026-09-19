import { describe, it, expect, vi, afterEach } from 'vitest'
import { trackUmami } from '~/utils/track-umami'

describe('trackUmami', () => {
  afterEach(() => {
    delete window.umami
  })

  it('calls window.umami.track when available', () => {
    const track = vi.fn()
    window.umami = { track }
    trackUmami('Rekordbox Converter Download')
    expect(track).toHaveBeenCalledWith('Rekordbox Converter Download')
  })

  it('no-ops when umami is not loaded', () => {
    expect(() => trackUmami('Rekordbox Converter Download')).not.toThrow()
  })
})
