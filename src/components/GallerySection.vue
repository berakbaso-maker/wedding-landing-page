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
  height: clamp(260px, 40vh, 360px);
  flex-shrink: 0;
  border-bottom: 6px solid #d3d3d3;
  background: #fff;
}

.top-left {
  display: flex;
  min-width: 0;
  width: 45%;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #dcb8b9;
}

.top-illustration {
  width: 90%;
  height: 90%;
  object-fit: contain;
  opacity: 0.8;
}

.top-right {
  position: relative;
  display: flex;
  min-width: 0;
  width: 55%;
  min-height: clamp(260px, 40vh, 360px);
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  background: #798665;
  padding: clamp(1rem, 3vw, 2rem);
}

.title {
  position: absolute;
  top: clamp(1rem, 3vw, 1.5rem);
  left: 50%;
  z-index: 1;
  margin: 0;
  color: #fff;
  font-family: 'Great Vibes', cursive;
  font-size: clamp(2.25rem, 6vw, 3rem);
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
  top: 1.25rem;
  right: 1.25rem;
  width: 3.25rem;
  height: 3.25rem;
}

.d-bouquet {
  bottom: 3.75rem;
  left: 1.25rem;
  width: 3rem;
  height: 3rem;
  transform: rotate(-15deg);
}

.polaroid-stack {
  position: absolute;
  top: 53%;
  left: 50%;
  width: clamp(190px, 25vw, 280px);
  height: clamp(150px, 20vw, 210px);
  transform: translate(-50%, -50%);
}

.polaroid-tilt {
  position: absolute;
  width: clamp(90px, 10vw, 130px);
  height: clamp(110px, 13vw, 155px);
  border-radius: 6px;
  background: #fff;
  padding: clamp(6px, 0.8vw, 8px) clamp(6px, 0.8vw, 8px) clamp(22px, 2.5vw, 30px);
  box-shadow: 2px 4px 15px rgb(0 0 0 / 30%);
}

.polaroid-tilt .photo-inner {
  width: 100%;
  height: 100%;
  border-radius: 3px;
  object-fit: cover;
}

.p-1 {
  top: 0;
  left: 50%;
  z-index: 2;
  margin-left: clamp(-65px, -5vw, -45px);
  transform: rotate(-10deg);
}

.p-2 {
  top: clamp(25px, 4vw, 45px);
  left: calc(50% + clamp(15px, 3vw, 30px));
  z-index: 1;
  transform: rotate(15deg);
}

.subtitle {
  position: absolute;
  bottom: clamp(0.75rem, 2vw, 1.25rem);
  width: min(90%, 420px);
  margin: 0;
  color: #fff;
  font-size: 0.5rem;
  line-height: 1.4;
  text-align: center;
  opacity: 0.9;
}

.bottom-section {
  display: grid;
  flex: 1;
  grid-template-columns: 1fr 1fr 2.2fr;
  width: 100%;
  box-sizing: border-box;
  gap: 15px;
  padding: 20px;
}

.polaroid-grid {
  display: flex;
  aspect-ratio: 1 / 1.15;
  flex-direction: column;
  overflow: hidden;
  border-radius: 6px;
  background: #fff;
  padding: 6px 6px 20px;
  box-shadow: 1px 3px 8px rgb(0 0 0 / 20%);
}

.polaroid-grid .photo-inner {
  width: 100%;
  height: 100%;
  flex-grow: 1;
  border-radius: 3px;
  object-fit: cover;
}

.large-card {
  grid-column: 3;
  min-height: 100%;
  overflow: hidden;
  border: 4px solid #fff;
  border-radius: 8px;
  background: #dcb8b9;
  box-shadow: 1px 3px 8px rgb(0 0 0 / 20%);
}

.large-card img {
  width: 100%;
  height: 100%;
  min-height: 100%;
  object-fit: cover;
}

.card-1 {
  grid-row: 1 / span 2;
}

.card-2 {
  grid-row: 3 / span 2;
}

@media (max-width: 500px) {
  .gallery-page {
    align-items: center;
    padding: 0;
  }

  .top-section {
    height: clamp(240px, 36vh, 280px);
  }

  .top-right {
    min-height: clamp(240px, 36vh, 280px);
  }

  .bottom-section {
    gap: 10px;
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
