<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { wedding } from '../data/wedding'

const props = defineProps({
  src: {
    type: String,
    default: () => wedding.music || '/assets/music/daylight_fix.mp3',
  },
})

const audioRef = ref(null)
const isPlaying = ref(false)
const userManuallyPaused = ref(false)

const handlePlayState = () => {
  const audio = audioRef.value
  if (audio && !audio.muted && !audio.paused) {
    isPlaying.value = true
  }
}

const playAudio = async () => {
  const audio = audioRef.value
  if (!audio) return
  try {
    userManuallyPaused.value = false
    audio.muted = false
    await audio.play()
    isPlaying.value = true
  } catch {
    // Jika autoplay bersuara diblokir browser, mulai dalam mode muted agar audio sudah berjalan di background
    try {
      audio.muted = true
      await audio.play()
    } catch {
      isPlaying.value = false
    }
  }
}

const pauseAudio = () => {
  const audio = audioRef.value
  if (!audio) return
  audio.pause()
  isPlaying.value = false
}

const togglePlay = (event) => {
  event?.stopPropagation()
  const audio = audioRef.value
  if (!audio) return

  if (isPlaying.value && !audio.muted) {
    userManuallyPaused.value = true
    pauseAudio()
  } else {
    userManuallyPaused.value = false
    audio.muted = false
    playAudio()
  }
}

const onGlobalInteraction = (event) => {
  if (userManuallyPaused.value) return

  // Abaikan jika yang diklik adalah tombol kontrol musik itu sendiri
  if (event?.target?.closest?.('.music-controller')) return

  const audio = audioRef.value
  if (!audio) return

  // Jika audio muted atau belum berputar bersuara, unmute dan putar
  if (audio.muted || audio.paused || !isPlaying.value) {
    audio.muted = false
    audio
      .play()
      .then(() => {
        isPlaying.value = true
      })
      .catch(() => {})
  }
}

const globalEvents = [
  'pointerdown',
  'mousedown',
  'mouseup',
  'touchstart',
  'click',
  'keydown',
  'scroll',
  'wheel',
]

onMounted(() => {
  // Coba autoplay langsung (unmuted atau muted fallback)
  playAudio()

  // Pasang listener di window dan document dengan capture phase agar responsif di seluruh layar desktop & mobile
  globalEvents.forEach((evt) => {
    window.addEventListener(evt, onGlobalInteraction, { capture: true, passive: true })
    document.addEventListener(evt, onGlobalInteraction, { capture: true, passive: true })
  })
})

onUnmounted(() => {
  globalEvents.forEach((evt) => {
    window.removeEventListener(evt, onGlobalInteraction, { capture: true })
    document.removeEventListener(evt, onGlobalInteraction, { capture: true })
  })
  pauseAudio()
})

defineExpose({
  play: playAudio,
  pause: pauseAudio,
  toggle: togglePlay,
  isPlaying,
})
</script>

<template>
  <audio
    ref="audioRef"
    :src="props.src"
    loop
    preload="auto"
    playsinline
    autoplay
    muted
    aria-hidden="true"
    @play="handlePlayState"
    @pause="isPlaying = false"
    @playing="handlePlayState"
  ></audio>

  <aside class="music-controller" aria-label="Kontrol Pemutar Musik">
    <button
      type="button"
      class="music-btn"
      :class="{ 'is-playing': isPlaying }"
      :aria-label="isPlaying ? 'Jeda Musik Latar' : 'Putar Musik Latar'"
      :title="isPlaying ? 'Jeda Musik' : 'Putar Musik'"
      @click="togglePlay"
    >
      <svg
        v-if="isPlaying"
        class="btn-icon icon-pause"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <rect x="6" y="5" width="4" height="14" rx="1.5" />
        <rect x="14" y="5" width="4" height="14" rx="1.5" />
      </svg>

      <svg
        v-else
        class="btn-icon icon-play"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86a1 1 0 0 0-1.5.86z" />
      </svg>
    </button>
  </aside>
</template>

<style scoped>
.music-controller {
  position: fixed;
  bottom: clamp(1.2rem, 3vw, 2rem);
  right: clamp(1.2rem, 3vw, 2rem);
  z-index: 120;
  pointer-events: auto;
}

.music-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  padding: 0;
  border: 1.5px solid rgba(255, 255, 255, 0.65);
  border-radius: 50%;
  background: rgba(33, 80, 43, 0.82);
  color: #fff;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.28);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transition: transform 0.25s ease, background-color 0.25s ease, box-shadow 0.25s ease;
  user-select: none;
}

.music-btn:hover {
  transform: scale(1.08);
  background: rgba(33, 80, 43, 0.95);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35);
}

.music-btn:active {
  transform: scale(0.96);
}

.btn-icon {
  width: 20px;
  height: 20px;
  color: #ffffff;
  display: block;
  transition: transform 0.2s ease;
}

.icon-play {
  margin-left: 2px;
}

.icon-pause {
  margin-left: 0;
}
</style>
