<script setup lang="ts">
import type { CaseStudy } from '../data/types'
import { STAGE_LABEL_DISPLAY } from '../data/types'

const props = defineProps<{
  caseStudy: Pick<CaseStudy, 'role' | 'stageLabel'>
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
    v-if="facts.length"
    class="border-y border-border/60 py-4"
  >
    <dl
      v-if="facts.length"
      class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      <div
        v-for="fact in facts"
        :key="fact.label"
        class="flex min-w-0 flex-col gap-1"
      >
        <dt class="text-xs font-semibold uppercase tracking-wide text-primary">
          {{ fact.label }}
        </dt>
        <dd class="text-sm font-medium leading-6 text-foreground">
          {{ fact.value }}
        </dd>
      </div>
    </dl>
  </div>
</template>
