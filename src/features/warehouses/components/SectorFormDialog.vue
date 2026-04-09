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
          <v-icon :icon="isEditing ? 'mdi-pencil-outline' : 'mdi-plus-circle-outline'" size="20" />
        </v-avatar>
        <span class="text-h6 font-weight-bold">
          {{ isEditing ? t('warehouses.editSector') : t('warehouses.createSector') }}
        </span>
      </v-card-title>

      <v-card-text class="px-7 pt-6 pb-4">
        <v-form ref="formRef" class="d-flex flex-column ga-5" @submit.prevent="handleSubmit">
          <v-text-field
            v-model="form.name"
            :label="t('warehouses.sectorName')"
            :rules="rules.required"
            prepend-inner-icon="mdi-cube-outline"
            hide-details="auto"
            autofocus
          />
          <v-select
            v-model="form.categoryIds"
            :items="categoryOptions"
            :label="t('warehouses.sectorCategories')"
            prepend-inner-icon="mdi-tag-multiple-outline"
            multiple
            chips
            closable-chips
            hide-details="auto"
            :menu-props="{ location: 'top' }"
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
import { ref, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useValidationRules } from '@/utils/validators'
import { useCategories } from '@/composables/useCategories'
import type { SectorDto } from '@/types/api.types'

const props = defineProps<{
  modelValue: boolean
  sector?: SectorDto | null
  loading?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  submit: [data: { name: string; categoryIds: number[] }]
}>()

const { t } = useI18n()
const rules = useValidationRules()
const { categoryOptions, fetchCategories } = useCategories()
const formRef = ref()

const form = ref({
  name: '',
  categoryIds: [] as number[],
})

const isEditing = computed(() => !!props.sector)

onMounted(fetchCategories)

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      form.value.name = props.sector?.name ?? ''
      form.value.categoryIds = props.sector?.categories.map((c) => c.id) ?? []
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
    categoryIds: form.value.categoryIds,
  })
}
</script>
