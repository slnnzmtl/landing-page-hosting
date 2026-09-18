<template>
  <div class="relative min-h-screen">
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground"
    >
      Skip to main content
    </a>
    <main
      id="main-content"
      class="app"
      tabindex="-1"
    >
      <NuxtPage />
    </main>
  </div>
</template>
