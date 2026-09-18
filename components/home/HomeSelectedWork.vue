<script setup lang="ts">
import type { WorkSection } from '~/data/homepage'

defineProps<{
  intro: string
  sections: WorkSection[]
}>()
</script>

<template>
  <section
    id="selected-work"
    aria-labelledby="work-heading"
    class="scroll-mt-24"
  >
    <div>
      <h2
        id="work-heading"
        class="text-2xl font-semibold"
      >
        Selected work
      </h2>
      <p class="mt-3 max-w-2xl text-muted-foreground">
        {{ intro }}
      </p>
    </div>
    <div class="mt-10 space-y-14">
      <div
        v-for="section in sections"
        :key="section.id"
      >
        <div class="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h3 class="text-xl font-semibold">
              {{ section.title }}
            </h3>
            <p class="mt-2 max-w-2xl text-sm text-muted-foreground">
              {{ section.description }}
            </p>
          </div>
          <NuxtLink
            v-if="section.id === 'professional'"
            to="/experience"
            class="text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Full role details
          </NuxtLink>
        </div>
        <ul
          :class="[
            'mt-6 divide-y divide-border',
            section.id === 'open-source'
              ? ''
              : 'grid grid-cols-1 gap-0',
          ]"
        >
          <li
            v-for="project in section.items"
            :key="project.slug"
          >
            <HomeFeaturedCaseCard :item="project" />
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
