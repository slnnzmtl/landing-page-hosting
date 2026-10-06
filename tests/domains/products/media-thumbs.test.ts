import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import MediaGallery from '~/components/media/MediaGallery.vue'
import ProductHowItWorks from '~/domains/products/components/ProductHowItWorks.vue'
import type { MediaImage } from '~/components/media/types'

function image(label: string): MediaImage {
  return {
    src: `/${label}.png`,
    srcThumb: `/${label}-640w.webp`,
    srcset: `/${label}-640w.webp 640w, /${label}-960w.webp 960w`,
    alt: `${label} screenshot`,
    width: 1280,
    height: 800,
    caption: `${label} caption`,
  }
}

describe('MediaGallery', () => {
  it('renders thumbs with layout srcset and opens the original in the lightbox', async () => {
    const wrapper = mount(MediaGallery, {
      props: { images: [image('shot')] },
      attachTo: document.body,
      global: { stubs: { teleport: false } },
    })

    const preview = wrapper.find('ul img')
    expect(preview.attributes('src')).toBe('/shot-640w.webp')
    expect(preview.attributes('srcset')).toContain('960w')
    expect(preview.attributes('srcset')).not.toContain('.png')
    expect(preview.attributes('sizes')).toBe(
      '(max-width: 640px) calc(100vw - 3rem), (max-width: 1024px) 50vw, 33vw',
    )
    expect(wrapper.find('img[src="/shot.png"]').exists()).toBe(false)

    await wrapper.find('button').trigger('click')
    expect(document.body.querySelector('img[src="/shot.png"]')).not.toBeNull()
    wrapper.unmount()
  })

  it('uses two-column sizes when requested', () => {
    const wrapper = mount(MediaGallery, {
      props: { images: [image('shot')], columns: 'two' },
    })
    expect(wrapper.find('ul img').attributes('sizes')).toBe(
      '(max-width: 640px) calc(100vw - 3rem), 50vw',
    )
  })
})

describe('ProductHowItWorks', () => {
  it('renders the walkthrough thumb with full-column sizes', () => {
    const wrapper = mount(ProductHowItWorks, {
      props: {
        guide: {
          title: 'How to use',
          steps: [{
            title: 'Convert',
            body: 'Pick a file.',
            image: image('guide'),
          }],
        },
      },
    })

    const preview = wrapper.find('img')
    expect(preview.attributes('src')).toBe('/guide-640w.webp')
    expect(preview.attributes('srcset')).toContain('960w')
    expect(preview.attributes('sizes')).toBe('(max-width: 1152px) calc(100vw - 3rem), 1056px')
  })
})
