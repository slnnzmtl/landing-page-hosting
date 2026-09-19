<script setup lang="ts">
defineProps<{
  to: string
}>()
</script>

<template>
  <NuxtLink
    :to="to"
    class="group inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
  >
    <svg
      viewBox="0 0 20 20"
      fill="none"
      class="-ml-0.5 h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5"
      aria-hidden="true"
    >
      <path
        d="M12 15l-5-5 5-5"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
    <slot />
  </NuxtLink>
</template>
