<script setup lang="ts">
import type { FeaturedCase } from '~/data/homepage'

const props = defineProps<{
  intro: string
  cases: FeaturedCase[]
}>()

const flagship = computed(() => props.cases.find(item => item.featured) ?? props.cases[0])
const secondary = computed(() =>
  props.cases.filter(item => item.slug !== flagship.value?.slug),
)
const companion = computed(() => secondary.value[0])
const rest = computed(() => secondary.value.slice(1))
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
      <div
        v-if="flagship"
        class="lg:col-span-7"
      >
        <HomeFeaturedCaseCard :item="flagship" />
      </div>
      <div
        v-if="companion"
        class="lg:col-span-5"
      >
        <HomeFeaturedCaseCard :item="companion" />
      </div>
      <div
        v-for="item in rest"
        :key="item.slug"
        class="lg:col-span-12"
      >
        <HomeFeaturedCaseCard :item="item" />
      </div>
    </div>
  </section>
</template>
