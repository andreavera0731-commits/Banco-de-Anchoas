<template>
  <v-footer class="app-footer">
    <span class="text-overline" style="color: var(--bda-text-secondary); font-size: 0.6rem;">
      {{ t('app.copyright') }}
    </span>
  </v-footer>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<style scoped>
.app-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 2px var(--bda-space-4);
  border-top: 1px solid var(--bda-border-color);
  background: transparent !important;
  min-height: 24px !important;
  max-height: 24px !important;
}
</style>
