<script setup lang="ts">
const route = useRoute()
const config = useRuntimeConfig()

const showSiteChrome = computed(() => {
  const path = route.path
  return !path.startsWith('/survey') && !path.startsWith('/service')
})

const umamiWebsiteId = config.public.umamiWebsiteId as string
if (umamiWebsiteId) {
  useHead({
    script: [
      {
        'src': 'https://cloud.umami.is/script.js',
        'defer': true,
        'data-website-id': umamiWebsiteId,
      },
    ],
  })
}
</script>

<template>
  <div class="relative grid min-h-screen bg-black">
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground"
    >
      Skip to main content
    </a>
    <StarBackdrop v-if="showSiteChrome" />
    <AppSidebar v-if="showSiteChrome" />
    <main
      id="main-content"
      class="app col-start-1 row-start-1 bg-transparent"
      tabindex="-1"
    >
      <NuxtPage />
    </main>
  </div>
</template>
