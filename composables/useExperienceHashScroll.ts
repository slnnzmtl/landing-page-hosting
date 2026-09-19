import { isPopstateNavigation } from '~/utils/navigation-popstate'

/** Scroll to a role anchor on `/experience` after navigation or hash changes. */
export function useExperienceHashScroll() {
  const route = useRoute()

  function scrollToRoleAnchor() {
    if (!import.meta.client) return
    const id = route.hash.replace(/^#/, '')
    if (!id) return

    const behavior: ScrollBehavior = isPopstateNavigation() ? 'auto' : 'smooth'

    const scroll = () => {
      const target = document.getElementById(id)
      if (!target) return false
      target.scrollIntoView({ behavior, block: 'start' })
      return true
    }

    nextTick(() => {
      if (scroll()) return
      requestAnimationFrame(() => {
        if (scroll()) return
        window.setTimeout(scroll, 150)
      })
    })
  }

  onMounted(() => {
    if (isPopstateNavigation()) return
    scrollToRoleAnchor()
  })
  watch(() => route.hash, () => {
    if (isPopstateNavigation()) return
    scrollToRoleAnchor()
  })
}
