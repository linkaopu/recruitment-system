import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Resume, CreateResumeParams, Application } from '@/types'
import { getMyResume, createResume, updateResume, getMyApplications } from '@/api/resume'
import type { ApiResponse, PageResponse } from '@/types'

export const useResumeStore = defineStore('resume', () => {
  const myResume = ref<Resume | null>(null) // 当前用户的简历
  const applications = ref<Application[]>([]) // 当前用户的申请记录
  const loading = ref(false) // 加载状态

  // 获取当前用户的简历
  async function fetchMyResume() {
    loading.value = true
    try {
      const res = (await getMyResume()) as unknown as ApiResponse<Resume>
      myResume.value = res.data
      return res
    } finally {
      loading.value = false
    }
  }

  // 创建简历
  async function createResumeItem(data: CreateResumeParams) {
    const res = await createResume(data)
    return res
  }

  // 更新简历
  // 这里使用 Partial<Resume>，表示更新时可以只传简历的部分字段
  //const data: Partial<Resume> = { name: "张三" }
  // ✅ 不报错！只传一个字段也可以
  async function updateResumeItem(id: number, data: Partial<Resume>) {
    const res = await updateResume(id, data)
    return res
  }

  // 获取当前用户的申请记录
  async function fetchMyApplications() {
    loading.value = true
    try {
      const res = (await getMyApplications()) as unknown as ApiResponse<PageResponse<Application>>
      applications.value = res.data.list
      return res
    } finally {
      loading.value = false
    }
  }

  // 设置当前用户的简历
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