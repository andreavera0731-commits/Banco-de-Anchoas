<template>
  <v-app>
    <AppHeader />
    <AppSidebar />
    <v-main>
      <v-container fluid class="pa-4 pa-md-6">
        <slot />
      </v-container>
    </v-main>
    <AppFooter />
  </v-app>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import AppSidebar from '@/components/AppSidebar.vue'
import AppFooter from '@/components/AppFooter.vue'
import { useThemeToggle } from '@/composables/useTheme'

const { init: initTheme } = useThemeToggle()

onMounted(() => {
  initTheme()
})
</script>
