<script setup lang="ts">
import type { FeaturedCase } from '~/data/homepage'
import { homepageHrefKind, opensInNewTab } from '~/data/homepage'
import { useHomepageUi } from '~/composables/useHomepageUi'
import { trackHomepageHref } from '~/composables/useHomepageConversion'

const props = defineProps<{
  item: FeaturedCase
}>()

const { linkFocus, outboundAttrs } = useHomepageUi()

const isExternal = computed(() =>
  props.item.href ? opensInNewTab(props.item.href) : false,
)
const isFlagship = computed(() => Boolean(props.item.featured))

function onCaseCtaClick() {
  if (!props.item.href) return
  trackHomepageHref(props.item.href, {
    featured: isFlagship.value,
    slug: props.item.slug,
  })
}

const linkClass = [
  'inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline',
  linkFocus,
].join(' ')

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
      Flagship case
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
      <a
        v-if="homepageHrefKind(item.href) === 'native'"
        :href="item.href"
        v-bind="outboundAttrs(item.href)"
        :class="linkClass"
        @click="onCaseCtaClick"
      >
        {{ item.hrefLabel }}
        <svg
          v-if="isExternal"
          viewBox="0 0 20 20"
          fill="none"
          class="h-3.5 w-3.5 shrink-0"
          aria-hidden="true"
        >
          <path
            d="M8 4H4.5A1.5 1.5 0 003 5.5v10A1.5 1.5 0 004.5 17h10a1.5 1.5 0 001.5-1.5V12M12 3h5v5M17 3l-8 8"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </a>
      <NuxtLink
        v-else
        :to="item.href"
        :class="linkClass"
        @click="onCaseCtaClick"
      >
        {{ item.hrefLabel }}
      </NuxtLink>
    </div>
  </article>
</template>
