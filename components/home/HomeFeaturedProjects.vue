<script setup lang="ts">
import type { ProjectSummary } from '~/domains/projects/data/types'
import { trackConversion } from '~/utils/track-conversion'

defineProps<{
  heading: string
  intro: string
  projects: ProjectSummary[]
  cta: { label: string, href: string }
}>()

function onProjectsCtaClick() {
  trackConversion('project-open')
}
</script>

<template>
  <section
    id="featured-projects"
    aria-labelledby="featured-projects-heading"
    class="scroll-mt-24"
  >
    <div class="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2
          id="featured-projects-heading"
          class="text-2xl font-semibold"
        >
          {{ heading }}
        </h2>
        <p class="mt-3 max-w-2xl text-muted-foreground">
          {{ intro }}
        </p>
      </div>
      <NuxtLink
        :to="cta.href"
        class="text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        @click="onProjectsCtaClick"
      >
        {{ cta.label }}
      </NuxtLink>
    </div>

    <div class="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-2">
      <ProjectSummaryCard
        v-for="project in projects"
        :key="project.slug"
        :project="project"
      />
    </div>
  </section>
</template>
