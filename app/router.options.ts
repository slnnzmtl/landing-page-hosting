import type { RouterConfig } from '@nuxt/schema'

function hashScroll(hash: string) {
  return {
    el: hash,
    behavior: 'smooth' as const,
    top: 0,
  }
}

export default <RouterConfig>{
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      const sameDocument = to.path === from.path
      if (sameDocument) {
        return hashScroll(to.hash)
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(hashScroll(to.hash))
        }, 50)
      })
    }
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0, left: 0, behavior: 'smooth' }
  },
}
