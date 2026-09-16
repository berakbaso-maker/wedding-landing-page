<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { wedding } from '../data/wedding'
import GalleryLightbox from './GalleryLightbox.vue'

gsap.registerPlugin(ScrollTrigger)

const allPhotos = wedding.gallery

const pageDefs = [
  { photos: allPhotos.slice(0, 6), featured: allPhotos[6], from: 1, to: 7 },
  { photos: allPhotos.slice(7, 11), featured: allPhotos[11], from: 8, to: 12 },
]

const pagePhotos = pageDefs.map((page) => [...page.photos, page.featured])
const lightboxIndex = ref(-1)
const lightboxPhotos = ref(pagePhotos[0])

const openLightbox = (photos, index) => {
  lightboxPhotos.value = photos
  lightboxIndex.value = index
}

const pad = (n) => String(n).padStart(2, '0')

let ctx = null

onMounted(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce) return

  ctx = gsap.context(() => {
    gsap.utils.toArray('.album-sheet').forEach((sheet) => {
      gsap.fromTo(
        sheet,
        { rotateY: -14, opacity: 0.25, transformOrigin: 'left center' },
        {
          rotateY: 0,
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: sheet,
            start: 'top 92%',
            end: 'top 45%',
            scrub: 0.6,
          },
        },
      )
    })

    ScrollTrigger.batch('.gallery-grid-page .polaroid-grid, .gallery-grid-page .large-card', {
      start: 'top 92%',
      once: true,
      onEnter: (batch) =>
        gsap.fromTo(
          batch,
          { opacity: 0, y: 34, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, duration: 0.85, stagger: 0.1, ease: 'power3.out' },
        ),
    })
  })
})

onUnmounted(() => ctx?.revert())
</script>

<template>
  <section
    v-for="(page, pageIndex) in pageDefs"
    :id="pageIndex === 0 ? 'gallery-grid' : undefined"
    :key="`gallery-page-${pageIndex}`"
    class="gallery-page gallery-grid-page"
  >
    <div class="gallery-container grid-container">
      <span class="album-tape tape-top" aria-hidden="true"></span>
      <span class="album-tape tape-bottom" aria-hidden="true"></span>

      <div class="album-sheet">
        <span class="photo-counter" aria-hidden="true">
          {{ pad(page.from) }} – {{ pad(page.to) }} / {{ allPhotos.length }}
        </span>

        <div class="bottom-section" :class="`gallery-grid-${pageIndex + 1}`">
          <button
            v-for="(photo, index) in page.photos"
            :key="`${pageIndex}-${index}`"
            type="button"
            class="polaroid-grid"
            :aria-label="`Perbesar foto ${pageIndex * 6 + index + 3}`"
            @click="openLightbox(pagePhotos[pageIndex], index)"
          >
            <img
              :src="photo"
              :alt="`Foto galeri ${pageIndex * 6 + index + 3}`"
              class="photo-inner"
              loading="lazy"
            />
          </button>

          <button
            type="button"
            class="large-card"
            :aria-label="`Perbesar foto utama ${pageIndex + 1}`"
            @click="openLightbox(pagePhotos[pageIndex], pagePhotos[pageIndex].length - 1)"
          >
            <img :src="page.featured" :alt="`Foto galeri utama ${pageIndex + 1}`" />
          </button>
        </div>
      </div>
    </div>
  </section>

  <GalleryLightbox
    :photos="lightboxPhotos"
    :index="lightboxIndex"
    @close="lightboxIndex = -1"
    @update:index="lightboxIndex = $event"
  />
</template>

<style scoped>
.gallery-page {
  display: flex;
  min-height: 100svh;
  width: 100%;
  align-items: stretch;
  justify-content: center;
  background: #7f8963;
  padding: 0;
  font-family: 'Blossom', 'Montserrat', sans-serif;
}

.gallery-container {
  position: relative;
  display: flex;
  box-sizing: border-box;
  width: 100%;
  max-width: none;
  min-height: 100%;
  margin: 0;
  flex-direction: column;
  overflow: hidden;
  background: #7f8963;
  box-shadow: 0 10px 30px rgb(0 0 0 / 20%);
}

.grid-container {
  height: 100svh;
}

.album-sheet {
  display: flex;
  height: 100%;
  flex-direction: column;
  transform-style: preserve-3d;
}

.album-tape {
  position: absolute;
  z-index: 3;
  width: clamp(90px, 14vw, 150px);
  height: 26px;
  background: rgb(244 236 216 / 55%);
  box-shadow: 0 2px 6px rgb(0 0 0 / 12%);
}

.tape-top {
  top: 1.1rem;
  left: 50%;
  transform: translateX(-50%) rotate(-3deg);
}

.tape-bottom {
  bottom: 1.1rem;
  left: 50%;
  transform: translateX(-50%) rotate(2deg);
}

.photo-counter {
  position: absolute;
  top: clamp(0.75rem, 2vw, 1.25rem);
  right: clamp(0.75rem, 2vw, 1.5rem);
  z-index: 3;
  color: rgb(255 255 255 / 85%);
  font-family: 'Marcellus', serif;
  font-size: 0.78rem;
  letter-spacing: 0.12em;
}

.bottom-section {
  display: grid;
  flex: 1;
  grid-template-columns: repeat(2, minmax(120px, 1fr)) minmax(320px, 2.2fr);
  grid-auto-flow: row;
  width: min(100%, 1240px);
  height: 100%;
  box-sizing: border-box;
  margin: 0 auto;
  column-gap: clamp(1.5rem, 3vw, 2.5rem);
  row-gap: clamp(1.5rem, 3vw, 2.5rem);
  padding: 20px;
}

.gallery-grid-1 {
  grid-template-rows: repeat(3, minmax(0, 1fr));
}

.gallery-grid-2 {
  grid-template-rows: repeat(2, minmax(0, 1fr));
}

.polaroid-grid {
  display: flex;
  min-height: 0;
  flex-direction: column;
  overflow: hidden;
  border: 0;
  border-radius: 18px;
  background: #fff;
  padding: 10px 10px 24px;
  cursor: zoom-in;
  box-shadow: 1px 3px 8px rgb(0 0 0 / 20%);
}

.polaroid-grid:hover,
.large-card:hover {
  translate: 0 -6px;
  box-shadow: 0 16px 28px rgb(0 0 0 / 28%);
}

.polaroid-grid .photo-inner {
  width: 100%;
  height: 100%;
  flex-grow: 1;
  border-radius: 12px;
  object-fit: cover;
  transition: transform 600ms ease;
}

.polaroid-grid:hover .photo-inner {
  transform: scale(1.035);
}

.large-card {
  grid-column: 3;
  grid-row: 1 / -1;
  min-height: 0;
  overflow: hidden;
  border: 4px solid #fff;
  border-radius: 18px;
  background: #dcb8b9;
  cursor: zoom-in;
  padding: 0;
  box-shadow: 0 12px 24px rgb(0 0 0 / 22%);
}

.large-card img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  animation: gallery-breathe 12s ease-in-out infinite alternate;
  transition: transform 600ms ease;
}

.large-card:hover img {
  transform: scale(1.035);
}

@keyframes gallery-breathe {
  from { scale: 1; }
  to { scale: 1.04; }
}

@media (max-width: 500px) {
  .bottom-section {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    column-gap: 10px;
    row-gap: 10px;
    padding: 12px;
  }

  .gallery-grid-1 {
    grid-template-rows: repeat(4, minmax(0, 1fr));
  }

  .gallery-grid-2 {
    grid-template-rows: repeat(3, minmax(0, 1fr));
  }

  .large-card {
    grid-column: 1 / -1;
    grid-row: 3;
  }

  .gallery-grid-1 .large-card {
    grid-row: 4;
  }
}

@media (hover: none) {
  .polaroid-grid:hover,
  .large-card:hover {
    translate: 0 0;
  }

  .polaroid-grid:hover .photo-inner,
  .large-card:hover img {
    transform: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .large-card img {
    animation: none;
  }
}
</style>
