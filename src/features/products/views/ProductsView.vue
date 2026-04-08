<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <h1 class="text-h5 font-weight-bold mb-4">{{ t('products.title') }}</h1>
        <v-card variant="outlined">
          <v-card-text class="text-center text-medium-emphasis py-16">
            <v-icon icon="mdi-package-variant" size="64" class="mb-4" />
            <p>{{ t('products.placeholder') }}</p>
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
