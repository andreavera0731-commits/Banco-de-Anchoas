<template>
  <v-navigation-drawer>
    <v-list>
      <v-list-item :to="{ name: 'dashboard' }" :title="t('nav.dashboard')" />
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>
