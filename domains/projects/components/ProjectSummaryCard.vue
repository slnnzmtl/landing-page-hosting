<script setup lang="ts">
import type { ProjectSummary } from '../data/types'
import { projectSummaryCategory } from '../data/types'
import { trackConversion } from '~/utils/track-conversion'
import AppCard from '~/components/AppCard.vue'
import Button from '~/components/ui/button.vue'

defineProps<{
  project: ProjectSummary
}>()

function onProjectClick(project: ProjectSummary) {
  trackConversion(project.hasCaseStudy ? 'case-study-open' : 'project-open', { slug: project.slug })
}
</script>

<template>
  <AppCard
    :href="project.href"
    :aria-label="`${project.name}: ${project.hrefLabel}`"
    @click="onProjectClick(project)"
  >
    <div class="flex h-full flex-col p-5 sm:p-6">
      <p class="text-xs font-semibold uppercase tracking-wide text-primary">
        {{ projectSummaryCategory(project) }}
      </p>
      <h3 class="mt-2 text-3xl font-semibold leading-snug text-foreground">
        {{ project.name }}
      </h3>
      <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
        {{ project.shortDescription }}
      </p>
      <div
        v-if="project.stackTags.length"
        class="mt-4 flex-wrap gap-1.5 hidden lg:flex"
      >
        <span
          v-for="tag in project.stackTags.slice(0, 3)"
          :key="tag"
          class="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground"
        >
          {{ tag }}
        </span>
        <span
          v-if="project.stackTags.length > 3"
          class="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground"
        >
          +{{ project.stackTags.length - 3 }}
        </span>
      </div>
      <div class="mt-auto pt-5">
        <Button
          as="span"
          variant="arrow"
          aria-hidden="true"
        >
          {{ project.hrefLabel }}
        </Button>
      </div>
    </div>
  </AppCard>
</template>
