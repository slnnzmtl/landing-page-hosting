<script setup lang="ts">
import AppBackLink from '~/components/AppBackLink.vue'
import type { CaseStudy } from '../data/types'
import type { HomepageContent } from '~/data/homepage'
import CaseParagraphs from './CaseParagraphs.vue'
import CaseMedia from './CaseMedia.vue'
import CaseFacts from './CaseFacts.vue'
import { openCaseLightboxKey } from '../utils/lightbox'
import {
  caseLeadText,
  casePrimaryCta,
  caseSecondaryCta,
} from '../utils/case-ui'
import { useHomepageUi } from '~/composables/useHomepageUi'
import { homepageHrefKind, opensInNewTab } from '~/data/homepage'

const props = defineProps<{
  caseStudy: CaseStudy
  homepage: HomepageContent
}>()

const openLightbox = inject(openCaseLightboxKey)
const { linkFocus, outboundAttrs } = useHomepageUi()

const primarySource = computed(() => props.caseStudy.evidenceLinks[0])

const primaryIsNative = computed(() =>
  primarySource.value ? homepageHrefKind(primarySource.value.href) === 'native' : false,
)

const backLabel = computed(() => props.homepage.featuredWorkHeading)

const contactNav = computed(() =>
  props.homepage.navItems.find(item => /contact/i.test(item.href) || /contact/i.test(item.label)),
)

const hasFacts = computed(() =>
  Boolean(
    props.caseStudy.role?.trim()
    || props.caseStudy.stageLabel
    || props.caseStudy.stackTags.length,
  ),
)

function openHero() {
  if (!props.caseStudy.heroMedia || !openLightbox) return
  openLightbox([props.caseStudy.heroMedia], 0)
}

function scrollToContact(event: MouseEvent) {
  event.preventDefault()
  const target = document.getElementById('contact')
  if (!target) return
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
  history.replaceState(null, '', '#contact')
}
</script>

<template>
  <header class="w-full space-y-6">
    <AppBackLink to="/#featured-work">
      {{ backLabel }}
    </AppBackLink>

    <div class="min-w-0 space-y-5">
      <div class="space-y-3">
        <p
          v-if="caseStudy.engagementLabel"
          class="text-sm leading-6 text-foreground/85"
        >
          {{ caseStudy.engagementLabel }}
        </p>
        <h1 class="max-w-xl text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:max-w-none">
          {{ caseStudy.name }}
        </h1>
      </div>

      <CaseParagraphs
        :paragraphs="caseStudy.caseLeadParagraphs"
        :class-name="caseLeadText"
      />

      <div class="flex flex-wrap items-center gap-3">
        <a
          v-if="primarySource && primaryIsNative"
          :href="primarySource.href"
          v-bind="outboundAttrs(primarySource.href)"
          :class="[casePrimaryCta, linkFocus]"
        >
          {{ primarySource.label }}
          <span
            v-if="opensInNewTab(primarySource.href)"
            class="sr-only"
          >(opens in a new tab)</span>
        </a>
        <NuxtLink
          v-else-if="primarySource"
          :to="primarySource.href"
          :class="[casePrimaryCta, linkFocus]"
        >
          {{ primarySource.label }}
        </NuxtLink>
        <a
          v-if="contactNav"
          href="#contact"
          :class="[caseSecondaryCta, linkFocus]"
          @click="scrollToContact"
        >
          {{ contactNav.label }}
        </a>
      </div>

      <CaseFacts
        v-if="hasFacts"
        :case-study="caseStudy"
      />
    </div>

    <CaseMedia
      v-if="caseStudy.heroMedia"
      :image="caseStudy.heroMedia"
      size="hero"
      priority
      @open="openHero"
    />
  </header>
</template>
