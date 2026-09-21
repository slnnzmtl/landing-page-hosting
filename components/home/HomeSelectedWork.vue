<script setup lang="ts">
import type { FeaturedCase } from '~/data/homepage'

defineProps<{
  heading: string
  intro: string
  flagshipLabel: string
  cases: FeaturedCase[]
}>()

const caseColSpans = ['lg:col-span-7', 'lg:col-span-5', 'lg:col-span-12'] as const

function caseColClass(index: number) {
  return caseColSpans[index % caseColSpans.length]
}
</script>

<template>
  <section
    id="featured-work"
    aria-labelledby="work-heading"
    class="scroll-mt-24"
  >
    <div>
      <h2
        id="work-heading"
        class="text-2xl font-semibold"
      >
        {{ heading }}
      </h2>
      <p class="mt-3 max-w-2xl text-muted-foreground">
        {{ intro }}
      </p>
    </div>

    <div class="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-12">
      <div
        v-for="(item, index) in cases"
        :key="item.slug"
        :class="caseColClass(index)"
      >
        <HomeFeaturedCaseCard
          :item="item"
          :flagship-label="flagshipLabel"
        />
      </div>
    </div>
  </section>
</template>
