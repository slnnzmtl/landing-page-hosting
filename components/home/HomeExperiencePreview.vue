<script setup lang="ts">
import type { ExperiencePreview } from '~/data/homepage'
import { experienceRolePath } from '~/data/experience'
import { useHomepageUi } from '~/composables/useHomepageUi'
import AppCard from '~/components/AppCard.vue'
import Button from '~/components/ui/button.vue'

defineProps<{
  preview: ExperiencePreview
}>()

const { interactiveTransition, linkFocus } = useHomepageUi()
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
          interactiveTransition,
          linkFocus,
        ]"
      >
        {{ preview.cta.label }}
      </NuxtLink>
    </div>

    <ol class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <li
        v-for="item in preview.items"
        :key="item.id"
        class="min-w-0"
      >
        <AppCard
          :href="experienceRolePath(item.id)"
          :aria-label="`${item.organization}: ${item.title}`"
        >
          <div class="flex h-full flex-col p-4">
            <div class="flex items-start gap-3">
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
              <div>
                <p class="text-lg font-semibold leading-tight text-foreground">
                  {{ item.organization }}
                </p>
                <p class="mt-1 text-sm text-primary">
                  {{ item.title }}
                </p>
              </div>
            </div>
            <p class="mt-3 text-xs text-muted-foreground">
              {{ item.dateRange }}
            </p>
            <p
              v-if="item.summary"
              class="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground"
            >
              {{ item.summary }}
            </p>
            <div class="mt-auto pt-5">
              <Button
                as="span"
                variant="arrow"
                aria-hidden="true"
              >
                View case
              </Button>
            </div>
          </div>
        </AppCard>
      </li>
    </ol>
  </section>
</template>
