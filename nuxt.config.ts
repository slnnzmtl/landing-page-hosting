import { defineNuxtConfig } from 'nuxt/config'
import { getSurveyRoutes } from './domains/survey/survey-routes'
import { getServiceRoutes } from './domains/service/service-routes'
import { getFinanceRoutes } from './domains/finance/finance-routes'

export default defineNuxtConfig({
  extends: [
    './domains/finance',
    './domains/survey',
    './domains/service',
  ],
  modules: ['@nuxtjs/tailwindcss'],
  ssr: true,
  devtools: { enabled: true },
  css: ['@/assets/main.css'],
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.SUPABASE_URL || '',
      supabaseKey: process.env.SUPABASE_KEY || '',
      allowedEmails: process.env.ALLOWED_EMAILS || '',
    },
  },
  routeRules: {
    'survey/**': {
      ssr: true,
      headers: { 'X-Robots-Tag': 'noindex, nofollow' },
    },
    '/finance/**': {
      ssr: false,
      headers: { 'X-Robots-Tag': 'noindex, nofollow' },
    },
    '/service/**': {
      ssr: false,
      headers: { 'X-Robots-Tag': 'noindex, nofollow' },
    },
    '/login': {
      ssr: false,
      headers: { 'X-Robots-Tag': 'noindex, nofollow' },
    },
  },
  nitro: {
    prerender: {
      // Explicit routes required: crawlLinks is false; finance/service are client-only (ssr: false)
      crawlLinks: false,
      routes: [
        '/',
        '/survey',
        '/login',
        ...getSurveyRoutes(),
        ...getServiceRoutes(),
        ...getFinanceRoutes(),
      ],
    },
  },
})
