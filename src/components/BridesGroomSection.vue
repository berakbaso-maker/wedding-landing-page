<script setup>
import { computed, ref } from 'vue'
import { wedding } from '../data/wedding'

const { groom, bride, logo, quote, quoteSource } = wedding.bridesGroom

const people = [
  { role: 'Groom', ...groom },
  { role: 'Bride', ...bride },
]

const personIllustration = '/assets/brides-groom/ilus_person_1-1-11.png'

// Add ?layout=brides-groom while developing to position these decorations.
const layoutMode = new URLSearchParams(window.location.search).get('layout') === 'brides-groom'
const containerRef = ref(null)
const selectedKey = ref('doodle-8')
const decorations = ref(wedding.bridesGroom.decorations.map((src, index) => ({
  key: `doodle-${index + 1}`,
  label: `Doodle ${index + 1}`,
  src,
  x: [-5, 98.2, 99.5, 1.3, 90.2, 43.6, 99.4, -5, -5, 97.6, -5, -5][index],
  y: [1.1, 5.8, 64.7, 91, 53.5, 90.4, 36, 18.9, 51.1, 86.8, 39.4, 70][index],
  size: [9.05, 9.2, 9.25, 7.65, 5, 8.95, 7.85, 8.1, 6.65, 7.95, 7.6, 5][index],
})))

const selectedDecoration = computed(() => decorations.value.find(({ key }) => key === selectedKey.value))
let dragState = null

const decorationStyle = (decoration) => ({
  left: `${decoration.x}%`,
  top: `${decoration.y}%`,
  right: 'auto',
  bottom: 'auto',
  width: `${decoration.size}rem`,
  height: `${decoration.size}rem`,
})

const startDrag = (event, decoration) => {
  if (!layoutMode || !containerRef.value) return
  event.preventDefault()
  selectedKey.value = decoration.key
  const bounds = containerRef.value.getBoundingClientRect()
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
    }
    return result
  }, {})
  await navigator.clipboard?.writeText(JSON.stringify(output, null, 2))
}
</script>

<template>
  <section id="brides-groom" class="brides-groom-page">
    <div ref="containerRef" class="brides-groom-container" :class="{ 'layout-mode': layoutMode }" @pointermove="dragDecoration" @pointerup="stopDrag" @pointercancel="stopDrag">
      <img
        v-for="decoration in decorations"
        :key="decoration.key"
        :src="decoration.src"
        alt=""
        class="doodle"
        loading="lazy"
        :class="decoration.key"
        :style="layoutMode ? decorationStyle(decoration) : undefined"
        @pointerdown="startDrag($event, decoration)"
        @click="selectedKey = decoration.key"
      />

      <div class="profiles-section">
        <div class="intro-card" v-reveal="{ y: 18 }">
          <div class="intro-grid">
            <div class="intro-left">
              <img :src="personIllustration" alt="" class="intro-person" loading="lazy" />
            </div>

            <div class="intro-right">
              <img :src="logo" alt="Logo" class="intro-monogram" loading="lazy" />
              <p class="intro-quote">{{ quote }}</p>
              <p class="intro-source">{{ quoteSource }}</p>
            </div>
          </div>
        </div>

        <h2 class="section-title" v-reveal="{ y: 18 }">
          Brides &amp; Groom
        </h2>

        <div class="profiles-wrapper">
          <div
            v-for="(person, index) in people"
            :key="person.role"
            class="profile-card-wrapper"
            v-reveal="{ delay: index * 160, y: 34 }"
          >
            <img :src="person.frame" alt="" class="profile-frame" aria-hidden="true" />

            <article class="profile-card">
              <div class="photo-container">
                <img
                  :src="person.image"
                  :alt="`${person.role} - ${person.name}`"
                  class="profile-photo"
                  :class="`photo-${person.role.toLowerCase()}`"
                  loading="lazy"
                />
               </div>
               <h3 class="profile-name">{{ person.name }}</h3>
               <p class="profile-parents">{{ person.parents }}</p>
             </article>
          </div>
        </div>

        <aside v-if="layoutMode" class="layout-toolbar" @pointerdown.stop>
          <strong>Brides &amp; Groom editor</strong>
          <small>Drag doodle untuk memindahkan</small>
          <label>
            Doodle
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
  </section>
</template>

<style scoped>
.brides-groom-page {
  position: relative;
  display: flex;
  min-height: 100svh;
  width: 100%;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #7f8963;
  padding: clamp(1.5rem, 4vh, 3rem) 0;
  font-family: 'Blossom', 'Marcellus', serif;
}

.brides-groom-container {
  position: relative;
  width: min(100%, 1200px);
  margin: 0 auto;
  padding: clamp(1rem, 2.5vh, 2rem) clamp(1rem, 4vw, 2.5rem);
}

.profiles-section {
  position: relative;
  z-index: 2;
  padding: clamp(1rem, 3vh, 2rem) 0 clamp(0.5rem, 1.5vh, 1rem);
  text-align: center;
}

.section-title {
  margin: clamp(5.5rem, 13vh, 9.5rem) 0 clamp(0.5rem, 1.5vh, 1.25rem);
  color: #fff;
  font-family: 'Allura', cursive;
  font-size: clamp(3.75rem, 8.5vw, 5.85rem);
  font-weight: 400;
  text-shadow: 1px 1px 3px rgb(0 0 0 / 20%);
}

.intro-card {
  position: relative;
  z-index: 2;
  box-sizing: border-box;
  width: min(100%, 1120px);
  margin: clamp(1rem, 3vh, 1.75rem) auto;
  border: 1px solid rgb(232 225 211 / 80%);
  border-radius: 24px;
  background: #faf6ed;
  padding: clamp(1.75rem, 3.5vw, 3rem);
  box-shadow: 0 20px 40px -15px rgb(44 68 43 / 12%), 0 0 15px rgb(0 0 0 / 3%);
}

.intro-grid {
  display: grid;
  grid-template-columns: 1fr;
  align-items: center;
  gap: clamp(1.5rem, 3.5vw, 3rem);
}

.intro-left {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(0.75rem, 2vh, 1.25rem);
  text-align: center;
}

.intro-person {
  display: block;
  width: min(100%, 460px);
  aspect-ratio: 1 / 1;
  height: auto;
  object-fit: cover;
  object-position: center;
  margin: 0 auto;
  border-radius: 12px;
}

.intro-right {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(0.75rem, 2vh, 1.25rem);
}

.intro-monogram {
  display: block;
  width: clamp(150px, 18vw, 220px);
  height: auto;
  aspect-ratio: 1 / 1;
  object-fit: contain;
  margin: 0 0 clamp(1.25rem, 3vh, 2rem);
}

.intro-quote {
  margin: 0;
  color: #2c442b;
  font-family: 'Blossom', 'Marcellus', serif;
  font-size: clamp(1.05rem, 2.4vw, 1.3rem);
  line-height: 1.75;
  text-align: justify;
}

.intro-source {
  margin: 0;
  color: #2c442b;
  font-family: 'Blossom', 'Marcellus', serif;
  font-size: clamp(1.05rem, 2.2vw, 1.3rem);
  font-weight: 600;
  letter-spacing: 0.02em;
}

@media (min-width: 768px) {
  .intro-grid {
    grid-template-columns: 1fr 1.15fr;
  }

  .intro-right {
    align-items: flex-start;
    text-align: left;
  }

  .intro-monogram {
    align-self: center;
    margin-left: auto;
    margin-right: auto;
  }
}

.profiles-wrapper {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  width: 100%;
  margin-top: 0;
  align-items: stretch;
  justify-content: center;
  gap: clamp(0.5rem, 2vw, 1.875rem);
}

.profile-card-wrapper {
  position: relative;
  z-index: 2;
  box-sizing: border-box;
  flex: 1 1 0;
  max-width: 550px;
  min-width: 0;
  margin: 0;
  padding: clamp(28px, 4.8vw, 55px) clamp(16px, 3.8vw, 42px);
  isolation: isolate;
  display: flex;
}

.profile-card {
  position: relative;
  z-index: 1;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  margin: 0;
  border: 0;
  border-radius: 10px;
  background: #fff;
  padding: clamp(10px, 1.6vw, 16px) clamp(10px, 1.8vw, 18px) clamp(12px, 2vw, 22px);
  box-shadow: 0 10px 20px rgb(0 0 0 / 20%);
  display: flex;
  flex-direction: column;
}

.photo-container {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  aspect-ratio: 4 / 5;
  margin-bottom: 15px;
  overflow: hidden;
  border-radius: 5px;
  background: #fff;
}

.profile-photo {
  z-index: 1;
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(2.4);
  transform-origin: 50% 51%;
}

.profile-photo.photo-groom {
  transform: scale(2.4);
  transform-origin: 50% 51%;
}

.profile-photo.photo-bride {
  transform: scale(2.4);
  transform-origin: 53% 51%;
}

.profile-name,
.profile-parents {
  position: relative;
  z-index: 2;
}

.profile-frame {
  position: absolute;
  z-index: 2;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: fill;
  pointer-events: none;
}

.profile-card-wrapper .profile-frame {
  transform: scale(1.14, 1.05);
  transform-origin: center;
}

.profile-name {
  margin: 0 0 clamp(6px, 1.2vh, 10px);
  color: #1e331b;
  font-size: clamp(1.45rem, 2.2vw, 2.65rem);
  font-weight: 600;
  letter-spacing: 0.03em;
  line-height: 1.25;
}

.profile-parents {
  min-height: 3.2em;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 8px;
  color: #1f301d;
  font-size: clamp(1.2rem, 1.8vw, 1.65rem);
  font-weight: 550;
  line-height: 1.6;
  letter-spacing: 0.025em;
  white-space: pre-line;
}

.doodle {
  position: absolute;
  z-index: 1;
  width: clamp(4rem, 5vw, 5rem);
  height: clamp(4rem, 5vw, 5rem);
  object-fit: contain;
  opacity: 0.92;
  animation: bride-doodle-float 5s ease-in-out infinite;
  will-change: transform, opacity;
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
  position: fixed;
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

.doodle-1 { top: 1.1%; left: -5%; width: 9.05rem; height: 9.05rem; animation-delay: -0.6s; }
.doodle-2 { top: 5.8%; left: 98.2%; width: 9.2rem; height: 9.2rem; animation: bride-doodle-pulse 4.2s ease-in-out infinite; animation-delay: -1.4s; }
.doodle-3 { top: 64.7%; left: 99.5%; width: 9.25rem; height: 9.25rem; animation-delay: -2.3s; }
.doodle-4 { top: 91%; left: 1.3%; width: 7.65rem; height: 7.65rem; animation: bride-doodle-twinkle 3.4s ease-in-out infinite; animation-delay: -0.9s; }
.doodle-5 { top: 53.5%; left: 90.2%; animation: bride-doodle-twinkle 3.6s ease-in-out infinite; animation-delay: -2.1s; }
.doodle-6 { top: 90.4%; left: 43.6%; width: 8.95rem; height: 8.95rem; animation: bride-doodle-pulse 4.4s ease-in-out infinite; animation-delay: -3s; }
.doodle-7 { top: 36%; left: 99.4%; right: auto; width: 7.85rem; height: 7.85rem; animation-delay: -1.8s; }
.doodle-8 { top: 18.9%; left: -5%; right: auto; width: 8.1rem; height: 8.1rem; animation: bride-doodle-pulse 4s ease-in-out infinite; animation-delay: -2.6s; }
.doodle-9 { top: 51.1%; left: -5%; right: auto; width: 6.65rem; height: 6.65rem; animation-delay: -0.3s; }
.doodle-10 { top: 86.8%; left: 97.6%; right: auto; width: 7.95rem; height: 7.95rem; animation: bride-doodle-twinkle 3.3s ease-in-out infinite; animation-delay: -1.7s; }
.doodle-11 { top: 39.4%; left: -5%; right: auto; width: 7.6rem; height: 7.6rem; animation: bride-doodle-pulse 4.5s ease-in-out infinite; animation-delay: -2.9s; }
.doodle-12 { top: 70%; left: -5%; animation: bride-doodle-twinkle 3.7s ease-in-out infinite; animation-delay: -1.2s; }

@keyframes bride-doodle-float {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }

  50% {
    transform: translateY(-10px) rotate(4deg);
  }
}

@keyframes bride-doodle-twinkle {
  0%,
  100% {
    opacity: 0.55;
    transform: scale(0.9);
  }

  50% {
    opacity: 1;
    transform: scale(1.14);
  }
}

@keyframes bride-doodle-pulse {
  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.14) rotate(-4deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .doodle {
    animation: none;
  }
}

@media (max-width: 860px) {
  .brides-groom-page {
    padding: 1.5rem 0.75rem;
  }

  .profiles-wrapper {
    flex-direction: column;
    flex-wrap: nowrap;
    align-items: center;
    gap: clamp(2rem, 5vw, 3.5rem);
    width: 100%;
  }

  .profile-card-wrapper {
    flex: none;
    width: 100%;
    max-width: min(100%, 420px);
    margin: 0 auto;
    padding: clamp(28px, 6vw, 42px) clamp(18px, 4vw, 32px) clamp(46px, 9vw, 64px);
  }

  .profile-card {
    padding: clamp(12px, 2.5vw, 16px) clamp(12px, 2.5vw, 16px) clamp(18px, 3.5vw, 24px);
  }

  .photo-container {
    aspect-ratio: 1 / 1;
    margin-bottom: clamp(10px, 2vh, 14px);
  }

  .profile-photo {
    transform: scale(2.1);
    transform-origin: 50% 49%;
  }

  .profile-photo.photo-groom {
    transform: scale(2.1);
    transform-origin: 50% 49%;
  }

  .profile-photo.photo-bride {
    transform: scale(2.1);
    transform-origin: 53% 49%;
  }

  .profile-name {
    font-size: clamp(1.75rem, 5.5vw, 2.4rem);
    font-weight: 600;
    margin: 0 0 clamp(6px, 1.2vh, 10px);
  }

  .profile-parents {
    font-size: clamp(1.25rem, 4vw, 1.6rem);
    font-weight: 550;
    color: #1c2b1a;
    line-height: 1.6;
    letter-spacing: 0.025em;
    min-height: auto;
    padding-bottom: 6px;
  }

  .intro-left {
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: clamp(0.75rem, 2vh, 1.25rem);
    text-align: center;
  }

  .intro-person {
    width: min(82%, 320px);
  }

  .intro-right {
    align-items: flex-start;
  }

  .intro-monogram {
    width: clamp(180px, 48vw, 250px);
    align-self: center;
  }

  .intro-source {
    width: 100%;
    text-align: left;
  }

  .doodle-2 {
    left: 98.2%;
  }

  .doodle-8 {
    left: -5%;
  }

  .doodle {
    width: clamp(2.5rem, 6.5vw, 3.2rem);
    height: clamp(2.5rem, 6.5vw, 3.2rem);
    opacity: 0.6;
  }
}

@media (max-width: 480px) {
  .profile-card-wrapper {
    max-width: 100%;
    padding: clamp(24px, 6vw, 36px) clamp(14px, 4vw, 24px) clamp(46px, 12vw, 68px);
  }

  .profile-card {
    padding: 12px 12px 22px;
  }

  .photo-container {
    aspect-ratio: 1 / 1;
    margin-bottom: 10px;
  }

  .profile-photo {
    transform: scale(2.1);
    transform-origin: 50% 49%;
  }

  .profile-photo.photo-groom {
    transform: scale(2.1);
    transform-origin: 50% 49%;
  }

  .profile-photo.photo-bride {
    transform: scale(2.1);
    transform-origin: 53% 49%;
  }

  .profile-name {
    font-size: clamp(1.75rem, 6.2vw, 2.2rem);
    font-weight: 600;
    margin-bottom: 6px;
  }

  .profile-parents {
    font-size: clamp(1.22rem, 4.6vw, 1.48rem);
    font-weight: 550;
    color: #1c2b1a;
    line-height: 1.6;
    letter-spacing: 0.025em;
    padding-bottom: 6px;
  }
}

@media (max-width: 385px) {
  .profile-card-wrapper {
    padding: 22px 12px 46px;
  }

  .profile-card {
    padding: 10px 10px 20px;
  }

  .profile-name {
    font-size: clamp(1.55rem, 5.5vw, 1.85rem);
    font-weight: 600;
  }

  .profile-parents {
    font-size: clamp(1.12rem, 4.2vw, 1.32rem);
    font-weight: 550;
    line-height: 1.55;
  }

  .doodle {
    width: 2.1rem;
    height: 2.1rem;
    opacity: 0.4;
  }
}

@media (max-width: 340px) {
  .doodle {
    display: none;
  }
}
</style>
