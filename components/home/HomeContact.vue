<script setup lang="ts">
import type { HomepageContent } from '~/data/homepage'
import { useHomepageUi } from '~/composables/useHomepageUi'
import { trackHomepageHref } from '~/composables/useHomepageConversion'

defineProps<{
  contact: HomepageContent['contact']
}>()

const { linkFocus, outboundAttrs } = useHomepageUi()

function onContactClick(href: string) {
  trackHomepageHref(href, { contact: true })
}
</script>

<template>
  <section
    id="contact"
    aria-labelledby="contact-heading"
    class="scroll-mt-24 grid gap-8 md:grid-cols-2"
  >
    <div>
      <h2
        id="contact-heading"
        class="text-2xl font-semibold"
      >
        {{ contact.heading }}
      </h2>
      <p class="mt-3 text-muted-foreground">
        {{ contact.summary }}
      </p>
    </div>
    <div class="rounded-3xl border border-dashed border-primary/40 bg-card p-8 shadow-sm">
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
  </section>
</template>
