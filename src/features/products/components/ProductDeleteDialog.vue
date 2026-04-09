<template>
  <v-dialog
    :model-value="modelValue"
    max-width="400"
    persistent
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card rounded="lg">
      <v-card-title class="d-flex align-center ga-3 pt-6 px-7 pb-0">
        <v-avatar size="36" color="error" variant="tonal">
          <v-icon icon="mdi-alert-circle-outline" size="20" />
        </v-avatar>
        <span class="text-h6 font-weight-bold">{{ t('products.deleteProduct') }}</span>
      </v-card-title>

      <v-card-text class="px-7 pt-4 pb-2">
        <p class="text-body-2 mb-2">
          {{ t('products.confirmDelete', { name: product?.name ?? '' }) }}
        </p>
        <p class="text-caption text-medium-emphasis">
          {{ t('products.confirmDeleteDescription') }}
        </p>
      </v-card-text>

      <v-card-actions class="px-7 pb-6 pt-3">
        <v-spacer />
        <v-btn variant="text" @click="$emit('update:modelValue', false)">
          {{ t('products.cancel') }}
        </v-btn>
        <v-btn
          color="error"
          variant="flat"
          :loading="loading"
          min-width="100"
          @click="$emit('confirm')"
        >
          {{ t('products.delete') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { ProductListDto } from '@/types/api.types'

defineProps<{
  modelValue: boolean
  product?: ProductListDto | null
  loading?: boolean
}>()

defineEmits<{
  'update:modelValue': [value: boolean]
  'confirm': []
}>()

const { t } = useI18n()
</script>
