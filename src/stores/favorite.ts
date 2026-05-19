import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Favorite, Job } from '@/types'
import { getFavorites, addFavorite, removeFavorite } from '@/api/favorite'
import type { ApiResponse, PageResponse } from '@/types'

export const useFavoriteStore = defineStore('favorite', () => {
  const favorites = ref<Favorite[]>([]) // 收藏列表
  const loading = ref(false) // 加载状态

  // 获取收藏列表
  async function fetchFavorites() {
    loading.value = true
    try {
      const res = (await getFavorites()) as unknown as ApiResponse<PageResponse<Favorite>>
      favorites.value = res.data.list
      return res
    } finally {
      loading.value = false
    }
  }

  // 添加收藏
  async function addFavoriteItem(jobId: number) {
    const res = await addFavorite(jobId)
    return res
  }

  // 移除收藏
  async function removeFavoriteItem(jobId: number) {
    const res = await removeFavorite(jobId)
    favorites.value = favorites.value.filter(f => f.jobId !== jobId)
    return res
  }

  // 检查是否已收藏
  function isFavorite(jobId: number) {
    return favorites.value.some(f => f.jobId === jobId)
  }

  return {
    favorites,
    loading,
    fetchFavorites,
    addFavoriteItem,
    removeFavoriteItem,
    isFavorite
  }
})