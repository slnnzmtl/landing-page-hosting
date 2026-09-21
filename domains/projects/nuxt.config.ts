import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { prefixDomainPages } from '../../utils/prefix-domain-pages'

const projectsRoot = dirname(fileURLToPath(import.meta.url))
const projectsIndexFile = join(projectsRoot, 'pages/index.vue')
const projectsSlugFile = join(projectsRoot, 'pages/[slug].vue')

export default defineNuxtConfig({
  hooks: {
    'pages:extend'(pages) {
      // Folder stays domains/projects; public catalog URLs are /products.
      prefixDomainPages(pages, 'projects', '/products')

      // Root pages/index.vue also maps to `/`, so Nuxt drops this layer's index.
      const hasProjectsIndex = pages.some(
        p => p.path === '/products' || p.file === projectsIndexFile,
      )
      if (!hasProjectsIndex) {
        pages.push({
          name: 'projects',
          path: '/products',
          file: projectsIndexFile,
        })
      }

      // Survey also ships pages/[slug].vue, so Nuxt keeps one `slug` route.
      // Re-register this layer's detail page under a unique name and prefix.
      const slugPage = pages.find(p => p.file === projectsSlugFile)
      if (slugPage) {
        slugPage.name = 'projects-slug'
        if (!slugPage.path.startsWith('/products')) {
          slugPage.path = '/products/:slug()'
        }
      }
      else {
        pages.push({
          name: 'projects-slug',
          path: '/products/:slug()',
          file: projectsSlugFile,
        })
      }
    },
  },
})
