<script setup lang="ts">
import { computed } from 'vue'
import type { ProductsSection } from '~/data/homepage'
import HomeProductSpotlight from './HomeProductSpotlight.vue'
import HomeProductPlaceholder from './HomeProductPlaceholder.vue'
import { useHomepageUi } from '~/composables/useHomepageUi'

const props = defineProps<{
  products: ProductsSection
}>()

const placeholderCount = computed(() => Math.max(0, 3 - props.products.items.length))
const { interactiveTransition } = useHomepageUi()
</script>

<template>
  <section
    id="products"
    aria-labelledby="products-heading"
    class="scroll-mt-24"
  >
    <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
      <div>
        <h2
          id="products-heading"
          class="text-2xl font-semibold"
        >
          {{ products.heading }}
        </h2>
        <p class="mt-3 max-w-2xl text-muted-foreground">
          {{ products.description }}
        </p>
      </div>
      <NuxtLink
        :to="products.allProductsCta.href"
        :class="[
          'inline-flex shrink-0 items-center gap-2 text-sm font-medium text-primary underline-offset-4 hover:underline',
          interactiveTransition,
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        ]"
      >
        {{ products.allProductsCta.label }}
        <span aria-hidden="true">→</span>
      </NuxtLink>
    </div>
    <ul
      v-if="products.items.length"
      class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      <li
        v-for="item in products.items"
        :key="item.slug"
      >
        <HomeProductSpotlight :product="item" />
      </li>
      <li
        v-for="index in placeholderCount"
        :key="`product-placeholder-${index}`"
      >
        <HomeProductPlaceholder />
      </li>
    </ul>
  </section>
</template>
