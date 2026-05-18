<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getApplications, updateApplicationStatus } from '@/api/resume'
import type { Application } from '@/types'

const applications = ref<Application[]>([])
const loading = ref(false)

const filters = ref({
  jobId: '',
  status: '',
  keyword: ''
})

const statusOptions = [
  { value: '', label: '全部状态' },
  { value: 'pending', label: '待查看' },
  { value: 'screened', label: '已初筛' },
  { value: 'interview', label: '面试中' },
  { value: 'hired', label: '已录用' },
  { value: 'rejected', label: '不匹配' }
]

onMounted(() => {
  fetchApplications()
})

async function fetchApplications() {
  loading.value = true
  try {
    const res = await getApplications({
      jobId: filters.value.jobId ? Number(filters.value.jobId) : undefined,
      status: filters.value.status,
      page: 1,
      pageSize: 100
    })
    applications.value = res.data.list
  } finally {
    loading.value = false
  }
}

async function handleStatusChange(app: Application, status: string) {
  await updateApplicationStatus(app.id, status)
  app.status = status as any
}

function handleViewResume(app: Application) {
  // 打开简历预览
}

function handleExport() {
  // 导出简历
}

function handleScheduleInterview(app: Application) {
  // 安排面试
}
</script>

<template>
  <div class="resume-management-page">
    <div class="page-header">
      <h1>简历管理</h1>
      <button class="btn-secondary" @click="handleExport">导出简历</button>
    </div>

    <div class="toolbar">
      <div class="filter-item">
        <label>搜索</label>
        <input v-model="filters.keyword" type="text" placeholder="姓名/手机号" @keyup.enter="fetchApplications" />
      </div>
      <div class="filter-item">
        <label>职位</label>
        <input v-model="filters.jobId" type="text" placeholder="职位ID" @keyup.enter="fetchApplications" />
      </div>
      <div class="filter-item">
        <label>状态</label>
        <select v-model="filters.status" @change="fetchApplications">
          <option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>
      </div>
      <button class="btn-primary" @click="fetchApplications">查询</button>
    </div>

    <div v-if="loading" class="loading">加载中...</div>

    <div v-else class="resume-list-container">
      <div v-for="app in applications" :key="app.id" class="resume-card">
        <div class="resume-header">
          <div class="applicant-info">
            <div class="name">{{ app.userName }}</div>
            <div class="meta">
              <span>申请职位：{{ app.jobTitle }}</span>
              <span>申请时间：{{ app.appliedAt }}</span>
            </div>
          </div>
          <div class="status-selector">
            <select :value="app.status" @change="handleStatusChange(app, ($event.target as HTMLSelectElement).value)">
              <option value="pending">待查看</option>
              <option value="screened">已初筛</option>
              <option value="interview">面试中</option>
              <option value="hired">已录用</option>
              <option value="rejected">不匹配</option>
            </select>
          </div>
        </div>

        <div class="resume-body">
          <div class="resume-preview">
            <div class="preview-placeholder">
              简历预览区域
            </div>
          </div>
        </div>

        <div class="resume-actions">
          <button class="btn-link" @click="handleViewResume(app)">查看完整简历</button>
          <button class="btn-link" @click="handleScheduleInterview(app)">安排面试</button>
        </div>
      </div>

      <div v-if="applications.length === 0" class="empty-state">
        暂无简历数据
      </div>
    </div>
  </div>
</template>

<style scoped>
.resume-management-page h1 {
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
}

.btn-primary:hover {
  background: #40a9ff;
}

.btn-secondary {
  padding: 10px 24px;
  background: #fff;
  color: #666;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.btn-secondary:hover {
  color: #1890ff;
  border-color: #1890ff;
}

.toolbar {
  background: #fff;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
  gap: 16px;
  align-items: center;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-item label {
  font-size: 14px;
  color: #666;
}

.filter-item input,
.filter-item select {
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
}

.filter-item input:focus,
.filter-item select:focus {
  outline: none;
  border-color: #1890ff;
}

.loading {
  text-align: center;
  padding: 40px 0;
  color: #999;
}

.resume-list-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.resume-card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #f0f0f0;
}

.resume-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.applicant-info .name {
  font-size: 18px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

.applicant-info .meta {
  display: flex;
  gap: 16px;
  font-size: 14px;
  color: #999;
}

.status-selector select {
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.resume-body {
  margin-bottom: 16px;
}

.resume-preview {
  background: #fafafa;
  border-radius: 4px;
  padding: 40px;
  text-align: center;
  color: #999;
}

.resume-actions {
  display: flex;
  gap: 16px;
  padding-top: 16px;
  border-top: 1px solid #f5f5f5;
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

.empty-state {
  padding: 60px 20px;
  text-align: center;
  color: #999;
}
</style>