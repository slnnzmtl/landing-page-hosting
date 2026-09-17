<script setup lang="ts">
import { publishedExperienceRoles } from '~/data/experience'

const roles = publishedExperienceRoles()

useHead({
  title: 'Professional Experience | Daniel Kazansky',
  meta: [
    {
      name: 'description',
      content:
        'Full professional role details for Daniel Kazansky: Upwork, Subbly, and Capgemini Engineering.',
    },
    {
      name: 'robots',
      content: 'noindex, nofollow',
    },
  ],
})
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <div class="mx-auto flex max-w-3xl flex-col gap-10 px-6 py-20 lg:px-12">
      <div>
        <NuxtLink
          to="/#selected-work"
          class="text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Back to selected work
        </NuxtLink>
        <h1 class="mt-6 text-3xl font-semibold tracking-tight">
          Professional experience
        </h1>
        <p class="mt-3 max-w-2xl text-muted-foreground">
          Full role writeups for commercial product engineering. Homepage cards stay condensed; this page keeps the detail.
        </p>
      </div>

      <ul class="divide-y divide-border border-y border-border">
        <li
          v-for="role in roles"
          :key="role.slug"
        >
          <HomeFeaturedCaseCard :item="role" />
        </li>
      </ul>
    </div>
  </div>
</template>
