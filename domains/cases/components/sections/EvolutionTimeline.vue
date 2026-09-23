<script setup lang="ts">
import type { CaseSection } from '../../data/types'
import CaseSectionFrame from './CaseSectionFrame.vue'
import CaseParagraphs from '../CaseParagraphs.vue'
import { caseBodyText, caseCardText, caseReadingWidth } from '../../utils/case-ui'

defineProps<{
  section: CaseSection
}>()
</script>

<template>
  <CaseSectionFrame :section="section">
    <CaseParagraphs
      v-if="section.bodyParagraphs.length"
      :paragraphs="section.bodyParagraphs"
      :class-name="`${caseReadingWidth} space-y-3 ${caseBodyText}`"
    />

    <!-- Mobile: vertical spine. Desktop: 2×2 milestone grid. -->
    <ol class="relative grid gap-6 md:grid-cols-2 md:gap-x-8 md:gap-y-8">
      <li
        v-for="(item, index) in section.items"
        :key="item.title || item.label || index"
        class="relative flex min-w-0 gap-4 md:gap-3"
      >
        <!-- Vertical spine (mobile) -->
        <div
          v-if="index < section.items.length - 1"
          class="absolute bottom-0 left-[1.125rem] top-9 w-px bg-border md:hidden"
          aria-hidden="true"
        />

        <div class="relative z-10 flex shrink-0 items-start">
          <span
            class="relative z-10 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-background text-sm font-semibold text-primary"
            aria-hidden="true"
          >
            {{ index + 1 }}
          </span>
        </div>

        <div class="relative z-10 min-w-0 space-y-1 pb-2 md:pb-0">
          <h3
            v-if="item.title || item.label"
            class="text-sm font-semibold leading-snug text-foreground md:text-[0.9375rem]"
          >
            {{ item.title || item.label }}
          </h3>
          <p
            v-if="item.summary || item.detail"
            :class="caseCardText"
          >
            {{ item.summary || item.detail }}
          </p>
        </div>
      </li>
    </ol>
  </CaseSectionFrame>
</template>
