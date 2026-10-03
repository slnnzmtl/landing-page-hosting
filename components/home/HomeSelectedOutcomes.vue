<template>
  <section
    aria-labelledby="proof-heading"
    class="rounded-2xl border border-border bg-card p-6 shadow-sm sm:rounded-3xl sm:p-8"
  >
    <h2
      id="proof-heading"
      class="text-xs font-semibold uppercase tracking-wide text-primary sm:text-sm"
    >
      {{ heading }}
    </h2>
    <ul class="mt-4 flex flex-row flex-wrap gap-x-3 gap-y-4 sm:mt-4 sm:grid sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
      <li
        v-for="item in items"
        :key="`${item.value}-${item.label}`"
        class="min-w-0 basis-[calc(50%-0.375rem)] sm:basis-auto"
      >
        <p class="text-lg font-semibold leading-tight sm:text-3xl">
          {{ item.value }}
        </p>
        <p class="mt-1 text-xs leading-snug text-muted-foreground sm:mt-2 sm:text-sm">
          {{ item.label }}
        </p>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import type { ProofItem } from '~/data/homepage'

defineProps<{
  heading: string
  items: ProofItem[]
}>()
</script>
