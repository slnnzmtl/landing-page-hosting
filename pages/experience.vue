<script setup lang="ts">
import { publishedExperienceRoles, professionalTenure } from '~/data/experience'
import { homepageContent, inAppLocation } from '~/data/homepage'
import { experiencePageSeo, resolveSiteUrl } from '~/domains/projects/utils/seo'
import { usePageSeo } from '~/domains/projects/composables/usePageSeo'
import { useHomepageUi } from '~/composables/useHomepageUi'
import { useExperienceHashScroll } from '~/composables/useExperienceHashScroll'

const { linkFocus } = useHomepageUi()
useExperienceHashScroll()

const roles = publishedExperienceRoles()
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
      <header>
        <NuxtLink
          :to="inAppLocation('/#featured-work')"
          :class="['text-sm font-medium text-primary underline-offset-4 hover:underline', linkFocus]"
        >
          Back to featured work
        </NuxtLink>
        <p class="mt-6 text-sm uppercase tracking-[0.35em] text-primary">
          {{ homepageContent.person.name }}
        </p>
        <h1 class="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
          Professional experience
        </h1>
        <p class="mt-3 max-w-2xl text-muted-foreground">
          Evidence-based timeline from media and web delivery through frontend and full-stack engineering,
          senior production ownership, and AI-native systems.
          {{ professionalTenure.heroSubtitle }}; {{ professionalTenure.softwareEngineeringSince.toLowerCase() }}.
        </p>
      </header>

      <ExperienceTimeline :roles="roles" />

      <HomeContact :contact="homepageContent.contact" />
    </div>
  </div>
</template>
