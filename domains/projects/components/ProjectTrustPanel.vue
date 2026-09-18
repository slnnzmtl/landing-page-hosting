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

const facts = computed(() => [
  { label: 'Version', value: versionLabel.value },
  { label: 'Released', value: releaseDateLabel.value },
  ...props.trustFacts,
])
</script>

<template>
  <section
    aria-labelledby="project-trust-heading"
    class="space-y-3"
  >
    <h2
      id="project-trust-heading"
      class="text-2xl font-semibold"
    >
      Product information
    </h2>
    <dl class="max-w-3xl space-y-1.5 text-sm leading-relaxed text-muted-foreground">
      <div
        v-for="fact in facts"
        :key="fact.label"
        class="flex flex-wrap gap-x-2"
      >
        <dt class="font-medium text-foreground after:content-[':']">
          {{ fact.label }}
        </dt>
        <dd>
          <a
            v-if="fact.href"
            :href="fact.href"
            target="_blank"
            rel="noopener noreferrer"
            class="text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
