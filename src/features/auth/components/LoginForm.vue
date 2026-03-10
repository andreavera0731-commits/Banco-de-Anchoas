<template>
  <div class="login-form-wrapper">
    <!-- Header -->
    <div class="login-header">
      <div class="login-logo">
        <v-icon icon="mdi-package-variant-closed" size="34" color="#b8860b" />
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
          variant="outlined"
          density="comfortable"
          prepend-inner-icon="mdi-email-outline"
          hide-details="auto"
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
          variant="outlined"
          density="comfortable"
          prepend-inner-icon="mdi-lock-outline"
          :append-inner-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
          hide-details="auto"
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
          class="remember-checkbox"
        />
        <a href="#" class="forgot-link">{{ t('auth.forgotPassword') }}</a>
      </div>

      <!-- Error message -->
      <v-alert
        v-if="error"
        type="error"
        variant="tonal"
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
        class="login-btn"
        rounded="lg"
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
  margin-bottom: 40px;
}

.login-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 0;
}

.logo-text {
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: #1a1a1a;
}

.lang-toggle {
  font-size: 0.78rem;
  font-weight: 600;
  color: #888;
  background: transparent;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 4px 12px;
  cursor: pointer;
  letter-spacing: 0.04em;
  transition: all 0.2s;
}

.lang-toggle:hover {
  color: #b8860b;
  border-color: #b8860b;
}

.login-heading {
  font-size: 1.75rem;
  font-weight: 800;
  color: #1a1a1a;
  letter-spacing: -0.03em;
  margin-bottom: 6px;
}

.login-subheading {
  font-size: 0.875rem;
  color: #888;
  margin-bottom: 32px;
}

.field-group {
  margin-bottom: 20px;
}

.field-label {
  display: block;
  font-size: 0.8rem;
  font-weight: 600;
  color: #444;
  margin-bottom: 6px;
  letter-spacing: 0.01em;
}

.form-options {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 28px;
}

.remember-checkbox :deep(.v-label) {
  font-size: 0.825rem;
  color: #666;
}

.forgot-link {
  font-size: 0.8rem;
  font-weight: 500;
  color: #b8860b;
  text-decoration: none;
  transition: color 0.2s;
  white-space: nowrap;
}

.forgot-link:hover {
  color: #d4a84b;
  text-decoration: underline;
}

.error-alert {
  margin-bottom: 20px;
}

.login-btn {
  background: linear-gradient(135deg, #b8860b, #d4a84b) !important;
  color: #1a1a1a !important;
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0;
  font-size: 0.95rem;
  height: 48px !important;
  box-shadow: 0 4px 16px rgba(184, 134, 11, 0.25);
  transition: all 0.25s ease;
}

.login-btn:hover {
  background: linear-gradient(135deg, #9a7209, #b8860b) !important;
  box-shadow: 0 6px 20px rgba(184, 134, 11, 0.35);
  transform: translateY(-1px);
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
