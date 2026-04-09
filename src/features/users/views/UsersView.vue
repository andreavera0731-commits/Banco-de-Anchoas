<template>
  <v-container fluid>
    <!-- Header -->
    <div class="page-header">
      <div class="d-flex align-center ga-3">
        <v-avatar size="40" color="primary" variant="tonal">
          <v-icon icon="mdi-account-group-outline" size="22" />
        </v-avatar>
        <div>
          <h1 class="text-h5 font-weight-bold" style="color: rgb(var(--v-theme-primary));">{{ t('users.title') }}</h1>
          <p class="text-body-2 text-medium-emphasis mt-1">{{ t('users.subtitle') }}</p>
        </div>
      </div>
    </div>

    <v-row style="margin-top: 32px;">
      <!-- Left: Table -->
      <v-col cols="12" lg="8">
        <BaseDataTable
          :headers="headers"
          :items="users"
          :search="search"
          :loading="isLoading"
          :no-data-text="t('users.noResults')"
          :skeleton-rows="5"
          item-value="id"
        >
          <template #toolbar>
            <div class="d-flex align-center ga-3">
              <v-text-field
                v-model="search"
                :placeholder="t('users.search')"
                prepend-inner-icon="mdi-magnify"
                clearable
                single-line
                class="bda-search-field"
              />
              <v-spacer />
              <v-btn color="primary" prepend-icon="mdi-plus" size="small" @click="openCreate">
                {{ t('users.createUser') }}
              </v-btn>
            </div>
          </template>

          <template #empty>
            <v-icon icon="mdi-account-group-outline" size="48" class="mb-3 text-medium-emphasis" />
            <p class="text-body-1 text-medium-emphasis">{{ t('users.noUsers') }}</p>
          </template>

          <template #item.role="{ item }">
            <v-chip
              size="small"
              :color="item.role === 'Admin' ? 'primary' : 'secondary'"
              variant="tonal"
              label
            >
              <v-icon start :icon="item.role === 'Admin' ? 'mdi-shield-crown-outline' : 'mdi-warehouse'" size="14" />
              {{ item.role === 'Admin' ? t('users.admin') : t('users.warehouseWorker') }}
            </v-chip>
          </template>

          <template #item.isActive="{ item }">
            <v-chip
              size="small"
              :color="item.isActive ? 'success' : 'error'"
              variant="tonal"
              label
            >
              {{ item.isActive ? t('users.active') : t('users.inactive') }}
            </v-chip>
          </template>

          <template #item.actions="{ item }">
            <div class="d-flex justify-end ga-1">
              <v-btn
                icon="mdi-pencil-outline"
                size="x-small"
                variant="text"
                color="primary"
                @click="openEdit(item as UserDto)"
              />
              <v-btn
                icon="mdi-delete-outline"
                size="x-small"
                variant="text"
                color="error"
                @click="openDelete(item as UserDto)"
              />
            </div>
          </template>
        </BaseDataTable>
      </v-col>

      <!-- Right: Roles info -->
      <v-col cols="12" lg="4">
        <div class="roles-panel">
          <div class="roles-panel-header">
            <v-icon icon="mdi-shield-account-outline" size="20" color="primary" />
            <span class="text-body-1 font-weight-bold">{{ t('users.rolesTitle') }}</span>
          </div>
          <p class="text-caption text-medium-emphasis mb-5">
            {{ t('users.rolesDescription') }}
          </p>

          <!-- Admin role -->
          <div class="role-section mb-5">
            <div class="d-flex align-center ga-2 mb-3">
              <v-avatar size="28" color="primary" variant="tonal">
                <v-icon icon="mdi-shield-crown-outline" size="16" />
              </v-avatar>
              <span class="text-body-2 font-weight-bold">{{ t('users.adminRole') }}</span>
            </div>
            <ul class="role-permissions">
              <li v-for="(perm, i) in tm('users.adminPermissions')" :key="i" class="text-caption">
                {{ perm }}
              </li>
            </ul>
          </div>

          <!-- Warehouse role -->
          <div class="role-section">
            <div class="d-flex align-center ga-2 mb-3">
              <v-avatar size="28" color="secondary" variant="tonal">
                <v-icon icon="mdi-warehouse" size="16" />
              </v-avatar>
              <span class="text-body-2 font-weight-bold">{{ t('users.warehouseRole') }}</span>
            </div>
            <ul class="role-permissions">
              <li v-for="(perm, i) in tm('users.warehousePermissions')" :key="i" class="text-caption">
                {{ perm }}
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
    <UserFormDialog
      v-model="formDialog"
      :user="selectedUser"
      :loading="formLoading"
      @submit="handleSubmit"
    />
    <UserDeleteDialog
      v-model="deleteDialog"
      :user="selectedUser"
      :loading="deleteLoading"
      @confirm="handleDelete"
    />
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUsers } from '@/composables/useUsers'
import { useSnackbar } from '@/composables/useSnackbar'
import type { UserDto, UserRole } from '@/types/api.types'
import BaseDataTable from '@/components/BaseDataTable.vue'
import UserFormDialog from '../components/UserFormDialog.vue'
import UserDeleteDialog from '../components/UserDeleteDialog.vue'

const { t, tm } = useI18n()
const { users, isLoading, error, fetchUsers, createUser, updateUser, deleteUser } = useUsers()
const snackbar = useSnackbar()

const search = ref('')
const formDialog = ref(false)
const deleteDialog = ref(false)
const selectedUser = ref<UserDto | null>(null)
const formLoading = ref(false)
const deleteLoading = ref(false)

const headers = computed(() => [
  { title: t('users.name'), key: 'name', sortable: true },
  { title: t('users.email'), key: 'email', sortable: true },
  { title: t('users.role'), key: 'role', sortable: true },
  { title: t('users.status'), key: 'isActive', sortable: true },
  { title: t('users.actions'), key: 'actions', sortable: false, align: 'end' as const },
])

onMounted(fetchUsers)

function openCreate() {
  selectedUser.value = null
  formDialog.value = true
}

function openEdit(user: UserDto) {
  selectedUser.value = user
  formDialog.value = true
}

function openDelete(user: UserDto) {
  selectedUser.value = user
  deleteDialog.value = true
}

async function handleSubmit(data: { name: string; email: string; password: string; role: UserRole }) {
  formLoading.value = true
  try {
    if (selectedUser.value) {
      await updateUser(selectedUser.value.id, {
        email: data.email,
        name: data.name,
        role: data.role,
      })
      snackbar.show(t('users.updateSuccess'))
    } else {
      await createUser({
        email: data.email,
        name: data.name,
        password: data.password,
        role: data.role,
      })
      snackbar.show(t('users.createSuccess'))
    }
    formDialog.value = false
  } catch {
    snackbar.show(error.value ?? t('errors.generic'), 'error')
  } finally {
    formLoading.value = false
  }
}

async function handleDelete() {
  if (!selectedUser.value) return
  deleteLoading.value = true
  try {
    await deleteUser(selectedUser.value.id)
    snackbar.show(t('users.deleteSuccess'))
    deleteDialog.value = false
  } catch {
    snackbar.show(error.value ?? t('errors.generic'), 'error')
  } finally {
    deleteLoading.value = false
  }
}
</script>

<style scoped>
.roles-panel {
  border: 1px solid var(--bda-border-color);
  border-radius: var(--bda-radius-md);
  padding: var(--bda-space-5) var(--bda-space-5);
  background: rgb(var(--v-theme-surface));
}

.roles-panel-header {
  display: flex;
  align-items: center;
  gap: var(--bda-space-2);
  margin-bottom: var(--bda-space-2);
}

.role-section {
  padding: var(--bda-space-3) var(--bda-space-4);
  border-radius: var(--bda-radius-sm);
  background: rgb(var(--v-theme-surface-variant) / 0.4);
}

.role-permissions {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--bda-space-2);
}

.role-permissions li {
  display: flex;
  align-items: flex-start;
  gap: var(--bda-space-2);
  color: var(--bda-text-secondary);
}

.role-permissions li::before {
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
