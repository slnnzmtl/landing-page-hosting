<script setup lang="ts">
import AppPageHeader from '~/components/AppPageHeader.vue'
import { resolveSiteUrl } from '~/utils/seo'
import { projectsIndexSeo } from '../utils/projects-seo'

const portfolio = await requirePortfolio()
const home = portfolio.homepage
const pageCopy = home.pageCopy.projects_index
const projects = portfolio.projects
const siteUrl = resolveSiteUrl(useRuntimeConfig().public.siteUrl as string)

usePageSeo(
  projectsIndexSeo(siteUrl, projects, {
    siteName: home.siteName,
    title: pageCopy.title,
    description: pageCopy.seo_description,
  }),
  home.siteName,
)
</script>

<template>
  <div class="relative min-h-screen w-full min-w-0 text-foreground">
    <div class="relative z-10 mx-auto flex w-full  flex-col gap-12 px-6 py-12 pb-28 sm:px-6 sm:py-20 lg:px-12 xl:pb-20">
      <AppPageHeader
        :kicker="home.person.name"
        :title="pageCopy.title"
        :description="pageCopy.description"
        :back="{ to: pageCopy.back_href, label: pageCopy.back_label }"
      />

      <ul class="grid gap-5 sm:grid-cols-2">
        <li
          v-for="project in projects"
          :key="project.slug"
        >
          <ProjectSummaryCard :project="project" />
        </li>
      </ul>
    </div>
  </div>
</template>
