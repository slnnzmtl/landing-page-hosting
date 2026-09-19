<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ProjectGuide, ProjectImage } from '../data/types'
import ProjectImageLightbox from './ProjectImageLightbox.vue'

const props = defineProps<{
  guide: ProjectGuide
}>()

const walkthroughImages = computed(() => (
  props.guide.steps
    .map(step => step.image)
    .filter((image): image is ProjectImage => Boolean(image))
))

const activeIndex = ref<number | null>(null)

function imageIndex(image: ProjectImage) {
  return walkthroughImages.value.findIndex(item => item.src === image.src)
}

function open(image: ProjectImage) {
  const index = imageIndex(image)
  if (index >= 0) activeIndex.value = index
}

function close() {
  activeIndex.value = null
}

function showPrevious() {
  if (activeIndex.value === null || walkthroughImages.value.length === 0) return
  activeIndex.value = (
    activeIndex.value + walkthroughImages.value.length - 1
  ) % walkthroughImages.value.length
}

function showNext() {
  if (activeIndex.value === null || walkthroughImages.value.length === 0) return
  activeIndex.value = (activeIndex.value + 1) % walkthroughImages.value.length
}
</script>

<template>
  <section
    aria-labelledby="project-how-heading"
    class="space-y-6"
  >
    <h2
      id="project-how-heading"
      class="text-2xl font-semibold"
    >
      {{ guide.title }}
    </h2>
    <p
      v-if="guide.warning"
      class="max-w-3xl border-l-2 border-amber-400 pl-3 text-sm text-muted-foreground"
      role="note"
    >
      {{ guide.warning }}
    </p>
    <ol class="space-y-8">
      <li
        v-for="(step, index) in guide.steps"
        :key="step.title"
        class="space-y-4"
      >
        <div class="max-w-3xl">
          <p class="text-xs font-semibold uppercase tracking-wide text-primary">
            Step {{ index + 1 }}
          </p>
          <h3 class="mt-1.5 text-lg font-semibold text-foreground">
            {{ step.title }}
          </h3>
          <p class="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {{ step.body }}
          </p>
        </div>
        <figure v-if="step.image">
          <button
            type="button"
            class="block w-full overflow-hidden rounded-2xl border border-border bg-[hsl(64,0%,1.43%)] text-left shadow-sm transition hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            :aria-label="`View full size: ${step.image.alt}`"
            @click="open(step.image)"
          >
            <img
              :src="step.image.srcThumb || step.image.src"
              :srcset="step.image.srcset"
              :sizes="step.image.sizes"
              :alt="step.image.alt"
              :width="step.image.width"
              :height="step.image.height"
              loading="lazy"
              decoding="async"
              class="h-auto w-full"
              :style="{ aspectRatio: `${step.image.width} / ${step.image.height}` }"
            />
          </button>
        </figure>
      </li>
    </ol>

    <ProjectImageLightbox
      :images="walkthroughImages"
      :active-index="activeIndex"
      @close="close"
      @previous="showPrevious"
      @next="showNext"
    />
  </section>
</template>
