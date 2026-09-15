<script setup>
import { wedding } from '../data/wedding'

const galleryPhotos = wedding.gallery
</script>

<template>
  <section id="gallery" class="gallery-page">
    <div class="gallery-container">
      <div class="top-section">
        <div class="top-left">
          <img
            src="/assets/brides-groom/ilus_person_1-1-11.png"
            alt="Ilustrasi pasangan"
            class="top-illustration"
          />
        </div>

        <div class="top-right">
          <h2 class="title">{{ wedding.galleryPage.title }}</h2>

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

      <div class="bottom-section">
        <div
          v-for="(photo, index) in galleryPhotos.slice(2, 8)"
          :key="`${photo}-${index}`"
          class="polaroid-grid"
        >
          <img :src="photo" :alt="`Foto galeri ${index + 3}`" class="photo-inner" loading="lazy" />
        </div>

        <div class="large-card card-1">
          <img :src="galleryPhotos[8]" alt="Foto galeri utama 1" />
        </div>

        <div class="polaroid-grid">
          <img :src="galleryPhotos[8]" alt="Foto galeri 9" class="photo-inner" loading="lazy" />
        </div>
        <div class="polaroid-grid">
          <img :src="galleryPhotos[9]" alt="Foto galeri 10" class="photo-inner" loading="lazy" />
        </div>

        <div class="large-card card-2">
          <img :src="galleryPhotos[0]" alt="Foto galeri utama 2" />
        </div>

        <div class="polaroid-grid">
          <img :src="galleryPhotos[1]" alt="Foto galeri 11" class="photo-inner" loading="lazy" />
        </div>
        <div class="polaroid-grid">
          <img :src="galleryPhotos[2]" alt="Foto galeri 12" class="photo-inner" loading="lazy" />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.gallery-page {
  display: flex;
  min-height: 0;
  width: 100%;
  align-items: flex-start;
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
  min-height: auto;
  margin: 0 auto;
  flex-direction: column;
  overflow: hidden;
  background: #798665;
  box-shadow: 0 10px 30px rgb(0 0 0 / 20%);
}

.top-section {
  display: flex;
  width: 100%;
  height: clamp(460px, 58vh, 620px);
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
  min-height: clamp(460px, 58vh, 620px);
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
  width: min(100%, 1240px);
  box-sizing: border-box;
  margin: 0 auto;
  column-gap: clamp(1.5rem, 3vw, 2.5rem);
  row-gap: clamp(1.5rem, 3vw, 2.5rem);
  padding: 20px;
}

.polaroid-grid {
  display: flex;
  aspect-ratio: 1 / 1.3;
  flex-direction: column;
  overflow: hidden;
  border-radius: 18px;
  background: #fff;
  padding: 10px 10px 24px;
  box-shadow: 1px 3px 8px rgb(0 0 0 / 20%);
}

.polaroid-grid .photo-inner {
  width: 100%;
  height: 100%;
  flex-grow: 1;
  border-radius: 12px;
  object-fit: cover;
}

.large-card {
  grid-column: 3;
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
}

.card-1 {
  grid-row: 1 / span 3;
}

.card-2 {
  grid-row: 4 / span 2;
}

@media (max-width: 500px) {
  .gallery-page {
    align-items: center;
    padding: 0;
  }

  .top-section {
    height: clamp(400px, 52vh, 500px);
  }

  .top-right {
    min-height: clamp(400px, 52vh, 500px);
  }

  .bottom-section {
    grid-template-columns: repeat(2, minmax(0, 1fr)) minmax(140px, 1.35fr);
    column-gap: 10px;
    row-gap: 10px;
    padding: 12px;
  }

  .polaroid-tilt {
    width: 100px;
    height: 120px;
  }

  .p-2 {
    left: calc(50% + 15px);
  }
}
</style>
