<script setup lang="ts">
import { starBackdropClass } from '~/utils/star-backdrop'
import {
  MAX_CONCURRENT_SHOOTING_STARS,
  shouldSpawnShootingStar,
} from '~/utils/shooting-star-schedule'

const STAR_COLORS = [
  '#FFFFFF',
  '#FFFFAA',
  '#AAAAFF',
  '#FFAAAA',
  '#AAFFAA',
  '#FFAAFF',
  '#AAFFFF',
] as const

const starDensity = 0.00003

const twinkleProbability = 0.7
const minTwinkleSpeed = 2
const maxTwinkleSpeed = 5
const pixelSize = 2
const starRegenerationInterval = 5000
const percentToRegenerate = 0.15
const shootingStarPixelSize = 2
const targetFps = 25
const frameInterval = 1000 / targetFps
const parallaxFactor = -0.35
const parallaxLerp = 0.14
const parallaxSettleEpsilon = 0.25

type BackgroundStar = {
  x: number
  y: number
  color: string
  baseOpacity: number
  currentOpacity: number
  twinkle: boolean
  twinkleSpeed: number
  twinkleDirection: number
  twinkleTimer: number
}

type TrailPoint = {
  x: number
  y: number
  opacity: number
}

type ShootingStar = {
  x: number
  y: number
  angle: number
  speed: number
  distance: number
  trail: TrailPoint[]
}

const rootRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)

const backgroundStars: BackgroundStar[] = []
const shootingStars: ShootingStar[] = []

let animationFrameId: number | null = null
let regenerationIntervalId: ReturnType<typeof setInterval> | null = null
let shootingStarTimeoutId: ReturnType<typeof setTimeout> | null = null
let resizeObserver: ResizeObserver | null = null
let ctx: CanvasRenderingContext2D | null = null
let lastTwinkleTime = 0
let unmounted = false
let reducedMotion = false
let canvasWidth = 0
let canvasHeight = 0
let scrollTarget = 0
let scrollSmoothed = 0

function wrap(value: number, max: number) {
  if (max <= 0) return 0
  return ((value % max) + max) % max
}

function getStarDrawY(starY: number) {
  return Math.round(wrap(starY + scrollSmoothed * parallaxFactor, canvasHeight))
}

function updateParallax() {
  scrollTarget = window.scrollY
  scrollSmoothed += (scrollTarget - scrollSmoothed) * parallaxLerp
}

function isParallaxMoving() {
  return Math.abs(scrollTarget - scrollSmoothed) > parallaxSettleEpsilon
}

function createNewShootingStar(): ShootingStar {
  return {
    x: Math.random() * canvasWidth,
    y: 0,
    angle: 45 + Math.random() * 90,
    speed: Math.random() * 5 + 8,
    distance: 0,
    trail: [],
  }
}

function createStar(): BackgroundStar {
  const shouldTwinkle = !reducedMotion && Math.random() < twinkleProbability
  const gridX = Math.floor(Math.random() * (canvasWidth / pixelSize)) * pixelSize
  const gridY = Math.floor(Math.random() * (canvasHeight / pixelSize)) * pixelSize
  const colorIndex = Math.floor(Math.random() * STAR_COLORS.length)
  const baseOpacity = Math.random() * 0.5 + 0.5

  return {
    x: gridX,
    y: gridY,
    color: STAR_COLORS[colorIndex] ?? '#FFFFFF',
    baseOpacity,
    currentOpacity: baseOpacity,
    twinkle: shouldTwinkle,
    twinkleSpeed: minTwinkleSpeed + Math.random() * (maxTwinkleSpeed - minTwinkleSpeed),
    twinkleDirection: -1,
    twinkleTimer: 0,
  }
}

function targetStarCount() {
  if (!canvasWidth || !canvasHeight) return 0
  return Math.floor(canvasWidth * canvasHeight * starDensity)
}

function initBackgroundStars() {
  backgroundStars.length = 0
  const numStars = targetStarCount()
  for (let i = 0; i < numStars; i++) {
    backgroundStars.push(createStar())
  }
}

function syncStarsToCanvasSize() {
  if (!canvasWidth || !canvasHeight) {
    backgroundStars.length = 0
    return
  }

  for (const star of backgroundStars) {
    star.x = Math.floor(wrap(star.x, canvasWidth) / pixelSize) * pixelSize
    star.y = Math.floor(wrap(star.y, canvasHeight) / pixelSize) * pixelSize
  }

  const numStars = targetStarCount()
  while (backgroundStars.length < numStars) {
    backgroundStars.push(createStar())
  }
  if (backgroundStars.length > numStars) {
    backgroundStars.length = numStars
  }
}

function regenerateBackgroundStars() {
  if (backgroundStars.length === 0 || !canvasWidth || !canvasHeight) return

  const numToRegenerate = Math.max(
    1,
    Math.floor(backgroundStars.length * percentToRegenerate),
  )

  for (let i = 0; i < numToRegenerate; i++) {
    const randomIndex = Math.floor(Math.random() * backgroundStars.length)
    backgroundStars[randomIndex] = createStar()
  }
}

function bindContext() {
  const canvas = canvasRef.value
  ctx = canvas ? canvas.getContext('2d') : null
}

function drawBackgroundStars() {
  if (!ctx) return

  ctx.clearRect(0, 0, canvasWidth, canvasHeight)
  for (const star of backgroundStars) {
    ctx.fillStyle = star.color
    ctx.globalAlpha = star.currentOpacity
    ctx.fillRect(star.x, getStarDrawY(star.y), pixelSize, pixelSize)
  }
  ctx.globalAlpha = 1
}

function twinkleBackgroundStars() {
  for (const star of backgroundStars) {
    if (!star.twinkle) continue

    star.twinkleTimer += 1 / targetFps
    if (star.twinkleTimer >= star.twinkleSpeed) {
      star.twinkleTimer = 0
      star.twinkleDirection *= -1
    }

    const progress = star.twinkleTimer / star.twinkleSpeed
    if (progress < 0.5) {
      star.currentOpacity
        = star.twinkleDirection < 0 ? star.baseOpacity : star.baseOpacity * 0.3
    }
    else {
      star.currentOpacity
        = star.twinkleDirection < 0 ? star.baseOpacity * 0.3 : star.baseOpacity
    }
  }
}

function animateCanvas(timestamp: number) {
  if (unmounted) return

  if (document.hidden) {
    animationFrameId = requestAnimationFrame(animateCanvas)
    return
  }

  updateParallax()

  const parallaxMoving = isParallaxMoving()
  const twinkleDue = timestamp - lastTwinkleTime >= frameInterval
  if (parallaxMoving || twinkleDue) {
    if (twinkleDue) {
      lastTwinkleTime = timestamp
      twinkleBackgroundStars()
      updateShootingStars()
    }
    drawBackgroundStars()
    drawShootingStars()
  }

  if (!unmounted) {
    animationFrameId = requestAnimationFrame(animateCanvas)
  }
}

function updateShootingStars() {
  if (shootingStars.length === 0) return

  for (let i = shootingStars.length - 1; i >= 0; i--) {
    const star = shootingStars[i]
    if (!star) continue

    const newX = star.x + star.speed * Math.cos((star.angle * Math.PI) / 180)
    const newY = star.y + star.speed * Math.sin((star.angle * Math.PI) / 180)
    const newDistance = star.distance + star.speed

    if (newDistance % 8 < star.speed) {
      star.trail.push({
        x: star.x,
        y: star.y,
        opacity: 1,
      })
    }

    star.x = newX
    star.y = newY
    star.distance = newDistance

    for (let t = star.trail.length - 1; t >= 0; t--) {
      const point = star.trail[t]
      if (!point) continue
      point.opacity -= 0.1
      if (point.opacity <= 0) {
        star.trail.splice(t, 1)
      }
    }

    if (
      star.x < -30
      || star.x > canvasWidth + 30
      || star.y < -30
      || star.y > canvasHeight + 30
    ) {
      shootingStars.splice(i, 1)
    }
  }
}

function drawShootingStars() {
  if (!ctx || shootingStars.length === 0) return

  for (const star of shootingStars) {
    for (const point of star.trail) {
      ctx.save()
      ctx.translate(point.x, point.y)
      ctx.rotate((star.angle * Math.PI) / 180)
      ctx.translate(-point.x, -point.y)
      ctx.fillStyle = `rgba(180, 242, 255, ${point.opacity})`
      ctx.fillRect(point.x, point.y, shootingStarPixelSize, shootingStarPixelSize)
      ctx.restore()
    }

    const starWidth = 4
    const starHeight = 2
    ctx.save()
    ctx.translate(star.x, star.y)
    ctx.rotate((star.angle * Math.PI) / 180)
    ctx.translate(-star.x, -star.y)
    ctx.fillStyle = '#ffffff'
    ctx.globalAlpha = 1
    for (let y = 0; y < starHeight; y++) {
      for (let x = 0; x < starWidth; x++) {
        if ((x === 0 && y === 1) || (x === 3 && y === 0)) continue
        ctx.fillRect(
          star.x + x * shootingStarPixelSize,
          star.y + y * shootingStarPixelSize,
          shootingStarPixelSize,
          shootingStarPixelSize,
        )
      }
    }
    ctx.restore()
  }

  ctx.globalAlpha = 1
}

function resizeCanvas() {
  const canvas = canvasRef.value
  const root = rootRef.value
  if (!canvas || !root) return

  const width = root.clientWidth
  const height = root.clientHeight
  if (!width || !height) return
  if (width === canvasWidth && height === canvasHeight) return

  const hadStars = backgroundStars.length > 0
  canvasWidth = width
  canvasHeight = height
  canvas.width = width
  canvas.height = height
  bindContext()

  if (hadStars) {
    syncStarsToCanvasSize()
  }
  else {
    initBackgroundStars()
  }

  if (reducedMotion) {
    drawBackgroundStars()
  }
}

function clearShootingStarTimeout() {
  if (shootingStarTimeoutId !== null) {
    clearTimeout(shootingStarTimeoutId)
    shootingStarTimeoutId = null
  }
}

function queueNextShootingStar(delay = Math.random() * 4000 + 2000) {
  clearShootingStarTimeout()
  if (unmounted || reducedMotion || document.hidden) return
  shootingStarTimeoutId = setTimeout(scheduleShootingStar, delay)
}

function scheduleShootingStar() {
  shootingStarTimeoutId = null
  if (shouldSpawnShootingStar({
    hidden: document.hidden,
    reducedMotion,
    unmounted,
    activeCount: shootingStars.length,
    max: MAX_CONCURRENT_SHOOTING_STARS,
  })) {
    shootingStars.push(createNewShootingStar())
  }

  queueNextShootingStar()
}

function pauseShootingStars() {
  clearShootingStarTimeout()
  shootingStars.length = 0
}

function onVisibilityChange() {
  if (document.hidden) {
    pauseShootingStars()
    return
  }

  lastTwinkleTime = performance.now()
  queueNextShootingStar()
}

function cleanup() {
  unmounted = true

  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }
  if (regenerationIntervalId !== null) {
    clearInterval(regenerationIntervalId)
    regenerationIntervalId = null
  }
  clearShootingStarTimeout()
  shootingStars.length = 0
  document.removeEventListener('visibilitychange', onVisibilityChange)
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
  ctx = null
}

const route = useRoute()
watch(
  () => route.path,
  () => {
    if (!import.meta.client) return
    scrollTarget = window.scrollY
    scrollSmoothed = window.scrollY
  },
)

function start() {
  unmounted = false
  reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  resizeCanvas()

  if (rootRef.value) {
    resizeObserver = new ResizeObserver(() => {
      resizeCanvas()
    })
    resizeObserver.observe(rootRef.value)
  }

  if (reducedMotion) {
    drawBackgroundStars()
    return
  }

  scrollTarget = window.scrollY
  scrollSmoothed = scrollTarget
  lastTwinkleTime = performance.now()
  document.addEventListener('visibilitychange', onVisibilityChange)
  animationFrameId = requestAnimationFrame(animateCanvas)
  scheduleShootingStar()
  regenerationIntervalId = setInterval(regenerateBackgroundStars, starRegenerationInterval)
}

onMounted(start)
onBeforeUnmount(cleanup)
</script>

<template>
  <div
    ref="rootRef"
    :class="starBackdropClass"
    aria-hidden="true"
  >
    <canvas
      ref="canvasRef"
      class="absolute inset-0 h-full w-full"
    />
  </div>
</template>
