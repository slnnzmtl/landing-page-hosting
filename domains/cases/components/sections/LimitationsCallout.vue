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
    <div class="space-y-4">
      <CaseParagraphs
        v-if="section.bodyParagraphs.length"
        :paragraphs="section.bodyParagraphs"
        :class-name="`${caseReadingWidth} space-y-3 ${caseBodyText}`"
      />
      <ul
        v-if="section.items.length"
        class="max-w-2xl space-y-3"
      >
        <li
          v-for="(item, index) in section.items"
          :key="item.title || item.label || index"
          class="flex gap-3"
          :class="caseCardText"
        >
          <span
            class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/70"
            aria-hidden="true"
          />
          <span>
            <span
              v-if="item.title || item.label"
              class="font-medium text-foreground"
            >{{ item.title || item.label }}{{ item.summary || item.detail ? ' — ' : '' }}</span>
            {{ item.summary || item.detail }}
          </span>
        </li>
      </ul>
    </div>
  </CaseSectionFrame>
</template>
