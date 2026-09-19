import type { RouterConfig } from '@nuxt/schema'
import { isPopstateNavigation } from '~/utils/navigation-popstate'

function hashScroll(hash: string, behavior: ScrollBehavior = 'smooth') {
  return {
    el: hash,
    behavior,
    top: 0,
  }
}

export default <RouterConfig>{
  scrollBehavior(to, from, savedPosition) {
    const instant = isPopstateNavigation()

    // Back/forward should restore the previous viewport immediately.
    // Hash routes must not jump to top first — that is the back-nav flash.
    if (instant && savedPosition) {
      return { left: savedPosition.left, top: savedPosition.top, behavior: 'auto' }
    }

    if (to.hash) {
      const sameDocument = to.path === from.path
      const behavior = instant ? 'auto' : 'smooth'
      if (sameDocument) {
        return hashScroll(to.hash, behavior)
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(hashScroll(to.hash, behavior))
        }, 320)
      })
    }
    if (savedPosition) {
      return { left: savedPosition.left, top: savedPosition.top, behavior: 'auto' }
    }
    return { top: 0, left: 0, behavior: instant ? 'auto' : 'smooth' }
  },
}
