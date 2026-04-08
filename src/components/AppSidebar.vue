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
      <v-list-item
        :to="{ name: 'products' }"
        prepend-icon="mdi-package-variant"
        :title="t('nav.products')"
        rounded="lg"
        color="primary"
      />
      <v-list-item
        :to="{ name: 'stock' }"
        prepend-icon="mdi-swap-horizontal"
        :title="t('nav.stock')"
        rounded="lg"
        color="primary"
      />
      <v-list-item
        :to="{ name: 'warehouses' }"
        prepend-icon="mdi-warehouse"
        :title="t('nav.warehouses')"
        rounded="lg"
        color="primary"
      />
      <v-list-item
        :to="{ name: 'categories' }"
        prepend-icon="mdi-tag-multiple-outline"
        :title="t('nav.categories')"
        rounded="lg"
        color="primary"
      />
      <v-list-item
        :to="{ name: 'users' }"
        prepend-icon="mdi-account-group-outline"
        :title="t('nav.users')"
        rounded="lg"
        color="primary"
      />
      <v-list-item
        :to="{ name: 'notifications' }"
        prepend-icon="mdi-bell-outline"
        :title="t('nav.notifications')"
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
