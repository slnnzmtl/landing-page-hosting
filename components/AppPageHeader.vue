<script setup lang="ts">
import AppBackLink from '~/components/AppBackLink.vue'

defineProps<{
  kicker: string
  title: string
  description?: string
  back?: {
    to: string
    label: string
  }
}>()
</script>

<template>
  <header class="space-y-4">
    <AppBackLink
      v-if="back"
      :to="back.to"
    >
      {{ back.label }}
    </AppBackLink>
    <div
      :class="$slots.media
        ? 'grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-3 gap-y-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(12rem,16rem)] lg:gap-10'
        : 'space-y-4'"
    >
      <div class="min-w-0 space-y-4">
        <p class="text-sm uppercase tracking-[0.35em] text-primary">
          {{ kicker }}
        </p>
        <h1 class="text-4xl font-semibold leading-tight sm:text-5xl">
          {{ title }}
        </h1>
        <div
          v-if="description || $slots.description"
          class="max-w-2xl"
        >
          <slot name="description">
            <p class="text-lg text-muted-foreground">
              {{ description }}
            </p>
          </slot>
        </div>
        <slot />
      </div>
      <slot name="media" />
    </div>
  </header>
</template>
