const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const observed = new WeakMap()

let observer = null

const getObserver = () => {
  if (observer) return observer

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      })
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.12 },
  )

  return observer
}

const parseOptions = (binding) => {
  const value = binding.value

  if (typeof value === 'number') return { delay: value }
  if (value && typeof value === 'object') return value
  return {}
}

export const reveal = {
  mounted(el, binding) {
    const { delay = 0, y = 28, scale = 1, duration = 800 } = parseOptions(binding)

    if (prefersReducedMotion()) {
      el.classList.add('reveal', 'is-visible')
      return
    }

    el.classList.add('reveal')
    el.style.setProperty('--reveal-delay', `${delay}ms`)
    el.style.setProperty('--reveal-y', `${y}px`)
    el.style.setProperty('--reveal-scale', String(scale))
    el.style.setProperty('--reveal-duration', `${duration}ms`)

    observed.set(el, true)
    getObserver().observe(el)
  },

  unmounted(el) {
    if (observed.has(el)) {
      observer?.unobserve(el)
      observed.delete(el)
    }
  },
}

export default reveal
