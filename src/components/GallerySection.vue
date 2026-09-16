<script setup>
import { wedding } from '../data/wedding'
</script>

<template>
  <section id="gallery" class="gallery-page gallery-intro-page">
    <div class="gallery-container intro-container">
      <div class="top-section">
        <div class="top-left">
          <img
            src="/assets/gallery/gallery-15.jpeg"
            alt="Foto pasangan"
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
                src="/assets/gallery/gallery-13.jpeg"
                alt="Foto kenangan 1"
                class="photo-inner"
              />
            </div>
            <div class="polaroid-tilt p-2">
              <img
                src="/assets/gallery/gallery-14.jpeg"
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

.intro-container {
  height: 100svh;
}

.top-section {
  display: flex;
  width: 100%;
  height: 100%;
  flex-shrink: 0;
  background: #7f8963;
}

.top-left {
  display: flex;
  min-width: 0;
  width: 50%;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #7f8963;
}

.top-illustration {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
  background: #7f8963;
  padding: clamp(1rem, 3vw, 2rem);
}

.title {
  position: absolute;
  top: clamp(1.25rem, 2.5vw, 1.75rem);
  left: 50%;
  z-index: 1;
  margin: 0;
  color: #fff;
  font-family: 'Allura', cursive;
  font-size: clamp(3.25rem, 7vw, 4.75rem);
  font-weight: 400;
  text-align: center;
  text-shadow: 1px 1px 2px rgb(0 0 0 / 20%);
  transform: translateX(-50%);
  white-space: nowrap;
}

.doodle {
  position: absolute;
  z-index: 1;
  width: 3rem;
  height: 3rem;
  object-fit: contain;
  opacity: 0.85;
}

.d-car {
  top: 8%;
  right: 6%;
  width: clamp(4.25rem, 6vw, 6rem);
  height: clamp(4.25rem, 6vw, 6rem);
}

.d-bouquet {
  bottom: 10%;
  left: 6%;
  width: clamp(4rem, 5.5vw, 5.5rem);
  height: clamp(4rem, 5.5vw, 5.5rem);
  transform: rotate(-15deg);
}

.polaroid-stack {
  position: absolute;
  top: 54%;
  left: 50%;
  width: clamp(440px, 48vw, 660px);
  height: clamp(370px, 41vw, 530px);
  transform: translate(-50%, -50%);
}

.polaroid-tilt {
  position: absolute;
  display: flex;
  box-sizing: border-box;
  width: clamp(245px, 25vw, 320px);
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
  top: 0;
  left: 2%;
  z-index: 2;
  margin-left: 0;
  transform: rotate(-9deg);
}

.p-2 {
  top: 30%;
  right: 2%;
  left: auto;
  z-index: 1;
  transform: rotate(13deg);
}

.subtitle {
  position: absolute;
  bottom: clamp(1rem, 2vw, 1.5rem);
  width: min(90%, 600px);
  margin: 0;
  color: #fff;
  font-size: clamp(0.85rem, 1.35vw, 1.1rem);
  line-height: 1.5;
  text-align: center;
  opacity: 0.9;
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
    width: 100%;
    height: 100%;
  }

  .top-right {
    width: 100%;
    min-height: 0;
    height: 66%;
  }

  .title {
    top: 0.75rem;
    font-size: clamp(2.75rem, 13vw, 3.5rem);
  }

  .doodle {
    width: 3.25rem;
    height: 3.25rem;
  }

  .polaroid-stack {
    top: 53%;
    width: min(96%, 400px);
    height: 275px;
  }

  .polaroid-tilt {
    width: 126px;
    height: 150px;
  }

  .p-1 {
    top: 0;
    left: 0;
  }

  .p-2 {
    top: 28%;
    right: 0;
    left: auto;
  }

  .subtitle {
    bottom: 0.75rem;
    font-size: 0.8rem;
  }
}
</style>
