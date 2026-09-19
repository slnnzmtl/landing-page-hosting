export const MAX_CONCURRENT_SHOOTING_STARS = 2

export function shouldSpawnShootingStar(options: {
  hidden: boolean
  reducedMotion: boolean
  unmounted: boolean
  activeCount: number
  max?: number
}): boolean {
  if (options.unmounted || options.reducedMotion || options.hidden) return false
  const max = options.max ?? MAX_CONCURRENT_SHOOTING_STARS
  return options.activeCount < max
}
