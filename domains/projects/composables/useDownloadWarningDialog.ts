export function useDownloadWarningDialog() {
  const isOpen = ref(false)
  const pendingHref = ref<string | null>(null)

  function interceptClick(event: MouseEvent, href: string, enabled: boolean) {
    if (!enabled) return
    event.preventDefault()
    pendingHref.value = href
    isOpen.value = true
  }

  function close() {
    isOpen.value = false
  }

  function confirm() {
    const href = pendingHref.value
    isOpen.value = false
    if (href) window.open(href, '_blank', 'noopener,noreferrer')
  }

  return { isOpen, interceptClick, close, confirm }
}
