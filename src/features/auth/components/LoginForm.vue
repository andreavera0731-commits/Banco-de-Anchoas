<template>
  <div class="login-form-wrapper">
    <!-- Header -->
    <div class="login-header">
      <div class="login-logo">
        <v-icon icon="mdi-package-variant-closed" size="34" color="primary" />
        <span class="logo-text">{{ t('app.name') }}</span>
      </div>
      <button type="button" class="lang-toggle" @click="toggleLocale">
        {{ locale === 'es' ? 'EN' : 'ES' }}
      </button>
    </div>

    <!-- Heading -->
    <h1 class="login-heading">{{ t('auth.signIn') }}</h1>
    <p class="login-subheading">{{ t('auth.subheading') }}</p>

    <!-- Form -->
    <v-form ref="form" @submit.prevent="handleLogin" class="login-form">
      <!-- Email -->
      <div class="field-group">
        <label class="field-label" for="login-email">{{ t('auth.email') }}</label>
        <v-text-field
          id="login-email"
          v-model="email"
          :placeholder="t('auth.emailPlaceholder')"
          type="email"
          :rules="validators.email"
          prepend-inner-icon="mdi-email-outline"
          required
        />
      </div>

      <!-- Password -->
      <div class="field-group">
        <label class="field-label" for="login-password">{{ t('auth.password') }}</label>
        <v-text-field
          id="login-password"
          v-model="password"
          :placeholder="t('auth.passwordPlaceholder')"
          :type="showPassword ? 'text' : 'password'"
          :rules="validators.password"
          prepend-inner-icon="mdi-lock-outline"
          :append-inner-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
          required
          @click:append-inner="showPassword = !showPassword"
        />
      </div>

      <!-- Remember + Forgot row -->
      <div class="form-options">
        <v-checkbox
          v-model="rememberMe"
          :label="t('auth.rememberMe')"
          density="compact"
          hide-details
          color="primary"
          class="remember-checkbox"
        />
        <a href="#" class="forgot-link">{{ t('auth.forgotPassword') }}</a>
      </div>

      <!-- Error message -->
      <v-alert
        v-if="error"
        type="error"
        density="compact"
        class="error-alert"
        closable
        @click:close="error = null"
      >
        {{ error }}
      </v-alert>

      <!-- Sign in button -->
      <v-btn
        type="submit"
        block
        size="large"
        :loading="isLoading"
        class="login-btn bda-gradient-btn"
      >
        {{ t('auth.signIn') }}
      </v-btn>
    </v-form>
  </div>
</template>

<style scoped>
.login-form-wrapper {
  width: 100%;
  max-width: 400px;
}

.login-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--bda-space-10);
}

.login-logo {
  display: flex;
  align-items: center;
  gap: var(--bda-space-3);
}

.logo-text {
  font-size: 1.05rem;
  font-weight: var(--bda-font-weight-bold);
  letter-spacing: -0.01em;
  color: var(--bda-text-primary);
}

.lang-toggle {
  font-size: var(--bda-font-caption);
  font-weight: var(--bda-font-weight-semibold);
  color: var(--bda-text-secondary);
  background: transparent;
  border: 1px solid var(--bda-border-color);
  border-radius: var(--bda-radius-sm);
  padding: var(--bda-space-1) var(--bda-space-3);
  cursor: pointer;
  letter-spacing: 0.04em;
  transition: all var(--bda-transition-fast);
}

.lang-toggle:hover {
  color: rgb(var(--v-theme-primary));
  border-color: rgb(var(--v-theme-primary));
}

.login-heading {
  font-size: 1.75rem;
  font-weight: var(--bda-font-weight-extrabold);
  color: var(--bda-text-primary);
  letter-spacing: -0.03em;
  margin-bottom: var(--bda-space-2);
}

.login-subheading {
  font-size: var(--bda-font-body);
  color: var(--bda-text-secondary);
  margin-bottom: var(--bda-space-8);
}

.field-group {
  margin-bottom: var(--bda-space-5);
}

.field-label {
  display: block;
  font-size: 0.8rem;
  font-weight: var(--bda-font-weight-semibold);
  color: var(--bda-text-primary);
  margin-bottom: var(--bda-space-2);
  letter-spacing: 0.01em;
}

.form-options {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--bda-space-6);
}

.remember-checkbox :deep(.v-label) {
  font-size: 0.825rem;
  color: var(--bda-text-secondary);
}

.forgot-link {
  font-size: 0.8rem;
  font-weight: var(--bda-font-weight-medium);
  color: rgb(var(--v-theme-primary));
  text-decoration: none;
  transition: color var(--bda-transition-fast);
  white-space: nowrap;
}

.forgot-link:hover {
  opacity: 0.8;
  text-decoration: underline;
}

.error-alert {
  margin-bottom: var(--bda-space-5);
}

.login-btn {
  font-size: 0.95rem;
  height: 48px !important;
}
</style>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { useValidationRules } from '@/utils/validators'

const { t, locale } = useI18n()

const router = useRouter()
const { login, isLoading, error } = useAuth()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const rememberMe = ref(false)
const validators = useValidationRules()

function toggleLocale() {
  locale.value = locale.value === 'es' ? 'en' : 'es'
}

const form = ref(null)

async function handleLogin() {
  const success = await login({ email: email.value, password: password.value })
  if (success) {
    router.push({ name: 'dashboard' })
  }
}
</script>
