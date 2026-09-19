<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import type { ProjectImage } from '../data/types'

const props = defineProps<{
  images: ProjectImage[]
  activeIndex: number | null
}>()

const emit = defineEmits<{
  close: []
  previous: []
  next: []
}>()

const closeButton = ref<HTMLButtonElement | null>(null)

const activeImage = computed(() => {
  if (props.activeIndex === null) return undefined
  return props.images[props.activeIndex]
})

function onKeydown(event: KeyboardEvent) {
  if (props.activeIndex === null) return
  if (event.key === 'Escape') {
    event.preventDefault()
    emit('close')
  }
  else if (event.key === 'ArrowLeft') {
    event.preventDefault()
    emit('previous')
  }
  else if (event.key === 'ArrowRight') {
    event.preventDefault()
    emit('next')
  }
}

watch(() => props.activeIndex, (index) => {
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
  <div
    v-if="activeImage && activeIndex !== null"
    class="fixed inset-0 z-50 flex items-center justify-center bg-[hsl(64,0%,1.43%)]/90 p-4"
    role="dialog"
    aria-modal="true"
    :aria-labelledby="`gallery-fullsize-title-${activeIndex}`"
    @click.self="emit('close')"
  >
    <div class="flex max-h-full w-full max-w-5xl flex-col gap-4">
      <div class="flex items-start justify-between gap-4">
        <h3
          :id="`gallery-fullsize-title-${activeIndex}`"
          class="text-base font-medium text-[hsl(64,0%,98%)]"
        >
          {{ activeImage.caption || activeImage.alt }}
        </h3>
        <button
          ref="closeButton"
          type="button"
          class="rounded-full border border-[hsl(64,0%,98%)]/30 px-3 py-1 text-sm text-[hsl(64,0%,98%)] transition hover:border-[hsl(64,0%,98%)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          @click="emit('close')"
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
            class="rounded-full border border-[hsl(64,0%,98%)]/30 px-3 py-1 text-sm text-[hsl(64,0%,98%)] transition hover:border-[hsl(64,0%,98%)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            :disabled="images.length < 2"
            @click="emit('previous')"
          >
            Previous
          </button>
          <button
            type="button"
            class="rounded-full border border-[hsl(64,0%,98%)]/30 px-3 py-1 text-sm text-[hsl(64,0%,98%)] transition hover:border-[hsl(64,0%,98%)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            :disabled="images.length < 2"
            @click="emit('next')"
          >
            Next
          </button>
        </div>
        <a
          :href="activeImage.src"
          target="_blank"
          rel="noopener noreferrer"
          class="text-sm font-medium text-[hsl(64,0%,98%)] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Open full-size image
        </a>
      </div>
    </div>
  </div>
</template>
