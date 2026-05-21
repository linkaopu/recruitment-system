<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getJobList, toggleJobStatus, deleteJob as deleteJobApi } from '@/api/job'
import type { Job, ApiResponse, JobListResponse } from '@/types'

const jobs = ref<Job[]>([])
const loading = ref(false)
const searchKeyword = ref('')
const statusFilter = ref<'all' | 'active' | 'inactive'>('all')

onMounted(() => {
  fetchJobs()
})

async function fetchJobs() {
  loading.value = true
  try {
    const res = (await getJobList({
      keyword: searchKeyword.value,
      page: 1,
      pageSize: 100
    })) as unknown as ApiResponse<JobListResponse>
    jobs.value = res.data.list.filter(job => {
      if (statusFilter.value === 'all') return true
      return job.status === statusFilter.value
    })
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  fetchJobs()
}

async function handleToggleStatus(job: Job) {
  const newStatus = job.status === 'active' ? 'inactive' : 'active'
  await toggleJobStatus(job.id, newStatus)
  job.status = newStatus
}

async function handleDeleteJob(id: number) {
  if (confirm('确定要删除该职位吗？')) {
    await deleteJobApi(id)
    jobs.value = jobs.value.filter(j => j.id !== id)
  }
}

function handleCreateJob() {
  // 打开创建职位对话框
}

function handleEditJob(job: Job) {
  // 打开编辑职位对话框
}
</script>

<template>
  <div class="job-management-page">
    <div class="page-header">
      <h1>职位管理</h1>
      <button class="btn-primary" @click="handleCreateJob">发布新职位</button>
    </div>

    <div class="toolbar">
      <div class="search-box">
        <input v-model="searchKeyword" type="text" placeholder="搜索职位名称..." @keyup.enter="handleSearch" />
        <button @click="handleSearch">搜索</button>
      </div>
      <div class="filter-group">
        <button :class="{ active: statusFilter === 'all' }" @click="statusFilter = 'all'; fetchJobs()">
          全部
        </button>
        <button :class="{ active: statusFilter === 'active' }" @click="statusFilter = 'active'; fetchJobs()">
          已上架
        </button>
        <button :class="{ active: statusFilter === 'inactive' }" @click="statusFilter = 'inactive'; fetchJobs()">
          已下架
        </button>
      </div>
    </div>

    <div v-if="loading" class="loading">加载中...</div>

    <div v-else class="job-table-container">
      <table class="job-table">
        <thead>
          <tr>
            <th>职位名称</th>
            <th>部门</th>
            <th>地点</th>
            <th>薪资</th>
            <th>招聘人数</th>
            <th>申请数</th>
            <th>浏览数</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="job in jobs" :key="job.id">
            <td>
              <span v-if="job.isHot" class="hot-tag">热门</span>
              {{ job.title }}
            </td>
            <td>{{ job.department }}</td>
            <td>{{ job.location }}</td>
            <td class="salary">{{ job.salaryDisplay }}</td>
            <td>{{ job.headcount }}</td>
            <td>{{ job.applyCount }}</td>
            <td>{{ job.viewCount }}</td>
            <td>
              <span class="status-badge" :class="job.status">
                {{ job.status === 'active' ? '已上架' : '已下架' }}
              </span>
            </td>
            <td class="actions">
              <button class="btn-link" @click="handleEditJob(job)">编辑</button>
              <button class="btn-link" @click="handleToggleStatus(job)">
                {{ job.status === 'active' ? '下架' : '上架' }}
              </button>
              <button class="btn-link btn-danger" @click="handleDeleteJob(job.id)">删除</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="jobs.length === 0" class="empty-state">
        暂无职位数据
      </div>
    </div>
  </div>
</template>

<style scoped>
.job-management-page h1 {
  margin: 0 0 24px;
  font-size: 24px;
  color: #333;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.btn-primary {
  padding: 10px 24px;
  background: #1890ff;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary:hover {
  background: #40a9ff;
}

.toolbar {
  background: #fff;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
  gap: 20px;
  align-items: center;
}

.search-box {
  display: flex;
  gap: 8px;
  flex: 1;
}

.search-box input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  max-width: 300px;
}

.search-box input:focus {
  outline: none;
  border-color: #1890ff;
}

.search-box button {
  padding: 8px 16px;
  background: #1890ff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.filter-group {
  display: flex;
  gap: 8px;
}

.filter-group button {
  padding: 8px 16px;
  background: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.filter-group button.active {
  color: #1890ff;
  border-color: #1890ff;
  background: #e6f7ff;
}

.loading {
  text-align: center;
  padding: 40px 0;
  color: #999;
}

.job-table-container {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
}

.job-table {
  width: 100%;
  border-collapse: collapse;
}

.job-table th {
  padding: 16px;
  text-align: left;
  background: #fafafa;
  font-weight: 500;
  color: #333;
  border-bottom: 1px solid #f0f0f0;
}

.job-table td {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  color: #666;
}

.job-table tr:last-child td {
  border-bottom: none;
}

.hot-tag {
  display: inline-block;
  padding: 2px 8px;
  background: #fff2e8;
  color: #fa541c;
  font-size: 12px;
  border-radius: 2px;
  margin-right: 8px;
}

.salary {
  color: #f5222d;
  font-weight: 500;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
}

.status-badge.active {
  background: #f6ffed;
  color: #52c41a;
}

.status-badge.inactive {
  background: #f5f5f5;
  color: #999;
}

.actions {
  display: flex;
  gap: 12px;
}

.btn-link {
  background: none;
  border: none;
  color: #1890ff;
  cursor: pointer;
  font-size: 14px;
  padding: 4px 0;
}

.btn-link:hover {
  text-decoration: underline;
}

.btn-link.btn-danger {
  color: #ff4d4f;
}

.empty-state {
  padding: 60px 20px;
  text-align: center;
  color: #999;
}
</style>