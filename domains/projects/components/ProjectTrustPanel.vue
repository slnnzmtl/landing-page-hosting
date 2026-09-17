<script setup lang="ts">
import type { ProjectTrustFact } from '../data/types'
import { useMacosReleaseDownload } from '../composables/useMacosReleaseDownload'

const props = defineProps<{
  trustFacts: ProjectTrustFact[]
  githubOwner: string
  githubRepo: string
  trademark?: string
}>()

const { versionLabel, releaseDateLabel } = useMacosReleaseDownload(props.githubOwner, props.githubRepo)

const dynamicFacts = computed(() => [
  { label: 'Current version', value: versionLabel.value },
  { label: 'Release date', value: releaseDateLabel.value },
])

const linkClass = [
  'text-primary underline-offset-4 hover:underline',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
].join(' ')
</script>

<template>
  <section
    aria-labelledby="project-trust-heading"
    class="space-y-4"
  >
    <h2
      id="project-trust-heading"
      class="text-2xl font-semibold"
    >
      Product information
    </h2>
    <dl class="grid gap-3 sm:grid-cols-2">
      <div
        v-for="fact in dynamicFacts"
        :key="fact.label"
        class="rounded-2xl border border-border bg-muted/30 px-4 py-3"
      >
        <dt class="text-xs font-semibold uppercase tracking-wide text-primary">
          {{ fact.label }}
        </dt>
        <dd class="mt-1 text-sm text-muted-foreground">
          {{ fact.value }}
        </dd>
      </div>
      <div
        v-for="fact in trustFacts"
        :key="fact.label"
        class="rounded-2xl border border-border bg-muted/30 px-4 py-3"
      >
        <dt class="text-xs font-semibold uppercase tracking-wide text-primary">
          {{ fact.label }}
        </dt>
        <dd class="mt-1 text-sm text-muted-foreground">
          <a
            v-if="fact.href"
            :href="fact.href"
            target="_blank"
            rel="noopener noreferrer"
            :class="linkClass"
          >
            {{ fact.value }}
          </a>
          <template v-else>
            {{ fact.value }}
          </template>
        </dd>
      </div>
    </dl>
    <p
      v-if="trademark"
      class="text-xs leading-relaxed text-muted-foreground"
    >
      {{ trademark }}
    </p>
  </section>
</template>
