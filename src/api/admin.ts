import request from '@/utils/request'
import type { ApiResponse, User, Department, SystemLog, DashboardStats, PageResponse } from '@/types'

// 用户管理
export function getUsers(params: any) {
  return request.get<ApiResponse<PageResponse<User>>>('/admin/users', { params })
}

export function createUser(data: Partial<User>) {
  return request.post<ApiResponse<User>>('/admin/users', data)
}

export function updateUser(id: number, data: Partial<User>) {
  return request.put<ApiResponse<User>>(`/admin/users/${id}`, data)
}

export function deleteUser(id: number) {
  return request.delete<ApiResponse>(`/admin/users/${id}`)
}

export function toggleUserStatus(id: number, status: 'active' | 'inactive') {
  return request.patch<ApiResponse>(`/admin/users/${id}/status`, { status })
}

// 部门管理
export function getDepartments() {
  return request.get<ApiResponse<Department[]>>('/admin/departments')
}

export function createDepartment(data: Partial<Department>) {
  return request.post<ApiResponse<Department>>('/admin/departments', data)
}

export function updateDepartment(id: number, data: Partial<Department>) {
  return request.put<ApiResponse<Department>>(`/admin/departments/${id}`, data)
}

export function deleteDepartment(id: number) {
  return request.delete<ApiResponse>(`/admin/departments/${id}`)
}

// 系统日志
export function getSystemLogs(params: any) {
  return request.get<ApiResponse<PageResponse<SystemLog>>>('/admin/logs', { params })
}

// 仪表盘数据
export function getDashboardStats() {
  return request.get<ApiResponse<DashboardStats>>('/admin/dashboard/stats')
}

// 系统设置
export function getSystemSettings() {
  return request.get<ApiResponse<any>>('/admin/settings')
}

export function updateSystemSettings(data: any) {
  return request.put<ApiResponse>('/admin/settings', data)
}