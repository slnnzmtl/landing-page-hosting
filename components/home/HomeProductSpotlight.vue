<script setup lang="ts">
import { homepageHrefKind, inAppLocation, type ProductSpotlight } from '~/data/homepage'
import { useHomepageUi } from '~/composables/useHomepageUi'
import { trackHomepageHref } from '~/composables/useHomepageConversion'

const props = defineProps<{
  product: ProductSpotlight
}>()

const { linkFocus, outboundAttrs } = useHomepageUi()

const ctaHref = computed(() => props.product.cta.href)
const isRouteCta = computed(() => homepageHrefKind(ctaHref.value) === 'route')

const ctaClass = [
  'inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90',
  linkFocus,
].join(' ')

function onProductCtaClick() {
  trackHomepageHref(ctaHref.value, { product: true, slug: props.product.slug })
}
</script>

<template>
  <article class="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
    <div class="grid gap-0 lg:grid-cols-2">
      <div class="border-b border-border bg-muted/40 p-4 sm:p-6 lg:border-b-0 lg:border-r">
        <img
          :src="product.image.srcThumb || product.image.src"
          :srcset="product.image.srcset"
          :sizes="product.image.sizes"
          :alt="product.image.alt"
          :width="product.image.width"
          :height="product.image.height"
          class="h-auto w-full rounded-2xl border border-border object-cover shadow-sm"
          loading="lazy"
        />
      </div>

      <div class="flex flex-col justify-center p-6 sm:p-8">
        <h3 class="text-2xl font-semibold tracking-tight">
          {{ product.title }}
        </h3>
        <p class="mt-3 text-base leading-relaxed text-foreground">
          {{ product.lead }}
        </p>
        <p class="mt-2 text-sm leading-relaxed text-muted-foreground">
          {{ product.supportingLine }}
        </p>

        <div class="mt-6">
          <NuxtLink
            v-if="isRouteCta"
            :to="inAppLocation(ctaHref)"
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
          class="mt-5 text-xs text-muted-foreground"
        >
          {{ product.tags.join(' · ') }}
        </p>
      </div>
    </div>
  </article>
</template>
