<script setup lang="ts">
import AppPageHeader from '~/components/AppPageHeader.vue'
import MediaGallery from '~/components/media/MediaGallery.vue'
import ProductHowItWorks from './ProductHowItWorks.vue'
import StaticProductActions from './StaticProductActions.vue'
import ExtensionMediaShowcase from './ExtensionMediaShowcase.vue'
import type { ExtensionProduct } from '../data/types'

defineProps<{
  project: ExtensionProduct
  detail: {
    back_href: string
    back_label: string
    benefits_heading_default: string
  }
}>()

function money(project: ExtensionProduct): string {
  if (project.price.amount === 0) return 'Free'
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: project.price.currency,
  }).format(project.price.amount)
}
</script>

<template>
  <article class="relative min-h-screen w-full min-w-0 text-foreground">
    <div class="relative z-10 mx-auto flex w-full min-w-0 max-w-6xl flex-col gap-16 px-6 py-12 pb-28 sm:px-6 sm:py-20 lg:px-12 xl:pb-20">
      <AppPageHeader
        :kicker="project.kicker"
        :title="project.name"
        :back="{ to: detail.back_href, label: detail.back_label }"
      >
        <template #media>
          <div class="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border bg-[hsl(64,0%,1.43%)] p-2 ring-1 ring-[hsl(64,0%,98%)]/15 sm:size-24 sm:p-2.5 lg:size-auto lg:w-full lg:rounded-3xl lg:p-8">
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
          </div>
        </template>
        <template #description>
          <div class="space-y-3">
            <p class="text-lg text-foreground">
              {{ project.launch?.lead || project.shortDescription }}
            </p>
            <p class="text-base text-muted-foreground">
              {{ project.launch?.supportingLine || project.description }}
            </p>
            <dl class="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <div>
                <dt class="sr-only">
                  Price
                </dt>
                <dd class="font-medium text-foreground">
                  {{ money(project) }}
                </dd>
              </div>
              <div>
                <dt class="sr-only">
                  Requirements
                </dt>
                <dd>
                  {{ project.softwareRequirements }}
                </dd>
              </div>
            </dl>
          </div>
        </template>
        <StaticProductActions
          v-if="project.launch"
          :launch="project.launch"
        />
      </AppPageHeader>

      <ExtensionMediaShowcase
        v-if="project.media.find(item => item.presentation === 'comparison_before') && project.media.find(item => item.presentation === 'comparison_after')"
        :before="project.media.find(item => item.presentation === 'comparison_before')!"
        :after="project.media.find(item => item.presentation === 'comparison_after')!"
        :heading="project.mediaHeading"
        :intro="project.mediaIntro"
      />

      <section
        v-if="project.benefits?.length"
        aria-labelledby="extension-benefits-heading"
        class="space-y-6"
      >
        <h2 id="extension-benefits-heading" class="text-xl font-semibold sm:text-2xl">
          {{ detail.benefits_heading_default }}
        </h2>
        <ul class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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

      <ProductHowItWorks
        v-if="project.guide"
        :guide="project.guide"
      />

      <section
        v-if="project.media.filter(item => item.presentation === 'gallery').length"
        id="extension-gallery"
        aria-labelledby="extension-gallery-heading"
        class="space-y-4"
      >
        <h2 id="extension-gallery-heading" class="text-2xl font-semibold">
          Screenshots
        </h2>
        <MediaGallery
          :images="project.media.filter(item => item.presentation === 'gallery')"
          columns="two"
        />
      </section>

      <section
        aria-labelledby="extension-info-heading"
        class="space-y-4"
      >
        <h2 id="extension-info-heading" class="text-2xl font-semibold">
          Product information
        </h2>
        <dl class="max-w-3xl space-y-2 text-sm leading-relaxed text-muted-foreground">
          <div
            v-for="fact in project.launch?.trustFacts || []"
            :key="fact.label"
            class="flex flex-wrap gap-x-2"
          >
            <dt class="font-medium text-foreground after:content-[':']">
              {{ fact.label }}
            </dt>
            <dd>
              <a
                v-if="fact.href"
                :href="fact.href"
                target="_blank"
                rel="noopener noreferrer"
                class="text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {{ fact.value }}
              </a>
              <template v-else>
                {{ fact.value }}
              </template>
            </dd>
          </div>
        </dl>
      </section>

      <section
        v-if="project.launch"
        aria-labelledby="extension-final-cta-heading"
        class="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8"
      >
        <div class="space-y-4">
          <h2 id="extension-final-cta-heading" class="text-2xl font-semibold">
            Install {{ project.name }}
          </h2>
          <p class="max-w-2xl text-sm text-muted-foreground">
            Try the free extension and customize SoundCloud to fit your workflow.
          </p>
          <StaticProductActions :launch="project.launch" />
        </div>
      </section>

      <p
        v-if="project.launch?.trademark"
        class="max-w-3xl text-xs leading-relaxed text-muted-foreground"
      >
        {{ project.launch.trademark }}
      </p>
    </div>
  </article>
</template>
