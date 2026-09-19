import { describe, it, expect, vi, afterEach } from 'vitest'
import { trackUmami } from '~/utils/track-umami'

describe('trackUmami', () => {
  afterEach(() => {
    delete window.umami
  })

  it('calls window.umami.track when available', () => {
    const track = vi.fn()
    window.umami = { track }
    trackUmami('product-open', { action: 'download' })
    expect(track).toHaveBeenCalledWith('product-open', { action: 'download' })
  })

  it('no-ops when umami is not loaded', () => {
    expect(() => trackUmami('product-open')).not.toThrow()
  })
})
