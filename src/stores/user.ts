import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginParams, RegisterParams, LoginResponse, ApiResponse } from '@/types'
import { login as loginApi, register as registerApi, logout as logoutApi } from '@/api/auth'

export const useUserStore = defineStore('user', () => {
  const token = ref<string>(localStorage.getItem('token') || '') // 从 localStorage 获取 token，默认为空字符串
  
  // 从 localStorage 获取用户信息，默认为 null
  const user = ref<User | null>(
    localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null
  )

  const isLoggedIn = computed(() => !!token.value) // 计算属性，判断是否已登录
  const isAdmin = computed(() => user.value?.role === 'admin') // 计算属性，判断是否是管理员
  const isHR = computed(() => user.value?.role === 'hr') // 计算属性，判断是否是 HR
  const isCandidate = computed(() => user.value?.role === 'candidate') // 计算属性，判断是否是候选人

  // 登录方法
  async function login(params: LoginParams) {
    const res = (await loginApi(params)) as unknown as ApiResponse<LoginResponse>
    token.value = res.data.token
    user.value = res.data.user
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('user', JSON.stringify(res.data.user))
    return res
  }

  // 注册方法
  async function register(params: RegisterParams) {
    const res = await registerApi(params)
    return res
  }

  // 登出方法
  async function logout() {
    await logoutApi()
    token.value = ''
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  // 设置用户信息（例如在登录后或更新用户信息后调用）
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