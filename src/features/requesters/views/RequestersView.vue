<template>
  <v-container fluid>
    <!-- Header -->
    <div class="page-header">
      <div class="d-flex align-center ga-3">
        <v-avatar size="40" color="primary" variant="tonal">
          <v-icon icon="mdi-account-arrow-right-outline" size="22" />
        </v-avatar>
        <div>
          <h1 class="text-h5 font-weight-bold" style="color: rgb(var(--v-theme-primary));">{{ t('requesters.title') }}</h1>
          <p class="text-body-2 text-medium-emphasis mt-1">{{ t('requesters.subtitle') }}</p>
        </div>
      </div>
    </div>

    <v-row style="margin-top: 32px;">
      <!-- Left: Table -->
      <v-col cols="12" lg="8">
        <BaseDataTable
          :headers="headers"
          :items="requesters"
          :search="search"
          :loading="isLoading"
          :no-data-text="t('requesters.noResults')"
          :skeleton-rows="5"
          item-value="id"
        >
          <template #toolbar>
            <div class="d-flex align-center ga-3">
              <v-text-field
                v-model="search"
                :placeholder="t('requesters.search')"
                prepend-inner-icon="mdi-magnify"
                clearable
                single-line
                class="bda-search-field"
              />
              <v-spacer />
              <v-btn color="primary" prepend-icon="mdi-plus" size="small" @click="openCreate">
                {{ t('requesters.createRequester') }}
              </v-btn>
            </div>
          </template>

          <template #empty>
            <v-icon icon="mdi-account-arrow-right-outline" size="48" class="mb-3 text-medium-emphasis" />
            <p class="text-body-1 text-medium-emphasis">{{ t('requesters.noRequesters') }}</p>
          </template>

          <template #item.description="{ item }">
            <span v-if="item.description" class="text-medium-emphasis text-caption">{{ item.description }}</span>
            <span v-else class="text-disabled">—</span>
          </template>

          <template #item.createdAt="{ item }">
            {{ formatDate(item.createdAt) }}
          </template>

          <template #item.actions="{ item }">
            <div class="d-flex justify-end ga-1">
              <v-btn
                icon="mdi-pencil-outline"
                size="x-small"
                variant="text"
                color="primary"
                @click="openEdit(item as RequesterDto)"
              />
              <v-btn
                icon="mdi-delete-outline"
                size="x-small"
                variant="text"
                color="error"
                @click="openDelete(item as RequesterDto)"
              />
            </div>
          </template>
        </BaseDataTable>
      </v-col>

      <!-- Right: Info panel -->
      <v-col cols="12" lg="4">
        <div class="info-panel">
          <div class="info-panel-header">
            <v-icon icon="mdi-lightbulb-outline" size="20" color="primary" />
            <span class="text-body-1 font-weight-bold">{{ t('requesters.infoTitle') }}</span>
          </div>
          <p class="text-caption text-medium-emphasis mb-5">
            {{ t('requesters.infoDescription') }}
          </p>

          <div class="info-section mb-5">
            <div class="d-flex align-center ga-2 mb-3">
              <v-avatar size="28" color="primary" variant="tonal">
                <v-icon icon="mdi-account-arrow-right-outline" size="16" />
              </v-avatar>
              <span class="text-body-2 font-weight-bold">{{ t('requesters.infoHowTitle') }}</span>
            </div>
            <ul class="info-list">
              <li v-for="(item, i) in tm('requesters.infoHowItems')" :key="i" class="text-caption">
                {{ item }}
              </li>
            </ul>
          </div>

          <div class="info-section">
            <div class="d-flex align-center ga-2 mb-3">
              <v-avatar size="28" color="warning" variant="tonal">
                <v-icon icon="mdi-alert-circle-outline" size="16" />
              </v-avatar>
              <span class="text-body-2 font-weight-bold">{{ t('requesters.infoRulesTitle') }}</span>
            </div>
            <ul class="info-list">
              <li v-for="(item, i) in tm('requesters.infoRulesItems')" :key="i" class="text-caption">
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
    <RequesterFormDialog
      v-model="formDialog"
      :requester="selectedRequester"
      :loading="formLoading"
      @submit="handleSubmit"
    />
    <RequesterDeleteDialog
      v-model="deleteDialog"
      :requester="selectedRequester"
      :loading="deleteLoading"
      @confirm="handleDelete"
    />
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequesters } from '@/composables/useRequesters'
import { useSnackbar } from '@/composables/useSnackbar'
import { formatDate } from '@/utils/formatters'
import type { RequesterDto, CreateRequesterRequest, UpdateRequesterRequest } from '@/types/api.types'
import BaseDataTable from '@/components/BaseDataTable.vue'
import RequesterFormDialog from '../components/RequesterFormDialog.vue'
import RequesterDeleteDialog from '../components/RequesterDeleteDialog.vue'

const { t, tm } = useI18n()
const { requesters, isLoading, error, fetchRequesters, createRequester, updateRequester, deleteRequester } = useRequesters()
const snackbar = useSnackbar()

const search = ref('')
const formDialog = ref(false)
const deleteDialog = ref(false)
const selectedRequester = ref<RequesterDto | null>(null)
const formLoading = ref(false)
const deleteLoading = ref(false)

const headers = computed(() => [
  { title: t('requesters.name'), key: 'name', sortable: true },
  { title: t('requesters.description'), key: 'description', sortable: false },
  { title: t('requesters.createdAt'), key: 'createdAt', sortable: true },
  { title: t('requesters.actions'), key: 'actions', sortable: false, align: 'end' as const },
])

onMounted(fetchRequesters)

function openCreate() {
  selectedRequester.value = null
  formDialog.value = true
}

function openEdit(requester: RequesterDto) {
  selectedRequester.value = requester
  formDialog.value = true
}

function openDelete(requester: RequesterDto) {
  selectedRequester.value = requester
  deleteDialog.value = true
}

async function handleSubmit(data: { name: string; description: string }) {
  formLoading.value = true
  try {
    if (selectedRequester.value) {
      const updateData: UpdateRequesterRequest = {
        id: selectedRequester.value.id,
        name: data.name,
        description: data.description || null,
      }
      await updateRequester(selectedRequester.value.id, updateData)
      snackbar.show(t('requesters.updateSuccess'))
    } else {
      const createData: CreateRequesterRequest = {
        name: data.name,
        description: data.description || null,
      }
      await createRequester(createData)
      snackbar.show(t('requesters.createSuccess'))
    }
    formDialog.value = false
  } catch {
    snackbar.show(error.value ?? t('errors.generic'), 'error')
  } finally {
    formLoading.value = false
  }
}

async function handleDelete() {
  if (!selectedRequester.value) return
  deleteLoading.value = true
  try {
    await deleteRequester(selectedRequester.value.id)
    snackbar.show(t('requesters.deleteSuccess'))
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
