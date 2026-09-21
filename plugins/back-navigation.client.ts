import {
  clearPopstateNavigationAfterPaint,
  markPopstatePending,
} from '~/utils/navigation-popstate'

export default defineNuxtPlugin(() => {
  const router = useRouter()

  if (import.meta.client) {
    // Capture so the flag is set before Vue Router handles popstate.
    // Do not toggle NuxtPage `transition` / route meta here: flipping
    // out-in off mid-navigation leaves RouterView with a null leave hook
    // (`Cannot read properties of null (reading 'next')`) and a blank page.
    window.addEventListener('popstate', () => {
      markPopstatePending()
    }, true)
  }

  router.afterEach(() => {
    clearPopstateNavigationAfterPaint()
  })
})
