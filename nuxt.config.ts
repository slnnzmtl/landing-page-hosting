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
  modules: ['@nuxtjs/tailwindcss', '@vercel/analytics'],
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
    },
  },
  runtimeConfig: {
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
      crawlLinks: false,
      routes: [
        '/',
        '/experience',
        '/survey',
        ...getSurveyRoutes(),
        ...getServiceRoutes(),
        ...getProjectRoutes(),
        '/sitemap.xml',
        '/robots.txt',
      ],
    },
  },
  tailwindcss: {
    cssPath: '@/assets/main.css',
  },
})
