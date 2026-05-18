import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Job, JobQueryParams, JobListResponse } from '@/types'
import { getJobList, getJobDetail, createJob, updateJob, deleteJob } from '@/api/job'

export const useJobStore = defineStore('job', () => {
  const jobs = ref<Job[]>([])
  const currentJob = ref<Job | null>(null)
  const loading = ref(false)
  const total = ref(0)

  async function fetchJobs(params: JobQueryParams) {
    loading.value = true
    try {
      const res = await getJobList(params)
      jobs.value = res.data.list
      total.value = res.data.total
      return res
    } finally {
      loading.value = false
    }
  }

  async function fetchJobDetail(id: number) {
    loading.value = true
    try {
      const res = await getJobDetail(id)
      currentJob.value = res.data
      return res
    } finally {
      loading.value = false
    }
  }

  async function createJobItem(data: Partial<Job>) {
    const res = await createJob(data)
    return res
  }

  async function updateJobItem(id: number, data: Partial<Job>) {
    const res = await updateJob(id, data)
    return res
  }

  async function deleteJobItem(id: number) {
    const res = await deleteJob(id)
    return res
  }

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