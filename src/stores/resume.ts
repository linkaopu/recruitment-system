import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Resume, CreateResumeParams, Application } from '@/types'
import { getMyResume, createResume, updateResume, getMyApplications } from '@/api/resume'

export const useResumeStore = defineStore('resume', () => {
  const myResume = ref<Resume | null>(null)
  const applications = ref<Application[]>([])
  const loading = ref(false)

  async function fetchMyResume() {
    loading.value = true
    try {
      const res = await getMyResume()
      myResume.value = res.data
      return res
    } finally {
      loading.value = false
    }
  }

  async function createResumeItem(data: CreateResumeParams) {
    const res = await createResume(data)
    return res
  }

  async function updateResumeItem(id: number, data: Partial<Resume>) {
    const res = await updateResume(id, data)
    return res
  }

  async function fetchMyApplications() {
    loading.value = true
    try {
      const res = await getMyApplications()
      applications.value = res.data.list
      return res
    } finally {
      loading.value = false
    }
  }

  function setMyResume(resume: Resume | null) {
    myResume.value = resume
  }

  return {
    myResume,
    applications,
    loading,
    fetchMyResume,
    createResumeItem,
    updateResumeItem,
    fetchMyApplications,
    setMyResume
  }
})