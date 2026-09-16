<script setup>
import { computed, watch, onUnmounted } from 'vue'
import { getLenis } from '../composables/useSmoothScroll'

const props = defineProps({
  photos: { type: Array, required: true },
  index: { type: Number, default: -1 },
})

const emit = defineEmits(['close', 'update:index'])

const isOpen = computed(() => props.index >= 0 && props.index < props.photos.length)

const current = computed(() => (isOpen.value ? props.photos[props.index] : ''))

const go = (step) => {
  const next = (props.index + step + props.photos.length) % props.photos.length
  emit('update:index', next)
}

const close = () => emit('close')

const onKey = (event) => {
  if (!isOpen.value) return
  if (event.key === 'Escape') close()
  if (event.key === 'ArrowRight') go(1)
  if (event.key === 'ArrowLeft') go(-1)
}

watch(isOpen, (value) => {
  if (typeof document === 'undefined') return

  const lenis = getLenis()

  if (value) {
    lenis?.stop()
    document.documentElement.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
  } else {
    lenis?.start()
    document.documentElement.style.overflow = ''
    window.removeEventListener('keydown', onKey)
  }
})

onUnmounted(() => {
  getLenis()?.start()
  document.documentElement.style.overflow = ''
  window.removeEventListener('keydown', onKey)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="lightbox">
      <div v-if="isOpen" class="lightbox" role="dialog" aria-modal="true" @click.self="close">
        <button type="button" class="lb-close" aria-label="Tutup" @click="close">×</button>
        <button type="button" class="lb-nav is-prev" aria-label="Sebelumnya" @click="go(-1)">
          ‹
        </button>

        <figure class="lb-figure">
          <img :src="current" :alt="`Foto galeri ${index + 1}`" />
          <figcaption>{{ index + 1 }} / {{ photos.length }}</figcaption>
        </figure>

        <button type="button" class="lb-nav is-next" aria-label="Berikutnya" @click="go(1)">
          ›
        </button>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.lightbox {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(12 16 10 / 88%);
  padding: clamp(1rem, 4vw, 3rem);
  backdrop-filter: blur(4px);
}

.lb-figure {
  display: flex;
  max-width: min(92vw, 900px);
  max-height: 88svh;
  flex-direction: column;
  align-items: center;
  gap: 0.85rem;
  margin: 0;
}

.lb-figure img {
  max-width: 100%;
  max-height: 80svh;
  border-radius: 10px;
  object-fit: contain;
  box-shadow: 0 24px 60px rgb(0 0 0 / 55%);
}

.lb-figure figcaption {
  color: #fff;
  font-family: 'Marcellus', serif;
  font-size: 0.85rem;
  letter-spacing: 0.1em;
  opacity: 0.85;
}

.lb-close,
.lb-nav {
  position: absolute;
  border: 0;
  background: rgb(255 255 255 / 12%);
  color: #fff;
  cursor: pointer;
  transition: background 250ms ease, transform 250ms ease;
}

.lb-close:hover,
.lb-nav:hover {
  background: rgb(255 255 255 / 26%);
}

.lb-close {
  top: clamp(0.75rem, 2vw, 1.5rem);
  right: clamp(0.75rem, 2vw, 1.5rem);
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 50%;
  font-size: 1.6rem;
  line-height: 1;
}

.lb-nav {
  top: 50%;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  font-size: 2rem;
  line-height: 1;
  transform: translateY(-50%);
}

.lb-nav.is-prev {
  left: clamp(0.5rem, 2vw, 1.5rem);
}

.lb-nav.is-next {
  right: clamp(0.5rem, 2vw, 1.5rem);
}

.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 300ms ease;
}

.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .lightbox-enter-active,
  .lightbox-leave-active {
    transition: none;
  }
}
</style>
