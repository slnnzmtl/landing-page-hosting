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

    if (to.hash) {
      const sameDocument = to.path === from.path
      const behavior = instant ? 'auto' : 'smooth'
      if (sameDocument) {
        return hashScroll(to.hash, behavior)
      }
      if (to.path === '/experience') {
        // Role anchors mount on the experience page; it scrolls after hydration.
        return { top: 0, left: 0 }
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(hashScroll(to.hash, behavior))
        }, 150)
      })
    }
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0, left: 0, behavior: instant ? 'auto' : 'smooth' }
  },
}
