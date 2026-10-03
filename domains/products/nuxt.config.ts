import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { prefixDomainPages } from '../../utils/prefix-domain-pages'

const productsRoot = dirname(fileURLToPath(import.meta.url))
const productsIndexFile = join(productsRoot, 'pages/index.vue')
const productsSlugFile = join(productsRoot, 'pages/[slug].vue')

export default defineNuxtConfig({
  hooks: {
    'pages:extend'(pages) {
      prefixDomainPages(pages, 'products', '/products')

      // Root pages/index.vue also maps to `/`, so Nuxt drops this layer's index.
      const hasProductsIndex = pages.some(
        p => p.path === '/products' || p.file === productsIndexFile,
      )
      if (!hasProductsIndex) {
        pages.push({
          name: 'products',
          path: '/products',
          file: productsIndexFile,
        })
      }

      // Survey also ships pages/[slug].vue, so Nuxt keeps one `slug` route.
      // Re-register this layer's detail page under a unique name and prefix.
      const slugPage = pages.find(p => p.file === productsSlugFile)
      if (slugPage) {
        slugPage.name = 'products-slug'
        if (!slugPage.path.startsWith('/products')) {
          slugPage.path = '/products/:slug()'
        }
      }
      else {
        pages.push({
          name: 'products-slug',
          path: '/products/:slug()',
          file: productsSlugFile,
        })
      }
    },
  },
})
