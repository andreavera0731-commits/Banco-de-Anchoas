<template>
  <div class="dashboard-view">
    <v-container>
      <v-row>
        <v-col cols="12">
          <h1>{{ t('dashboard.title') }}</h1>
          <p>{{ t('dashboard.welcome', { name: user?.name }) }}</p>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/features/auth/stores/auth.store'

const { t } = useI18n()
const auth = useAuthStore()
const user = auth.user
</script>

<style scoped>
.dashboard-view {
  padding: 20px;
}
</style>
