<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const is404 = computed(() => props.error.statusCode === 404)
const title = computed(() => is404.value ? 'Page not found' : 'Something went wrong')

useHead({
  title: () => `${title.value} | Kazansky.dev`,
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
})

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <main class="mx-auto flex max-w-xl flex-col items-center gap-6 px-6 py-24 text-center">
      <p class="text-sm uppercase tracking-[0.35em] text-primary">
        {{ props.error.statusCode || 500 }}
      </p>
      <h1 class="text-3xl font-semibold">
        {{ title }}
      </h1>
      <p class="text-muted-foreground">
        {{ is404 ? 'That page is not in this site.' : 'An unexpected error occurred.' }}
      </p>
      <div class="flex flex-wrap items-center justify-center gap-3">
        <NuxtLink
          to="/"
          class="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Homepage
        </NuxtLink>
        <NuxtLink
          to="/projects"
          class="rounded-full border border-border px-6 py-3 text-sm font-medium transition hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Selected projects
        </NuxtLink>
        <button
          type="button"
          class="text-sm font-medium text-muted-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          @click="handleError"
        >
          Try again
        </button>
      </div>
    </main>
  </div>
</template>
