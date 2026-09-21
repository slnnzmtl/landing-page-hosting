<script setup lang="ts">
import { experiencePageSeo, resolveSiteUrl } from '~/utils/seo'

useHashScroll()

const portfolio = await requirePortfolio()
const roles = portfolio.experience
const home = portfolio.homepage
const experiencePage = portfolio.experiencePage
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
      title: `${experiencePage.title} | ${home.person.name}`,
      description: experiencePage.seo_description,
    },
  ),
  home.siteName,
)
</script>

<template>
  <div class="relative min-h-screen w-full min-w-0 text-foreground">
    <div class="relative z-10 mx-auto flex w-full min-w-0 max-w-6xl flex-col gap-12 px-6 py-12 pb-28 sm:px-6 sm:py-20 lg:px-12 xl:pb-20">
      <AppPageHeader
        :kicker="home.person.name"
        :title="experiencePage.title"
        :description="experiencePage.page_intro"
        :back="{ to: experiencePage.back_href, label: experiencePage.back_label }"
      />

      <ExperienceTimeline :roles="roles" />

      <HomeContact :contact="home.contact" />
    </div>
  </div>
</template>
