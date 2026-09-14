import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { prefixDomainPages } from '../../utils/prefix-domain-pages'

const projectsRoot = dirname(fileURLToPath(import.meta.url))
const projectsIndexFile = join(projectsRoot, 'pages/index.vue')
const projectsSlugFile = join(projectsRoot, 'pages/[slug].vue')

export default defineNuxtConfig({
  hooks: {
    'pages:extend'(pages) {
      prefixDomainPages(pages, 'projects', '/projects')

      // Root pages/index.vue also maps to `/`, so Nuxt drops this layer's index.
      const hasProjectsIndex = pages.some(
        p => p.path === '/projects' || p.file === projectsIndexFile,
      )
      if (!hasProjectsIndex) {
        pages.push({
          name: 'projects',
          path: '/projects',
          file: projectsIndexFile,
        })
      }

      // Survey also ships pages/[slug].vue, so Nuxt keeps one `slug` route.
      // Re-register this layer's detail page under a unique name and prefix.
      const slugPage = pages.find(p => p.file === projectsSlugFile)
      if (slugPage) {
        slugPage.name = 'projects-slug'
        if (!slugPage.path.startsWith('/projects')) {
          slugPage.path = '/projects/:slug()'
        }
      }
      else {
        pages.push({
          name: 'projects-slug',
          path: '/projects/:slug()',
          file: projectsSlugFile,
        })
      }
    },
  },
})
