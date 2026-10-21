<script setup>
import { ref } from 'vue'
import { wedding } from '../data/wedding'

const isEdit =
  typeof window !== 'undefined' &&
  new URLSearchParams(window.location.search).get('edit') === '1'

// posisi default dari wedding.js, di-clone supaya bisa diubah
const decoDefaults = [
  ...wedding.detailAcara.decorations.map((d) => ({ ...d })),
]

const decoItems = ref(decoDefaults.map((d) => ({ ...d })))

// --- drag pindah ---
let dragState = null

const onPointerDown = (event, index) => {
  if (!isEdit) return
  const layer = event.currentTarget.closest('.deco-layer')
  if (!layer) return
  const rect = layer.getBoundingClientRect()
  dragState = {
    index,
    rect,
    pointerId: event.pointerId,
  }
  event.currentTarget.setPointerCapture(event.pointerId)
  event.preventDefault()
}

const onPointerMove = (event) => {
  if (!dragState || dragState.pointerId !== event.pointerId) return
  const { rect, index } = dragState
  const x = ((event.clientX - rect.left) / rect.width) * 100
  const y = ((event.clientY - rect.top) / rect.height) * 100
  decoItems.value[index].x = Math.max(0, Math.min(100, Math.round(x * 10) / 10))
  decoItems.value[index].y = Math.max(0, Math.min(100, Math.round(y * 10) / 10))
}

const onPointerUp = (event) => {
  if (!dragState || dragState.pointerId !== event.pointerId) return
  dragState = null
}

// --- resize ---
let resizeState = null

const onResizeDown = (event, index) => {
  event.stopPropagation()
  resizeState = {
    index,
    startX: event.clientX,
    startSize: decoItems.value[index].size,
    pointerId: event.pointerId,
  }
  event.currentTarget.setPointerCapture(event.pointerId)
  event.preventDefault()
}

const onResizeMove = (event) => {
  if (!resizeState || resizeState.pointerId !== event.pointerId) return
  const delta = event.clientX - resizeState.startX
  const newSize = Math.max(30, Math.min(300, Math.round(resizeState.startSize + delta)))
  decoItems.value[resizeState.index].size = newSize
}

const onResizeUp = (event) => {
  if (!resizeState || resizeState.pointerId !== event.pointerId) return
  resizeState = null
}

const resetDeco = () => {
  decoItems.value = decoDefaults.map((d) => ({ ...d }))
}

const copyJson = async () => {
  const json = JSON.stringify(
    decoItems.value.map(({ src, x, y, size, rotate }) => ({ src, x, y, size, rotate })),
    null,
    2,
  )
  try {
    await navigator.clipboard.writeText(json)
    alert('JSON konfigurasi dekorasi tersalin ke clipboard!')
  } catch {
    console.log(json)
    alert('Lihat console untuk melihat JSON dekorasi.')
  }
}

const styleFor = (deco) => ({
  left: `${deco.x}%`,
  top: `${deco.y}%`,
  width: `${deco.size}px`,
  height: `${deco.size}px`,
  transform: `translate(-50%, -50%) rotate(${deco.rotate || 0}deg)`,
})
</script>

<template>
  <section id="detail-acara" class="detail-acara-page">
    <div class="detail-acara-container">
      <!-- Layer Doodles / Dekorasi Keseluruhan -->
      <div
        class="deco-layer"
        :class="{ 'deco-layer--edit': isEdit }"
        aria-hidden="true"
        @pointermove="isEdit ? onPointerMove($event) : null"
        @pointerup="isEdit ? onPointerUp($event) : null"
      >
        <div
          v-for="(deco, index) in decoItems"
          :key="`deco-${index}`"
          class="deco"
          :class="{ 'deco--edit': isEdit }"
          :style="styleFor(deco)"
        >
          <img
            :src="deco.src"
            alt=""
            class="deco-img"
            @pointerdown="isEdit ? onPointerDown($event, index) : null"
          />
          <span
            v-if="isEdit"
            class="resize-handle"
            @pointerdown="onResizeDown($event, index)"
            @pointermove="onResizeMove($event)"
            @pointerup="onResizeUp($event)"
          ></span>
        </div>
      </div>

      <!-- Judul Bagian -->
      <h2 class="title reveal" v-reveal="{ y: 18 }">
        {{ wedding.detailAcara.title }}
      </h2>

      <!-- Ilustrasi Lengkungan Pernikahan Utama (Sesuai Desain Figma) -->
      <div class="main-illustration-wrapper reveal" v-reveal="{ delay: 140 }">
        <img
          :src="wedding.detailAcara.image"
          alt="Detail Acara & Alamat"
          class="main-image"
          loading="lazy"
        />
      </div>

      <!-- Sesi Acara: Akad Nikah & Resepsi -->
      <div class="events-section">
        <div
          v-for="(event, index) in wedding.detailAcara.events"
          :key="event.name"
          class="event-col reveal"
          v-reveal="{ delay: 120 + index * 100, y: 28 }"
        >
          <div class="event-icon-box">
            <img :src="event.icon" :alt="event.name" class="event-icon" loading="lazy" />
          </div>
          <h3 class="event-name">{{ event.name }}</h3>
          <p class="event-time">{{ event.time }}</p>
          <p class="event-date">{{ event.date }}</p>
          <p class="event-address">{{ event.address }}</p>
        </div>
      </div>

      <!-- Sesi Denah Lokasi & Maps -->
      <div class="denah-section">
        <h2 class="denah-label reveal" v-reveal="{ y: 16 }">
          {{ wedding.detailAcara.denahLabel }}
        </h2>

        <img
          :src="wedding.detailAcara.denahImage"
          alt="Denah Lokasi"
          class="denah-image reveal"
          loading="lazy"
          v-reveal="{ delay: 80 }"
        />

        <a
          :href="wedding.detailAcara.mapsUrl"
          target="_blank"
          rel="noopener"
          class="maps-btn reveal"
          v-reveal="{ delay: 160 }"
        >
          {{ wedding.detailAcara.mapsLabel }}
        </a>
      </div>

      <!-- Pesan Penutup Acara -->
      <p class="closing-message reveal" v-reveal="{ delay: 220 }">
        {{ wedding.detailAcara.closingMessage }}
      </p>
    </div>

    <!-- Toolbar Drag & Edit Posisi (?edit=1) -->
    <div v-if="isEdit" class="deco-toolbar">
      <span class="deco-toolbar__hint">Mode Tata Letak — drag untuk pindah, tarik titik untuk ukuran</span>
      <button type="button" class="deco-btn" @click="resetDeco">Reset</button>
      <button type="button" class="deco-btn deco-btn--primary" @click="copyJson">Copy JSON</button>
    </div>
  </section>
</template>

<style scoped>
.detail-acara-page {
  display: flex;
  min-height: 100svh;
  width: 100%;
  align-items: center;
  justify-content: center;
  background: #7f8963;
  padding: 0;
  font-family: 'Blossom', 'Montserrat', sans-serif;
}

.detail-acara-container {
  position: relative;
  display: flex;
  box-sizing: border-box;
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: clamp(3.5rem, 7vh, 6rem) clamp(1rem, 4vw, 3.5rem);
  color: #fff;
  text-align: center;
}

/* LAYER DOODLES / DEKORASI */
.deco-layer {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}

.deco {
  position: absolute;
  transform-origin: center center;
  opacity: 0.95;
}

.deco-img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  pointer-events: none;
  filter: drop-shadow(0 2px 4px rgb(0 0 0 / 10%));
}

/* Mode edit dekorasi */
.deco-layer--edit {
  pointer-events: none;
}

.deco--edit {
  pointer-events: auto;
  outline: 2px dashed rgb(255 255 255 / 85%);
  outline-offset: 2px;
}

.deco--edit .deco-img {
  pointer-events: auto;
  cursor: grab;
}

.deco--edit .deco-img:active {
  cursor: grabbing;
}

.resize-handle {
  position: absolute;
  right: -9px;
  bottom: -9px;
  width: 16px;
  height: 16px;
  border: 2px solid #fff;
  border-radius: 50%;
  background: #476d4d;
  cursor: nwse-resize;
}

.deco-toolbar {
  position: fixed;
  bottom: 1.5rem;
  left: 50%;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-radius: 10px;
  background: rgb(30 30 30 / 92%);
  padding: 0.6rem 0.9rem;
  color: #fff;
  font-family: 'Roboto', 'Montserrat', sans-serif;
  font-size: 0.85rem;
  transform: translateX(-50%);
}

.deco-toolbar__hint {
  opacity: 0.85;
}

.deco-btn {
  border: 0;
  border-radius: 6px;
  background: #d5d5d5;
  padding: 0.5rem 1rem;
  color: #222;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
}

.deco-btn--primary {
  background: #476d4d;
  color: #fff;
}

/* JUDUL UTAMA DETAIL ACARA */
.title {
  position: relative;
  z-index: 2;
  margin: 0 0 clamp(2rem, 5vh, 3.5rem);
  font-family: 'Allura', cursive;
  font-size: clamp(4.5rem, 9.5vw, 6.85rem);
  font-weight: 400;
  line-height: 1.15;
  color: #ffffff;
  text-shadow: 1px 1px 4px rgb(0 0 0 / 14%);
}

/* ILUSTRASI UTAMA (ARCH LENGKUNGAN PENGANTIN) */
.main-illustration-wrapper {
  position: relative;
  z-index: 2;
  width: min(92%, 42.5rem);
  margin: 0 auto clamp(3rem, 6vh, 5rem);
}

.main-image {
  display: block;
  width: 100%;
  height: auto;
  margin: 0 auto;
  object-fit: contain;
}

/* DAFTAR ACARA (AKAD NIKAH & RESEPSI) */
.events-section {
  position: relative;
  z-index: 2;
  display: grid;
  width: min(100%, 80rem);
  grid-template-columns: repeat(2, 1fr);
  gap: clamp(4rem, 10vw, 10rem);
  margin: 0 auto clamp(3.5rem, 7vh, 5.5rem);
  align-items: start;
  box-sizing: border-box;
}

.event-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  color: #fff;
}

/* WADAH IKON DENGAN TINGGI SERAGAM SUPAYA TEKS DI KEDUA KOLOM SEJAJAR SEMPURNA */
.event-icon-box {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  width: 100%;
  height: clamp(190px, 23vw, 270px);
}

.event-icon {
  width: auto;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

/* Logo merpati diperbesar sesuai permintaan */
.event-col:first-child .event-icon,
.event-icon[src*="merpati"] {
  width: clamp(230px, 27vw, 340px);
  max-height: clamp(180px, 21vw, 260px);
}

/* Logo cincin proporsional dan sejajar */
.event-col:nth-child(2) .event-icon,
.event-icon[src*="cincin"] {
  width: clamp(200px, 24vw, 300px);
  max-height: clamp(155px, 19vw, 225px);
}

.event-name {
  margin: 1.25rem 0 0.75rem;
  font-family: 'Allura', cursive;
  font-size: clamp(3.25rem, 6.5vw, 4.85rem);
  font-weight: 400;
  line-height: 1.15;
  color: #ffffff;
  text-shadow: 1px 1px 3px rgb(0 0 0 / 12%);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 1.25em;
}

.event-time,
.event-date {
  margin: 0;
  font-family: 'Marcellus', serif;
  font-size: clamp(1.35rem, 2.4vw, 1.95rem);
  line-height: 1.5;
  color: #ffffff;
}

.event-time {
  margin-bottom: 0.35rem;
}

.event-date {
  margin-bottom: 1.25rem;
}

.event-address {
  margin: 0;
  width: min(100%, 460px);
  font-family: 'Marcellus', serif;
  font-size: clamp(1.05rem, 1.6vw, 1.25rem);
  line-height: 1.65;
  white-space: pre-line;
  color: #ffffff;
  opacity: 0.95;
}

/* DENAH LOKASI & MAPS */
.denah-section {
  position: relative;
  z-index: 2;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0;
}

.denah-label {
  margin: 0 0 clamp(1.75rem, 4vh, 2.75rem);
  font-family: 'Allura', cursive;
  font-size: clamp(4.5rem, 9.5vw, 6.85rem);
  font-weight: 400;
  color: #ffffff;
  line-height: 1.15;
  text-shadow: 1px 1px 3px rgb(0 0 0 / 12%);
}

.denah-image {
  display: block;
  width: min(94%, 880px);
  margin: 0 auto;
  border-radius: clamp(16px, 2vw, 24px);
  box-shadow: 0 14px 40px rgb(0 0 0 / 18%);
  object-fit: contain;
}

.maps-btn {
  display: block;
  box-sizing: border-box;
  width: min(94%, 880px);
  margin: clamp(1.75rem, 3.5vh, 2.5rem) auto 1.5rem;
  border-radius: 12px;
  background: #3d5e42;
  padding: clamp(1rem, 2vh, 1.35rem) 2rem;
  color: #fff;
  font-family: 'Marcellus', serif;
  font-size: clamp(1.2rem, 2vw, 1.55rem);
  font-weight: 400;
  text-align: center;
  text-decoration: none;
  box-shadow: 0 6px 18px rgb(0 0 0 / 22%);
  transition: transform 250ms ease, box-shadow 250ms ease, background 250ms ease;
}

.maps-btn:hover {
  background: #355339;
  transform: translateY(-3px);
  box-shadow: 0 10px 24px rgb(0 0 0 / 28%);
}

.closing-message {
  position: relative;
  z-index: 2;
  margin: 1.5rem auto clamp(2rem, 5vh, 4rem);
  width: min(100%, 640px);
  font-family: 'Marcellus', serif;
  font-size: clamp(1.05rem, 1.6vw, 1.3rem);
  line-height: 1.5;
  color: #ffffff;
  opacity: 0.92;
  text-align: center;
}

/* RESPONSIVE MOBILE & TABLET */
@media (max-width: 860px) {
  .events-section {
    grid-template-columns: 1fr;
    gap: 3.5rem;
  }

  .main-illustration-wrapper {
    width: 95%;
  }

  .title,
  .denah-label {
    font-size: clamp(3.8rem, 16vw, 5rem);
  }

  .event-name {
    font-size: clamp(3rem, 13vw, 4rem);
  }

  .event-time,
  .event-date {
    font-size: 1.35rem;
  }

  .event-address {
    font-size: 1.05rem;
    width: 100%;
  }

  .denah-image,
  .maps-btn {
    width: 96%;
  }

  /* Di layar mobile, perkecil dekorasi background agar tidak menabrak teks acara */
  .deco {
    transform: translate(-50%, -50%) scale(0.65) !important;
    opacity: 0.55;
  }
}

@media (max-width: 385px) {
  .deco {
    transform: translate(-50%, -50%) scale(0.42) !important;
    opacity: 0.35;
  }
}

@media (max-width: 340px) {
  .deco {
    display: none;
  }
}
</style>
