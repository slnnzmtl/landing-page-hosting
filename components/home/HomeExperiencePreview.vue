<script setup lang="ts">
import type { ExperiencePreview } from '~/data/homepage'
import { experienceRolePath } from '~/data/experience'
import { useHomepageUi } from '~/composables/useHomepageUi'

defineProps<{
  preview: ExperiencePreview
}>()

const { linkFocus } = useHomepageUi()
</script>

<template>
  <section
    id="experience-preview"
    aria-labelledby="experience-preview-heading"
    class="scroll-mt-24"
  >
    <div class="flex flex-wrap items-end justify-between gap-3">
      <h2
        id="experience-preview-heading"
        class="text-2xl font-semibold"
      >
        {{ preview.heading }}
      </h2>
      <NuxtLink
        :to="preview.cta.href"
        :class="[
          'text-sm font-medium text-primary underline-offset-4 hover:underline',
          linkFocus,
        ]"
      >
        {{ preview.cta.label }}
      </NuxtLink>
    </div>

    <ol class="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-stretch">
      <template
        v-for="(item, index) in preview.items"
        :key="item.id"
      >
        <li class="min-w-0 flex-1">
          <NuxtLink
            :to="experienceRolePath(item.id)"
            :class="[
              'flex h-full items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 shadow-sm transition hover:border-primary/50',
              linkFocus,
            ]"
          >
            <div
              v-if="item.icon"
              class="h-8 w-8 shrink-0 overflow-hidden rounded-lg border border-border bg-white"
            >
              <img
                :src="item.icon"
                :alt="item.iconAlt || item.organization"
                width="48"
                height="48"
                class="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            <span class="text-sm font-medium text-foreground">
              {{ item.organization }}
            </span>
          </NuxtLink>
        </li>
        <li
          v-if="index < preview.items.length - 1"
          class="hidden items-center text-muted-foreground sm:flex"
          aria-hidden="true"
        >
          →
        </li>
      </template>
    </ol>
  </section>
</template>
