<script setup lang="ts">
import { starBackdropClass } from '~/utils/star-backdrop'

const starsReady = ref(false)

onMounted(() => {
  if (typeof requestIdleCallback !== 'undefined') {
    requestIdleCallback(() => {
      starsReady.value = true
    }, { timeout: 1500 })
  }
  else {
    setTimeout(() => {
      starsReady.value = true
    }, 0)
  }
})
</script>

<template>
  <div
    v-if="!starsReady"
    :class="starBackdropClass"
    aria-hidden="true"
  />
  <LazyBackgroundPixelStars v-else />
</template>
