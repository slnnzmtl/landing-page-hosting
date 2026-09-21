<script setup lang="ts">
import { experiencePageSeo, resolveSiteUrl } from '~/domains/projects/utils/seo'
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

const roles = portfolio.value.experience
const tenure = portfolio.value.professionalTenure
const home = portfolio.value.homepage
const pageCopy = home.pageCopy
const intro = `${tenure.pageIntro} ${tenure.heroSubtitle}; ${tenure.softwareEngineeringSince.toLowerCase()}.`
const siteUrl = resolveSiteUrl(useRuntimeConfig().public.siteUrl as string)
usePageSeo(
  experiencePageSeo(
    siteUrl,
    {
      name: home.person.name,
      role: home.person.role,
      sameAs: home.profileLinks.map(link => link.href),
    },
    {
      siteName: home.siteName,
      title: `${pageCopy.experience.title} | ${home.person.name}`,
      description: pageCopy.experience.seo_description,
    },
  ),
  home.siteName,
)
</script>

<template>
  <div class="relative min-h-screen w-full min-w-0 text-foreground">
    <div class="relative z-10 mx-auto flex w-full min-w-0 max-w-6xl flex-col gap-12 px-4 py-12 sm:px-6 sm:py-20 lg:px-12">
      <AppPageHeader
        :kicker="home.person.name"
        :title="pageCopy.experience.title"
        :description="intro"
        :back="{ to: pageCopy.experience.back_href, label: pageCopy.experience.back_label }"
      />

      <ExperienceTimeline :roles="roles" />

      <HomeContact
        :contact="home.contact"
        :card-heading="pageCopy.contact.card_heading"
      />
    </div>
  </div>
</template>
