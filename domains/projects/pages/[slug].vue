<script setup lang="ts">
import { useProjects } from '../composables/useProjects'
import ProjectGallery from '../components/ProjectGallery.vue'
import GithubReleases from '../components/GithubReleases.vue'
import ProjectLaunchActions from '../components/ProjectLaunchActions.vue'
import ProjectTrustPanel from '../components/ProjectTrustPanel.vue'
import { useProjectPageSeo } from '../composables/useProjectPageSeo'
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
useProjectPageSeo(projectDetailSeo(siteUrl, project))

const descriptionParagraphs = computed(() => {
  const text = project.description || project.shortDescription
  return text.split(/\n{2,}/).map(paragraph => paragraph.trim()).filter(Boolean)
})

const benefitsHeading = computed(() => (
  project.stackTags?.length ? 'Feature highlights' : 'Why use it'
))

const heroParagraphs = computed(() => {
  if (project.launch) {
    return []
  }
  const text = project.description || project.shortDescription
  return text.split(/\n{2,}/).map(paragraph => paragraph.trim()).filter(Boolean)
})
</script>

<template>
  <article class="min-h-screen bg-background text-foreground">
    <div class="mx-auto flex max-w-5xl flex-col gap-16 px-6 py-20 lg:px-12">
      <nav aria-label="Breadcrumb">
        <ol class="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <li>
            <NuxtLink
              to="/"
              class="transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Homepage
            </NuxtLink>
          </li>
          <li aria-hidden="true">
            /
          </li>
          <li>
            <NuxtLink
              to="/projects"
              class="transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Selected projects
            </NuxtLink>
          </li>
          <li aria-hidden="true">
            /
          </li>
          <li class="text-foreground">
            {{ project.name }}
          </li>
        </ol>
      </nav>

      <header class="grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(12rem,16rem)] lg:items-center">
        <div class="space-y-5">
          <p class="text-sm uppercase tracking-[0.35em] text-primary">
            Product
          </p>
          <h1 class="text-4xl font-semibold leading-tight sm:text-5xl">
            {{ project.name }}
          </h1>
          <template v-if="project.launch">
            <div class="max-w-2xl space-y-3">
              <p class="text-lg text-foreground">
                {{ project.launch.lead }}
              </p>
              <p class="text-base text-muted-foreground">
                {{ project.launch.supportingLine }}
              </p>
            </div>
            <ProjectLaunchActions
              v-if="project.github"
              :launch="project.launch"
              :github-owner="project.github.owner"
              :github-repo="project.github.repo"
            />
          </template>
          <template v-else>
            <div class="max-w-2xl space-y-4 text-lg text-muted-foreground">
              <p
                v-for="(paragraph, index) in heroParagraphs"
                :key="index"
              >
                {{ paragraph }}
              </p>
            </div>
            <div v-if="project.links?.length" class="flex flex-wrap gap-3">
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
          </template>
          <p
            v-if="project.stackTags?.length && !project.launch"
            class="max-w-2xl text-sm text-muted-foreground"
          >
            <span class="font-medium text-foreground">Stack: </span>
            {{ project.stackTags.join(' · ') }}
          </p>
        </div>
        <div
          id="project-hero-media"
          class="flex items-center justify-center rounded-3xl border border-border bg-[hsl(64,0%,1.43%)] p-8 ring-1 ring-[hsl(64,0%,98%)]/15"
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
      </header>

      <ProjectTrustPanel
        v-if="project.launch && project.github"
        :trust-facts="project.launch.trustFacts"
        :github-owner="project.github.owner"
        :github-repo="project.github.repo"
        :trademark="project.launch.trademark"
      />

      <section
        v-if="project.launch && descriptionParagraphs.length"
        aria-labelledby="project-how-heading"
        class="space-y-4"
      >
        <h2 id="project-how-heading" class="text-2xl font-semibold">
          How it works
        </h2>
        <div class="max-w-3xl space-y-4 text-muted-foreground">
          <p
            v-for="(paragraph, index) in descriptionParagraphs"
            :key="index"
          >
            {{ paragraph }}
          </p>
        </div>
        <p
          v-if="project.stackTags?.length"
          class="max-w-3xl text-sm text-muted-foreground"
        >
          <span class="font-medium text-foreground">Stack: </span>
          {{ project.stackTags.join(' · ') }}
        </p>
      </section>

      <section
        v-if="project.benefits?.length"
        aria-labelledby="project-benefits-heading"
        class="space-y-6"
      >
        <h2 id="project-benefits-heading" class="text-2xl font-semibold">
          {{ benefitsHeading }}
        </h2>
        <ul
          v-if="project.stackTags?.length"
          class="list-disc space-y-2 pl-6 text-muted-foreground"
        >
          <li
            v-for="benefit in project.benefits"
            :key="benefit.title"
          >
            <span class="font-medium text-foreground">{{ benefit.title }}</span>
            <template v-if="benefit.description">
              — {{ benefit.description }}
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
        v-if="project.guide"
        aria-labelledby="project-guide-heading"
        class="space-y-6"
      >
        <h2 id="project-guide-heading" class="text-2xl font-semibold">
          {{ project.guide.title }}
        </h2>
        <p
          v-if="project.guide.warning"
          class="rounded-2xl border border-amber-500 bg-amber-400 px-5 py-4 text-sm font-medium text-amber-950"
          role="note"
        >
          {{ project.guide.warning }}
        </p>
        <ol class="grid gap-5 md:grid-cols-3">
          <li
            v-for="(step, index) in project.guide.steps"
            :key="step.title"
            class="rounded-2xl border border-border bg-muted/40 p-6"
          >
            <p class="text-sm font-semibold uppercase tracking-wide text-primary">
              Step {{ index + 1 }}
            </p>
            <h3 class="mt-2 text-lg font-semibold">
              {{ step.title }}
            </h3>
            <p class="mt-2 text-sm text-muted-foreground">
              {{ step.body }}
            </p>
          </li>
        </ol>
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
        />
      </section>
    </div>
  </article>
</template>
