import request from '@/utils/request'
import type { ApiResponse, Job, JobQueryParams, JobListResponse } from '@/types'

export function getJobList(params: JobQueryParams) {
  return request.get<ApiResponse<JobListResponse>>('/jobs', { params })
}

export function getJobDetail(id: number) {
  return request.get<ApiResponse<Job>>(`/jobs/${id}`)
}

export function getHotJobs() {
  return request.get<ApiResponse<Job[]>>('/jobs/hot')
}

export function getLatestJobs() {
  return request.get<ApiResponse<Job[]>>('/jobs/latest')
}

export function createJob(data: Partial<Job>) {
  return request.post<ApiResponse<Job>>('/jobs', data)
}

export function updateJob(id: number, data: Partial<Job>) {
  return request.put<ApiResponse<Job>>(`/jobs/${id}`, data)
}

export function deleteJob(id: number) {
  return request.delete<ApiResponse>(`/jobs/${id}`)
}

export function toggleJobStatus(id: number, status: 'active' | 'inactive') {
  return request.patch<ApiResponse>(`/jobs/${id}/status`, { status })
}

export function getJobStats(id: number) {
  return request.get<ApiResponse<{ viewCount: number; applyCount: number }>>(`/jobs/${id}/stats`)
}