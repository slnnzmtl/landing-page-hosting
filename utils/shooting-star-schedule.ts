export const MAX_CONCURRENT_SHOOTING_STARS = 2

export function shouldSpawnShootingStar(options: {
  hidden: boolean
  reducedMotion: boolean
  unmounted: boolean
  activeCount: number
}): boolean {
  if (options.unmounted || options.reducedMotion || options.hidden) return false
  return options.activeCount < MAX_CONCURRENT_SHOOTING_STARS
}
