<script setup lang="ts">
import { useProjects } from '../composables/useProjects'

const route = useRoute()
const slug = String(route.params.slug || '')
const { findProject } = useProjects()
const project = findProject(slug)

if (!project) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Project not found',
  })
}

useHead({
  title: `${project.name} | Kazansky Development`,
  meta: [
    {
      name: 'description',
      content: project.shortDescription,
    },
  ],
})
</script>

<template>
  <article class="min-h-screen bg-background text-foreground">
    <div class="mx-auto flex max-w-5xl flex-col gap-10 px-6 py-20 lg:px-12">
      <header class="space-y-4">
        <NuxtLink
          to="/projects"
          class="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <svg
            viewBox="0 0 20 20"
            fill="none"
            class="h-3.5 w-3.5"
            aria-hidden="true"
          >
            <path
              d="M12 15l-5-5 5-5"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          Selected projects
        </NuxtLink>
        <h1 class="text-4xl font-semibold leading-tight sm:text-5xl">
          {{ project.name }}
        </h1>
        <p class="max-w-2xl text-lg text-muted-foreground">
          {{ project.shortDescription }}
        </p>
      </header>
    </div>
  </article>
</template>
