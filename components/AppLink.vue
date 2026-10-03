<script setup lang="ts">
import { externalLinkRel, homepageHrefKind, opensInNewTab } from '~/data/homepage'
import { useHomepageUi } from '~/composables/useHomepageUi'
import { parseAppLink } from '~/utils/app-link'

const props = defineProps<{
  href: string
}>()

const { interactiveTransition, linkFocus } = useHomepageUi()
const isNative = computed(() => homepageHrefKind(props.href) === 'native')
const route = computed(() => parseAppLink(props.href))
const linkClass = computed(() => [interactiveTransition, linkFocus])
</script>

<template>
  <a
    v-if="isNative"
    :href="href"
    :target="opensInNewTab(href) ? '_blank' : undefined"
    :rel="externalLinkRel(href)"
    :class="linkClass"
  >
    <slot />
  </a>
  <NuxtLink
    v-else
    :to="route"
    :class="linkClass"
  >
    <slot />
  </NuxtLink>
</template>
