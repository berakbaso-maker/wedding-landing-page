<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { wedding } from '../data/wedding'

gsap.registerPlugin(ScrollTrigger)

const root = ref(null)
const topRightRef = ref(null)
const layoutMode = new URLSearchParams(window.location.search).get('layout') === 'gallery'
const selectedKey = ref('car')
const decorations = ref([
  { key: 'car', label: 'Car', src: '/assets/the-gallery/icon14-1-17.png', x: 68, y: 18, size: 11, rotate: 0 },
  { key: 'bouquet', label: 'Bouquet', src: '/assets/the-gallery/icon17-2-42.png', x: 10, y: 70, size: 8, rotate: -15 },
])
const selectedDecoration = computed(() => decorations.value.find(({ key }) => key === selectedKey.value))
let ctx = null
let dragState = null

onMounted(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const isDesktop = window.matchMedia('(hover: hover) and (min-width: 1024px)').matches
  if (reduce || !isDesktop || !root.value || layoutMode) return

  ctx = gsap.context(() => {
    gsap.to('.top-illustration', {
      yPercent: 8,
      ease: 'none',
      scrollTrigger: { trigger: root.value, start: 'top bottom', end: 'bottom top', scrub: 0.8 },
    })
    gsap.to('.d-car', {
      yPercent: 26,
      ease: 'none',
      scrollTrigger: { trigger: root.value, start: 'top bottom', end: 'bottom top', scrub: 1 },
    })
    gsap.to('.d-bouquet', {
      yPercent: -20,
      ease: 'none',
      scrollTrigger: { trigger: root.value, start: 'top bottom', end: 'bottom top', scrub: 1 },
    })
  }, root.value)
})

onUnmounted(() => ctx?.revert())

const decorationStyle = (decoration) => ({
  left: `${decoration.x}%`,
  top: `${decoration.y}%`,
  right: 'auto',
  bottom: 'auto',
  width: `${decoration.size}rem`,
  height: `${decoration.size}rem`,
  transform: `rotate(${decoration.rotate}deg)`,
})

const startDrag = (event, decoration) => {
  if (!layoutMode || !topRightRef.value) return
  event.preventDefault()
  selectedKey.value = decoration.key
  const bounds = topRightRef.value.getBoundingClientRect()
  dragState = { decoration, bounds, pointerId: event.pointerId }
  event.currentTarget.setPointerCapture(event.pointerId)
}

const dragDecoration = (event) => {
  if (!dragState || event.pointerId !== dragState.pointerId) return
  const { decoration, bounds } = dragState
  decoration.x = Math.max(-5, Math.min(105, ((event.clientX - bounds.left) / bounds.width) * 100))
  decoration.y = Math.max(0, Math.min(100, ((event.clientY - bounds.top) / bounds.height) * 100))
}

const stopDrag = () => {
  dragState = null
}

const copyLayout = async () => {
  const output = decorations.value.reduce((result, decoration) => {
    result[decoration.key] = {
      left: `${decoration.x.toFixed(1)}%`,
      top: `${decoration.y.toFixed(1)}%`,
      size: `${decoration.size.toFixed(2)}rem`,
      rotate: `${decoration.rotate}deg`,
    }
    return result
  }, {})
  await navigator.clipboard?.writeText(JSON.stringify(output, null, 2))
}
</script>

<template>
  <section id="gallery" ref="root" class="gallery-page gallery-intro-page">
    <div class="gallery-container intro-container">
      <div class="top-section">
        <div ref="topRightRef" class="top-right" :class="{ 'layout-mode': layoutMode }" @pointermove="dragDecoration" @pointerup="stopDrag" @pointercancel="stopDrag">
          <h2 class="title" v-reveal="{ y: 18 }">
            {{ wedding.galleryPage.title }}
          </h2>

          <img
            v-for="decoration in decorations"
            :key="decoration.key"
            :src="decoration.src"
            :alt="decoration.label"
            class="doodle"
            loading="lazy"
            :class="`d-${decoration.key}`"
            :style="layoutMode ? decorationStyle(decoration) : undefined"
            @pointerdown="startDrag($event, decoration)"
            @click="selectedKey = decoration.key"
          />

          <div class="polaroid-stack" v-reveal="{ delay: 150, scale: 0.94 }">
            <div class="polaroid-tilt p-1">
              <img
                src="/assets/gallery/secondiry_kiri.png"
                alt="Foto kenangan 1"
                class="photo-inner"
              />
            </div>
            <div class="polaroid-tilt p-2">
              <img
                src="/assets/gallery/secondory_kanan.png"
                alt="Foto kenangan 2"
                class="photo-inner"
              />
            </div>
          </div>

          <p class="subtitle" v-reveal="{ delay: 260 }">
            {{ wedding.galleryPage.message }}
          </p>

          <aside v-if="layoutMode" class="layout-toolbar" @pointerdown.stop>
            <strong>The Gallery editor</strong>
            <small>Drag ikon untuk memindahkan</small>
            <label>
              Ikon
              <select v-model="selectedKey">
                <option v-for="decoration in decorations" :key="decoration.key" :value="decoration.key">
                  {{ decoration.label }}
                </option>
              </select>
            </label>
            <label v-if="selectedDecoration">
              Size: {{ selectedDecoration.size.toFixed(2) }}rem
              <input v-model.number="selectedDecoration.size" type="range" min="2" max="12" step="0.05" />
            </label>
            <button type="button" @click="copyLayout">Copy layout JSON</button>
            <code v-if="selectedDecoration">left: {{ selectedDecoration.x.toFixed(1) }}%; top: {{ selectedDecoration.y.toFixed(1) }}%</code>
          </aside>
        </div>

        <div class="top-left">
          <img
            src="/assets/gallery/gallery_1_fix.png"
            alt="Foto pasangan"
            class="top-illustration"
            loading="lazy"
          />
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
  position: relative;
  display: flex;
  min-width: 0;
  width: 50%;
  height: 100%;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #7f8963;
}

.top-illustration {
  position: absolute;
  top: -8%;
  left: 0;
  width: 100%;
  height: 116%;
  object-fit: cover;
  object-position: center;
  display: block;
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
  top: clamp(1rem, 2vw, 1.5rem);
  left: 50%;
  z-index: 8;
  box-sizing: border-box;
  width: 96%;
  max-width: 96%;
  margin: 0;
  color: #fff;
  font-family: 'Allura', cursive;
  font-size: clamp(3.2rem, 6.5vw, 4.8rem);
  font-weight: 400;
  text-align: center;
  transform: translateX(-50%);
  white-space: normal;
}

.doodle {
  position: absolute;
  z-index: 1; /* Pastikan selalu berada di bawah kartu foto */
  width: 3rem;
  height: 3rem;
  object-fit: contain;
  opacity: 0.85;
}

.layout-mode .doodle {
  z-index: 10;
  cursor: grab;
  animation: none;
  touch-action: none;
  user-select: none;
}

.layout-mode .doodle:active {
  cursor: grabbing;
}

.layout-toolbar {
  position: absolute;
  z-index: 20;
  top: 1rem;
  right: 1rem;
  display: grid;
  width: min(230px, calc(100% - 2rem));
  gap: 0.5rem;
  border: 1px solid rgb(255 255 255 / 55%);
  border-radius: 10px;
  background: rgb(28 48 32 / 92%);
  padding: 0.8rem;
  color: #fff;
  font: 0.8rem/1.3 system-ui, sans-serif;
  text-align: left;
}

.layout-toolbar strong {
  font-size: 0.95rem;
}

.layout-toolbar small {
  color: rgb(255 255 255 / 75%);
}

.layout-toolbar label {
  display: grid;
  gap: 0.2rem;
}

.layout-toolbar select,
.layout-toolbar button {
  border: 0;
  border-radius: 5px;
  padding: 0.4rem;
  font: inherit;
}

.layout-toolbar button {
  background: #dbe7c9;
  color: #1c3020;
  cursor: pointer;
  font-weight: 700;
}

.layout-toolbar code {
  overflow-wrap: anywhere;
  color: #dbe7c9;
  font-size: 0.7rem;
}

.d-car {
  top: 18%;
  left: 66%;
  right: auto;
  z-index: 1;
  width: 11rem;
  height: 11rem;
}

.d-bouquet {
  top: 70%;
  left: 10%;
  bottom: auto;
  z-index: 1;
  width: 8rem;
  height: 8rem;
  transform: rotate(-15deg);
}

.polaroid-stack {
  position: absolute;
  top: 48%;
  left: 50%;
  z-index: 5; /* Gambar di atas ikon asset */
  width: clamp(310px, 45vw, 590px);
  max-width: 96%;
  height: clamp(240px, 37vw, 450px);
  transform: translate(-50%, -50%);
}

.polaroid-tilt {
  position: absolute;
  display: flex;
  box-sizing: border-box;
  width: clamp(215px, 22.5vw, 295px);
  aspect-ratio: 1 / 1.15;
  overflow: hidden;
  border-radius: 16px;
  background: #fff;
  padding: 16px 16px 36px;
  box-shadow: 8px 8px 0 rgb(0 0 0 / 30%);
  transition: translate 350ms ease;
  z-index: 6; /* Gambar di atas icon asset */
}

.polaroid-tilt:hover {
  translate: 0 -10px;
}

.polaroid-tilt .photo-inner {
  width: 100%;
  min-height: 0;
  flex: 1;
  border-radius: 10px;
  object-fit: cover;
  transition: transform 600ms ease;
}

.polaroid-tilt:hover .photo-inner {
  transform: scale(1.05);
}

.p-1 {
  top: 0;
  left: 3%;
  z-index: 6;
  margin-left: 0;
  transform: rotate(-8.5deg);
}

.p-2 {
  top: 27%;
  right: 3%;
  left: auto;
  z-index: 7;
  transform: rotate(12deg);
}

.subtitle {
  position: absolute;
  bottom: clamp(1.75rem, 3.5vw, 3.25rem);
  z-index: 8;
  width: min(92%, 520px);
  margin: 0;
  color: #fff;
  font-size: clamp(1.15rem, 1.8vw, 1.5rem);
  line-height: 1.5;
  text-align: center;
  opacity: 0.95;
}

/* On smaller screens, show the gallery message and polaroids first, followed
   by the couple illustration. */
@media (max-width: 900px) {
  .intro-container {
    height: auto;
  }

  .top-section {
    height: auto;
    flex-direction: column;
  }

  .top-right {
    order: 1;
    width: 100%;
    min-height: clamp(620px, 86svh, 780px);
    height: clamp(620px, 86svh, 780px);
    padding: 1.5rem 1rem 2rem;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .title {
    top: clamp(1rem, 3.5vw, 2.2rem);
    font-size: clamp(3.2rem, 11vw, 4.4rem);
  }

  .top-left {
    order: 2;
    width: 100%;
    height: auto;
    aspect-ratio: 1808 / 2212;
  }

  .top-illustration {
    position: relative;
    top: auto;
    left: auto;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }

  /* Mobile version: Car di kanan atas */
  .d-car {
    top: clamp(18%, 21vw, 24%);
    left: auto;
    right: clamp(5%, 7vw, 10%);
    width: clamp(6.5rem, 18vw, 8.5rem);
    height: clamp(6.5rem, 18vw, 8.5rem);
    transform: rotate(0deg);
  }

  /* Mobile version: Bouquet di kiri bawah */
  .d-bouquet {
    top: clamp(66%, 69vw, 73%);
    left: clamp(5%, 7vw, 10%);
    right: auto;
    bottom: auto;
    width: clamp(6rem, 17vw, 8rem);
    height: clamp(6rem, 17vw, 8rem);
    transform: rotate(-15deg);
  }

  .polaroid-stack {
    top: 48%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: min(94%, 480px);
    height: clamp(300px, 58vw, 380px);
  }

  .polaroid-tilt {
    width: clamp(185px, 42vw, 240px);
    height: auto;
    aspect-ratio: 1 / 1.15;
    border-radius: 16px;
    padding: clamp(12px, 2.4vw, 16px) clamp(12px, 2.4vw, 16px) clamp(28px, 5.5vw, 40px);
    box-shadow: 8px 10px 0 rgb(0 0 0 / 28%);
  }

  .p-1 {
    top: 0;
    left: 3%;
    transform: rotate(-7.5deg);
  }

  .p-2 {
    top: 30%;
    right: 3%;
    left: auto;
    margin-bottom: 0;
    transform: rotate(10.5deg);
  }

  .subtitle {
    bottom: clamp(1.75rem, 4vw, 3rem);
    width: min(88%, 460px);
    margin: 0 auto;
    font-size: clamp(1.1rem, 2.8vw, 1.35rem);
    line-height: 1.55;
    text-align: center;
  }
}

@media (max-width: 440px) {
  .top-right {
    min-height: clamp(580px, 88svh, 680px);
    height: clamp(580px, 88svh, 680px);
    padding: 1.25rem 0.75rem 1.75rem;
  }

  .title {
    top: 1rem;
    font-size: clamp(2.9rem, 12vw, 3.6rem);
  }

  .d-car {
    top: 19%;
    right: 5%;
    width: 6.2rem;
    height: 6.2rem;
  }

  .d-bouquet {
    top: 68%;
    left: 5%;
    width: 5.8rem;
    height: 5.8rem;
  }

  .polaroid-stack {
    top: 47%;
    width: 95%;
    height: 290px;
  }

  .polaroid-tilt {
    width: 175px;
    border-radius: 14px;
    padding: 11px 11px 28px;
    box-shadow: 7px 9px 0 rgb(0 0 0 / 28%);
  }

  .p-1 {
    top: 0;
    left: 2%;
    transform: rotate(-7deg);
  }

  .p-2 {
    top: 29%;
    right: 2%;
    transform: rotate(10deg);
  }

  .subtitle {
    bottom: 1.5rem;
    width: 90%;
    font-size: 1.05rem;
    line-height: 1.5;
  }
}

/* Penyesuaian khusus layar 375px kebawah agar ikon tidak menabrak kartu/teks */
@media (max-width: 385px) {
  .title {
    top: 0.75rem;
    font-size: 2.85rem;
  }

  .d-car {
    top: 15%;
    right: 3%;
    width: 3.8rem;
    height: 3.8rem;
    opacity: 0.7;
    z-index: 1;
  }

  .d-bouquet {
    top: 74%;
    left: 3%;
    width: 3.6rem;
    height: 3.6rem;
    opacity: 0.7;
    z-index: 1;
  }

  .polaroid-stack {
    top: 47%;
    width: 96%;
    height: 270px;
  }

  .polaroid-tilt {
    width: 154px;
    border-radius: 12px;
    padding: 9px 9px 24px;
    box-shadow: 5px 7px 0 rgb(0 0 0 / 26%);
  }

  .p-1 {
    top: 0;
    left: 1%;
    transform: rotate(-6deg);
  }

  .p-2 {
    top: 28%;
    right: 1%;
    transform: rotate(9deg);
  }

  .subtitle {
    bottom: 1.25rem;
    font-size: 0.92rem;
    line-height: 1.45;
  }
}

/* Jika layar sangat sempit (<= 340px), sembunyikan doodle agar konten utama tetap rapi */
@media (max-width: 340px) {
  .d-car,
  .d-bouquet {
    display: none;
  }
}
</style>
