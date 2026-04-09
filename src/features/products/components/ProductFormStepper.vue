<template>
  <v-dialog
    :model-value="modelValue"
    max-width="800"
    persistent
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card rounded="lg">
      <v-card-title class="d-flex align-center ga-3 pt-6 px-7 pb-0">
        <v-avatar size="36" color="primary" variant="tonal">
          <v-icon :icon="isEditing ? 'mdi-pencil-outline' : 'mdi-package-variant-plus'" size="20" />
        </v-avatar>
        <span class="text-h6 font-weight-bold">
          {{ isEditing ? t('products.editProduct') : t('products.createProduct') }}
        </span>
      </v-card-title>

      <v-card-text class="px-7 pt-3 pb-0">
        <v-stepper
          v-model="currentStep"
          :items="stepItems"
          flat
          alt-labels
          hide-actions
          class="product-stepper"
        >
          <!-- Step 1: Identification (barcode + basic info) -->
          <template #item.1>
            <v-form ref="step1Ref" class="d-flex flex-column ga-4 pt-3">
              <!-- Barcode input -->
              <div>
                <v-text-field
                  v-model="form.barcode"
                  :label="`${t('products.barcode')} ${t('products.optional')}`"
                  prepend-inner-icon="mdi-barcode"
                  :loading="barcodeLookupLoading"
                  :disabled="isEditing"
                  @update:model-value="onBarcodeInput"
                />

                <!-- Product found alert -->
                <v-alert
                  v-if="barcodeMatchProduct"
                  type="success"
                  density="compact"
                  variant="tonal"
                  class="mt-2"
                  closable
                >
                  {{ t('products.barcodeFound', { name: barcodeMatchProduct.name }) }}
                </v-alert>

                <!-- Barcode not found info -->
                <v-alert
                  v-else-if="barcodeNotFound"
                  type="info"
                  density="compact"
                  variant="tonal"
                  class="mt-2"
                >
                  {{ t('products.barcodeNotFound') }}
                </v-alert>
              </div>

              <v-text-field
                v-model="form.name"
                :label="t('products.name')"
                :rules="rules.required"
                prepend-inner-icon="mdi-package-variant"
                :autofocus="!form.barcode"
              />

              <v-select
                v-model="form.categoryId"
                :items="categories"
                item-title="name"
                item-value="id"
                :label="t('products.category')"
                :rules="rules.selectRequired"
                prepend-inner-icon="mdi-tag-outline"
                :loading="categoriesLoading"
                :menu-props="{ location: 'top' }"
              />

              <v-textarea
                v-model="form.description"
                :label="`${t('products.description')} ${t('products.optional')}`"
                prepend-inner-icon="mdi-text"
                rows="2"
                auto-grow
                hide-details="auto"
              />
            </v-form>
          </template>

          <!-- Step 2: Inventory -->
          <template #item.2>
            <v-form ref="step2Ref" class="d-flex flex-column ga-4 pt-3">
              <v-select
                v-model="form.unit"
                :items="unitOptions"
                item-title="text"
                item-value="value"
                :label="t('products.unit')"
                :rules="rules.selectRequired"
                prepend-inner-icon="mdi-scale-balance"
                :menu-props="{ location: 'top' }"
              />

              <v-text-field
                v-if="!isEditing"
                v-model.number="form.stock"
                :label="t('products.stock')"
                :rules="rules.numberMin(0)"
                prepend-inner-icon="mdi-cube-outline"
                type="number"
                min="0"
              />

              <v-alert v-if="isEditing" type="info" density="compact" variant="tonal">
                {{ t('products.stockReadonly') }}
              </v-alert>

              <v-text-field
                v-model.number="form.minimumStock"
                :label="t('products.minimumStock')"
                :rules="rules.numberMin(0)"
                prepend-inner-icon="mdi-alert-outline"
                type="number"
                min="0"
              />
            </v-form>
          </template>

          <!-- Step 3: Commercial Details -->
          <template #item.3>
            <v-form ref="step3Ref" class="d-flex flex-column ga-4 pt-3">
              <v-text-field
                v-model.number="form.price"
                :label="`${t('products.price')} ${t('products.optional')}`"
                prepend-inner-icon="mdi-currency-usd"
                type="number"
                min="0"
                step="0.01"
              />

              <v-text-field
                v-model="form.supplier"
                :label="`${t('products.supplier')} ${t('products.optional')}`"
                prepend-inner-icon="mdi-truck-outline"
              />

              <DatePickerField
                v-model="form.expirationDate"
                :label="`${t('products.expirationDate')} ${t('products.optional')}`"
              />
            </v-form>
          </template>

          <!-- Step 4: Location -->
          <template #item.4>
            <v-form ref="step4Ref" class="d-flex flex-column ga-4 pt-3">
              <v-select
                v-model="selectedWarehouseId"
                :items="warehouses"
                item-title="name"
                item-value="id"
                :label="`${t('products.warehouse')} ${t('products.optional')}`"
                prepend-inner-icon="mdi-warehouse"
                :loading="warehousesLoading"
                clearable
                :menu-props="{ location: 'top' }"
                @update:model-value="onWarehouseChange"
              />

              <v-select
                v-model="form.defaultSectorId"
                :items="sectors"
                item-title="name"
                item-value="id"
                :label="`${t('products.sector')} ${t('products.optional')}`"
                prepend-inner-icon="mdi-map-marker-outline"
                :loading="sectorsLoading"
                :disabled="!selectedWarehouseId"
                clearable
                :menu-props="{ location: 'top' }"
              />
            </v-form>
          </template>
        </v-stepper>
      </v-card-text>

      <v-card-actions class="px-7 pb-6 pt-4">
        <v-btn variant="text" @click="close">
          {{ t('products.cancel') }}
        </v-btn>
        <v-spacer />
        <v-btn
          v-if="currentStep > 1"
          variant="text"
          @click="currentStep--"
        >
          {{ t('products.back') }}
        </v-btn>
        <v-btn
          v-if="currentStep < totalSteps"
          color="primary"
          variant="flat"
          min-width="100"
          @click="goNext"
        >
          {{ t('products.next') }}
        </v-btn>
        <v-btn
          v-else
          color="primary"
          variant="flat"
          :loading="loading"
          min-width="100"
          @click="handleSubmit"
        >
          {{ isEditing ? t('products.save') : t('products.create') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useValidationRules } from '@/utils/validators'
import { categoriesService } from '@/services/categories.service'
import { warehousesService } from '@/services/warehouses.service'
import { productsService } from '@/services/products.service'
import DatePickerField from '@/components/DatePickerField.vue'
import type {
  ProductDto,
  CategoryDto,
  WarehouseDto,
  SectorDto,
  CreateProductRequest,
  UpdateProductRequest,
  ProductUnit,
} from '@/types/api.types'

const props = defineProps<{
  modelValue: boolean
  product?: ProductDto | null
  loading?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'submit': [data: CreateProductRequest | UpdateProductRequest]
}>()

const { t } = useI18n()
const rules = useValidationRules()

const totalSteps = 4
const currentStep = ref(1)
const step1Ref = ref()
const step2Ref = ref()
const step3Ref = ref()
const step4Ref = ref()

// Form state
const form = reactive({
  name: '',
  description: '' as string | null,
  categoryId: null as number | null,
  unit: 'un' as ProductUnit,
  stock: 0,
  minimumStock: 0,
  barcode: '' as string | null,
  price: null as number | null,
  supplier: '' as string | null,
  expirationDate: '' as string | null,
  defaultSectorId: null as number | null,
})

// Barcode lookup state
const barcodeLookupLoading = ref(false)
const barcodeMatchProduct = ref<ProductDto | null>(null)
const barcodeNotFound = ref(false)
let barcodeLookupTimer: ReturnType<typeof setTimeout> | null = null

// Dependent data
const categories = ref<CategoryDto[]>([])
const categoriesLoading = ref(false)
const warehouses = ref<WarehouseDto[]>([])
const warehousesLoading = ref(false)
const sectors = ref<SectorDto[]>([])
const sectorsLoading = ref(false)
const selectedWarehouseId = ref<number | null>(null)

const isEditing = computed(() => !!props.product || !!barcodeMatchProduct.value)

const unitOptions = computed(() => [
  { value: 'kg', text: t('products.units.kg') },
  { value: 'g', text: t('products.units.g') },
  { value: 'un', text: t('products.units.un') },
  { value: 'lt', text: t('products.units.lt') },
  { value: 'ml', text: t('products.units.ml') },
])

const stepItems = computed(() => [
  { title: t('products.stepIdentification'), value: 1 },
  { title: t('products.stepInventory'), value: 2 },
  { title: t('products.stepCommercial'), value: 3 },
  { title: t('products.stepLocation'), value: 4 },
])

// Barcode input handler (debounced)
function onBarcodeInput(value: string | null) {
  barcodeMatchProduct.value = null
  barcodeNotFound.value = false

  if (barcodeLookupTimer) clearTimeout(barcodeLookupTimer)

  const barcode = value?.trim()
  if (!barcode || barcode.length < 3) return

  barcodeLookupTimer = setTimeout(() => lookupBarcode(barcode), 500)
}

async function lookupBarcode(barcode: string) {
  barcodeLookupLoading.value = true
  try {
    const res = await productsService.getByBarcode(barcode)
    const found = res.data.data
    barcodeMatchProduct.value = found
    barcodeNotFound.value = false
    populateFromProduct(found)
  } catch {
    // 404 = not found, which is fine for new products
    barcodeMatchProduct.value = null
    barcodeNotFound.value = true
  } finally {
    barcodeLookupLoading.value = false
  }
}

function populateFromProduct(p: ProductDto) {
  form.name = p.name
  form.description = p.description
  form.categoryId = p.categoryId
  form.unit = p.unit
  form.stock = 0 // fresh stock for re-creation or keep 0
  form.minimumStock = p.minimumStock
  form.price = p.price
  form.supplier = p.supplier
  form.expirationDate = p.expirationDate?.split('T')[0] ?? null
  form.defaultSectorId = p.defaultSectorId

  // Load sector's warehouse if applicable
  if (p.defaultSectorId) {
    loadSectorWarehouse(p.defaultSectorId)
  }
}

// Load categories and warehouses when dialog opens
watch(() => props.modelValue, async (open) => {
  if (open) {
    currentStep.value = 1
    resetForm()

    // Load dependent data
    categoriesLoading.value = true
    warehousesLoading.value = true
    try {
      const [catRes, whRes] = await Promise.all([
        categoriesService.getAll(),
        warehousesService.getAll(),
      ])
      categories.value = catRes.data.data
      warehouses.value = whRes.data.data
    } finally {
      categoriesLoading.value = false
      warehousesLoading.value = false
    }

    // Populate form for editing (when opened with a specific product)
    if (props.product) {
      form.name = props.product.name
      form.description = props.product.description
      form.categoryId = props.product.categoryId
      form.unit = props.product.unit
      form.stock = props.product.stock
      form.minimumStock = props.product.minimumStock
      form.barcode = props.product.barcode
      form.price = props.product.price
      form.supplier = props.product.supplier
      form.expirationDate = props.product.expirationDate?.split('T')[0] ?? null
      form.defaultSectorId = props.product.defaultSectorId

      if (props.product.defaultSectorId) {
        await loadSectorWarehouse(props.product.defaultSectorId)
      }
    }
  }
})

async function loadSectorWarehouse(sectorId: number) {
  for (const wh of warehouses.value) {
    try {
      const res = await warehousesService.getSectors(wh.id)
      const found = res.data.data.find(s => s.id === sectorId)
      if (found) {
        selectedWarehouseId.value = wh.id
        sectors.value = res.data.data
        break
      }
    } catch {
      // skip
    }
  }
}

async function onWarehouseChange(warehouseId: number | null) {
  form.defaultSectorId = null
  sectors.value = []
  if (!warehouseId) return

  sectorsLoading.value = true
  try {
    const res = await warehousesService.getSectors(warehouseId)
    sectors.value = res.data.data
  } finally {
    sectorsLoading.value = false
  }
}

function resetForm() {
  form.name = ''
  form.description = null
  form.categoryId = null
  form.unit = 'un'
  form.stock = 0
  form.minimumStock = 0
  form.barcode = null
  form.price = null
  form.supplier = null
  form.expirationDate = null
  form.defaultSectorId = null
  selectedWarehouseId.value = null
  sectors.value = []
  barcodeMatchProduct.value = null
  barcodeNotFound.value = false
  barcodeLookupLoading.value = false
}

function getStepRef(step: number) {
  switch (step) {
    case 1: return step1Ref.value
    case 2: return step2Ref.value
    case 3: return step3Ref.value
    case 4: return step4Ref.value
  }
}

async function validateCurrentStep(): Promise<boolean> {
  const formEl = getStepRef(currentStep.value)
  if (!formEl) return true
  const { valid } = await formEl.validate()
  return valid
}

async function goNext() {
  if (await validateCurrentStep()) {
    currentStep.value++
  }
}

async function handleSubmit() {
  if (!(await validateCurrentStep())) return

  const editingProduct = props.product ?? barcodeMatchProduct.value

  if (editingProduct) {
    const data: UpdateProductRequest = {
      id: editingProduct.id,
      name: form.name,
      description: form.description || null,
      barcode: form.barcode || null,
      price: form.price,
      unit: form.unit,
      minimumStock: form.minimumStock,
      expirationDate: form.expirationDate || null,
      supplier: form.supplier || null,
      categoryId: form.categoryId!,
      defaultSectorId: form.defaultSectorId,
    }
    emit('submit', data)
  } else {
    const data: CreateProductRequest = {
      name: form.name,
      description: form.description || null,
      barcode: form.barcode || null,
      price: form.price,
      unit: form.unit,
      stock: form.stock,
      minimumStock: form.minimumStock,
      expirationDate: form.expirationDate || null,
      supplier: form.supplier || null,
      categoryId: form.categoryId!,
      defaultSectorId: form.defaultSectorId,
    }
    emit('submit', data)
  }
}

function close() {
  emit('update:modelValue', false)
}
</script>

<style scoped>
.product-stepper {
  background: transparent !important;
}

.product-stepper :deep(.v-stepper-header) {
  box-shadow: none;
}

</style>
