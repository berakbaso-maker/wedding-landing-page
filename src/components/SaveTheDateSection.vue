<script setup>
import { computed, ref } from 'vue'
import { wedding } from '../data/wedding'
import { useCountdown } from '../composables/useCountdown'

const { days, hours, minutes, seconds, isPast, pad } = useCountdown(
  wedding.saveTheDate.targetDate,
)

const countdown = computed(() => [
  { label: 'Hari', value: pad(days.value) },
  { label: 'Jam', value: pad(hours.value) },
  { label: 'Menit', value: pad(minutes.value) },
  { label: 'Detik', value: pad(seconds.value) },
])

const calendarDays = Array.from({ length: 30 }, (_, index) => index + 1)
const leadingEmptyDays = 6

const isAccentDay = (day) => wedding.saveTheDate.accentDays.includes(day)

// Add ?layout=save-date while developing to position the right-panel decorations.
const layoutMode = new URLSearchParams(window.location.search).get('layout') === 'save-date'
const rightPanelRef = ref(null)
const selectedKey = ref('cake')
const decorations = ref([
  { key: 'sparkle-top', label: 'Sparkle top', src: '/assets/svg/icon-03a.svg', x: 85.1, y: 7.3, size: 6.25 },
  { key: 'hearts-left', label: 'Hearts left', src: '/assets/svg/icon-13a.svg', x: 1.7, y: 15.5, size: 6.65 },
  { key: 'cake', label: 'Cake', src: '/assets/svg/icon-06.svg', x: 88, y: 33, size: 7 },
  { key: 'champagne', label: 'Champagne', src: '/assets/svg/icon-12.svg', x: 0.4, y: 48.6, size: 6.5 },
  { key: 'hearts-right', label: 'Hearts right', src: '/assets/svg/icon-13b.svg', x: 87.3, y: 66.2, size: 6.45 },
  { key: 'sparkle-bottom', label: 'Sparkle bottom', src: '/assets/svg/icon-03b.svg', x: 6, y: 78.3, size: 5.8 },
  { key: 'rose', label: 'Rose', src: '/assets/save-the-date/icon8-1-57.png', x: 77.8, y: 84.4, size: 6.75 },
])

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
  if (!layoutMode || !rightPanelRef.value) return
  event.preventDefault()
  selectedKey.value = decoration.key
  const bounds = rightPanelRef.value.getBoundingClientRect()
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
      size: `${decoration.size.toFixed(2)}rem`,
    }
    return result
  }, {})
  await navigator.clipboard?.writeText(JSON.stringify(output, null, 2))
}
</script>

<template>
  <section id="save-the-date" class="save-the-date-page">
    <div class="invitation-card">
      <div class="left-panel">
        <img
          src="/assets/side-gallery.webp"
          alt="Ibnu &amp; Dea"
          class="left-panel-image"
        />
      </div>

      <div ref="rightPanelRef" class="right-panel" :class="{ 'layout-mode': layoutMode }" @pointermove="dragDecoration" @pointerup="stopDrag" @pointercancel="stopDrag">
        <img
          v-for="decoration in decorations"
          :key="decoration.key"
          :src="decoration.src"
          :alt="decoration.label"
          class="icon-doodle"
          :class="`d-${decoration.key}`"
          :style="layoutMode ? decorationStyle(decoration) : undefined"
          @pointerdown="startDrag($event, decoration)"
          @click="selectedKey = decoration.key"
        />

        <h2 class="title" v-reveal="{ y: 20 }">
          {{ wedding.saveTheDate.title }}
        </h2>

        <div class="calendar-container" v-reveal="{ delay: 120 }">
          <div class="calendar-header">{{ wedding.saveTheDate.dateLabel }}</div>
          <div class="calendar-grid">
            <div
              v-for="dayName in ['SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB', 'MIN']"
              :key="dayName"
              class="day-name"
            >
              {{ dayName }}
            </div>

            <div v-for="empty in leadingEmptyDays" :key="`empty-${empty}`" class="day"></div>
            <div
              v-for="day in calendarDays"
              :key="day"
              class="day"
              :class="{ 'highlight-day': day === wedding.saveTheDate.highlightDay }"
            >
              <span>{{ day }}</span>
            </div>
          </div>
        </div>

        <div class="countdown-section" v-reveal="{ delay: 220 }">
          <h3 class="countdown-title">Menghitung Hari!</h3>
          <p v-if="isPast" class="countdown-past">Hari bahagia kami telah tiba.</p>

          <div v-else class="countdown-blocks">
            <div v-for="unit in countdown" :key="unit.label" class="time-unit">
              <div class="digits">
                <span class="digit" :key="`${unit.label}-${unit.value.charAt(0)}`">{{
                  unit.value.charAt(0)
                }}</span>
                <span class="digit" :key="`${unit.label}-${unit.value.charAt(1)}`">{{
                  unit.value.charAt(1)
                }}</span>
              </div>
              <span class="unit-label">{{ unit.label }}</span>
            </div>
          </div>

          <p class="countdown-footer">{{ wedding.saveTheDate.countdownLabel }}</p>
        </div>

        <aside v-if="layoutMode" class="layout-toolbar" @pointerdown.stop>
          <strong>Save the date editor</strong>
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
  </section>
</template>

<style scoped>
.save-the-date-page {
  display: flex;
  min-height: 100svh;
  width: 100%;
  align-items: center;
  justify-content: center;
  background: #222;
  padding: 0;
  box-shadow: 0 -12px 24px rgb(0 0 0 / 18%), 0 12px 24px rgb(0 0 0 / 18%);
}

.invitation-card {
  display: flex;
  box-sizing: border-box;
  width: 100%;
  min-height: 100svh;
  align-items: stretch;
  margin: 0;
  overflow: hidden;
  background: white;
  box-shadow: 0 10px 30px rgb(0 0 0 / 50%);
}

.left-panel {
  position: relative;
  display: flex;
  box-sizing: border-box;
  flex: 0 0 min(45%, calc(100svh * 2475 / 3420));
  width: min(45%, calc(100svh * 2475 / 3420));
  min-height: 100svh;
  max-width: 45%;
  align-items: stretch;
  align-self: stretch;
  justify-content: center;
  min-width: 0;
  overflow: hidden;
  border-right: 2px solid #5a6b4e;
  background: #f5e6e8;
}

.left-panel-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: left center;
}

.right-panel {
  position: relative;
  display: flex;
  box-sizing: border-box;
  flex: 1;
  min-height: 100svh;
  min-width: 0;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: clamp(0.8rem, 2.2vh, 1.6rem);
  overflow: hidden;
  background: #7f8963;
  padding: clamp(0.9rem, 2vh, 1.75rem) clamp(0.8rem, 2.4vw, 1.5rem);
}

.title {
  z-index: 1;
  margin: 0 0 clamp(0.4rem, 1vh, 0.75rem);
  color: #fff;
  font-family: 'Allura', cursive;
  font-size: clamp(3.5rem, 8vh, 6rem);
  font-weight: 400;
  line-height: 0.9;
  text-shadow: 1px 1px 3px rgb(0 0 0 / 20%);
}

.calendar-container {
  z-index: 1;
  box-sizing: border-box;
  width: min(100%, 760px);
  max-width: none;
  margin-bottom: 0;
  border-radius: 15px;
  background: #fdfaf6;
  padding: clamp(0.9rem, 2vh, 1.5rem) clamp(1.5rem, 3vw, 3rem);
  text-align: center;
  box-shadow: 0 4px 10px rgb(0 0 0 / 10%);
}

.calendar-header {
  margin-bottom: clamp(0.75rem, 1.4vh, 1.1rem);
  color: #4a4a4a;
  font-family: 'Blossom', cursive;
  font-size: clamp(2rem, 4.2vh, 3rem);
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  column-gap: clamp(0.5rem, 1.4vw, 1.2rem);
  row-gap: clamp(0.25rem, 0.9vh, 0.6rem);
  color: #666;
  font-family: 'Marcellus', serif;
  font-size: clamp(1rem, 2.1vh, 1.5rem);
}

.day-name {
  margin-bottom: clamp(0.3rem, 1vh, 0.6rem);
  font-size: clamp(0.8rem, 1.6vh, 1.05rem);
}

.day {
  display: flex;
  min-height: clamp(26px, 4.2vh, 42px);
  align-items: center;
  justify-content: center;
}

.highlight-day span {
  display: flex;
  width: clamp(32px, 5vh, 46px);
  height: clamp(32px, 5vh, 46px);
  align-items: center;
  justify-content: center;
  background: url('/assets/save-the-date/star3.png') center / contain no-repeat;
  color: #2c442b;
  font-weight: 700;
}

.countdown-section {
  z-index: 1;
  width: min(100%, 760px);
  color: #fff;
  text-align: center;
}

.countdown-title {
  margin: 0 0 clamp(0.6rem, 1.4vh, 1rem);
  font-family: 'Blossom', cursive;
  font-size: clamp(1.4rem, 2.8vh, 2rem);
  font-weight: 400;
}

.countdown-blocks {
  display: flex;
  justify-content: center;
  gap: clamp(0.8rem, 2vw, 1.6rem);
  margin-bottom: clamp(0.4rem, 1vh, 0.75rem);
}

.time-unit {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(0.4rem, 1vh, 0.75rem);
}

.digits {
  display: flex;
  gap: 4px;
}

.digit {
  border-radius: 4px;
  background: #2a4332;
  padding: clamp(0.5rem, 1.3vh, 0.9rem) clamp(0.7rem, 1.4vw, 1.2rem);
  color: #fff;
  font-family: 'Blossom', cursive;
  font-size: clamp(1.8rem, 4vh, 2.8rem);
  animation: digit-pop 500ms cubic-bezier(0.22, 1, 0.36, 1);
}

@keyframes digit-pop {
  0% {
    opacity: 0.35;
    transform: translateY(-6px) scale(0.94);
  }

  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.unit-label {
  font-family: 'Blossom', cursive;
  font-size: clamp(0.85rem, 1.6vh, 1.15rem);
  letter-spacing: 1px;
}

.countdown-footer {
  margin: clamp(1rem, 2.2vh, 1.6rem) auto 0;
  max-width: 760px;
  font-family: 'Blossom', cursive;
  font-size: clamp(1.05rem, 2vh, 1.35rem);
  line-height: 1.65;
  opacity: 0.9;
}

.countdown-past {
  margin: 0;
}

.icon-doodle {
  position: absolute;
  z-index: 0;
  width: clamp(3.5rem, 5vw, 5rem);
  height: clamp(3.5rem, 5vw, 5rem);
  object-fit: contain;
  opacity: 0.92;
  animation: date-icon-float 4.5s ease-in-out infinite;
  will-change: transform, opacity;
}

.layout-mode .icon-doodle {
  z-index: 4;
  cursor: grab;
  animation: none;
  touch-action: none;
  user-select: none;
}

.layout-mode .icon-doodle:active {
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

.d-sparkle-top {
  top: 7.3%;
  left: 85.1%;
  right: auto;
  width: 6.25rem;
  height: 6.25rem;
  animation: date-icon-twinkle 3.2s ease-in-out infinite;
}

.d-hearts-left {
  top: 15.5%;
  left: 1.7%;
  width: 6.65rem;
  height: 6.65rem;
  animation: date-icon-pulse 4s ease-in-out infinite;
  animation-delay: -1.2s;
}

.d-cake {
  top: 33%;
  left: 88%;
  right: auto;
  width: 7rem;
  height: 7rem;
  animation-delay: -2s;
}

.d-champagne {
  top: 48.6%;
  left: 0.4%;
  width: 6.5rem;
  height: 6.5rem;
  animation-delay: -0.6s;
}

.d-hearts-right {
  top: 66.2%;
  left: 87.3%;
  right: auto;
  bottom: auto;
  width: 6.45rem;
  height: 6.45rem;
  animation: date-icon-pulse 4.4s ease-in-out infinite;
  animation-delay: -2.4s;
}

.d-sparkle-bottom {
  top: 78.3%;
  left: 6%;
  width: 5.8rem;
  height: 5.8rem;
  animation: date-icon-twinkle 3.6s ease-in-out infinite;
  animation-delay: -1.8s;
}

.d-rose {
  top: 84.4%;
  left: 77.8%;
  right: auto;
  bottom: auto;
  width: 6.75rem;
  height: 6.75rem;
  animation-delay: -3s;
}

@keyframes date-icon-float {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-12px) rotate(3deg);
  }
}

@keyframes date-icon-twinkle {
  0%,
  100% {
    opacity: 0.45;
    transform: scale(0.9);
  }

  50% {
    opacity: 1;
    transform: scale(1.14) rotate(8deg);
  }
}

@keyframes date-icon-pulse {
  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.16) rotate(-4deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .icon-doodle {
    animation: none;
  }
}

@media (max-height: 760px) and (min-width: 701px) {
  .right-panel {
    gap: 0.6rem;
    padding-block: 0.6rem;
  }

  .title {
    margin-bottom: 0.35rem;
    font-size: clamp(2.6rem, 5.5vh, 3.4rem);
  }

  .calendar-container,
  .countdown-section {
    width: min(96%, 640px);
  }

  .calendar-container {
    max-width: none;
    padding: 0.65rem 1.25rem;
  }

  .calendar-header {
    margin-bottom: 0.5rem;
    font-size: 1.6rem;
  }

  .calendar-grid {
    gap: 0.2rem 0.6rem;
    font-size: 0.9rem;
  }

  .day {
    min-height: 22px;
  }

  .highlight-day span {
    width: 26px;
    height: 26px;
  }

  .countdown-title {
    margin-bottom: 0.45rem;
    font-size: 1.2rem;
  }

  .digit {
    padding: 0.4rem 0.65rem;
    font-size: 1.5rem;
  }

  .countdown-footer {
    margin-top: 0.45rem;
  }
}

@media (max-width: 1023px) {
  .left-panel {
    min-height: 0;
    height: 100%;
  }

  .left-panel-image {
    object-fit: cover;
    object-position: center;
  }
}

@media (max-width: 700px) {
  .save-the-date-page {
    padding: 0;
  }

  .invitation-card {
    min-height: 100svh;
    height: auto;
    flex-direction: column;
  }

  .left-panel {
    width: 100%;
    max-width: 100%;
    height: 22svh;
    min-height: 0;
    flex: 0 0 auto;
    border-right: 0;
    border-bottom: 2px solid #5a6b4e;
  }

  .left-panel-image {
    object-fit: cover;
    object-position: center;
  }

  .right-panel {
    width: 100%;
    height: auto;
    min-height: 0;
    flex: 1 1 auto;
    gap: clamp(0.4rem, 0.9vh, 0.65rem);
    padding: 0.5rem 0.75rem;
  }

  .title {
    margin-bottom: 0.3rem;
    font-size: clamp(2rem, 5.5vh, 2.8rem);
  }

  .calendar-container {
    width: min(100%, 390px);
    padding: clamp(0.4rem, 0.9vh, 0.65rem) clamp(0.6rem, 3vw, 0.9rem);
  }

  .calendar-header {
    margin-bottom: 0.4rem;
    font-size: clamp(1.15rem, 2.4vh, 1.5rem);
  }

  .calendar-grid {
    gap: clamp(0.12rem, 0.5vh, 0.3rem);
    font-size: clamp(0.72rem, 1.5vh, 0.88rem);
  }

  .day-name {
    margin-bottom: 0.2rem;
    font-size: clamp(0.58rem, 1.1vh, 0.7rem);
  }

  .day {
    min-height: clamp(17px, 2.4vh, 23px);
  }

  .highlight-day span {
    width: clamp(19px, 2.8vh, 24px);
    height: clamp(19px, 2.8vh, 24px);
  }

  .countdown-title {
    margin-bottom: 0.35rem;
    font-size: clamp(0.9rem, 1.8vh, 1.05rem);
  }

  .countdown-blocks {
    gap: 0.3rem;
    margin-bottom: 0.3rem;
  }

  .digit {
    padding: clamp(0.22rem, 0.7vh, 0.35rem) clamp(0.3rem, 1.4vw, 0.45rem);
    font-size: clamp(0.95rem, 2vh, 1.15rem);
  }

  .unit-label,
  .countdown-footer {
    font-size: clamp(0.58rem, 1.2vh, 0.7rem);
  }

  .countdown-footer {
    margin-top: 0.4rem;
    line-height: 1.4;
  }

  .icon-doodle {
    width: clamp(2.5rem, 9vw, 3.5rem);
    height: clamp(2.5rem, 9vw, 3.5rem);
  }
}

/* Portrait phones and tablets: show the full portrait artwork first, then
   continue naturally into the calendar and countdown content. */
@media (max-width: 1200px) {
  .invitation-card {
    min-height: 0;
    height: auto;
    flex-direction: column;
  }

  .left-panel {
    width: 100%;
    max-width: 100%;
    height: auto;
    min-height: 0;
    aspect-ratio: 2475 / 3420;
    flex: 0 0 auto;
    border-right: 0;
    border-bottom: 2px solid #5a6b4e;
  }

  .left-panel-image {
    width: 100%;
    height: auto;
    aspect-ratio: 2475 / 3420;
    object-fit: contain;
    object-position: center;
  }

  .right-panel {
    width: 100%;
    min-height: 0;
    height: auto;
    flex: 0 0 auto;
  }
}

/* Wider phones and compact tablets need a roomier calendar than the
   condensed phone layout above. */
@media (min-width: 560px) and (max-width: 700px) {
  .right-panel {
    gap: 1.1rem;
    padding: 3rem 1.5rem 2.5rem;
  }

  .title {
    margin-bottom: 0.5rem;
    font-size: 4rem;
  }

  .calendar-container {
    width: min(100%, 540px);
    padding: 1rem 1.4rem;
  }

  .calendar-header {
    margin-bottom: 0.65rem;
    font-size: 2rem;
  }

  .calendar-grid {
    gap: 0.4rem 0.75rem;
    font-size: 1rem;
  }

  .day-name {
    margin-bottom: 0.35rem;
    font-size: 0.75rem;
  }

  .day {
    min-height: 28px;
  }

  .highlight-day span {
    width: 30px;
    height: 30px;
  }

  .countdown-title {
    margin-bottom: 0.55rem;
    font-size: 1.3rem;
  }

  .countdown-blocks {
    gap: 0.75rem;
  }

  .digit {
    padding: 0.5rem 0.7rem;
    font-size: 1.7rem;
  }

  .unit-label,
  .countdown-footer {
    font-size: 0.8rem;
  }

  .icon-doodle {
    width: 4.25rem;
    height: 4.25rem;
  }
}

@media (max-height: 500px) and (orientation: landscape) {
  .title {
    font-size: clamp(1.8rem, 6vh, 2.4rem);
  }

  .calendar-container {
    padding: 0.5rem 0.9rem;
  }

  .calendar-header {
    font-size: 1.2rem;
  }

  .calendar-grid {
    font-size: 0.8rem;
  }

  .day {
    min-height: 18px;
  }

  .digit {
    padding: 0.35rem 0.55rem;
    font-size: 1.3rem;
  }
}
</style>
