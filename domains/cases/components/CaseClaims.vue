<script setup lang="ts">
import type { CaseClaim, CaseLink } from '../data/types'
import { caseBodyText, casePrimaryCta, caseStackTag } from '../utils/case-ui'
import { useHomepageUi } from '~/composables/useHomepageUi'
import { homepageHrefKind, opensInNewTab } from '~/data/homepage'

const props = defineProps<{
  heading: string
  claims: CaseClaim[]
  links?: CaseLink[]
  stackTags?: string[]
}>()

const { linkFocus, outboundAttrs } = useHomepageUi()

const primary = computed(() => props.links?.[0])
const primaryIsNative = computed(() =>
  primary.value ? homepageHrefKind(primary.value.href) === 'native' : false,
)

const claimProse = computed(() =>
  props.claims.map(claim => claim.publicWording.trim()).filter(Boolean).join(' '),
)

const show = computed(() =>
  Boolean(claimProse.value || primary.value || props.stackTags?.length),
)
</script>

<template>
  <section
    v-if="show"
    aria-labelledby="case-claims-heading"
    class="space-y-5"
  >
    <h2
      id="case-claims-heading"
      class="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
    >
      {{ heading }}
    </h2>

    <p
      v-if="claimProse"
      :class="['max-w-[70ch]', caseBodyText]"
    >
      {{ claimProse }}
    </p>

    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <ul
        v-if="stackTags?.length"
        class="flex flex-wrap gap-2"
        aria-label="Repository stack"
      >
        <li
          v-for="tag in stackTags"
          :key="tag"
          :class="caseStackTag"
        >
          {{ tag }}
        </li>
      </ul>

      <a
        v-if="primary && primaryIsNative"
        :href="primary.href"
        v-bind="outboundAttrs(primary.href)"
        :class="[casePrimaryCta, linkFocus, 'shrink-0']"
      >
        {{ primary.label }}
        <span
          v-if="opensInNewTab(primary.href)"
          aria-hidden="true"
        >↗</span>
        <span
          v-if="opensInNewTab(primary.href)"
          class="sr-only"
        >(opens in a new tab)</span>
      </a>
      <NuxtLink
        v-else-if="primary"
        :to="primary.href"
        :class="[casePrimaryCta, linkFocus, 'shrink-0']"
      >
        {{ primary.label }}
      </NuxtLink>
    </div>
  </section>
</template>
