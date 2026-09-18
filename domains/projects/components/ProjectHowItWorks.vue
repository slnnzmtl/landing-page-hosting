<script setup lang="ts">
import { ArrowDown, ArrowRight } from 'lucide-vue-next'
import type { ProjectGuide } from '../data/types'

defineProps<{
  guide: ProjectGuide
}>()
</script>

<template>
  <section
    aria-labelledby="project-how-heading"
    class="space-y-6"
  >
    <h2
      id="project-how-heading"
      class="text-2xl font-semibold"
    >
      How it works
    </h2>
    <p
      v-if="guide.warning"
      class="max-w-3xl rounded-2xl border border-amber-500 bg-amber-400 px-5 py-4 text-sm font-medium text-amber-950"
      role="note"
    >
      {{ guide.warning }}
    </p>
    <ol class="flex max-w-5xl flex-col items-stretch gap-3 md:flex-row md:items-center md:gap-2">
      <template
        v-for="(step, index) in guide.steps"
        :key="step.title"
      >
        <li class="min-w-0 flex-1">
          <article class="h-full rounded-2xl border border-border bg-muted/40 p-5 sm:p-6">
            <p class="text-sm font-semibold uppercase tracking-wide text-primary">
              Step {{ index + 1 }}
            </p>
            <h3 class="mt-2 text-lg font-semibold text-foreground">
              {{ step.title }}
            </h3>
            <p class="mt-2 text-sm leading-relaxed text-muted-foreground">
              {{ step.body }}
            </p>
          </article>
        </li>
        <li
          v-if="index < guide.steps.length - 1"
          class="flex shrink-0 items-center justify-center text-primary md:px-1"
          aria-hidden="true"
        >
          <ArrowDown class="size-6 md:hidden" />
          <ArrowRight class="hidden size-6 md:block" />
        </li>
      </template>
    </ol>
  </section>
</template>
