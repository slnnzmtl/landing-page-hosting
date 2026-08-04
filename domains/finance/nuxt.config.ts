import { prefixDomainPages } from '../../utils/prefix-domain-pages'

export default defineNuxtConfig({
  hooks: {
    'pages:extend'(pages) {
      prefixDomainPages(pages, 'finance', '/finance')
    },
  },
})
