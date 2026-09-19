<script setup lang="ts">
import AppPageHeader from '~/components/AppPageHeader.vue'
import { homepageContent } from '~/data/homepage'
import { useProjects } from '../composables/useProjects'
import { projectPath } from '../data/types'
import { usePageSeo } from '../composables/usePageSeo'
import { projectsIndexSeo, resolveSiteUrl } from '../utils/seo'

const { projects } = useProjects()
const siteUrl = resolveSiteUrl(useRuntimeConfig().public.siteUrl as string)
usePageSeo(projectsIndexSeo(siteUrl, projects))
</script>

<template>
  <div class="relative min-h-screen text-foreground">
    <div class="relative z-10 mx-auto flex max-w-6xl flex-col gap-12 px-6 py-20 lg:px-12">
      <AppPageHeader
        :kicker="homepageContent.person.name"
        title="Products"
        description="Public products and tools. Each card opens a dedicated landing page with usage notes and downloads."
        :back="{ to: '/', label: 'Back to homepage' }"
      />

      <ul class="grid gap-5 sm:grid-cols-2">
        <li
          v-for="project in projects"
          :key="project.slug"
        >
          <NuxtLink
            :to="projectPath(project.slug)"
            class="group flex h-full gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <div
              v-if="project.logo"
              class=" flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-[hsl(64,0%,1.43%)] shrink-0"
            >
              <img
                :src="project.logo.src"
                :alt="project.logo.alt"
                :width="project.logo.width"
                :height="project.logo.height"
                class="h-12 w-12"
                decoding="async"
              />
            </div>
            <div>
              <h2 class="text-xl font-semibold text-primary">
                {{ project.name }}
              </h2>
              <p class="mt-2 flex-1 text-sm text-muted-foreground">
                {{ project.shortDescription }}
              </p>
              <span class="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary transition-transform group-hover:translate-x-0.5">
                View project
                <svg
                  viewBox="0 0 20 20"
                  fill="none"
                  class="h-4 w-4"
                  aria-hidden="true"
                >
                  <path
                    d="M7 5l6 5-6 5"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>
            </div>
          </NuxtLink>
        </li>
      </ul>
    </div>
  </div>
</template>
