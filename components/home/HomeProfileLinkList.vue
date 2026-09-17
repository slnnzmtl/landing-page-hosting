<script setup lang="ts">
import type { HomepageLink } from '~/data/homepage'
import { useHomepageUi } from '~/composables/useHomepageUi'

const props = withDefaults(
  defineProps<{
    links: HomepageLink[]
    listClass?: string
    keyPrefix?: string
  }>(),
  {
    listClass: 'flex flex-wrap gap-x-6 gap-y-2 text-sm',
    keyPrefix: '',
  },
)

const { linkFocus, outboundAttrs, profileLinkAria } = useHomepageUi()

function itemKey(label: string) {
  return props.keyPrefix ? `${props.keyPrefix}${label}` : label
}
</script>

<template>
  <ul :class="listClass">
    <li
      v-for="link in links"
      :key="itemKey(link.label)"
    >
      <a
        :href="link.href"
        v-bind="outboundAttrs(link.href)"
        :aria-label="profileLinkAria(link.label)"
        :class="['font-medium text-primary underline-offset-4 hover:underline', linkFocus]"
      >
        {{ link.label }}
      </a>
    </li>
  </ul>
</template>
