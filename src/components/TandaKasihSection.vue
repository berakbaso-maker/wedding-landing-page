<script setup>
import { ref } from 'vue'
import { wedding } from '../data/wedding'

const copied = ref('')

const copyAccount = async (number) => {
  try {
    await navigator.clipboard.writeText(number)
    copied.value = number
    setTimeout(() => {
      if (copied.value === number) copied.value = ''
    }, 2000)
  } catch {
    copied.value = ''
  }
}
</script>

<template>
  <section id="tanda-kasih" class="tanda-kasih-page">
    <div class="tanda-kasih-container">
      <div class="top-section">
        <h2 class="title">{{ wedding.giftPage.title }}</h2>

        <img
          :src="wedding.giftPage.icon"
          alt=""
          class="icon-cake"
        />

        <p class="description">
          {{ wedding.giftPage.description }} :
        </p>

        <div class="bank-card">
          <article
            v-for="account in wedding.giftPage.accounts"
            :key="account.number"
            class="bank-item"
          >
            <div class="bank-header">
              <div class="bank-details">
                <div class="bank-name">{{ account.bank }}</div>
                <div class="acc-number">No. Rekening {{ account.number }}</div>
                <div class="acc-name">a.n. {{ account.holder }}</div>
              </div>
              <img :src="account.logo" :alt="account.bank" class="bank-logo" />
            </div>

            <button type="button" class="copy-btn" @click="copyAccount(account.number)">
              {{ copied === account.number ? 'Nomor rekening tersalin' : 'Copy Nomor Rekening disini' }}
            </button>
          </article>
        </div>
      </div>

      <div class="bottom-section">
        <p class="quote">{{ wedding.giftPage.closingMessage }}</p>
        <h3 class="couple-names">{{ wedding.giftPage.closingName }}</h3>
      </div>
    </div>
  </section>
</template>

<style scoped>
.tanda-kasih-page {
  display: flex;
  min-height: 0;
  width: 100%;
  margin: 0;
  align-items: flex-start;
  justify-content: center;
  background: #dfc0c1;
  padding: 0;
  font-family: 'Montserrat', sans-serif;
  box-shadow: 0 -12px 24px rgb(0 0 0 / 18%), 0 12px 24px rgb(0 0 0 / 18%);
}

.tanda-kasih-container {
  display: flex;
  box-sizing: border-box;
  width: 100%;
  max-width: none;
  min-height: clamp(720px, 100vh, 980px);
  margin: 0;
  flex-direction: column;
  overflow: hidden;
  background: #7a8b68;
  box-shadow: 0 4px 15px rgb(255 255 255 / 10%);
}

.top-section {
  display: flex;
  box-sizing: border-box;
  width: 100%;
  min-height: clamp(520px, 72vh, 700px);
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: clamp(2rem, 6vw, 4rem) clamp(1rem, 5vw, 4rem);
  color: #fff;
  text-align: center;
}

.title {
  margin: 0 0 1.25rem;
  font-family: 'Great Vibes', cursive;
  font-size: clamp(3rem, 7vw, 4.5rem);
  font-weight: 400;
  text-shadow: 1px 1px 2px rgb(0 0 0 / 10%);
}

.icon-cake {
  display: block;
  width: clamp(8rem, 10vw, 10rem);
  height: clamp(8rem, 10vw, 10rem);
  margin: 0 auto 1.25rem;
  object-fit: contain;
  opacity: 0.9;
}

.description {
  margin: 0 auto 1.875rem;
  width: min(100%, 620px);
  font-size: 0.8rem;
  line-height: 1.5;
  opacity: 0.9;
}

.bank-card {
  box-sizing: border-box;
  width: min(100%, 680px);
  border-radius: 8px;
  background: #fff;
  padding: clamp(1.25rem, 3vw, 2rem);
  color: #333;
  text-align: left;
  box-shadow: 0 5px 15px rgb(0 0 0 / 10%);
}

.bank-item {
  margin-bottom: clamp(1.25rem, 2vw, 1.5rem);
  border-bottom: 1px solid rgb(0 0 0 / 10%);
  padding-bottom: clamp(1.25rem, 2vw, 1.5rem);
}

.bank-item:last-child {
  margin-bottom: 0;
  border-bottom: 0;
  padding-bottom: 0;
}

.bank-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.9375rem;
}

.bank-details {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 0.3125rem;
}

.bank-name,
.acc-number {
  font-family: 'Marcellus', serif;
  font-size: clamp(1rem, 1.8vw, 1.2rem);
}

.bank-name {
  color: #555;
}

.acc-name {
  font-size: clamp(0.8rem, 1.3vw, 0.9rem);
  font-weight: 600;
}

.bank-logo {
  width: clamp(110px, 13vw, 150px);
  max-height: 60px;
  flex-shrink: 0;
  object-fit: contain;
}

.copy-btn {
  width: 100%;
  border: 0;
  border-radius: 20px;
  background: #dfc0c1;
  padding: 0.75rem;
  color: #fff;
  cursor: pointer;
  font-family: 'Montserrat', sans-serif;
  font-size: 0.85rem;
  transition: opacity 0.3s ease;
}

.copy-btn:hover {
  opacity: 0.8;
}

.bottom-section {
  display: flex;
  min-height: clamp(200px, 28vh, 280px);
  box-sizing: border-box;
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #dfc0c1;
  padding: clamp(2rem, 6vh, 3.125rem) clamp(1rem, 5vw, 4rem);
  color: #fff;
  text-align: center;
}

.quote {
  width: min(100%, 760px);
  margin: 0 auto 1.25rem;
  font-family: 'Marcellus', serif;
  font-size: 0.9rem;
  line-height: 1.6;
  opacity: 0.9;
}

.couple-names {
  margin: 0;
  font-family: 'Great Vibes', cursive;
  font-size: 3rem;
  font-weight: 400;
  text-shadow: 1px 1px 2px rgb(0 0 0 / 10%);
}

@media (max-width: 480px) {
  .top-section {
    padding: 2rem 1rem;
  }

  .bank-header {
    flex-direction: column;
  }

  .bank-logo {
    align-self: flex-end;
  }
}

</style>
