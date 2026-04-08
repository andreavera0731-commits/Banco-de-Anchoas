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
          {{ isEditing ? t('users.editUser') : t('users.createUser') }}
        </span>
      </v-card-title>

      <v-card-text class="px-7 pt-6 pb-4">
        <v-form ref="formRef" class="d-flex flex-column ga-5" @submit.prevent="handleSubmit">
          <v-text-field
            v-model="form.name"
            :label="t('users.name')"
            :rules="rules.required"
            prepend-inner-icon="mdi-account-outline"
            hide-details="auto"
            autofocus
          />

          <v-text-field
            v-model="form.email"
            :label="t('users.email')"
            :rules="rules.email"
            prepend-inner-icon="mdi-email-outline"
            type="email"
            hide-details="auto"
          />

          <v-text-field
            v-if="!isEditing"
            v-model="form.password"
            :label="t('users.password')"
            :rules="rules.password"
            prepend-inner-icon="mdi-lock-outline"
            :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            :type="showPassword ? 'text' : 'password'"
            hide-details="auto"
            @click:append-inner="showPassword = !showPassword"
          />

          <div>
            <label class="text-body-2 text-medium-emphasis d-block mb-3">{{ t('users.role') }}</label>
            <v-btn-toggle
              v-model="form.role"
              mandatory
              color="primary"
              rounded="lg"
              density="comfortable"
              class="w-100 role-toggle"
            >
              <v-btn value="Admin" class="flex-grow-1" min-height="44">
                <v-icon start icon="mdi-shield-crown-outline" />
                {{ t('users.admin') }}
              </v-btn>
              <v-btn value="Almacenista" class="flex-grow-1" min-height="44">
                <v-icon start icon="mdi-warehouse" />
                {{ t('users.warehouseWorker') }}
              </v-btn>
            </v-btn-toggle>
          </div>
        </v-form>
      </v-card-text>

      <v-card-actions class="px-7 pb-6 pt-4">
        <v-spacer />
        <v-btn variant="text" @click="close">
          {{ t('users.cancel') }}
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          :loading="loading"
          min-width="100"
          @click="handleSubmit"
        >
          {{ isEditing ? t('users.save') : t('users.create') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useValidationRules } from '@/utils/validators'
import type { UserDto } from '@/types/api.types'

const props = defineProps<{
  modelValue: boolean
  user?: UserDto | null
  loading?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'submit': [data: { name: string; email: string; password: string; role: string }]
}>()

const { t } = useI18n()
const rules = useValidationRules()
const formRef = ref()
const showPassword = ref(false)

const form = reactive({
  name: '',
  email: '',
  password: '',
  role: 'Almacenista' as string,
})

const isEditing = ref(false)

watch(() => props.modelValue, (open) => {
  if (open) {
    if (props.user) {
      isEditing.value = true
      form.name = props.user.name
      form.email = props.user.email
      form.role = props.user.role
      form.password = ''
    } else {
      isEditing.value = false
      form.name = ''
      form.email = ''
      form.password = ''
      form.role = 'Almacenista'
    }
    showPassword.value = false
    formRef.value?.resetValidation()
  }
})

async function handleSubmit() {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  emit('submit', {
    name: form.name,
    email: form.email,
    password: form.password,
    role: form.role,
  })
}

function close() {
  emit('update:modelValue', false)
}
</script>

<style scoped>
.role-toggle {
  border: 1px solid var(--bda-border-color);
}
</style>
