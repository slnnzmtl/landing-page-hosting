<script setup lang="ts">
import { ref } from 'vue'
import type { MediaImage } from './types'
import MediaLightbox from './MediaLightbox.vue'

const props = withDefaults(defineProps<{
  images: MediaImage[]
  /** Desktop grid columns. Cases use 2; products keep 2/3. */
  columns?: 'two' | 'three'
}>(), {
  columns: 'three',
})

const activeIndex = ref<number | null>(null)

function open(index: number) {
  activeIndex.value = index
}

function close() {
  activeIndex.value = null
}

function showPrevious() {
  if (activeIndex.value === null || props.images.length === 0) return
  activeIndex.value = (activeIndex.value + props.images.length - 1) % props.images.length
}

function showNext() {
  if (activeIndex.value === null || props.images.length === 0) return
  activeIndex.value = (activeIndex.value + 1) % props.images.length
}
</script>

<template>
  <div class="space-y-4">
    <ul
      :class="[
        'grid gap-5 sm:grid-cols-2',
        columns === 'three' ? 'lg:grid-cols-3' : '',
      ]"
    >
      <li
        v-for="(image, index) in images"
        :key="image.src"
      >
        <figure class="space-y-2">
          <button
            type="button"
            class="group relative block w-full cursor-zoom-in overflow-hidden rounded-2xl border border-border bg-card text-left shadow-sm transition hover:ring-2 hover:ring-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            :aria-label="`View full size: ${image.caption || image.alt}`"
            @click="open(index)"
          >
            <img
              :src="image.srcThumb || image.src"
              :srcset="image.srcset"
              :sizes="image.sizes"
              :alt="image.alt"
              :width="image.width"
              :height="image.height"
              loading="lazy"
              decoding="async"
              class="h-auto w-full max-w-full"
              :style="{ aspectRatio: `${image.width} / ${image.height}` }"
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
          <figcaption class="text-xs leading-5 text-foreground/75">
            {{ image.caption || image.alt }}
          </figcaption>
        </figure>
      </li>
    </ul>

    <MediaLightbox
      :images="images"
      :active-index="activeIndex"
      @close="close"
      @previous="showPrevious"
      @next="showNext"
    />
  </div>
</template>
