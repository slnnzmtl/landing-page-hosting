import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import MediaGallery from '~/components/media/MediaGallery.vue'
import ProductHowItWorks from '~/domains/products/components/ProductHowItWorks.vue'
import type { MediaImage } from '~/components/media/types'

function image(label: string): MediaImage {
  return {
    src: `/${label}.png`,
    srcThumb: `/${label}-640w.webp`,
    alt: `${label} screenshot`,
    width: 1280,
    height: 800,
    caption: `${label} caption`,
  }
}

describe('MediaGallery', () => {
  it('renders thumbs without srcset and opens the original in the lightbox', async () => {
    const wrapper = mount(MediaGallery, {
      props: { images: [image('shot')] },
      attachTo: document.body,
      global: { stubs: { teleport: false } },
    })

    const preview = wrapper.find('ul img')
    expect(preview.attributes('src')).toBe('/shot-640w.webp')
    expect(preview.attributes('srcset')).toBeUndefined()
    expect(wrapper.find('img[src="/shot.png"]').exists()).toBe(false)

    await wrapper.find('button').trigger('click')
    expect(document.body.querySelector('img[src="/shot.png"]')).not.toBeNull()
    wrapper.unmount()
  })
})

describe('ProductHowItWorks', () => {
  it('renders the walkthrough thumb without srcset', () => {
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
    expect(preview.attributes('srcset')).toBeUndefined()
  })
})
