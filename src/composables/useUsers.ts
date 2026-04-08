import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { usersService } from '@/services/users.service'
import type { UserDto } from '@/types/api.types'

export function useUsers() {
  const { t } = useI18n()
  const users = ref<UserDto[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchUsers() {
    isLoading.value = true
    error.value = null
    try {
      const response = await usersService.getAll()
      users.value = response.data.data
    } catch (err: any) {
      error.value = err.response?.data?.message || t('errors.loadUsers')
    } finally {
      isLoading.value = false
    }
  }

  async function createUser(email: string, name: string, password: string, role: string) {
    error.value = null
    try {
      const response = await usersService.create({
        email,
        name,
        password,
        role: role as 'Admin' | 'Almacenista',
      })
      await fetchUsers()
      return response.data.data
    } catch (err: any) {
      error.value = err.response?.data?.errors || err.response?.data?.message || t('errors.createUser')
      throw err
    }
  }

  async function updateUser(id: string, email?: string, name?: string, role?: string) {
    error.value = null
    try {
      await usersService.update(id, {
        id,
        email: email || null,
        name: name || null,
        role: (role as 'Admin' | 'Almacenista') || null,
      })
      await fetchUsers()
    } catch (err: any) {
      error.value = err.response?.data?.message || t('errors.updateUser')
      throw err
    }
  }

  async function deleteUser(id: string) {
    error.value = null
    try {
      await usersService.delete(id)
      await fetchUsers()
    } catch (err: any) {
      error.value = err.response?.data?.message || t('errors.deleteUser')
      throw err
    }
  }

  return {
    users,
    isLoading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  }
}
