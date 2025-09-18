// https://nuxt.com/docs/api/configuration/nuxt-config
// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'
import { getSurveyRoutes } from './utils/survey-routes'

export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: true,
  nitro: {
    prerender: {
      // Explicitly add dynamic survey routes since the root page redirects externally
      crawlLinks: false,
      routes: ['/survey', ...getSurveyRoutes()],
    },
  },
  modules: ['@nuxtjs/tailwindcss'],
  css: ['@/assets/main.css'],
});
