<script setup lang="ts">
import type { ProductLaunch } from '../data/types'

const props = defineProps<{
  launch: ProductLaunch
}>()

const primaryCta = computed(() => props.launch.ctas.find(cta => cta.kind === 'primary'))
const secondaryCtas = computed(() => props.launch.ctas.filter(cta => cta.kind === 'secondary'))

function isExternal(href: string): boolean {
  return /^(?:https?:|mailto:|tel:)/i.test(href)
}

const primaryClass = [
  'inline-flex w-full items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 sm:w-auto',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
].join(' ')

const linkClass = [
  'w-full text-center text-sm font-medium text-primary underline-offset-4 hover:underline sm:w-auto sm:text-left',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
].join(' ')
</script>

<template>
  <div class="flex w-full flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-start sm:gap-x-5 sm:gap-y-3">
    <a
      v-if="primaryCta"
      :href="primaryCta.href"
      :target="isExternal(primaryCta.href) ? '_blank' : undefined"
      :rel="isExternal(primaryCta.href) ? 'noopener noreferrer' : undefined"
      :class="primaryClass"
    >
      {{ primaryCta.label }}
    </a>
    <a
      v-for="cta in secondaryCtas"
      :key="cta.label"
      :href="cta.href"
      :target="isExternal(cta.href) ? '_blank' : undefined"
      :rel="isExternal(cta.href) ? 'noopener noreferrer' : undefined"
      :class="linkClass"
    >
      {{ cta.label }}
    </a>
  </div>
</template>
