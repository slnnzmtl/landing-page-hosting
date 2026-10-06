<script setup lang="ts">
import { computed } from 'vue'
import type { CaseImage } from '../data/types'
import { caseCaptionText } from '../utils/case-ui'
import { useHomepageUi } from '~/composables/useHomepageUi'

const props = withDefaults(defineProps<{
  image: CaseImage
  className?: string
  /** Prefer high for LCP hero media only. */
  priority?: boolean
  /** Override default size treatment for hero breakout. */
  size?: 'default' | 'hero' | 'wide' | 'screenshot'
}>(), {
  priority: false,
  size: 'default',
})

const emit = defineEmits<{
  open: []
}>()

const { linkFocus } = useHomepageUi()

const isDiagram = computed(() =>
  props.image.presentation === 'diagram',
)

function frameClass(presentation?: CaseImage['presentation']) {
  if (isDiagram.value) {
    return 'bg-transparent'
  }
  if (presentation === 'screenshot' || presentation === 'gallery') {
    return 'bg-transparent ring-1 ring-border shadow-sm'
  }
  return 'bg-card border border-border shadow-sm'
}

function imageClass() {
  if (props.size === 'hero') {
    return 'mx-auto h-auto max-h-[42rem] w-auto max-w-full object-contain'
  }
  if (props.size === 'wide') {
    return 'mx-auto h-auto max-h-[42rem] w-auto max-w-full object-contain'
  }
  if (props.size === 'screenshot' || props.image.presentation === 'screenshot' || props.image.presentation === 'gallery') {
    return 'mx-auto h-auto max-h-[32rem] w-auto max-w-full object-contain'
  }
  if (isDiagram.value) {
    return 'mx-auto h-auto max-h-[36rem] w-auto max-w-full object-contain'
  }
  return 'mx-auto h-auto max-h-96 w-auto max-w-full object-contain'
}

const sizes = computed(() => {
  if (props.size === 'screenshot' || props.image.presentation === 'screenshot' || props.image.presentation === 'gallery') {
    return '(max-width: 1024px) 92vw, 50vw'
  }
  if (props.size === 'hero' || props.size === 'wide') {
    return '(max-width: 1024px) 92vw, 40rem'
  }
  return '(max-width: 1024px) 92vw, 40rem'
})
</script>

<template>
  <figure :class="className || 'space-y-2'">
    <button
      type="button"
      :class="[
        'group relative mx-auto block w-full max-w-full cursor-zoom-in overflow-hidden text-left transition hover:ring-2 hover:ring-primary/40',
        isDiagram ? 'rounded-none' : 'rounded-2xl',
        frameClass(image.presentation),
        linkFocus,
      ]"
      :aria-label="`View full size: ${image.caption || image.alt}`"
      @click="emit('open')"
    >
      <img
        :src="image.srcThumb || image.src"
        :srcset="image.srcset"
        :sizes="sizes"
        :alt="image.alt"
        :width="image.width"
        :height="image.height"
        :loading="priority ? 'eager' : 'lazy'"
        :fetchpriority="priority ? 'high' : undefined"
        decoding="async"
        :class="imageClass()"
      />
      <span
        class="pointer-events-none absolute inset-0 flex items-end justify-end bg-gradient-to-t from-black/50 via-transparent to-transparent p-3 opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100"
        aria-hidden="true"
      >
        <span class="rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white">
          View
        </span>
      </span>
    </button>
    <figcaption
      v-if="image.caption"
      :class="caseCaptionText"
    >
      {{ image.caption }}
    </figcaption>
  </figure>
</template>
