import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import AppPageHeader from '~/components/AppPageHeader.vue'

const nuxtLinkStub = {
  props: ['to'],
  template: '<a :href="typeof to === \'string\' ? to : (to.path || \'\') + (to.hash || \'\')"><slot /></a>',
}

describe('AppPageHeader', () => {
  it('renders kicker, title, and muted subheader', () => {
    const wrapper = mount(AppPageHeader, {
      props: {
        kicker: 'Daniel Kazansky',
        title: 'Products',
        description: 'Public products and tools.',
      },
      global: { stubs: { NuxtLink: nuxtLinkStub } },
    })

    expect(wrapper.element.tagName).toBe('HEADER')
    expect(wrapper.get('p').text()).toBe('Daniel Kazansky')
    expect(wrapper.get('h1').text()).toBe('Products')
    expect(wrapper.text()).toContain('Public products and tools.')
    expect(wrapper.find('a').exists()).toBe(false)
  })

  it('renders the shared back link when a parent route is given', () => {
    const wrapper = mount(AppPageHeader, {
      props: {
        kicker: 'Daniel Kazansky',
        title: 'Professional experience',
        description: 'Evidence-based timeline.',
        back: { to: '/#featured-work', label: 'Back to featured work' },
      },
      global: { stubs: { NuxtLink: nuxtLinkStub } },
    })

    expect(wrapper.get('a').attributes('href')).toBe('/#featured-work')
    expect(wrapper.text()).toContain('Back to featured work')
  })

  it('places media beside the title and keeps a custom subheader', () => {
    const wrapper = mount(AppPageHeader, {
      props: {
        kicker: 'Product',
        title: 'Simple Rekordbox Converter',
        back: { to: '/projects', label: 'Back to products' },
      },
      slots: {
        media: '<img alt="logo" src="/logo.png">',
        description: '<p class="lead">Convert playlists without changing originals.</p>',
      },
      global: { stubs: { NuxtLink: nuxtLinkStub } },
    })

    expect(wrapper.get('img').attributes('alt')).toBe('logo')
    expect(wrapper.get('h1').text()).toBe('Simple Rekordbox Converter')
    expect(wrapper.get('.lead').text()).toContain('Convert playlists')
    expect(wrapper.html()).toContain('grid')
    expect(wrapper.classes()).toContain('w-full')
  })
})
