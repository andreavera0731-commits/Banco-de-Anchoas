<template>
  <div class="login-view">
    <!-- Left: Form side -->
    <div class="login-left">
      <div class="login-left-content">
        <LoginForm />
      </div>
    </div>

    <!-- Right: Promo side -->
    <div class="login-right d-none d-md-flex">
      <div class="promo-content">
        <!-- Icon -->
        <div class="promo-icon-wrapper">
          <v-icon icon="mdi-package-variant-closed" size="64" class="promo-icon" />
        </div>

        <h2 class="promo-title">
          <span v-for="(line, i) in promoTitleLines" :key="i">
            {{ line }}<br v-if="i < promoTitleLines.length - 1" />
          </span>
        </h2>
        <p class="promo-description">
          {{ t('promo.description') }}
        </p>

        <!-- Feature pills -->
        <div class="feature-pills">
          <div class="feature-pill">
            <v-icon icon="mdi-warehouse" size="18" />
            <span>{{ t('promo.warehouse') }}</span>
          </div>
          <div class="feature-pill">
            <v-icon icon="mdi-barcode-scan" size="18" />
            <span>{{ t('promo.tracking') }}</span>
          </div>
          <div class="feature-pill">
            <v-icon icon="mdi-truck-outline" size="18" />
            <span>{{ t('promo.logistics') }}</span>
          </div>
          <div class="feature-pill">
            <v-icon icon="mdi-chart-line" size="18" />
            <span>{{ t('promo.reports') }}</span>
          </div>
        </div>

        <!-- Promo card -->
        <div class="promo-card">
          <v-icon icon="mdi-shield-check-outline" size="28" class="promo-card-icon" />
          <div class="promo-card-content">
            <h3 class="promo-card-title">
              {{ t('promo.cardTitle') }}
            </h3>
            <p class="promo-card-text">
              {{ t('promo.cardDescription') }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import LoginForm from '../components/LoginForm.vue'

const { t } = useI18n()

const promoTitleLines = computed(() => t('promo.title').split('\n'))
</script>

<style scoped>
.login-view {
  display: flex;
  min-height: 100vh;
  width: 100%;
}

/* Left side */
.login-left {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 40px;
  background-color: #faf8f5;
}

.login-left-content {
  width: 100%;
  max-width: 400px;
}

/* Right side */
.login-right {
  flex: 1;
  background: #0d0b08;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 64px 56px;
  position: relative;
  overflow: hidden;
  border-radius: 24px 0 0 24px;
}

.login-right::before {
  content: '';
  position: absolute;
  top: -20%;
  right: -10%;
  width: 60%;
  height: 60%;
  background: linear-gradient(135deg, rgba(184, 134, 11, 0.06) 0%, transparent 60%);
  border-radius: 50%;
  pointer-events: none;
}

.login-right::after {
  content: '';
  position: absolute;
  bottom: 5%;
  right: 10%;
  width: 200px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(184, 134, 11, 0.25), transparent);
  transform: rotate(-30deg);
  pointer-events: none;
}

.promo-content {
  position: relative;
  z-index: 1;
  max-width: 440px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Icon */
.promo-icon-wrapper {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  background: rgba(184, 134, 11, 0.1);
  border: 1px solid rgba(184, 134, 11, 0.15);
}

.promo-icon {
  color: #d4a84b;
}

.promo-title {
  font-size: 1.85rem;
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.03em;
  line-height: 1.2;
}

.promo-description {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.55);
  line-height: 1.65;
}

/* Feature pills */
.feature-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.feature-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.78rem;
  font-weight: 500;
  letter-spacing: 0.01em;
}

/* Promo card */
.promo-card {
  background: rgba(184, 134, 11, 0.07);
  border: 1px solid rgba(184, 134, 11, 0.15);
  border-radius: 16px;
  padding: 20px 24px;
  display: flex;
  gap: 16px;
  align-items: flex-start;
  backdrop-filter: blur(10px);
}

.promo-card-icon {
  color: #d4a84b;
  flex-shrink: 0;
  margin-top: 2px;
}

.promo-card-content {
  flex: 1;
  min-width: 0;
}

.promo-card-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: #fff;
  line-height: 1.3;
  margin-bottom: 6px;
}

.promo-card-text {
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.45);
  line-height: 1.5;
}

/* Responsive */
@media (max-width: 960px) {
  .login-left {
    padding: 32px 24px;
  }

  .login-right {
    display: none;
  }
}
</style>
