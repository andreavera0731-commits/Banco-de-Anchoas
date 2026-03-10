<template>
  <v-card elevation="4" class="login-card">
    <v-card-title class="text-center text-h5 font-weight-bold pa-8">
      Banco de Anchoas
    </v-card-title>
    <v-card-text class="pa-8">
      <v-form ref="form" @submit.prevent="handleLogin">
        <v-text-field
          v-model="email"
          label="Email"
          type="email"
          :rules="validators.email"
          variant="outlined"
          size="large"
          class="mb-4"
          required
        />
        <v-text-field
          v-model="password"
          label="Contraseña"
          type="password"
          :rules="validators.password"
          variant="outlined"
          size="large"
          class="mb-4"
          required
        />
        <div v-if="error" class="text-error mb-6 text-center">{{ error }}</div>
        <v-btn
          type="submit"
          block
          color="primary"
          size="large"
          :loading="isLoading"
          @click="handleLogin"
        >
          Entrar
        </v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.login-card {
  min-height: 400px;
  display: flex;
  flex-direction: column;
}
</style>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { formValidationRules } from '@/utils/validators'

const router = useRouter()
const { login, isLoading, error } = useAuth()

const email = ref('')
const password = ref('')
const validators = formValidationRules

const form = ref(null)

async function handleLogin() {
  const success = await login({ email: email.value, password: password.value })
  if (success) {
    router.push({ name: 'dashboard' })
  }
}
</script>
