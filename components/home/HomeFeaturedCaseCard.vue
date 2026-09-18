<script setup lang="ts">
import { conversionEventName, homepageHrefKind, opensInNewTab, type WorkCard } from '~/data/homepage'
import { useHomepageUi } from '~/composables/useHomepageUi'
import { trackConversion } from '~/utils/track-conversion'

const COLLAPSED_LINES_MOBILE = 2
const COLLAPSED_LINES_DESKTOP = 5

const props = defineProps<{
  item: WorkCard
  /** Trim long summaries behind an expandable control */
  collapsibleSummary?: boolean
}>()

const { linkFocus, outboundAttrs } = useHomepageUi()

const expanded = ref(false)
const measured = ref(false)
const summaryTextRef = ref<HTMLElement | null>(null)
const collapsedHeight = ref(0)
const fullHeight = ref(0)
const canCollapse = ref(false)
const isDesktop = ref(false)

const summaryParagraphs = computed(() =>
  props.item.summary
    .split(/\n{2,}/)
    .map(paragraph => paragraph.trim())
    .filter(Boolean),
)

const hasCta = computed(() => Boolean(props.item.href && props.item.hrefLabel))
const isExternal = computed(() =>
  props.item.href ? opensInNewTab(props.item.href) : false,
)

function onCaseCtaClick() {
  const href = props.item.href
  if (!href) return
  const name = conversionEventName(href)
  if (!name) return
  if (name === 'case_outbound') {
    trackConversion(name, { slug: props.item.slug })
    return
  }
  trackConversion(name)
}

const linkClass = [
  'inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline',
  linkFocus,
].join(' ')

const summaryStyle = computed(() => {
  if (!props.collapsibleSummary || !measured.value || !canCollapse.value) {
    return undefined
  }
  const height = expanded.value ? fullHeight.value : collapsedHeight.value
  return {
    maxHeight: `${height}px`,
  }
})

const collapsedLineClampClass = computed(() => {
  if (measured.value) {
    return ''
  }
  return 'line-clamp-2 sm:line-clamp-5'
})

function collapsedLineCount() {
  return isDesktop.value ? COLLAPSED_LINES_DESKTOP : COLLAPSED_LINES_MOBILE
}

function measureHeights() {
  const el = summaryTextRef.value
  if (!el || !props.collapsibleSummary) {
    canCollapse.value = false
    measured.value = true
    return
  }

  const firstParagraph = el.querySelector('p')
  const styles = getComputedStyle(firstParagraph ?? el)
  const lineHeight = Number.parseFloat(styles.lineHeight) || 20
  const nextCollapsed = Math.ceil(lineHeight * collapsedLineCount())
  const nextFull = el.scrollHeight

  collapsedHeight.value = nextCollapsed
  fullHeight.value = nextFull
  canCollapse.value = nextFull > nextCollapsed + 2
  if (!canCollapse.value) {
    expanded.value = false
  }
  measured.value = true
}

function onToggle() {
  expanded.value = !expanded.value
}

let mediaQuery: MediaQueryList | null = null

function onViewportChange() {
  isDesktop.value = Boolean(mediaQuery?.matches)
  nextTick(measureHeights)
}

onMounted(() => {
  mediaQuery = window.matchMedia('(min-width: 640px)')
  isDesktop.value = mediaQuery.matches
  mediaQuery.addEventListener('change', onViewportChange)
  nextTick(measureHeights)
  window.addEventListener('resize', onViewportChange)
})

onBeforeUnmount(() => {
  mediaQuery?.removeEventListener('change', onViewportChange)
  window.removeEventListener('resize', onViewportChange)
})

watch(() => props.item.summary, () => {
  measured.value = false
  nextTick(measureHeights)
})
</script>

<template>
  <article class="py-5">
    <div class="flex gap-3 sm:gap-4">
      <div
        v-if="item.icon"
        class="mt-0.5 h-8 w-8 shrink-0 overflow-hidden rounded-lg border border-border bg-white"
      >
        <img
          :src="item.icon"
          :alt="item.iconAlt || item.title"
          width="48"
          height="48"
          class="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      <div class="min-w-0 flex-1">
        <h4 class="text-base font-semibold leading-snug text-foreground">
          {{ item.title }}
        </h4>
        <p
          v-if="item.subtitle"
          class="mt-1 text-sm text-muted-foreground"
        >
          {{ item.subtitle }}
        </p>

        <div
          v-if="collapsibleSummary"
          class="mt-2"
        >
          <div
            class="overflow-hidden transition-[max-height] duration-300 ease-in-out"
            :class="collapsedLineClampClass"
            :style="summaryStyle"
          >
            <div
              ref="summaryTextRef"
              class="space-y-3"
            >
              <p
                v-for="(paragraph, index) in summaryParagraphs"
                :key="`summary-${index}`"
                class="text-sm leading-relaxed text-muted-foreground"
              >
                {{ paragraph }}
              </p>
            </div>
          </div>
          <button
            v-if="canCollapse"
            type="button"
            :aria-expanded="expanded"
            :class="[
              'mt-2 text-sm font-medium text-primary underline-offset-4 hover:underline',
              linkFocus,
            ]"
            @click="onToggle"
          >
            {{ expanded ? 'Show less' : 'Show more' }}
          </button>
        </div>
        <div
          v-else
          class="mt-2 space-y-3"
        >
          <p
            v-for="(paragraph, index) in summaryParagraphs"
            :key="`summary-plain-${index}`"
            class="text-sm leading-relaxed text-muted-foreground"
          >
            {{ paragraph }}
          </p>
        </div>

        <p
          v-if="item.tags?.length"
          class="mt-2 text-xs text-muted-foreground"
        >
          {{ item.tags.join(' · ') }}
        </p>
        <template v-if="hasCta && item.href && item.hrefLabel">
          <a
            v-if="homepageHrefKind(item.href) === 'native'"
            :href="item.href"
            v-bind="outboundAttrs(item.href)"
            :class="['mt-3', linkClass]"
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
            :class="['mt-3', linkClass]"
            @click="onCaseCtaClick"
          >
            {{ item.hrefLabel }}
          </NuxtLink>
        </template>
      </div>
    </div>
  </article>
</template>
