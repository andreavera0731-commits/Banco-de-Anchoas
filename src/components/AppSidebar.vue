<template>
  <v-navigation-drawer
    permanent
    rail
    expand-on-hover
    width="200"
    :style="{ borderRight: '1px solid var(--bda-border-color)' }"
  >
    <v-list density="compact" nav class="pa-1">
      <v-list-item
        :to="{ name: 'dashboard' }"
        prepend-icon="mdi-view-dashboard-outline"
        :title="t('nav.dashboard')"
        rounded="lg"
        color="primary"
      />
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<style scoped>
.v-list-item {
  min-height: 40px;
  padding-inline: 8px !important;
  text-decoration: none !important;
  overflow: hidden;
}

.v-list-item :deep(.v-list-item__content) {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.v-list-item :deep(.v-list-item__prepend) {
  margin-inline-end: 8px !important;
  width: 24px;
  min-width: 24px;
}

.v-list-item :deep(.v-list-item__prepend .v-icon) {
  margin-inline-end: 0 !important;
}
</style>
