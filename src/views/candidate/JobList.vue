<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ref, onMounted } from 'vue'
import { getJobList } from '@/api/job'
import type { Job, JobQueryParams } from '@/types'

const jobs = ref<Job[]>([])
const total = ref(0)
const loading = ref(false)

const filters = ref<JobQueryParams>({
  keyword: '',
  department: '',
  location: '',
  salaryMin: undefined,
  salaryMax: undefined,
  education: '',
  experience: '',
  sortBy: 'latest',
  page: 1,
  pageSize: 10
})

const departments = ['技术部', '产品部', '设计部', '运营部', '市场部', '人事部', '财务部']
const locations = ['北京', '上海', '深圳', '杭州', '广州']
const educationOptions = ['不限', '大专', '本科', '硕士', '博士']
const experienceOptions = ['不限', '1年以下', '1-3年', '3-5年', '5-10年', '10年以上']

onMounted(() => {
  fetchJobs()
})

async function fetchJobs() {
  loading.value = true
  try {
    const res = await getJobList(filters.value)
    jobs.value = res.data.list
    total.value = res.data.total
  } finally {
    loading.value = false
  }
}

function handleFilter() {
  filters.value.page = 1
  fetchJobs()
}

function handleSortChange(sortBy: 'latest' | 'salary' | 'hot') {
  filters.value.sortBy = sortBy
  fetchJobs()
}

function handlePageChange(page: number) {
  filters.value.page = page
  fetchJobs()
}
</script>

<template>
  <div class="job-list-page">
    <div class="container">
      <div class="page-header">
        <h1>职位列表</h1>
      </div>

      <div class="filter-bar">
        <div class="filter-row">
          <div class="filter-item">
            <label>搜索</label>
            <input v-model="filters.keyword" type="text" placeholder="输入职位关键词" @keyup.enter="handleFilter" />
          </div>
          <button class="btn-primary" @click="handleFilter">搜索</button>
        </div>
        <div class="filter-row">
          <div class="filter-item">
            <label>部门</label>
            <select v-model="filters.department">
              <option value="">全部</option>
              <option v-for="dept in departments" :key="dept" :value="dept">{{ dept }}</option>
            </select>
          </div>
          <div class="filter-item">
            <label>地点</label>
            <select v-model="filters.location">
              <option value="">全部</option>
              <option v-for="loc in locations" :key="loc" :value="loc">{{ loc }}</option>
            </select>
          </div>
          <div class="filter-item">
            <label>学历</label>
            <select v-model="filters.education">
              <option v-for="edu in educationOptions" :key="edu" :value="edu === '不限' ? '' : edu">
                {{ edu }}
              </option>
            </select>
          </div>
          <div class="filter-item">
            <label>经验</label>
            <select v-model="filters.experience">
              <option v-for="exp in experienceOptions" :key="exp" :value="exp === '不限' ? '' : exp">
                {{ exp }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <div class="sort-bar">
        <button :class="{ active: filters.sortBy === 'latest' }" @click="handleSortChange('latest')">
          最新发布
        </button>
        <button :class="{ active: filters.sortBy === 'salary' }" @click="handleSortChange('salary')">
          薪资最高
        </button>
        <button :class="{ active: filters.sortBy === 'hot' }" @click="handleSortChange('hot')">
          最热职位
        </button>
      </div>

      <div v-loading="loading" class="job-list">
        <div v-if="jobs.length === 0 && !loading" class="empty-state">
          暂无职位
        </div>
        <div v-for="job in jobs" :key="job.id" class="job-card">
          <div class="job-main">
            <div class="job-title">
              <RouterLink :to="`/jobs/${job.id}`">{{ job.title }}</RouterLink>
              <span v-if="job.isHot" class="hot-tag">热门</span>
            </div>
            <div class="job-info">
              <span>{{ job.department }}</span>
              <span>{{ job.location }}</span>
              <span>{{ job.experience }}</span>
              <span>{{ job.education }}</span>
            </div>
            <div class="job-meta">
              <span class="salary">{{ job.salaryDisplay }}</span>
              <span class="time">发布于 {{ job.createdAt }}</span>
            </div>
          </div>
          <div class="job-action">
            <RouterLink :to="`/apply/${job.id}`" class="btn-apply">立即申请</RouterLink>
          </div>
        </div>
      </div>

      <div class="pagination">
        <button :disabled="filters.page === 1" @click="handlePageChange(filters.page - 1)">
          上一页
        </button>
        <span>{{ filters.page }} / {{ Math.ceil(total / filters.pageSize) }}</span>
        <button :disabled="filters.page >= Math.ceil(total / filters.pageSize)" @click="handlePageChange(filters.page + 1)">
          下一页
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.job-list-page {
  min-height: calc(100vh - 200px);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.page-header {
  padding: 24px 0;
}

.page-header h1 {
  margin: 0;
  font-size: 28px;
  color: #333;
}

.filter-bar {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.filter-row {
  display: flex;
  gap: 16px;
  align-items: center;
}

.filter-row:not(:last-child) {
  margin-bottom: 16px;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-item label {
  font-size: 14px;
  color: #666;
  white-space: nowrap;
}

.filter-item input,
.filter-item select {
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  min-width: 150px;
}

.filter-item input:focus,
.filter-item select:focus {
  outline: none;
  border-color: #1890ff;
}

.btn-primary {
  padding: 8px 24px;
  background: #1890ff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.btn-primary:hover {
  background: #40a9ff;
}

.sort-bar {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.sort-bar button {
  padding: 8px 20px;
  background: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.sort-bar button:hover,
.sort-bar button.active {
  color: #1890ff;
  border-color: #1890ff;
}

.job-list {
  background: #fff;
  border-radius: 8px;
  margin-bottom: 20px;
}

.empty-state {
  padding: 60px 0;
  text-align: center;
  color: #999;
}

.job-card {
  display: flex;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
  transition: background 0.3s;
}

.job-card:last-child {
  border-bottom: none;
}

.job-card:hover {
  background: #fafafa;
}

.job-main {
  flex: 1;
}

.job-title {
  font-size: 18px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.job-title a {
  color: #333;
  text-decoration: none;
  font-weight: 500;
}

.job-title a:hover {
  color: #1890ff;
}

.hot-tag {
  padding: 2px 8px;
  background: #fff2e8;
  color: #fa541c;
  font-size: 12px;
  border-radius: 2px;
}

.job-info {
  display: flex;
  gap: 16px;
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.job-info span {
  padding-right: 16px;
  border-right: 1px solid #e8e8e8;
}

.job-info span:last-child {
  border-right: none;
}

.job-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 14px;
}

.job-meta .salary {
  color: #f5222d;
  font-weight: 500;
  font-size: 16px;
}

.job-meta .time {
  color: #999;
}

.job-action {
  margin-left: 24px;
}

.btn-apply {
  padding: 8px 24px;
  background: #1890ff;
  color: #fff;
  text-decoration: none;
  border-radius: 4px;
  font-size: 14px;
  transition: all 0.3s;
}

.btn-apply:hover {
  background: #40a9ff;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 24px 0;
}

.pagination button {
  padding: 8px 16px;
  background: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.pagination button:disabled {
  color: #ccc;
  cursor: not-allowed;
}

.pagination button:not(:disabled):hover {
  color: #1890ff;
  border-color: #1890ff;
}

.pagination span {
  color: #666;
  font-size: 14px;
}
</style>