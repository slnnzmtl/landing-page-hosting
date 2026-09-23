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
        class="relative rounded-xl border border-border/60 bg-card/50 p-3.5"
      >
        <span
          class="mb-2 inline-flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15 text-primary"
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
        <div
          v-if="index < section.items.length - 1"
          class="pointer-events-none absolute -right-2.5 top-1/2 hidden h-px w-5 bg-border sm:block"
          aria-hidden="true"
        />
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
