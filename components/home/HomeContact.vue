<script setup lang="ts">
import type { HomepageContent, HomepageLink } from '~/data/homepage'
import { useHomepageUi } from '~/composables/useHomepageUi'

const props = defineProps<{
  contact: HomepageContent['contact']
  profileLinks: HomepageLink[]
}>()

const { linkFocus } = useHomepageUi()

const contactEmailDisplay = computed(() =>
  props.contact.email.href.replace(/^mailto:/i, ''),
)

const contactTelegramDisplay = computed(() =>
  props.contact.telegram.href.replace(/^https?:\/\/t\.me\//i, ''),
)
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
      <h3 class="text-sm font-semibold uppercase tracking-wide text-primary">
        Get in touch
      </h3>
      <p class="mt-6">
        <span class="block text-sm text-muted-foreground">
          {{ contact.email.label }}
        </span>
        <a
          :href="contact.email.href"
          :class="['text-base font-medium text-foreground hover:text-primary', linkFocus]"
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
        >
          {{ contactTelegramDisplay }}
        </a>
      </p>
      <HomeProfileLinkList
        :links="profileLinks"
        list-class="mt-6 flex flex-col gap-2 text-sm"
        key-prefix="contact-"
      />
    </div>
  </section>
</template>
