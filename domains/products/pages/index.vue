<script setup lang="ts">
import AppPageHeader from '~/components/AppPageHeader.vue'
import AppCard from '~/components/AppCard.vue'
import Button from '~/components/ui/button.vue'
import { resolveSiteUrl } from '~/utils/seo'
import { productPath } from '../data/types'
import { productsIndexSeo } from '../utils/product-seo'

const portfolio = await requirePortfolio()
const products = portfolio.products
const home = portfolio.homepage
const pageCopy = home.pageCopy
const personName = home.person.name
const siteUrl = resolveSiteUrl(useRuntimeConfig().public.siteUrl as string)
usePageSeo(
  productsIndexSeo(siteUrl, products, {
    siteName: home.siteName,
    title: pageCopy.products_index.title,
    description: pageCopy.products_index.seo_description,
  }),
  home.siteName,
)
</script>

<template>
  <div class="relative min-h-screen w-full min-w-0 text-foreground">
    <div class="relative z-10 mx-auto flex w-full  flex-col gap-12 px-6 py-12 pb-28 sm:px-6 sm:py-20 lg:px-12 xl:pb-20">
      <AppPageHeader
        :kicker="personName"
        :title="pageCopy.products_index.title"
        :description="pageCopy.products_index.description"
        :back="{ to: pageCopy.products_index.back_href, label: pageCopy.products_index.back_label }"
      />

      <ul class="grid gap-5 sm:grid-cols-2">
        <li
          v-for="product in products"
          :key="product.slug"
        >
          <AppCard
            :href="productPath(product.slug)"
            :aria-label="`${product.name}: ${pageCopy.products_index.item_cta}`"
          >
            <div class="flex h-full gap-4 p-6">
              <div
                v-if="product.logo"
                class="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[hsl(64,0%,1.43%)]"
              >
                <img
                  :src="product.logo.src"
                  :alt="product.logo.alt"
                  :width="product.logo.width"
                  :height="product.logo.height"
                  class="h-12 w-12"
                  decoding="async"
                />
              </div>
              <div class="flex flex-col items-start">
                <h2 class="text-xl font-semibold text-primary">
                  {{ product.name }}
                </h2>
                <p class="mt-2 flex-1 text-sm text-muted-foreground">
                  {{ product.shortDescription }}
                </p>
                <Button
                  as="span"
                  variant="arrow"
                  aria-hidden="true"
                  class="mt-5"
                >
                  {{ pageCopy.products_index.item_cta }}
                </Button>
              </div>
            </div>
          </AppCard>
        </li>
      </ul>
    </div>
  </div>
</template>
