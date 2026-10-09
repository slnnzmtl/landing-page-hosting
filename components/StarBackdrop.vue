<script setup lang="ts">
import BackgroundPixelStars from '~/components/BackgroundPixelStars.vue'

const props = withDefaults(defineProps<{
  densityFactor?: number
}>(), {
  densityFactor: 1,
})
</script>

<template>
  <BackgroundPixelStars :density-factor="props.densityFactor" />
</template>
