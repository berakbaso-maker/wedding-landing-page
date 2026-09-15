<script setup>
import { onBeforeUnmount, onMounted } from 'vue'
import { wedding } from './data/wedding'
import CoverSection from './components/CoverSection.vue'
import SaveTheDateSection from './components/SaveTheDateSection.vue'
import BridesGroomSection from './components/BridesGroomSection.vue'
import GallerySection from './components/GallerySection.vue'
import TandaKasihSection from './components/TandaKasihSection.vue'

// TODO: nama tamu otomatis dari query string, mis. ?to=Budi
const guestName = new URLSearchParams(window.location.search).get('to') || ''

const open = () => {
  document.getElementById('save-the-date')?.scrollIntoView({
    behavior: 'smooth',
  })
}

let sectionObserver

onMounted(() => {
  const sections = document.querySelectorAll('#app > section')

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    sections.forEach((section) => section.classList.add('is-visible'))
    return
  }

  sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
        } else {
          entry.target.classList.remove('is-visible')
        }
      })
    },
    { threshold: 0.12 },
  )

  sections.forEach((section) => {
    section.classList.add('reveal-section')
    sectionObserver.observe(section)
  })
})

onBeforeUnmount(() => {
  sectionObserver?.disconnect()
})
</script>

<template>
  <CoverSection :guest-name="guestName" @open="open" />
  <SaveTheDateSection />
  <BridesGroomSection />
  <GallerySection />
  <TandaKasihSection />
</template>
