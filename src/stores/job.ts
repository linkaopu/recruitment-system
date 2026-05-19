import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Job, JobQueryParams, JobListResponse } from '@/types'
import { getJobList, getJobDetail, createJob, updateJob, deleteJob } from '@/api/job'
import type { ApiResponse } from '@/types'

export const useJobStore = defineStore('job', () => {
  const jobs = ref<Job[]>([]) // 职位列表
  const currentJob = ref<Job | null>(null) // 当前查看的职位详情
  const loading = ref(false) // 加载状态
  const total = ref(0) // 总数

  // 获取职位列表
  async function fetchJobs(params: JobQueryParams) {
    loading.value = true
    try {
      const res = (await getJobList(params)) as unknown as ApiResponse<JobListResponse>
      jobs.value = res.data.list
      total.value = res.data.total
      return res
    } finally {
      loading.value = false
    }
  }

  // 获取职位详情
  async function fetchJobDetail(id: number) {
    loading.value = true
    try {
      const res = (await getJobDetail(id)) as unknown as ApiResponse<Job>
      currentJob.value = res.data
      return res
    } finally {
      loading.value = false
    }
  }

  // 创建职位
  async function createJobItem(data: Partial<Job>) {
    const res = await createJob(data)
    return res
  }

  // 更新职位
  async function updateJobItem(id: number, data: Partial<Job>) {
    const res = await updateJob(id, data)
    return res
  }

  // 删除职位
  async function deleteJobItem(id: number) {
    const res = await deleteJob(id)
    return res
  }

  // 设置当前职位详情
  function setCurrentJob(job: Job | null) {
    currentJob.value = job
  }

  return {
    jobs,
    currentJob,
    loading,
    total,
    fetchJobs,
    fetchJobDetail,
    createJobItem,
    updateJobItem,
    deleteJobItem,
    setCurrentJob
  }
})