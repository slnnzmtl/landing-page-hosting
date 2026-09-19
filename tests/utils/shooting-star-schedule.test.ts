import { describe, expect, it } from 'vitest'
import {
  MAX_CONCURRENT_SHOOTING_STARS,
  shouldSpawnShootingStar,
} from '~/utils/shooting-star-schedule'

describe('shouldSpawnShootingStar', () => {
  const visible = {
    hidden: false,
    reducedMotion: false,
    unmounted: false,
    activeCount: 0,
  }

  it('spawns on a visible tab when under the cap', () => {
    expect(shouldSpawnShootingStar(visible)).toBe(true)
  })

  it('does not spawn while the tab is hidden', () => {
    expect(shouldSpawnShootingStar({ ...visible, hidden: true })).toBe(false)
  })

  it('caps concurrent falling stars so a timeout burst cannot pile up', () => {
    let activeCount = 0
    for (let i = 0; i < 20; i++) {
      if (shouldSpawnShootingStar({ ...visible, activeCount })) {
        activeCount += 1
      }
    }
    expect(activeCount).toBe(MAX_CONCURRENT_SHOOTING_STARS)
  })

  it('does not spawn when motion is reduced or the backdrop unmounted', () => {
    expect(shouldSpawnShootingStar({ ...visible, reducedMotion: true })).toBe(false)
    expect(shouldSpawnShootingStar({ ...visible, unmounted: true })).toBe(false)
  })
})
