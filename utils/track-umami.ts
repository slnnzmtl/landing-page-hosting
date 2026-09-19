declare global {
  interface Window {
    umami?: {
      track: (name: string, data?: Record<string, string | number | boolean>) => void
    }
  }
}

/** Fire a cookieless Umami custom event when the script is present. */
export function trackUmami(
  name: string,
  data?: Record<string, string | number | boolean>,
): void {
  if (typeof window === 'undefined') return
  window.umami?.track(name, data)
}
