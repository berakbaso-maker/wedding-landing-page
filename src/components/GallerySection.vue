<script setup>
import { wedding } from '../data/wedding'

const galleryPhotos = wedding.gallery

const galleryPages = [
  {
    photos: galleryPhotos.slice(2, 8),
    featured: galleryPhotos[8],
  },
  {
    photos: [galleryPhotos[8], galleryPhotos[9], galleryPhotos[1], galleryPhotos[2]],
    featured: galleryPhotos[0],
  },
]
</script>

<template>
  <section id="gallery" class="gallery-page gallery-intro-page">
    <div class="gallery-container intro-container">
      <div class="top-section">
        <div class="top-left">
          <img
            src="/assets/brides-groom/ilus_person_1-1-11.png"
            alt="Ilustrasi pasangan"
            class="top-illustration"
          />
        </div>

        <div class="top-right">
          <h2 class="title">
            {{ wedding.galleryPage.title }}
          </h2>

          <img
            src="/assets/the-gallery/icon17-2-42.png"
            alt=""
            class="doodle d-car"
          />
          <img
            src="/assets/the-gallery/icon14-1-17.png"
            alt=""
            class="doodle d-bouquet"
          />

          <div class="polaroid-stack">
            <div class="polaroid-tilt p-1">
              <img
                src="/assets/brides-groom/example-fotoo.jpeg"
                alt="Foto kenangan 1"
                class="photo-inner"
              />
            </div>
            <div class="polaroid-tilt p-2">
              <img
                src="/assets/brides-groom/example-fotoo.jpeg"
                alt="Foto kenangan 2"
                class="photo-inner"
              />
            </div>
          </div>

          <p class="subtitle">
            Together with our families, we invite you to share in our wedding.
            Your presence is the greatest gift.
          </p>
        </div>
      </div>
    </div>
  </section>

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
  background: #f4f4f4;
  padding: 0;
  font-family: 'Montserrat', sans-serif;
  box-shadow: 0 -12px 24px rgb(0 0 0 / 18%), 0 12px 24px rgb(0 0 0 / 18%);
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
  background: #798665;
  box-shadow: 0 10px 30px rgb(0 0 0 / 20%);
}

.intro-container,
.grid-container {
  height: 100svh;
}

.top-section {
  display: flex;
  width: 100%;
  height: 100%;
  flex-shrink: 0;
  border-bottom: 6px solid #d3d3d3;
  background: #fff;
}

.top-left {
  display: flex;
  min-width: 0;
  width: 50%;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #dcb8b9;
}

.top-illustration {
  width: min(82%, 420px);
  height: 88%;
  object-fit: contain;
  opacity: 0.8;
}

.top-right {
  position: relative;
  display: flex;
  min-width: 0;
  width: 50%;
  min-height: 100%;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  background: #798665;
  padding: clamp(1rem, 3vw, 2rem);
}

.title {
  position: absolute;
  top: clamp(1.25rem, 2.5vw, 1.75rem);
  left: 50%;
  z-index: 1;
  margin: 0;
  color: #fff;
  font-family: 'Great Vibes', cursive;
  font-size: clamp(2.75rem, 5vw, 4rem);
  font-weight: 400;
  text-align: center;
  text-shadow: 1px 1px 2px rgb(0 0 0 / 20%);
  transform: translateX(-50%);
  white-space: nowrap;
}

.doodle {
  position: absolute;
  z-index: 1;
  width: 2.5rem;
  height: 2.5rem;
  object-fit: contain;
  opacity: 0.85;
}

.d-car {
  top: 8%;
  right: 6%;
  width: clamp(3.5rem, 5vw, 5rem);
  height: clamp(3.5rem, 5vw, 5rem);
}

.d-bouquet {
  bottom: 10%;
  left: 6%;
  width: clamp(3.25rem, 4.5vw, 4.5rem);
  height: clamp(3.25rem, 4.5vw, 4.5rem);
  transform: rotate(-15deg);
}

.polaroid-stack {
  position: absolute;
  top: 58%;
  left: 50%;
  width: clamp(340px, 38vw, 500px);
  height: clamp(280px, 32vw, 390px);
  transform: translate(-50%, -50%);
}

.polaroid-tilt {
  position: absolute;
  display: flex;
  box-sizing: border-box;
  width: clamp(180px, 19vw, 230px);
  aspect-ratio: 1 / 1.15;
  border-radius: 12px;
  background: #fff;
  padding: 6px 6px 20px;
  box-shadow: 0 10px 20px rgb(0 0 0 / 22%);
}

.polaroid-tilt .photo-inner {
  width: 100%;
  min-height: 0;
  flex: 1;
  border-radius: 7px;
  object-fit: cover;
}

.p-1 {
  top: 4%;
  left: 8%;
  z-index: 2;
  margin-left: 0;
  transform: rotate(-10deg);
}

.p-2 {
  top: 18%;
  right: 8%;
  left: auto;
  z-index: 1;
  transform: rotate(15deg);
}

.subtitle {
  position: absolute;
  bottom: clamp(1rem, 2vw, 1.5rem);
  width: min(88%, 520px);
  margin: 0;
  color: #fff;
  font-size: clamp(0.7rem, 1.1vw, 0.9rem);
  line-height: 1.5;
  text-align: center;
  opacity: 0.9;
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
  .gallery-page {
    align-items: center;
    padding: 0;
  }

  .top-section {
    flex-direction: column;
  }

  .top-left {
    width: 100%;
    height: 34%;
  }

  .top-illustration {
    width: min(70%, 260px);
    height: 92%;
  }

  .top-right {
    width: 100%;
    min-height: 0;
    height: 66%;
  }

  .title {
    top: 0.75rem;
    font-size: clamp(2.5rem, 12vw, 3.25rem);
  }

  .polaroid-stack {
    top: 55%;
    width: min(86%, 330px);
    height: 220px;
  }

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

  .polaroid-tilt {
    width: 100px;
    height: 120px;
  }

  .p-2 {
    right: 8%;
    left: auto;
  }

  .subtitle {
    bottom: 0.75rem;
    font-size: 0.68rem;
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
