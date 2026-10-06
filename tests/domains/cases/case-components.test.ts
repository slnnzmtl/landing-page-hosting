import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import CaseClaims from '~/domains/cases/components/CaseClaims.vue'
import CaseMedia from '~/domains/cases/components/CaseMedia.vue'
import NarrativeSection from '~/domains/cases/components/sections/NarrativeSection.vue'
import CaseGallery from '~/domains/cases/components/sections/CaseGallery.vue'
import DecisionComparison from '~/domains/cases/components/sections/DecisionComparison.vue'
import type { CaseImage, CaseSection } from '~/domains/cases/data/types'

const nuxtLinkStub = {
  props: ['to'],
  template: '<a :href="to"><slot /></a>',
}

const image: CaseImage = {
  src: '/images/case.png',
  srcThumb: '/images/case-600w.webp',
  alt: 'Case screenshot',
  width: 1200,
  height: 800,
  presentation: 'screenshot',
  caption: 'Readable step caption',
}

function section(overrides: Partial<CaseSection> = {}): CaseSection {
  return {
    id: 'section',
    anchor: 'section',
    kind: 'narrative',
    heading: 'Section heading',
    bodyParagraphs: ['A paragraph.'],
    layout: 'text',
    items: [{ title: 'Item', summary: 'Item summary.' }],
    media: [],
    ...overrides,
  }
}

describe('case composition', () => {
  it('renders claims, resource tags, and repository links separately', () => {
    const wrapper = mount(CaseClaims, {
      props: {
        heading: 'Selected outcomes',
        claims: [
          { id: 'claim-1', publicWording: 'First verified claim.' },
          { id: 'claim-2', publicWording: 'Second verified claim.' },
        ],
        stackTags: ['Vue', 'Directus'],
        links: [
          { label: 'Inspect repository', href: 'https://github.com/example/case' },
          { label: 'Role details', href: 'https://example.com/role' },
        ],
      },
      global: { stubs: { NuxtLink: nuxtLinkStub } },
    })

    expect(wrapper.findAll('p')).toHaveLength(3)
    expect(wrapper.findAll('li')).toHaveLength(4)
    expect(wrapper.text()).toContain('First verified claim.')
    expect(wrapper.text()).toContain('Second verified claim.')
    expect(wrapper.text()).toContain('Inspect repository')
    expect(wrapper.text()).toContain('Role details')
    expect(wrapper.find('[aria-label="Case repository links"]').exists()).toBe(true)
    expect(wrapper.find('[aria-label="Case repository links"] a').classes()).toContain('px-6')
  })

  it('does not render an empty claims/resources section', () => {
    const wrapper = mount(CaseClaims, {
      props: { heading: 'Selected outcomes', claims: [], links: [], stackTags: [] },
    })
    expect(wrapper.find('section').exists()).toBe(false)
  })
})

describe('case media and layouts', () => {
  it('keeps hero sizing independent from presentation and exposes generated sources', () => {
    const wrapper = mount(CaseMedia, {
      props: { image: { ...image, presentation: undefined }, size: 'hero' },
    })
    const img = wrapper.find('img')
    expect(wrapper.find('button').classes()).toContain('rounded-2xl')
    expect(wrapper.find('button').classes()).toContain('bg-card')
    expect(img.attributes('src')).toBe('/images/case-600w.webp')
    expect(img.attributes('srcset')).toBeUndefined()
    expect(img.classes()).not.toContain('object-cover')

    const screenshot = mount(CaseMedia, {
      props: { image, size: 'screenshot' },
    })
    expect(screenshot.find('button').classes()).toContain('bg-transparent')
  })

  it('renders narrative text and split layouts differently', () => {
    const text = mount(NarrativeSection, { props: { section: section() } })
    const split = mount(NarrativeSection, {
      props: { section: section({ layout: 'split' }) },
    })
    expect(text.find('.max-w-\\[70ch\\]').exists()).toBe(true)
    expect(split.find('.lg\\:grid-cols-2').exists()).toBe(true)
  })

  it('renders gallery media equally in split mode without cropping', () => {
    const wrapper = mount(CaseGallery, {
      props: {
        section: section({ kind: 'gallery', layout: 'split', media: [image, image] }),
        media: [image, { ...image, src: '/images/case-2.png' }],
      },
    })
    expect(wrapper.find('.sm\\:grid-cols-2').exists()).toBe(true)
    expect(wrapper.findAll('img')).toHaveLength(2)
    expect(wrapper.findAll('.object-cover')).toHaveLength(0)
  })

  it('renders decisions/text as a vertical list instead of a comparison', () => {
    const wrapper = mount(DecisionComparison, {
      props: {
        section: section({
          kind: 'decisions',
          layout: 'text',
          items: [
            { title: 'Decision one', summary: 'Summary one.' },
            { title: 'Decision two', summary: 'Summary two.' },
          ],
        }),
      },
    })
    expect(wrapper.find('ol').exists()).toBe(true)
    expect(wrapper.find('ol').findAll('li')).toHaveLength(2)
    expect(wrapper.find('ol').classes()).toContain('max-w-[70ch]')
  })
})
