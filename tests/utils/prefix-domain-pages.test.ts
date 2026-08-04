import { describe, it, expect } from 'vitest'
import { prefixDomainPages } from '~/utils/prefix-domain-pages'
import type { NuxtPage } from 'nuxt/schema'

describe('prefixDomainPages', () => {
  it('prefixes only pages from the given domain', () => {
    const pages: NuxtPage[] = [
      {
        path: '/dashboard',
        file: '/repo/domains/finance/pages/dashboard.vue',
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

    prefixDomainPages(pages, 'finance', '/finance')

    expect(pages[0].path).toBe('/finance/dashboard')
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

  it('is idempotent', () => {
    const pages: NuxtPage[] = [
      { path: '/dashboard', file: '/repo/domains/finance/pages/dashboard.vue' },
    ]
    prefixDomainPages(pages, 'finance', '/finance')
    prefixDomainPages(pages, 'finance', '/finance')
    expect(pages[0].path).toBe('/finance/dashboard')
  })
})
