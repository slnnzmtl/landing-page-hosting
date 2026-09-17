<script setup lang="ts">
import type { ProjectLaunch } from '../data/types'
import { useMacosReleaseDownload } from '../composables/useMacosReleaseDownload'

const props = defineProps<{
  launch: ProjectLaunch
  githubOwner: string
  githubRepo: string
}>()

const { ctaHref } = useMacosReleaseDownload(props.githubOwner, props.githubRepo)

const primaryCta = computed(() => props.launch.ctas.find(cta => cta.kind === 'primary'))
const secondaryCtas = computed(() => props.launch.ctas.filter(cta => cta.kind === 'secondary'))

const primaryClass = [
  'inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
].join(' ')

const secondaryClass = [
  'inline-flex items-center justify-center rounded-full border border-border px-5 py-2.5 text-sm font-medium transition hover:border-primary hover:text-primary',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
].join(' ')
</script>

<template>
  <div class="flex flex-wrap items-center gap-3">
    <a
      v-if="primaryCta"
      :href="ctaHref(primaryCta)"
      target="_blank"
      rel="noopener noreferrer"
      :class="primaryClass"
    >
      {{ primaryCta.label }}
    </a>
    <a
      v-for="cta in secondaryCtas"
      :key="cta.label"
      :href="ctaHref(cta)"
      target="_blank"
      rel="noopener noreferrer"
      :class="secondaryClass"
    >
      {{ cta.label }}
    </a>
  </div>
</template>
