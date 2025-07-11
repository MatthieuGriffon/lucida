import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { User, Role } from '@/types/user'


export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!user.value)
  const role = computed(() => user.value?.role ?? null)

  const router = useRouter()

async function login(email: string, password: string): Promise<boolean> {
  loading.value = true
  error.value = null

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      const data = await response.json()
      error.value = data.message || 'Échec de la connexion'
      return false
    }

    return true
  } catch (err: any) {
    error.value = err?.message || 'Erreur réseau'
    return false
  } finally {
    loading.value = false
  }
}

 async function fetchUser() {
  try {
    const res = await fetch('/api/auth/me', { credentials: 'include' })
    if (!res.ok) return

    const data = await res.json()
    user.value = data.user
  } catch (err) {
    console.error('⚠️ fetchUser error', err)
    user.value = null
  }
}

  async function logout() {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    })
    user.value = null
    router.push('/')
  }

  async function clearError() {
  error.value = null
}

  return {
    user,
    role,
    isAuthenticated,
    loading,
    error,
    login,
    fetchUser,
    logout,
    clearError,
  }
})