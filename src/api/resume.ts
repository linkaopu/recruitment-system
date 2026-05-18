import request from '@/utils/request'
import type { ApiResponse, Resume, CreateResumeParams, Application, ApplicationQueryParams, PageResponse } from '@/types'

export function getMyResume() {
  return request.get<ApiResponse<Resume>>('/resumes/me')
}

export function createResume(data: CreateResumeParams) {
  return request.post<ApiResponse<Resume>>('/resumes', data)
}

export function updateResume(id: number, data: Partial<Resume>) {
  return request.put<ApiResponse<Resume>>(`/resumes/${id}`, data)
}

export function uploadResume(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  return request.post<ApiResponse<{ url: string; name: string }>>('/resumes/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

export function applyJob(params: { jobId: number; resumeId: number }) {
  return request.post<ApiResponse>('/applications/apply', params)
}

export function getMyApplications() {
  return request.get<ApiResponse<PageResponse<Application>>>('/applications/me')
}

export function getApplications(params: ApplicationQueryParams) {
  return request.get<ApiResponse<PageResponse<Application>>>('/applications', { params })
}

export function updateApplicationStatus(id: number, status: string, rejectReason?: string) {
  return request.patch<ApiResponse>(`/applications/${id}/status`, { status, rejectReason })
}

export function getResumeDetail(id: number) {
  return request.get<ApiResponse<Resume>>(`/resumes/${id}`)
}

export function exportResumes(params: any) {
  return request.get('/resumes/export', { params, responseType: 'blob' })
}