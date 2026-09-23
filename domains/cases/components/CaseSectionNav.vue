<script setup lang="ts">
import type { CaseSection } from '../data/types'
import { caseNavGroups } from '../data/types'
import { useActiveSection } from '../composables/useActiveSection'
import { useHomepageUi } from '~/composables/useHomepageUi'

const props = defineProps<{
  sections: CaseSection[]
}>()

const { linkFocus } = useHomepageUi()

const groups = computed(() => caseNavGroups(props.sections))

const allAnchors = computed(() =>
  groups.value.flatMap(group => group.anchors),
)

const { activeId } = useActiveSection(allAnchors, { offsetPx: 112 })

function isActive(group: { anchors: string[] }) {
  return activeId.value !== null && group.anchors.includes(activeId.value)
}

function scrollToGroup(event: MouseEvent, anchor: string) {
  event.preventDefault()
  const target = document.getElementById(anchor)
  if (!target) return
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
  history.replaceState(null, '', `#${anchor}`)
  // Pin active group immediately; scroll handler will refine as motion settles.
  activeId.value = anchor
}
</script>

<template>
  <nav
    v-if="groups.length"
    aria-label="Case sections"
    class="sticky top-0 z-20 w-full min-w-0 border-y border-border/80 bg-black/90 backdrop-blur-md"
  >
    <ul class="flex min-w-0 gap-1 overflow-x-auto px-1 py-2.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <li
        v-for="group in groups"
        :key="group.id"
        class="shrink-0"
      >
        <a
          :href="`#${group.anchor}`"
          :aria-current="isActive(group) ? 'location' : undefined"
          :class="[
            'inline-flex whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium transition',
            linkFocus,
            isActive(group)
              ? 'bg-primary/15 text-foreground ring-1 ring-primary/40'
              : 'text-foreground/70 hover:bg-card hover:text-foreground',
          ]"
          @click="scrollToGroup($event, group.anchor)"
        >
          {{ group.label }}
        </a>
      </li>
    </ul>
  </nav>
</template>
