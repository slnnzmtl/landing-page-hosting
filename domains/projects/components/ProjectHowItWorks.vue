<script setup lang="ts">
import type { ProjectGuide } from '../data/types'

defineProps<{
  guide: ProjectGuide
}>()
</script>

<template>
  <section
    aria-labelledby="project-how-heading"
    class="space-y-5"
  >
    <h2
      id="project-how-heading"
      class="text-2xl font-semibold"
    >
      {{ guide.title }}
    </h2>
    <p
      v-if="guide.warning"
      class="max-w-3xl rounded-2xl border border-amber-500 bg-amber-400 px-4 py-3 text-sm font-medium text-amber-950"
      role="note"
    >
      {{ guide.warning }}
    </p>
    <ol class="flex max-w-5xl flex-col items-stretch gap-2 md:flex-row md:gap-2">
      <li
        v-for="(step, index) in guide.steps"
        :key="step.title"
        class="flex min-w-0 flex-1 flex-col items-stretch gap-2 md:flex-row md:items-center"
      >
        <div class="h-full min-w-0 flex-1 rounded-2xl border border-border bg-muted/40 p-5">
          <p class="text-xs font-semibold uppercase tracking-wide text-primary">
            Step {{ index + 1 }}
          </p>
          <h3 class="mt-1.5 text-base font-semibold text-foreground">
            {{ step.title }}
          </h3>
          <p class="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            {{ step.body }}
          </p>
        </div>
        <span
          v-if="index < guide.steps.length - 1"
          class="select-none self-center text-lg leading-none text-primary before:content-['↓'] md:before:content-['→']"
          aria-hidden="true"
        />
      </li>
    </ol>
  </section>
</template>
