<script setup lang="ts">
import { computed } from 'vue'
import type { HomepageContent } from '~/data/homepage'
import { useHomepageUi } from '~/composables/useHomepageUi'
import { trackHomepageHref } from '~/composables/useHomepageConversion'

const props = withDefaults(defineProps<{
  contact: HomepageContent['contact']
  /** Single full-width CTA band (case pages). */
  compact?: boolean
  /** Override CMS copy when this contact block is used as a page template. */
  heading?: string
  summary?: string
  primaryLabel?: string
  /** Render as a semantic footer when the block closes a page. */
  as?: 'section' | 'footer'
}>(), {
  compact: false,
  heading: undefined,
  summary: undefined,
  primaryLabel: 'Contact',
  as: 'section',
})

const displayHeading = computed(() => props.heading || props.contact.heading)
const displaySummary = computed(() => props.summary || props.contact.summary)

const { linkFocus, outboundAttrs } = useHomepageUi()

function onContactClick(href: string) {
  trackHomepageHref(href, { contact: true })
}
</script>

<template>
  <component
    :is="as"
    id="contact"
    aria-labelledby="contact-heading"
    :class="compact
      ? 'scroll-mt-24 border-y border-primary/30 bg-primary/[0.045] px-5 py-6 sm:flex sm:items-center sm:justify-between sm:gap-8 sm:px-6 sm:py-7'
      : 'scroll-mt-24 grid gap-8 md:grid-cols-2'"
  >
    <div :class="compact ? 'min-w-0' : undefined">
      <h2
        id="contact-heading"
        :class="compact ? 'text-xl font-semibold tracking-tight' : 'text-2xl font-semibold'"
      >
        {{ displayHeading }}
      </h2>
      <p
        :class="compact
          ? 'mt-1.5 max-w-[70ch] text-sm text-muted-foreground'
          : 'mt-3 text-muted-foreground'"
      >
        {{ displaySummary }}
      </p>
    </div>

    <div
      v-if="compact"
      class="mt-4 flex flex-wrap items-center gap-3 sm:mt-0 sm:justify-end"
    >
      <a
        v-if="contact.links[0]"
        :href="contact.links[0].href"
        v-bind="outboundAttrs(contact.links[0].href)"
        :class="['inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90', linkFocus]"
        @click="onContactClick(contact.links[0].href)"
      >
        {{ primaryLabel }}
      </a>
      <a
        v-for="link in contact.links.slice(1)"
        :key="link.href"
        :href="link.href"
        v-bind="outboundAttrs(link.href)"
        :class="['text-sm font-medium text-foreground hover:text-primary', linkFocus]"
        @click="onContactClick(link.href)"
      >
        {{ link.label }} ↗
      </a>
    </div>

    <div
      v-else
      class="rounded-3xl border border-dashed border-primary/40 bg-card p-8 shadow-sm"
    >
      <p
        v-for="(link, index) in contact.links"
        :key="link.href"
        :class="index > 0 ? 'mt-4' : undefined"
      >
        <span class="block text-base text-muted-foreground">
          {{ link.label }}
        </span>
        <a
          :href="link.href"
          v-bind="outboundAttrs(link.href)"
          :class="['text-base font-medium text-foreground hover:text-primary', linkFocus]"
          @click="onContactClick(link.href)"
        >
          {{ link.title }}
        </a>
      </p>
    </div>
  </component>
</template>
