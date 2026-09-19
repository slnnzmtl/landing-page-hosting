import { ref } from 'vue'

/** True while a browser back/forward (popstate) navigation is in flight. */
export const popstateNavigation = ref(false)

export function markPopstatePending(): void {
  popstateNavigation.value = true
}

export function isPopstateNavigation(): boolean {
  return popstateNavigation.value
}

export function clearPopstateNavigation(): void {
  popstateNavigation.value = false
}

/** Clear after the destination has painted so scrollBehavior can still read the flag. */
export function clearPopstateNavigationAfterPaint(): void {
  if (typeof window === 'undefined') {
    clearPopstateNavigation()
    return
  }
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      clearPopstateNavigation()
    })
  })
}
