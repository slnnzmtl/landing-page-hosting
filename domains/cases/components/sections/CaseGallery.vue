<script setup lang="ts">
import { inject } from 'vue'
import type { CaseImage, CaseSection } from '../../data/types'
import CaseSectionFrame from './CaseSectionFrame.vue'
import CaseParagraphs from '../CaseParagraphs.vue'
import CaseMedia from '../CaseMedia.vue'
import { openCaseLightboxKey } from '../../utils/lightbox'
import { caseBodyText, caseReadingWidth } from '../../utils/case-ui'

const props = defineProps<{
  section: CaseSection
  media: CaseImage[]
}>()

const openLightbox = inject(openCaseLightboxKey)

function open(index: number) {
  if (!openLightbox || props.media.length === 0) return
  openLightbox(props.media, index)
}
</script>

<template>
  <CaseSectionFrame :section="section">
    <CaseParagraphs
      v-if="section.bodyParagraphs.length"
      :paragraphs="section.bodyParagraphs"
      :class-name="`${caseReadingWidth} space-y-3 ${caseBodyText}`"
    />

    <div
      v-if="media.length"
      :class="[
        section.layout === 'split'
          ? 'grid gap-6 sm:grid-cols-2 sm:items-start'
          : 'flex w-full flex-col gap-6',
      ]"
    >
      <CaseMedia
        v-for="(image, index) in media"
        :key="`${section.id}-media-${index}`"
        :image="image"
        size="screenshot"
        class-name="w-full space-y-2"
        @open="open(index)"
      />
    </div>
  </CaseSectionFrame>
</template>
