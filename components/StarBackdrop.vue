<script setup lang="ts">
import { starBackdropClass } from '~/utils/star-backdrop'

const props = withDefaults(defineProps<{
  densityFactor?: number
}>(), {
  densityFactor: 1,
})

const starsReady = ref(false)

onMounted(() => {
  const enable = () => {
    const start = () => {
      starsReady.value = true
    }
    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(start, { timeout: 6000 })
    }
    else {
      setTimeout(start, 6000)
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
  <LazyBackgroundPixelStars
    v-else
    :density-factor="props.densityFactor"
  />
</template>
