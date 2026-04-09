<template>
  <v-container fluid>
    <!-- Header -->
    <div class="page-header">
      <div class="d-flex align-center ga-3">
        <v-avatar size="40" color="primary" variant="tonal">
          <v-icon icon="mdi-swap-horizontal" size="22" />
        </v-avatar>
        <div>
          <h1 class="text-h5 font-weight-bold" style="color: rgb(var(--v-theme-primary));">{{ t('stock.title') }}</h1>
          <p class="text-body-2 text-medium-emphasis mt-1">{{ t('stock.subtitle') }}</p>
        </div>
      </div>
    </div>

    <v-row style="margin-top: 32px;">
      <!-- Left: Table -->
      <v-col cols="12" lg="8">
        <BaseDataTable
          :headers="headers"
          :items="movements"
          :search="search"
          :loading="isLoading"
          :no-data-text="t('stock.noResults')"
          :skeleton-rows="5"
          :items-per-page="-1"
          item-value="id"
        >
          <template #toolbar>
            <div class="d-flex align-center ga-3 flex-wrap">
              <v-text-field
                v-model="search"
                :placeholder="t('stock.search')"
                prepend-inner-icon="mdi-magnify"
                clearable
                single-line
                class="bda-search-field"
              />
              <v-chip-group
                v-model="typeFilter"
                selected-class="text-primary"
                class="flex-grow-0"
                @update:model-value="onTypeFilter"
              >
                <v-chip :value="null" size="small" variant="tonal" label>
                  {{ t('stock.allTypes') }}
                </v-chip>
                <v-chip
                  v-for="op in typeChipOptions"
                  :key="op.value"
                  :value="op.value"
                  size="small"
                  variant="tonal"
                  label
                >
                  {{ op.label }}
                </v-chip>
              </v-chip-group>
              <v-spacer />
              <v-menu>
                <template #activator="{ props: menuProps }">
                  <v-btn color="primary" v-bind="menuProps" prepend-icon="mdi-plus" append-icon="mdi-chevron-down" size="small">
                    {{ t('stock.newMovement') }}
                  </v-btn>
                </template>
                <v-list density="compact">
                  <v-list-item
                    v-for="op in operationOptions"
                    :key="op.value"
                    @click="openMovement(op.value)"
                  >
                    <template #prepend>
                      <v-icon :icon="op.icon" :color="op.color" size="18" class="me-3" />
                    </template>
                    <v-list-item-title>{{ op.label }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
          </template>

          <template #empty>
            <v-icon icon="mdi-swap-horizontal" size="48" class="mb-3 text-medium-emphasis" />
            <p class="text-body-1 text-medium-emphasis">{{ t('stock.noMovements') }}</p>
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
              <v-icon start :icon="getMovementTypeIcon(item.type as number)" size="14" />
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
      </v-col>

      <!-- Right: Info panel -->
      <v-col cols="12" lg="4">
        <div class="info-panel">
          <div class="info-panel-header">
            <v-icon icon="mdi-lightbulb-outline" size="20" color="primary" />
            <span class="text-body-1 font-weight-bold">{{ t('stock.infoTitle') }}</span>
          </div>
          <p class="text-caption text-medium-emphasis mb-5">
            {{ t('stock.infoDescription') }}
          </p>

          <!-- Movement types -->
          <div class="info-section mb-5">
            <div class="d-flex align-center ga-2 mb-3">
              <v-avatar size="28" color="primary" variant="tonal">
                <v-icon icon="mdi-swap-horizontal" size="16" />
              </v-avatar>
              <span class="text-body-2 font-weight-bold">{{ t('stock.infoHowTitle') }}</span>
            </div>
            <ul class="info-list">
              <li v-for="(item, i) in tm('stock.infoHowItems')" :key="i" class="text-caption">
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
              <span class="text-body-2 font-weight-bold">{{ t('stock.infoRulesTitle') }}</span>
            </div>
            <ul class="info-list">
              <li v-for="(item, i) in tm('stock.infoRulesItems')" :key="i" class="text-caption">
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

    <!-- Dialog -->
    <StockMovementDialog
      v-model="formDialog"
      :operation="currentOperation"
      :loading="formLoading"
      @submit="handleSubmit"
    />
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStock } from '@/composables/useStock'
import { useSnackbar } from '@/composables/useSnackbar'
import { useEnumLabels, getMovementTypeColor } from '@/utils/enums.helper'
import { formatDateTime } from '@/utils/formatters'
import { MovementType, AdjustmentType } from '@/types/api.types'
import BaseDataTable from '@/components/BaseDataTable.vue'
import StockMovementDialog from '../components/StockMovementDialog.vue'
import type { StockOperation, StockMovementFormData } from '../components/StockMovementDialog.vue'

const { t, tm } = useI18n()
const { movements, isLoading, error, paginationInfo, fetchMovementHistory, registerMovement, registerWriteOff, registerRelocation, registerAdjustment } = useStock()
const { getMovementTypeLabel } = useEnumLabels()
const snackbar = useSnackbar()

const search = ref('')
const typeFilter = ref<MovementType | null>(null)
const currentPage = ref(1)
const formDialog = ref(false)
const currentOperation = ref<StockOperation>('entry')
const formLoading = ref(false)

const headers = computed(() => [
  { title: t('stock.date'), key: 'createdAt', sortable: true },
  { title: t('stock.type'), key: 'type', sortable: true },
  { title: t('stock.product'), key: 'productName', sortable: true },
  { title: t('stock.quantity'), key: 'quantity', sortable: true },
  { title: t('stock.sector'), key: 'sectorName', sortable: true },
  { title: t('stock.notes'), key: 'notes', sortable: false },
])

const movementTypeIcons: Record<number, string> = {
  [MovementType.Entry]: 'mdi-arrow-down-bold',
  [MovementType.Exit]: 'mdi-arrow-up-bold',
  [MovementType.WriteOff]: 'mdi-delete-alert-outline',
  [MovementType.Relocation]: 'mdi-swap-horizontal',
  [MovementType.Adjustment]: 'mdi-tune-vertical',
}

function getMovementTypeIcon(type: number): string {
  return movementTypeIcons[type] || 'mdi-help'
}

const typeChipOptions = computed(() => [
  { value: MovementType.Entry, label: t('stock.entry') },
  { value: MovementType.Exit, label: t('stock.exit') },
  { value: MovementType.WriteOff, label: t('stock.writeOff') },
  { value: MovementType.Relocation, label: t('stock.relocation') },
  { value: MovementType.Adjustment, label: t('stock.adjustment') },
])

const operationOptions = computed(() => [
  { value: 'entry' as StockOperation, label: t('stock.entry'), icon: 'mdi-arrow-down-bold', color: 'success' },
  { value: 'exit' as StockOperation, label: t('stock.exit'), icon: 'mdi-arrow-up-bold', color: 'warning' },
  { value: 'writeOff' as StockOperation, label: t('stock.writeOff'), icon: 'mdi-delete-alert-outline', color: 'error' },
  { value: 'relocation' as StockOperation, label: t('stock.relocation'), icon: 'mdi-swap-horizontal', color: 'info' },
  { value: 'adjustment' as StockOperation, label: t('stock.adjustment'), icon: 'mdi-tune-vertical', color: 'secondary' },
])

onMounted(() => fetchMovementHistory())

function onTypeFilter(type: MovementType | null | undefined) {
  typeFilter.value = type ?? null
  currentPage.value = 1
  fetchMovementHistory({ type: type ?? undefined, pageNumber: 1 })
}

function onPageChange(page: number) {
  fetchMovementHistory({
    pageNumber: page,
    type: typeFilter.value ?? undefined,
  })
}

function openMovement(operation: StockOperation) {
  currentOperation.value = operation
  formDialog.value = true
}

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

async function handleSubmit(data: StockMovementFormData) {
  formLoading.value = true
  try {
    switch (currentOperation.value) {
      case 'entry':
        await registerMovement({
          productId: data.productId,
          sectorId: data.sectorId,
          quantity: data.quantity,
          type: MovementType.Entry,
          notes: data.notes,
        })
        snackbar.show(t('stock.entrySuccess'))
        break
      case 'exit':
        await registerMovement({
          productId: data.productId,
          sectorId: data.sectorId,
          quantity: data.quantity,
          type: MovementType.Exit,
          notes: data.notes,
        })
        snackbar.show(t('stock.exitSuccess'))
        break
      case 'writeOff':
        await registerWriteOff({
          productId: data.productId,
          sectorId: data.sectorId,
          quantity: data.quantity,
          reason: data.reason!,
          notes: data.notes,
        })
        snackbar.show(t('stock.writeOffSuccess'))
        break
      case 'relocation':
        await registerRelocation({
          productId: data.productId,
          fromSectorId: data.fromSectorId!,
          sectorId: data.sectorId,
          quantity: data.quantity,
          notes: data.notes,
        })
        snackbar.show(t('stock.relocationSuccess'))
        break
      case 'adjustment':
        await registerAdjustment({
          productId: data.productId,
          sectorId: data.sectorId,
          quantity: data.quantity,
          adjustmentType: data.adjustmentType!,
          reason: data.reason,
          notes: data.notes,
        })
        snackbar.show(t('stock.adjustmentSuccess'))
        break
    }
    formDialog.value = false
  } catch {
    snackbar.show(error.value ?? t('errors.generic'), 'error')
  } finally {
    formLoading.value = false
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
