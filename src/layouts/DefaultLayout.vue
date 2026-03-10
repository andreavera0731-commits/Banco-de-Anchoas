<template>
  <v-app>
    <AppHeader />
    <v-main>
      <AppSidebar />
      <router-view />
    </v-main>
    <AppFooter />
  </v-app>
</template>

<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
import AppSidebar from '@/components/AppSidebar.vue'
import AppFooter from '@/components/AppFooter.vue'
</script>
