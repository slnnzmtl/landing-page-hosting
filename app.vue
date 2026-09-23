<script setup lang="ts">
const route = useRoute()

const showSiteChrome = computed(() => {
  const path = route.path
  return !path.startsWith('/survey') && !path.startsWith('/service')
})

/** Lower star density on long case-study reading pages. */
const starDensityFactor = computed(() =>
  route.path.startsWith('/work') ? 0.28 : 1,
)
</script>

<template>
  <div
    class="relative grid min-h-screen w-full grid-cols-[minmax(0,1fr)] bg-black"
    :class="showSiteChrome ? 'xl:grid-cols-[9.5rem_minmax(0,1fr)]' : ''"
  >
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground"
    >
      Skip to main content
    </a>
    <StarBackdrop
      v-if="showSiteChrome"
      :density-factor="starDensityFactor"
    />
    <AppSidebar v-if="showSiteChrome" />
    <main
      id="main-content"
      class="app row-start-1 min-w-0 w-full bg-transparent"
      :class="showSiteChrome ? 'col-start-1 xl:col-start-2' : 'col-start-1'"
      tabindex="-1"
    >
      <NuxtPage :page-key="route.path" />
    </main>
  </div>
</template>
