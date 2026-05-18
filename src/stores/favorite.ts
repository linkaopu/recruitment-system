import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Favorite, Job } from '@/types'
import { getFavorites, addFavorite, removeFavorite } from '@/api/favorite'

export const useFavoriteStore = defineStore('favorite', () => {
  const favorites = ref<Favorite[]>([])
  const loading = ref(false)

  async function fetchFavorites() {
    loading.value = true
    try {
      const res = await getFavorites()
      favorites.value = res.data.list
      return res
    } finally {
      loading.value = false
    }
  }

  async function addFavoriteItem(jobId: number) {
    const res = await addFavorite(jobId)
    return res
  }

  async function removeFavoriteItem(jobId: number) {
    const res = await removeFavorite(jobId)
    favorites.value = favorites.value.filter(f => f.jobId !== jobId)
    return res
  }

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