import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import AppBackLink from '~/components/AppBackLink.vue'

describe('AppBackLink', () => {
  it('renders a chevron link to the given parent route', () => {
    const wrapper = mount(AppBackLink, {
      props: { to: '/projects' },
      slots: { default: 'Back to products' },
      global: {
        stubs: {
          NuxtLink: {
            props: ['to'],
            template: '<a :href="typeof to === \'string\' ? to : (to.path || \'\') + (to.hash || \'\')"><slot /></a>',
          },
        },
      },
    })

    expect(wrapper.get('a').attributes('href')).toBe('/projects')
    expect(wrapper.text()).toContain('Back to products')
    expect(wrapper.find('svg').exists()).toBe(true)
  })

  it('passes path and hash separately so Vue Router does not remount on /#section', () => {
    const wrapper = mount(AppBackLink, {
      props: { to: '/#featured-work' },
      slots: { default: 'Back to featured work' },
      global: {
        stubs: {
          NuxtLink: {
            props: ['to'],
            template: '<a :href="typeof to === \'string\' ? to : (to.path || \'\') + (to.hash || \'\')"><slot /></a>',
          },
        },
      },
    })

    expect(wrapper.get('a').attributes('href')).toBe('/#featured-work')
  })
})
