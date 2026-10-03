<script setup lang="ts">
import type { HomepageContent, HomepageLink } from '~/data/homepage'
import { useHomepageUi } from '~/composables/useHomepageUi'
import { trackHomepageHref } from '~/composables/useHomepageConversion'
import { scrollToAnchor } from '~/utils/silent-hash'

defineProps<{
  person: HomepageContent['person']
  valueProposition: string
  credibilityLine?: string
  primaryCtas: HomepageLink[]
}>()

const route = useRoute()
const router = useRouter()
const { interactiveTransition, linkFocus } = useHomepageUi()

async function onPrimaryCtaClick(href: string, event: MouseEvent) {
  trackHomepageHref(href)
  if (!href.startsWith('#')) return
  event.preventDefault()
  await scrollToAnchor(href, {
    path: '/',
    currentPath: route.path,
    currentHash: route.hash,
    replace: to => router.replace(to),
  })
}

function ctaClass(index: number) {
  const base = [
    'inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition',
    interactiveTransition,
    linkFocus,
  ]
  if (index === 0) {
    return [...base, 'w-full bg-primary text-primary-foreground shadow hover:bg-primary/90 sm:w-auto mt-2']
  }
  return [...base, 'w-full border border-border text-foreground hover:border-primary hover:text-primary sm:w-auto']
}
</script>

<template>
  <section class="grid gap-16 lg:grid-cols-12 lg:items-start lg:gap-10">
    <AppPageHeader
      class="lg:col-span-8"
      :kicker="person.name"
      :title="person.role"
      :description="valueProposition"
      :credibility-line="credibilityLine"
    >
      <div class="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
        <a
          v-for="(cta, index) in primaryCtas"
          :key="cta.href"
          :href="cta.href"
          :class="ctaClass(index)"
          @click="onPrimaryCtaClick(cta.href, $event)"
        >
          {{ cta.label }}
        </a>
      </div>
    </AppPageHeader>
  </section>
</template>
