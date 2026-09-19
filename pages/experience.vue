<script setup lang="ts">
import AppPageHeader from '~/components/AppPageHeader.vue'
import { publishedExperienceRoles, professionalTenure } from '~/data/experience'
import { homepageContent } from '~/data/homepage'
import { experiencePageSeo, resolveSiteUrl } from '~/domains/projects/utils/seo'
import { usePageSeo } from '~/domains/projects/composables/usePageSeo'

useHashScroll()

const roles = publishedExperienceRoles()
const intro = [
  'Evidence-based timeline from media and web delivery through frontend and full-stack engineering, senior production ownership, and AI-native systems.',
  `${professionalTenure.heroSubtitle}; ${professionalTenure.softwareEngineeringSince.toLowerCase()}.`,
].join(' ')
const siteUrl = resolveSiteUrl(useRuntimeConfig().public.siteUrl as string)
usePageSeo(
  experiencePageSeo(siteUrl, {
    name: homepageContent.person.name,
    role: homepageContent.person.role,
    sameAs: homepageContent.profileLinks.map(link => link.href),
  }),
)
</script>

<template>
  <div class="relative min-h-screen text-foreground">
    <div class="relative z-10 mx-auto flex max-w-6xl flex-col gap-12 px-6 py-20 lg:px-12">
      <AppPageHeader
        :kicker="homepageContent.person.name"
        title="Professional experience"
        :description="intro"
        back-to="/#featured-work"
        back-label="Back to featured work"
      />

      <ExperienceTimeline :roles="roles" />

      <HomeContact :contact="homepageContent.contact" />
    </div>
  </div>
</template>
