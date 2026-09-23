<script setup lang="ts">
import type { FeaturedCase } from '~/data/homepage'
import { trackHomepageHref } from '~/composables/useHomepageConversion'
import OutboundTextLink from '~/components/OutboundTextLink.vue'

const props = defineProps<{
  item: FeaturedCase
  flagshipLabel: string
}>()

const isFlagship = computed(() => Boolean(props.item.featured))

function onCaseCtaClick() {
  if (!props.item.href) return
  trackHomepageHref(props.item.href, {
    featured: isFlagship.value,
    slug: props.item.slug,
  })
}

const fields = computed(() => [
  { label: 'Problem', text: props.item.problem },
  { label: 'Role', text: props.item.role },
  { label: 'Contribution', text: props.item.contribution },
  { label: 'Outcome', text: props.item.outcome },
])
</script>

<template>
  <article
    :id="isFlagship ? 'flagship-case' : undefined"
    :class="[
      'flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-sm sm:rounded-3xl sm:p-6',
      isFlagship ? 'ring-1 ring-primary/30' : '',
    ]"
  >
    <p
      v-if="isFlagship"
      class="text-xs font-semibold uppercase tracking-wide text-primary"
    >
      {{ flagshipLabel }}
    </p>
    <h3
      class="text-lg font-semibold leading-snug text-foreground"
      :class="isFlagship ? 'mt-2' : ''"
    >
      {{ item.title }}
    </h3>

    <dl class="mt-4 space-y-3">
      <div
        v-for="field in fields"
        :key="field.label"
      >
        <dt class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {{ field.label }}
        </dt>
        <dd class="mt-1 text-sm leading-relaxed text-foreground">
          {{ field.text }}
        </dd>
      </div>
    </dl>

    <p
      v-if="item.stack.length"
      class="mt-4 text-xs text-muted-foreground"
    >
      {{ item.stack.join(' · ') }}
    </p>

    <div
      v-if="item.href"
      class="mt-auto pt-4"
    >
      <OutboundTextLink
        :href="item.href"
        @click="onCaseCtaClick"
      >
        {{ item.hrefLabel }}
      </OutboundTextLink>
    </div>
  </article>
</template>
