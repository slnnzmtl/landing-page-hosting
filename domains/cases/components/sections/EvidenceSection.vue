<script setup lang="ts">
import type { CaseClaim, CaseLink, CaseSection } from '../../data/types'
import CaseSectionFrame from './CaseSectionFrame.vue'
import CaseParagraphs from '../CaseParagraphs.vue'
import CaseCardGrid from '../CaseCardGrid.vue'
import { caseBodyText, casePrimaryCta, caseReadingWidth } from '../../utils/case-ui'
import { useHomepageUi } from '~/composables/useHomepageUi'
import { homepageHrefKind, opensInNewTab } from '~/data/homepage'

const props = withDefaults(defineProps<{
  section: CaseSection
  claims?: CaseClaim[]
  links?: CaseLink[]
}>(), {
  claims: () => [],
  links: () => [],
})

const { linkFocus, outboundAttrs } = useHomepageUi()

const primary = computed(() => props.links[0])
const primaryIsNative = computed(() =>
  primary.value ? homepageHrefKind(primary.value.href) === 'native' : false,
)

const claimProse = computed(() =>
  props.claims.map(claim => claim.publicWording.trim()).filter(Boolean).join(' '),
)
</script>

<template>
  <CaseSectionFrame :section="section">
    <div class="space-y-5">
      <p
        v-if="claimProse"
        :class="[caseReadingWidth, 'text-lg font-medium leading-7 text-pretty text-foreground sm:text-xl']"
      >
        {{ claimProse }}
      </p>

      <CaseParagraphs
        v-if="section.bodyParagraphs.length"
        :paragraphs="section.bodyParagraphs"
        :class-name="`${caseReadingWidth} space-y-3 ${caseBodyText}`"
      />

      <CaseCardGrid
        v-if="section.items.length"
        :items="section.items"
        :columns="3"
        compact
      />

      <div
        v-if="primary"
        class="flex flex-col gap-4 border-t border-border/50 pt-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
      >
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
    </div>
  </CaseSectionFrame>
</template>
