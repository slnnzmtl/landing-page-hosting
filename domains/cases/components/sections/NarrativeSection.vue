<script setup lang="ts">
import { computed } from 'vue'
import type { CaseSection } from '../../data/types'
import CaseSectionFrame from './CaseSectionFrame.vue'
import CaseParagraphs from '../CaseParagraphs.vue'
import { caseBodyText, caseCardText } from '../../utils/case-ui'

const props = defineProps<{
  section: CaseSection
}>()

const isSplit = computed(() => props.section.layout === 'split')
</script>

<template>
  <CaseSectionFrame
    :section="section"
    header-wide
  >
    <div
      v-if="section.bodyParagraphs.length || section.items.length"
      :class="[
        'grid gap-x-8 gap-y-6',
        isSplit ? 'lg:grid-cols-2 lg:gap-x-12' : 'max-w-[70ch]',
      ]"
    >
      <CaseParagraphs
        v-if="section.bodyParagraphs.length"
        :paragraphs="section.bodyParagraphs"
        :class-name="`space-y-3 ${caseBodyText}`"
      />
      <ul
        v-if="section.items.length"
        class="min-w-0 space-y-3"
        :class="isSplit ? '' : 'border-t border-border/50 pt-5'"
      >
        <li
          v-for="(item, index) in section.items"
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
  </CaseSectionFrame>
</template>
