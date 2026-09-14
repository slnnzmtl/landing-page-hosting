<script setup lang="ts">
import { useProjects } from '../composables/useProjects'
import { projectPath } from '../data/types'

const { projects } = useProjects()

useHead({
  title: 'Selected projects | Kazansky Development',
  meta: [
    {
      name: 'description',
      content: 'Selected personal projects and products, starting with Simple Rekordbox Converter.',
    },
  ],
})
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <div class="mx-auto flex max-w-5xl flex-col gap-12 px-6 py-20 lg:px-12">
      <header class="space-y-4">
        <p class="text-sm uppercase tracking-[0.35em] text-primary">
          Kazansky Development
        </p>
        <h1 class="text-4xl font-semibold leading-tight sm:text-5xl">
          Selected projects
        </h1>
        <p class="max-w-2xl text-lg text-muted-foreground">
          Public products and tools. Each card opens a dedicated landing page with usage notes and downloads.
        </p>
        <NuxtLink
          to="/"
          class="inline-flex items-center gap-2 text-sm font-medium text-primary transition hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Back to the studio homepage
        </NuxtLink>
      </header>

      <ul class="grid gap-5 sm:grid-cols-2">
        <li
          v-for="project in projects"
          :key="project.slug"
        >
          <NuxtLink
            :to="projectPath(project.slug)"
            class="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <h2 class="text-xl font-semibold text-primary">
              {{ project.name }}
            </h2>
            <p class="mt-2 flex-1 text-sm text-muted-foreground">
              {{ project.shortDescription }}
            </p>
            <span class="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary transition-transform group-hover:translate-x-0.5">
              View project
              <svg
                viewBox="0 0 20 20"
                fill="none"
                class="h-4 w-4"
                aria-hidden="true"
              >
                <path
                  d="M7 5l6 5-6 5"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
          </NuxtLink>
        </li>
      </ul>
    </div>
  </div>
</template>
