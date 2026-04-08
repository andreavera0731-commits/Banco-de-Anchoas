<template>
  <v-app-bar elevation="0" class="app-header" :style="{ borderBottom: '1px solid var(--bda-border-color)' }">
    <v-app-bar-title class="app-title" style="padding-left: 16px;">
      <v-icon icon="mdi-package-variant-closed" color="primary" size="24" class="mr-2" />
      {{ t('app.name') }}
    </v-app-bar-title>

    <v-spacer />

    <!-- Theme toggle -->
    <v-btn
      icon
      variant="text"
      size="small"
      @click="toggle"
      :aria-label="isDark ? t('a11y.switchToLight') : t('a11y.switchToDark')"
    >
      <v-icon>{{ isDark ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
    </v-btn>

    <!-- User menu -->
    <v-menu transition="scale-transition" :close-on-content-click="true">
      <template #activator="{ props }">
        <v-btn icon variant="text" size="small" v-bind="props">
          <v-icon>mdi-account-circle-outline</v-icon>
        </v-btn>
      </template>
      <v-list density="compact" rounded="lg" min-width="160">
        <v-list-item v-if="auth.user" disabled>
          <v-list-item-title class="text-caption font-weight-medium">
            {{ auth.user.name }}
          </v-list-item-title>
          <v-list-item-subtitle class="text-caption">
            {{ auth.user.role }}
          </v-list-item-subtitle>
        </v-list-item>
        <v-divider v-if="auth.user" class="my-1" />
        <v-list-item
          prepend-icon="mdi-logout"
          :title="t('auth.logout')"
          @click="handleLogout"
        />
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/features/auth/stores/auth.store'
import { useThemeToggle } from '@/composables/useTheme'

const { t } = useI18n()
const router = useRouter()
const auth = useAuthStore()
const { isDark, toggle } = useThemeToggle()

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
</style>
