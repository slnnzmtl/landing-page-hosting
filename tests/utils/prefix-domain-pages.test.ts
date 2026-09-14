import { describe, it, expect } from 'vitest'
import { prefixDomainPages } from '~/utils/prefix-domain-pages'
import type { NuxtPage } from 'nuxt/schema'

describe('prefixDomainPages', () => {
  it('prefixes only pages from the given domain', () => {
    const pages: NuxtPage[] = [
      {
        path: '/dashboard',
        file: '/repo/domains/service/pages/dashboard.vue',
      },
      {
        path: '/',
        file: '/repo/domains/survey/pages/index.vue',
      },
      {
        path: '/about',
        file: '/repo/pages/about.vue',
      },
    ]

    prefixDomainPages(pages, 'service', '/service')

    expect(pages[0].path).toBe('/service/dashboard')
    expect(pages[1].path).toBe('/')
    expect(pages[2].path).toBe('/about')
  })

  it('prefixes survey index as /survey', () => {
    const pages: NuxtPage[] = [
      { path: '/', file: '/repo/domains/survey/pages/index.vue' },
      { path: '/:slug()', file: '/repo/domains/survey/pages/[slug].vue' },
    ]

    prefixDomainPages(pages, 'survey', '/survey')

    expect(pages[0].path).toBe('/survey')
    expect(pages[1].path).toBe('/survey/:slug()')
  })

  it('prefixes projects index as /projects', () => {
    const pages: NuxtPage[] = [
      { path: '/', file: '/repo/domains/projects/pages/index.vue' },
      { path: '/:slug()', file: '/repo/domains/projects/pages/[slug].vue' },
    ]

    prefixDomainPages(pages, 'projects', '/projects')

    expect(pages[0].path).toBe('/projects')
    expect(pages[1].path).toBe('/projects/:slug()')
  })

  it('is idempotent', () => {
    const pages: NuxtPage[] = [
      { path: '/dashboard', file: '/repo/domains/service/pages/dashboard.vue' },
    ]
    prefixDomainPages(pages, 'service', '/service')
    prefixDomainPages(pages, 'service', '/service')
    expect(pages[0].path).toBe('/service/dashboard')
  })
})
