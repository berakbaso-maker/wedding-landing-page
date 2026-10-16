<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import GalleryLightbox from './GalleryLightbox.vue'

gsap.registerPlugin(ScrollTrigger)

const cards = [
  {
    id: 1,
    photo: '/assets/gallery/polaroid_1.png',
    alt: 'Foto kenangan 1',
  },
  {
    id: 2,
    photo: '/assets/gallery/polaroid_2.png',
    alt: 'Foto kenangan 2',
  },
  {
    id: 3,
    photo: '/assets/gallery/polaroid_3.png',
    alt: 'Foto kenangan 3',
  },
  {
    id: 4,
    photo: '/assets/detail-acara/gallery_2.png',
    alt: 'Foto kenangan 4',
  },
  {
    id: 5,
    photo: '/assets/detail-acara/gallery_4.png',
    alt: 'Foto kenangan 5',
  },
]

const allPhotos = cards.map((c) => c.photo)
const lightboxIndex = ref(-1)
const lightboxPhotos = ref(allPhotos)

const leftCards = computed(() => [
  { ...cards[0], index: 0 },
  { ...cards[1], index: 1 },
])

const topRightCard = computed(() => ({ ...cards[2], index: 2 }))

const bottomRightCards = computed(() => [
  { ...cards[3], index: 3 },
  { ...cards[4], index: 4 },
])

const openLightbox = (photos, index) => {
  lightboxPhotos.value = photos
  lightboxIndex.value = index
}

let ctx = null

onMounted(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce) return

  ctx = gsap.context(() => {
    gsap.utils.toArray('.album-sheet').forEach((sheet) => {
      gsap.fromTo(
        sheet,
        { opacity: 0.9, y: 30 },
        {
          opacity: 1,
          y: 0,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sheet,
            start: 'top 85%',
            end: 'top 50%',
            scrub: 0.6,
          },
        },
      )
    })
  })
})

onUnmounted(() => ctx?.revert())
</script>

<template>
  <section id="gallery-grid" class="gallery-page gallery-grid-page">
    <div class="gallery-container grid-container">
      <div class="album-sheet">
        <div class="gallery-layout">
          <!-- Kolom Kiri: 2 Kartu Polaroid Vertikal -->
          <div class="layout-col col-left">
            <button
              v-for="(card, i) in leftCards"
              :key="card.id"
              type="button"
              class="polaroid-card card-left reveal"
              :class="`card-${card.id}`"
              :aria-label="`Perbesar foto ${card.id}`"
              v-reveal="{ delay: 80 + i * 100, scale: 0.95 }"
              @click="openLightbox(allPhotos, card.index)"
            >
              <div class="photo-wrapper">
                <img
                  :src="card.photo"
                  :alt="card.alt"
                  class="photo-inner"
                  loading="lazy"
                />
              </div>
            </button>
          </div>

          <!-- Kolom Kanan: 1 Kartu Besar Atas + 2 Kartu Kecil Bawah -->
          <div class="layout-col col-right">
            <!-- Kartu Besar Atas -->
            <button
              type="button"
              class="polaroid-card card-large-top reveal"
              :class="`card-${topRightCard.id}`"
              :aria-label="`Perbesar foto ${topRightCard.id}`"
              v-reveal="{ delay: 180, scale: 0.95 }"
              @click="openLightbox(allPhotos, topRightCard.index)"
            >
              <div class="photo-wrapper">
                <img
                  :src="topRightCard.photo"
                  :alt="topRightCard.alt"
                  class="photo-inner"
                  loading="lazy"
                />
              </div>
            </button>

            <!-- Baris Bawah: 2 Kartu Bersebelahan -->
            <div class="bottom-pair-row">
              <button
                v-for="(card, subIdx) in bottomRightCards"
                :key="card.id"
                type="button"
                class="polaroid-card card-small-bottom reveal"
                :class="`card-${card.id}`"
                :aria-label="`Perbesar foto ${card.id}`"
                v-reveal="{ delay: 260 + subIdx * 90, scale: 0.95 }"
                @click="openLightbox(allPhotos, card.index)"
              >
                <div class="photo-wrapper">
                  <img
                    :src="card.photo"
                    :alt="card.alt"
                    class="photo-inner"
                    loading="lazy"
                  />
                </div>
              </button>
            </div>
          </div>
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
  align-items: center;
  justify-content: center;
  background: #7f8963;
  padding: clamp(1.5rem, 3.5vh, 3rem) 0;
  font-family: 'Blossom', 'Montserrat', sans-serif;
  overflow: hidden;
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
  justify-content: center;
  align-items: center;
  background: #7f8963;
}

.grid-container {
  min-height: 100svh;
  width: 100%;
  margin-top: clamp(3rem, 7vh, 6rem);
  margin-bottom: clamp(3rem, 7vh, 6rem);
  padding: clamp(1.25rem, 2.5vh, 2.25rem) clamp(0.75rem, 2vw, 1.75rem);
  box-sizing: border-box;
}

.album-sheet {
  position: relative;
  width: 100%;
  max-width: 100%;
  margin: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* Layout 2 Kolom Presisi */
.gallery-layout {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: center;
  gap: clamp(18px, 2.4vw, 36px);
  width: 100%;
}

/* Kolom Kiri: ~42% lebar grid */
.col-left {
  flex: 0 0 42%;
  width: 42%;
  display: flex;
  flex-direction: column;
  gap: clamp(18px, 2.4vw, 36px);
  justify-content: space-between;
}

/* Kolom Kanan: ~58% lebar grid */
.col-right {
  flex: 1 1 0;
  width: 58%;
  display: flex;
  flex-direction: column;
  gap: clamp(18px, 2.4vw, 36px);
  justify-content: space-between;
}

/* Base Polaroid Card */
.polaroid-card {
  position: relative;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  border: 0;
  border-radius: clamp(18px, 2.2vw, 28px);
  background: #ffffff;
  cursor: zoom-in;
  /* Shadow solid tajam dengan sedikit transparansi sesuai referensi */
  box-shadow: clamp(10px, 1.3vw, 15px) clamp(12px, 1.5vw, 18px) 0 rgb(0 0 0 / 28%);
  transition:
    transform 320ms cubic-bezier(0.2, 0, 0, 1),
    box-shadow 320ms cubic-bezier(0.2, 0, 0, 1);
  overflow: hidden;
  text-align: left;
}

.photo-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: clamp(12px, 1.5vw, 18px);
  background: #eaeaea;
  display: flex;
}

.photo-inner {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 500ms ease;
}

/* KARTU KOLOM KIRI (Card 1 & Card 2) */
.card-left {
  flex: 1 1 0;
  width: 100%;
  aspect-ratio: 1 / 1.08;
  padding: clamp(16px, 2vw, 24px) clamp(16px, 2vw, 24px) clamp(36px, 4.8vw, 62px);
}

/* KARTU BESAR KANAN ATAS (Card 3) */
.card-large-top {
  width: 100%;
  aspect-ratio: 1 / 0.98;
  padding: clamp(18px, 2.2vw, 28px) clamp(18px, 2.2vw, 28px) clamp(40px, 5.2vw, 70px);
}

/* BARIS BAWAH KOLOM KANAN */
.bottom-pair-row {
  display: flex;
  flex-direction: row;
  gap: clamp(18px, 2.4vw, 36px);
  width: 100%;
  align-items: stretch;
}

/* KARTU KECIL KANAN BAWAH (Card 4 & Card 5) */
.card-small-bottom {
  flex: 1 1 0;
  width: 50%;
  aspect-ratio: 1 / 1.08;
  padding: clamp(12px, 1.6vw, 18px) clamp(12px, 1.6vw, 18px) clamp(28px, 3.6vw, 46px);
  border-radius: clamp(15px, 1.8vw, 22px);
  box-shadow: clamp(8px, 1.1vw, 12px) clamp(10px, 1.3vw, 14px) 0 rgb(0 0 0 / 28%);
}

.card-small-bottom .photo-wrapper {
  border-radius: clamp(10px, 1.2vw, 15px);
}

/* Hover Interaction (Desktop) */
@media (hover: hover) {
  .polaroid-card:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: clamp(14px, 1.8vw, 22px) clamp(16px, 2vw, 24px) 0 rgb(0 0 0 / 34%);
    z-index: 10;
  }

  .polaroid-card:hover .photo-inner {
    transform: scale(1.035);
  }
}

/* Responsive Tablet & Mobile */
@media (max-width: 860px) {
  .gallery-page {
    padding: clamp(1rem, 2.5vh, 2rem) 0;
  }

  .grid-container {
    margin-top: clamp(2.5rem, 6vh, 4.5rem);
    margin-bottom: clamp(2.5rem, 6vh, 4.5rem);
    padding: clamp(1rem, 2.5vw, 1.5rem) clamp(0.6rem, 2vw, 1rem);
    min-height: auto;
    width: 100%;
  }

  .album-sheet {
    max-width: 100%;
    width: 100%;
    margin: 0;
  }

  .gallery-layout {
    width: 100%;
    flex-direction: column;
    gap: clamp(12px, 2.5vw, 18px);
  }

  .col-left {
    flex: none;
    width: 100%;
    max-width: 100%;
    flex-direction: row;
    gap: clamp(10px, 2vw, 16px);
    justify-content: space-between;
  }

  .col-right {
    flex: none;
    width: 100%;
    max-width: 100%;
    flex-direction: column;
    gap: clamp(12px, 2.5vw, 18px);
  }

  .card-left {
    flex: 1 1 0;
    width: 50%;
    aspect-ratio: 1 / 1.15;
    padding: clamp(7px, 1.8vw, 12px) clamp(7px, 1.8vw, 12px) clamp(20px, 4.5vw, 32px);
    border-radius: clamp(12px, 2.2vw, 16px);
    box-shadow: clamp(4px, 1vw, 6px) clamp(5px, 1.2vw, 8px) 0 rgb(0 0 0 / 28%);
  }

  .card-left .photo-wrapper {
    border-radius: clamp(8px, 1.8vw, 13px);
  }

  .card-large-top {
    width: 100%;
    aspect-ratio: 1 / 1.16;
    padding: clamp(10px, 2.2vw, 16px) clamp(10px, 2.2vw, 16px) clamp(26px, 5.5vw, 40px);
    border-radius: clamp(14px, 2.6vw, 20px);
    box-shadow: clamp(5px, 1.2vw, 8px) clamp(6px, 1.5vw, 10px) 0 rgb(0 0 0 / 28%);
  }

  .card-large-top .photo-wrapper {
    border-radius: clamp(10px, 2.2vw, 15px);
  }

  .bottom-pair-row {
    display: flex;
    flex-direction: row;
    gap: clamp(10px, 2vw, 16px);
    width: 100%;
  }

  .card-small-bottom {
    flex: 1 1 0;
    width: 50%;
    aspect-ratio: 1 / 1.15;
    padding: clamp(7px, 1.8vw, 12px) clamp(7px, 1.8vw, 12px) clamp(20px, 4.5vw, 32px);
    border-radius: clamp(12px, 2.2vw, 16px);
    box-shadow: clamp(4px, 1vw, 6px) clamp(5px, 1.2vw, 8px) 0 rgb(0 0 0 / 28%);
  }

  .card-small-bottom .photo-wrapper {
    border-radius: clamp(8px, 1.8vw, 13px);
  }
}

@media (max-width: 420px) {
  .grid-container {
    margin-top: 2.25rem;
    margin-bottom: 2.25rem;
    padding: 0.75rem 0.5rem;
  }

  .gallery-layout {
    gap: 10px;
  }

  .col-left,
  .bottom-pair-row {
    gap: 8px;
  }

  .col-right {
    gap: 10px;
  }

  .card-left,
  .card-small-bottom {
    padding: 6px 6px 18px;
    border-radius: 10px;
    box-shadow: 3px 4px 0 rgb(0 0 0 / 28%);
  }

  .card-left .photo-wrapper,
  .card-small-bottom .photo-wrapper {
    border-radius: 8px;
  }

  .card-large-top {
    padding: 8px 8px 22px;
    border-radius: 12px;
    box-shadow: 4px 5px 0 rgb(0 0 0 / 28%);
  }

  .card-large-top .photo-wrapper {
    border-radius: 10px;
  }
}
</style>
