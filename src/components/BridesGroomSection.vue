<script setup>
import { wedding } from '../data/wedding'

const people = [
  { role: 'Groom', ...wedding.bridesGroom.groom },
  { role: 'Bride', ...wedding.bridesGroom.bride },
]
</script>

<template>
  <section id="brides-groom" class="brides-groom-page">
    <div class="brides-groom-container">
      <img
        v-for="(decoration, index) in wedding.bridesGroom.decorations"
        :key="decoration"
        :src="decoration"
        alt=""
        class="doodle"
        :class="`doodle-${index + 1}`"
      />

      <div class="profiles-section">
        <h2 class="section-title">Brides &amp; Groom</h2>

        <div class="profiles-wrapper">
          <div v-for="(person, index) in people" :key="person.role" class="profile-card-wrapper">
            <img :src="person.frame" alt="" class="profile-frame" aria-hidden="true" />

            <article class="profile-card">
              <div class="photo-container">
                <img
                  :src="person.image"
                  :alt="`${person.role} - ${person.name}`"
                  class="profile-photo"
                />
              </div>
              <h3 class="profile-name">{{ person.name }}</h3>
              <p class="profile-parents">
                {{ person.parents }}<br />
                {{ person.address }}
              </p>
              <span v-if="index === 0" class="profile-role">Groom</span>
              <span v-else class="profile-role">Bride</span>
            </article>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.brides-groom-page {
  position: relative;
  display: flex;
  min-height: 100vh;
  width: 100%;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #667554;
  padding: var(--page-pad-y) 0;
  font-family: 'Marcellus', serif;
  box-shadow: 0 -12px 24px rgb(0 0 0 / 18%), 0 12px 24px rgb(0 0 0 / 18%);
}

.brides-groom-container {
  position: relative;
  width: min(100%, var(--content-max));
  margin: 0 auto;
  padding: 0 clamp(1rem, 4vw, 3rem);
}

.profiles-section {
  position: relative;
  z-index: 2;
  padding-bottom: clamp(1rem, 3vh, 2.5rem);
  text-align: center;
}

.section-title {
  margin: 0 0 clamp(1.5rem, 4vh, 2.5rem);
  color: #fff;
  font-family: 'Great Vibes', cursive;
  font-size: clamp(3rem, 8vw, 4.5rem);
  font-weight: 400;
  text-shadow: 1px 1px 3px rgb(0 0 0 / 20%);
}

.profiles-wrapper {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1.875rem;
}

.profile-card-wrapper {
  position: relative;
  z-index: 2;
  box-sizing: border-box;
  width: min(100%, 440px);
  margin: 0 auto;
  padding: 60px;
  isolation: isolate;
}

.profile-card {
  position: relative;
  z-index: 1;
  box-sizing: border-box;
  width: 100%;
  margin: 0;
  border: 0;
  border-radius: 10px;
  background: #fff;
  padding: 15px;
  box-shadow: 0 10px 20px rgb(0 0 0 / 20%);
}

.photo-container {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  aspect-ratio: 767 / 1084;
  margin-bottom: 15px;
  overflow: hidden;
  border-radius: 5px;
  background: #fff;
}

.profile-photo {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
}

.profile-photo {
  z-index: 1;
  position: relative;
  inset: auto;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-name,
.profile-parents,
.profile-role {
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
  transform: translateX(-3px);
}

.profile-name {
  margin: 0 0 5px;
  color: #2c3e23;
  font-size: 1.6rem;
  font-weight: 400;
}

.profile-parents {
  min-height: 3.5rem;
  padding-bottom: 10px;
  color: #666;
  font-size: 0.9rem;
  line-height: 1.4;
}

.profile-role {
  display: block;
  color: #667554;
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
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

.doodle-1 { top: 3%; left: 3%; animation-delay: -0.6s; }
.doodle-2 { top: 29%; left: -1%; animation: bride-doodle-pulse 4.2s ease-in-out infinite; animation-delay: -1.4s; }
.doodle-3 { top: 56%; left: 2%; animation-delay: -2.3s; }
.doodle-4 { bottom: 5%; left: 4%; animation: bride-doodle-twinkle 3.4s ease-in-out infinite; animation-delay: -0.9s; }
.doodle-5 { top: 18%; left: 16%; animation: bride-doodle-twinkle 3.6s ease-in-out infinite; animation-delay: -2.1s; }
.doodle-6 { bottom: 7%; left: 42%; animation: bride-doodle-pulse 4.4s ease-in-out infinite; animation-delay: -3s; }
.doodle-7 { top: 3%; right: 3%; animation-delay: -1.8s; }
.doodle-8 { top: 29%; right: -1%; animation: bride-doodle-pulse 4s ease-in-out infinite; animation-delay: -2.6s; }
.doodle-9 { top: 56%; right: 2%; animation-delay: -0.3s; }
.doodle-10 { bottom: 5%; right: 4%; animation: bride-doodle-twinkle 3.3s ease-in-out infinite; animation-delay: -1.7s; }
.doodle-11 { top: 18%; right: 16%; animation: bride-doodle-pulse 4.5s ease-in-out infinite; animation-delay: -2.9s; }
.doodle-12 { bottom: 7%; right: 42%; animation: bride-doodle-twinkle 3.7s ease-in-out infinite; animation-delay: -1.2s; }

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

@media (max-width: 700px) {
  .brides-groom-page {
    padding: 1rem;
  }

  .profiles-wrapper {
    flex-direction: column;
  }

  .profile-card-wrapper {
    width: min(100%, 440px);
  }

  .doodle {
    width: 3.5rem;
    height: 3.5rem;
  }

  .doodle-2 {
    left: -0.75rem;
  }

  .doodle-8 {
    right: -0.75rem;
  }
}
</style>
