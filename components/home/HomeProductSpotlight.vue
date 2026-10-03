<script setup lang="ts">
import { computed } from 'vue'
import type { ProductSpotlight } from '~/data/homepage'
import { trackHomepageHref } from '~/composables/useHomepageConversion'
import AppCard from '~/components/AppCard.vue'
import Button from '~/components/ui/button.vue'

const props = defineProps<{
  product: ProductSpotlight
}>()

const ctaHref = computed(() => props.product.cta.href)
const imageClass = computed(() => (
  props.product.image.width / props.product.image.height < 1.2
    ? 'object-contain p-8'
    : 'object-cover'
))

function onProductCtaClick() {
  trackHomepageHref(ctaHref.value, { product: true, slug: props.product.slug })
}
</script>

<template>
  <AppCard
    :href="ctaHref"
    :aria-label="`${product.title}: ${product.cta.label}`"
    @click="onProductCtaClick"
  >
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
      <h3 class="text-xl font-semibold leading-tight tracking-tight">
        {{ product.title }}
      </h3>
      <p class="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
        {{ product.supportingLine }}
      </p>

      <div class="mt-auto pt-5">
        <Button
          as="span"
          variant="arrow"
          aria-hidden="true"
        >
          {{ product.cta.label }}
        </Button>
      </div>
    </div>
  </AppCard>
</template>
