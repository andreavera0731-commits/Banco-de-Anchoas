<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <h1 class="text-h5 font-weight-bold mb-4">{{ t('notifications.title') }}</h1>
        <v-card variant="outlined">
          <v-card-text class="text-center text-medium-emphasis py-16">
            <v-icon icon="mdi-bell-outline" size="64" class="mb-4" />
            <p>{{ t('notifications.placeholder') }}</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>
