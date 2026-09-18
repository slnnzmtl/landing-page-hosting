<script setup lang="ts">
import type { ProjectLaunch, ProjectLaunchCta } from '../data/types'
import { useMacosReleaseDownload } from '../composables/useMacosReleaseDownload'
import MacosDownloadWarningDialog from './MacosDownloadWarningDialog.vue'

const props = defineProps<{
  launch: ProjectLaunch
  githubOwner: string
  githubRepo: string
}>()

const { ctaHref } = useMacosReleaseDownload(props.githubOwner, props.githubRepo)

const primaryCta = computed(() => props.launch.ctas.find(cta => cta.kind === 'primary'))
const secondaryCtas = computed(() => props.launch.ctas.filter(cta => cta.kind === 'secondary'))

const downloadWarningOpen = ref(false)
const pendingDownloadHref = ref('')

const primaryUsesDownloadWarning = computed(() =>
  Boolean(props.launch.macosDownloadWarning && primaryCta.value?.macosDownload),
)

function openDownloadWarning(cta: ProjectLaunchCta) {
  pendingDownloadHref.value = ctaHref(cta)
  downloadWarningOpen.value = true
}

function closeDownloadWarning() {
  downloadWarningOpen.value = false
}

function confirmDownload() {
  const url = pendingDownloadHref.value
  downloadWarningOpen.value = false
  if (url) {
    window.open(url, '_blank', 'noopener,noreferrer')
  }
}

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
    <button
      v-if="primaryCta && primaryUsesDownloadWarning"
      type="button"
      :class="primaryClass"
      @click="openDownloadWarning(primaryCta)"
    >
      {{ primaryCta.label }}
    </button>
    <a
      v-else-if="primaryCta"
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
    <MacosDownloadWarningDialog
      v-if="launch.macosDownloadWarning"
      :open="downloadWarningOpen"
      :message="launch.macosDownloadWarning"
      @close="closeDownloadWarning"
      @confirm="confirmDownload"
    />
  </div>
</template>
