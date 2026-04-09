<template>
  <v-dialog
    :model-value="modelValue"
    max-width="420"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card rounded="lg">
      <v-card-title class="d-flex align-center ga-3 pt-6 px-7 pb-0">
        <v-avatar size="36" color="primary" variant="tonal">
          <v-icon icon="mdi-qrcode" size="20" />
        </v-avatar>
        <span class="text-h6 font-weight-bold">{{ t('warehouses.qrTitle') }}</span>
      </v-card-title>

      <v-card-text class="px-7 pt-5 pb-4">
        <div ref="printAreaRef" class="qr-print-area">
          <!-- Header: warehouse + sector -->
          <div class="qr-header">
            <span class="qr-warehouse-name">{{ warehouseName }}</span>
            <span class="qr-sector-name">{{ sector?.name }}</span>
          </div>

          <!-- QR Code -->
          <div class="qr-code-wrapper">
            <img v-if="qrDataUrl" :src="qrDataUrl" alt="QR" class="qr-image" />
            <v-progress-circular v-else indeterminate color="primary" size="80" />
          </div>

          <!-- Detail footer -->
          <div class="qr-footer">
            <div v-if="sector?.categories?.length" class="qr-categories">
              <span class="qr-label">{{ t('warehouses.sectorCategories') }}</span>
              <div class="qr-categories-list">
                <span v-for="cat in sector.categories" :key="cat.id" class="qr-category-chip">
                  {{ cat.name }}
                </span>
              </div>
            </div>
            <div v-if="sector?.createdAt" class="qr-date">
              {{ formatDate(sector.createdAt) }}
            </div>
          </div>
        </div>
      </v-card-text>

      <v-card-actions class="px-7 pb-6 pt-2">
        <v-spacer />
        <v-btn variant="text" @click="$emit('update:modelValue', false)">
          {{ t('warehouses.qrClose') }}
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          prepend-icon="mdi-printer-outline"
          min-width="100"
          @click="printQr"
        >
          {{ t('warehouses.qrPrint') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import QRCode from 'qrcode'
import { formatDate } from '@/utils/formatters'
import type { SectorDto } from '@/types/api.types'

const props = defineProps<{
  modelValue: boolean
  sector?: SectorDto | null
  warehouseName?: string
}>()

defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const { t } = useI18n()
const qrDataUrl = ref<string | null>(null)
const printAreaRef = ref<HTMLElement>()

watch(
  () => props.modelValue,
  async (open) => {
    if (open && props.sector) {
      const payload = JSON.stringify({
        warehouseId: props.sector.warehouseId,
        sectorId: props.sector.id,
      })
      qrDataUrl.value = await QRCode.toDataURL(payload, {
        width: 200,
        margin: 2,
        color: { dark: '#1a1a2e' },
      })
    } else {
      qrDataUrl.value = null
    }
  },
)

function printQr() {
  if (!printAreaRef.value) return
  const html = printAreaRef.value.innerHTML
  const win = window.open('', '_blank', 'width=420,height=550')
  if (!win) return
  win.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${props.sector?.name ?? 'QR'}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: system-ui, -apple-system, sans-serif; padding: 32px; display: flex; justify-content: center; }
        .qr-print-area { max-width: 320px; width: 100%; border: 1px dashed #ccc; border-radius: 12px; padding: 24px; }
        .qr-header { text-align: center; margin-bottom: 16px; }
        .qr-warehouse-name { display: block; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #888; font-weight: 600; }
        .qr-sector-name { display: block; font-size: 20px; font-weight: 700; color: #1a1a2e; margin-top: 4px; }
        .qr-code-wrapper { display: flex; justify-content: center; margin: 16px 0; }
        .qr-image { width: 180px; height: 180px; }
        .qr-footer { border-top: 1px solid #eee; padding-top: 12px; margin-top: 8px; }
        .qr-categories { margin-bottom: 8px; }
        .qr-label { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #888; font-weight: 600; }
        .qr-categories-list { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 4px; }
        .qr-category-chip { font-size: 11px; padding: 2px 8px; border-radius: 10px; background: #f0e6c8; color: #8b6914; font-weight: 500; }
        .qr-date { font-size: 11px; color: #aaa; text-align: right; }
      </style>
    </head>
    <body>
      <div class="qr-print-area">${html}</div>
    </body>
    </html>
  `)
  win.document.close()
  const img = win.document.querySelector('.qr-image') as HTMLImageElement | null
  if (img && !img.complete) {
    img.onload = () => win.print()
  } else {
    win.print()
  }
}
</script>

<style scoped>
.qr-print-area {
  border: 1px dashed var(--bda-border-color);
  border-radius: var(--bda-radius-md);
  padding: var(--bda-space-5);
}

.qr-header {
  text-align: center;
  margin-bottom: var(--bda-space-3);
}

.qr-warehouse-name {
  display: block;
  font-size: var(--bda-font-caption);
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: var(--bda-text-secondary);
  font-weight: 600;
}

.qr-sector-name {
  display: block;
  font-size: var(--bda-font-h1);
  font-weight: 700;
  color: rgb(var(--v-theme-on-surface));
  margin-top: 2px;
}

.qr-code-wrapper {
  display: flex;
  justify-content: center;
  margin: var(--bda-space-3) 0;
}

.qr-image {
  width: 180px;
  height: 180px;
}

.qr-footer {
  border-top: 1px solid var(--bda-border-color);
  padding-top: var(--bda-space-3);
  margin-top: var(--bda-space-2);
}

.qr-categories {
  margin-bottom: var(--bda-space-2);
}

.qr-label {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--bda-text-secondary);
  font-weight: 600;
}

.qr-categories-list {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 4px;
}

.qr-category-chip {
  font-size: var(--bda-font-caption);
  padding: 2px 8px;
  border-radius: 10px;
  background: rgb(var(--v-theme-primary) / 0.15);
  color: rgb(var(--v-theme-primary));
  font-weight: 500;
}

.qr-date {
  font-size: var(--bda-font-caption);
  color: var(--bda-text-secondary);
  text-align: right;
}
</style>
