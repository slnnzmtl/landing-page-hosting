<script setup lang="ts">
import { homepageSeo, resolveSiteUrl } from '~/domains/projects/utils/seo'
import { usePageSeo } from '~/domains/projects/composables/usePageSeo'

useHashScroll()

const { data: portfolio, error } = await usePortfolio()
if (error.value) {
  throw createError({
    statusCode: 500,
    statusMessage: error.value.message || 'Failed to load portfolio content',
  })
}
if (!portfolio.value) {
  throw createError({
    statusCode: 500,
    statusMessage: 'Portfolio content missing',
  })
}

const home = portfolio.value.homepage
const siteUrl = resolveSiteUrl(useRuntimeConfig().public.siteUrl as string)
usePageSeo(homepageSeo(siteUrl, home))
</script>

<template>
  <div class="relative min-h-screen w-full min-w-0 text-foreground">
    <div class="relative z-10 mx-auto flex w-full min-w-0 max-w-6xl flex-col gap-16 px-4 py-12 sm:px-6 sm:py-20 md:gap-24 lg:px-12">
      <HomeHero
        :person="home.person"
        :value-proposition="home.valueProposition"
        :primary-ctas="home.primaryCtas"
        :profile-links="home.profileLinks"
        :hero-focus="home.heroFocus"
      />

      <section
        aria-labelledby="proof-heading"
        class="rounded-2xl border border-border bg-card p-4 shadow-sm sm:rounded-3xl sm:p-8"
      >
        <h2
          id="proof-heading"
          class="text-xs font-semibold uppercase tracking-wide text-primary sm:text-sm"
        >
          Selected outcomes
        </h2>
        <ul class="mt-4 flex flex-row flex-wrap gap-x-3 gap-y-4 sm:mt-4 sm:grid sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
          <li
            v-for="item in home.proof"
            :key="`${item.value}-${item.label}`"
            class="min-w-0 basis-[calc(50%-0.375rem)] sm:basis-auto"
          >
            <p class="text-lg font-semibold leading-tight sm:text-3xl">
              {{ item.value }}
            </p>
            <p class="mt-1 text-xs leading-snug text-muted-foreground sm:mt-2 sm:text-sm">
              {{ item.label }}
            </p>
          </li>
        </ul>
      </section>

      <HomeSelectedWork
        :intro="home.featuredWorkIntro"
        :cases="home.featuredCases"
      />

      <HomeProducts :products="home.products" />

      <HomeExperiencePreview :preview="home.experiencePreview" />

      <HomeContact :contact="home.contact" />
    </div>
  </div>
</template>
