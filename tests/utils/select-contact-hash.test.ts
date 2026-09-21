import { describe, expect, it } from 'vitest'
import { selectContactHash } from '~/utils/select-contact-hash'

const contact = {
  top: 2709,
  bottom: 2931,
}

describe('selectContactHash', () => {
  it('keeps the work route until contact is actually in view', () => {
    expect(selectContactHash({
      ...contact,
      scrollY: 0,
      viewportHeight: 994,
      documentHeight: 3010,
      contactActive: false,
    })).toBe('')

    expect(selectContactHash({
      ...contact,
      scrollY: 900,
      viewportHeight: 994,
      documentHeight: 3010,
      contactActive: false,
    })).toBe('')
  })

  it('activates contact when the section is visible in the viewport', () => {
    expect(selectContactHash({
      ...contact,
      scrollY: 2016,
      viewportHeight: 994,
      documentHeight: 3010,
      contactActive: false,
    })).toBe('#contact')
  })

  it('does not drop contact for a 1px change at the document end', () => {
    expect(selectContactHash({
      ...contact,
      scrollY: 2015,
      viewportHeight: 994,
      documentHeight: 3010,
      contactActive: true,
    })).toBe('#contact')

    expect(selectContactHash({
      ...contact,
      scrollY: 2017,
      viewportHeight: 993,
      documentHeight: 3010,
      contactActive: true,
    })).toBe('#contact')
  })
})
