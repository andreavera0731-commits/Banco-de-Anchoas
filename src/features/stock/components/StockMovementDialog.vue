<template>
  <v-dialog
    :model-value="modelValue"
    max-width="520"
    persistent
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card rounded="lg">
      <v-card-title class="d-flex align-center ga-3 pt-6 px-7 pb-0">
        <v-avatar size="36" :color="operationMeta.color" variant="tonal">
          <v-icon :icon="operationMeta.icon" size="20" />
        </v-avatar>
        <span class="text-h6 font-weight-bold">
          {{ operationMeta.title }}
        </span>
      </v-card-title>

      <v-card-text class="px-7 pt-6 pb-4">
        <v-form ref="formRef" class="d-flex flex-column ga-5" @submit.prevent="handleSubmit">
          <!-- Product (search by name or barcode) -->
          <v-autocomplete
            v-model="form.productId"
            :items="productItems"
            item-value="value"
            item-title="title"
            :label="t('stock.selectProduct')"
            :rules="rules.selectRequired"
            prepend-inner-icon="mdi-package-variant"
            :no-data-text="t('stock.noResults')"
            :custom-filter="productFilter"
            @update:model-value="onProductSelected"
          >
            <template #item="{ props: itemProps, item }">
              <v-list-item v-bind="itemProps">
                <template v-if="item?.raw?.subtitle" #subtitle>
                  <v-icon icon="mdi-barcode" size="12" class="me-1" />
                  {{ item.raw.subtitle }}
                </template>
              </v-list-item>
            </template>
          </v-autocomplete>

          <!-- Unit (read-only) -->
          <v-text-field
            v-if="selectedUnit"
            :model-value="getProductUnitLabel(selectedUnit)"
            :label="t('stock.unit')"
            prepend-inner-icon="mdi-scale-balance"
            readonly
            variant="outlined"
          />

          <!-- Warehouse → Sector (entry, exit, writeOff, adjustment) -->
          <template v-if="operation !== 'relocation'">
            <v-select
              v-model="form.warehouseId"
              :items="warehouseOptions"
              item-value="id"
              item-title="name"
              :label="t('stock.selectWarehouse')"
              :rules="rules.selectRequired"
              prepend-inner-icon="mdi-warehouse"
            />
            <v-select
              v-model="form.sectorId"
              :items="sectorOptions"
              item-value="id"
              item-title="name"
              :label="t('stock.selectSector')"
              :rules="rules.selectRequired"
              prepend-inner-icon="mdi-map-marker-outline"
              :disabled="!form.warehouseId"
            />
          </template>

          <!-- From → To (relocation) -->
          <template v-if="operation === 'relocation'">
            <v-select
              v-model="form.fromWarehouseId"
              :items="warehouseOptions"
              item-value="id"
              item-title="name"
              :label="t('stock.selectFromWarehouse')"
              :rules="rules.selectRequired"
              prepend-inner-icon="mdi-warehouse"
            />
            <v-select
              v-model="form.fromSectorId"
              :items="fromSectorOptions"
              item-value="id"
              item-title="name"
              :label="t('stock.selectFromSector')"
              :rules="rules.selectRequired"
              prepend-inner-icon="mdi-map-marker-outline"
              :disabled="!form.fromWarehouseId"
            />
            <v-select
              v-model="form.toWarehouseId"
              :items="warehouseOptions"
              item-value="id"
              item-title="name"
              :label="t('stock.selectToWarehouse')"
              :rules="rules.selectRequired"
              prepend-inner-icon="mdi-warehouse"
            />
            <v-select
              v-model="form.sectorId"
              :items="toSectorOptions"
              item-value="id"
              item-title="name"
              :label="t('stock.selectToSector')"
              :rules="rules.selectRequired"
              prepend-inner-icon="mdi-map-marker-outline"
              :disabled="!form.toWarehouseId"
            />
          </template>

          <!-- Quantity -->
          <v-text-field
            v-model.number="form.quantity"
            :label="t('stock.quantity')"
            :rules="rules.numberPositive"
            prepend-inner-icon="mdi-counter"
            :suffix="selectedUnit || ''"
            type="number"
            min="1"
          />

          <!-- Adjustment type (adjustment only) -->
          <v-select
            v-if="operation === 'adjustment'"
            v-model="form.adjustmentType"
            :items="adjustmentTypeOptions"
            :label="t('stock.selectAdjustmentType')"
            :rules="rules.selectRequired"
            prepend-inner-icon="mdi-tune-vertical"
          />

          <!-- Reason (writeOff required, adjustment optional) -->
          <v-select
            v-if="operation === 'writeOff' || operation === 'adjustment'"
            v-model="form.reason"
            :items="reasonOptions"
            :label="t('stock.selectReason')"
            :rules="operation === 'writeOff' ? rules.selectRequired : []"
            prepend-inner-icon="mdi-tag-outline"
            :clearable="operation === 'adjustment'"
          />

          <!-- Notes -->
          <v-textarea
            v-model="form.notes"
            :label="t('stock.notesPlaceholder')"
            prepend-inner-icon="mdi-note-text-outline"
            rows="2"
            auto-grow
          />
        </v-form>
      </v-card-text>

      <v-card-actions class="px-7 pb-6 pt-4">
        <v-spacer />
        <v-btn variant="text" @click="close">
          {{ t('stock.cancel') }}
        </v-btn>
        <v-btn
          :color="operationMeta.color"
          variant="flat"
          :loading="loading"
          min-width="100"
          @click="handleSubmit"
        >
          {{ t('stock.register') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useValidationRules } from '@/utils/validators'
import { useEnumLabels } from '@/utils/enums.helper'
import { productsService } from '@/services/products.service'
import { warehousesService } from '@/services/warehouses.service'
import { sectorsService } from '@/services/sectors.service'
import { MovementReason, AdjustmentType } from '@/types/api.types'
import type { ProductListDto, ProductUnit, WarehouseDto, SectorDto } from '@/types/api.types'

export type StockOperation = 'entry' | 'exit' | 'writeOff' | 'relocation' | 'adjustment'

export interface StockMovementFormData {
  productId: number
  sectorId: number
  quantity: number
  fromSectorId?: number
  reason?: MovementReason
  adjustmentType?: AdjustmentType
  notes?: string
}

const props = defineProps<{
  modelValue: boolean
  operation: StockOperation
  loading?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'submit': [data: StockMovementFormData]
}>()

const { t } = useI18n()
const rules = useValidationRules()
const { getProductUnitLabel } = useEnumLabels()
const formRef = ref()

const form = reactive({
  productId: null as number | null,
  warehouseId: null as number | null,
  sectorId: null as number | null,
  fromWarehouseId: null as number | null,
  fromSectorId: null as number | null,
  toWarehouseId: null as number | null,
  quantity: null as number | null,
  reason: null as MovementReason | null,
  adjustmentType: null as AdjustmentType | null,
  notes: '',
})

const selectedUnit = ref<ProductUnit | null>(null)

// Dropdown data
const productOptions = ref<ProductListDto[]>([])
const warehouseOptions = ref<WarehouseDto[]>([])
const sectorOptions = ref<SectorDto[]>([])
const fromSectorOptions = ref<SectorDto[]>([])
const toSectorOptions = ref<SectorDto[]>([])

// Map products to autocomplete items with barcode in subtitle
const productItems = computed(() =>
  productOptions.value.map((p) => ({
    value: p.id,
    title: p.name,
    subtitle: p.barcode || '',
    barcode: p.barcode || '',
  })),
)

const reasonOptions = computed(() => [
  { value: MovementReason.Expiration, title: t('enums.movementReason.expiration') },
  { value: MovementReason.Damage, title: t('enums.movementReason.damage') },
  { value: MovementReason.Loss, title: t('enums.movementReason.loss') },
  { value: MovementReason.Other, title: t('enums.movementReason.other') },
])

const adjustmentTypeOptions = computed(() => [
  { value: AdjustmentType.Increase, title: t('enums.adjustmentType.increment') },
  { value: AdjustmentType.Decrease, title: t('enums.adjustmentType.decrement') },
])

const operationMeta = computed(() => {
  const map: Record<StockOperation, { icon: string; color: string; title: string }> = {
    entry: { icon: 'mdi-arrow-down-bold', color: 'success', title: t('stock.registerEntry') },
    exit: { icon: 'mdi-arrow-up-bold', color: 'warning', title: t('stock.registerExit') },
    writeOff: { icon: 'mdi-delete-alert-outline', color: 'error', title: t('stock.registerWriteOff') },
    relocation: { icon: 'mdi-swap-horizontal', color: 'info', title: t('stock.registerRelocation') },
    adjustment: { icon: 'mdi-tune-vertical', color: 'secondary', title: t('stock.registerAdjustment') },
  }
  return map[props.operation]
})

// Custom filter: match by name or barcode
function productFilter(itemTitle: string, queryText: string, item: { raw?: { barcode?: string } }): boolean {
  const q = queryText.toLowerCase()
  return itemTitle.toLowerCase().includes(q) ||
    (item?.raw?.barcode?.toLowerCase().includes(q) ?? false)
}

// When product is selected, fetch detail to get defaultSectorId + unit
async function onProductSelected(productId: number | null) {
  selectedUnit.value = null
  if (!productId) return

  const product = productOptions.value.find((p) => p.id === productId)
  if (product) selectedUnit.value = product.unit

  try {
    const res = await productsService.getById(productId)
    const detail = res.data.data
    selectedUnit.value = detail.unit

    if (detail.defaultSectorId) {
      const sectorRes = await sectorsService.getById(detail.defaultSectorId)
      const sector = sectorRes.data.data
      if (props.operation === 'relocation') {
        form.fromWarehouseId = sector.warehouseId
        // fromSectorId will be set after fromSectorOptions loads via the watcher
        await loadSectorsFor('from', sector.warehouseId)
        form.fromSectorId = sector.id
      } else {
        form.warehouseId = sector.warehouseId
        // sectorId will be set after sectorOptions loads via the watcher
        await loadSectorsFor('main', sector.warehouseId)
        form.sectorId = sector.id
      }
    }
  } catch { /* non-critical — user can still select manually */ }
}

// Helper to load sectors without triggering watcher reset
async function loadSectorsFor(target: 'main' | 'from' | 'to', warehouseId: number) {
  try {
    const res = await warehousesService.getSectors(warehouseId)
    if (target === 'main') sectorOptions.value = res.data.data
    else if (target === 'from') fromSectorOptions.value = res.data.data
    else toSectorOptions.value = res.data.data
  } catch { /* non-critical */ }
}

// Load dropdown data on dialog open
watch(() => props.modelValue, async (open) => {
  if (open) {
    resetForm()
    if (productOptions.value.length === 0) {
      try {
        const res = await productsService.getAll({ pageSize: 500 })
        productOptions.value = res.data.data.items
      } catch { /* non-critical */ }
    }
    if (warehouseOptions.value.length === 0) {
      try {
        const res = await warehousesService.getAll()
        warehouseOptions.value = res.data.data
      } catch { /* non-critical */ }
    }
  }
})

// Warehouse → sector dependency (entry, exit, writeOff, adjustment)
watch(() => form.warehouseId, async (id, oldId) => {
  if (id === oldId) return
  form.sectorId = null
  sectorOptions.value = []
  if (id) await loadSectorsFor('main', id)
})

// Relocation: from warehouse → from sector
watch(() => form.fromWarehouseId, async (id, oldId) => {
  if (id === oldId) return
  form.fromSectorId = null
  fromSectorOptions.value = []
  if (id) await loadSectorsFor('from', id)
})

// Relocation: to warehouse → to sector
watch(() => form.toWarehouseId, async (id, oldId) => {
  if (id === oldId) return
  form.sectorId = null
  toSectorOptions.value = []
  if (id) await loadSectorsFor('to', id)
})

function resetForm() {
  form.productId = null
  form.warehouseId = null
  form.sectorId = null
  form.fromWarehouseId = null
  form.fromSectorId = null
  form.toWarehouseId = null
  form.quantity = null
  form.reason = null
  form.adjustmentType = null
  form.notes = ''
  selectedUnit.value = null
  sectorOptions.value = []
  fromSectorOptions.value = []
  toSectorOptions.value = []
  formRef.value?.resetValidation()
}

async function handleSubmit() {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  emit('submit', {
    productId: form.productId as number,
    sectorId: form.sectorId as number,
    quantity: form.quantity as number,
    fromSectorId: form.fromSectorId ?? undefined,
    reason: form.reason ?? undefined,
    adjustmentType: form.adjustmentType ?? undefined,
    notes: form.notes || undefined,
  })
}

function close() {
  emit('update:modelValue', false)
}
</script>
