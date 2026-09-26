<script setup>
import { computed } from 'vue'
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

      <div class="right-panel">
        <img
          src="/assets/svg/icon-03a.svg"
          alt=""
          class="icon-doodle d-sparkle-top"
        />
        <img
          src="/assets/svg/icon-13a.svg"
          alt=""
          class="icon-doodle d-hearts-left"
        />
        <img
          src="/assets/svg/icon-06.svg"
          alt=""
          class="icon-doodle d-cake"
        />
        <img
          src="/assets/svg/icon-12.svg"
          alt=""
          class="icon-doodle d-champagne"
        />
        <img
          src="/assets/svg/icon-13b.svg"
          alt=""
          class="icon-doodle d-hearts-right"
        />
        <img
          src="/assets/svg/icon-03b.svg"
          alt=""
          class="icon-doodle d-sparkle-bottom"
        />
        <img
          src="/assets/save-the-date/icon8-1-57.png"
          alt=""
          class="icon-doodle d-rose"
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
  font-family: 'Marcellus', serif;
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
  border-radius: 50%;
  background: #dcb8b9;
  color: #fff;
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
  font-family: 'Marcellus', serif;
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
  font-family: 'Marcellus', serif;
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

.unit-label,
.countdown-footer {
  font-size: clamp(0.85rem, 1.6vh, 1.15rem);
}

.unit-label {
  letter-spacing: 1px;
}

.countdown-footer {
  margin: clamp(0.6rem, 1.4vh, 1rem) auto 0;
  max-width: 760px;
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

.d-sparkle-top {
  top: 6%;
  right: 3%;
  width: clamp(4rem, 5.5vw, 5.5rem);
  height: clamp(4rem, 5.5vw, 5.5rem);
  animation: date-icon-twinkle 3.2s ease-in-out infinite;
}

.d-hearts-left {
  top: 20%;
  left: 3%;
  width: clamp(3.75rem, 4.5vw, 4.75rem);
  height: clamp(3.75rem, 4.5vw, 4.75rem);
  animation: date-icon-pulse 4s ease-in-out infinite;
  animation-delay: -1.2s;
}

.d-cake {
  top: 31%;
  right: 2%;
  width: clamp(5.5rem, 7vw, 7rem);
  height: clamp(5.5rem, 7vw, 7rem);
  animation-delay: -2s;
}

.d-champagne {
  top: 47%;
  left: 2%;
  width: clamp(5rem, 6.5vw, 6.5rem);
  height: clamp(5rem, 6.5vw, 6.5rem);
  animation-delay: -0.6s;
}

.d-hearts-right {
  right: 3%;
  bottom: 32%;
  width: clamp(3.75rem, 4.5vw, 4.75rem);
  height: clamp(3.75rem, 4.5vw, 4.75rem);
  animation: date-icon-pulse 4.4s ease-in-out infinite;
  animation-delay: -2.4s;
}

.d-sparkle-bottom {
  bottom: auto;
  top: 73%;
  left: 3%;
  width: clamp(4rem, 5vw, 5rem);
  height: clamp(4rem, 5vw, 5rem);
  animation: date-icon-twinkle 3.6s ease-in-out infinite;
  animation-delay: -1.8s;
}

.d-rose {
  right: 2%;
  bottom: 5%;
  width: clamp(5.25rem, 6.5vw, 6.75rem);
  height: clamp(5.25rem, 6.5vw, 6.75rem);
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
