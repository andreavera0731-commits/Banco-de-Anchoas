<template>
  <div class="bda-table-wrapper">
    <!-- Toolbar slot -->
    <div v-if="$slots.toolbar" class="bda-table-toolbar">
      <slot name="toolbar" />
    </div>

    <!-- Loading skeleton -->
    <div v-if="loading && items.length === 0" class="bda-table-skeleton">
      <v-skeleton-loader type="table-heading" />
      <v-skeleton-loader v-for="n in skeletonRows" :key="n" type="list-item" />
    </div>

    <!-- Empty state -->
    <div v-else-if="items.length === 0 && !loading" class="bda-empty-state">
      <slot name="empty">
        <v-icon icon="mdi-database-off-outline" size="48" class="mb-3 text-medium-emphasis" />
        <p class="text-body-1 text-medium-emphasis">{{ noDataText }}</p>
      </slot>
    </div>

    <!-- Table -->
    <v-data-table
      v-else
      v-bind="$attrs"
      :headers="headers"
      :items="items"
      :search="search"
      :loading="loading"
      :no-data-text="noDataText"
      :items-per-page="itemsPerPage"
      class="bda-data-table"
    >
      <template v-for="(_, name) in $slots" :key="name" #[name]="slotData">
        <slot :name="name" v-bind="slotData ?? {}" />
      </template>
    </v-data-table>
  </div>
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false })

withDefaults(defineProps<{
  headers: Array<{ title: string; key: string; sortable?: boolean; align?: 'start' | 'end' | 'center' }>
  items: Array<Record<string, unknown>>
  search?: string
  loading?: boolean
  noDataText?: string
  itemsPerPage?: number
  skeletonRows?: number
}>(), {
  skeletonRows: 5,
})
</script>

<style scoped>
.bda-table-wrapper {
  border: 1px solid var(--bda-border-color);
  border-radius: var(--bda-radius-md);
  overflow: hidden;
  background: rgb(var(--v-theme-surface));
}

.bda-table-toolbar {
  padding: var(--bda-space-3) var(--bda-space-4);
  border-bottom: 1px solid var(--bda-border-color);
}

.bda-table-skeleton {
  padding: var(--bda-space-2) var(--bda-space-4);
}

.bda-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--bda-space-10) var(--bda-space-4);
}

.bda-data-table {
  --v-table-header-height: 44px;
  --v-table-row-height: 48px;
}

.bda-data-table :deep(thead) {
  background: rgb(var(--v-theme-surface-variant));
}

.bda-data-table :deep(thead th) {
  font-size: var(--bda-font-caption) !important;
  font-weight: var(--bda-font-weight-semibold) !important;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--bda-text-secondary) !important;
  border-bottom: 1px solid var(--bda-border-color) !important;
  white-space: nowrap;
}

.bda-data-table :deep(tbody td) {
  font-size: var(--bda-font-body);
  border-bottom: 1px solid var(--bda-border-color) !important;
}

.bda-data-table :deep(tbody tr:last-child td) {
  border-bottom: none !important;
}

.bda-data-table :deep(tbody tr:hover) {
  background: rgb(var(--v-theme-surface-variant) / 0.5) !important;
}

.bda-data-table :deep(.v-data-table-footer) {
  border-top: 1px solid var(--bda-border-color);
}
</style>
