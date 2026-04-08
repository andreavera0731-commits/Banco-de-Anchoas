<template>
  <v-container class="text-center py-16">
    <v-icon icon="mdi-alert-circle-outline" size="96" color="warning" class="mb-6" />
    <h1 class="text-h4 font-weight-bold mb-2">404</h1>
    <p class="text-body-1 text-medium-emphasis mb-6">{{ t('notFound.message') }}</p>
    <v-btn color="primary" :to="{ name: 'dashboard' }">
      {{ t('notFound.backToDashboard') }}
    </v-btn>
  </v-container>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>
