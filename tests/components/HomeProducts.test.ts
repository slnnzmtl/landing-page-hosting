import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import HomeProducts from '~/components/home/HomeProducts.vue'
import HomeProductSpotlight from '~/components/home/HomeProductSpotlight.vue'
import type { ProductSpotlight, ProductsSection } from '~/data/homepage'

const nuxtLinkStub = {
  props: ['to'],
  template: '<a :href="to"><slot /></a>',
}

const appCardStub = {
  props: ['href', 'ariaLabel'],
  template: '<article><slot /></article>',
}

function product(slug: string): ProductSpotlight {
  return {
    slug,
    title: `Product ${slug}`,
    lead: 'A compact product description.',
    supportingLine: 'Built for real users.',
    image: {
      src: `/${slug}.png`,
      alt: `${slug} screenshot`,
      width: 1280,
      height: 800,
    },
    cta: { label: 'View product', href: `/products/${slug}` },
    detail_template: 'Application description',
    tags: ['Vue', 'TypeScript'],
  }
}

function section(items: ProductSpotlight[]): ProductsSection {
  return {
    heading: 'Products',
    description: 'Software packaged and maintained for real users.',
    items,
    totalCount: items.length,
    allProductsCta: { label: 'View all products', href: '/products' },
  }
}

describe('HomeProducts', () => {
  it('renders a compact grid and all-products CTA', () => {
    const wrapper = mount(HomeProducts, {
      props: { products: section([product('one'), product('two'), product('three')]) },
      global: {
        stubs: {
          AppCard: appCardStub,
          NuxtLink: nuxtLinkStub,
        },
      },
    })

    expect(wrapper.findAll('article')).toHaveLength(3)
    expect(wrapper.find('ul').classes()).toEqual(
      expect.arrayContaining(['sm:grid-cols-2', 'lg:grid-cols-3']),
    )
    expect(wrapper.text()).toContain('Products')
  })

  it('fills the grid with an in-progress card when fewer than three products exist', () => {
    const wrapper = mount(HomeProducts, {
      props: { products: section([product('one'), product('two')]) },
      global: {
        stubs: {
          AppCard: appCardStub,
          NuxtLink: nuxtLinkStub,
        },
      },
    })

    expect(wrapper.findAll('article')).toHaveLength(3)
    const placeholderCard = wrapper.findAll('article').find(card => card.text().includes('In progress'))
    expect(wrapper.findAll('.product-placeholder')).toHaveLength(1)
    expect(placeholderCard?.classes()).toEqual(
      expect.arrayContaining(['hidden', 'sm:flex']),
    )
    expect(wrapper.text()).toContain('In progress')
  })
})

describe('HomeProductSpotlight', () => {
  it('keeps the product card compact and preserves the product route CTA', () => {
    const wrapper = mount(HomeProductSpotlight, {
      props: { product: product('one') },
      global: { stubs: { AppCard: appCardStub, NuxtLink: nuxtLinkStub } },
    })

    expect(wrapper.find('article').classes()).toContain('rounded-2xl')
    expect(wrapper.find('img').attributes('alt')).toBe('one screenshot')
  })
})
