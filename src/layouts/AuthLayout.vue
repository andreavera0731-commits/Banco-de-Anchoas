<template>
  <v-app>
    <v-main class="auth-main">
      <slot />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useThemeToggle } from '@/composables/useTheme'

const { init: initTheme } = useThemeToggle()

onMounted(() => {
  initTheme()
})
</script>

<style scoped>
.auth-main {
  min-height: 100vh;
}

.auth-main :deep(.v-main__wrap) {
  display: flex;
  min-height: 100vh;
}
</style>
