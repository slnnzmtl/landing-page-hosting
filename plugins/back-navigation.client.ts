import {
  clearPopstateNavigation,
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

  router.beforeEach((to) => {
    if (!isPopstateNavigation()) return
    to.meta.pageTransition = false
    to.meta.layoutTransition = false
  })

  router.afterEach(() => {
    clearPopstateNavigation()
  })
})
