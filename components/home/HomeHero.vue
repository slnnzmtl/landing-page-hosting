<script setup lang="ts">
import type { HomepageContent, HomepageLink } from '~/data/homepage'
import { conversionEventName } from '~/data/homepage'
import { useHomepageUi } from '~/composables/useHomepageUi'
import { trackConversion } from '~/utils/track-conversion'

defineProps<{
  person: HomepageContent['person']
  valueProposition: string
  primaryCtas: HomepageLink[]
  profileLinks: HomepageLink[]
}>()

const { linkFocus } = useHomepageUi()

function onPrimaryCtaClick(href: string) {
  const name = conversionEventName(href)
  if (name) trackConversion(name)
}
</script>

<template>
  <header class="space-y-6">
    <p class="text-sm uppercase tracking-[0.35em] text-primary">
      {{ person.name }}
    </p>
    <h1 class="text-4xl font-semibold leading-tight sm:text-5xl">
      {{ person.role }}
    </h1>
    <p class="text-lg font-medium text-foreground">
      {{ person.heroSubtitle }}
    </p>
    <p class="max-w-2xl text-lg text-muted-foreground">
      {{ valueProposition }}
    </p>
    <div class="flex flex-wrap items-center justify-center sm:justify-start gap-6 sm:gap-8">
      <div class="flex flex-wrap items-center gap-4">
        <a
          v-for="cta in primaryCtas"
          :key="cta.href"
          :href="cta.href"
          :class="[
            'rounded-full px-6 py-3 text-sm font-medium transition',
            linkFocus,
            cta.href === '#selected-work'
              ? 'bg-primary text-primary-foreground shadow hover:bg-primary/90'
              : 'border border-border text-foreground hover:border-primary hover:text-primary',
          ]"
          @click="onPrimaryCtaClick(cta.href)"
        >
          {{ cta.label }}
        </a>
      </div>

      <nav aria-label="Profiles" class="mt-2 sm:mt-0">
        <HomeProfileLinkList :links="profileLinks" />
      </nav>
    </div>
  </header>
</template>
