// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'
import { getSurveyRoutes } from './domains/survey/survey-routes'
import { getServiceRoutes } from './domains/service/service-routes'

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
  },
  nitro: {
    prerender: {
      // Explicitly add dynamic survey routes since the root page redirects externally
      crawlLinks: false,
      routes: ['/', '/survey', ...getSurveyRoutes(), ...getServiceRoutes()],
    },
  },
})
