<script setup lang="ts">
import CaseHero from '../components/CaseHero.vue'
import CaseSectionNav from '../components/CaseSectionNav.vue'
import CaseClaims from '../components/CaseClaims.vue'
import HomeContact from '~/components/home/HomeContact.vue'
import MediaLightbox from '~/components/media/MediaLightbox.vue'
import CaseSectionRenderer from '../components/sections/CaseSectionRenderer.vue'
import { caseDetailSeo } from '../utils/case-seo'
import {
  openCaseLightboxKey,
  type OpenCaseLightbox,
} from '../utils/lightbox'
import type { CaseImage } from '../data/types'
import { casePageContainer, caseSectionGap } from '../utils/case-ui'
import { resolveSiteUrl } from '~/utils/seo'

useHashScroll()

const route = useRoute()
const slug = String(route.params.slug || '')

const portfolio = await requirePortfolio()
const caseStudy = portfolio.cases.find(item => item.slug === slug)

if (!caseStudy) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Case not found',
  })
}

const home = portfolio.homepage
const siteUrl = resolveSiteUrl(useRuntimeConfig().public.siteUrl as string)
usePageSeo(
  caseDetailSeo(siteUrl, caseStudy, {
    siteName: home.siteName,
    personName: home.person.name,
    featuredWorkHeading: home.featuredWorkHeading,
  }),
  home.siteName,
)

const lightboxImages = ref<CaseImage[]>([])
const lightboxIndex = ref<number | null>(null)

const openLightbox: OpenCaseLightbox = (images, index) => {
  lightboxImages.value = images
  lightboxIndex.value = index
}

function closeLightbox() {
  lightboxIndex.value = null
}

function showPrevious() {
  if (lightboxIndex.value === null || lightboxImages.value.length === 0) return
  lightboxIndex.value = (lightboxIndex.value + lightboxImages.value.length - 1)
    % lightboxImages.value.length
}

function showNext() {
  if (lightboxIndex.value === null || lightboxImages.value.length === 0) return
  lightboxIndex.value = (lightboxIndex.value + 1) % lightboxImages.value.length
}

provide(openCaseLightboxKey, openLightbox)

const hasEvidenceSection = computed(() =>
  caseStudy.sections.some(section => section.kind === 'evidence'),
)
</script>

<template>
  <article class="relative min-h-screen w-full min-w-0 text-foreground">
    <div
      class="relative z-10"
      :class="casePageContainer"
    >
      <div :class="caseSectionGap">
        <CaseHero
          :case-study="caseStudy"
          :homepage="home"
        />

        <CaseSectionNav :sections="caseStudy.sections" />

        <div :class="caseSectionGap">
          <CaseSectionRenderer
            v-for="section in caseStudy.sections"
            :key="section.id"
            :section="section"
            :claims="section.kind === 'evidence' ? caseStudy.claims : []"
            :links="section.kind === 'evidence' ? caseStudy.evidenceLinks : []"
          />
        </div>

        <CaseClaims
          v-if="!hasEvidenceSection"
          :heading="home.proofHeading"
          :claims="caseStudy.claims"
          :links="caseStudy.evidenceLinks"
          :stack-tags="caseStudy.stackTags"
        />

        <HomeContact
          :contact="home.contact"
          compact
        />
      </div>
    </div>

    <MediaLightbox
      :images="lightboxImages"
      :active-index="lightboxIndex"
      @close="closeLightbox"
      @previous="showPrevious"
      @next="showNext"
    />
  </article>
</template>
