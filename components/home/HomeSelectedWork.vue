<script setup lang="ts">
import type { FeaturedCase } from '~/data/homepage'

defineProps<{
  intro: string
  cases: FeaturedCase[]
}>()
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
        Featured work
      </h2>
      <p class="mt-3 max-w-2xl text-muted-foreground">
        {{ intro }}
      </p>
    </div>

    <div class="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-12">
      <div class="lg:col-span-7">
        <HomeFeaturedCaseCard :item="cases[0]" />
      </div>
      <div
        v-if="cases[1]"
        class="lg:col-span-5"
      >
        <HomeFeaturedCaseCard :item="cases[1]" />
      </div>
      <div
        v-if="cases[2]"
        class="lg:col-span-12"
      >
        <HomeFeaturedCaseCard :item="cases[2]" />
      </div>
    </div>
  </section>
</template>
