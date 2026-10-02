import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { prefixDomainPages } from '../../utils/prefix-domain-pages'

const projectsRoot = dirname(fileURLToPath(import.meta.url))
const projectsIndexFile = join(projectsRoot, 'pages/index.vue')

export default defineNuxtConfig({
  hooks: {
    'pages:extend'(pages) {
      prefixDomainPages(pages, 'projects', '/projects')

      if (!pages.some(page => page.path === '/projects' || page.file === projectsIndexFile)) {
        pages.push({
          name: 'projects',
          path: '/projects',
          file: projectsIndexFile,
        })
      }
    },
  },
})
