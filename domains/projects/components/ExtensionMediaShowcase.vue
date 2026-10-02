<script setup lang="ts">
import type { ProjectMedia } from '../data/types'

defineProps<{
  before: ProjectMedia
  after: ProjectMedia
  heading: string
  intro?: string
}>()
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
      <figure class="space-y-2">
        <div class="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <img
            :src="before.srcThumb || before.src"
            :srcset="before.srcset"
            :sizes="before.sizes"
            :alt="before.alt"
            :width="before.width"
            :height="before.height"
            loading="lazy"
            decoding="async"
            class="h-auto w-full"
          />
        </div>
        <figcaption class="text-sm text-muted-foreground">
          <span class="font-medium text-foreground">Before.</span>
          {{ before.caption || before.alt }}
        </figcaption>
      </figure>
      <figure class="space-y-2">
        <div class="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <img
            :src="after.srcThumb || after.src"
            :srcset="after.srcset"
            :sizes="after.sizes"
            :alt="after.alt"
            :width="after.width"
            :height="after.height"
            loading="lazy"
            decoding="async"
            class="h-auto w-full"
          />
        </div>
        <figcaption class="text-sm text-muted-foreground">
          <span class="font-medium text-foreground">After.</span>
          {{ after.caption || after.alt }}
        </figcaption>
      </figure>
    </div>
  </section>
</template>
