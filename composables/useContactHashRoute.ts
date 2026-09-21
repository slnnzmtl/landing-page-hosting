import { onMounted, onUnmounted } from 'vue'
import { selectContactHash } from '~/utils/select-contact-hash'
import {
  isSilentAnchorSyncPaused,
  pageHash,
  setPageHash,
} from '~/utils/silent-hash'

const CONTACT_ID = 'contact'

/**
 * Keep `/` vs `/#contact` aligned with the section in view, without scrolling
 * or pushing history. Clicks that already change the hash still scroll normally.
 */
export function useContactHashRoute() {
  let ticking = false

  function syncHashFromScroll() {
    if (!import.meta.client) return
    if (isSilentAnchorSyncPaused()) return

    const el = document.getElementById(CONTACT_ID)
    if (!el) return

    const rect = el.getBoundingClientRect()
    const nextHash = selectContactHash({
      top: rect.top + window.scrollY,
      bottom: rect.bottom + window.scrollY,
      scrollY: window.scrollY,
      viewportHeight: window.innerHeight,
      documentHeight: document.documentElement.scrollHeight,
      contactActive: pageHash.value === '#contact',
    })
    if (pageHash.value === nextHash && window.location.hash === nextHash) return
    setPageHash(nextHash)
  }

  function onScroll() {
    if (ticking) return
    ticking = true
    requestAnimationFrame(() => {
      ticking = false
      syncHashFromScroll()
    })
  }

  onMounted(() => {
    window.addEventListener('scroll', onScroll, { passive: true })
    syncHashFromScroll()
  })

  onUnmounted(() => {
    if (!import.meta.client) return
    window.removeEventListener('scroll', onScroll)
  })
}
