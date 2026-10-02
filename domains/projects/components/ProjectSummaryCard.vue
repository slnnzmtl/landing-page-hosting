<script setup lang="ts">
import type { ProjectSummary } from '../data/types'
import { projectSummaryCategory } from '../data/types'
import OutboundTextLink from '~/components/OutboundTextLink.vue'
import { trackConversion } from '~/utils/track-conversion'

defineProps<{
  project: ProjectSummary
}>()

function onProjectClick(project: ProjectSummary) {
  trackConversion(project.hasCaseStudy ? 'case-study-open' : 'project-open', { slug: project.slug })
}
</script>

<template>
  <article class="flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-sm sm:rounded-3xl sm:p-6">
    <p class="text-xs font-semibold uppercase tracking-wide text-primary">
      {{ projectSummaryCategory(project) }}
    </p>
    <h3 class="mt-2 text-lg font-semibold leading-snug text-foreground">
      {{ project.name }}
    </h3>
    <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
      {{ project.shortDescription }}
    </p>
    <p
      v-if="project.role"
      class="mt-3 text-sm text-foreground"
    >
      My role: {{ project.role }}
    </p>
    <div
      v-if="project.stackTags.length"
      class="mt-4 flex flex-wrap gap-1.5"
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
      <OutboundTextLink
        :href="project.href"
        @click="onProjectClick(project)"
      >
        {{ project.hrefLabel }}
      </OutboundTextLink>
    </div>
  </article>
</template>
