import { ref } from 'vue'
import { usersService } from '@/services/users.service'
import type { UserDto, UserRole } from '@/types/api.types'

function extractError(err: unknown): string | null {
  const res = (err as any)?.response?.data
  return res?.message ?? res?.errors ?? null
}

export function useUsers() {
  const users = ref<UserDto[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchUsers() {
    isLoading.value = true
    error.value = null
    try {
      const response = await usersService.getAll()
      users.value = response.data.data
    } catch (err) {
      error.value = extractError(err)
    } finally {
      isLoading.value = false
    }
  }

  async function createUser(data: { email: string; name: string; password: string; role: UserRole }) {
    error.value = null
    try {
      await usersService.create(data)
      await fetchUsers()
    } catch (err) {
      error.value = extractError(err)
      throw err
    }
  }

  async function updateUser(id: string, data: { email?: string; name?: string; role?: UserRole }) {
    error.value = null
    try {
      await usersService.update(id, { id, ...data })
      await fetchUsers()
    } catch (err) {
      error.value = extractError(err)
      throw err
    }
  }

  async function deleteUser(id: string) {
    error.value = null
    try {
      await usersService.delete(id)
      await fetchUsers()
    } catch (err) {
      error.value = extractError(err)
      throw err
    }
  }

  return { users, isLoading, error, fetchUsers, createUser, updateUser, deleteUser }
}
