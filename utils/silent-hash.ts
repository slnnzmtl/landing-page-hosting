import { ref } from 'vue'

let spyPausedUntil = 0

/** Ignore scroll-spy updates while a click/hash navigation is still scrolling. */
export function pauseSilentAnchorSync(ms = 900): void {
  spyPausedUntil = Date.now() + ms
}

export function isSilentAnchorSyncPaused(): boolean {
  return Date.now() < spyPausedUntil
}

/** Address-bar hash written by scroll-spy; Vue Router is left alone so the page does not jump. */
export const pageHash = ref('')

export function setPageHash(hash: string): void {
  pageHash.value = hash
  if (typeof window === 'undefined') return
  const next = `${window.location.pathname}${window.location.search}${hash}`
  const current = `${window.location.pathname}${window.location.search}${window.location.hash}`
  if (next === current) return
  const x = window.scrollX
  const y = window.scrollY
  window.history.replaceState(window.history.state, '', next)
  if (window.scrollX !== x || window.scrollY !== y) {
    window.scrollTo(x, y)
  }
}

/** Work nav: same-route `/` does not run scrollBehavior, and the spy must not re-attach `#contact`. */
export function scrollHomeToTop(): void {
  pauseSilentAnchorSync(1200)
  setPageHash('')
  if (typeof window === 'undefined') return
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
