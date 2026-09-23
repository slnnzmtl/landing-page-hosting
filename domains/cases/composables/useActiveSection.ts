import { onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue'

/**
 * Track which section id is currently in view.
 * Prefers the last section whose top has crossed a sticky-nav offset.
 */
export function useActiveSection(
  sectionIds: Ref<string[]> | (() => string[]),
  options: {
    /** Distance from viewport top used as the “reading line”. */
    offsetPx?: number
  } = {},
) {
  const activeId = ref<string | null>(null)
  const offsetPx = options.offsetPx ?? 120

  function resolveIds(): string[] {
    return typeof sectionIds === 'function' ? sectionIds() : sectionIds.value
  }

  function updateActive() {
    if (!import.meta.client) return
    const ids = resolveIds()
    if (!ids.length) {
      activeId.value = null
      return
    }

    const line = offsetPx
    let current: string | null = ids[0] ?? null

    for (const id of ids) {
      const el = document.getElementById(id)
      if (!el) continue
      const top = el.getBoundingClientRect().top
      if (top - line <= 0) {
        current = id
      }
    }

    activeId.value = current
  }

  function onScroll() {
    updateActive()
  }

  onMounted(() => {
    updateActive()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
  })

  if (typeof sectionIds !== 'function') {
    watch(sectionIds, () => {
      updateActive()
    }, { deep: true })
  }

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onScroll)
  })

  return { activeId, refresh: updateActive }
}
