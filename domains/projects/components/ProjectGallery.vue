<script setup lang="ts">
import { ref } from 'vue'
import type { ProjectImage } from '../data/types'
import ProjectImageLightbox from './ProjectImageLightbox.vue'

const props = defineProps<{
  images: ProjectImage[]
}>()

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
    <ul class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <li
        v-for="(image, index) in images"
        :key="image.src"
      >
        <figure class="space-y-2">
          <button
            type="button"
            class="block w-full overflow-hidden rounded-2xl border border-border bg-[hsl(64,0%,1.43%)] text-left shadow-sm transition hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
              class="h-auto w-full"
              :style="{ aspectRatio: `${image.width} / ${image.height}` }"
            />
          </button>
          <figcaption class="text-sm text-muted-foreground">
            {{ image.caption || image.alt }}
          </figcaption>
        </figure>
      </li>
    </ul>

    <ProjectImageLightbox
      :images="images"
      :active-index="activeIndex"
      @close="close"
      @previous="showPrevious"
      @next="showNext"
    />
  </div>
</template>
