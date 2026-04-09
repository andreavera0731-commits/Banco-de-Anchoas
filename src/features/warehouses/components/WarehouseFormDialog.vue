<template>
  <v-dialog
    :model-value="modelValue"
    max-width="520"
    persistent
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card rounded="lg">
      <v-card-title class="d-flex align-center ga-3 pt-6 px-7 pb-0">
        <v-avatar size="36" color="primary" variant="tonal">
          <v-icon :icon="isEditing ? 'mdi-warehouse-edit' : 'mdi-warehouse'" size="20" />
        </v-avatar>
        <span class="text-h6 font-weight-bold">
          {{ isEditing ? t('warehouses.editWarehouse') : t('warehouses.createWarehouse') }}
        </span>
      </v-card-title>

      <v-card-text class="px-7 pt-6 pb-4">
        <v-form ref="formRef" class="d-flex flex-column ga-5" @submit.prevent="handleSubmit">
          <v-text-field
            v-model="form.name"
            :label="t('warehouses.name')"
            :rules="rules.required"
            prepend-inner-icon="mdi-warehouse"
            hide-details="auto"
            autofocus
          />

          <v-text-field
            v-model="form.location"
            :label="`${t('warehouses.location')} ${t('warehouses.optional')}`"
            prepend-inner-icon="mdi-map-marker-outline"
            hide-details="auto"
          />
        </v-form>
      </v-card-text>

      <v-card-actions class="px-7 pb-6 pt-3">
        <v-spacer />
        <v-btn variant="text" @click="close">
          {{ t('warehouses.cancel') }}
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          :loading="loading"
          min-width="100"
          @click="handleSubmit"
        >
          {{ isEditing ? t('warehouses.save') : t('warehouses.create') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useValidationRules } from '@/utils/validators'
import type { WarehouseDto } from '@/types/api.types'

const props = defineProps<{
  modelValue: boolean
  warehouse?: WarehouseDto | null
  loading?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  submit: [data: { name: string; location: string | null }]
}>()

const { t } = useI18n()
const rules = useValidationRules()
const formRef = ref()

const form = ref({
  name: '',
  location: '',
})

const isEditing = computed(() => !!props.warehouse)

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      if (props.warehouse) {
        form.value = {
          name: props.warehouse.name,
          location: props.warehouse.location ?? '',
        }
      } else {
        form.value = { name: '', location: '' }
      }
      formRef.value?.resetValidation()
    }
  },
)

function close() {
  emit('update:modelValue', false)
}

async function handleSubmit() {
  const { valid } = await formRef.value.validate()
  if (!valid) return
  emit('submit', {
    name: form.value.name,
    location: form.value.location || null,
  })
}
</script>
