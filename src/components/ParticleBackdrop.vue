<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  tone: 0 | 1
}

const canvasRef = ref<HTMLCanvasElement | null>(null)

let animationFrame = 0
let resizeFrame = 0
let particles: Particle[] = []
let width = 0
let height = 0
let reducedMotion = false
let pointerActive = false
let pointerX = 0
let pointerY = 0
let themeObserver: MutationObserver | null = null
let motionQuery: MediaQueryList | null = null

function colors() {
  const dark = document.documentElement.dataset.theme === 'dark'
  return dark
    ? { primary: '169, 156, 255', accent: '75, 216, 255', line: '143, 160, 255' }
    : { primary: '91, 69, 236', accent: '26, 166, 203', line: '91, 105, 210' }
}

function particleCount() {
  const areaCount = Math.round((width * height) / 23_000)
  return Math.max(18, Math.min(width < 680 ? 28 : 68, areaCount))
}

function makeParticle(): Particle {
  const angle = Math.random() * Math.PI * 2
  const speed = reducedMotion ? 0 : 0.08 + Math.random() * 0.2
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    radius: 1 + Math.random() * 1.25,
    tone: Math.random() > 0.68 ? 1 : 0,
  }
}

function drawFrame(update = true) {
  const canvas = canvasRef.value
  const context = canvas?.getContext('2d')
  if (!canvas || !context) return

  context.clearRect(0, 0, width, height)
  const palette = colors()
  const connectionDistance = width < 680 ? 92 : 124

  for (let index = 0; index < particles.length; index += 1) {
    const particle = particles[index]

    if (update && !reducedMotion) {
      if (pointerActive) {
        const dx = particle.x - pointerX
        const dy = particle.y - pointerY
        const distanceSquared = dx * dx + dy * dy
        if (distanceSquared > 1 && distanceSquared < 24_000) {
          const force = (1 - Math.sqrt(distanceSquared) / 155) * 0.006
          particle.vx += dx * force
          particle.vy += dy * force
        }
      }

      const velocity = Math.hypot(particle.vx, particle.vy)
      if (velocity > 0.48) {
        particle.vx = (particle.vx / velocity) * 0.48
        particle.vy = (particle.vy / velocity) * 0.48
      }
      particle.vx *= 0.998
      particle.vy *= 0.998
      particle.x += particle.vx
      particle.y += particle.vy

      if (particle.x < -8) particle.x = width + 8
      if (particle.x > width + 8) particle.x = -8
      if (particle.y < -8) particle.y = height + 8
      if (particle.y > height + 8) particle.y = -8
    }

    for (let otherIndex = index + 1; otherIndex < particles.length; otherIndex += 1) {
      const other = particles[otherIndex]
      const dx = particle.x - other.x
      const dy = particle.y - other.y
      const distance = Math.hypot(dx, dy)
      if (distance >= connectionDistance) continue

      const alpha = (1 - distance / connectionDistance) * (width < 680 ? 0.11 : 0.16)
      context.beginPath()
      context.moveTo(particle.x, particle.y)
      context.lineTo(other.x, other.y)
      context.strokeStyle = `rgba(${palette.line}, ${alpha})`
      context.lineWidth = 0.7
      context.stroke()
    }
  }

  for (const particle of particles) {
    const rgb = particle.tone === 0 ? palette.primary : palette.accent
    context.beginPath()
    context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
    context.fillStyle = `rgba(${rgb}, ${particle.tone === 0 ? 0.5 : 0.42})`
    context.fill()
  }
}

function animate() {
  drawFrame(true)
  animationFrame = window.requestAnimationFrame(animate)
}

function startAnimation() {
  window.cancelAnimationFrame(animationFrame)
  if (reducedMotion || document.hidden) {
    drawFrame(false)
    return
  }
  animationFrame = window.requestAnimationFrame(animate)
}

function resizeCanvas() {
  const canvas = canvasRef.value
  const context = canvas?.getContext('2d')
  if (!canvas || !context) return

  width = window.innerWidth
  height = window.innerHeight
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5)
  canvas.width = Math.round(width * pixelRatio)
  canvas.height = Math.round(height * pixelRatio)
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
  particles = Array.from({ length: particleCount() }, makeParticle)
  canvas.dataset.particleCount = String(particles.length)
  drawFrame(false)
}

function onResize() {
  window.cancelAnimationFrame(resizeFrame)
  resizeFrame = window.requestAnimationFrame(resizeCanvas)
}

function onPointerMove(event: PointerEvent) {
  if (reducedMotion || event.pointerType === 'touch') return
  pointerActive = true
  pointerX = event.clientX
  pointerY = event.clientY
}

function onPointerLeave() {
  pointerActive = false
}

function onVisibilityChange() {
  startAnimation()
}

function onMotionPreferenceChange(event: MediaQueryListEvent) {
  reducedMotion = event.matches
  resizeCanvas()
  startAnimation()
}

onMounted(() => {
  motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  reducedMotion = motionQuery.matches
  resizeCanvas()
  startAnimation()

  window.addEventListener('resize', onResize, { passive: true })
  window.addEventListener('pointermove', onPointerMove, { passive: true })
  document.documentElement.addEventListener('pointerleave', onPointerLeave)
  document.addEventListener('visibilitychange', onVisibilityChange)
  motionQuery.addEventListener('change', onMotionPreferenceChange)

  themeObserver = new MutationObserver(() => drawFrame(false))
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
})

onBeforeUnmount(() => {
  window.cancelAnimationFrame(animationFrame)
  window.cancelAnimationFrame(resizeFrame)
  window.removeEventListener('resize', onResize)
  window.removeEventListener('pointermove', onPointerMove)
  document.documentElement.removeEventListener('pointerleave', onPointerLeave)
  document.removeEventListener('visibilitychange', onVisibilityChange)
  motionQuery?.removeEventListener('change', onMotionPreferenceChange)
  themeObserver?.disconnect()
})
</script>

<template>
  <canvas ref="canvasRef" class="particle-backdrop" aria-hidden="true"></canvas>
</template>
