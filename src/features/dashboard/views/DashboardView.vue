<template>
  <div class="dashboard-view">
    <v-container>
      <v-row>
        <v-col cols="12">
          <h1>Dashboard</h1>
          <p>Bienvenido, {{ user?.name }}</p>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/features/auth/stores/auth.store'

const auth = useAuthStore()
const user = auth.user
</script>

<style scoped>
.dashboard-view {
  padding: 20px;
}
</style>
