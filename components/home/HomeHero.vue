<script setup lang="ts">
import type { HomepageContent, HomepageLink, HeroFocus } from '~/data/homepage'
import AppPageHeader from '~/components/AppPageHeader.vue'
import { useHomepageUi } from '~/composables/useHomepageUi'
import { trackHomepageHref } from '~/composables/useHomepageConversion'

defineProps<{
  person: HomepageContent['person']
  valueProposition: string
  primaryCtas: HomepageLink[]
  profileLinks: HomepageLink[]
  heroFocus: HeroFocus
}>()

const { linkFocus } = useHomepageUi()

function onPrimaryCtaClick(href: string) {
  trackHomepageHref(href)
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
  <header class="grid gap-8 lg:grid-cols-12 lg:items-start lg:gap-10">
    <AppPageHeader
      as="div"
      class="lg:col-span-7"
      :kicker="person.name"
      :title="person.role"
      :description="valueProposition"
    >
      <div class="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-8">
        <div class="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
          <a
            v-for="(cta, index) in primaryCtas"
            :key="cta.href"
            :href="cta.href"
            :class="ctaClass(index)"
            @click="onPrimaryCtaClick(cta.href)"
          >
            {{ cta.label }}
          </a>
        </div>

        <nav
          aria-label="Profiles"
          class="flex w-full justify-center sm:w-auto"
        >
          <HomeProfileLinkList :links="profileLinks" />
        </nav>
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
      <ul class="mt-5 space-y-4">
        <li
          v-for="item in heroFocus.items"
          :key="item.title"
        >
          <p class="text-sm font-semibold text-foreground">
            {{ item.title }}
          </p>
          <p class="mt-1 text-sm leading-relaxed text-muted-foreground">
            {{ item.summary }}
          </p>
        </li>
      </ul>
    </aside>
  </header>
</template>
