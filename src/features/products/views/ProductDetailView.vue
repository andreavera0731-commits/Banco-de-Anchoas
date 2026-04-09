<template>
  <v-container fluid>
    <!-- Back + actions -->
    <div class="d-flex align-center mb-4">
      <v-btn variant="text" prepend-icon="mdi-arrow-left" :to="{ name: 'products' }">
        {{ t('products.backToList') }}
      </v-btn>
      <v-spacer />
      <v-btn
        color="primary"
        prepend-icon="mdi-pencil-outline"
        size="small"
        class="mr-2"
        @click="openEdit"
      >
        {{ t('products.editProduct') }}
      </v-btn>
      <v-btn
        v-if="auth.hasRole('Admin')"
        color="error"
        prepend-icon="mdi-delete-outline"
        size="small"
        @click="openDelete"
      >
        {{ t('products.deleteProduct') }}
      </v-btn>
    </div>

    <!-- Loading skeleton -->
    <template v-if="isLoading">
      <v-skeleton-loader type="card" class="mb-4" />
      <v-skeleton-loader type="card" />
    </template>

    <!-- Content -->
    <template v-else-if="productDetail">
      <!-- Low stock warning -->
      <v-alert
        v-if="productDetail.stock <= productDetail.minimumStock && productDetail.minimumStock > 0"
        type="warning"
        variant="tonal"
        density="compact"
        class="mb-4"
        prepend-icon="mdi-alert"
      >
        {{ t('products.lowStockWarning') }} — {{ productDetail.stock }} / {{ productDetail.minimumStock }} {{ productDetail.unit }}
      </v-alert>

      <!-- Header card -->
      <v-card variant="outlined" rounded="lg" class="mb-4">
        <v-card-text class="d-flex align-center ga-4 pa-5">
          <v-avatar size="52" color="primary" variant="tonal">
            <v-icon icon="mdi-package-variant" size="28" />
          </v-avatar>
          <div>
            <h1 class="text-h5 font-weight-bold">{{ productDetail.name }}</h1>
            <p class="text-body-2 text-medium-emphasis mt-1">
              {{ productDetail.sku }} · {{ productDetail.categoryName }}
            </p>
          </div>
        </v-card-text>
      </v-card>

      <v-row>
        <!-- General info -->
        <v-col cols="12" md="6">
          <v-card variant="outlined" rounded="lg" class="fill-height">
            <v-card-title class="text-subtitle-1 font-weight-medium">
              <v-icon icon="mdi-information-outline" size="18" class="mr-2" />
              {{ t('products.generalInfo') }}
            </v-card-title>
            <v-card-text>
              <v-list density="compact" class="pa-0">
                <v-list-item>
                  <template #prepend><v-icon icon="mdi-text" size="18" class="mr-3" /></template>
                  <v-list-item-title class="text-caption text-medium-emphasis">{{ t('products.description') }}</v-list-item-title>
                  <v-list-item-subtitle class="text-body-2">{{ productDetail.description ?? t('products.noDescription') }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <template #prepend><v-icon icon="mdi-barcode" size="18" class="mr-3" /></template>
                  <v-list-item-title class="text-caption text-medium-emphasis">{{ t('products.barcode') }}</v-list-item-title>
                  <v-list-item-subtitle class="text-body-2">{{ productDetail.barcode ?? t('products.noBarcode') }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <template #prepend><v-icon icon="mdi-shape-outline" size="18" class="mr-3" /></template>
                  <v-list-item-title class="text-caption text-medium-emphasis">{{ t('products.category') }}</v-list-item-title>
                  <v-list-item-subtitle class="text-body-2">{{ productDetail.categoryName }}</v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Inventory -->
        <v-col cols="12" md="6">
          <v-card variant="outlined" rounded="lg" class="fill-height">
            <v-card-title class="text-subtitle-1 font-weight-medium">
              <v-icon icon="mdi-warehouse" size="18" class="mr-2" />
              {{ t('products.inventoryInfo') }}
            </v-card-title>
            <v-card-text>
              <v-list density="compact" class="pa-0">
                <v-list-item>
                  <template #prepend><v-icon icon="mdi-scale" size="18" class="mr-3" /></template>
                  <v-list-item-title class="text-caption text-medium-emphasis">{{ t('products.unit') }}</v-list-item-title>
                  <v-list-item-subtitle class="text-body-2">{{ t(`products.units.${productDetail.unit}`) }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <template #prepend><v-icon icon="mdi-package-variant" size="18" class="mr-3" /></template>
                  <v-list-item-title class="text-caption text-medium-emphasis">{{ t('products.stock') }}</v-list-item-title>
                  <v-list-item-subtitle class="text-body-2">
                    <v-chip
                      size="small"
                      :color="getStockColor(productDetail.stock, productDetail.minimumStock)"
                      variant="tonal"
                      label
                    >
                      {{ productDetail.stock }} {{ productDetail.unit }}
                    </v-chip>
                  </v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <template #prepend><v-icon icon="mdi-alert-circle-outline" size="18" class="mr-3" /></template>
                  <v-list-item-title class="text-caption text-medium-emphasis">{{ t('products.minimumStock') }}</v-list-item-title>
                  <v-list-item-subtitle class="text-body-2">{{ productDetail.minimumStock }} {{ productDetail.unit }}</v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Commercial -->
        <v-col cols="12" md="6">
          <v-card variant="outlined" rounded="lg" class="fill-height">
            <v-card-title class="text-subtitle-1 font-weight-medium">
              <v-icon icon="mdi-currency-eur" size="18" class="mr-2" />
              {{ t('products.commercialInfo') }}
            </v-card-title>
            <v-card-text>
              <v-list density="compact" class="pa-0">
                <v-list-item>
                  <template #prepend><v-icon icon="mdi-tag-outline" size="18" class="mr-3" /></template>
                  <v-list-item-title class="text-caption text-medium-emphasis">{{ t('products.price') }}</v-list-item-title>
                  <v-list-item-subtitle class="text-body-2">{{ productDetail.price != null ? formatCurrency(productDetail.price) : t('products.noPrice') }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <template #prepend><v-icon icon="mdi-truck-outline" size="18" class="mr-3" /></template>
                  <v-list-item-title class="text-caption text-medium-emphasis">{{ t('products.supplier') }}</v-list-item-title>
                  <v-list-item-subtitle class="text-body-2">{{ productDetail.supplier ?? t('products.noSupplier') }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <template #prepend><v-icon icon="mdi-calendar-clock" size="18" class="mr-3" /></template>
                  <v-list-item-title class="text-caption text-medium-emphasis">{{ t('products.expirationDate') }}</v-list-item-title>
                  <v-list-item-subtitle class="text-body-2">{{ productDetail.expirationDate ? formatDate(productDetail.expirationDate) : t('products.noExpiration') }}</v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Location + metadata -->
        <v-col cols="12" md="6">
          <v-card variant="outlined" rounded="lg" class="fill-height">
            <v-card-title class="text-subtitle-1 font-weight-medium">
              <v-icon icon="mdi-map-marker-outline" size="18" class="mr-2" />
              {{ t('products.locationInfo') }}
            </v-card-title>
            <v-card-text>
              <v-list density="compact" class="pa-0">
                <v-list-item>
                  <template #prepend><v-icon icon="mdi-select-group" size="18" class="mr-3" /></template>
                  <v-list-item-title class="text-caption text-medium-emphasis">{{ t('products.sector') }}</v-list-item-title>
                  <v-list-item-subtitle class="text-body-2">{{ productDetail.defaultSectorId != null ? `#${productDetail.defaultSectorId}` : t('products.noSector') }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <template #prepend><v-icon icon="mdi-clock-outline" size="18" class="mr-3" /></template>
                  <v-list-item-title class="text-caption text-medium-emphasis">{{ t('products.createdAt') }}</v-list-item-title>
                  <v-list-item-subtitle class="text-body-2">{{ formatDateTime(productDetail.createdAt) }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item v-if="productDetail.updatedAt">
                  <template #prepend><v-icon icon="mdi-update" size="18" class="mr-3" /></template>
                  <v-list-item-title class="text-caption text-medium-emphasis">{{ t('products.updatedAt') }}</v-list-item-title>
                  <v-list-item-subtitle class="text-body-2">{{ formatDateTime(productDetail.updatedAt) }}</v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar.visible.value" :color="snackbar.color.value" location="top end" :timeout="3000">
      {{ snackbar.message.value }}
    </v-snackbar>

    <!-- Dialogs -->
    <ProductFormStepper
      v-model="formDialog"
      :product="productDetail"
      :loading="formLoading"
      @submit="handleSubmit"
    />
    <ProductDeleteDialog
      v-model="deleteDialog"
      :product="deleteTarget"
      :loading="deleteLoading"
      @confirm="handleDelete"
    />
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useProducts } from '@/composables/useProducts'
import { useSnackbar } from '@/composables/useSnackbar'
import { useAuthStore } from '@/features/auth/stores/auth.store'
import { formatDate, formatDateTime, formatCurrency, getStockColor } from '@/utils/formatters'
import type { ProductListDto, CreateProductRequest, UpdateProductRequest } from '@/types/api.types'
import ProductFormStepper from '../components/ProductFormStepper.vue'
import ProductDeleteDialog from '../components/ProductDeleteDialog.vue'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const auth = useAuthStore()
const { productDetail, isLoading, error, fetchProduct, updateProduct, deleteProduct } = useProducts()
const snackbar = useSnackbar()

const formDialog = ref(false)
const deleteDialog = ref(false)
const formLoading = ref(false)
const deleteLoading = ref(false)

const deleteTarget = computed<ProductListDto | null>(() =>
  productDetail.value
    ? { id: productDetail.value.id, name: productDetail.value.name, sku: productDetail.value.sku, barcode: productDetail.value.barcode, unit: productDetail.value.unit, stock: productDetail.value.stock, minimumStock: productDetail.value.minimumStock, categoryName: productDetail.value.categoryName }
    : null,
)

onMounted(() => {
  const id = Number(route.params.id)
  if (!isNaN(id)) fetchProduct(id)
})

function openEdit() {
  formDialog.value = true
}

function openDelete() {
  deleteDialog.value = true
}

async function handleSubmit(data: CreateProductRequest | UpdateProductRequest) {
  if (!productDetail.value) return
  formLoading.value = true
  try {
    await updateProduct(productDetail.value.id, data as UpdateProductRequest)
    // Refresh detail
    await fetchProduct(productDetail.value.id)
    snackbar.show(t('products.updateSuccess'))
    formDialog.value = false
  } catch {
    snackbar.show(error.value ?? t('errors.generic'), 'error')
  } finally {
    formLoading.value = false
  }
}

async function handleDelete() {
  if (!productDetail.value) return
  deleteLoading.value = true
  try {
    await deleteProduct(productDetail.value.id)
    snackbar.show(t('products.deleteSuccess'))
    router.push({ name: 'products' })
  } catch {
    snackbar.show(error.value ?? t('errors.generic'), 'error')
  } finally {
    deleteLoading.value = false
  }
}
</script>
