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
        v-for="item in visibleItems"
        :key="item.route"
        :to="{ name: item.route }"
        :prepend-icon="item.icon"
        :title="t(item.titleKey)"
        rounded="lg"
        color="primary"
      />
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useNavigation } from '@/composables/useNavigation'

const { t } = useI18n()
const { visibleItems } = useNavigation()
</script>

<style scoped>
.v-navigation-drawer :deep(.v-list-item) {
  min-height: 40px;
  padding-inline: 8px !important;
  text-decoration: none !important;
  overflow: hidden;
}

.v-navigation-drawer :deep(.v-list-item__content) {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.v-navigation-drawer--is-hovering :deep(.v-list-item__content) {
  opacity: 1;
}

.v-navigation-drawer :deep(.v-list-item__prepend) {
  margin-inline-end: 8px !important;
  width: 24px;
  min-width: 24px;
}

.v-navigation-drawer :deep(.v-list-item__prepend .v-icon) {
  margin-inline-end: 0 !important;
}
</style>
