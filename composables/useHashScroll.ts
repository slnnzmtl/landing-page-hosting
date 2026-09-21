import { onMounted, watch } from 'vue'
import { hashElementId } from '~/utils/app-link'
import { isPopstateNavigation } from '~/utils/navigation-popstate'
import { pauseSilentAnchorSync } from '~/utils/silent-hash'

const MAX_ATTEMPTS = 16
const RETRY_MS = 50

/**
 * Scroll to `route.hash` after the page transition has mounted the target.
 * Vue Router's delayed scroll often runs during `out-in` leave, before the
 * new page exists — that is the cross-route "flash" to the top.
 */
export function useHashScroll() {
  const route = useRoute()

  function scrollToHash() {
    if (!import.meta.client) return
    if (isPopstateNavigation()) return
    const id = hashElementId(route.hash)
    if (!id) return

    const scroll = () => {
      const target = document.getElementById(id)
      if (!target) return false
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      pauseSilentAnchorSync()
      return true
    }

    if (scroll()) return

    let attempts = 0
    const retry = () => {
      attempts += 1
      if (scroll() || attempts >= MAX_ATTEMPTS) return
      window.setTimeout(retry, RETRY_MS)
    }
    window.setTimeout(retry, RETRY_MS)
  }

  onMounted(scrollToHash)
  watch(() => [route.path, route.hash] as const, scrollToHash)
}
