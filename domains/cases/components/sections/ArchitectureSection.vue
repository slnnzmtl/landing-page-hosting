<script setup lang="ts">
import type { CaseImage, CaseSection } from '../../data/types'
import CaseSectionFrame from './CaseSectionFrame.vue'
import CaseMedia from '../CaseMedia.vue'
import { openCaseLightboxKey } from '../../utils/lightbox'
import { caseBodyText, caseCardText, caseReadingWidth } from '../../utils/case-ui'

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
  <CaseSectionFrame
    :section="section"
    header-wide
  >
    <div
      v-if="section.bodyParagraphs.length"
      :class="[caseReadingWidth, 'space-y-3']"
    >
      <p
        v-for="(paragraph, index) in section.bodyParagraphs"
        :key="index"
        :class="caseBodyText"
      >
        {{ paragraph }}
      </p>
    </div>

    <div
      v-if="media.length || section.items.length"
      class="flex w-full flex-col gap-5 lg:gap-6"
    >
      <ul
        v-if="section.items.length"
        class="order-2 grid gap-y-5 sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-4 lg:gap-x-6"
      >
        <li
          v-for="(item, index) in section.items"
          :key="item.title || item.label || index"
          class="border-l border-primary/50 pl-3.5"
        >
          <p
            v-if="item.label || item.title"
            class="text-xs font-semibold uppercase tracking-wide text-primary"
          >
            {{ item.label || item.title }}
          </p>
          <p
            v-if="item.summary || item.detail"
            :class="['mt-1', caseCardText]"
          >
            {{ item.summary || item.detail }}
          </p>
        </li>
      </ul>

      <div
        v-if="media.length"
        class="order-1 -mx-1 w-[calc(100%+0.5rem)] space-y-2 sm:mx-0 sm:w-full"
      >
        <CaseMedia
          v-for="(image, index) in media"
          :key="`${section.id}-media-${index}`"
          :image="image"
          size="wide"
          @open="open(index)"
        />
      </div>
    </div>
  </CaseSectionFrame>
</template>
