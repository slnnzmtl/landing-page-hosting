import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import {
  activeSection,
  isSilentAnchorSyncPaused,
  pauseSilentAnchorSync,
  scrollHomeToTop,
  scrollToAnchor,
  setActiveSection,
} from '~/utils/silent-hash'

describe('silent homepage hash', () => {
  beforeEach(() => {
    setActiveSection('')
    window.history.replaceState(null, '', '/')
    document.body.innerHTML = ''
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('pauses scroll-spy updates during programmatic hash scrolling', () => {
    pauseSilentAnchorSync(50)
    expect(isSilentAnchorSyncPaused()).toBe(true)
  })

  it('clears activeSection and pauses the spy so Work can scroll to the top without mutating location', async () => {
    setActiveSection('#contact')
    window.history.replaceState(null, '', '/#contact')
    const replace = vi.fn()
    await scrollHomeToTop({
      currentHash: '#contact',
      replace,
    })
    expect(activeSection.value).toBe('')
    expect(window.location.hash).toBe('#contact')
    expect(replace).toHaveBeenCalledWith({ path: '/', hash: '' })
    expect(isSilentAnchorSyncPaused()).toBe(true)
  })

  it('scrolls to an anchor even when the router still thinks the hash is #contact', async () => {
    const target = document.createElement('div')
    target.id = 'featured-work'
    target.scrollIntoView = vi.fn()
    document.body.appendChild(target)

    const replace = vi.fn()
    const ok = await scrollToAnchor('#featured-work', {
      path: '/',
      currentPath: '/',
      currentHash: '#contact',
      replace,
    })

    expect(ok).toBe(true)
    expect(target.scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    })
    expect(replace).toHaveBeenCalledWith({ path: '/', hash: '#featured-work' })
    expect(activeSection.value).toBe('')
    expect(isSilentAnchorSyncPaused()).toBe(true)
  })

  it('still scrolls on a same-hash click without calling replace', async () => {
    const target = document.createElement('div')
    target.id = 'contact'
    target.scrollIntoView = vi.fn()
    document.body.appendChild(target)

    const replace = vi.fn()
    const ok = await scrollToAnchor('#contact', {
      path: '/',
      currentPath: '/',
      currentHash: '#contact',
      replace,
    })

    expect(ok).toBe(true)
    expect(target.scrollIntoView).toHaveBeenCalled()
    expect(replace).not.toHaveBeenCalled()
    expect(activeSection.value).toBe('#contact')
  })

  it('does not write the address bar when setting activeSection', () => {
    window.history.replaceState(null, '', '/#featured-work')
    setActiveSection('#contact')
    expect(activeSection.value).toBe('#contact')
    expect(window.location.hash).toBe('#featured-work')
  })
})
