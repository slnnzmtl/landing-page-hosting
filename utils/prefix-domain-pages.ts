import type { NuxtPage } from 'nuxt/schema'

/**
 * Prefix routes contributed by a domain layer so
 * domains/<name>/pages/dashboard.vue → /<name>/dashboard
 * instead of nesting pages/<name>/dashboard.vue.
 */
export function prefixDomainPages(
  pages: NuxtPage[],
  domain: string,
  prefix: string,
) {
  const markers = [
    `/domains/${domain}/pages/`,
    `\\domains\\${domain}\\pages\\`,
  ]

  const visit = (page: NuxtPage) => {
    const file = page.file ?? ''
    if (markers.some(m => file.includes(m))) {
      if (!page.path.startsWith(prefix)) {
        page.path = page.path === '/' ? prefix : `${prefix}${page.path}`
      }
    }
    page.children?.forEach(visit)
  }

  pages.forEach(visit)
}
