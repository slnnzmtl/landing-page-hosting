import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { prefixDomainPages } from '../../utils/prefix-domain-pages'

const surveyRoot = dirname(fileURLToPath(import.meta.url))
const surveyIndexFile = join(surveyRoot, 'pages/index.vue')

export default defineNuxtConfig({
  hooks: {
    'pages:extend'(pages) {
      prefixDomainPages(pages, 'survey', '/survey')

      // Root pages/index.vue also maps to `/`, so Nuxt drops this layer's index.
      // Re-register it explicitly under the domain prefix.
      const hasSurveyIndex = pages.some(
        p => p.path === '/survey' || p.file === surveyIndexFile,
      )
      if (!hasSurveyIndex) {
        pages.push({
          name: 'survey',
          path: '/survey',
          file: surveyIndexFile,
        })
      }
    },
  },
})
