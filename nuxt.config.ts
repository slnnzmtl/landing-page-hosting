// https://nuxt.com/docs/api/configuration/nuxt-config
// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'
import { getSurveyRoutes, getPageRoutes } from './utils/survey-routes'

export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss'],
  ssr: true,
  devtools: { enabled: true },
  css: ['@/assets/main.css'],
  routeRules: {
    'survey/**': {
      ssr: true,
      headers: { 'X-Robots-Tag': 'noindex, nofollow' },
    },
  },
  nitro: {
    prerender: {
      // Explicitly add dynamic survey routes since the root page redirects externally
      crawlLinks: false,
      routes: ['/', '/survey', ...getSurveyRoutes(), ...getPageRoutes()],
    },
  },
})
