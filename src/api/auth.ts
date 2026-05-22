import request from '@/utils/request'
import type { ApiResponse, LoginParams, RegisterParams, LoginResponse } from '@/types'

export function login(params: LoginParams) {
  return request.post<ApiResponse<LoginResponse>>('/auth/login', params)
}

export function register(params: RegisterParams) {
  return request.post<ApiResponse>('/auth/register', params)
}

export function logout() {
  return request.post<ApiResponse>('/auth/logout')
}

export function sendCode(email: string) {
  return request.post<ApiResponse>('/auth/send-code', { email })
}

export function resetPassword(params: { email: string; code: string; password: string }) {
  return request.post<ApiResponse>('/auth/reset-password', params)
}

export function changePassword(params: { oldPassword: string; newPassword: string }) {
  return request.post<ApiResponse>('/auth/change-password', params)
}