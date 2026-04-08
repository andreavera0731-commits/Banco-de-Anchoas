<template>
  <v-app-bar elevation="0" class="app-header" :style="{ borderBottom: '1px solid var(--bda-border-color)', paddingRight: '16px' }">
    <v-app-bar-title class="app-title" style="padding-left: 16px;">
      <v-icon icon="mdi-package-variant-closed" color="primary" size="24" class="mr-2" />
      {{ t('app.name') }}
    </v-app-bar-title>

    <v-spacer />

    <!-- User menu -->
    <v-menu transition="scale-transition" :close-on-content-click="false" :offset="8">
      <template #activator="{ props }">
        <v-avatar
          v-bind="props"
          size="32"
          color="primary"
          variant="tonal"
          class="mr-6 user-avatar-btn"
        >
          <span class="text-caption font-weight-bold">{{ userInitials }}</span>
        </v-avatar>
      </template>
      <v-card min-width="260" max-width="300" rounded="lg" elevation="8">
        <div class="user-card-header">
          <v-avatar size="44" color="primary" variant="tonal">
            <span class="text-body-2 font-weight-bold">{{ userInitials }}</span>
          </v-avatar>
          <div class="user-card-info">
            <p class="text-body-2 font-weight-medium text-truncate">
              {{ auth.user?.name }}
            </p>
            <p class="text-caption text-medium-emphasis text-truncate">
              {{ auth.user?.email }}
            </p>
            <v-chip
              size="x-small"
              variant="tonal"
              :color="auth.user?.role === 'Admin' ? 'primary' : 'secondary'"
              class="mt-1"
              label
            >
              {{ auth.user?.role }}
            </v-chip>
          </div>
        </div>
        <v-divider />
        <v-list density="compact" class="py-1">
          <v-list-item
            :prepend-icon="isDark ? 'mdi-white-balance-sunny' : 'mdi-moon-waning-crescent'"
            :title="isDark ? t('a11y.lightTheme') : t('a11y.darkTheme')"
            rounded="lg"
            @click="toggle"
          />
          <v-list-item
            prepend-icon="mdi-translate"
            :title="t('a11y.language')"
            rounded="lg"
            @click="toggleLocale"
          />
          <v-list-item
            prepend-icon="mdi-logout"
            :title="t('auth.logout')"
            rounded="lg"
            @click="handleLogout"
          />
        </v-list>
      </v-card>
    </v-menu>
  </v-app-bar>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/features/auth/stores/auth.store'
import { useThemeToggle } from '@/composables/useTheme'

const { t, locale } = useI18n()
const router = useRouter()
const auth = useAuthStore()
const { isDark, toggle } = useThemeToggle()

const userInitials = computed(() => {
  const name = auth.user?.name ?? ''
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length >= 2) return (parts[0]![0]! + parts[1]![0]!).toUpperCase()
  return name.slice(0, 2).toUpperCase()
})

function toggleLocale() {
  locale.value = locale.value === 'es' ? 'en' : 'es'
}

function handleLogout() {
  auth.logout()
  router.push({ name: 'login' })
}
</script>

<style scoped>
.app-header {
  background: rgb(var(--v-theme-surface)) !important;
}

.app-title {
  font-size: 1rem;
  font-weight: var(--bda-font-weight-bold);
  letter-spacing: -0.01em;
}

.user-avatar-btn {
  cursor: pointer;
  transition: box-shadow 0.2s ease;
}

.user-avatar-btn:hover {
  box-shadow: 0 0 0 2px rgb(var(--v-theme-primary) / 0.4);
}

.user-card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 16px 12px;
}

.user-card-info {
  min-width: 0;
  flex: 1;
}
</style>
