<template>
  <v-container fluid>
    <!-- Header -->
    <div class="page-header">
      <div class="d-flex align-center ga-3">
        <v-avatar size="40" color="primary" variant="tonal">
          <v-icon icon="mdi-package-variant" size="22" />
        </v-avatar>
        <div>
          <h1 class="text-h5 font-weight-bold" style="color: rgb(var(--v-theme-primary));">{{ t('products.title') }}</h1>
          <p class="text-body-2 text-medium-emphasis mt-1">{{ t('products.subtitle') }}</p>
        </div>
      </div>
    </div>

    <v-row style="margin-top: 32px;">
      <v-col cols="12" lg="8">
        <BaseDataTable
          :headers="headers"
          :items="products"
          :search="search"
          :loading="isLoading"
          :no-data-text="t('products.noResults')"
          :skeleton-rows="5"
          item-value="id"
        >
          <template #toolbar>
            <div class="d-flex align-center ga-3 flex-wrap">
              <v-text-field
                v-model="search"
                :placeholder="t('products.search')"
                prepend-inner-icon="mdi-magnify"
                clearable
                single-line
                style="max-width: 280px;"
              />
              <v-spacer />
              <v-btn color="primary" prepend-icon="mdi-plus" size="small" @click="openCreate">
                {{ t('products.createProduct') }}
              </v-btn>
            </div>
            <v-chip-group
              v-if="categoryOptions.length > 0"
              v-model="categoryFilter"
              selected-class="text-primary"
              class="mt-2"
              @update:model-value="onCategoryFilter"
            >
              <v-chip
                :value="null"
                size="small"
                variant="tonal"
                label
              >
                {{ t('products.allCategories') }}
              </v-chip>
              <v-chip
                v-for="cat in categoryOptions"
                :key="cat.id"
                :value="cat.id"
                size="small"
                variant="tonal"
                label
              >
                {{ cat.name }}
              </v-chip>
            </v-chip-group>
          </template>

          <template #empty>
            <v-icon icon="mdi-package-variant" size="48" class="mb-3 text-medium-emphasis" />
            <p class="text-body-1 text-medium-emphasis">{{ t('products.noProducts') }}</p>
          </template>

          <template #item.name="{ item }">
            <router-link
              :to="{ name: 'product-detail', params: { id: item.id } }"
              class="text-decoration-none font-weight-medium"
              style="color: rgb(var(--v-theme-primary));"
            >
              {{ item.name }}
            </router-link>
          </template>

          <template #item.stock="{ item }">
            <v-chip
              size="small"
              :color="getStockColor(item.stock as number, item.minimumStock as number)"
              variant="tonal"
              label
            >
              {{ item.stock }} {{ item.unit }}
            </v-chip>
          </template>

          <template #item.actions="{ item }">
            <div class="d-flex justify-end ga-1">
              <v-btn
                icon="mdi-eye-outline"
                size="x-small"
                variant="text"
                color="primary"
                :to="{ name: 'product-detail', params: { id: item.id } }"
              />
              <v-btn
                icon="mdi-pencil-outline"
                size="x-small"
                variant="text"
                color="primary"
                @click="openEdit(item)"
              />
              <v-btn
                v-if="auth.hasRole('Admin')"
                icon="mdi-delete-outline"
                size="x-small"
                variant="text"
                color="error"
                @click="openDelete(item)"
              />
            </div>
          </template>
        </BaseDataTable>

        <!-- Pagination -->
        <div v-if="paginationInfo.totalPages > 1" class="d-flex justify-center mt-4">
          <v-pagination
            v-model="currentPage"
            :length="paginationInfo.totalPages"
            :total-visible="5"
            density="comfortable"
            rounded="lg"
            @update:model-value="onPageChange"
          />
        </div>
      </v-col>

      <!-- Right: Info panel -->
      <v-col cols="12" lg="4">
        <div class="info-panel">
          <div class="info-panel-header">
            <v-icon icon="mdi-lightbulb-outline" size="20" color="primary" />
            <span class="text-body-1 font-weight-bold">{{ t('products.infoTitle') }}</span>
          </div>
          <p class="text-caption text-medium-emphasis mb-5">
            {{ t('products.infoDescription') }}
          </p>

          <!-- How it works -->
          <div class="info-section mb-5">
            <div class="d-flex align-center ga-2 mb-3">
              <v-avatar size="28" color="primary" variant="tonal">
                <v-icon icon="mdi-package-variant" size="16" />
              </v-avatar>
              <span class="text-body-2 font-weight-bold">{{ t('products.infoHowTitle') }}</span>
            </div>
            <ul class="info-list">
              <li v-for="(item, i) in tm('products.infoHowItems')" :key="i" class="text-caption">
                {{ item }}
              </li>
            </ul>
          </div>

          <!-- Important rules -->
          <div class="info-section">
            <div class="d-flex align-center ga-2 mb-3">
              <v-avatar size="28" color="warning" variant="tonal">
                <v-icon icon="mdi-alert-circle-outline" size="16" />
              </v-avatar>
              <span class="text-body-2 font-weight-bold">{{ t('products.infoRulesTitle') }}</span>
            </div>
            <ul class="info-list">
              <li v-for="(item, i) in tm('products.infoRulesItems')" :key="i" class="text-caption">
                {{ item }}
              </li>
            </ul>
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar.visible.value" :color="snackbar.color.value" location="top end" :timeout="3000">
      {{ snackbar.message.value }}
    </v-snackbar>

    <!-- Dialogs -->
    <ProductFormStepper
      v-model="formDialog"
      :product="selectedProduct"
      :loading="formLoading"
      @submit="handleSubmit"
    />
    <ProductDeleteDialog
      v-model="deleteDialog"
      :product="selectedListProduct"
      :loading="deleteLoading"
      @confirm="handleDelete"
    />
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useProducts } from '@/composables/useProducts'
import { useSnackbar } from '@/composables/useSnackbar'
import { useAuthStore } from '@/features/auth/stores/auth.store'
import { categoriesService } from '@/services/categories.service'
import type {
  ProductDto,
  ProductListDto,
  CategoryDto,
  CreateProductRequest,
  UpdateProductRequest,
} from '@/types/api.types'
import { getStockColor } from '@/utils/formatters'
import BaseDataTable from '@/components/BaseDataTable.vue'
import ProductFormStepper from '../components/ProductFormStepper.vue'
import ProductDeleteDialog from '../components/ProductDeleteDialog.vue'

const { t, tm } = useI18n()
const auth = useAuthStore()
const {
  products,
  isLoading,
  error,
  paginationInfo,
  fetchProducts,
  fetchProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = useProducts()
const snackbar = useSnackbar()

const search = ref('')
const categoryFilter = ref<number | null>(null)
const currentPage = ref(1)
const formDialog = ref(false)
const deleteDialog = ref(false)
const selectedProduct = ref<ProductDto | null>(null)
const selectedListProduct = ref<ProductListDto | null>(null)
const formLoading = ref(false)
const deleteLoading = ref(false)

// Category filter options
const categoryOptions = ref<CategoryDto[]>([])

const headers = computed(() => [
  { title: t('products.name'), key: 'name', sortable: true },
  { title: t('products.sku'), key: 'sku', sortable: true },
  { title: t('products.category'), key: 'categoryName', sortable: true },
  { title: t('products.stock'), key: 'stock', sortable: true },
  { title: t('products.actions'), key: 'actions', sortable: false, align: 'end' as const },
])

onMounted(async () => {
  await fetchProducts()
  try {
    const res = await categoriesService.getAll()
    categoryOptions.value = res.data.data
  } catch {
    // Categories filter is non-critical
  }
})

function onCategoryFilter(categoryId: number | null | undefined) {
  currentPage.value = 1
  // When chip-group deselects, value is undefined — treat as "All"
  const filterId = categoryId ?? undefined
  categoryFilter.value = categoryId ?? null
  fetchProducts({ categoryId: filterId, pageNumber: 1 })
}

function onPageChange(page: number) {
  fetchProducts({
    pageNumber: page,
    categoryId: categoryFilter.value ?? undefined,
  })
}

function openCreate() {
  selectedProduct.value = null
  formDialog.value = true
}

async function openEdit(item: Record<string, unknown>) {
  // Fetch full product detail for editing (list only has partial data)
  formLoading.value = true
  formDialog.value = true
  try {
    const detail = await fetchProduct(item.id as number)
    selectedProduct.value = detail ?? null
  } catch {
    snackbar.show(error.value ?? t('errors.generic'), 'error')
    formDialog.value = false
  } finally {
    formLoading.value = false
  }
}

function openDelete(item: Record<string, unknown>) {
  selectedListProduct.value = item as unknown as ProductListDto
  deleteDialog.value = true
}

async function handleSubmit(data: CreateProductRequest | UpdateProductRequest) {
  formLoading.value = true
  try {
    if ('id' in data) {
      await updateProduct(data.id, data as UpdateProductRequest)
      snackbar.show(t('products.updateSuccess'))
    } else {
      await createProduct(data as CreateProductRequest)
      snackbar.show(t('products.createSuccess'))
    }
    formDialog.value = false
  } catch {
    snackbar.show(error.value ?? t('errors.generic'), 'error')
  } finally {
    formLoading.value = false
  }
}

async function handleDelete() {
  if (!selectedListProduct.value) return
  deleteLoading.value = true
  try {
    await deleteProduct(selectedListProduct.value.id)
    snackbar.show(t('products.deleteSuccess'))
    deleteDialog.value = false
  } catch {
    snackbar.show(error.value ?? t('errors.generic'), 'error')
  } finally {
    deleteLoading.value = false
  }
}
</script>

<style scoped>
.info-panel {
  border: 1px solid var(--bda-border-color);
  border-radius: var(--bda-radius-md);
  padding: var(--bda-space-5) var(--bda-space-5);
  background: rgb(var(--v-theme-surface));
}

.info-panel-header {
  display: flex;
  align-items: center;
  gap: var(--bda-space-2);
  margin-bottom: var(--bda-space-2);
}

.info-section {
  padding: var(--bda-space-3) var(--bda-space-4);
  border-radius: var(--bda-radius-sm);
  background: rgb(var(--v-theme-surface-variant) / 0.4);
}

.info-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--bda-space-2);
}

.info-list li {
  display: flex;
  align-items: flex-start;
  gap: var(--bda-space-2);
  color: var(--bda-text-secondary);
}

.info-list li::before {
  content: '';
  display: inline-block;
  width: 5px;
  height: 5px;
  min-width: 5px;
  border-radius: 50%;
  background: rgb(var(--v-theme-primary));
  margin-top: 6px;
}
</style>
