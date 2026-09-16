import { ref, onUnmounted } from 'vue'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import 'lenis/dist/lenis.css'

gsap.registerPlugin(ScrollTrigger)

let lenis = null
let tickerFn = null
let scrollHandler = null
let refCount = 0

const isStopped = ref(false)

const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const createLenis = () => {
  if (lenis || prefersReducedMotion || typeof window === 'undefined') return

  lenis = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.6,
  })

  scrollHandler = () => ScrollTrigger.update()
  lenis.on('scroll', scrollHandler)

  tickerFn = (time) => lenis.raf(time * 1000)
  gsap.ticker.add(tickerFn)
  gsap.ticker.lagSmoothing(0)
}

const destroyLenis = () => {
  if (!lenis) return

  if (tickerFn) gsap.ticker.remove(tickerFn)
  if (scrollHandler) lenis.off('scroll', scrollHandler)

  lenis.destroy()
  lenis = null
  tickerFn = null
  scrollHandler = null
}

export function useSmoothScroll() {
  const stop = () => {
    isStopped.value = true
    if (prefersReducedMotion) {
      document.documentElement.style.overflow = 'hidden'
    } else {
      lenis?.stop()
    }
  }

  const start = () => {
    isStopped.value = false
    if (prefersReducedMotion) {
      document.documentElement.style.overflow = ''
    } else {
      lenis?.start()
    }
  }

  const scrollTo = (target, options = {}) => {
    const el =
      typeof target === 'string' ? document.querySelector(target) : target

    if (!el) return

    if (prefersReducedMotion || !lenis) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }

    lenis.scrollTo(el, { offset: 0, duration: 1.1, ...options })
  }

  createLenis()
  refCount += 1

  onUnmounted(() => {
    refCount -= 1
    if (refCount <= 0) {
      refCount = 0
      destroyLenis()
    }
  })

  return { stop, start, scrollTo, isStopped, prefersReducedMotion }
}

export const getLenis = () => lenis
