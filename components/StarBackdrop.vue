<script setup lang="ts">
import { starBackdropClass } from '~/utils/star-backdrop'
import BackgroundPixelStars from '~/components/BackgroundPixelStars.vue'

const props = withDefaults(defineProps<{
  densityFactor?: number
}>(), {
  densityFactor: 1,
})

const starsReady = ref(false)

onMounted(() => {
  const enable = () => {
    let started = false
    const start = () => {
      if (started) return
      started = true
      starsReady.value = true
    }
    // Always arm a hard timeout so stars start even when native
    // requestIdleCallback exists but never invokes the callback.
    const hardTimeoutId = setTimeout(start, 6000)
    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(() => {
        clearTimeout(hardTimeoutId)
        start()
      }, { timeout: 6000 })
    }
  }

  if (document.readyState === 'complete') enable()
  else window.addEventListener('load', enable, { once: true })
})
</script>

<template>
  <div
    v-if="!starsReady"
    :class="starBackdropClass"
    aria-hidden="true"
  />
  <BackgroundPixelStars
    v-else
    :density-factor="props.densityFactor"
  />
</template>
