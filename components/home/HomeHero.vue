<script setup lang="ts">
import type { HomepageContent, HomepageLink, HeroFocus } from '~/data/homepage'
import { useHomepageUi } from '~/composables/useHomepageUi'
import { trackHomepageHref } from '~/composables/useHomepageConversion'
import { scrollToAnchor } from '~/utils/silent-hash'

defineProps<{
  person: HomepageContent['person']
  valueProposition: string
  primaryCtas: HomepageLink[]
  heroFocus: HeroFocus
}>()

const route = useRoute()
const router = useRouter()
const { linkFocus } = useHomepageUi()

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
    linkFocus,
  ]
  if (index === 0) {
    return [...base, 'w-full bg-primary text-primary-foreground shadow hover:bg-primary/90 sm:w-auto']
  }
  return [...base, 'w-full border border-border text-foreground hover:border-primary hover:text-primary sm:w-auto']
}
</script>

<template>
  <section class="grid gap-16 lg:grid-cols-12 lg:items-start lg:gap-10">
    <AppPageHeader
      class="lg:col-span-7"
      :kicker="person.name"
      :title="person.role"
      :description="valueProposition"
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

    <aside
      class="rounded-2xl border border-border bg-card p-6 shadow-sm sm:rounded-3xl sm:p-8 lg:col-span-5"
      aria-labelledby="hero-focus-heading"
    >
      <h2
        id="hero-focus-heading"
        class="text-xs font-semibold uppercase tracking-wide text-primary sm:text-sm"
      >
        {{ heroFocus.heading }}
      </h2>
      <ul class="mt-5 space-y-2">
        <li
          v-for="item in heroFocus.items"
          :key="item.title"
        >
          <p class="text-sm leading-relaxed text-foreground">
            {{ item.title }}
          </p>
          <p v-if="item.summary" class="mt-1 text-sm leading-relaxed text-muted-foreground">
            {{ item.summary }}
          </p>
        </li>
      </ul>
    </aside>
  </section>
</template>
