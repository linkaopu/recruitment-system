<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { getMyApplications } from '@/api/resume'
import { useUserStore } from '@/stores/user'
import type { Application } from '@/types'

const userStore = useUserStore()
const activeTab = ref('applications')
const applications = ref<Application[]>([])
const loading = ref(false)

const tabs = [
  { key: 'applications', label: '我的申请' },
  { key: 'favorites', label: '我的收藏' },
  { key: 'profile', label: '个人信息' }
]

const statusMap: Record<string, { text: string; color: string }> = {
  pending: { text: '待查看', color: '#faad14' },
  screened: { text: '已初筛', color: '#1890ff' },
  interview: { text: '面试中', color: '#722ed1' },
  hired: { text: '已录用', color: '#52c41a' },
  rejected: { text: '不匹配', color: '#ff4d4f' }
}

onMounted(() => {
  fetchApplications()
})

async function fetchApplications() {
  loading.value = true
  try {
    const res = await getMyApplications()
    applications.value = res.data.list
  } finally {
    loading.value = false
  }
}

function handleLogout() {
  userStore.logout()
}
</script>

<template>
  <div class="center-page">
    <div class="container">
      <div class="center-layout">
        <aside class="sidebar">
          <div class="user-card">
            <div class="avatar">{{ userStore.user?.username?.[0] || 'U' }}</div>
            <div class="user-info">
              <div class="username">{{ userStore.user?.username }}</div>
              <div class="email">{{ userStore.user?.email }}</div>
            </div>
          </div>
          <nav class="menu">
            <RouterLink
              v-for="tab in tabs"
              :key="tab.key"
              :to="`/center?tab=${tab.key}`"
              class="menu-item"
              :class="{ active: activeTab === tab.key }"
              @click="activeTab = tab.key"
            >
              {{ tab.label }}
            </RouterLink>
          </nav>
          <button class="logout-btn" @click="handleLogout">退出登录</button>
        </aside>

        <main class="content">
          <div v-if="activeTab === 'applications'" class="applications-section">
            <h2>我的申请记录</h2>
            <div v-if="loading" class="loading">加载中...</div>
            <div v-else-if="applications.length === 0" class="empty-state">
              暂无申请记录，<RouterLink to="/jobs">去看看职位</RouterLink>
            </div>
            <div v-else class="application-list">
              <div v-for="app in applications" :key="app.id" class="application-item">
                <div class="app-header">
                  <RouterLink :to="`/jobs/${app.jobId}`" class="job-title">
                    {{ app.jobTitle }}
                  </RouterLink>
                  <span
                    class="status-tag"
                    :style="{ color: statusMap[app.status]?.color }"
                  >
                    {{ statusMap[app.status]?.text }}
                  </span>
                </div>
                <div class="app-meta">
                  <span>申请时间：{{ app.appliedAt }}</span>
                  <span>更新时间：{{ app.updatedAt }}</span>
                </div>
                <div v-if="app.rejectReason" class="reject-reason">
                  拒绝原因：{{ app.rejectReason }}
                </div>
              </div>
            </div>
          </div>

          <div v-else-if="activeTab === 'favorites'" class="favorites-section">
            <h2>我的收藏</h2>
            <div class="empty-state">
              暂无收藏
            </div>
          </div>

          <div v-else-if="activeTab === 'profile'" class="profile-section">
            <h2>个人信息</h2>
            <div class="profile-form">
              <div class="form-group">
                <label>用户名</label>
                <div class="value">{{ userStore.user?.username }}</div>
              </div>
              <div class="form-group">
                <label>邮箱</label>
                <div class="value">{{ userStore.user?.email }}</div>
              </div>
              <div class="form-group">
                <label>手机号</label>
                <div class="value">{{ userStore.user?.phone }}</div>
              </div>
              <div class="form-group">
                <label>角色</label>
                <div class="value">
                  {{ userStore.isCandidate ? '求职者' : userStore.isHR ? 'HR' : '管理员' }}
                </div>
              </div>
              <RouterLink to="/resume" class="btn-primary">编辑简历</RouterLink>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<style scoped>
.center-page {
  min-height: calc(100vh - 200px);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.center-layout {
  display: flex;
  gap: 24px;
}

.sidebar {
  width: 280px;
  flex-shrink: 0;
}

.user-card {
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  margin-bottom: 16px;
  text-align: center;
}

.avatar {
  width: 80px;
  height: 80px;
  background: #1890ff;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  margin: 0 auto 16px;
}

.user-info .username {
  font-size: 18px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.user-info .email {
  font-size: 14px;
  color: #999;
}

.menu {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 16px;
}

.menu-item {
  display: block;
  padding: 14px 24px;
  color: #666;
  text-decoration: none;
  border-bottom: 1px solid #f5f5f5;
  transition: all 0.3s;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item:hover,
.menu-item.active {
  background: #e6f7ff;
  color: #1890ff;
}

.logout-btn {
  width: 100%;
  padding: 14px;
  background: #fff;
  color: #ff4d4f;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.logout-btn:hover {
  background: #fff1f0;
}

.content {
  flex: 1;
}

.content h2 {
  margin: 0 0 24px;
  font-size: 24px;
  color: #333;
}

.loading {
  text-align: center;
  padding: 40px 0;
  color: #999;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

.empty-state a {
  color: #1890ff;
  text-decoration: none;
}

.application-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.application-item {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.job-title {
  font-size: 18px;
  font-weight: 500;
  color: #333;
  text-decoration: none;
}

.job-title:hover {
  color: #1890ff;
}

.status-tag {
  padding: 4px 12px;
  background: #fafafa;
  border-radius: 4px;
  font-size: 14px;
}

.app-meta {
  display: flex;
  gap: 24px;
  font-size: 14px;
  color: #999;
}

.reject-reason {
  margin-top: 12px;
  padding: 12px;
  background: #fff2f0;
  border: 1px solid #ffccc7;
  border-radius: 4px;
  font-size: 14px;
  color: #ff4d4f;
}

.profile-form {
  background: #fff;
  padding: 32px;
  border-radius: 8px;
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.form-group .value {
  font-size: 16px;
  color: #333;
}

.btn-primary {
  display: inline-block;
  padding: 10px 32px;
  background: #1890ff;
  color: #fff;
  text-decoration: none;
  border-radius: 4px;
  font-size: 16px;
  transition: all 0.3s;
}

.btn-primary:hover {
  background: #40a9ff;
}
</style>