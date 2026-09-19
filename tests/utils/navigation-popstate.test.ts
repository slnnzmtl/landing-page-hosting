import { describe, expect, it } from 'vitest'
import {
  clearPopstateNavigation,
  isPopstateNavigation,
  markPopstatePending,
} from '~/utils/navigation-popstate'

describe('navigation popstate flag', () => {
  it('tracks browser back/forward until cleared', () => {
    clearPopstateNavigation()
    expect(isPopstateNavigation()).toBe(false)
    markPopstatePending()
    expect(isPopstateNavigation()).toBe(true)
    clearPopstateNavigation()
    expect(isPopstateNavigation()).toBe(false)
  })
})
