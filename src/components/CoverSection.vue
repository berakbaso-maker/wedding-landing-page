<script setup>
import { wedding } from '../data/wedding'

const emit = defineEmits(['open'])

defineProps({
  guestName: { type: String, default: '' },
})
</script>

<template>
  <section class="invitation-container">
    <header class="top-bar">
      <img src="/logo-fix.png" alt="Wedding logo" class="logo" />
    </header>

    <main class="hero-section">
      <img src="/assets/svg/icon-01.svg" alt="" class="decorative-icon icon-dove" />
      <img src="/assets/svg/icon-03a.svg" alt="" class="decorative-icon icon-sparkle-1" />
      <img src="/assets/svg/icon-13a.svg" alt="" class="decorative-icon icon-hearts-1" />
      <img src="/assets/svg/icon-13b.svg" alt="" class="decorative-icon icon-hearts-2" />
      <img src="/assets/svg/icon-03b.svg" alt="" class="decorative-icon icon-sparkle-2" />
      <img src="/assets/svg/icon-06.svg" alt="" class="decorative-icon icon-cake" />
      <img src="/assets/svg/icon-12.svg" alt="" class="decorative-icon icon-champagne" />
      <img src="/assets/svg/icon-02.svg" alt="" class="decorative-icon icon-envelope" />
      <img src="/assets/svg/icon-03c.svg" alt="" class="decorative-icon icon-hearts-3" />

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
  min-height: calc(100vh - 90px);
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: var(--page-pad-y) var(--page-pad-x);
  background: url('/assets/background.png') center / cover no-repeat;
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
  font-size: clamp(3.25rem, 9vw, 5.25rem);
}

.hero-title-bottom {
  margin-top: 0.25rem;
  font-size: clamp(4.25rem, 12vw, 6.5rem);
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
  margin-top: 1.75rem;
  border: 0;
  border-radius: 8px;
  background-color: #275236;
  padding: 0.75rem 2.5rem;
  color: #fff;
  cursor: pointer;
  font-family: 'Allura', cursive;
  font-size: 1.8rem;
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

.icon-dove {
  --icon-rotation: -15deg;
  top: 8%;
  left: 8%;
  width: 6.75rem;
  height: 6.75rem;
  animation-delay: -1.2s;
}

.icon-sparkle-1 {
  top: 50%;
  left: 15%;
  width: 5rem;
  height: 5rem;
  animation: icon-twinkle 3.2s ease-in-out infinite;
  animation-delay: -0.8s;
}

.icon-hearts-1 {
  top: 20%;
  left: 45%;
  width: 3.5rem;
  height: 3.5rem;
  animation: icon-pulse 4s ease-in-out infinite;
  animation-delay: -1.5s;
}

.icon-hearts-2 {
  bottom: 15%;
  left: 28%;
  width: 3.5rem;
  height: 3.5rem;
  animation: icon-pulse 4.5s ease-in-out infinite;
  animation-delay: -2.2s;
}

.icon-sparkle-2 {
  top: 20%;
  right: 20%;
  width: 5rem;
  height: 5rem;
  animation: icon-twinkle 3.5s ease-in-out infinite;
  animation-delay: -1.8s;
}

.icon-cake {
  top: 40%;
  right: 10%;
  width: 6.25rem;
  height: 6.25rem;
  animation-delay: -2.6s;
}

.icon-champagne {
  bottom: 10%;
  left: 8%;
  width: 6.25rem;
  height: 6.25rem;
  animation-delay: -0.4s;
}

.icon-envelope {
  --icon-rotation: -10deg;
  right: 25%;
  bottom: 15%;
  width: 6.25rem;
  height: 6.25rem;
  animation-delay: -1.9s;
}

.icon-hearts-3 {
  right: 10%;
  bottom: 15%;
  width: 3.5rem;
  height: 3.5rem;
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
    min-height: calc(100vh - 90px);
  }

  .decorative-icon {
    transform: scale(0.85);
  }

  .logo {
    width: 64px;
  }

  .icon-dove {
    left: 2%;
  }

  .icon-cake {
    right: 2%;
  }

  .icon-envelope {
    right: 16%;
  }
}
</style>
