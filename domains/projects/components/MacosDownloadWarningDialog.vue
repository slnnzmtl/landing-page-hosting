<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'

const props = defineProps<{
  open: boolean
  message: string
}>()

const emit = defineEmits<{
  close: []
  confirm: []
}>()

const confirmButton = ref<HTMLButtonElement | null>(null)

function onKeydown(event: KeyboardEvent) {
  if (!props.open) return
  if (event.key === 'Escape') {
    event.preventDefault()
    emit('close')
  }
}

watch(() => props.open, (isOpen) => {
  if (!isOpen) {
    window.removeEventListener('keydown', onKeydown)
    return
  }
  window.addEventListener('keydown', onKeydown)
  requestAnimationFrame(() => confirmButton.value?.focus())
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center bg-[hsl(64,0%,1.43%)]/90 p-4"
    role="dialog"
    aria-modal="true"
    aria-labelledby="macos-download-warning-title"
    @click.self="emit('close')"
  >
    <div class="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-lg">
      <h2
        id="macos-download-warning-title"
        class="text-lg font-semibold"
      >
        Before you open the app
      </h2>
      <p class="mt-3 text-sm text-muted-foreground">
        {{ message }}
      </p>
      <div class="mt-6 flex flex-wrap justify-end gap-3">
        <button
          type="button"
          class="inline-flex items-center justify-center rounded-full border border-border px-5 py-2.5 text-sm font-medium transition hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          @click="emit('close')"
        >
          Cancel
        </button>
        <button
          ref="confirmButton"
          type="button"
          class="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          @click="emit('confirm')"
        >
          Download
        </button>
      </div>
    </div>
  </div>
</template>
