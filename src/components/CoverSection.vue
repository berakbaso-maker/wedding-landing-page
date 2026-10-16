<script setup>
import { computed, ref } from 'vue'
import { wedding } from '../data/wedding'

const emit = defineEmits(['open'])

defineProps({
  guestName: { type: String, default: '' },
})

// Add ?layout=1 to the URL while developing to enable the decoration editor.
const layoutMode = new URLSearchParams(window.location.search).get('layout') === '1'

const decorations = ref([
  { key: 'dove', label: 'Dove', src: '/assets/svg/icon-01.svg', x: 6.0, y: 18.0, size: 7.2, scale: 1 },
  { key: 'sparkle-1', label: 'Sparkle 1', src: '/assets/svg/icon-03a.svg', x: 14.0, y: 50.0, size: 4.6, scale: 1 },
  { key: 'hearts-1', label: 'Hearts 1', src: '/assets/svg/icon-13a.svg', x: 49.0, y: 14.0, size: 4.8, scale: 1 },
  { key: 'sparkle-2', label: 'Sparkle 2', src: '/assets/svg/icon-03b.svg', x: 76.0, y: 17.0, size: 4.8, scale: 1 },
  { key: 'cake', label: 'Cake', src: '/assets/svg/icon-06.svg', x: 83.0, y: 45.0, size: 7.6, scale: 1 },
  { key: 'champagne', label: 'Champagne', src: '/assets/svg/icon-12.svg', x: 8.0, y: 68.0, size: 9.6, scale: 1 },
  { key: 'hearts-2', label: 'Hearts 2', src: '/assets/svg/icon-13b.svg', x: 26.0, y: 78.0, size: 4.5, scale: 1 },
  { key: 'envelope', label: 'Envelope', src: '/assets/svg/icon-02.svg', x: 68.0, y: 74.0, size: 7.0, scale: 1 },
  { key: 'hearts-3', label: 'Hearts 3', src: '/assets/svg/icon-03c.svg', x: 86.0, y: 78.0, size: 4.5, scale: 1 },
])

const selectedKey = ref('cake')
const heroRef = ref(null)
const selectedDecoration = computed(() => decorations.value.find(({ key }) => key === selectedKey.value))
let dragState = null

const titleParts = computed(() => {
  if (wedding.cover?.titleTop && wedding.cover?.titleBottom) {
    return { top: wedding.cover.titleTop, bottom: wedding.cover.titleBottom }
  }
  const title = wedding.cover?.title || 'The Wedding of Ibnu & Dea'
  const words = title.split(' ')
  if (words.length <= 2) return { top: words[0] || '', bottom: words[1] || '' }
  return {
    top: words.slice(0, -2).join(' '),
    bottom: words.slice(-2).join(' '),
  }
})

const decorationStyle = (decoration) => ({
  left: `${decoration.x}%`,
  top: `${decoration.y}%`,
  right: 'auto',
  bottom: 'auto',
  width: `${(decoration.size * decoration.scale).toFixed(2)}rem`,
  height: `${(decoration.size * decoration.scale).toFixed(2)}rem`,
})

const selectDecoration = (decoration) => {
  selectedKey.value = decoration.key
}

const startDrag = (event, decoration) => {
  if (!layoutMode || !heroRef.value) return
  event.preventDefault()
  selectDecoration(decoration)
  const bounds = heroRef.value.getBoundingClientRect()
  dragState = { decoration, bounds, pointerId: event.pointerId }
  event.currentTarget.setPointerCapture(event.pointerId)
}

const dragDecoration = (event) => {
  if (!dragState || event.pointerId !== dragState.pointerId) return
  const { decoration, bounds } = dragState
  decoration.x = Math.max(0, Math.min(100, ((event.clientX - bounds.left) / bounds.width) * 100))
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
      size: `${(decoration.size * decoration.scale).toFixed(2)}rem`,
    }
    return result
  }, {})
  await navigator.clipboard?.writeText(JSON.stringify(output, null, 2))
}
</script>

<template>
  <section class="invitation-container">
    <header class="top-bar">
      <img src="/assets/logo-fix.png" alt="Wedding logo" class="logo" />
    </header>

    <main ref="heroRef" class="hero-section" :class="{ 'layout-mode': layoutMode }" @pointermove="dragDecoration" @pointerup="stopDrag" @pointercancel="stopDrag">
      <img
        v-for="decoration in decorations"
        :key="decoration.key"
        :src="decoration.src"
        :alt="decoration.label"
        class="decorative-icon"
        :class="`icon-${decoration.key}`"
        :style="layoutMode ? decorationStyle(decoration) : undefined"
        @pointerdown="startDrag($event, decoration)"
        @click="selectDecoration(decoration)"
      />

      <div class="hero-overlay"></div>

      <div class="hero-content">
        <p class="hero-title-top">{{ titleParts.top }}</p>
        <h1 class="hero-title-bottom">{{ titleParts.bottom }}</h1>

        <p v-if="guestName" class="guest-name">
          Kepada: <span>{{ guestName }}</span>
        </p>

        <button
          type="button"
          class="invite-btn"
          @click="emit('open')"
        >
          {{ wedding.cover.subtitle }}
        </button>
      </div>

      <aside v-if="layoutMode" class="layout-toolbar" @pointerdown.stop>
        <strong>Layout editor</strong>
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
          Scale: {{ selectedDecoration.scale.toFixed(2) }}x
          <input v-model.number="selectedDecoration.scale" type="range" min="0.4" max="2.5" step="0.05" />
        </label>
        <button type="button" @click="copyLayout">Copy layout JSON</button>
        <code v-if="selectedDecoration">left: {{ selectedDecoration.x.toFixed(1) }}%; top: {{ selectedDecoration.y.toFixed(1) }}%</code>
      </aside>

    </main>
  </section>
</template>

<style scoped>
.invitation-container {
  width: 100%;
  margin: 0 auto;
  overflow: hidden;
  background-color: #fff;
  box-shadow: 0 12px 24px rgb(0 0 0 / 18%);
}

.top-bar {
  display: flex;
  height: 96px;
  min-height: 96px;
  align-items: center;
  justify-content: center;
  background-color: #7f8963;
}

.logo {
  display: block;
  height: 68px;
  width: auto;
  max-height: 74px;
  object-fit: contain;
}

.hero-section {
  position: relative;
  display: flex;
  min-height: calc(100svh - 96px);
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: var(--page-pad-y) var(--page-pad-x);
  background: url('/assets/page_1_cover.png') center center / cover no-repeat;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: rgb(95 110 75 / 36%);
}

.hero-content {
  position: relative;
  z-index: 2;
  padding: 1rem;
  color: #fff;
  text-align: center;
  margin-top: clamp(-3.5rem, -5vh, -2rem);
}

.hero-title-top {
  margin: 0;
  font-family: 'Allura', cursive;
  font-weight: 400;
  font-size: clamp(4.8rem, 11vw, 8rem);
  line-height: 1.02;
  text-shadow: 0 2px 14px rgb(0 0 0 / 38%);
}

.hero-title-bottom {
  margin: 0.15rem 0 0;
  font-family: 'Allura', cursive;
  font-weight: 400;
  font-size: clamp(5.8rem, 13.5vw, 10rem);
  line-height: 1.02;
  text-shadow: 0 2px 14px rgb(0 0 0 / 38%);
}

.guest-name {
  margin: 1rem 0 0;
  font-size: 0.9rem;
}

.guest-name span {
  font-weight: 700;
}

.invite-btn {
  margin-top: clamp(2.8rem, 5.5vh, 4.5rem);
  border: 0;
  border-radius: 8px;
  background-color: #244228;
  padding: 0.75rem 2.8rem;
  color: #fff;
  cursor: pointer;
  font-family: 'Allura', cursive !important;
  font-weight: 400;
  font-size: clamp(2rem, 4.5vw, 2.75rem);
  letter-spacing: 0.02em;
  line-height: 1.2;
  box-shadow: 0 5px 16px rgb(0 0 0 / 25%);
  transition: background-color 0.3s, transform 0.2s, box-shadow 0.3s;
}

.invite-btn:hover {
  background-color: #1a331d;
  transform: translateY(-2px);
  box-shadow: 0 8px 22px rgb(0 0 0 / 35%);
}

.decorative-icon {
  position: absolute;
  z-index: 1;
  object-fit: contain;
  opacity: 0.95;
  filter: drop-shadow(1px 2px 4px rgb(0 0 0 / 22%));
  animation: icon-float 5s ease-in-out infinite;
  will-change: transform, opacity;
  pointer-events: none;
}

.layout-mode .decorative-icon {
  z-index: 4;
  cursor: grab;
  animation: none;
  touch-action: none;
  user-select: none;
  pointer-events: auto;
}

.layout-mode .decorative-icon:active {
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
  box-shadow: 0 4px 16px rgb(0 0 0 / 25%);
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

.icon-dove {
  --icon-rotation: -12deg;
  top: 18%;
  left: 6%;
  width: 7.2rem;
  height: 7.2rem;
  animation-delay: -1.2s;
}

.icon-sparkle-1 {
  top: 50%;
  left: 14%;
  width: 4.6rem;
  height: 4.6rem;
  animation: icon-twinkle 3.2s ease-in-out infinite;
  animation-delay: -0.8s;
}

.icon-hearts-1 {
  --icon-rotation: 4deg;
  top: 14%;
  left: 49%;
  width: 4.8rem;
  height: 4.8rem;
  animation: icon-pulse 4s ease-in-out infinite;
  animation-delay: -1.5s;
}

.icon-sparkle-2 {
  top: 17%;
  left: 76%;
  width: 4.8rem;
  height: 4.8rem;
  animation: icon-twinkle 3.5s ease-in-out infinite;
  animation-delay: -1.8s;
}

.icon-cake {
  top: 45%;
  left: 83%;
  width: 7.6rem;
  height: 7.6rem;
  animation-delay: -2.6s;
}

.icon-champagne {
  top: 68%;
  left: 8%;
  width: 9.6rem;
  height: 9.6rem;
  animation-delay: -0.4s;
}

.icon-hearts-2 {
  --icon-rotation: -4deg;
  top: 78%;
  left: 26%;
  width: 4.5rem;
  height: 4.5rem;
  animation: icon-pulse 4.5s ease-in-out infinite;
  animation-delay: -2.2s;
}

.icon-envelope {
  --icon-rotation: -12deg;
  top: 74%;
  left: 68%;
  width: 7rem;
  height: 7rem;
  animation-delay: -1.9s;
}

.icon-hearts-3 {
  top: 78%;
  left: 86%;
  width: 4.5rem;
  height: 4.5rem;
  animation: icon-pulse 4.2s ease-in-out infinite;
  animation-delay: -2.8s;
}

@keyframes icon-float {
  0%,
  100% {
    transform: translateY(0) rotate(var(--icon-rotation, 0deg));
  }

  50% {
    transform: translateY(-8px) rotate(var(--icon-rotation, 0deg));
  }
}

@keyframes icon-twinkle {
  0%,
  100% {
    opacity: 0.6;
    transform: scale(0.92) rotate(var(--icon-rotation, 0deg));
  }

  50% {
    opacity: 1;
    transform: scale(1.08) rotate(var(--icon-rotation, 0deg));
  }
}

@keyframes icon-pulse {
  0%,
  100% {
    transform: scale(1) rotate(var(--icon-rotation, 0deg));
  }

  50% {
    transform: scale(1.1) rotate(var(--icon-rotation, 0deg));
  }
}

@media (prefers-reduced-motion: reduce) {
  .decorative-icon,
  .invite-btn {
    animation: none;
  }
}

/* Responsive Tablet & Mobile */
@media (max-width: 900px) {
  /* Kurangi jumlah ikon: sembunyikan ikon bagian tengah/dalam yang menabrak teks */
  .icon-hearts-1,
  .icon-sparkle-1,
  .icon-sparkle-2,
  .icon-hearts-2,
  .icon-envelope {
    display: none;
  }

  /* Sisakan 4 ikon di 4 sudut luar dengan ukuran yang ramping */
  .icon-dove {
    top: 10%;
    left: 6%;
    width: 4rem;
    height: 4rem;
    opacity: 0.75;
  }

  .icon-cake {
    top: 12%;
    left: auto;
    right: 6%;
    width: 4rem;
    height: 4rem;
    opacity: 0.75;
  }

  .icon-champagne {
    top: auto;
    bottom: 8%;
    left: 6%;
    width: 4.8rem;
    height: 4.8rem;
    opacity: 0.75;
  }

  .icon-hearts-3 {
    top: auto;
    bottom: 8%;
    left: auto;
    right: 6%;
    width: 3rem;
    height: 3rem;
    opacity: 0.75;
  }
}

@media (max-width: 640px) {
  .hero-section {
    min-height: calc(100svh - 80px);
    background-image: url('/assets/main_cover_vertical.png');
    background-position: center center;
    background-size: cover;
  }

  .top-bar {
    height: 80px;
    min-height: 80px;
  }

  .logo {
    height: 54px;
  }

  .hero-content {
    margin-top: -2rem;
  }

  .hero-title-top {
    font-size: clamp(3.6rem, 15vw, 5rem);
  }

  .hero-title-bottom {
    font-size: clamp(4.4rem, 18vw, 6.4rem);
  }

  .invite-btn {
    margin-top: 2.4rem;
    font-size: 2.1rem;
    padding: 0.65rem 2.4rem;
  }

  /* Ukuran ikon di mobile dibuat lebih kecil agar aman dari teks */
  .icon-dove {
    top: 8%;
    left: 5%;
    width: 3.2rem;
    height: 3.2rem;
    opacity: 0.7;
  }

  .icon-cake {
    top: 10%;
    right: 5%;
    width: 3.2rem;
    height: 3.2rem;
    opacity: 0.7;
  }

  .icon-champagne {
    bottom: 6%;
    left: 5%;
    width: 3.8rem;
    height: 3.8rem;
    opacity: 0.7;
  }

  .icon-hearts-3 {
    bottom: 6%;
    right: 5%;
    width: 2.5rem;
    height: 2.5rem;
    opacity: 0.7;
  }
}

/* Penyesuaian khusus layar kecil (<= 385px seperti iPhone 375px) */
@media (max-width: 385px) {
  .icon-dove {
    top: 6%;
    left: 4%;
    width: 2.6rem;
    height: 2.6rem;
    opacity: 0.6;
  }

  .icon-cake {
    top: 8%;
    right: 4%;
    width: 2.6rem;
    height: 2.6rem;
    opacity: 0.6;
  }

  .icon-champagne {
    bottom: 5%;
    left: 4%;
    width: 3.2rem;
    height: 3.2rem;
    opacity: 0.6;
  }

  .icon-hearts-3 {
    bottom: 5%;
    right: 4%;
    width: 2.2rem;
    height: 2.2rem;
    opacity: 0.6;
  }
}

/* Jika layar sangat sempit (<= 340px), sembunyikan semua ikon dekorasi */
@media (max-width: 340px) {
  .decorative-icon {
    display: none;
  }
}

/* Portrait/tablet cover uses the vertical artwork so the subject stays visible. */
@media (orientation: portrait) and (min-width: 641px) {
  .hero-section {
    background-image: url('/assets/main_cover_vertical.png');
    background-position: center center;
  }
}
</style>
