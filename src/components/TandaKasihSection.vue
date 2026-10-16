<script setup>
import { ref } from 'vue'
import { wedding } from '../data/wedding'

const copied = ref('')

const copyAccount = async (number) => {
  let success = false
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(number)
      success = true
    } else {
      throw new Error('Clipboard API not available')
    }
  } catch {
    // Fallback untuk in-app browser (Instagram/WhatsApp/TikTok) atau non-secure context
    try {
      const textarea = document.createElement('textarea')
      textarea.value = number
      textarea.setAttribute('readonly', '')
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      textarea.style.pointerEvents = 'none'
      document.body.appendChild(textarea)
      textarea.focus()
      textarea.select()
      success = document.execCommand('copy')
      document.body.removeChild(textarea)
    } catch {
      success = false
    }
  }

  if (success) {
    copied.value = number
    setTimeout(() => {
      if (copied.value === number) copied.value = ''
    }, 2000)
  }
}
</script>

<template>
  <section id="tanda-kasih" class="tanda-kasih-page">
    <div class="tanda-kasih-container">
      <!-- Bagian Atas: Hijau Sage (#7f8963) -->
      <div class="top-section">
        <h2 class="title reveal" v-reveal="{ y: 18 }">
          {{ wedding.giftPage.title }}
        </h2>

        <img
          :src="wedding.giftPage.icon"
          alt="Wedding Cake"
          class="icon-cake reveal"
          loading="lazy"
          v-reveal="{ delay: 120, scale: 0.9 }"
        />

        <p class="description reveal" v-reveal="{ delay: 180 }">
          {{ wedding.giftPage.description }} :
        </p>

        <!-- Daftar Kartu Bank -->
        <div class="bank-cards-list reveal" v-reveal="{ delay: 240, y: 24 }">
          <article
            v-for="account in wedding.giftPage.accounts"
            :key="account.number"
            class="bank-card"
          >
            <div class="bank-header">
              <div class="bank-details">
                <div class="bank-name">{{ account.bank }}</div>
                <div class="acc-number">No. Rekening {{ account.number }}</div>
                <div class="acc-name">a.n. <span class="holder-name">{{ account.holder }}</span></div>
              </div>
              <img
                :src="account.logo"
                :alt="account.bank"
                class="bank-logo"
                loading="lazy"
              />
            </div>

            <button
              type="button"
              class="copy-btn"
              :class="{ 'is-copied': copied === account.number }"
              @click="copyAccount(account.number)"
            >
              {{ copied === account.number ? 'Nomor rekening tersalin ✓' : 'Copy Nomor Rekening disini' }}
            </button>
          </article>
        </div>
      </div>

      <!-- Bagian Bawah: Dusty Pink (#dfc0c1) -->
      <div class="bottom-section">
        <p class="quote reveal" v-reveal="{ y: 20 }">
          {{ wedding.giftPage.closingMessage }}
        </p>
        <h3 class="couple-names reveal" v-reveal="{ delay: 120, scale: 0.94 }">
          {{ wedding.giftPage.closingName }}
        </h3>
      </div>
    </div>
  </section>
</template>

<style scoped>
.tanda-kasih-page {
  display: flex;
  min-height: 100svh;
  width: 100%;
  margin: 0;
  align-items: stretch;
  justify-content: center;
  background: #dfc0c1;
  padding: 0;
  font-family: 'Blossom', 'Montserrat', sans-serif;
}

.tanda-kasih-container {
  display: flex;
  box-sizing: border-box;
  width: 100%;
  min-height: 100svh;
  flex: 1;
  margin: 0;
  flex-direction: column;
}

/* BAGIAN ATAS: HIJAU SAGE */
.top-section {
  display: flex;
  box-sizing: border-box;
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: clamp(3.5rem, 7vh, 5.5rem) clamp(1.25rem, 4vw, 2.5rem);
  background: #7f8963;
  color: #ffffff;
  text-align: center;
}

.title {
  margin: 0 0 1.5rem;
  font-family: 'Allura', cursive;
  font-size: clamp(4.5rem, 10vw, 7rem);
  font-weight: 400;
  line-height: 1.15;
  color: #ffffff;
  text-shadow: 1px 1px 4px rgb(0 0 0 / 14%);
}

.icon-cake {
  display: block;
  width: clamp(9rem, 12vw, 13rem);
  height: clamp(9rem, 12vw, 13rem);
  margin: 0 auto 1.75rem;
  object-fit: contain;
  opacity: 0.95;
}

.description {
  margin: 0 auto clamp(2rem, 4vh, 3rem);
  width: min(100%, 720px);
  font-family: 'Roboto', 'Montserrat', sans-serif;
  font-size: clamp(1.05rem, 1.8vw, 1.35rem);
  line-height: 1.75;
  color: #ffffff;
  opacity: 0.95;
}

/* LIST KARTU BANK */
.bank-cards-list {
  display: flex;
  flex-direction: column;
  gap: clamp(1.25rem, 2.5vw, 1.75rem);
  width: min(94%, 820px);
  margin: 0 auto;
}

/* KARTU BANK PUTIH ELEGAN SESUAI REFERENSI */
.bank-card {
  box-sizing: border-box;
  width: 100%;
  border-radius: 12px;
  background: #ffffff;
  padding: clamp(2.25rem, 4.5vw, 3.5rem) clamp(2rem, 5vw, 3.75rem) clamp(1.85rem, 3.8vw, 2.75rem);
  color: #2d3722;
  text-align: left;
  box-shadow: 0 14px 38px rgb(0 0 0 / 16%);
  transition: transform 300ms ease, box-shadow 300ms ease;
}

.bank-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 18px 46px rgb(0 0 0 / 22%);
}

.bank-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.75rem;
  margin-bottom: clamp(1.75rem, 3.5vw, 2.5rem);
}

.bank-details {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 0.35rem;
}

.bank-name {
  font-family: 'Marcellus', serif;
  font-size: clamp(1.15rem, 1.6vw, 1.35rem);
  font-weight: 400;
  color: #37442d;
  line-height: 1.3;
}

.acc-number {
  font-family: 'Marcellus', serif;
  font-size: clamp(1.2rem, 1.7vw, 1.45rem);
  font-weight: 400;
  color: #1e1e1e;
  line-height: 1.3;
  letter-spacing: 0.02em;
}

.acc-name {
  font-family: 'Roboto', 'Montserrat', sans-serif;
  font-size: clamp(0.92rem, 1.25vw, 1.05rem);
  font-weight: 400;
  color: #1a1a1a;
  margin-top: 4px;
}

.acc-name .holder-name {
  font-weight: 700;
}

.bank-logo {
  width: clamp(170px, 24vw, 260px);
  max-height: 105px;
  flex-shrink: 0;
  object-fit: contain;
}

/* TOMBOL PILL DUSTY ROSE SESUAI REFERENSI */
.copy-btn {
  display: block;
  width: 100%;
  border: 0;
  border-radius: 9999px;
  background: #dfc0c1;
  padding: clamp(0.75rem, 1.5vw, 0.95rem) 1.5rem;
  color: #ffffff;
  cursor: pointer;
  font-family: 'Montserrat', sans-serif;
  font-size: clamp(0.85rem, 1.2vw, 0.98rem);
  font-weight: 500;
  letter-spacing: 0.01em;
  text-align: center;
  transition: all 250ms ease;
  box-shadow: 0 4px 14px rgb(223 192 193 / 40%);
}

.copy-btn:hover {
  background: #d4abb0;
  transform: translateY(-2px);
  box-shadow: 0 8px 22px rgb(223 192 193 / 55%);
}

.copy-btn:active {
  transform: translateY(0);
}

.copy-btn.is-copied {
  background: #6a7c4f;
  box-shadow: 0 6px 16px rgb(106 124 79 / 45%);
}

/* BAGIAN BAWAH: DUSTY PINK */
.bottom-section {
  display: flex;
  box-sizing: border-box;
  width: 100%;
  flex: 1 0 auto;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #dfc0c1;
  padding: clamp(3.5rem, 8vh, 6rem) clamp(1.25rem, 5vw, 3rem) clamp(3.5rem, 8vh, 6rem);
  color: #ffffff;
  text-align: center;
}

.quote {
  width: min(100%, 780px);
  margin: 0 auto clamp(1.25rem, 2.5vh, 2rem);
  font-family: 'Blossom', 'Marcellus', serif;
  font-size: clamp(1.25rem, 2.3vw, 1.85rem);
  line-height: 1.65;
  color: #ffffff;
  opacity: 0.98;
  text-shadow: 0 1px 2px rgb(0 0 0 / 8%);
}

.couple-names {
  margin: 0;
  font-family: 'Allura', cursive;
  font-size: clamp(3.5rem, 8.5vw, 5.5rem);
  font-weight: 400;
  color: #ffffff;
  line-height: 1.15;
  text-shadow: 1px 1px 3px rgb(0 0 0 / 12%);
}

/* RESPONSIVE MOBILE */
@media (max-width: 520px) {
  .top-section {
    padding: 3rem 1.15rem 3.5rem;
  }

  .title {
    font-size: clamp(3.8rem, 16vw, 4.8rem);
  }

  .icon-cake {
    width: 8.5rem;
    height: 8.5rem;
  }

  .description {
    font-size: 1rem;
    line-height: 1.6;
  }

  .bank-card {
    padding: 1.65rem 1.35rem 1.35rem;
    border-radius: 10px;
  }

  .bank-header {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 0.85rem;
    margin-bottom: 1.35rem;
  }

  .bank-name {
    font-size: 1.15rem;
    font-weight: 400;
  }

  .acc-number {
    font-size: 1.25rem;
    font-weight: 400;
  }

  .acc-name {
    font-size: 0.95rem;
  }

  .bank-logo {
    width: clamp(120px, 32vw, 165px);
    max-height: 70px;
  }

  .copy-btn {
    padding: 0.85rem 1.25rem;
    font-size: 0.88rem;
  }

  .bottom-section {
    padding: 3.5rem 1.15rem 4rem;
    flex: 1 0 auto;
  }
}

@media (max-width: 380px) {
  .bank-header {
    gap: 0.65rem;
  }

  .bank-name {
    font-size: 1.05rem;
  }

  .acc-number {
    font-size: 1.15rem;
  }

  .bank-logo {
    width: clamp(110px, 30vw, 142px);
    max-height: 62px;
  }
}
</style>
