<script setup lang="ts">
import type { SourcedText, WorkSection } from '~/data/homepage'

defineProps<{
  intro: SourcedText
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
        {{ intro.text }}
      </p>
    </div>
    <div class="mt-10 space-y-14">
      <div
        v-for="section in sections"
        :key="section.id"
      >
        <h3 class="text-xl font-semibold">
          {{ section.title }}
        </h3>
        <p class="mt-2 max-w-2xl text-sm text-muted-foreground">
          {{ section.description.text }}
        </p>
        <ul
          :class="[
            'mt-6 divide-y divide-border',
            section.id === 'products-open-source'
              ? ''
              : 'grid grid-cols-1 gap-0',
          ]"
        >
          <li
            v-for="project in section.items"
            :key="project.slug"
          >
            <HomeFeaturedCaseCard
              :item="project"
              :collapsible-summary="section.id === 'professional'"
            />
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
