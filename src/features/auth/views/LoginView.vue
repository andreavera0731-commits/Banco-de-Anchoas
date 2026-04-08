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
  padding: var(--bda-space-12) var(--bda-space-10);
  background-color: rgb(var(--v-theme-background));
  transition: background-color var(--bda-transition-base);
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
  padding: var(--bda-space-16) 56px;
  position: relative;
  overflow: hidden;
  border-radius: var(--bda-radius-2xl) 0 0 var(--bda-radius-2xl);
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
  gap: var(--bda-space-6);
}

/* Icon */
.promo-icon-wrapper {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--bda-radius-xl);
  background: rgba(184, 134, 11, 0.1);
  border: 1px solid rgba(184, 134, 11, 0.15);
}

.promo-icon {
  color: #d4a84b;
}

.promo-title {
  font-size: 1.85rem;
  font-weight: var(--bda-font-weight-extrabold);
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
  gap: var(--bda-space-3);
}

.feature-pill {
  display: flex;
  align-items: center;
  gap: var(--bda-space-2);
  padding: var(--bda-space-2) 14px;
  border-radius: var(--bda-radius-pill);
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.7);
  font-size: var(--bda-font-caption);
  font-weight: var(--bda-font-weight-medium);
  letter-spacing: 0.01em;
  transition: all var(--bda-transition-fast);
}

.feature-pill:hover {
  background: rgba(184, 134, 11, 0.12);
  border-color: rgba(184, 134, 11, 0.25);
  color: #d4a84b;
}

/* Promo card */
.promo-card {
  background: rgba(184, 134, 11, 0.07);
  border: 1px solid rgba(184, 134, 11, 0.15);
  border-radius: var(--bda-radius-xl);
  padding: var(--bda-space-5) var(--bda-space-6);
  display: flex;
  gap: var(--bda-space-4);
  align-items: flex-start;
  backdrop-filter: blur(10px);
  transition: border-color var(--bda-transition-fast);
}

.promo-card:hover {
  border-color: rgba(184, 134, 11, 0.3);
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
  font-weight: var(--bda-font-weight-bold);
  color: #fff;
  line-height: 1.3;
  margin-bottom: var(--bda-space-2);
}

.promo-card-text {
  font-size: var(--bda-font-caption);
  color: rgba(255, 255, 255, 0.45);
  line-height: 1.5;
}

/* Responsive */
@media (max-width: 960px) {
  .login-left {
    padding: var(--bda-space-8) var(--bda-space-6);
  }

  .login-right {
    display: none;
  }
}
</style>
