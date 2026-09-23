<script setup lang="ts">
import type { CaseSection } from '../../data/types'
import { caseEyebrow, caseReadingWidth } from '../../utils/case-ui'

withDefaults(defineProps<{
  section: Pick<CaseSection, 'anchor' | 'eyebrow' | 'heading'>
  /** Constrain header to reading width (default) or full rail. */
  headerWide?: boolean
}>(), {
  headerWide: false,
})
</script>

<template>
  <section
    :id="section.anchor"
    class="scroll-mt-28 space-y-5 lg:space-y-6"
    :aria-labelledby="`${section.anchor}-heading`"
  >
    <header
      :class="[
        'space-y-4',
        headerWide ? 'w-full' : caseReadingWidth,
      ]"
    >
      <p
        v-if="section.eyebrow"
        :class="caseEyebrow"
      >
        {{ section.eyebrow }}
      </p>
      <h2
        :id="`${section.anchor}-heading`"
        class="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
      >
        {{ section.heading }}
      </h2>
    </header>
    <slot />
  </section>
</template>
