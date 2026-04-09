import { ref } from 'vue'
import { requestersService } from '@/services/requesters.service'
import { extractError } from '@/utils/errors'
import type { RequesterDto, CreateRequesterRequest, UpdateRequesterRequest } from '@/types/api.types'

export function useRequesters() {
  const requesters = ref<RequesterDto[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchRequesters() {
    isLoading.value = true
    error.value = null
    try {
      const response = await requestersService.getAll()
      requesters.value = response.data.data
    } catch (err) {
      error.value = extractError(err)
    } finally {
      isLoading.value = false
    }
  }

  async function createRequester(data: CreateRequesterRequest) {
    error.value = null
    try {
      await requestersService.create(data)
      await fetchRequesters()
    } catch (err) {
      error.value = extractError(err)
      throw err
    }
  }

  async function updateRequester(id: number, data: UpdateRequesterRequest) {
    error.value = null
    try {
      await requestersService.update(id, data)
      await fetchRequesters()
    } catch (err) {
      error.value = extractError(err)
      throw err
    }
  }

  async function deleteRequester(id: number) {
    error.value = null
    try {
      await requestersService.delete(id)
      await fetchRequesters()
    } catch (err) {
      error.value = extractError(err)
      throw err
    }
  }

  return { requesters, isLoading, error, fetchRequesters, createRequester, updateRequester, deleteRequester }
}
