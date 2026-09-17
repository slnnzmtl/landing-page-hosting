<script setup lang="ts">
import type { ProductSpotlight } from '~/data/homepage'
import { useHomepageUi } from '~/composables/useHomepageUi'
import { useGithubReleases } from '~/domains/projects/composables/useGithubReleases'
import { findMacosUniversalAsset } from '~/domains/projects/utils/github-releases'

const props = defineProps<{
  product: ProductSpotlight
}>()

const { linkFocus, outboundAttrs } = useHomepageUi()
const { result } = useGithubReleases(props.product.github.owner, props.product.github.repo)

const primaryCta = computed(() => props.product.ctas.find(cta => cta.kind === 'primary'))
const secondaryCtas = computed(() => props.product.ctas.filter(cta => cta.kind === 'secondary'))

const macosAsset = computed(() => {
  if (!result.value.latest) return undefined
  return findMacosUniversalAsset(result.value.latest.assets)
})

const primaryHref = computed(() => {
  if (primaryCta.value?.macosDownload && macosAsset.value) {
    return macosAsset.value.browserDownloadUrl
  }
  return primaryCta.value?.href ?? '#'
})

const versionLabel = computed(() => {
  const latest = result.value.latest
  if (!latest) {
    if (result.value.status === 'loading' || result.value.status === 'idle') {
      return 'Checking latest release…'
    }
    if (result.value.status === 'empty') {
      return 'No public release listed yet'
    }
    return 'See releases on GitHub'
  }
  const status = latest.prerelease ? 'Pre-release' : 'Latest release'
  return `${status} ${latest.tagName}`
})

const primaryLinkClass = [
  'inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90',
  linkFocus,
].join(' ')

const secondaryLinkClass = [
  'inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline',
  linkFocus,
].join(' ')
</script>

<template>
  <article class="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
    <div class="grid gap-0 lg:grid-cols-2">
      <div class="border-b border-border bg-muted/40 p-4 sm:p-6 lg:border-b-0 lg:border-r">
        <img
          :src="product.image.srcThumb || product.image.src"
          :srcset="product.image.srcset"
          :sizes="product.image.sizes"
          :alt="product.image.alt"
          :width="product.image.width"
          :height="product.image.height"
          class="h-auto w-full rounded-2xl border border-border object-cover shadow-sm"
          loading="lazy"
        />
      </div>

      <div class="flex flex-col justify-center p-6 sm:p-8">
        <h3 class="text-2xl font-semibold tracking-tight">
          {{ product.title }}
        </h3>
        <p class="mt-3 text-base leading-relaxed text-foreground">
          {{ product.lead }}
        </p>
        <p class="mt-2 text-sm leading-relaxed text-muted-foreground">
          {{ product.supportingLine }}
        </p>

        <dl class="mt-6 grid gap-3 sm:grid-cols-2">
          <div
            v-for="fact in product.facts"
            :key="fact.label"
            class="rounded-2xl border border-border bg-muted/30 px-4 py-3"
          >
            <dt class="text-xs font-semibold uppercase tracking-wide text-primary">
              {{ fact.label }}
            </dt>
            <dd class="mt-1 text-sm text-muted-foreground">
              {{ fact.value }}
            </dd>
          </div>
          <div class="rounded-2xl border border-border bg-muted/30 px-4 py-3">
            <dt class="text-xs font-semibold uppercase tracking-wide text-primary">
              Release
            </dt>
            <dd class="mt-1 text-sm text-muted-foreground">
              {{ versionLabel }}
            </dd>
          </div>
        </dl>

        <div class="mt-6 flex flex-wrap items-center gap-5">
          <a
            v-if="primaryCta"
            :href="primaryHref"
            v-bind="outboundAttrs(primaryHref)"
            :class="primaryLinkClass"
          >
            {{ primaryCta.label }}
          </a>
          <div class="flex flex-wrap items-center gap-3">
            <div v-for="cta in secondaryCtas" :key="cta.label">
              <a :href="cta.href" v-bind="outboundAttrs(cta.href)" :class="secondaryLinkClass">
                {{ cta.label }}
              </a>
            </div>
          </div>
        </div>

        <p
          v-if="product.tags.length"
          class="mt-5 text-xs text-muted-foreground"
        >
          {{ product.tags.join(' · ') }}
        </p>
      </div>
    </div>
  </article>
</template>
