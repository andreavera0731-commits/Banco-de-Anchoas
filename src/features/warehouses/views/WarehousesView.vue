<template>
  <v-container fluid>
    <!-- Header -->
    <div class="page-header">
      <div class="d-flex align-center ga-3">
        <v-avatar size="40" color="primary" variant="tonal">
          <v-icon icon="mdi-warehouse" size="22" />
        </v-avatar>
        <div>
          <h1 class="text-h5 font-weight-bold" style="color: rgb(var(--v-theme-primary));">{{ t('warehouses.title') }}</h1>
          <p class="text-body-2 text-medium-emphasis mt-1">{{ t('warehouses.subtitle') }}</p>
        </div>
      </div>
    </div>

    <v-row style="margin-top: 32px;">
      <!-- Left: Warehouses table -->
      <v-col cols="12" lg="8">
        <BaseDataTable
          :headers="headers"
          :items="warehouses"
          :search="search"
          :loading="isLoading"
          :no-data-text="t('warehouses.noResults')"
          :skeleton-rows="5"
          item-value="id"
        >
          <template #toolbar>
            <div class="d-flex align-center ga-3">
              <v-text-field
                v-model="search"
                :placeholder="t('warehouses.search')"
                prepend-inner-icon="mdi-magnify"
                clearable
                single-line
                class="bda-search-field"
              />
              <v-spacer />
              <v-btn color="primary" prepend-icon="mdi-plus" size="small" @click="openCreate">
                {{ t('warehouses.createWarehouse') }}
              </v-btn>
            </div>
          </template>

          <template #empty>
            <v-icon icon="mdi-warehouse" size="48" class="mb-3 text-medium-emphasis" />
            <p class="text-body-1 text-medium-emphasis">{{ t('warehouses.noWarehouses') }}</p>
          </template>

          <template #item.name="{ item }">
            <span
              class="warehouse-name"
              @click="selectWarehouse(item as WarehouseDto)"
            >
              {{ item.name }}
            </span>
          </template>

          <template #item.location="{ item }">
            <span v-if="item.location" class="text-body-2">{{ item.location }}</span>
            <span v-else class="text-caption text-medium-emphasis">—</span>
          </template>

          <template #item.createdAt="{ item }">
            {{ formatDate(item.createdAt) }}
          </template>

          <template #item.actions="{ item }">
            <div class="d-flex justify-end ga-1">
              <v-btn
                icon="mdi-eye-outline"
                size="x-small"
                variant="text"
                color="primary"
                @click="selectWarehouse(item as WarehouseDto)"
              />
              <v-btn
                icon="mdi-pencil-outline"
                size="x-small"
                variant="text"
                color="primary"
                @click="openEdit(item as WarehouseDto)"
              />
              <v-btn
                icon="mdi-delete-outline"
                size="x-small"
                variant="text"
                color="error"
                @click="openDelete(item as WarehouseDto)"
              />
            </div>
          </template>
        </BaseDataTable>
      </v-col>

      <!-- Right: Sectors panel or Info panel -->
      <v-col cols="12" lg="4">
        <!-- Sectors tree panel (when warehouse selected) -->
        <div v-if="selectedWarehouse" class="info-panel">
          <div class="d-flex align-center justify-space-between mb-4">
            <div class="d-flex align-center ga-2">
              <v-avatar size="28" color="primary" variant="tonal">
                <v-icon icon="mdi-file-tree-outline" size="16" />
              </v-avatar>
              <span class="text-body-1 font-weight-bold">
                {{ t('warehouses.sectorsOf', { name: selectedWarehouse.name }) }}
              </span>
            </div>
            <div class="d-flex ga-1">
              <v-btn
                icon="mdi-plus"
                size="x-small"
                variant="tonal"
                color="primary"
                @click="openCreateSector"
              />
              <v-btn
                icon="mdi-close"
                size="x-small"
                variant="text"
                @click="selectedWarehouse = null"
              />
            </div>
          </div>

          <div v-if="sectorsLoading" class="d-flex justify-center py-8">
            <v-progress-circular indeterminate color="primary" size="32" />
          </div>

          <div v-else-if="sectors.length === 0" class="text-center py-8">
            <v-icon icon="mdi-cube-off-outline" size="40" class="mb-2 text-medium-emphasis" />
            <p class="text-caption text-medium-emphasis">{{ t('warehouses.noSectors') }}</p>
            <v-btn
              color="primary"
              variant="tonal"
              size="small"
              class="mt-3"
              prepend-icon="mdi-plus"
              @click="openCreateSector"
            >
              {{ t('warehouses.createSector') }}
            </v-btn>
          </div>

          <!-- Tree view -->
          <v-treeview
            v-else
            :items="sectorTreeItems"
            item-value="id"
            item-title="title"
            item-children="children"
            open-all
            hide-actions
            indent-lines="default"
            density="compact"
          >
            <template #prepend="{ item }">
              <v-icon
                :icon="item.type === 'warehouse' ? 'mdi-warehouse' : 'mdi-cube-outline'"
                :size="item.type === 'warehouse' ? 18 : 16"
                color="primary"
              />
            </template>
            <template #title="{ item }">
              <div class="d-flex align-center ga-2 flex-wrap">
                <span class="text-body-2" :class="item.type === 'warehouse' ? 'font-weight-bold' : 'font-weight-medium'">
                  {{ item.title }}
                </span>
                <template v-if="item.type === 'sector' && item.raw?.categories?.length">
                  <v-chip
                    v-for="cat in item.raw.categories"
                    :key="cat.id"
                    size="x-small"
                    variant="tonal"
                    color="primary"
                    label
                  >
                    {{ cat.name }}
                  </v-chip>
                </template>
              </div>
            </template>
            <template #append="{ item }">
              <div v-if="item.type === 'sector'" class="tree-actions">
                <v-btn icon="mdi-qrcode" size="x-small" variant="text" color="primary" @click.stop="openQr(item.raw)" />
                <v-btn icon="mdi-pencil-outline" size="x-small" variant="text" color="primary" @click.stop="openEditSector(item.raw)" />
                <v-btn icon="mdi-delete-outline" size="x-small" variant="text" color="error" @click.stop="openDeleteSector(item.raw)" />
              </div>
            </template>
          </v-treeview>
        </div>

        <!-- Info panel (no warehouse selected) -->
        <div v-else class="info-panel">
          <div class="info-section">
            <v-avatar size="28" color="primary" variant="tonal">
              <v-icon icon="mdi-information-outline" size="16" />
            </v-avatar>
            <span class="text-body-1 font-weight-bold">{{ t('warehouses.infoTitle') }}</span>
          </div>
          <p class="text-caption text-medium-emphasis mb-5">
            {{ t('warehouses.infoDescription') }}
          </p>

          <div class="info-subsection mb-5">
            <div class="d-flex align-center ga-2 mb-3">
              <v-avatar size="24" color="primary" variant="tonal">
                <v-icon icon="mdi-warehouse" size="14" />
              </v-avatar>
              <span class="text-body-2 font-weight-bold">{{ t('warehouses.infoHowTitle') }}</span>
            </div>
            <ul class="info-list">
              <li v-for="(item, i) in tm('warehouses.infoHowItems')" :key="i" class="text-caption">
                {{ item }}
              </li>
            </ul>
          </div>

          <div class="info-subsection">
            <div class="d-flex align-center ga-2 mb-3">
              <v-avatar size="24" color="warning" variant="tonal">
                <v-icon icon="mdi-alert-outline" size="14" />
              </v-avatar>
              <span class="text-body-2 font-weight-bold">{{ t('warehouses.infoRulesTitle') }}</span>
            </div>
            <ul class="info-list">
              <li v-for="(item, i) in tm('warehouses.infoRulesItems')" :key="i" class="text-caption">
                {{ item }}
              </li>
            </ul>
          </div>

          <p class="text-caption text-medium-emphasis mt-5 text-center" style="opacity: 0.7;">
            {{ t('warehouses.selectWarehouse') }}
          </p>
        </div>
      </v-col>
    </v-row>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar.visible.value" :color="snackbar.color.value" location="top end" :timeout="3000">
      {{ snackbar.message.value }}
    </v-snackbar>

    <!-- Warehouse dialogs -->
    <WarehouseFormDialog
      v-model="formDialog"
      :warehouse="editingWarehouse"
      :loading="formLoading"
      @submit="handleWarehouseSubmit"
    />
    <WarehouseDeleteDialog
      v-model="deleteDialog"
      :warehouse="deletingWarehouse"
      :loading="deleteLoading"
      @confirm="handleWarehouseDelete"
    />

    <!-- Sector dialogs -->
    <SectorFormDialog
      v-model="sectorFormDialog"
      :sector="editingSector"
      :loading="sectorFormLoading"
      @submit="handleSectorSubmit"
    />
    <SectorDeleteDialog
      v-model="sectorDeleteDialog"
      :sector="deletingSector"
      :loading="sectorDeleteLoading"
      @confirm="handleSectorDelete"
    />
    <SectorQrDialog
      v-model="qrDialog"
      :sector="qrSector"
      :warehouse-name="selectedWarehouse?.name"
    />
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useWarehouses } from '@/composables/useWarehouses'
import { useSnackbar } from '@/composables/useSnackbar'
import { formatDate } from '@/utils/formatters'
import type { WarehouseDto, SectorDto } from '@/types/api.types'
import BaseDataTable from '@/components/BaseDataTable.vue'
import WarehouseFormDialog from '../components/WarehouseFormDialog.vue'
import WarehouseDeleteDialog from '../components/WarehouseDeleteDialog.vue'
import SectorFormDialog from '../components/SectorFormDialog.vue'
import SectorDeleteDialog from '../components/SectorDeleteDialog.vue'
import SectorQrDialog from '../components/SectorQrDialog.vue'

const { t, tm } = useI18n()
const {
  warehouses,
  sectors,
  isLoading,
  error,
  fetchWarehouses,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
  fetchWarehouseSectors,
  createSector,
  updateSector,
  deleteSector,
} = useWarehouses()
const snackbar = useSnackbar()

// Search
const search = ref('')

// Warehouse selection
const selectedWarehouse = ref<WarehouseDto | null>(null)
const sectorsLoading = ref(false)

// Warehouse CRUD state
const formDialog = ref(false)
const deleteDialog = ref(false)
const editingWarehouse = ref<WarehouseDto | null>(null)
const deletingWarehouse = ref<WarehouseDto | null>(null)
const formLoading = ref(false)
const deleteLoading = ref(false)

// Sector CRUD state
const sectorFormDialog = ref(false)
const sectorDeleteDialog = ref(false)
const editingSector = ref<SectorDto | null>(null)
const deletingSector = ref<SectorDto | null>(null)
const sectorFormLoading = ref(false)
const sectorDeleteLoading = ref(false)

// QR dialog state
const qrDialog = ref(false)
const qrSector = ref<SectorDto | null>(null)

const headers = computed(() => [
  { title: t('warehouses.name'), key: 'name', sortable: true },
  { title: t('warehouses.location'), key: 'location', sortable: true },
  { title: t('warehouses.createdAt'), key: 'createdAt', sortable: true },
  { title: t('warehouses.actions'), key: 'actions', sortable: false, align: 'end' as const },
])

const sectorTreeItems = computed(() => [
  {
    id: 'warehouse-root',
    title: selectedWarehouse.value?.name ?? '',
    type: 'warehouse' as const,
    children: sectors.value.map((sector) => ({
      id: `sector-${sector.id}`,
      title: sector.name,
      type: 'sector' as const,
      raw: sector,
    })),
  },
])

onMounted(fetchWarehouses)

// --- Warehouse selection ---

async function selectWarehouse(warehouse: WarehouseDto) {
  selectedWarehouse.value = warehouse
  sectorsLoading.value = true
  await fetchWarehouseSectors(warehouse.id)
  if (error.value) {
    snackbar.show(error.value ?? t('errors.loadSectors'), 'error')
  }
  sectorsLoading.value = false
}

// --- Warehouse CRUD ---

function openCreate() {
  editingWarehouse.value = null
  formDialog.value = true
}

function openEdit(warehouse: WarehouseDto) {
  editingWarehouse.value = warehouse
  formDialog.value = true
}

function openDelete(warehouse: WarehouseDto) {
  deletingWarehouse.value = warehouse
  deleteDialog.value = true
}

async function handleWarehouseSubmit(data: { name: string; location: string | null }) {
  formLoading.value = true
  try {
    if (editingWarehouse.value) {
      await updateWarehouse(editingWarehouse.value.id, {
        id: editingWarehouse.value.id,
        name: data.name,
        location: data.location,
      })
      snackbar.show(t('warehouses.updateSuccess'))
    } else {
      await createWarehouse({
        name: data.name,
        location: data.location,
      })
      snackbar.show(t('warehouses.createSuccess'))
    }
    formDialog.value = false
  } catch {
    snackbar.show(error.value ?? t('errors.generic'), 'error')
  } finally {
    formLoading.value = false
  }
}

async function handleWarehouseDelete() {
  if (!deletingWarehouse.value) return
  deleteLoading.value = true
  try {
    await deleteWarehouse(deletingWarehouse.value.id)
    snackbar.show(t('warehouses.deleteSuccess'))
    deleteDialog.value = false
    if (selectedWarehouse.value?.id === deletingWarehouse.value.id) {
      selectedWarehouse.value = null
    }
  } catch {
    snackbar.show(error.value ?? t('errors.generic'), 'error')
  } finally {
    deleteLoading.value = false
  }
}

// --- Sector CRUD ---

function openCreateSector() {
  editingSector.value = null
  sectorFormDialog.value = true
}

function openEditSector(sector: SectorDto) {
  editingSector.value = sector
  sectorFormDialog.value = true
}

function openDeleteSector(sector: SectorDto) {
  deletingSector.value = sector
  sectorDeleteDialog.value = true
}

function openQr(sector: SectorDto) {
  qrSector.value = sector
  qrDialog.value = true
}

async function handleSectorSubmit(data: { name: string; categoryIds: number[] }) {
  if (!selectedWarehouse.value) return
  sectorFormLoading.value = true
  try {
    if (editingSector.value) {
      await updateSector(editingSector.value.id, {
        id: editingSector.value.id,
        name: data.name,
        categoryIds: data.categoryIds,
      })
      await fetchWarehouseSectors(selectedWarehouse.value.id)
      snackbar.show(t('warehouses.sectorUpdateSuccess'))
    } else {
      await createSector(selectedWarehouse.value.id, {
        name: data.name,
        warehouseId: selectedWarehouse.value.id,
        categoryIds: data.categoryIds,
      })
      snackbar.show(t('warehouses.sectorCreateSuccess'))
    }
    sectorFormDialog.value = false
  } catch {
    snackbar.show(error.value ?? t('errors.generic'), 'error')
  } finally {
    sectorFormLoading.value = false
  }
}

async function handleSectorDelete() {
  if (!deletingSector.value || !selectedWarehouse.value) return
  sectorDeleteLoading.value = true
  try {
    await deleteSector(deletingSector.value.id)
    await fetchWarehouseSectors(selectedWarehouse.value.id)
    snackbar.show(t('warehouses.sectorDeleteSuccess'))
    sectorDeleteDialog.value = false
  } catch {
    snackbar.show(error.value ?? t('errors.generic'), 'error')
  } finally {
    sectorDeleteLoading.value = false
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

.info-section {
  display: flex;
  align-items: center;
  gap: var(--bda-space-2);
  margin-bottom: var(--bda-space-2);
}

.info-subsection {
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

.warehouse-name {
  cursor: pointer;
  font-weight: 500;
  color: rgb(var(--v-theme-primary));
  transition: opacity var(--bda-transition-fast);
}

.warehouse-name:hover {
  opacity: 0.8;
}

/* ── Tree view adjustments ── */

/* Pull root node (warehouse) left so icon aligns with indent origin */
:deep(.v-treeview > .v-treeview-group > .v-treeview-item) {
  padding-inline-start: 4px !important;
}

/* Pull children left to tighten hierarchy */
:deep(.v-treeview .v-list-group__items .v-treeview-item) {
  padding-inline-start: calc(var(--indent-padding) - 8px) !important;
}

/* ── Tree view actions (show on hover) ── */
.tree-actions {
  display: flex;
  opacity: 0;
  transition: opacity var(--bda-transition-fast);
}

:deep(.v-treeview-item):hover .tree-actions {
  opacity: 1;
}

/* Override last-leaf to render like a regular leaf connector */
:deep(.v-treeview-indent-line--last-leaf) {
  border-inline-start-width: 0;
  border-bottom-width: 0;
  border-bottom-left-radius: 0;
  margin-inline-start: 0;
  height: 100%;
  width: calc(50% + 1px);
  justify-self: end;
  position: relative;
}

:deep(.v-treeview-indent-line--last-leaf)::before {
  content: "";
  position: absolute;
  border: 0px solid var(--v-treeview-indent-line-color);
  border-inline-start-width: 1px;
  border-bottom-width: 1px;
  height: calc(50% + 1px);
  width: 100%;
}

:deep(.v-treeview-indent-line--last-leaf:last-child)::before {
  width: calc(100% - 4px);
}
</style>
