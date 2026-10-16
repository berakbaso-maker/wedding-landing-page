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

// Mode Layout Editor (?layout=save-date)
const layoutMode = new URLSearchParams(window.location.search).get('layout') === 'save-date'
const containerRef = ref(null)
const selectedKey = ref('cake')

// Doodles sesuai persis dengan screenshot UI (diperbesar sesuai permintaan)
const decorations = ref([
  { key: 'hearts-left', label: 'Hearts left', src: '/assets/svg/icon-13a.svg', x: 6.5, y: 22.0, size: 8.5 },
  { key: 'cake', label: 'Cake', src: '/assets/svg/icon-06.svg', x: 9.5, y: 50.0, size: 10.5 },
  { key: 'sparkle-bottom', label: 'Sparkle bottom', src: '/assets/svg/icon-03b.svg', x: 7.0, y: 79.0, size: 8.2 },
  { key: 'sparkle-top', label: 'Sparkle top', src: '/assets/svg/icon-03a.svg', x: 91.5, y: 16.0, size: 8.2 },
  { key: 'heels', label: 'Heels', src: '/assets/svg/hels.svg', x: 92.0, y: 46.0, size: 10.5 },
  { key: 'hearts-right', label: 'Hearts right', src: '/assets/svg/icon-13b.svg', x: 88.0, y: 68.0, size: 7.5 },
  { key: 'rose', label: 'Rose', src: '/assets/svg/mawar.svg', x: 92.5, y: 84.5, size: 9.8 },
])

const selectedDecoration = computed(() => decorations.value.find(({ key }) => key === selectedKey.value))
let dragState = null

const decorationStyle = (decoration) => ({
  left: `${decoration.x}%`,
  top: `${decoration.y}%`,
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
  <section
    id="save-the-date"
    ref="containerRef"
    class="save-the-date-page"
    :class="{ 'layout-mode': layoutMode }"
    @pointermove="dragDecoration"
    @pointerup="stopDrag"
    @pointercancel="stopDrag"
  >
    <!-- Layer Doodles Mengelilingi Layar Sesuai Screenshot -->
    <div class="deco-layer" aria-hidden="true">
      <img
        v-for="decoration in decorations"
        :key="decoration.key"
        :src="decoration.src"
        :alt="decoration.label"
        class="icon-doodle"
        :class="`d-${decoration.key}`"
        :style="decorationStyle(decoration)"
        @pointerdown="startDrag($event, decoration)"
        @click="selectedKey = decoration.key"
      />
    </div>

    <!-- Konten Utama Di Tengah -->
    <div class="content-wrapper">
      <h2 class="title reveal" v-reveal="{ y: 20 }">
        {{ wedding.saveTheDate.title }}
      </h2>

      <!-- Kartu Kalender Putih Sesuai Screenshot -->
      <div class="calendar-container reveal" v-reveal="{ delay: 120 }">
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
            :class="{
              'highlight-day': day === wedding.saveTheDate.highlightDay,
              'accent-day': isAccentDay(day),
            }"
          >
            <span>{{ day }}</span>
          </div>
        </div>
      </div>

      <!-- Sesi Hitung Mundur Dengan Kotak Digit Terpisah Per Karakter Sesuai Screenshot -->
      <div class="countdown-section reveal" v-reveal="{ delay: 220 }">
        <h3 class="countdown-title">Menghitung Hari !</h3>
        <p v-if="isPast" class="countdown-past">Hari bahagia kami telah tiba.</p>

        <div v-else class="countdown-blocks">
          <div v-for="unit in countdown" :key="unit.label" class="time-unit">
            <div class="digits-pair">
              <div class="digit-box">
                <span class="digit-char">{{ unit.value.charAt(0) }}</span>
              </div>
              <div class="digit-box">
                <span class="digit-char">{{ unit.value.charAt(1) }}</span>
              </div>
            </div>
            <span class="unit-label">{{ unit.label }}</span>
          </div>
        </div>

        <p class="countdown-footer">{{ wedding.saveTheDate.countdownLabel }}</p>
      </div>
    </div>

    <!-- Toolbar Editor Posisi (?layout=save-date) -->
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
        <input v-model.number="selectedDecoration.size" type="range" min="2" max="14" step="0.05" />
      </label>
      <button type="button" @click="copyLayout">Copy layout JSON</button>
      <code v-if="selectedDecoration">left: {{ selectedDecoration.x.toFixed(1) }}%; top: {{ selectedDecoration.y.toFixed(1) }}%</code>
    </aside>
  </section>
</template>

<style scoped>
.save-the-date-page {
  position: relative;
  display: flex;
  min-height: 100svh;
  width: 100%;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  background: #7f8963;
  overflow: hidden;
  padding: clamp(2rem, 5vh, 4rem) clamp(1rem, 3vw, 2.5rem);
  font-family: 'Blossom', sans-serif;
}

/* Layer Doodles Bebas Di Seluruh Layar */
.deco-layer {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.icon-doodle {
  position: absolute;
  transform: translate(-50%, -50%);
  object-fit: contain;
  opacity: 0.95;
  filter: drop-shadow(0 2px 5px rgb(0 0 0 / 12%));
  pointer-events: none;
  animation: date-icon-float 5s ease-in-out infinite;
  will-change: transform;
}

/* Animasi mikro halus */
.d-sparkle-top,
.d-sparkle-bottom {
  animation: date-icon-twinkle 3.8s ease-in-out infinite;
}

.d-hearts-left,
.d-hearts-right {
  animation: date-icon-pulse 4.2s ease-in-out infinite;
}

@keyframes date-icon-float {
  0%,
  100% {
    transform: translate(-50%, -50%) translateY(0);
  }
  50% {
    transform: translate(-50%, -50%) translateY(-10px) rotate(2deg);
  }
}

@keyframes date-icon-twinkle {
  0%,
  100% {
    opacity: 0.7;
    transform: translate(-50%, -50%) scale(0.92);
  }
  50% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.08) rotate(6deg);
  }
}

@keyframes date-icon-pulse {
  0%,
  100% {
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    transform: translate(-50%, -50%) scale(1.1) rotate(-3deg);
  }
}

/* Mode Layout Drag & Drop */
.layout-mode .icon-doodle {
  pointer-events: auto;
  cursor: grab;
  outline: 2px dashed rgb(255 255 255 / 85%);
  outline-offset: 3px;
  animation: none;
}

.layout-mode .icon-doodle:active {
  cursor: grabbing;
}

.layout-toolbar {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 100;
  display: grid;
  width: min(240px, calc(100% - 2rem));
  gap: 0.5rem;
  border: 1px solid rgb(255 255 255 / 55%);
  border-radius: 10px;
  background: rgb(28 48 32 / 94%);
  padding: 0.85rem;
  color: #fff;
  font: 0.8rem/1.3 system-ui, sans-serif;
  text-align: left;
  box-shadow: 0 4px 16px rgb(0 0 0 / 25%);
}

.layout-toolbar strong {
  font-size: 0.95rem;
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

/* Pembungkus Konten Utama Kompak Di Tengah Sesuai Screenshot */
.content-wrapper {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 780px;
  margin: 0 auto;
}

/* Judul "Save The Date" Tetap Pakai Allura Sesuai Permintaan */
.title {
  margin: 0 0 clamp(0.75rem, 1.8vh, 1.4rem);
  color: #ffffff;
  font-family: 'Allura', cursive !important;
  font-size: clamp(3.6rem, 7.5vw, 5.6rem);
  font-weight: 400;
  line-height: 1.1;
  text-shadow: 1px 1px 3px rgb(0 0 0 / 14%);
  text-align: center;
}

/* Semua Teks Lainnya Memakai Font Blossom */
.calendar-container,
.calendar-header,
.calendar-grid,
.day-name,
.day,
.day span,
.countdown-section,
.countdown-title,
.countdown-past,
.digit-box,
.digit-char,
.unit-label,
.countdown-footer {
  font-family: 'Blossom', cursive, sans-serif !important;
}

/* Kartu Kalender Diperlebar Kiri Kanan dengan Tinggi Presisi */
.calendar-container {
  box-sizing: border-box;
  width: min(95%, 720px);
  margin: 0 auto;
  border-radius: 26px;
  background: #ffffff;
  padding: clamp(1.4rem, 2.8vh, 2.1rem) clamp(2.5rem, 5vw, 4.2rem);
  text-align: center;
  box-shadow: 0 10px 30px rgb(0 0 0 / 12%);
}

.calendar-header {
  margin-bottom: clamp(0.9rem, 1.8vh, 1.35rem);
  color: #273a26;
  font-size: clamp(1.75rem, 3.4vh, 2.35rem);
  font-weight: 400;
  letter-spacing: 0.5px;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  column-gap: clamp(0.6rem, 1.8vw, 1.6rem);
  row-gap: clamp(0.35rem, 1vh, 0.65rem);
  color: #384936;
  font-size: clamp(1rem, 1.9vh, 1.35rem);
}

.day-name {
  margin-bottom: clamp(0.35rem, 0.9vh, 0.65rem);
  font-size: clamp(0.9rem, 1.7vh, 1.15rem);
  font-weight: 500;
  color: #384936;
}

/* Hari Minggu (kolom ke-7) berwarna pink/salmon lembut */
.day-name:last-child {
  color: #df9f9f;
}

.day {
  position: relative;
  display: flex;
  min-height: clamp(28px, 4.2vh, 40px);
  height: clamp(28px, 4.2vh, 40px);
  align-items: center;
  justify-content: center;
}

/* Tanggal Minggu berwarna pink/salmon lembut */
.day.accent-day span {
  color: #df9f9f;
}

/* Hari H (7 November) dengan lencana scalloped rosette pink */
.day.highlight-day {
  z-index: 2;
}

.day.highlight-day span {
  display: flex;
  width: clamp(34px, 5vh, 46px);
  height: clamp(34px, 5vh, 46px);
  align-items: center;
  justify-content: center;
  background: url('/assets/save-the-date/star-1-24.svg') center / contain no-repeat;
  color: #273b26 !important;
  font-weight: 600;
}

/* Sesi Countdown Diperbesar Agar Selaras & Proporsional Dengan Kalender */
.countdown-section {
  width: min(95%, 720px);
  margin: 0 auto;
  color: #ffffff;
  text-align: center;
}

.countdown-title {
  margin: clamp(1.4rem, 2.6vh, 2.2rem) 0 clamp(0.85rem, 1.6vh, 1.3rem);
  font-size: clamp(1.6rem, 3vh, 2.35rem);
  font-weight: 400;
  color: #ffffff;
  letter-spacing: 0.5px;
}

.countdown-past {
  margin: 0;
}

.countdown-blocks {
  display: flex;
  justify-content: center;
  gap: clamp(1rem, 2.6vw, 2.4rem);
  margin-bottom: clamp(0.4rem, 1vh, 0.75rem);
}

.time-unit {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(0.45rem, 1vh, 0.75rem);
}

/* Kotak Digit Terpisah Per Karakter Berwarna Hijau Gelap Sesuai Screenshot */
.digits-pair {
  display: flex;
  gap: clamp(4px, 0.6vw, 8px);
}

.digit-box {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: #244228;
  width: clamp(36px, 4.8vw, 54px);
  height: clamp(54px, 7vh, 76px);
  box-shadow: 0 6px 18px rgb(0 0 0 / 24%);
}

.digit-char {
  color: #ffffff;
  font-size: clamp(2.1rem, 4.2vh, 3.2rem);
  line-height: 1;
}

.unit-label {
  font-size: clamp(1.1rem, 2vh, 1.45rem);
  color: #ffffff;
  letter-spacing: 0.5px;
}

.countdown-footer {
  margin: clamp(1rem, 2.2vh, 1.6rem) auto 0;
  max-width: 650px;
  font-size: clamp(1rem, 2vh, 1.35rem);
  line-height: 1.5;
  color: #ffffff;
  opacity: 0.95;
}

/* Responsif Tablet & Mobile: Mengurangi doodle yang padat & mengecilkan ukuran agar tidak mengganggu konten */
@media (max-width: 900px) {
  /* Sembunyikan ikon bagian tengah yang menabrak kalender dan countdown */
  .d-cake,
  .d-heels,
  .d-hearts-right {
    display: none !important;
  }

  /* Sisakan 4 doodle di sudut terluar dengan ukuran proporsional */
  .d-hearts-left {
    top: 6% !important;
    left: 5% !important;
    width: 4.5rem !important;
    height: 4.5rem !important;
    opacity: 0.75;
  }

  .d-sparkle-top {
    top: 6% !important;
    left: auto !important;
    right: 5% !important;
    width: 4.2rem !important;
    height: 4.2rem !important;
    opacity: 0.75;
  }

  .d-sparkle-bottom {
    top: auto !important;
    bottom: 5% !important;
    left: 5% !important;
    width: 4.2rem !important;
    height: 4.2rem !important;
    opacity: 0.75;
  }

  .d-rose {
    top: auto !important;
    bottom: 5% !important;
    left: auto !important;
    right: 5% !important;
    width: 4.8rem !important;
    height: 4.8rem !important;
    opacity: 0.75;
  }
}

/* Responsif Mobile (<= 720px) */
@media (max-width: 720px) {
  .deco-layer {
    opacity: 0.85;
  }

  .title {
    font-size: clamp(3.2rem, 14vw, 4.5rem);
  }

  .calendar-container {
    width: 95%;
    padding: 1.25rem 1rem;
  }

  .digits-pair {
    gap: 3px;
  }

  .digit-box {
    width: 32px;
    height: 48px;
    border-radius: 7px;
  }

  .digit-char {
    font-size: 1.75rem;
  }

  .countdown-blocks {
    gap: 0.65rem;
  }

  .unit-label {
    font-size: 1rem;
  }

  .countdown-footer {
    font-size: 0.95rem;
  }

  /* Perkecil doodle sudut di mobile */
  .d-hearts-left {
    top: 5% !important;
    left: 5% !important;
    width: 3.4rem !important;
    height: 3.4rem !important;
    opacity: 0.65;
  }

  .d-sparkle-top {
    top: 5% !important;
    left: auto !important;
    right: 5% !important;
    width: 3.2rem !important;
    height: 3.2rem !important;
    opacity: 0.65;
  }

  .d-sparkle-bottom {
    top: auto !important;
    bottom: 3% !important;
    left: 5% !important;
    width: 3.2rem !important;
    height: 3.2rem !important;
    opacity: 0.65;
  }

  .d-rose {
    top: auto !important;
    bottom: 3% !important;
    left: auto !important;
    right: 5% !important;
    width: 3.6rem !important;
    height: 3.6rem !important;
    opacity: 0.65;
  }
}

/* Penyesuaian khusus layar kecil (<= 385px seperti iPhone 375px) */
@media (max-width: 385px) {
  /* Sembunyikan sparkle bottom agar area hitung mundur tidak sesak */
  .d-sparkle-bottom {
    display: none !important;
  }

  .d-hearts-left {
    top: 4% !important;
    left: 4% !important;
    width: 2.6rem !important;
    height: 2.6rem !important;
    opacity: 0.55;
  }

  .d-sparkle-top {
    top: 4% !important;
    left: auto !important;
    right: 4% !important;
    width: 2.4rem !important;
    height: 2.4rem !important;
    opacity: 0.55;
  }

  .d-rose {
    top: auto !important;
    bottom: 2% !important;
    left: auto !important;
    right: 4% !important;
    width: 2.8rem !important;
    height: 2.8rem !important;
    opacity: 0.55;
  }
}

/* Layar ultra kecil (<= 340px) */
@media (max-width: 340px) {
  .deco-layer,
  .icon-doodle {
    display: none !important;
  }
}
</style>
