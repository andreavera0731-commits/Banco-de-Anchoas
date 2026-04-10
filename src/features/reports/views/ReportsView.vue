<template>
  <v-container fluid>
    <!-- Header -->
    <div class="page-header">
      <div class="d-flex align-center ga-3">
        <v-avatar size="40" color="primary" variant="tonal">
          <v-icon icon="mdi-file-chart-outline" size="22" />
        </v-avatar>
        <div>
          <h1 class="text-h5 font-weight-bold" style="color: rgb(var(--v-theme-primary));">{{ t('reports.title') }}</h1>
          <p class="text-body-2 text-medium-emphasis mt-1">{{ t('reports.subtitle') }}</p>
        </div>
      </div>
    </div>

    <v-row style="margin-top: 32px;">
      <!-- Left: Filters + Table + Export -->
      <v-col cols="12" lg="8">
        <!-- Filters card -->
        <v-card rounded="xl" variant="flat" class="filters-card">
          <v-card-text class="pa-4">
            <v-row dense>
              <!-- Product -->
              <v-col cols="12" sm="6" md="4">
                <v-autocomplete
                  v-model="filters.productId"
                  :items="productOptions"
                  item-value="id"
                  item-title="name"
                  :label="t('reports.filterProduct')"
                  :placeholder="t('reports.allProducts')"
                  prepend-inner-icon="mdi-package-variant"
                  density="compact"
                  clearable
                  :custom-filter="productFilter"
                >
                  <template #item="{ props: itemProps, item }">
                    <v-list-item v-bind="itemProps">
                      <template v-if="item?.raw?.barcode" #subtitle>
                        <v-icon icon="mdi-barcode" size="12" class="me-1" />
                        {{ item.raw.barcode }}
                      </template>
                    </v-list-item>
                  </template>
                </v-autocomplete>
              </v-col>

              <!-- Sector -->
              <v-col cols="12" sm="6" md="4">
                <v-select
                  v-model="filters.sectorId"
                  :items="sectorFlatOptions"
                  item-value="id"
                  item-title="label"
                  :label="t('reports.filterSector')"
                  :placeholder="t('reports.allSectors')"
                  prepend-inner-icon="mdi-map-marker-outline"
                  density="compact"
                  clearable
                />
              </v-col>

              <!-- Movement type -->
              <v-col cols="12" sm="6" md="4">
                <v-select
                  v-model="filters.type"
                  :items="typeOptions"
                  :label="t('reports.filterMovementType')"
                  :placeholder="t('reports.allTypes')"
                  prepend-inner-icon="mdi-swap-horizontal"
                  density="compact"
                  clearable
                />
              </v-col>

              <!-- Requester -->
              <v-col cols="12" sm="6" md="4">
                <v-select
                  v-model="filters.requesterId"
                  :items="requesterOptions"
                  item-value="id"
                  item-title="name"
                  :label="t('reports.filterRequester')"
                  :placeholder="t('reports.allRequesters')"
                  prepend-inner-icon="mdi-account-arrow-right-outline"
                  density="compact"
                  clearable
                />
              </v-col>

              <!-- Date from -->
              <v-col cols="12" sm="6" md="4">
                <DatePickerField
                  v-model="filters.from"
                  :label="t('reports.filterDateFrom')"
                />
              </v-col>

              <!-- Date to -->
              <v-col cols="12" sm="6" md="4">
                <DatePickerField
                  v-model="filters.to"
                  :label="t('reports.filterDateTo')"
                  :min="filters.from ?? undefined"
                />
              </v-col>
            </v-row>

            <!-- Filter actions -->
            <div class="d-flex align-center ga-2 flex-wrap">
              <v-btn
                color="primary"
                variant="flat"
                prepend-icon="mdi-magnify"
                size="small"
                :loading="isLoading"
                @click="applyFilters"
              >
                {{ t('reports.applyFilters') }}
              </v-btn>
              <v-btn
                variant="text"
                prepend-icon="mdi-filter-remove-outline"
                size="small"
                @click="clearFilters"
              >
                {{ t('reports.clearFilters') }}
              </v-btn>
            </div>
          </v-card-text>
        </v-card>

        <!-- Preview table -->
        <div class="mt-6">
          <BaseDataTable
            :headers="headers"
            :items="movements"
            :search="search"
            :loading="isLoading"
            :no-data-text="t('reports.noResults')"
            :skeleton-rows="5"
            :items-per-page="-1"
            item-value="id"
          >
            <template #toolbar>
              <div class="d-flex align-center ga-3 flex-wrap">
                <v-text-field
                  v-model="search"
                  :placeholder="t('reports.search')"
                  prepend-inner-icon="mdi-magnify"
                  clearable
                  single-line
                  class="bda-search-field"
                />
                <v-spacer />

                <!-- Record count -->
                <span v-if="paginationInfo.totalCount > 0" class="text-caption text-medium-emphasis">
                  {{ t('reports.totalRecords', { count: paginationInfo.totalCount }) }}
                </span>

                <!-- Export menu -->
                <v-menu>
                  <template #activator="{ props: menuProps }">
                    <v-btn
                      color="primary"
                      v-bind="menuProps"
                      prepend-icon="mdi-download"
                      append-icon="mdi-chevron-down"
                      size="small"
                      :loading="!!exportingFormat"
                      :disabled="movements.length === 0"
                    >
                      {{ t('reports.exportExcel') }}
                    </v-btn>
                  </template>
                  <v-list density="compact">
                    <v-list-item @click="handleExport(ReportFormat.Csv)">
                      <template #prepend>
                        <v-icon icon="mdi-file-delimited-outline" color="success" size="18" class="me-3" />
                      </template>
                      <v-list-item-title>{{ t('reports.exportCsv') }}</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="handleExport(ReportFormat.Excel)">
                      <template #prepend>
                        <v-icon icon="mdi-microsoft-excel" color="primary" size="18" class="me-3" />
                      </template>
                      <v-list-item-title>{{ t('reports.exportExcel') }}</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="handleExport(ReportFormat.Pdf)">
                      <template #prepend>
                        <v-icon icon="mdi-file-pdf-box" color="error" size="18" class="me-3" />
                      </template>
                      <v-list-item-title>{{ t('reports.exportPdf') }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </div>
            </template>

            <template #empty>
              <v-icon icon="mdi-file-search-outline" size="48" class="mb-3 text-medium-emphasis" />
              <p class="text-body-1 text-medium-emphasis">{{ t('reports.noMovements') }}</p>
            </template>

            <template #item.createdAt="{ item }">
              {{ formatDateTime(item.createdAt) }}
            </template>

            <template #item.type="{ item }">
              <v-chip
                size="small"
                :color="getMovementTypeColor(item.type as number)"
                variant="tonal"
                label
              >
                {{ getMovementTypeLabel(item.type as number) }}
              </v-chip>
            </template>

            <template #item.quantity="{ item }">
              <span :class="getQuantityClass(item.type as number, item.adjustmentType as number)">
                {{ formatQuantity(item.type as number, item.quantity as number, item.adjustmentType as number) }}
              </span>
            </template>

            <template #item.sectorName="{ item }">
              <template v-if="(item.type as number) === MovementType.Relocation && item.fromSectorName">
                <span class="text-medium-emphasis">{{ item.fromSectorName }}</span>
                <v-icon icon="mdi-arrow-right" size="14" class="mx-1" />
                {{ item.sectorName }}
              </template>
              <template v-else>
                {{ item.sectorName }}
              </template>
            </template>

            <template #item.requesterName="{ item }">
              <span v-if="item.requesterName">{{ item.requesterName }}</span>
              <span v-else class="text-disabled">—</span>
            </template>

            <template #item.notes="{ item }">
              <span v-if="item.notes" class="text-medium-emphasis text-caption">{{ item.notes }}</span>
              <span v-else class="text-disabled">—</span>
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
        </div>
      </v-col>

      <!-- Right: Info panel -->
      <v-col cols="12" lg="4">
        <div class="info-panel">
          <div class="info-panel-header">
            <v-icon icon="mdi-lightbulb-outline" size="20" color="primary" />
            <span class="text-body-1 font-weight-bold">{{ t('reports.infoTitle') }}</span>
          </div>
          <p class="text-caption text-medium-emphasis mb-5">
            {{ t('reports.infoDescription') }}
          </p>

          <!-- Formats -->
          <div class="info-section mb-5">
            <div class="d-flex align-center ga-2 mb-3">
              <v-avatar size="28" color="primary" variant="tonal">
                <v-icon icon="mdi-file-chart-outline" size="16" />
              </v-avatar>
              <span class="text-body-2 font-weight-bold">{{ t('reports.infoFormatsTitle') }}</span>
            </div>
            <ul class="info-list">
              <li v-for="(item, i) in tm('reports.infoFormatsItems')" :key="i" class="text-caption">
                {{ item }}
              </li>
            </ul>
          </div>

          <!-- Filters -->
          <div class="info-section mb-5">
            <div class="d-flex align-center ga-2 mb-3">
              <v-avatar size="28" color="info" variant="tonal">
                <v-icon icon="mdi-filter-outline" size="16" />
              </v-avatar>
              <span class="text-body-2 font-weight-bold">{{ t('reports.infoFiltersTitle') }}</span>
            </div>
            <ul class="info-list">
              <li v-for="(item, i) in tm('reports.infoFiltersItems')" :key="i" class="text-caption">
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
              <span class="text-body-2 font-weight-bold">{{ t('reports.infoRulesTitle') }}</span>
            </div>
            <ul class="info-list">
              <li v-for="(item, i) in tm('reports.infoRulesItems')" :key="i" class="text-caption">
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
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStock } from '@/composables/useStock'
import { useSnackbar } from '@/composables/useSnackbar'
import { useEnumLabels, getMovementTypeColor } from '@/utils/enums.helper'
import { extractError } from '@/utils/errors'
import { formatDateTime } from '@/utils/formatters'
import { reportsService } from '@/services/reports.service'
import { productsService } from '@/services/products.service'
import { warehousesService } from '@/services/warehouses.service'
import { requestersService } from '@/services/requesters.service'
import { MovementType, AdjustmentType, ReportFormat } from '@/types/api.types'
import type { ProductListDto, WarehouseDto, SectorDto, RequesterDto, ExportMovementsParams } from '@/types/api.types'
import BaseDataTable from '@/components/BaseDataTable.vue'
import DatePickerField from '@/components/DatePickerField.vue'

const { t, tm } = useI18n()
const snackbar = useSnackbar()
const { getMovementTypeLabel } = useEnumLabels()
const { movements, isLoading, paginationInfo, fetchMovementHistory } = useStock()

const search = ref('')
const currentPage = ref(1)
const exportingFormat = ref<ReportFormat | null>(null)

const filters = reactive({
  productId: null as number | null,
  sectorId: null as number | null,
  type: null as MovementType | null,
  requesterId: null as number | null,
  from: null as string | null,
  to: null as string | null,
})

// Dropdown data
const productOptions = ref<ProductListDto[]>([])
const warehouseOptions = ref<WarehouseDto[]>([])
const sectorsByWarehouse = ref<Map<number, SectorDto[]>>(new Map())
const requesterOptions = ref<RequesterDto[]>([])

const headers = computed(() => [
  { title: t('reports.date'), key: 'createdAt', sortable: true },
  { title: t('reports.type'), key: 'type', sortable: true },
  { title: t('reports.product'), key: 'productName', sortable: true },
  { title: t('reports.quantity'), key: 'quantity', sortable: true },
  { title: t('reports.sector'), key: 'sectorName', sortable: true },
  { title: t('reports.requester'), key: 'requesterName', sortable: true },
  { title: t('reports.notes'), key: 'notes', sortable: false },
])

// Flat sector list with warehouse prefix for the dropdown
const sectorFlatOptions = computed(() => {
  const items: { id: number; label: string }[] = []
  for (const warehouse of warehouseOptions.value) {
    const sectors = sectorsByWarehouse.value.get(warehouse.id) ?? []
    for (const sector of sectors) {
      items.push({ id: sector.id, label: `${warehouse.name} → ${sector.name}` })
    }
  }
  return items
})

const typeOptions = computed(() => [
  { value: MovementType.Entry, title: getMovementTypeLabel(MovementType.Entry) },
  { value: MovementType.Exit, title: getMovementTypeLabel(MovementType.Exit) },
  { value: MovementType.WriteOff, title: getMovementTypeLabel(MovementType.WriteOff) },
  { value: MovementType.Relocation, title: getMovementTypeLabel(MovementType.Relocation) },
  { value: MovementType.Adjustment, title: getMovementTypeLabel(MovementType.Adjustment) },
])

function productFilter(itemTitle: string, queryText: string, item: { raw?: { barcode?: string } }): boolean {
  const q = queryText.toLowerCase()
  return itemTitle.toLowerCase().includes(q) ||
    (item?.raw?.barcode?.toLowerCase().includes(q) ?? false)
}

function buildHistoryParams(page?: number) {
  return {
    productId: filters.productId ?? undefined,
    sectorId: filters.sectorId ?? undefined,
    type: filters.type ?? undefined,
    from: filters.from || undefined,
    to: filters.to || undefined,
    pageNumber: page ?? currentPage.value,
    pageSize: 20,
  }
}

function buildExportParams(format: ReportFormat): ExportMovementsParams {
  const params: ExportMovementsParams = { format }
  if (filters.productId) params.productId = filters.productId
  if (filters.sectorId) params.sectorId = filters.sectorId
  if (filters.type != null) params.type = filters.type
  if (filters.requesterId) params.requesterId = filters.requesterId
  if (filters.from) params.from = filters.from
  if (filters.to) params.to = filters.to
  return params
}

onMounted(async () => {
  // Load filter options + initial preview data in parallel
  try {
    const [productsRes, warehousesRes, requestersRes] = await Promise.all([
      productsService.getAll({ pageSize: 500 }),
      warehousesService.getAll(),
      requestersService.getAll(),
    ])
    productOptions.value = productsRes.data.data.items
    warehouseOptions.value = warehousesRes.data.data
    requesterOptions.value = requestersRes.data.data

    // Load sectors for each warehouse
    const sectorResults = await Promise.all(
      warehouseOptions.value.map((w) => warehousesService.getSectors(w.id)),
    )
    const map = new Map<number, SectorDto[]>()
    warehouseOptions.value.forEach((w, i) => {
      map.set(w.id, sectorResults[i].data.data)
    })
    sectorsByWarehouse.value = map
  } catch { /* non-critical — dropdowns just stay empty */ }

  // Load initial preview
  fetchMovementHistory(buildHistoryParams(1))
})

function applyFilters() {
  currentPage.value = 1
  fetchMovementHistory(buildHistoryParams(1))
}

function onPageChange(page: number) {
  fetchMovementHistory(buildHistoryParams(page))
}

function clearFilters() {
  filters.productId = null
  filters.sectorId = null
  filters.type = null
  filters.requesterId = null
  filters.from = null
  filters.to = null
  currentPage.value = 1
  fetchMovementHistory(buildHistoryParams(1))
}

// Quantity formatting (same as StockView)
function isPositiveMovement(type: number, adjustmentType?: number): boolean {
  return type === MovementType.Entry ||
    (type === MovementType.Adjustment && adjustmentType === AdjustmentType.Increase)
}

function isNegativeMovement(type: number, adjustmentType?: number): boolean {
  return type === MovementType.Exit ||
    type === MovementType.WriteOff ||
    (type === MovementType.Adjustment && adjustmentType === AdjustmentType.Decrease)
}

function formatQuantity(type: number, quantity: number, adjustmentType?: number): string {
  if (isPositiveMovement(type, adjustmentType)) return `+${quantity}`
  if (isNegativeMovement(type, adjustmentType)) return `-${quantity}`
  return `${quantity}`
}

function getQuantityClass(type: number, adjustmentType?: number): string {
  if (isPositiveMovement(type, adjustmentType)) return 'text-success font-weight-medium'
  if (isNegativeMovement(type, adjustmentType)) return 'text-error font-weight-medium'
  return 'font-weight-medium'
}

function getFileExtension(format: ReportFormat): string {
  const map: Record<ReportFormat, string> = {
    [ReportFormat.Csv]: 'csv',
    [ReportFormat.Excel]: 'xlsx',
    [ReportFormat.Pdf]: 'pdf',
  }
  return map[format]
}

async function handleExport(format: ReportFormat) {
  exportingFormat.value = format
  try {
    const response = await reportsService.exportMovements(buildExportParams(format))

    // Extract filename from Content-Disposition or generate fallback
    const disposition = response.headers['content-disposition'] as string | undefined
    const filenameMatch = disposition?.match(/filename=([^;]+)/)
    const filename = filenameMatch?.[1]?.replace(/"/g, '') ??
      `movimientos_${new Date().toISOString().slice(0, 10)}.${getFileExtension(format)}`

    // Trigger browser download
    const blob = new Blob([response.data])
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url)

    snackbar.show(t('reports.exportSuccess'))
  } catch (err) {
    snackbar.show(extractError(err) ?? t('errors.exportReport'), 'error')
  } finally {
    exportingFormat.value = null
  }
}
</script>

<style scoped>
.filters-card {
  border: 1px solid var(--bda-border-color);
}

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
