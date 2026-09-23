<script setup lang="ts">
import type { CaseSectionItem } from '../data/types'
import { caseCard, caseCardCompact, caseCardText } from '../utils/case-ui'

withDefaults(defineProps<{
  items: CaseSectionItem[]
  columns?: 2 | 3 | 4
  compact?: boolean
}>(), {
  columns: 2,
  compact: false,
})
</script>

<template>
  <ul
    v-if="items.length"
    :class="[
      'grid gap-4',
      columns === 4 ? 'sm:grid-cols-2 lg:grid-cols-4' : '',
      columns === 3 ? 'sm:grid-cols-2 lg:grid-cols-3' : '',
      columns === 2 ? 'sm:grid-cols-2' : '',
    ]"
  >
    <li
      v-for="(item, index) in items"
      :key="item.title || item.label || index"
      :class="compact ? caseCardCompact : caseCard"
    >
      <p
        v-if="item.label"
        class="text-xs font-semibold uppercase tracking-wide text-primary"
      >
        {{ item.label }}
      </p>
      <h3
        v-if="item.title"
        class="text-base font-semibold text-foreground"
        :class="item.label ? 'mt-1' : ''"
      >
        {{ item.title }}
      </h3>
      <p
        v-if="item.summary"
        :class="['mt-2', caseCardText]"
      >
        {{ item.summary }}
      </p>
      <p
        v-if="item.detail"
        :class="['mt-2', caseCardText]"
      >
        {{ item.detail }}
      </p>
    </li>
  </ul>
</template>
