import { defineConfig } from 'vitest/config'
import { defineNuxtConfig } from 'nuxt/config'

export default defineConfig({
  test: {
    environment: 'nuxt',
    // you can optionally set nuxt-specific environment options
    // environmentOptions: {
    //   nuxt: {
    //     rootDir: fileURLToPath(new URL('./', import.meta.url)),
    //     domEnvironment: 'happy-dom', // 'happy-dom' (default) or 'jsdom'
    //     overrides: {
    //       // other nuxt config you want to pass
    //     }
    //   }
    // }
  }
})