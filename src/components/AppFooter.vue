<template>
  <v-footer>
    <v-container>
      <v-row>
        <v-col cols="12" class="text-center">
          <p class="mb-0">{{ t('app.copyright') }}</p>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>
