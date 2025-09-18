// https://nuxt.com/docs/api/configuration/nuxt-config
// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: true,
  nitro: {
    prerender: {
      // Pre-render all routes by default
      crawl: true,
      routes: ['/survey/sweet-loyalty']
    },
  },
  modules: ['@nuxtjs/tailwindcss'],
  css: ['@/assets/main.css'],
});
