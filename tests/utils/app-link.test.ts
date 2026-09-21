import { describe, expect, it } from 'vitest'
import { hashElementId, isNavItemActive, parseAppLink } from '~/utils/app-link'

describe('parseAppLink', () => {
  it('keeps a plain path', () => {
    expect(parseAppLink('/products')).toEqual({ path: '/products', hash: '' })
  })

  it('splits a root hash used by back-to-homepage sections', () => {
    expect(parseAppLink('/#featured-work')).toEqual({
      path: '/',
      hash: '#featured-work',
    })
  })

  it('splits an experience role anchor', () => {
    expect(parseAppLink('/experience#upwork-reputation-team')).toEqual({
      path: '/experience',
      hash: '#upwork-reputation-team',
    })
  })
})

describe('hashElementId', () => {
  it('strips the leading hash', () => {
    expect(hashElementId('#featured-work')).toBe('featured-work')
  })
})

describe('isNavItemActive', () => {
  it('keeps Work current on / until #contact is in the hash', () => {
    expect(isNavItemActive('/', '/', '')).toBe(true)
    expect(isNavItemActive('/', '/', '#contact')).toBe(false)
    expect(isNavItemActive('/#contact', '/', '#contact')).toBe(true)
    expect(isNavItemActive('/#contact', '/', '')).toBe(false)
  })

  it('matches other routes by path, including nested product pages', () => {
    expect(isNavItemActive('/experience', '/experience', '')).toBe(true)
    expect(isNavItemActive('/experience', '/', '')).toBe(false)
    expect(isNavItemActive('/products', '/products', '')).toBe(true)
    expect(isNavItemActive('/products', '/products/rekordbox-playlist-converter', '')).toBe(true)
    expect(isNavItemActive('/', '/experience', '')).toBe(false)
  })
})
