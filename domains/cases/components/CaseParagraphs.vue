<script setup lang="ts">
defineProps<{
  paragraphs: string[]
  className?: string
}>()
</script>

<template>
  <div
    v-if="paragraphs.length"
    :class="className || 'space-y-4 text-base leading-7 text-foreground/90'"
  >
    <p
      v-for="(paragraph, index) in paragraphs"
      :key="index"
    >
      {{ paragraph }}
    </p>
  </div>
</template>
