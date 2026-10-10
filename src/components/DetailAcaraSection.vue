<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { wedding } from '../data/wedding'

const STORAGE_KEY = 'detail-acara-deco'
const isEdit =
  typeof window !== 'undefined' &&
  new URLSearchParams(window.location.search).get('edit') === '1'

// posisi default dari wedding.js, di-clone supaya bisa diubah
const decoDefaults = [
  ...wedding.detailAcara.decorations.map((d) => ({ ...d, group: 'acara' })),
  ...wedding.detailAcara.denahDecorations.map((d) => ({ ...d, group: 'denah' })),
]

const decoItems = ref(decoDefaults.map((d) => ({ ...d })))

// muat posisi tersimpan dari localStorage (kalau ada)
onMounted(() => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
    if (Array.isArray(saved) && saved.length === decoItems.value.length) {
      decoItems.value = decoItems.value.map((item, i) => ({ ...item, ...saved[i] }))
    }
  } catch {
    /* ignore */
  }
})

const save = () => {
  try {
    const data = decoItems.value.map(({ x, y, size, rotate }) => ({ x, y, size, rotate }))
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    /* ignore */
  }
}

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
  save()
}

// --- resize ---
let resizeState = null

const onResizeDown = (event, index) => {
  if (!isEdit) return
  resizeState = {
    index,
    startX: event.clientX,
    startSize: decoItems.value[index].size,
    pointerId: event.pointerId,
  }
  event.currentTarget.setPointerCapture(event.pointerId)
  event.stopPropagation()
  event.preventDefault()
}

const onResizeMove = (event) => {
  if (!resizeState || resizeState.pointerId !== event.pointerId) return
  const delta = event.clientX - resizeState.startX
  const next = Math.max(24, Math.min(400, Math.round(resizeState.startSize + delta)))
  decoItems.value[resizeState.index].size = next
}

const onResizeUp = (event) => {
  if (!resizeState || resizeState.pointerId !== event.pointerId) return
  resizeState = null
  save()
}

const resetDeco = () => {
  decoItems.value = decoDefaults.map((d) => ({ ...d }))
  save()
}

const copyJson = async () => {
  const acara = decoItems.value
    .filter((d) => d.group === 'acara')
    .map((d) => ({ src: d.src, x: d.x, y: d.y, size: d.size, rotate: d.rotate }))
  const denah = decoItems.value
    .filter((d) => d.group === 'denah')
    .map((d) => ({ src: d.src, x: d.x, y: d.y, size: d.size, rotate: d.rotate }))
  const json = JSON.stringify({ decorations: acara, denahDecorations: denah }, null, 2)
  try {
    await navigator.clipboard.writeText(json)
    alert('JSON posisi dekorasi sudah dicopy ke clipboard.')
  } catch {
    console.log(json)
    alert('Gagal akses clipboard — JSON ditampilkan di console.')
  }
}

onUnmounted(() => {
  dragState = null
  resizeState = null
})

const styleFor = (deco) => ({
  left: `${deco.x}%`,
  top: `${deco.y}%`,
  width: `${deco.size}px`,
  height: `${deco.size}px`,
  transform: `translate(-50%, -50%) rotate(${deco.rotate}deg)`,
})
</script>

<template>
  <section id="detail-acara" class="detail-acara-page">
    <div class="detail-acara-container">
      <div
        class="deco-layer"
        :class="{ 'deco-layer--edit': isEdit }"
        aria-hidden="true"
        @pointermove="isEdit ? onPointerMove($event) : null"
        @pointerup="isEdit ? onPointerUp($event) : null"
      >
        <template
          v-for="(deco, index) in decoItems"
          :key="`deco-${index}`"
        >
          <div v-if="deco.group === 'acara'" class="deco" :class="{ 'deco--edit': isEdit }" :style="styleFor(deco)">
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
        </template>
      </div>

      <h2 class="title" v-reveal="{ y: 18 }">{{ wedding.detailAcara.title }}</h2>

      <div class="polaroid-stage">
        <div
          v-for="(photo, index) in wedding.detailAcara.leftPhotos"
          :key="`left-${index}`"
          class="polaroid-card"
          :class="`left-${index + 1}`"
          v-reveal="{ delay: 120 + index * 80, scale: 0.94 }"
        >
          <img :src="photo" :alt="`Foto detail acara ${index + 1}`" class="photo-inner" loading="lazy" />
        </div>

           <img
             :src="wedding.detailAcara.image"
             alt="Detail acara"
             class="main-image"
             loading="lazy"
          v-reveal="{ delay: 160 }"
        />

        <div
          v-for="(photo, index) in wedding.detailAcara.rightPhotos"
          :key="`right-${index}`"
          class="polaroid-card"
          :class="`right-${index + 1}`"
          v-reveal="{ delay: 200 + index * 80, scale: 0.94 }"
        >
          <img :src="photo" :alt="`Foto detail acara ${index + 3}`" class="photo-inner" loading="lazy" />
        </div>
      </div>

      <div class="events-section">
        <div
          v-for="(event, index) in wedding.detailAcara.events"
          :key="event.name"
          class="event-col"
          v-reveal="{ delay: 120 + index * 100, y: 28 }"
        >
          <img :src="event.icon" :alt="event.name" class="event-icon" loading="lazy" />
          <h3 class="event-name">{{ event.name }}</h3>
          <p class="event-time">{{ event.time }}</p>
          <p class="event-date">{{ event.date }}</p>
          <p class="event-address">{{ event.address }}</p>
        </div>
      </div>

      <div class="denah-section">
        <div
          class="deco-layer"
          :class="{ 'deco-layer--edit': isEdit }"
          aria-hidden="true"
          @pointermove="isEdit ? onPointerMove($event) : null"
          @pointerup="isEdit ? onPointerUp($event) : null"
        >
          <template
            v-for="(deco, index) in decoItems"
            :key="`denah-deco-${index}`"
          >
            <div v-if="deco.group === 'denah'" class="deco" :class="{ 'deco--edit': isEdit }" :style="styleFor(deco)">
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
          </template>
        </div>

        <p class="denah-label" v-reveal="{ y: 16 }">{{ wedding.detailAcara.denahLabel }}</p>

        <img
          :src="wedding.detailAcara.denahImage"
          alt="Denah lokasi"
          class="denah-image"
          loading="lazy"
          v-reveal="{ delay: 80 }"
        />

        <a
          :href="wedding.detailAcara.mapsUrl"
          target="_blank"
          rel="noopener"
          class="maps-btn"
          v-reveal="{ delay: 160 }"
        >
          {{ wedding.detailAcara.mapsLabel }}
        </a>
      </div>

      <p class="closing-message" v-reveal="{ delay: 220 }">
        {{ wedding.detailAcara.closingMessage }}
      </p>
    </div>

    <div v-if="isEdit" class="deco-toolbar">
      <span class="deco-toolbar__hint">Mode Tata Letak — drag untuk pindah, tarik kotak untuk ukuran</span>
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
  max-width: none;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: clamp(2.5rem, 6vw, 4.5rem) clamp(1rem, 5vw, 4rem);
  color: #fff;
  text-align: center;
}

.deco-layer {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.deco {
  position: absolute;
  transform-origin: center center;
  opacity: 0.9;
}

.deco-img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  pointer-events: none;
}

/* mode edit: dekorasi bisa di-drag & di-resize */
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
  pointer-events: auto;
}

.deco-toolbar {
  position: fixed;
  z-index: 9999;
  left: 50%;
  bottom: 1.25rem;
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

.denah-section {
  position: relative;
  z-index: 2;
  width: 100%;
  padding: clamp(2rem, 5vw, 3rem) 0;
}

.title {
  position: relative;
  z-index: 2;
  margin: 0 0 clamp(2rem, 5vh, 3.5rem);
  font-family: 'Allura', cursive;
  font-size: clamp(3.5rem, 8vw, 5.25rem);
  font-weight: 400;
}

.polaroid-stage {
  position: relative;
  z-index: 2;
  width: min(100%, 1320px);
  margin: 0 auto clamp(2.5rem, 6vh, 4rem);
}

.main-image {
  display: block;
  width: min(52%, 420px);
  margin: 0 auto;
  object-fit: contain;
}

.polaroid-card {
  position: absolute;
  display: flex;
  box-sizing: border-box;
  width: clamp(150px, 16vw, 230px);
  aspect-ratio: 1 / 1.1;
  overflow: hidden;
  border-radius: 12px;
  background: #fff;
  padding: 12px 12px 26px;
  transition: translate 350ms ease, transform 350ms ease;
}

.polaroid-card:hover {
  translate: 0 -8px;
}

.polaroid-card .photo-inner {
  width: 100%;
  height: 100%;
  border-radius: 7px;
  object-fit: cover;
  transition: transform 600ms ease;
}

.polaroid-card:hover .photo-inner {
  transform: scale(1.05);
}

/* posisi: 2 card di kiri, 2 card di kanan */
.left-1 {
  top: -4%;
  left: 4%;
  z-index: 2;
  transform: rotate(-6deg);
}

.left-2 {
  bottom: -14%;
  left: 4%;
  z-index: 1;
  transform: rotate(6deg);
}

.right-1 {
  top: -18%;
  right: 4%;
  z-index: 2;
  transform: rotate(9deg);
}

.right-2 {
  bottom: -12%;
  right: 4%;
  z-index: 1;
  transform: rotate(-7deg);
}

.events-section {
  position: relative;
  z-index: 2;
  display: grid;
  width: min(100%, 1100px);
  grid-template-columns: repeat(2, 1fr);
  gap: clamp(1.5rem, 4vw, 3rem);
  margin: clamp(2.5rem, 6vh, 4rem) auto clamp(2.5rem, 6vh, 4rem);
}

.event-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  color: #fff;
}

.event-icon {
  width: clamp(150px, 17vw, 230px);
  height: clamp(150px, 17vw, 230px);
  object-fit: contain;
}

/* area ikon sama tinggi agar teks tiap kolom tetap sejajar */
.event-col:nth-child(2) .event-icon {
  width: clamp(100px, 11vw, 150px);
  height: clamp(150px, 17vw, 230px);
}

.event-name {
  margin: 0 0 0.75rem;
  font-family: 'Allura', cursive;
  font-size: clamp(2.25rem, 4.5vw, 3.25rem);
  font-weight: 400;
}

.event-time,
.event-date {
  margin: 0;
  font-size: clamp(1.05rem, 1.8vw, 1.35rem);
  line-height: 1.5;
}

.event-time {
  font-family: 'Marcellus', serif;
}

.event-date {
  font-family: 'Blossom', 'Montserrat', sans-serif;
}

.event-address {
  margin: 0.75rem 0 0;
  width: min(100%, 380px);
  font-family: 'Blossom', 'Montserrat', sans-serif;
  font-size: clamp(0.95rem, 1.45vw, 1.1rem);
  line-height: 1.5;
  opacity: 0.9;
}

.denah-label {
  margin: 0;
  font-family: 'Allura', cursive;
  font-size: clamp(3.5rem, 8vw, 5.25rem);
  font-weight: 400;
}

.denah-image {
  display: block;
  width: min(100%, 1200px);
  margin: 0 auto;
  object-fit: contain;
}

.maps-btn {
  display: block;
  box-sizing: border-box;
  width: min(100%, 600px);
  margin: clamp(1.5rem, 4vh, 2.5rem) auto clamp(0.75rem, 2vh, 1.25rem);
  border-radius: 6px;
  background: #476d4d;
  padding: 1rem 2rem;
  color: #fff;
  font-family: 'Blossom', 'Montserrat', sans-serif;
  font-size: clamp(1.15rem, 1.8vw, 1.5rem);
  font-weight: 600;
  text-align: center;
  text-decoration: none;
  transition: transform 300ms ease, opacity 300ms ease;
}

.maps-btn:hover {
  transform: translateY(-3px);
  opacity: 0.92;
}

.closing-message {
  position: relative;
  z-index: 2;
  margin: clamp(2rem, 5vh, 3.5rem) 0 0;
  width: min(100%, 620px);
  font-family: 'Blossom', 'Montserrat', sans-serif;
  font-size: clamp(1rem, 1.8vw, 1.35rem);
  line-height: 1.4;
  opacity: 0.95;
}

@media (max-width: 720px) {
  .polaroid-stage {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    margin-bottom: 2.5rem;
  }

  .main-image {
    grid-column: 1 / -1;
    order: -1;
    width: min(80%, 320px);
    margin-bottom: 1rem;
  }

  .polaroid-card {
    position: static;
    width: 100%;
    transform: none;
  }

  .events-section {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .deco-layer {
    display: none;
  }

  .deco-layer--edit {
    display: block;
  }
}

@media (hover: none) {
  .polaroid-card:hover {
    translate: 0 0;
  }

  .polaroid-card:hover .photo-inner {
    transform: none;
  }
}
</style>
