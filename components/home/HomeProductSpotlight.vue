<script setup lang="ts">
import { computed } from 'vue'
import { homepageHrefKind, type ProductSpotlight } from '~/data/homepage'
import { useHomepageUi } from '~/composables/useHomepageUi'
import { trackHomepageHref } from '~/composables/useHomepageConversion'

const props = defineProps<{
  product: ProductSpotlight
}>()

const { linkFocus, outboundAttrs } = useHomepageUi()

const ctaHref = computed(() => props.product.cta.href)
const isRouteCta = computed(() => homepageHrefKind(ctaHref.value) === 'route')
const imageClass = computed(() => (
  props.product.image.width / props.product.image.height < 1.2
    ? 'object-contain p-8'
    : 'object-cover'
))

const ctaClass = [
  'inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90',
  linkFocus,
].join(' ')

function onProductCtaClick() {
  trackHomepageHref(ctaHref.value, { product: true, slug: props.product.slug })
}
</script>

<template>
  <article class="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
    <div class="aspect-[16/10] border-b border-border bg-muted/40 p-3 sm:p-4">
      <img
        :src="product.image.srcThumb || product.image.src"
        :srcset="product.image.srcset"
        :sizes="product.image.sizes"
        :alt="product.image.alt"
        :width="product.image.width"
        :height="product.image.height"
        :class="['h-full w-full rounded-xl border border-border shadow-sm', imageClass]"
        loading="lazy"
      />
    </div>

    <div class="flex flex-1 flex-col p-5 sm:p-6">
      <h3 class="min-h-[3.5rem] text-xl font-semibold leading-tight tracking-tight">
        {{ product.title }}
      </h3>
      <p class="mt-2 line-clamp-2 text-sm leading-relaxed text-foreground">
        {{ product.lead }}
      </p>
      <p class="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
        {{ product.supportingLine }}
      </p>

      <div class="mt-auto pt-5">
        <NuxtLink
          v-if="isRouteCta"
          :to="ctaHref"
          :class="ctaClass"
          @click="onProductCtaClick"
        >
          {{ product.cta.label }}
        </NuxtLink>
        <a
          v-else
          :href="ctaHref"
          v-bind="outboundAttrs(ctaHref)"
          :class="ctaClass"
          @click="onProductCtaClick"
        >
          {{ product.cta.label }}
        </a>
      </div>

      <p
        v-if="product.tags.length"
        class="mt-4 line-clamp-2 text-xs leading-relaxed text-muted-foreground"
      >
        {{ product.tags.join(' · ') }}
      </p>
    </div>
  </article>
</template>
