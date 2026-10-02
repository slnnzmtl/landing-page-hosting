<script setup lang="ts">
import type { CaseClaim, CaseLink, CaseSection } from '../../data/types'
import NarrativeSection from './NarrativeSection.vue'
import WorkflowSection from './WorkflowSection.vue'
import ArchitectureSection from './ArchitectureSection.vue'
import EvolutionTimeline from './EvolutionTimeline.vue'
import DecisionComparison from './DecisionComparison.vue'
import CaseGallery from './CaseGallery.vue'
import EvidenceSection from './EvidenceSection.vue'
import LimitationsCallout from './LimitationsCallout.vue'

withDefaults(defineProps<{
  section: CaseSection
  claims?: CaseClaim[]
  links?: CaseLink[]
}>(), {
  claims: () => [],
  links: () => [],
})
</script>

<template>
  <div>
    <NarrativeSection
      v-if="section.kind === 'narrative'"
      :section="section"
    />
    <WorkflowSection
      v-else-if="section.kind === 'workflow'"
      :section="section"
      :media="section.media"
    />
    <ArchitectureSection
      v-else-if="section.kind === 'architecture'"
      :section="section"
      :media="section.media"
    />
    <EvolutionTimeline
      v-else-if="section.kind === 'evolution'"
      :section="section"
    />
    <DecisionComparison
      v-else-if="section.kind === 'decisions'"
      :section="section"
    />
    <CaseGallery
      v-else-if="section.kind === 'gallery'"
      :section="section"
      :media="section.media"
    />
    <EvidenceSection
      v-else-if="section.kind === 'evidence'"
      :section="section"
      :claims="claims"
      :links="links"
    />
    <LimitationsCallout
      v-else-if="section.kind === 'limitations'"
      :section="section"
    />
  </div>
</template>
