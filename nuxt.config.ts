import { defineNuxtConfig } from 'nuxt/config'
import { getSurveyRoutes } from './domains/survey/survey-routes'
import { getServiceRoutes } from './domains/service/service-routes'
import { DEFAULT_DIRECTUS_URL, shouldFetchCmsPrerenderSlugs } from './utils/cms/client'

/** Build-time only; baked into the Umami script tag (safe to expose in HTML). */
const umamiWebsiteId = process.env.UMAMI_WEBSITE_ID || process.env.NUXT_UMAMI_WEBSITE_ID || ''

/** First-party copy of https://cloud.umami.is/script.js at public/u.js (re-copy when Umami updates). */
export default defineNuxtConfig({
  extends: [
    './domains/survey',
    './domains/service',
    './domains/projects',
  ],
  modules: ['@nuxtjs/tailwindcss'],
  ssr: true,
  devtools: { enabled: process.env.NODE_ENV !== 'production' },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      htmlAttrs: {
        lang: 'en',
        class: 'dark',
      },
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
        { rel: 'icon', type: 'image/png', href: '/favicon-32x32.png', sizes: '32x32' },
        { rel: 'icon', type: 'image/png', href: '/favicon-16x16.png', sizes: '16x16' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png', sizes: '180x180' },
      ],
      script: umamiWebsiteId
        ? [
            {
              'src': '/u.js',
              'defer': true,
              'data-website-id': umamiWebsiteId,
              'data-host-url': 'https://gateway.umami.is',
              'data-fetch-credentials': 'omit',
              'data-domains': 'kazansky.dev',
            },
          ]
        : [],
    },
  },
  runtimeConfig: {
    umamiWebsiteId,
    /** Server-only Directus build reader — never NUXT_PUBLIC_*. */
    directusUrl: process.env.DIRECTUS_URL || DEFAULT_DIRECTUS_URL,
    directusToken: process.env.DIRECTUS_TOKEN || '',
    public: {
      surveyWebhookUrl: process.env.SURVEY_WEBHOOK_URL || '',
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || process.env.SITE_URL || '',
    },
  },
  routeRules: {
    '/survey/**': {
      ssr: true,
      headers: { 'X-Robots-Tag': 'noindex, nofollow' },
    },
    '/service/**': {
      ssr: false,
      headers: { 'X-Robots-Tag': 'noindex, nofollow' },
    },
  },
  nitro: {
    prerender: {
      // Explicit routes required: crawlLinks is false; service is client-only (ssr: false)
      // Product slugs are appended in nitro:config during generate (CMS-driven).
      crawlLinks: false,
      routes: [
        '/',
        '/experience',
        '/survey',
        ...getSurveyRoutes(),
        ...getServiceRoutes(),
        '/products',
        '/sitemap.xml',
        '/robots.txt',
      ],
    },
  },
  hooks: {
    async 'nitro:config'(nitroConfig) {
      // Generate/dev with a token only. Skip `nuxt prepare` / Vitest / postinstall.
      if (!shouldFetchCmsPrerenderSlugs()) return

      try {
        const { fetchProductSlugs } = await import('./utils/cms/load')
        const slugs = await fetchProductSlugs()
        const routes = slugs.map(slug => `/products/${slug}`)
        nitroConfig.prerender = nitroConfig.prerender || {}
        const existing = nitroConfig.prerender.routes || []
        nitroConfig.prerender.routes = [...new Set([...existing, ...routes])]
      }
      catch (error) {
        console.error('[nitro:config] Failed to load CMS product slugs:', error)
        throw error
      }
    },
  },
  tailwindcss: {
    cssPath: '@/assets/main.css',
  },
})
