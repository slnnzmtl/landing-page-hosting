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
            template: '<a :href="to"><slot /></a>',
          },
        },
      },
    })

    expect(wrapper.get('a').attributes('href')).toBe('/projects')
    expect(wrapper.text()).toContain('Back to products')
    expect(wrapper.find('svg').exists()).toBe(true)
  })
})
