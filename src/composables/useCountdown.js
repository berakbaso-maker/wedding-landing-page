import { ref, computed, onMounted, onUnmounted } from 'vue'

export function useCountdown(targetDate) {
  const now = ref(Date.now())
  let timer = null

  const target = computed(() => new Date(targetDate).getTime())

  const diff = computed(() => Math.max(target.value - now.value, 0))

  const days = computed(() => Math.floor(diff.value / (1000 * 60 * 60 * 24)))
  const hours = computed(() =>
    Math.floor((diff.value / (1000 * 60 * 60)) % 24)
  )
  const minutes = computed(() => Math.floor((diff.value / (1000 * 60)) % 60))
  const seconds = computed(() => Math.floor((diff.value / 1000) % 60))
  const isPast = computed(() => target.value - now.value <= 0)

  const pad = (n) => String(n).padStart(2, '0')

  onMounted(() => {
    timer = setInterval(() => {
      now.value = Date.now()
    }, 1000)
  })

  onUnmounted(() => {
    if (timer) clearInterval(timer)
  })

  return { days, hours, minutes, seconds, isPast, pad }
}
