<script setup>
import { wedding } from '../data/wedding'

const galleryPhotos = wedding.gallery

const galleryPages = [
  {
    photos: galleryPhotos.slice(0, 6),
    featured: galleryPhotos[6],
  },
  {
    photos: galleryPhotos.slice(7, 11),
    featured: galleryPhotos[11],
  },
]
</script>

<template>
  <section
    v-for="(page, pageIndex) in galleryPages"
    :key="`gallery-page-${pageIndex}`"
    class="gallery-page gallery-grid-page"
  >
    <div class="gallery-container grid-container">
      <div class="bottom-section" :class="`gallery-grid-${pageIndex + 1}`">
        <div
          v-for="(photo, index) in page.photos"
          :key="`${pageIndex}-${index}`"
          class="polaroid-grid"
        >
          <img
            :src="photo"
            :alt="`Foto galeri ${pageIndex * 6 + index + 3}`"
            class="photo-inner"
            loading="lazy"
          />
        </div>

        <div class="large-card">
          <img :src="page.featured" :alt="`Foto galeri utama ${pageIndex + 1}`" />
        </div>
      </div>
    </div>
  </section>
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
  border-radius: 18px;
  background: #fff;
  padding: 10px 10px 24px;
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
  box-shadow: 0 12px 24px rgb(0 0 0 / 22%);
}

.large-card img {
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
