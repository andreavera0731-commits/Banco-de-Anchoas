import api from './api'
import type { ExportMovementsParams } from '@/types/api.types'

export const reportsService = {
  exportMovements(params?: ExportMovementsParams) {
    return api.get<Blob>('/reports/movements/export', {
      params,
      responseType: 'blob',
    })
  },
}
