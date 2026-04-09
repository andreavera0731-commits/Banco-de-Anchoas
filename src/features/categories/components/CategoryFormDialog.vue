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
          <v-icon :icon="isEditing ? 'mdi-tag-edit-outline' : 'mdi-tag-plus-outline'" size="20" />
        </v-avatar>
        <span class="text-h6 font-weight-bold">
          {{ isEditing ? t('categories.editCategory') : t('categories.createCategory') }}
        </span>
      </v-card-title>

      <v-card-text class="px-7 pt-6 pb-4">
        <v-form ref="formRef" class="d-flex flex-column ga-5" @submit.prevent="handleSubmit">
          <v-text-field
            v-model="form.name"
            :label="t('categories.name')"
            :rules="rules.required"
            prepend-inner-icon="mdi-tag-outline"
            hide-details="auto"
            autofocus
          />

          <v-textarea
            v-model="form.description"
            :label="`${t('categories.description')} ${t('categories.optional')}`"
            prepend-inner-icon="mdi-text-box-outline"
            hide-details="auto"
            rows="3"
            auto-grow
          />
        </v-form>
      </v-card-text>

      <v-card-actions class="px-7 pb-6 pt-4">
        <v-spacer />
        <v-btn variant="text" @click="close">
          {{ t('categories.cancel') }}
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          :loading="loading"
          min-width="100"
          @click="handleSubmit"
        >
          {{ isEditing ? t('categories.save') : t('categories.create') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useValidationRules } from '@/utils/validators'
import type { CategoryDto } from '@/types/api.types'

const props = defineProps<{
  modelValue: boolean
  category?: CategoryDto | null
  loading?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'submit': [data: { name: string; description: string | null }]
}>()

const { t } = useI18n()
const rules = useValidationRules()
const formRef = ref()

const form = reactive({
  name: '',
  description: '',
})

const isEditing = ref(false)

watch(() => props.modelValue, (open) => {
  if (open) {
    if (props.category) {
      isEditing.value = true
      form.name = props.category.name
      form.description = props.category.description ?? ''
    } else {
      isEditing.value = false
      form.name = ''
      form.description = ''
    }
    formRef.value?.resetValidation()
  }
})

function close() {
  emit('update:modelValue', false)
}

async function handleSubmit() {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  emit('submit', {
    name: form.name.trim(),
    description: form.description.trim() || null,
  })
}
</script>
