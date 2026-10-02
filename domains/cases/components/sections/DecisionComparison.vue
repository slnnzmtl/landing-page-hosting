<script setup lang="ts">
import { computed } from 'vue'
import type { CaseSection, CaseSectionItem } from '../../data/types'
import CaseSectionFrame from './CaseSectionFrame.vue'
import CaseParagraphs from '../CaseParagraphs.vue'
import { caseBodyText, caseCardText, caseReadingWidth } from '../../utils/case-ui'

const props = defineProps<{
  section: CaseSection
}>()

/** When items use exactly two distinct labels, render as a comparison table. */
const comparisonColumns = computed(() => {
  if (props.section.layout === 'text') return null
  const labels = [
    ...new Set(
      props.section.items
        .map(item => item.label?.trim())
        .filter((label): label is string => Boolean(label)),
    ),
  ]
  if (labels.length !== 2) return null
  return labels.map(label => ({
    label,
    items: props.section.items.filter(item => item.label?.trim() === label),
  }))
})

function itemCopy(item: CaseSectionItem) {
  return item.title || item.summary || item.detail || ''
}

const flatItems = computed(() => props.section.items)

const isTextLayout = computed(() => props.section.layout === 'text')
</script>

<template>
  <CaseSectionFrame :section="section">
    <CaseParagraphs
      v-if="section.bodyParagraphs.length"
      :paragraphs="section.bodyParagraphs"
      :class-name="`${caseReadingWidth} space-y-4 ${caseBodyText}`"
    />

    <ol
      v-if="isTextLayout"
      class="max-w-[70ch] space-y-5"
    >
      <li
        v-for="(item, index) in flatItems"
        :key="item.title || item.label || index"
        class="space-y-1 border-t border-border/70 pt-4"
      >
        <p
          v-if="item.label"
          class="text-xs font-semibold uppercase tracking-wide text-primary"
        >
          {{ item.label }}
        </p>
        <h3
          v-if="item.title"
          class="text-lg font-semibold text-foreground"
        >
          {{ item.title }}
        </h3>
        <p
          v-if="item.summary || item.detail"
          :class="caseCardText"
        >
          {{ item.summary || item.detail }}
        </p>
      </li>
    </ol>

    <div
      v-else-if="comparisonColumns"
      class="grid gap-8 sm:grid-cols-2 sm:gap-10"
    >
      <div
        v-for="column in comparisonColumns"
        :key="column.label"
        class="min-w-0 space-y-4"
      >
        <h3 class="text-xs font-semibold uppercase tracking-wide text-primary">
          {{ column.label }}
        </h3>
        <ul class="space-y-3 border-t border-border/70 pt-4">
          <li
            v-for="(item, index) in column.items"
            :key="item.title || item.summary || index"
            :class="caseCardText"
          >
            {{ itemCopy(item) }}
          </li>
        </ul>
      </div>
    </div>

    <div
      v-else
      class="grid gap-6 sm:grid-cols-2 sm:gap-8"
    >
      <div
        v-for="(item, index) in flatItems"
        :key="item.title || item.label || index"
        class="space-y-2 border-t border-border/70 pt-4"
        :class="index === flatItems.length - 1 && flatItems.length % 2 === 1 ? 'sm:col-span-2' : ''"
      >
        <p
          v-if="item.label"
          class="text-xs font-semibold uppercase tracking-wide text-primary"
        >
          {{ item.label }}
        </p>
        <h3
          v-if="item.title"
          class="text-lg font-semibold text-foreground"
        >
          {{ item.title }}
        </h3>
        <p
          v-if="item.summary || item.detail"
          :class="caseCardText"
        >
          {{ item.summary || item.detail }}
        </p>
      </div>
    </div>
  </CaseSectionFrame>
</template>
