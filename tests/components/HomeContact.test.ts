import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import HomeContact from '~/components/home/HomeContact.vue'
import type { HomepageContent } from '~/data/homepage'

const contact: HomepageContent['contact'] = {
  heading: 'Default heading',
  summary: 'Default summary',
  links: [
    { label: 'Email', href: 'mailto:hello@example.test', title: 'hello@example.test' },
    { label: 'Telegram', href: 'https://t.me/example', title: 't.me/example' },
  ],
}

describe('HomeContact template', () => {
  it('supports semantic footer rendering and replaceable compact copy', () => {
    const wrapper = mount(HomeContact, {
      props: {
        contact,
        compact: true,
        as: 'footer',
        heading: 'Case-specific heading',
        summary: 'Case-specific summary',
        primaryLabel: 'Start a conversation',
      },
    })

    expect(wrapper.element.tagName).toBe('FOOTER')
    expect(wrapper.text()).toContain('Case-specific heading')
    expect(wrapper.text()).toContain('Case-specific summary')
    expect(wrapper.text()).toContain('Start a conversation')
  })
})
