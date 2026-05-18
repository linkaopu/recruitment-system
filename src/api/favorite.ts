import request from '@/utils/request'
import type { ApiResponse, Favorite, PageResponse } from '@/types'

export function getFavorites() {
  return request.get<ApiResponse<PageResponse<Favorite>>>('/favorites')
}

export function addFavorite(jobId: number) {
  return request.post<ApiResponse>('/favorites', { jobId })
}

export function removeFavorite(jobId: number) {
  return request.delete<ApiResponse>(`/favorites/${jobId}`)
}

export function checkFavorite(jobId: number) {
  return request.get<ApiResponse<{ isFavorite: boolean }>>(`/favorites/check/${jobId}`)
}