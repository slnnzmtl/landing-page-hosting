<script setup lang="ts">
import { homepageHrefKind, opensInNewTab } from '~/data/homepage'
import { useHomepageUi } from '~/composables/useHomepageUi'

const props = withDefaults(defineProps<{
  href: string
  muted?: boolean
}>(), {
  muted: false,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const { outboundAttrs, linkFocus } = useHomepageUi()

const linkClass = computed(() => [
  'inline-flex items-center gap-1.5 text-sm underline-offset-4',
  props.muted
    ? 'text-muted-foreground hover:text-foreground hover:underline'
    : 'font-medium text-primary hover:underline',
  linkFocus,
].join(' '))

const external = computed(() => opensInNewTab(props.href))
const native = computed(() => homepageHrefKind(props.href) === 'native')
</script>

<template>
  <a
    v-if="native"
    :href="href"
    v-bind="outboundAttrs(href)"
    :class="linkClass"
    @click="emit('click', $event)"
  >
    <slot />
    <svg
      v-if="external"
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
    :to="href"
    :class="linkClass"
    @click="emit('click', $event)"
  >
    <slot />
  </NuxtLink>
</template>
