import {
  clearPopstateNavigationAfterPaint,
  isPopstateNavigation,
  markPopstatePending,
} from '~/utils/navigation-popstate'

export default defineNuxtPlugin(() => {
  const router = useRouter()

  if (import.meta.client) {
    window.addEventListener('popstate', () => {
      markPopstatePending()
    })
  }

  router.beforeEach((to, from) => {
    if (!isPopstateNavigation()) return
    to.meta.pageTransition = false
    to.meta.layoutTransition = false
    from.meta.pageTransition = false
    from.meta.layoutTransition = false
  })

  router.afterEach(() => {
    clearPopstateNavigationAfterPaint()
  })
})
