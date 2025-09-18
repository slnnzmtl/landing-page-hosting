<script setup lang="ts">
// Server-side 301 redirect to external site, with client-side fallback.
if (import.meta.server) {
  const { sendRedirect } = await import('h3')
  // Use the event-based Nitro redirect when possible
  // In a page component we don't have the request event directly, so use navigateTo redirect via route rules.
  // Fallback: set location through useNitro and sendRedirect on the server side by creating an event handler.
  // Simpler approach: throw a navigation redirect using useRequestEvent if available.
  try {
    // try to obtain the current event and send a 301
    // @ts-ignore - useNuxtApp to access event
    const nuxtApp = (globalThis as any).nuxtApp || undefined
    if (nuxtApp && nuxtApp.ssrContext && nuxtApp.ssrContext.event) {
      sendRedirect(nuxtApp.ssrContext.event, 'https://kazansky.dev', 301)
    }
  } catch (e) {
    // ignore - client will still redirect below
  }
}

// Client-side immediate redirect as a fallback
if (process.client) {
  window.location.replace('https://kazansky.dev')
}
</script>

<template>
  <div class="max-w-3xl mx-auto py-16 px-6 text-center">
    <p class="text-muted-foreground">Redirecting to https://kazansky.dev…</p>
    <p class="mt-3 text-sm text-muted-foreground">If you are not redirected automatically, <a href="https://kazansky.dev" class="underline">click here</a>.</p>
  </div>
</template>