<script setup lang="ts">
import type { ProductsSection } from '~/data/homepage'

defineProps<{
  products: ProductsSection
}>()
</script>

<template>
  <section
    id="products"
    aria-labelledby="products-heading"
    class="scroll-mt-24"
  >
    <div>
      <h2
        id="products-heading"
        class="text-2xl font-semibold"
      >
        {{ products.heading.text }}
      </h2>
      <p class="mt-3 max-w-2xl text-muted-foreground">
        {{ products.description.text }}
      </p>
    </div>
    <ul
      v-if="products.items.length"
      class="mt-10 space-y-10"
    >
      <li
        v-for="item in products.items"
        :key="item.slug"
      >
        <HomeProductSpotlight :product="item" />
      </li>
    </ul>
  </section>
</template>
