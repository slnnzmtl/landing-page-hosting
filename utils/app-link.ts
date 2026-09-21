/** Split an in-app href like `/experience#role-id` or `/#featured-work`. */
export function parseAppLink(to: string): { path: string, hash: string } {
  const hashIndex = to.indexOf('#')
  if (hashIndex === -1) {
    return { path: to || '/', hash: '' }
  }
  const path = to.slice(0, hashIndex) || '/'
  return {
    path,
    hash: to.slice(hashIndex),
  }
}

export function hashElementId(hash: string): string {
  return hash.replace(/^#/, '')
}

/** Which primary-nav href should look current for this path + hash. */
export function isNavItemActive(href: string, path: string, hash: string): boolean {
  const target = parseAppLink(href)
  if (target.hash) {
    return path === target.path && hash === target.hash
  }
  if (target.path === '/') {
    return path === '/' && hash !== '#contact'
  }
  return path === target.path || path.startsWith(`${target.path}/`)
}
