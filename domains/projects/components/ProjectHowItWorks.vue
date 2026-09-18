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
      class="max-w-3xl border-l-2 border-amber-400 pl-3 text-sm text-muted-foreground"
      role="note"
    >
      {{ guide.warning }}
    </p>
    <ol class="grid grid-cols-1 items-stretch gap-3 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] md:gap-x-3 md:gap-y-0">
      <template
        v-for="(step, index) in guide.steps"
        :key="step.title"
      >
        <li class="h-full min-w-0">
          <div class="flex h-full flex-col rounded-2xl border border-border bg-muted/40 p-5">
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
        </li>
        <li
          v-if="index < guide.steps.length - 1"
          class="flex items-center justify-center text-2xl leading-none text-primary"
          aria-hidden="true"
        >
          <span class="md:hidden">↓</span>
          <span class="hidden md:inline">→</span>
        </li>
      </template>
    </ol>
  </section>
</template>
