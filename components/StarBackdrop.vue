<script setup lang="ts">
import { starBackdropClass } from '~/utils/star-backdrop'

const starsReady = ref(false)

onMounted(() => {
  const mountStars = () => {
    starsReady.value = true
  }

  if (typeof requestIdleCallback !== 'undefined') {
    requestIdleCallback(mountStars, { timeout: 1500 })
  }
  else {
    setTimeout(mountStars, 0)
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
