<template>
  <v-app-bar color="primary" dark>
    <v-app-bar-title>Banco de Anchoas</v-app-bar-title>
    <v-spacer></v-spacer>
    <v-menu>
      <template #activator="{ props }">
        <v-btn icon v-bind="props">
          <v-icon>mdi-account</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item @click="handleLogout">
          <v-list-item-title>Salir</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/features/auth/stores/auth.store'

const router = useRouter()
const auth = useAuthStore()

function handleLogout() {
  auth.logout()
  router.push({ name: 'login' })
}
</script>
