<script setup lang="ts">
import type { CaseStudy } from '../data/types'
import { STAGE_LABEL_DISPLAY } from '../data/types'
import { caseStackTag } from '../utils/case-ui'

const props = defineProps<{
  caseStudy: Pick<CaseStudy, 'role' | 'stageLabel' | 'stackTags'>
}>()

const stageDisplay = computed(() =>
  props.caseStudy.stageLabel
    ? STAGE_LABEL_DISPLAY[props.caseStudy.stageLabel]
    : undefined,
)

const facts = computed(() => {
  const rows: Array<{ label: string, value: string }> = []
  if (props.caseStudy.role?.trim()) {
    rows.push({ label: 'Role', value: props.caseStudy.role.trim() })
  }
  if (stageDisplay.value) {
    rows.push({ label: 'Stage', value: stageDisplay.value })
  }
  return rows
})
</script>

<template>
  <div
    v-if="facts.length || caseStudy.stackTags.length"
    class="flex flex-wrap items-center gap-x-6 gap-y-3"
  >
    <dl
      v-if="facts.length"
      class="flex flex-wrap items-center gap-x-6 gap-y-2"
    >
      <div
        v-for="fact in facts"
        :key="fact.label"
        class="flex min-w-0 items-baseline gap-2"
      >
        <dt class="text-xs font-semibold uppercase tracking-wide text-primary">
          {{ fact.label }}
        </dt>
        <dd class="text-sm font-medium leading-6 text-foreground">
          {{ fact.value }}
        </dd>
      </div>
    </dl>

    <ul
      v-if="caseStudy.stackTags.length"
      class="flex flex-wrap gap-2"
      aria-label="Stack"
    >
      <li
        v-for="tag in caseStudy.stackTags"
        :key="tag"
        :class="caseStackTag"
      >
        {{ tag }}
      </li>
    </ul>
  </div>
</template>
