import { describe, expect, it } from 'vitest'
import { hashElementId, parseAppLink } from '~/utils/app-link'

describe('parseAppLink', () => {
  it('keeps a plain path', () => {
    expect(parseAppLink('/projects')).toEqual({ path: '/projects', hash: '' })
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
