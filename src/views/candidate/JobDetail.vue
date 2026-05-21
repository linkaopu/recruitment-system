<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { getJobDetail } from '@/api/job'
import type { Job } from '@/types'
import type { ApiResponse } from '@/types'
const route = useRoute()
const job = ref<Job | null>(null)
const loading = ref(true)

onMounted(async () => {
  const id = Number(route.params.id)
  const res = (await getJobDetail(id)) as unknown as ApiResponse<Job>
  job.value = res.data
  loading.value = false
})
</script>

<template>
  <div class="job-detail-page">
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="job" class="container">
      <div class="job-header">
        <div class="job-title-section">
          <h1>{{ job.title }}</h1>
          <span v-if="job.isHot" class="hot-tag">热门</span>
        </div>
        <div class="job-meta-info">
          <span class="salary">{{ job.salaryDisplay }}</span>
          <span class="separator">|</span>
          <span>{{ job.location }}</span>
          <span class="separator">|</span>
          <span>{{ job.experience }}</span>
          <span class="separator">|</span>
          <span>{{ job.education }}</span>
          <span class="separator">|</span>
          <span>招聘 {{ job.headcount }} 人</span>
        </div>
      </div>

      <div class="job-content">
        <div class="main-content">
          <section class="section">
            <h2>岗位职责</h2>
            <div class="content-text" v-html="job.description"></div>
          </section>

          <section class="section">
            <h2>任职要求</h2>
            <div class="content-text" v-html="job.requirements"></div>
          </section>

          <section class="section">
            <h2>福利待遇</h2>
            <div class="content-text" v-html="job.benefits"></div>
          </section>
        </div>

        <div class="sidebar">
          <div class="action-card">
            <RouterLink :to="`/apply/${job.id}`" class="btn-apply-large">立即申请</RouterLink>
            <button class="btn-share">分享职位</button>
          </div>

          <div class="info-card">
            <h3>职位信息</h3>
            <div class="info-row">
              <span>所属部门</span>
              <span>{{ job.department }}</span>
            </div>
            <div class="info-row">
              <span>工作地点</span>
              <span>{{ job.location }}</span>
            </div>
            <div class="info-row">
              <span>发布时间</span>
              <span>{{ job.createdAt }}</span>
            </div>
            <div class="info-row">
              <span>浏览次数</span>
              <span>{{ job.viewCount }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.job-detail-page {
  min-height: calc(100vh - 200px);
}

.loading {
  text-align: center;
  padding: 60px 0;
  color: #999;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.job-header {
  background: #fff;
  padding: 32px;
  border-radius: 8px;
  margin-bottom: 24px;
}

.job-title-section {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.job-title-section h1 {
  margin: 0;
  font-size: 32px;
  color: #333;
}

.hot-tag {
  padding: 4px 12px;
  background: #fff2e8;
  color: #fa541c;
  font-size: 14px;
  border-radius: 4px;
}

.job-meta-info {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 16px;
  color: #666;
}

.job-meta-info .salary {
  color: #f5222d;
  font-size: 20px;
  font-weight: 500;
}

.separator {
  color: #e8e8e8;
}

.job-content {
  display: flex;
  gap: 24px;
}

.main-content {
  flex: 1;
}

.sidebar {
  width: 300px;
  flex-shrink: 0;
}

.section {
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  margin-bottom: 24px;
}

.section h2 {
  margin: 0 0 16px;
  font-size: 20px;
  color: #333;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.content-text {
  color: #666;
  line-height: 1.8;
  font-size: 15px;
}

.action-card {
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  margin-bottom: 24px;
  text-align: center;
}

.btn-apply-large {
  display: block;
  width: 100%;
  padding: 14px;
  background: #1890ff;
  color: #fff;
  text-decoration: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 12px;
  transition: all 0.3s;
}

.btn-apply-large:hover {
  background: #40a9ff;
}

.btn-share {
  width: 100%;
  padding: 12px;
  background: #fff;
  color: #666;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-share:hover {
  color: #1890ff;
  border-color: #1890ff;
}

.info-card {
  background: #fff;
  padding: 24px;
  border-radius: 8px;
}

.info-card h3 {
  margin: 0 0 16px;
  font-size: 16px;
  color: #333;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f5f5f5;
  font-size: 14px;
}

.info-row span:first-child {
  color: #999;
}

.info-row span:last-child {
  color: #333;
}
</style>