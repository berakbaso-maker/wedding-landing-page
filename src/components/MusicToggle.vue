<script setup>
import { ref } from 'vue'

defineProps({
  src: { type: String, required: true },
})

const audio = ref(null)
const isPlaying = ref(false)

const play = async () => {
  if (!audio.value) return

  try {
    await audio.value.play()
    isPlaying.value = true
  } catch {
    isPlaying.value = false
  }
}

const pause = () => {
  audio.value?.pause()
  isPlaying.value = false
}

const toggle = () => (isPlaying.value ? pause() : play())

defineExpose({ play, pause, isPlaying })
</script>

<template>
  <div class="music-toggle">
    <audio ref="audio" :src="src" loop preload="auto"></audio>
    <button
      type="button"
      class="music-btn"
      :class="{ 'is-playing': isPlaying }"
      :aria-label="isPlaying ? 'Jeda musik' : 'Putar musik'"
      @click="toggle"
    >
      <span class="note">{{ isPlaying ? '♪' : '♪' }}</span>
      <span class="pulse"></span>
    </button>
  </div>
</template>

<style scoped>
.music-toggle {
  position: fixed;
  bottom: clamp(1rem, 2.5vw, 1.75rem);
  right: clamp(1rem, 2.5vw, 1.75rem);
  z-index: 80;
}

.music-btn {
  position: relative;
  display: grid;
  width: 3rem;
  height: 3rem;
  place-items: center;
  border: 0;
  border-radius: 50%;
  background: #2a4332;
  color: #fff;
  cursor: pointer;
  box-shadow: 0 6px 16px rgb(0 0 0 / 30%);
  transition: transform 300ms ease, background 300ms ease;
}

.music-btn:hover {
  transform: scale(1.08);
}

.music-btn .note {
  font-size: 1.15rem;
  line-height: 1;
}

.music-btn.is-playing .note {
  animation: music-spin 3.2s linear infinite;
}

.pulse {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2px solid rgb(255 255 255 / 60%);
  opacity: 0;
}

.music-btn.is-playing .pulse {
  animation: music-pulse 2s ease-out infinite;
}

@keyframes music-spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes music-pulse {
  0% {
    opacity: 0.6;
    transform: scale(1);
  }

  100% {
    opacity: 0;
    transform: scale(1.6);
  }
}

@media (prefers-reduced-motion: reduce) {
  .music-btn .note,
  .music-btn.is-playing .pulse {
    animation: none;
  }
}
</style>
