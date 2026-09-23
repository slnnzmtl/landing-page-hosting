<script setup lang="ts">
import type { CaseSection } from '../../data/types'
import CaseSectionFrame from './CaseSectionFrame.vue'
import CaseParagraphs from '../CaseParagraphs.vue'
import { caseBodyText, caseCardText, caseReadingWidth } from '../../utils/case-ui'

const props = defineProps<{
  section: CaseSection
}>()

const problemParagraphs = computed(() => {
  if (props.section.items.length) {
    return props.section.bodyParagraphs.slice(0, 1)
  }
  return props.section.bodyParagraphs
})

const extraParagraphs = computed(() => {
  if (!props.section.items.length) return []
  return props.section.bodyParagraphs.slice(1)
})

const painPoints = computed(() => props.section.items)
</script>

<template>
  <CaseSectionFrame
    :section="section"
    header-wide
  >
    <div
      v-if="painPoints.length"
      class="grid gap-x-8 gap-y-5 lg:grid-cols-2 lg:gap-x-12"
    >
      <div class="min-w-0 space-y-3">
        <CaseParagraphs
          :paragraphs="problemParagraphs"
          :class-name="`space-y-3 ${caseBodyText}`"
        />
        <CaseParagraphs
          v-if="extraParagraphs.length"
          :paragraphs="extraParagraphs"
          :class-name="`space-y-3 ${caseBodyText}`"
        />
      </div>
      <ul class="min-w-0 space-y-3">
        <li
          v-for="(item, index) in painPoints"
          :key="item.title || item.label || index"
          class="flex gap-3"
        >
          <span
            class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/70"
            aria-hidden="true"
          />
          <div class="min-w-0">
            <p
              v-if="item.title || item.label"
              class="text-sm font-semibold text-foreground"
            >
              {{ item.title || item.label }}
            </p>
            <p
              v-if="item.summary || item.detail"
              :class="['mt-0.5', caseCardText]"
            >
              {{ item.summary || item.detail }}
            </p>
          </div>
        </li>
      </ul>
    </div>

    <CaseParagraphs
      v-else-if="section.bodyParagraphs.length"
      :paragraphs="section.bodyParagraphs"
      :class-name="`${caseReadingWidth} space-y-4 ${caseBodyText}`"
    />
  </CaseSectionFrame>
</template>
