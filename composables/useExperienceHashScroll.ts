/** Scroll to a role anchor on `/experience` after navigation or hash changes. */
export function useExperienceHashScroll() {
  const route = useRoute()

  function scrollToRoleAnchor() {
    if (!import.meta.client) return
    const id = route.hash.replace(/^#/, '')
    if (!id) return

    const scroll = () => {
      const target = document.getElementById(id)
      if (!target) return false
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
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

  onMounted(scrollToRoleAnchor)
  watch(() => route.hash, scrollToRoleAnchor)
}
