<script setup lang="ts">
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

const primary = computed(() => props.media[0])
const secondary = computed(() => props.media.slice(1))
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
      class="grid gap-5 lg:grid-cols-3 lg:items-start"
    >
      <CaseMedia
        v-if="primary"
        :image="primary"
        size="screenshot"
        crop
        class-name="space-y-2 lg:col-span-2"
        @open="open(0)"
      />
      <CaseMedia
        v-for="(image, index) in secondary"
        :key="`${section.id}-media-${index + 1}`"
        :image="image"
        size="screenshot"
        crop
        class-name="space-y-2 lg:col-span-1"
        @open="open(index + 1)"
      />
    </div>
  </CaseSectionFrame>
</template>
