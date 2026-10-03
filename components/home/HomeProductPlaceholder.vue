<script setup lang="ts">
import AppCard from '~/components/AppCard.vue'
</script>

<template>
  <AppCard
    class="hidden sm:flex"
    aria-label="Product in progress"
  >
    <div class="product-placeholder flex min-h-[24rem] items-center justify-center p-6">
      <p class="text-lg font-medium text-primary">
        In progress
      </p>
    </div>
  </AppCard>
</template>
