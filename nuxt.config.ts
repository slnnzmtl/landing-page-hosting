import { defineNuxtConfig } from 'nuxt/config'
import { getSurveyRoutes } from './domains/survey/survey-routes'
import { getServiceRoutes } from './domains/service/service-routes'
import { getProjectRoutes } from './domains/projects/project-routes'

export default defineNuxtConfig({
  extends: [
    './domains/survey',
    './domains/service',
    './domains/projects',
  ],
  modules: ['@nuxtjs/tailwindcss'],
  ssr: true,
  devtools: { enabled: true },
  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },
    },
  },
  css: ['@/assets/main.css'],
  runtimeConfig: {
    public: {
      surveyWebhookUrl: process.env.SURVEY_WEBHOOK_URL || '',
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || process.env.SITE_URL || '',
    },
  },
  routeRules: {
    'survey/**': {
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
      crawlLinks: false,
      routes: [
        '/',
        '/survey',
        ...getSurveyRoutes(),
        ...getServiceRoutes(),
        ...getProjectRoutes(),
        '/sitemap.xml',
        '/robots.txt',
      ],
    },
  },
})
