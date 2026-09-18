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

const allFacts = computed(() => [...dynamicFacts.value, ...props.trustFacts])

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
    <dl class="max-w-3xl space-y-2 text-sm leading-relaxed text-muted-foreground">
      <div
        v-for="fact in allFacts"
        :key="fact.label"
      >
        <dt class="sr-only">
          {{ fact.label }}
        </dt>
        <dd>
          <span class="font-medium text-foreground">{{ fact.label }}:</span>
          {{ ' ' }}
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
      class="max-w-3xl text-xs leading-relaxed text-muted-foreground"
    >
      {{ trademark }}
    </p>
  </section>
</template>
