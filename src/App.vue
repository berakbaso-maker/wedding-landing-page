<script setup>
import { wedding } from './data/wedding'
import CoverSection from './components/CoverSection.vue'
import SaveTheDateSection from './components/SaveTheDateSection.vue'
import GallerySection from './components/GallerySection.vue'
import BridesGroomSection from './components/BridesGroomSection.vue'
import GalleryGridSection from './components/GalleryGridSection.vue'
import TandaKasihSection from './components/TandaKasihSection.vue'

// TODO: nama tamu otomatis dari query string, mis. ?to=Budi
const guestName = new URLSearchParams(window.location.search).get('to') || ''

const open = () => {
  document.getElementById('save-the-date')?.scrollIntoView({
    behavior: 'smooth',
  })
}

</script>

<template>
  <CoverSection :guest-name="guestName" @open="open" />
  <SaveTheDateSection />
  <GallerySection />
  <BridesGroomSection />
  <GalleryGridSection />
  <TandaKasihSection />
</template>
