import type { RouterConfig } from '@nuxt/schema'

export default <RouterConfig>{
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            el: to.hash,
            behavior: 'smooth',
            top: 0,
          })
        }, 50)
      })
    }
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0, left: 0, behavior: 'smooth' }
  },
}
