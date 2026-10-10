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
  { key: 'dove', label: 'Dove', src: '/assets/svg/icon-01.svg', x: 5.3, y: 9.7, size: 6.75, scale: 1 },
  { key: 'sparkle-1', label: 'Sparkle 1', src: '/assets/svg/icon-03a.svg', x: 12.5, y: 40.8, size: 5, scale: 1 },
  { key: 'hearts-1', label: 'Hearts 1', src: '/assets/svg/icon-13a.svg', x: 55.1, y: 13.1, size: 3.5, scale: 1.4514 },
  { key: 'hearts-2', label: 'Hearts 2', src: '/assets/svg/icon-13b.svg', x: 24.2, y: 81.3, size: 3.5, scale: 1.5 },
  { key: 'sparkle-2', label: 'Sparkle 2', src: '/assets/svg/icon-03b.svg', x: 72.8, y: 15.4, size: 5, scale: 1 },
  { key: 'cake', label: 'Cake', src: '/assets/svg/icon-06.svg', x: 84.7, y: 37.6, size: 6.25, scale: 1.2496 },
  { key: 'champagne', label: 'Champagne', src: '/assets/svg/icon-12.svg', x: 4.7, y: 69.4, size: 6.25, scale: 1.6 },
  { key: 'envelope', label: 'Envelope', src: '/assets/svg/icon-02.svg', x: 65.4, y: 68.9, size: 6.25, scale: 1 },
  { key: 'hearts-3', label: 'Hearts 3', src: '/assets/svg/icon-03c.svg', x: 83.6, y: 82.7, size: 3.5, scale: 1.6486 },
])

const selectedKey = ref('cake')
const heroRef = ref(null)
const selectedDecoration = computed(() => decorations.value.find(({ key }) => key === selectedKey.value))
let dragState = null

const decorationStyle = (decoration) => ({
  left: `${decoration.x}%`,
  top: `${decoration.y}%`,
  right: 'auto',
  bottom: 'auto',
  width: `${decoration.size * decoration.scale}rem`,
  height: `${decoration.size * decoration.scale}rem`,
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
        <p class="hero-title-top">This Kids are</p>
        <h1 class="hero-title-bottom">Getting Married</h1>

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
  min-height: 90px;
  align-items: center;
  justify-content: center;
  background-color: #8c9b74;
}

.logo {
  display: block;
  width: 72px;
  height: auto;
  max-height: 82px;
  object-fit: contain;
}

.hero-section {
  position: relative;
  display: flex;
  min-height: calc(100svh - 90px);
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: var(--page-pad-y) var(--page-pad-x);
  background: url('/assets/page_1_cover.png') center / cover no-repeat;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: rgb(140 155 116 / 30%);
}

.hero-content {
  position: relative;
  z-index: 2;
  padding: 1rem;
  color: #fff;
  text-align: center;
  text-shadow: 1px 1px 4px rgb(0 0 0 / 30%);
}

.hero-title-top,
.hero-title-bottom {
  margin: 0;
  font-family: 'Allura', cursive;
  font-weight: 400;
}

.hero-title-top {
  font-size: clamp(3rem, 9vw, 8rem);
}

.hero-title-bottom {
  margin-top: 0.25rem;
  font-size: clamp(3.75rem, 10vw, 5.75rem);
  line-height: 1;
}

.guest-name {
  margin: 1rem 0 0;
  font-size: 0.9rem;
}

.guest-name span {
  font-weight: 700;
}

.invite-btn {
  margin-top: 2.25rem;
  border: 0;
  border-radius: 8px;
  background-color: #275236;
  padding: 0.75rem 2.5rem;
  color: #fff;
  cursor: pointer;
  font-family: 'Ephesis', cursive;
  font-weight: 400;
  font-size: clamp(1.75rem, 7vw, 40px);
  letter-spacing: 0.05em;
  line-height: 1.2;
  box-shadow: 0 4px 6px rgb(0 0 0 / 20%);
  animation: invite-glow 3.5s ease-in-out infinite;
  transition: background-color 0.3s, box-shadow 0.3s;
}

.invite-btn:hover {
  background-color: #1e3f29;
  box-shadow: 0 8px 18px rgb(0 0 0 / 28%);
}

@keyframes invite-glow {
  0%,
  100% {
    box-shadow: 0 4px 6px rgb(0 0 0 / 20%);
  }

  50% {
    box-shadow: 0 6px 20px rgb(255 255 255 / 28%);
  }
}

.decorative-icon {
  position: absolute;
  z-index: 1;
  width: 4.25rem;
  height: 4.25rem;
  object-fit: contain;
  opacity: 0.9;
  filter: drop-shadow(1px 1px 2px rgb(0 0 0 / 20%));
  animation: icon-float 5s ease-in-out infinite;
  will-change: transform, opacity;
}

.layout-mode .decorative-icon {
  z-index: 4;
  cursor: grab;
  animation: none;
  touch-action: none;
  user-select: none;
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
  --icon-rotation: -15deg;
  top: 9.7%;
  left: 5.3%;
  width: 6.75rem;
  height: 6.75rem;
  animation-delay: -1.2s;
}

.icon-sparkle-1 {
  top: 40.8%;
  left: 12.5%;
  width: 5rem;
  height: 5rem;
  animation: icon-twinkle 3.2s ease-in-out infinite;
  animation-delay: -0.8s;
}

.icon-hearts-1 {
  top: 13.1%;
  left: 55.1%;
  width: 5.08rem;
  height: 5.08rem;
  animation: icon-pulse 4s ease-in-out infinite;
  animation-delay: -1.5s;
}

.icon-hearts-2 {
  top: 81.3%;
  left: 24.2%;
  width: 5.25rem;
  height: 5.25rem;
  animation: icon-pulse 4.5s ease-in-out infinite;
  animation-delay: -2.2s;
}

.icon-sparkle-2 {
  top: 15.4%;
  left: 72.8%;
  right: auto;
  width: 5rem;
  height: 5rem;
  animation: icon-twinkle 3.5s ease-in-out infinite;
  animation-delay: -1.8s;
}

.icon-cake {
  top: 37.6%;
  left: 84.7%;
  right: auto;
  width: 7.81rem;
  height: 7.81rem;
  animation-delay: -2.6s;
}

.icon-champagne {
  top: 69.4%;
  left: 4.7%;
  width: 10rem;
  height: 10rem;
  animation-delay: -0.4s;
}

.icon-envelope {
  --icon-rotation: -10deg;
  top: 68.9%;
  left: 65.4%;
  right: auto;
  bottom: auto;
  width: 6.25rem;
  height: 6.25rem;
  animation-delay: -1.9s;
}

.icon-hearts-3 {
  top: 82.7%;
  left: 83.6%;
  right: auto;
  bottom: auto;
  width: 5.77rem;
  height: 5.77rem;
  animation: icon-pulse 4.2s ease-in-out infinite;
  animation-delay: -2.8s;
}

@keyframes icon-float {
  0%,
  100% {
    transform: translateY(0) rotate(var(--icon-rotation, 0deg));
  }

  50% {
    transform: translateY(-10px) rotate(var(--icon-rotation, 0deg));
  }
}

@keyframes icon-twinkle {
  0%,
  100% {
    opacity: 0.5;
    transform: scale(0.9) rotate(var(--icon-rotation, 0deg));
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
    transform: scale(1.12) rotate(var(--icon-rotation, 0deg));
  }
}

@media (prefers-reduced-motion: reduce) {
  .decorative-icon,
  .invite-btn {
    animation: none;
  }
}

@media (max-width: 640px) {
  .hero-section {
    min-height: calc(100svh - 90px);
  }

  .logo {
    width: 64px;
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
