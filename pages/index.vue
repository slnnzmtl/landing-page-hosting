<script setup lang="ts">
import { homepageSeo, resolveSiteUrl } from '~/utils/seo'

useHashScroll()
useContactHashRoute()

const portfolio = await requirePortfolio()
const home = portfolio.homepage
const siteUrl = resolveSiteUrl(useRuntimeConfig().public.siteUrl as string)
usePageSeo(homepageSeo(siteUrl, home), home.siteName)
</script>

<template>
  <div class="relative min-h-screen w-full min-w-0 text-foreground">
    <div class="relative z-10 mx-auto flex w-full min-w-0 max-w-[1260px] flex-col gap-16 px-6 py-12 pb-28 sm:px-6 sm:py-20 md:gap-24 lg:px-12 xl:pb-20">
      <HomeHero
        :person="home.person"
        :value-proposition="home.valueProposition"
        :credibility-line="home.credibilityLine"
        :primary-ctas="home.primaryCtas"
      />

      <HomeFeaturedProjects
        :heading="home.featuredWorkHeading"
        :intro="home.featuredWorkIntro"
        :projects="home.featuredProjects"
        :cta="home.projectsCta"
      />

      <HomeSelectedOutcomes :heading="home.proofHeading" :items="home.proof" />

      <HomeExperiencePreview :preview="home.experiencePreview" />

      <HomeProducts :products="home.products" />

      <HomeContact :contact="home.contact" />
    </div>
  </div>
</template>
