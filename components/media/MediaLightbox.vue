<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import type { MediaImage } from './types'

const props = defineProps<{
  images: MediaImage[]
  activeIndex: number | null
}>()

const emit = defineEmits<{
  close: []
  previous: []
  next: []
}>()

const dialogEl = ref<HTMLElement | null>(null)
const closeButton = ref<HTMLButtonElement | null>(null)
const previousOverflow = ref('')
const previousFocus = ref<HTMLElement | null>(null)

const activeImage = computed(() => {
  if (props.activeIndex === null) return undefined
  return props.images[props.activeIndex]
})

const open = computed(() => props.activeIndex !== null && Boolean(activeImage.value))

function focusableElements(): HTMLElement[] {
  if (!dialogEl.value) return []
  return [...dialogEl.value.querySelectorAll<HTMLElement>(
    'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
  )]
}

function onKeydown(event: KeyboardEvent) {
  if (!open.value) return
  if (event.key === 'Escape') {
    event.preventDefault()
    emit('close')
    return
  }
  if (event.key === 'ArrowLeft' && props.images.length > 1) {
    event.preventDefault()
    emit('previous')
    return
  }
  if (event.key === 'ArrowRight' && props.images.length > 1) {
    event.preventDefault()
    emit('next')
    return
  }
  if (event.key === 'Tab') {
    const nodes = focusableElements()
    if (nodes.length === 0) return
    const first = nodes[0]!
    const last = nodes[nodes.length - 1]!
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    }
    else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }
}

function lockScroll() {
  previousOverflow.value = document.documentElement.style.overflow
  document.documentElement.style.overflow = 'hidden'
}

function unlockScroll() {
  document.documentElement.style.overflow = previousOverflow.value
}

watch(open, async (isOpen) => {
  if (isOpen) {
    previousFocus.value = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null
    lockScroll()
    window.addEventListener('keydown', onKeydown)
    await nextTick()
    closeButton.value?.focus()
    return
  }
  window.removeEventListener('keydown', onKeydown)
  unlockScroll()
  previousFocus.value?.focus()
  previousFocus.value = null
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  unlockScroll()
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open && activeImage && activeIndex !== null"
      ref="dialogEl"
      class="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="`media-fullsize-title-${activeIndex}`"
      @click.self="emit('close')"
    >
      <div class="flex max-h-full w-full max-w-5xl flex-col gap-4">
        <div class="flex items-start justify-between gap-4">
          <h3
            :id="`media-fullsize-title-${activeIndex}`"
            class="text-base font-medium text-foreground"
          >
            {{ activeImage.caption || activeImage.alt }}
          </h3>
          <button
            ref="closeButton"
            type="button"
            class="rounded-full border border-border px-3 py-1 text-sm text-foreground transition hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
          <div
            v-if="images.length > 1"
            class="flex gap-2"
          >
            <button
              type="button"
              class="rounded-full border border-border px-3 py-1 text-sm text-foreground transition hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              @click="emit('previous')"
            >
              Previous
            </button>
            <button
              type="button"
              class="rounded-full border border-border px-3 py-1 text-sm text-foreground transition hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              @click="emit('next')"
            >
              Next
            </button>
          </div>
          <a
            :href="activeImage.src"
            target="_blank"
            rel="noopener noreferrer"
            class="text-sm font-medium text-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Open full-size image
          </a>
        </div>
      </div>
    </div>
  </Teleport>
</template>
