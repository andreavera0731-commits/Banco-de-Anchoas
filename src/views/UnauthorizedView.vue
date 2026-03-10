<template>
  <div class="unauthorized-view">
    <v-container fluid class="fill-height d-flex align-center justify-center">
      <v-col cols="12" class="text-center">
        <h1>{{ t('unauthorized.title') }}</h1>
        <p>{{ t('unauthorized.message') }}</p>
        <v-btn color="primary" :to="{ name: 'dashboard' }">
          {{ t('unauthorized.backToDashboard') }}
        </v-btn>
      </v-col>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<style scoped>
.unauthorized-view {
  width: 100%;
  height: 100%;
}
</style>
