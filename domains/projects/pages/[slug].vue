<script setup lang="ts">
import AppPageHeader from '~/components/AppPageHeader.vue'
import { useProjects } from '../composables/useProjects'
import ProjectGallery from '../components/ProjectGallery.vue'
import GithubReleases from '../components/GithubReleases.vue'
import ProjectLaunchActions from '../components/ProjectLaunchActions.vue'
import ProjectTrustPanel from '../components/ProjectTrustPanel.vue'
import ProjectHowItWorks from '../components/ProjectHowItWorks.vue'
import { usePageSeo } from '../composables/usePageSeo'
import { projectDetailSeo, resolveSiteUrl } from '../utils/seo'

const route = useRoute()
const slug = String(route.params.slug || '')
const { findProject } = useProjects()
const project = findProject(slug)

if (!project) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Project not found',
  })
}

const siteUrl = resolveSiteUrl(useRuntimeConfig().public.siteUrl as string)
usePageSeo(projectDetailSeo(siteUrl, project))

const descriptionParagraphs = computed(() => {
  const text = project.description || project.shortDescription
  return text.split(/\n{2,}/).map(paragraph => paragraph.trim()).filter(Boolean)
})

const benefitsHeading = computed(() => (
  project.stackTags?.length ? 'Feature highlights' : 'Why use it'
))
</script>

<template>
  <article class="relative min-h-screen text-foreground">
    <div class="relative z-10 mx-auto flex max-w-6xl flex-col gap-16 px-6 py-20 lg:px-12">
      <AppPageHeader
        kicker="Product"
        :title="project.name"
        back-to="/projects"
        back-label="Back to products"
      >
        <template #media>
          <div
            id="project-hero-media"
            class="flex size-16 shrink-0 items-center justify-center rounded-xl border border-border bg-[hsl(64,0%,1.43%)] p-1.5 ring-1 ring-[hsl(64,0%,98%)]/15 sm:size-20 sm:rounded-2xl sm:p-2 lg:size-auto lg:w-full lg:rounded-3xl lg:p-8"
          >
            <img
              v-if="project.logo"
              :src="project.logo.srcThumb || project.logo.src"
              :srcset="project.logo.srcset"
              :sizes="project.logo.sizes"
              :alt="project.logo.alt"
              :width="project.logo.width"
              :height="project.logo.height"
              fetchpriority="high"
              decoding="async"
              class="h-auto w-full max-w-[14rem]"
            />
            <p
              v-else
              class="text-center text-sm font-medium text-[hsl(64,0%,98%)]"
            >
              {{ project.name }}
            </p>
          </div>
        </template>
        <template #description>
          <template v-if="project.launch">
            <div class="space-y-3">
              <p class="text-lg text-foreground">
                {{ project.launch.lead }}
              </p>
              <p class="text-base text-muted-foreground">
                {{ project.launch.supportingLine }}
              </p>
            </div>
          </template>
          <div
            v-else
            class="space-y-4 text-lg text-muted-foreground"
          >
            <p
              v-for="(paragraph, index) in descriptionParagraphs"
              :key="index"
            >
              {{ paragraph }}
            </p>
          </div>
        </template>
        <ProjectLaunchActions
          v-if="project.launch && project.github"
          :launch="project.launch"
          :github-owner="project.github.owner"
          :github-repo="project.github.repo"
        />
        <div
          v-else-if="project.links?.length"
          class="flex flex-wrap gap-3"
        >
          <a
            v-for="link in project.links"
            :key="link.href"
            :href="link.href"
            target="_blank"
            rel="noopener noreferrer"
            class="rounded-full border border-border px-5 py-2.5 text-sm font-medium transition hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {{ link.label }}
          </a>
        </div>
      </AppPageHeader>

      <ProjectHowItWorks
        v-if="project.guide"
        :guide="project.guide"
      />

      <section
        v-if="project.benefits?.length"
        aria-labelledby="project-benefits-heading"
        class="space-y-6"
      >
        <h2 id="project-benefits-heading" class="text-xl font-semibold sm:text-2xl">
          {{ benefitsHeading }}
        </h2>
        <ul
          v-if="project.stackTags?.length"
          class="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground sm:space-y-2 sm:pl-6 sm:text-base"
        >
          <li
            v-for="benefit in project.benefits"
            :key="benefit.title"
          >
            <span class="font-medium text-foreground">{{ benefit.title }}</span>
            <template v-if="benefit.description">
              <span class="hidden sm:inline"> — {{ benefit.description }}</span>
            </template>
          </li>
        </ul>
        <ul
          v-else
          class="grid gap-5 sm:grid-cols-2"
        >
          <li
            v-for="benefit in project.benefits"
            :key="benefit.title"
            class="rounded-2xl border border-border bg-card p-6 shadow-sm"
          >
            <h3 class="text-lg font-semibold text-primary">
              {{ benefit.title }}
            </h3>
            <p class="mt-2 text-sm text-muted-foreground">
              {{ benefit.description }}
            </p>
          </li>
        </ul>
      </section>

      <section
        v-if="project.gallery?.length"
        id="project-gallery"
        aria-labelledby="project-gallery-heading"
        class="space-y-4"
      >
        <h2 id="project-gallery-heading" class="text-2xl font-semibold">
          Product gallery
        </h2>
        <ProjectGallery :images="project.gallery" />
      </section>

      <section
        v-if="project.github"
        id="project-releases"
        aria-labelledby="project-releases-heading"
        class="space-y-4"
      >
        <h2 id="project-releases-heading" class="text-2xl font-semibold">
          Downloads
        </h2>
        <p class="text-sm text-muted-foreground">
          Current macOS builds are published on GitHub Releases. This list loads in the browser and is not required to read the rest of the page.
        </p>
        <GithubReleases
          :owner="project.github.owner"
          :repo="project.github.repo"
          :macos-download-warning="project.launch?.macosDownloadWarning"
        />
      </section>

      <ProjectTrustPanel
        v-if="project.launch && project.github"
        :trust-facts="project.launch.trustFacts"
        :github-owner="project.github.owner"
        :github-repo="project.github.repo"
      />

      <p
        v-if="project.launch?.trademark"
        class="max-w-3xl text-xs leading-relaxed text-muted-foreground"
      >
        {{ project.launch.trademark }}
      </p>
    </div>
  </article>
</template>
