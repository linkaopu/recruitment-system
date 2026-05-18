import request from '@/utils/request'
import type { ApiResponse, Interview, CreateInterviewParams, PageResponse } from '@/types'

export function getInterviews(params: any) {
  return request.get<ApiResponse<PageResponse<Interview>>>('/interviews', { params })
}

export function getInterviewDetail(id: number) {
  return request.get<ApiResponse<Interview>>(`/interviews/${id}`)
}

export function createInterview(data: CreateInterviewParams) {
  return request.post<ApiResponse<Interview>>('/interviews', data)
}

export function updateInterview(id: number, data: Partial<Interview>) {
  return request.put<ApiResponse<Interview>>(`/interviews/${id}`, data)
}

export function updateInterviewResult(id: number, result: string, notes?: string) {
  return request.patch<ApiResponse>(`/interviews/${id}/result`, { result, notes })
}

export function deleteInterview(id: number) {
  return request.delete<ApiResponse>(`/interviews/${id}`)
}

export function sendInterviewNotification(id: number) {
  return request.post<ApiResponse>(`/interviews/${id}/notify`)
}

export function getInterviewSchedule(startDate: string, endDate: string) {
  return request.get<ApiResponse<Interview[]>>('/interviews/schedule', {
    params: { startDate, endDate }
  })
}