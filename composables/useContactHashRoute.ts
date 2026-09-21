import { onMounted, onUnmounted } from 'vue'
import { selectContactHash } from '~/utils/select-contact-hash'
import {
  activeSection,
  isSilentAnchorSyncPaused,
  setActiveSection,
} from '~/utils/silent-hash'

const CONTACT_ID = 'contact'

/**
 * Keep Contact vs Work nav highlight aligned with the section in view.
 * Does not touch the address bar — Vue Router owns the URL.
 */
export function useContactHashRoute() {
  let ticking = false

  function syncSectionFromScroll() {
    if (!import.meta.client) return
    if (isSilentAnchorSyncPaused()) return

    const el = document.getElementById(CONTACT_ID)
    if (!el) return

    const rect = el.getBoundingClientRect()
    const next = selectContactHash({
      top: rect.top + window.scrollY,
      bottom: rect.bottom + window.scrollY,
      scrollY: window.scrollY,
      viewportHeight: window.innerHeight,
      documentHeight: document.documentElement.scrollHeight,
      contactActive: activeSection.value === '#contact',
    })
    if (activeSection.value === next) return
    setActiveSection(next)
  }

  function onScroll() {
    if (ticking) return
    ticking = true
    requestAnimationFrame(() => {
      ticking = false
      syncSectionFromScroll()
    })
  }

  onMounted(() => {
    window.addEventListener('scroll', onScroll, { passive: true })
    syncSectionFromScroll()
  })

  onUnmounted(() => {
    if (!import.meta.client) return
    window.removeEventListener('scroll', onScroll)
  })
}
