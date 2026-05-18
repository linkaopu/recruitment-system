<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { applyJob, getMyResume } from '@/api/resume'
import type { Resume } from '@/types'

const route = useRoute()
const router = useRouter()

const jobId = Number(route.params.jobId)
const resumes = ref<Resume[]>([])
const selectedResumeId = ref<number | null>(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await getMyResume()
    resumes.value = res.data ? [res.data] : []
    if (resumes.value.length > 0) {
      selectedResumeId.value = resumes.value[0].id
    }
  } finally {
    loading.value = false
  }
})

async function handleSubmit() {
  if (!selectedResumeId.value) {
    alert('请先创建简历')
    router.push('/resume')
    return
  }

  try {
    await applyJob({ jobId, resumeId: selectedResumeId.value })
    alert('申请成功！')
    router.push('/center')
  } catch (error) {
    alert('申请失败，请重试')
  }
}

function goBack() {
  router.back()
}
</script>

<template>
  <div class="job-apply-page">
    <div class="container">
      <div class="page-header">
        <h1>申请职位</h1>
      </div>

      <div v-if="loading" class="loading">加载中...</div>

      <div v-else class="apply-content">
        <div v-if="resumes.length === 0" class="no-resume">
          <div class="empty-icon">📄</div>
          <p>您还没有创建简历</p>
          <RouterLink to="/resume" class="btn-primary">去创建简历</RouterLink>
        </div>

        <div v-else class="resume-selector">
          <h2>选择简历</h2>
          <div class="resume-list">
            <div
              v-for="resume in resumes"
              :key="resume.id"
              class="resume-item"
              :class="{ selected: selectedResumeId === resume.id }"
              @click="selectedResumeId = resume.id"
            >
              <div class="resume-info">
                <div class="resume-name">{{ resume.name }}</div>
                <div class="resume-meta">
                  <span>{{ resume.phone }}</span>
                  <span>{{ resume.email }}</span>
                  <span>{{ resume.education }}</span>
                </div>
                <div v-if="resume.attachmentName" class="resume-attachment">
                  附件：{{ resume.attachmentName }}
                </div>
              </div>
              <div v-if="selectedResumeId === resume.id" class="check-icon">✓</div>
            </div>
          </div>

          <div class="actions">
            <button class="btn-secondary" @click="goBack">取消</button>
            <button class="btn-primary" @click="handleSubmit">提交申请</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.job-apply-page {
  min-height: calc(100vh - 200px);
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
}

.page-header {
  margin-bottom: 32px;
}

.page-header h1 {
  margin: 0;
  font-size: 28px;
  color: #333;
}

.loading {
  text-align: center;
  padding: 60px 0;
  color: #999;
}

.apply-content {
  background: #fff;
  border-radius: 8px;
  padding: 32px;
}

.no-resume {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.no-resume p {
  color: #666;
  font-size: 16px;
  margin: 0 0 24px;
}

.resume-selector h2 {
  margin: 0 0 24px;
  font-size: 20px;
  color: #333;
}

.resume-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 32px;
}

.resume-item {
  display: flex;
  align-items: center;
  padding: 20px;
  border: 2px solid #f0f0f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.resume-item:hover {
  border-color: #d9d9d9;
}

.resume-item.selected {
  border-color: #1890ff;
  background: #e6f7ff;
}

.resume-info {
  flex: 1;
}

.resume-name {
  font-size: 18px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

.resume-meta {
  display: flex;
  gap: 16px;
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.resume-attachment {
  font-size: 14px;
  color: #1890ff;
}

.check-icon {
  width: 24px;
  height: 24px;
  background: #1890ff;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.actions {
  display: flex;
  gap: 16px;
  justify-content: flex-end;
}

.btn-primary,
.btn-secondary {
  padding: 10px 32px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background: #1890ff;
  color: #fff;
}

.btn-primary:hover {
  background: #40a9ff;
}

.btn-secondary {
  background: #fff;
  color: #666;
  border: 1px solid #d9d9d9;
}

.btn-secondary:hover {
  color: #1890ff;
  border-color: #1890ff;
}
</style>