import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ExtensionMediaShowcase from '~/domains/products/components/ExtensionMediaShowcase.vue'
import type { ProductMedia } from '~/domains/products/data/types'

function media(presentation: ProductMedia['presentation'], label: string): ProductMedia {
  return {
    src: `/${label}.png`,
    srcThumb: `/${label}-640w.webp`,
    srcset: `/${label}-640w.webp 640w, /${label}-960w.webp 960w`,
    alt: `${label} screenshot`,
    width: 1280,
    height: 800,
    caption: `${label} caption`,
    presentation,
  }
}

function mountShowcase(priority = false) {
  return mount(ExtensionMediaShowcase, {
    props: {
      before: media('comparison_before', 'before'),
      after: media('comparison_after', 'after'),
      heading: 'See the difference',
      priority,
    },
    attachTo: document.body,
    global: { stubs: { teleport: false } },
  })
}

describe('ExtensionMediaShowcase', () => {
  it('renders thumbs with layout srcset and eager-loads the LCP preview', () => {
    const wrapper = mountShowcase(true)
    const images = wrapper.findAll('img')
    expect(images).toHaveLength(2)
    expect(images[0]?.attributes('src')).toBe('/before-640w.webp')
    expect(images[0]?.attributes('srcset')).toContain('640w')
    expect(images[0]?.attributes('srcset')).not.toContain('.png')
    expect(images[0]?.attributes('sizes')).toBe('(max-width: 1024px) calc(100vw - 3rem), 32rem')
    expect(images[0]?.attributes('loading')).toBe('eager')
    expect(images[0]?.attributes('fetchpriority')).toBe('high')
    expect(images[1]?.attributes('src')).toBe('/after-640w.webp')
    expect(images[1]?.attributes('loading')).toBe('lazy')
    expect(images[1]?.attributes('fetchpriority')).toBeUndefined()
    wrapper.unmount()
  })

  it('lazy-loads both screenshots when they are not the LCP', () => {
    const wrapper = mountShowcase()
    const images = wrapper.findAll('img')
    expect(images[0]?.attributes('loading')).toBe('lazy')
    expect(images[0]?.attributes('fetchpriority')).toBeUndefined()
    expect(images[1]?.attributes('loading')).toBe('lazy')
    wrapper.unmount()
  })

  it('loads the original file only after the lightbox opens', async () => {
    const wrapper = mountShowcase()
    expect(wrapper.find('img[src="/before.png"]').exists()).toBe(false)

    await wrapper.find('button[aria-label="View full size: before caption"]').trigger('click')

    expect(document.body.querySelector('img[src="/before.png"]')).not.toBeNull()
    wrapper.unmount()
  })
})
