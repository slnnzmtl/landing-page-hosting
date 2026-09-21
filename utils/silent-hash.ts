import { ref } from 'vue'
import { hashElementId } from '~/utils/app-link'

let spyPausedUntil = 0

/** Ignore scroll-spy updates while a click/hash navigation is still scrolling. */
export function pauseSilentAnchorSync(ms = 900): void {
  spyPausedUntil = Date.now() + ms
}

export function isSilentAnchorSyncPaused(): boolean {
  return Date.now() < spyPausedUntil
}

/** In-memory nav highlight only — never written to the address bar. */
export type ActiveSection = '#contact' | ''

export const activeSection = ref<ActiveSection>('')

export function setActiveSection(section: ActiveSection): void {
  activeSection.value = section
}

type ReplaceLocation = (to: { path: string, hash: string }) => Promise<unknown>

/**
 * Always scroll to an in-page anchor. Update the router hash only when it differs,
 * so same-hash clicks still work and the spy never desyncs Vue Router.
 */
export async function scrollToAnchor(
  hash: string,
  options: {
    path?: string
    currentPath: string
    currentHash: string
    replace: ReplaceLocation
  },
): Promise<boolean> {
  const normalized = hash.startsWith('#') ? hash : `#${hash}`
  const path = options.path ?? options.currentPath
  const id = hashElementId(normalized)
  if (!id || typeof document === 'undefined') return false

  const target = document.getElementById(id)
  if (!target) return false

  pauseSilentAnchorSync()
  setActiveSection(normalized === '#contact' ? '#contact' : '')
  target.scrollIntoView({ behavior: 'smooth', block: 'start' })

  if (options.currentPath !== path || options.currentHash !== normalized) {
    await options.replace({ path, hash: normalized })
  }
  return true
}

/** Work nav: scroll to top and clear the hash via the router when needed. */
export async function scrollHomeToTop(options?: {
  currentHash?: string
  replace?: ReplaceLocation
}): Promise<void> {
  pauseSilentAnchorSync(1200)
  setActiveSection('')
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  if (options?.currentHash && options.replace) {
    await options.replace({ path: '/', hash: '' })
  }
}
