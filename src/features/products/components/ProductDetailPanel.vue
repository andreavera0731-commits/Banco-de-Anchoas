<template>
  <div class="detail-panel">
    <!-- Header -->
    <div class="d-flex align-center ga-2 mb-1">
      <v-btn icon="mdi-close" size="x-small" variant="text" @click="$emit('close')" />
      <span class="text-body-1 font-weight-bold" style="color: rgb(var(--v-theme-primary));">
        {{ t('products.detailTitle') }}
      </span>
    </div>

    <!-- Loading -->
    <template v-if="loading">
      <v-skeleton-loader type="list-item-avatar, divider, list-item-three-line, divider, list-item-three-line" />
    </template>

    <template v-else-if="product">
      <!-- Product identity -->
      <div class="d-flex align-center ga-3 mb-4 mt-2">
        <v-avatar size="40" color="primary" variant="tonal">
          <v-icon icon="mdi-package-variant" size="22" />
        </v-avatar>
        <div style="min-width: 0;">
          <p class="text-body-1 font-weight-bold text-truncate">{{ product.name }}</p>
          <p class="text-caption text-medium-emphasis">{{ product.sku }} · {{ product.categoryName }}</p>
        </div>
      </div>

      <!-- Low stock alert -->
      <v-alert
        v-if="product.stock <= product.minimumStock && product.minimumStock > 0"
        type="warning"
        variant="tonal"
        density="compact"
        class="mb-4"
        prepend-icon="mdi-alert"
      >
        {{ t('products.lowStockWarning') }} — {{ product.stock }} / {{ product.minimumStock }} {{ product.unit }}
      </v-alert>

      <!-- General info -->
      <div class="detail-section mb-3">
        <div class="d-flex align-center ga-2 mb-2">
          <v-avatar size="24" color="primary" variant="tonal">
            <v-icon icon="mdi-information-outline" size="14" />
          </v-avatar>
          <span class="text-caption font-weight-bold">{{ t('products.generalInfo') }}</span>
        </div>
        <div class="detail-fields">
          <div class="detail-field">
            <span class="text-caption text-medium-emphasis">{{ t('products.description') }}</span>
            <span class="text-caption">{{ product.description ?? t('products.noDescription') }}</span>
          </div>
          <div class="detail-field">
            <span class="text-caption text-medium-emphasis">{{ t('products.barcode') }}</span>
            <span class="text-caption">{{ product.barcode ?? t('products.noBarcode') }}</span>
          </div>
        </div>
      </div>

      <!-- Inventory -->
      <div class="detail-section mb-3">
        <div class="d-flex align-center ga-2 mb-2">
          <v-avatar size="24" color="primary" variant="tonal">
            <v-icon icon="mdi-warehouse" size="14" />
          </v-avatar>
          <span class="text-caption font-weight-bold">{{ t('products.inventoryInfo') }}</span>
        </div>
        <div class="detail-fields">
          <div class="detail-field">
            <span class="text-caption text-medium-emphasis">{{ t('products.unit') }}</span>
            <span class="text-caption">{{ t(`products.units.${product.unit}`) }}</span>
          </div>
          <div class="detail-field">
            <span class="text-caption text-medium-emphasis">{{ t('products.stock') }}</span>
            <v-chip
              size="x-small"
              :color="getStockColor(product.stock, product.minimumStock)"
              variant="tonal"
              label
            >
              {{ product.stock }} {{ product.unit }}
            </v-chip>
          </div>
          <div class="detail-field">
            <span class="text-caption text-medium-emphasis">{{ t('products.minimumStock') }}</span>
            <span class="text-caption">{{ product.minimumStock }} {{ product.unit }}</span>
          </div>
        </div>
      </div>

      <!-- Commercial -->
      <div class="detail-section mb-3">
        <div class="d-flex align-center ga-2 mb-2">
          <v-avatar size="24" color="primary" variant="tonal">
            <v-icon icon="mdi-currency-eur" size="14" />
          </v-avatar>
          <span class="text-caption font-weight-bold">{{ t('products.commercialInfo') }}</span>
        </div>
        <div class="detail-fields">
          <div class="detail-field">
            <span class="text-caption text-medium-emphasis">{{ t('products.price') }}</span>
            <span class="text-caption">{{ product.price != null ? formatCurrency(product.price) : t('products.noPrice') }}</span>
          </div>
          <div class="detail-field">
            <span class="text-caption text-medium-emphasis">{{ t('products.supplier') }}</span>
            <span class="text-caption">{{ product.supplier ?? t('products.noSupplier') }}</span>
          </div>
          <div class="detail-field">
            <span class="text-caption text-medium-emphasis">{{ t('products.expirationDate') }}</span>
            <span class="text-caption">{{ product.expirationDate ? formatDate(product.expirationDate) : t('products.noExpiration') }}</span>
          </div>
        </div>
      </div>

      <!-- Location -->
      <div class="detail-section mb-4">
        <div class="d-flex align-center ga-2 mb-2">
          <v-avatar size="24" color="primary" variant="tonal">
            <v-icon icon="mdi-map-marker-outline" size="14" />
          </v-avatar>
          <span class="text-caption font-weight-bold">{{ t('products.locationInfo') }}</span>
        </div>
        <div class="detail-fields">
          <div class="detail-field">
            <span class="text-caption text-medium-emphasis">{{ t('products.sector') }}</span>
            <span class="text-caption">{{ product.defaultSectorId != null ? `#${product.defaultSectorId}` : t('products.noSector') }}</span>
          </div>
          <div class="detail-field">
            <span class="text-caption text-medium-emphasis">{{ t('products.createdAt') }}</span>
            <span class="text-caption">{{ formatDateTime(product.createdAt) }}</span>
          </div>
          <div v-if="product.updatedAt" class="detail-field">
            <span class="text-caption text-medium-emphasis">{{ t('products.updatedAt') }}</span>
            <span class="text-caption">{{ formatDateTime(product.updatedAt) }}</span>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="d-flex ga-2">
        <v-btn
          color="primary"
          size="small"
          variant="tonal"
          prepend-icon="mdi-pencil-outline"
          block
          @click="$emit('edit')"
        >
          {{ t('products.editProduct') }}
        </v-btn>
        <v-btn
          v-if="showDelete"
          color="error"
          size="small"
          variant="tonal"
          prepend-icon="mdi-delete-outline"
          block
          @click="$emit('delete')"
        >
          {{ t('products.deleteProduct') }}
        </v-btn>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { ProductDto } from '@/types/api.types'
import { formatDate, formatDateTime, formatCurrency, getStockColor } from '@/utils/formatters'

defineProps<{
  product: ProductDto | null
  loading?: boolean
  showDelete?: boolean
}>()

defineEmits<{
  close: []
  edit: []
  delete: []
}>()

const { t } = useI18n()
</script>

<style scoped>
.detail-panel {
  border: 1px solid var(--bda-border-color);
  border-radius: var(--bda-radius-md);
  padding: var(--bda-space-4) var(--bda-space-4);
  background: rgb(var(--v-theme-surface));
}

.detail-section {
  padding: var(--bda-space-3);
  border-radius: var(--bda-radius-sm);
  background: rgb(var(--v-theme-surface-variant) / 0.4);
}

.detail-fields {
  display: flex;
  flex-direction: column;
  gap: var(--bda-space-2);
}

.detail-field {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--bda-space-2);
}

.detail-field > span:first-child {
  flex-shrink: 0;
}

.detail-field > span:last-child,
.detail-field > .v-chip {
  text-align: right;
}
</style>
