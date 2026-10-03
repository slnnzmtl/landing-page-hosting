<script setup lang="ts">
import { useGithubReleases } from '../composables/useGithubReleases'
import { useDownloadWarningDialog } from '../composables/useDownloadWarningDialog'
import type { GithubRelease } from '../utils/github-releases'
import MacosDownloadWarningDialog from './MacosDownloadWarningDialog.vue'

const props = defineProps<{
  owner: string
  repo: string
  macosDownloadWarning?: string
  downloadWarningTitle: string
}>()

const { result } = useGithubReleases(props.owner, props.repo)
const { isOpen, interceptClick, close, confirm } = useDownloadWarningDialog()

function releaseHeading(release: GithubRelease) {
  return release.name === release.tagName ? release.name : `${release.name} (${release.tagName})`
}
</script>

<template>
  <div class="space-y-6">
    <p
      v-if="result.status === 'loading'"
      class="text-sm text-muted-foreground"
      aria-live="polite"
    >
      Loading releases from GitHub…
    </p>

    <p
      v-else-if="result.status === 'empty'"
      class="text-sm text-muted-foreground"
    >
      No public releases are listed yet.
      <a
        :href="result.viewAllUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        View all releases on GitHub
      </a>
    </p>

    <div
      v-else-if="result.status === 'error'"
      class="rounded-2xl border border-border bg-muted/40 p-5 text-sm"
      role="status"
    >
      <p>{{ result.errorMessage }}</p>
      <a
        :href="result.viewAllUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="mt-3 inline-flex font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        View all releases on GitHub
      </a>
    </div>

    <template v-else-if="result.latest">
      <p
        v-if="result.status === 'stale'"
        class="rounded-2xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground"
        role="status"
      >
        {{ result.errorMessage }}
      </p>

      <article class="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <p class="text-sm font-medium uppercase tracking-wide text-primary">
          Latest release
        </p>
        <div class="mt-2 flex flex-wrap items-center gap-2">
          <h3 class="text-xl font-semibold">
            {{ releaseHeading(result.latest) }}
          </h3>
          <span
            v-if="result.latest.prerelease"
            class="rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-medium text-amber-700"
          >
            Pre-release
          </span>
        </div>
        <p class="mt-1 text-sm text-muted-foreground">
          Published {{ result.latest.publishedLabel }}
        </p>
        <p
          v-if="result.latest.notes"
          class="mt-4 whitespace-pre-wrap text-sm text-muted-foreground"
        >
          {{ result.latest.notes }}
        </p>
        <div v-if="result.latest.assets.length" class="mt-5 flex flex-wrap gap-3">
          <a
            v-for="asset in result.latest.assets"
            :key="asset.browserDownloadUrl"
            :href="asset.browserDownloadUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            @click="interceptClick($event, asset.browserDownloadUrl, Boolean(macosDownloadWarning))"
          >
            Download
          </a>
        </div>
        <a
          :href="result.latest.htmlUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="mt-4 inline-flex text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Open this release on GitHub
        </a>
      </article>

      <div v-if="result.recent.length" class="space-y-3">
        <h3 class="text-lg font-semibold">
          Recent releases
        </h3>
        <ul class="space-y-3">
          <li
            v-for="release in result.recent"
            :key="release.id"
            class="rounded-2xl border border-border p-4"
          >
            <div class="flex flex-wrap items-center gap-2">
              <p class="font-medium">
                {{ releaseHeading(release) }}
              </p>
              <span
                v-if="release.prerelease"
                class="rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-medium text-amber-700"
              >
                Pre-release
              </span>
            </div>
            <p class="text-sm text-muted-foreground">
              {{ release.publishedLabel }}
            </p>
            <a
              :href="release.htmlUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="mt-2 inline-flex text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Release notes and downloads
            </a>
          </li>
        </ul>
      </div>

      <a
        :href="result.viewAllUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        View all releases on GitHub
      </a>

      <MacosDownloadWarningDialog
        v-if="isOpen && macosDownloadWarning"
        :message="macosDownloadWarning"
        :title="downloadWarningTitle"
        @close="close"
        @confirm="confirm"
      />
    </template>
  </div>
</template>
