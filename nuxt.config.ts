import { defineNuxtConfig } from 'nuxt/config'
import { appendFileSync } from 'node:fs'
import { getSurveyRoutes } from './domains/survey/survey-routes'
import { getServiceRoutes } from './domains/service/service-routes'
import { getFinanceRoutes } from './domains/finance/finance-routes'

const prerenderRoutes = [
  '/',
  '/survey',
  ...getSurveyRoutes(),
  ...getServiceRoutes(),
  ...getFinanceRoutes(),
]

// #region agent log
const payload = {
  sessionId: '044f29',
  runId: 'post-fix',
  hypothesisId: 'A',
  location: 'nuxt.config.ts',
  message: 'prerender routes configured',
  data: {
    prerenderRoutes,
    hasFinanceDashboard: prerenderRoutes.includes('/finance/dashboard'),
  },
  timestamp: Date.now(),
}
try {
  appendFileSync('/Users/danielraptom/Git/landing-hosting/.cursor/debug-044f29.log', `${JSON.stringify(payload)}\n`)
}
catch { /* ignore */ }
fetch('http://127.0.0.1:7492/ingest/68de19a8-f098-430f-bc8f-b26c529e37fc', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '044f29' }, body: JSON.stringify(payload) }).catch(() => {})
// #endregion

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
      // Explicit routes required: crawlLinks is false; finance/service are client-only (ssr: false)
      crawlLinks: false,
      routes: prerenderRoutes,
    },
  },
})
