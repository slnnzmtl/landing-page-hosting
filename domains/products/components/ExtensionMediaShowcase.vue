<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ProductMedia } from '../data/types'
import MediaLightbox from '~/components/media/MediaLightbox.vue'

const props = withDefaults(defineProps<{
  before: ProductMedia
  after: ProductMedia
  heading: string
  intro?: string
  /** Prefer high for the in-viewport before screenshot (LCP). */
  priority?: boolean
}>(), {
  priority: false,
})

const images = computed(() => [props.before, props.after])
const activeIndex = ref<number | null>(null)

function open(index: number) {
  activeIndex.value = index
}

function close() {
  activeIndex.value = null
}
</script>

<template>
  <section
    aria-labelledby="extension-showcase-heading"
    class="space-y-5"
  >
    <div class="max-w-3xl space-y-2">
      <h2 id="extension-showcase-heading" class="text-2xl font-semibold">
        {{ heading }}
      </h2>
      <p
        v-if="intro"
        class="text-sm leading-relaxed text-muted-foreground sm:text-base"
      >
        {{ intro }}
      </p>
    </div>
    <div class="grid gap-5 lg:grid-cols-2">
      <figure
        v-for="(image, index) in images"
        :key="image.src"
        class="space-y-2"
      >
        <button
          type="button"
          class="group relative block w-full cursor-zoom-in overflow-hidden rounded-2xl border border-border bg-card text-left shadow-sm transition hover:ring-2 hover:ring-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          :aria-label="`View full size: ${image.caption || image.alt}`"
          @click="open(index)"
        >
          <img
            :src="image.srcThumb || image.src"
            :alt="image.alt"
            :width="image.width"
            :height="image.height"
            :loading="priority && index === 0 ? 'eager' : 'lazy'"
            :fetchpriority="priority && index === 0 ? 'high' : undefined"
            decoding="async"
            class="h-auto w-full"
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
        <figcaption class="text-sm text-muted-foreground">
          <span class="font-medium text-foreground">{{ index === 0 ? 'Before.' : 'After.' }}</span>
          {{ image.caption || image.alt }}
        </figcaption>
      </figure>
    </div>

    <MediaLightbox
      v-model:active-index="activeIndex"
      :images="images"
      @close="close"
    />
  </section>
</template>
