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
          <v-icon :icon="isEditing ? 'mdi-account-edit-outline' : 'mdi-account-plus-outline'" size="20" />
        </v-avatar>
        <span class="text-h6 font-weight-bold">
          {{ isEditing ? t('requesters.editRequester') : t('requesters.createRequester') }}
        </span>
      </v-card-title>

      <v-card-text class="px-7 pt-6 pb-4">
        <v-form ref="formRef" class="d-flex flex-column ga-5" @submit.prevent="handleSubmit">
          <v-text-field
            v-model="form.name"
            :label="t('requesters.name')"
            :rules="rules.required"
            prepend-inner-icon="mdi-account-outline"
            autofocus
          />

          <v-textarea
            v-model="form.description"
            :label="t('requesters.description')"
            prepend-inner-icon="mdi-text-box-outline"
            rows="2"
            auto-grow
          />
        </v-form>
      </v-card-text>

      <v-card-actions class="px-7 pb-6 pt-4">
        <v-spacer />
        <v-btn variant="text" @click="close">
          {{ t('requesters.cancel') }}
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          :loading="loading"
          min-width="100"
          @click="handleSubmit"
        >
          {{ isEditing ? t('requesters.save') : t('requesters.create') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useValidationRules } from '@/utils/validators'
import type { RequesterDto } from '@/types/api.types'

const props = defineProps<{
  modelValue: boolean
  requester?: RequesterDto | null
  loading?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'submit': [data: { name: string; description: string }]
}>()

const { t } = useI18n()
const rules = useValidationRules()
const formRef = ref()

const form = reactive({
  name: '',
  description: '',
})

const isEditing = computed(() => !!props.requester)

watch(() => props.modelValue, (open) => {
  if (open) {
    if (props.requester) {
      form.name = props.requester.name
      form.description = props.requester.description ?? ''
    } else {
      form.name = ''
      form.description = ''
    }
    formRef.value?.resetValidation()
  }
})

async function handleSubmit() {
  const { valid } = await formRef.value.validate()
  if (!valid) return
  emit('submit', { name: form.name, description: form.description })
}

function close() {
  emit('update:modelValue', false)
}
</script>
