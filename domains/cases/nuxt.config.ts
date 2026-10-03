import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { prefixDomainPages } from '../../utils/prefix-domain-pages'

const casesRoot = dirname(fileURLToPath(import.meta.url))
const casesSlugFile = join(casesRoot, 'pages/[slug].vue')

export default defineNuxtConfig({
  hooks: {
    'pages:extend'(pages) {
      // Folder is domains/cases; public URLs are /projects/:slug.
      prefixDomainPages(pages, 'cases', '/projects')

      // Survey and products also ship pages/[slug].vue — re-register uniquely.
      const slugPage = pages.find(p => p.file === casesSlugFile)
      if (slugPage) {
        slugPage.name = 'cases-slug'
        if (!slugPage.path.startsWith('/projects')) {
          slugPage.path = '/projects/:slug()'
        }
      }
      else {
        pages.push({
          name: 'cases-slug',
          path: '/projects/:slug()',
          file: casesSlugFile,
        })
      }
    },
  },
})
