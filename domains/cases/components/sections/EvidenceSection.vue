<script setup lang="ts">
import type { CaseSection } from '../../data/types'
import CaseSectionFrame from './CaseSectionFrame.vue'
import CaseParagraphs from '../CaseParagraphs.vue'
import CaseCardGrid from '../CaseCardGrid.vue'
import { caseBodyText, caseReadingWidth } from '../../utils/case-ui'

const { section } = defineProps<{
  section: CaseSection
}>()
</script>

<template>
  <CaseSectionFrame :section="section">
    <div class="space-y-5">
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
    </div>
  </CaseSectionFrame>
</template>
