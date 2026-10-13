<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useSmoothScroll } from './composables/useSmoothScroll'
import CoverSection from './components/CoverSection.vue'
import SaveTheDateSection from './components/SaveTheDateSection.vue'
import GallerySection from './components/GallerySection.vue'
import BridesGroomSection from './components/BridesGroomSection.vue'
import GalleryGridSection from './components/GalleryGridSection.vue'
import DetailAcaraSection from './components/DetailAcaraSection.vue'
import TandaKasihSection from './components/TandaKasihSection.vue'

// TODO: nama tamu otomatis dari query string, mis. ?to=Budi
const guestName = new URLSearchParams(window.location.search).get('to') || ''

const { scrollTo } = useSmoothScroll()

const backgroundAudio = ref(null)
let musicStarted = false

const startBackgroundMusic = () => {
  const audio = backgroundAudio.value
  if (!audio || musicStarted) return

  audio.play()
    .then(() => {
      musicStarted = true
    })
    .catch(() => {
      // Browsers may still block autoplay despite the saved preference.
    })
}

onMounted(() => {
  startBackgroundMusic()

  window.addEventListener('pointerdown', startBackgroundMusic, { once: true })
  window.addEventListener('keydown', startBackgroundMusic, { once: true })
  window.addEventListener('touchstart', startBackgroundMusic, { once: true })
})

onUnmounted(() => {
  window.removeEventListener('pointerdown', startBackgroundMusic)
  window.removeEventListener('keydown', startBackgroundMusic)
  window.removeEventListener('touchstart', startBackgroundMusic)
})

const open = () => scrollTo('#save-the-date')
</script>

<template>
  <audio ref="backgroundAudio" autoplay loop preload="auto" aria-hidden="true">
    <source src="/assets/music/daylight_fix.mp3" type="audio/mpeg" />
  </audio>
  <CoverSection :guest-name="guestName" @open="open" />
  <SaveTheDateSection />
  <BridesGroomSection />
  <GallerySection />
  <GalleryGridSection />
  <DetailAcaraSection />
  <TandaKasihSection />
</template>
