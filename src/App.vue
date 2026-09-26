<script setup>
import { useSmoothScroll } from './composables/useSmoothScroll'
import CoverSection from './components/CoverSection.vue'
import SaveTheDateSection from './components/SaveTheDateSection.vue'
import GallerySection from './components/GallerySection.vue'
import BridesGroomSection from './components/BridesGroomSection.vue'
import GalleryGridSection from './components/GalleryGridSection.vue'
import TandaKasihSection from './components/TandaKasihSection.vue'

// TODO: nama tamu otomatis dari query string, mis. ?to=Budi
const guestName = new URLSearchParams(window.location.search).get('to') || ''

const { scrollTo } = useSmoothScroll()

const open = () => scrollTo('#save-the-date')
</script>

<template>
  <CoverSection :guest-name="guestName" @open="open" />
  <SaveTheDateSection />
  <BridesGroomSection />
  <GallerySection />
  <GalleryGridSection />
  <TandaKasihSection />
</template>
