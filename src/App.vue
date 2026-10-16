<script setup>
import { ref } from 'vue'
import { useSmoothScroll } from './composables/useSmoothScroll'
import MusicPlayer from './components/MusicPlayer.vue'
import CoverSection from './components/CoverSection.vue'
import SaveTheDateSection from './components/SaveTheDateSection.vue'
import GallerySection from './components/GallerySection.vue'
import BridesGroomSection from './components/BridesGroomSection.vue'
import GalleryGridSection from './components/GalleryGridSection.vue'
import DetailAcaraSection from './components/DetailAcaraSection.vue'
import TandaKasihSection from './components/TandaKasihSection.vue'

const musicPlayerRef = ref(null)

// Nama tamu otomatis dari query string, mis. ?to=Budi
const guestName = (typeof window !== 'undefined'
  ? new URLSearchParams(window.location.search).get('to') || ''
  : ''
).trim()

const { scrollTo } = useSmoothScroll()

const open = () => {
  musicPlayerRef.value?.play()
  scrollTo('#brides-groom')
}
</script>

<template>
  <MusicPlayer ref="musicPlayerRef" />
  <CoverSection :guest-name="guestName" @open="open" />
  <BridesGroomSection />
  <SaveTheDateSection />
  <GallerySection />
  <GalleryGridSection />
  <DetailAcaraSection />
  <TandaKasihSection />
</template>
