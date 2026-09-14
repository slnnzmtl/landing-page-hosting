<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import type { ProjectImage } from '../data/types'

const props = defineProps<{
  images: ProjectImage[]
}>()

const activeIndex = ref<number | null>(null)
const closeButton = ref<HTMLButtonElement | null>(null)

const activeImage = computed(() => {
  if (activeIndex.value === null) return undefined
  return props.images[activeIndex.value]
})

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

function onKeydown(event: KeyboardEvent) {
  if (activeIndex.value === null) return
  if (event.key === 'Escape') {
    event.preventDefault()
    close()
  }
  else if (event.key === 'ArrowLeft') {
    event.preventDefault()
    showPrevious()
  }
  else if (event.key === 'ArrowRight') {
    event.preventDefault()
    showNext()
  }
}

watch(activeIndex, (index) => {
  if (index === null) {
    window.removeEventListener('keydown', onKeydown)
    return
  }
  window.addEventListener('keydown', onKeydown)
  requestAnimationFrame(() => closeButton.value?.focus())
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
})
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
            class="block w-full overflow-hidden rounded-2xl border border-border bg-slate-950 text-left shadow-sm transition hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            :aria-label="`View full size: ${image.caption || image.alt}`"
            @click="open(index)"
          >
            <img
              :src="image.src"
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

    <div
      v-if="activeImage && activeIndex !== null"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-4"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="`gallery-fullsize-title-${activeIndex}`"
      @click.self="close"
    >
      <div class="flex max-h-full w-full max-w-5xl flex-col gap-4">
        <div class="flex items-start justify-between gap-4">
          <h3
            :id="`gallery-fullsize-title-${activeIndex}`"
            class="text-base font-medium text-slate-100"
          >
            {{ activeImage.caption || activeImage.alt }}
          </h3>
          <button
            ref="closeButton"
            type="button"
            class="rounded-full border border-slate-600 px-3 py-1 text-sm text-slate-100 transition hover:border-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            @click="close"
          >
            Close
          </button>
        </div>
        <img
          :src="activeImage.src"
          :alt="activeImage.alt"
          :width="activeImage.width"
          :height="activeImage.height"
          class="max-h-[75vh] w-full object-contain"
        />
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div class="flex gap-2">
            <button
              type="button"
              class="rounded-full border border-slate-600 px-3 py-1 text-sm text-slate-100 transition hover:border-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              :disabled="images.length < 2"
              @click="showPrevious"
            >
              Previous
            </button>
            <button
              type="button"
              class="rounded-full border border-slate-600 px-3 py-1 text-sm text-slate-100 transition hover:border-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              :disabled="images.length < 2"
              @click="showNext"
            >
              Next
            </button>
          </div>
          <a
            :href="activeImage.src"
            target="_blank"
            rel="noopener noreferrer"
            class="text-sm font-medium text-slate-100 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Open full-size image
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
