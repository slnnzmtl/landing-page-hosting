<script setup lang="ts">
import { computed } from 'vue'
import { homepageHrefKind, externalLinkRel, opensInNewTab } from '~/data/homepage'

const props = defineProps<{
  href?: string
  ariaLabel?: string
}>()

const isInteractive = computed(() => Boolean(props.href))
const isNativeLink = computed(() => props.href ? homepageHrefKind(props.href) === 'native' : false)
const cardClass = computed(() => [
  'relative flex h-full overflow-hidden rounded-2xl border border-border bg-card',
  isInteractive.value
    ? 'group transition-[box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] shadow-sm hover:shadow-white/50 active:shadow-white'
    : undefined,
])
const linkClass = 'absolute inset-0 z-0 rounded-[inherit] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
</script>

<template>
  <article :class="cardClass">
    <a
      v-if="isInteractive && isNativeLink"
      :href="props.href"
      :target="opensInNewTab(props.href!) ? '_blank' : undefined"
      :rel="externalLinkRel(props.href!)"
      :aria-label="ariaLabel"
      :class="linkClass"
    />
    <NuxtLink
      v-else-if="isInteractive"
      :to="props.href!"
      :aria-label="ariaLabel"
      :class="linkClass"
    />
    <div class="relative z-10 pointer-events-none">
      <slot />
    </div>
  </article>
</template>
