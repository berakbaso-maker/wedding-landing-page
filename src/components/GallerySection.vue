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
  { key: 'car', label: 'Car', src: '/assets/the-gallery/icon17-2-42.png', x: 64.7, y: 19.4, size: 10.9, rotate: 0 },
  { key: 'bouquet', label: 'Bouquet', src: '/assets/the-gallery/icon14-1-17.png', x: 11.3, y: 71.4, size: 7.45, rotate: -15 },
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
        <div class="top-left">
          <img
            src="/assets/gallery/gallery_1_fix.png"
            alt="Foto pasangan"
            class="top-illustration"
            loading="lazy"
          />
        </div>

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
            Together with our families, we invite you to share in our wedding.
            Your presence is the greatest gift.
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
  box-sizing: border-box;
  width: 96%;
  max-width: 96%;
  margin: 0;
  color: #fff;
  font-family: 'Allura', cursive;
  font-size: clamp(3.25rem, 7vw, 4.75rem);
  font-weight: 400;
  text-align: center;
  transform: translateX(-50%);
  white-space: normal;
}

.doodle {
  position: absolute;
  z-index: 1;
  width: 3rem;
  height: 3rem;
  object-fit: contain;
  opacity: 0.85;
}

.layout-mode .doodle {
  z-index: 4;
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
  z-index: 10;
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
  top: 19.4%;
  left: 64.7%;
  right: auto;
  width: 10.9rem;
  height: 10.9rem;
}

.d-bouquet {
  top: 71.4%;
  left: 11.3%;
  bottom: auto;
  width: 7.45rem;
  height: 7.45rem;
  transform: rotate(-15deg);
}

.polaroid-stack {
  position: absolute;
  top: 54%;
  left: 50%;
  width: clamp(280px, 46vw, 660px);
  max-width: 96%;
  height: clamp(240px, 40vw, 530px);
  transform: translate(-50%, -50%);
}

.polaroid-tilt {
  position: absolute;
  display: flex;
  box-sizing: border-box;
  width: clamp(245px, 25vw, 320px);
  aspect-ratio: 1 / 1.15;
  overflow: hidden;
  border-radius: 18px;
  background: #fff;
  padding: 16px 16px 34px;
  box-shadow: 10px 10px 0 rgb(0 0 0 / 35%);
  transition: translate 350ms ease;
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
  left: 2%;
  z-index: 1;
  margin-left: 0;
  transform: rotate(-9deg);
}

.p-2 {
  top: 30%;
  right: 2%;
  left: auto;
  z-index: 2;
  transform: rotate(13deg);
}

.subtitle {
  position: absolute;
  bottom: clamp(1rem, 2vw, 1.5rem);
  width: min(90%, 600px);
  margin: 0;
  color: #fff;
  font-size: clamp(1.05rem, 1.7vw, 1.35rem);
  line-height: 1.5;
  text-align: center;
  opacity: 0.9;
}

@media (max-width: 900px) {
  .title {
    font-size: clamp(2.5rem, 8vw, 3.25rem);
  }

  .polaroid-tilt {
    width: clamp(245px, 30vw, 320px);
  }
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
    border-radius: 12px;
    padding: 8px 8px 20px;
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
    font-size: 1rem;
  }
}

/* On smaller screens, show the gallery message and polaroids first, followed
   by the couple illustration. This keeps the visual flow readable without
   changing the desktop two-column composition. */
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
    min-height: clamp(620px, 82svh, 800px);
    height: clamp(620px, 82svh, 800px);
    padding: 1rem 1rem 1.5rem;
  }

  .title {
    font-size: clamp(3.15rem, 10vw, 4.1rem);
  }

  .top-left {
    order: 2;
    width: 100%;
    height: auto;
    aspect-ratio: 1808 / 2212;
  }

  .top-illustration {
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: center;
  }

  .d-bouquet {
    top: 64%;
  }

  .polaroid-stack {
    top: 50%;
    width: min(92%, 520px);
    height: clamp(340px, 58vw, 420px);
  }

  .polaroid-tilt {
    width: clamp(155px, 36vw, 245px);
    height: auto;
    aspect-ratio: 1 / 1.15;
    padding: clamp(8px, 1.5vw, 14px) clamp(8px, 1.5vw, 14px) clamp(20px, 3vw, 30px);
  }

  .p-1 {
    top: 0;
    left: 5%;
  }

  .p-2 {
    top: 44%;
    right: 5%;
    margin-bottom: 1.25rem;
  }

  .subtitle {
    bottom: 3rem;
    width: min(92%, 680px);
    margin-bottom: 0.5rem;
    font-size: clamp(1.2rem, 2.8vw, 1.6rem);
    line-height: 1.45;
  }
}

@media (min-width: 375px) and (max-width: 547px) {
  .d-car,
  .d-bouquet {
    width: 7.45rem;
    height: 7.45rem;
  }

  .polaroid-tilt {
    width: 165px;
    height: 195px;
    padding: 11px 11px 27px;
    box-shadow: 10px 10px 0 rgb(0 0 0 / 35%);
  }

  .p-2 {
    top: 34%;
  }
}

@media (max-width: 681px) {
  .subtitle {
    margin-top: 1rem;
    bottom: 1.5rem;
  }
}
</style>
