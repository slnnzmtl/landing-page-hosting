<script setup lang="ts">
import { MessageSquare, Mic, PanelBottom, type LucideIcon } from 'lucide-vue-next'
import type { CaseImage, CaseSection, CaseSectionItem } from '../../data/types'
import CaseSectionFrame from './CaseSectionFrame.vue'
import CaseParagraphs from '../CaseParagraphs.vue'
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

function itemIcon(item: CaseSectionItem): LucideIcon | null {
  const key = (item.title || item.label || '').toLowerCase()
  if (key.includes('text')) return MessageSquare
  if (key.includes('voice')) return Mic
  if (key.includes('guided') || key.includes('control')) return PanelBottom
  return null
}

function itemKey(item: CaseSectionItem, index: number) {
  return item.title || item.label || index
}
</script>

<template>
  <CaseSectionFrame :section="section">
    <CaseParagraphs
      v-if="section.bodyParagraphs.length"
      :paragraphs="section.bodyParagraphs"
      :class-name="`${caseReadingWidth} space-y-3 ${caseBodyText}`"
    />

    <ol
      v-if="section.items.length"
      class="grid gap-3 sm:grid-cols-3"
    >
      <li
        v-for="(item, index) in section.items"
        :key="itemKey(item, index)"
        class="relative border-l border-border/70 py-1 pl-3 first:border-l-0 first:pl-0 sm:border-l sm:first:border-l-0"
      >
        <span
          class="mb-2 inline-flex h-7 w-7 items-center justify-center rounded-lg bg-primary/12 text-primary"
          aria-hidden="true"
        >
          <component
            :is="itemIcon(item)!"
            v-if="itemIcon(item)"
            class="h-3.5 w-3.5"
          />
          <span
            v-else
            class="text-xs font-semibold"
          >{{ index + 1 }}</span>
        </span>
        <h3
          v-if="item.title || item.label"
          class="text-sm font-semibold text-foreground"
        >
          {{ item.title || item.label }}
        </h3>
        <p
          v-if="item.summary || item.detail"
          :class="['mt-1', caseCardText]"
        >
          {{ item.summary || item.detail }}
        </p>
      </li>
    </ol>

    <div
      v-if="media.length"
      class="w-full space-y-5"
    >
      <CaseMedia
        v-for="(image, index) in media"
        :key="`${section.id}-media-${index}`"
        :image="image"
        size="wide"
        @open="open(index)"
      />
    </div>
  </CaseSectionFrame>
</template>
