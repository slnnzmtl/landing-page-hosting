<script setup lang="ts">
import type { HomepageContent } from '~/data/homepage'
import { useHomepageUi } from '~/composables/useHomepageUi'
import { trackHomepageHref } from '~/composables/useHomepageConversion'

const props = defineProps<{
  contact: HomepageContent['contact']
}>()

const { linkFocus } = useHomepageUi()

const contactEmailDisplay = computed(() =>
  props.contact.email.href.replace(/^mailto:/i, ''),
)

const contactTelegramDisplay = computed(() =>
  props.contact.telegram.href.replace(/^https?:\/\/t\.me\//i, ''),
)

function onContactClick(href: string) {
  trackHomepageHref(href)
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
      <p>
        <span class="block text-sm text-muted-foreground">
          {{ contact.email.label }}
        </span>
        <a
          :href="contact.email.href"
          :class="['text-base font-medium text-foreground hover:text-primary', linkFocus]"
          @click="onContactClick(contact.email.href)"
        >
          {{ contactEmailDisplay }}
        </a>
      </p>
      <p class="mt-6">
        <span class="block text-sm text-muted-foreground">
          {{ contact.telegram.label }}
        </span>
        <a
          :href="contact.telegram.href"
          :class="['text-base font-medium text-foreground hover:text-primary', linkFocus]"
          @click="onContactClick(contact.telegram.href)"
        >
          {{ contactTelegramDisplay }}
        </a>
      </p>
    </div>
  </section>
</template>
