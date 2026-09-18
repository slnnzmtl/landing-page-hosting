<script setup lang="ts">
import type { ExperienceRole } from '~/data/experience'
import {
  engagementTypeLabel,
  formatExperienceMonth,
  outcomeQualifierLabel,
  workModeLabel,
} from '~/data/experience'
import { opensInNewTab, externalLinkRel } from '~/data/homepage'
import { useHomepageUi } from '~/composables/useHomepageUi'

const props = defineProps<{
  role: ExperienceRole
}>()

const { linkFocus } = useHomepageUi()

const startDateTime = computed(() => `${props.role.start}-01`)
const endDateTime = computed(() =>
  props.role.end ? `${props.role.end}-01` : undefined,
)

const metaLine = computed(() => {
  const parts = [engagementTypeLabel(props.role.engagementType)]
  const mode = workModeLabel(props.role.workMode)
  if (!props.role.location.toLowerCase().includes(mode.toLowerCase())) {
    parts.push(mode)
  }
  parts.push(props.role.location)
  return parts.join(' · ')
})

function linkAttrs(href: string) {
  return {
    target: opensInNewTab(href) ? ('_blank' as const) : undefined,
    rel: externalLinkRel(href),
  }
}
</script>

<template>
  <article class="relative pl-10 sm:pl-12">
    <span
      class="absolute left-0 top-1.5 z-10 flex h-[19px] w-[19px] items-center justify-center bg-background"
      aria-hidden="true"
    >
      <img
        v-if="role.icon"
        :src="role.icon"
        alt=""
        width="40"
        height="40"
        class="h-4 w-4 rounded-sm border border-border bg-white object-cover"
        loading="lazy"
      />
      <span
        v-else
        class="h-2.5 w-2.5 rounded-full border-2 border-primary bg-background"
      />
    </span>

    <header class="space-y-1">
      <h2 class="text-lg font-semibold leading-snug text-foreground sm:text-xl">
        {{ role.title }}
      </h2>
      <p class="text-sm font-medium text-foreground">
        {{ role.organization }}
      </p>
      <p class="text-sm text-muted-foreground">
        <time :datetime="startDateTime">{{ formatExperienceMonth(role.start) }}</time>
        <span aria-hidden="true"> – </span>
        <time
          v-if="role.end && endDateTime"
          :datetime="endDateTime"
        >{{ formatExperienceMonth(role.end) }}</time>
        <span v-else>Present</span>
      </p>
      <p class="text-sm text-muted-foreground">
        {{ metaLine }}
      </p>
    </header>

    <p class="mt-4 text-sm leading-relaxed text-muted-foreground">
      {{ role.scope }}
    </p>

    <div class="mt-4">
      <h3 class="text-sm font-semibold text-foreground">
        Contributions
      </h3>
      <ul class="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted-foreground">
        <li
          v-for="(item, index) in role.contributions"
          :key="`${role.id}-c-${index}`"
        >
          {{ item }}
        </li>
      </ul>
    </div>

    <div
      v-if="role.outcomes.length"
      class="mt-4"
    >
      <h3 class="text-sm font-semibold text-foreground">
        Outcomes
      </h3>
      <ul class="mt-2 space-y-2">
        <li
          v-for="(outcome, index) in role.outcomes"
          :key="`${role.id}-o-${index}`"
          class="text-sm leading-relaxed text-muted-foreground"
        >
          <span class="font-medium text-foreground">
            {{ outcomeQualifierLabel(outcome.qualifier) }}:
          </span>
          {{ outcome.text }}
        </li>
      </ul>
    </div>

    <p
      v-if="role.technologies.length"
      class="mt-4 text-xs text-muted-foreground"
    >
      <span class="font-medium text-foreground">Technologies:</span>
      {{ role.technologies.join(' · ') }}
    </p>

    <ul
      v-if="role.links?.length"
      class="mt-4 flex flex-col gap-2"
    >
      <li
        v-for="link in role.links"
        :key="link.href"
      >
        <a
          :href="link.href"
          v-bind="linkAttrs(link.href)"
          :class="[
            'inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline',
            linkFocus,
          ]"
        >
          {{ link.label }}
          <svg
            viewBox="0 0 20 20"
            fill="none"
            class="h-3.5 w-3.5 shrink-0"
            aria-hidden="true"
          >
            <path
              d="M8 4H4.5A1.5 1.5 0 003 5.5v10A1.5 1.5 0 004.5 17h10a1.5 1.5 0 001.5-1.5V12M12 3h5v5M17 3l-8 8"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </a>
      </li>
    </ul>
  </article>
</template>
