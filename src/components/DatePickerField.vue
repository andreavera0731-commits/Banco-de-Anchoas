<template>
  <v-menu
    v-model="menuOpen"
    :close-on-content-click="false"
    location="bottom start"
    offset="4"
  >
    <template #activator="{ props: menuProps }">
      <v-text-field
        v-bind="menuProps"
        :model-value="displayValue"
        :label="label"
        :rules="rules"
        prepend-inner-icon="mdi-calendar-outline"
        readonly
        clearable
        @click:clear="onClear"
      />
    </template>

    <v-card rounded="lg" class="bda-datepicker-card">
      <v-date-picker
        :model-value="dateValue"
        :min="min"
        :max="max"
        color="primary"
        show-adjacent-months
        hide-header
        @update:model-value="onDateSelect"
      />
    </v-card>
  </v-menu>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { formatDate } from '@/utils/formatters'

const props = defineProps<{
  modelValue: string | null
  label?: string
  rules?: ((v: unknown) => true | string)[]
  min?: string
  max?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string | null]
}>()

const menuOpen = ref(false)

const displayValue = computed(() => {
  if (!props.modelValue) return ''
  return formatDate(props.modelValue)
})

const dateValue = computed(() => {
  if (!props.modelValue) return undefined
  // v-date-picker expects a Date object
  return new Date(props.modelValue + 'T00:00:00')
})

function onDateSelect(date: unknown) {
  if (date instanceof Date) {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    emit('update:modelValue', `${y}-${m}-${d}`)
  }
  menuOpen.value = false
}

function onClear() {
  emit('update:modelValue', null)
}
</script>

<style scoped>
.bda-datepicker-card {
  overflow: hidden;
}

.bda-datepicker-card :deep(.v-date-picker) {
  background: rgb(var(--v-theme-surface));
}

.bda-datepicker-card :deep(.v-date-picker-month__day--selected .v-btn) {
  font-weight: var(--bda-font-weight-bold);
}
</style>
