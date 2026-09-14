import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { prefixDomainPages } from '../../utils/prefix-domain-pages'

const projectsRoot = dirname(fileURLToPath(import.meta.url))
const projectsIndexFile = join(projectsRoot, 'pages/index.vue')

export default defineNuxtConfig({
  hooks: {
    'pages:extend'(pages) {
      prefixDomainPages(pages, 'projects', '/projects')

      // Root pages/index.vue also maps to `/`, so Nuxt drops this layer's index.
      // Re-register it explicitly under the domain prefix.
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
    },
  },
})
