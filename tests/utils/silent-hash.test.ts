import { describe, expect, it } from 'vitest'
import {
  isSilentAnchorSyncPaused,
  pageHash,
  pauseSilentAnchorSync,
  scrollHomeToTop,
  setPageHash,
} from '~/utils/silent-hash'

describe('silent homepage hash', () => {
  it('pauses scroll-spy updates during programmatic hash scrolling', () => {
    pauseSilentAnchorSync(50)
    expect(isSilentAnchorSyncPaused()).toBe(true)
  })

  it('clears #contact and pauses the spy so Work can scroll to the top', () => {
    setPageHash('#contact')
    scrollHomeToTop()
    expect(pageHash.value).toBe('')
    expect(window.location.hash).toBe('')
    expect(isSilentAnchorSyncPaused()).toBe(true)
  })
})
