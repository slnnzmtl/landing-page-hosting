<script setup lang="ts">
defineProps<{
  title: string
  summary: string
}>()
</script>

<template>
  <li class="rounded-2xl border border-border bg-card p-6 shadow-sm">
    <h3 class="text-xl font-semibold text-primary">
      {{ title }}
    </h3>
    <p class="mt-3 text-sm text-muted-foreground">
      {{ summary }}
    </p>
  </li>
</template>
