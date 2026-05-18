import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginParams, RegisterParams } from '@/types'
import { login as loginApi, register as registerApi, logout as logoutApi } from '@/api/auth'

export const useUserStore = defineStore('user', () => {
  const token = ref<string>(localStorage.getItem('token') || '')
  const user = ref<User | null>(
    localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null
  )

  const isLoggedIn = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isHR = computed(() => user.value?.role === 'hr')
  const isCandidate = computed(() => user.value?.role === 'candidate')

  async function login(params: LoginParams) {
    const res = await loginApi(params)
    token.value = res.data.token
    user.value = res.data.user
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('user', JSON.stringify(res.data.user))
    return res
  }

  async function register(params: RegisterParams) {
    const res = await registerApi(params)
    return res
  }

  async function logout() {
    await logoutApi()
    token.value = ''
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  function setUser(userData: User) {
    user.value = userData
    localStorage.setItem('user', JSON.stringify(userData))
  }

  return {
    token,
    user,
    isLoggedIn,
    isAdmin,
    isHR,
    isCandidate,
    login,
    register,
    logout,
    setUser
  }
})