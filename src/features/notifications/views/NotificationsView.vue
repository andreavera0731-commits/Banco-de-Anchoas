<template>
  <v-container fluid>
    <!-- Header -->
    <div class="page-header">
      <div class="d-flex align-center ga-3">
        <v-avatar size="40" color="primary" variant="tonal">
          <v-icon icon="mdi-bell-outline" size="22" />
        </v-avatar>
        <div>
          <h1 class="text-h5 font-weight-bold" style="color: rgb(var(--v-theme-primary));">
            {{ t('notifications.title') }}
          </h1>
          <p class="text-body-2 text-medium-emphasis mt-1">{{ t('notifications.subtitle') }}</p>
        </div>
      </div>
    </div>

    <v-row style="margin-top: 32px;">
      <!-- Left: Table -->
      <v-col cols="12" lg="8">
        <BaseDataTable
          :headers="headers"
          :items="filteredNotifications"
          :search="search"
          :loading="isLoading"
          :no-data-text="t('notifications.noResults')"
          :skeleton-rows="5"
          :items-per-page="-1"
          item-value="id"
        >
          <template #toolbar>
            <div class="d-flex align-center ga-3 flex-wrap">
              <v-text-field
                v-model="search"
                :placeholder="t('notifications.search')"
                prepend-inner-icon="mdi-magnify"
                clearable
                single-line
                class="bda-search-field"
              />
              <v-chip-group
                v-model="statusFilter"
                selected-class="text-primary"
                mandatory
                class="flex-grow-0"
                @update:model-value="onStatusFilter"
              >
                <v-chip value="all" size="small" variant="tonal" label>
                  {{ t('notifications.filterAll') }}
                </v-chip>
                <v-chip value="unread" size="small" variant="tonal" label>
                  {{ t('notifications.filterUnread') }}
                </v-chip>
                <v-chip value="read" size="small" variant="tonal" label>
                  {{ t('notifications.filterRead') }}
                </v-chip>
              </v-chip-group>
              <v-spacer />
              <v-chip
                size="small"
                variant="tonal"
                :color="hasUnread ? 'warning' : 'success'"
                label
              >
                <v-icon start :icon="hasUnread ? 'mdi-bell-ring-outline' : 'mdi-bell-check-outline'" size="14" />
                {{ hasUnread ? t('notifications.unreadCount', { count: unreadCount }) : t('notifications.noUnread') }}
              </v-chip>
              <v-btn
                color="primary"
                size="small"
                prepend-icon="mdi-check-all"
                :disabled="!hasUnread || markAllLoading"
                :loading="markAllLoading"
                @click="onMarkAllAsRead"
              >
                {{ t('notifications.markAllAsRead') }}
              </v-btn>
            </div>
          </template>

          <template #empty>
            <v-icon icon="mdi-bell-off-outline" size="48" class="mb-3 text-medium-emphasis" />
            <p class="text-body-1 text-medium-emphasis">{{ t('notifications.noNotifications') }}</p>
          </template>

          <template #item.createdAt="{ item }">
            <div class="d-flex flex-column">
              <span class="text-body-2">{{ formatRelativeTime(item.createdAt as string, t) }}</span>
              <span class="text-caption text-medium-emphasis">{{ formatDateTime(item.createdAt as string) }}</span>
            </div>
          </template>

          <template #item.type="{ item }">
            <v-chip
              size="small"
              :color="getNotificationTypeColor(item.type as number)"
              variant="tonal"
              label
            >
              <v-icon start :icon="getNotificationTypeIcon(item.type as number)" size="14" />
              {{ getNotificationTypeLabel(item.type as number) }}
            </v-chip>
          </template>

          <template #item.title="{ item }">
            <span :class="!item.isRead ? 'font-weight-bold' : ''">{{ item.title }}</span>
          </template>

          <template #item.message="{ item }">
            <span class="text-medium-emphasis text-caption">{{ item.message }}</span>
          </template>

          <template #item.isRead="{ item }">
            <v-chip
              size="small"
              :color="item.isRead ? 'success' : 'warning'"
              variant="tonal"
              label
            >
              <v-icon start :icon="item.isRead ? 'mdi-email-open-outline' : 'mdi-email-outline'" size="14" />
              {{ item.isRead ? t('notifications.read') : t('notifications.unread') }}
            </v-chip>
          </template>

          <template #item.actions="{ item }">
            <v-tooltip v-if="!item.isRead" location="top" :text="t('notifications.markAsRead')">
              <template #activator="{ props: tooltipProps }">
                <v-btn
                  v-bind="tooltipProps"
                  icon="mdi-email-open-outline"
                  size="small"
                  variant="text"
                  color="primary"
                  :loading="markingId === item.id"
                  @click="onMarkAsRead(item.id as number)"
                />
              </template>
            </v-tooltip>
            <span v-else class="text-disabled">—</span>
          </template>
        </BaseDataTable>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="d-flex justify-center mt-4">
          <v-pagination
            v-model="currentPage"
            :length="totalPages"
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
            <span class="text-body-1 font-weight-bold">{{ t('notifications.infoTitle') }}</span>
          </div>
          <p class="text-caption text-medium-emphasis mb-5">
            {{ t('notifications.infoDescription') }}
          </p>

          <!-- Notification types -->
          <div class="info-section mb-5">
            <div class="d-flex align-center ga-2 mb-3">
              <v-avatar size="28" color="primary" variant="tonal">
                <v-icon icon="mdi-bell-outline" size="16" />
              </v-avatar>
              <span class="text-body-2 font-weight-bold">{{ t('notifications.infoTypesTitle') }}</span>
            </div>
            <ul class="info-list">
              <li v-for="(item, i) in tm('notifications.infoTypesItems')" :key="i" class="text-caption">
                {{ item }}
              </li>
            </ul>
          </div>

          <!-- Best practices -->
          <div class="info-section">
            <div class="d-flex align-center ga-2 mb-3">
              <v-avatar size="28" color="warning" variant="tonal">
                <v-icon icon="mdi-alert-circle-outline" size="16" />
              </v-avatar>
              <span class="text-body-2 font-weight-bold">{{ t('notifications.infoRulesTitle') }}</span>
            </div>
            <ul class="info-list">
              <li v-for="(item, i) in tm('notifications.infoRulesItems')" :key="i" class="text-caption">
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
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useNotifications } from '@/composables/useNotifications'
import { useSnackbar } from '@/composables/useSnackbar'
import { useEnumLabels, getNotificationTypeColor } from '@/utils/enums.helper'
import { formatDateTime, formatRelativeTime } from '@/utils/formatters'
import { NotificationType } from '@/types/api.types'
import BaseDataTable from '@/components/BaseDataTable.vue'

type StatusFilter = 'all' | 'unread' | 'read'

const { t, tm } = useI18n()
const {
  notifications,
  unreadCount,
  isLoading,
  error,
  totalPages,
  hasUnread,
  fetchNotifications,
  fetchUnreadCount,
  markAsRead,
  markAllAsRead,
} = useNotifications()
const { getNotificationTypeLabel } = useEnumLabels()
const snackbar = useSnackbar()

const search = ref('')
const statusFilter = ref<StatusFilter>('all')
const currentPage = ref(1)
const markingId = ref<number | null>(null)
const markAllLoading = ref(false)

const headers = computed(() => [
  { title: t('notifications.date'), key: 'createdAt', sortable: true },
  { title: t('notifications.type'), key: 'type', sortable: true },
  { title: t('notifications.title2'), key: 'title', sortable: true },
  { title: t('notifications.message'), key: 'message', sortable: false },
  { title: t('notifications.status'), key: 'isRead', sortable: true },
  { title: t('notifications.actions'), key: 'actions', sortable: false, align: 'end' as const },
])

const notificationTypeIcons: Record<number, string> = {
  [NotificationType.LowStock]: 'mdi-package-down',
  [NotificationType.Expiring]: 'mdi-clock-alert-outline',
  [NotificationType.Expired]: 'mdi-alert-circle-outline',
}

function getNotificationTypeIcon(type: number): string {
  return notificationTypeIcons[type] || 'mdi-bell-outline'
}

// Local filter for search (server-side handles read/unread)
const filteredNotifications = computed(() => notifications.value)

function isReadParam(): boolean | undefined {
  if (statusFilter.value === 'unread') return false
  if (statusFilter.value === 'read') return true
  return undefined
}

onMounted(async () => {
  await Promise.all([fetchNotifications(undefined, 1), fetchUnreadCount()])
})

function onStatusFilter(value: StatusFilter | undefined) {
  statusFilter.value = value ?? 'all'
  currentPage.value = 1
  fetchNotifications(isReadParam(), 1)
}

function onPageChange(page: number) {
  currentPage.value = page
  fetchNotifications(isReadParam(), page)
}

async function onMarkAsRead(id: number) {
  markingId.value = id
  try {
    await markAsRead(id)
    // Composable refetches with no filter; restore current filter/page
    await fetchNotifications(isReadParam(), currentPage.value)
    snackbar.show(t('notifications.markAsReadSuccess'))
  } catch {
    snackbar.show(error.value ?? t('errors.generic'), 'error')
  } finally {
    markingId.value = null
  }
}

async function onMarkAllAsRead() {
  markAllLoading.value = true
  try {
    await markAllAsRead()
    await fetchNotifications(isReadParam(), currentPage.value)
    snackbar.show(t('notifications.markAllAsReadSuccess'))
  } catch {
    snackbar.show(error.value ?? t('errors.generic'), 'error')
  } finally {
    markAllLoading.value = false
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
