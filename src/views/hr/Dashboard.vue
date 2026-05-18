<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getDashboardStats } from '@/api/admin'
import type { DashboardStats } from '@/types'

const stats = ref<DashboardStats | null>(null)
const loading = ref(true)

onMounted(async () => {
  const res = await getDashboardStats()
  stats.value = res.data
  loading.value = false
})
</script>

<template>
  <div class="dashboard-page">
    <h1>数据看板</h1>

    <div v-if="loading" class="loading">加载中...</div>

    <div v-else-if="stats" class="dashboard-content">
      <div class="stats-cards">
        <div class="stat-card">
          <div class="stat-icon" style="background: #e6f7ff; color: #1890ff">
            📝
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.todayApplications }}</div>
            <div class="stat-label">今日申请数</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon" style="background: #f6ffed; color: #52c41a">
            💼
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.totalJobs }}</div>
            <div class="stat-label">总职位数</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon" style="background: #fff7e6; color: #fa8c16">
            📄
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.pendingResumes }}</div>
            <div class="stat-label">待处理简历</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon" style="background: #f9f0ff; color: #722ed1">
            📅
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.pendingInterviews }}</div>
            <div class="stat-label">待安排面试</div>
          </div>
        </div>
      </div>

      <div class="chart-section">
        <h2>近7天申请趋势</h2>
        <div class="chart-placeholder">
          <p>申请趋势图表</p>
          <div class="trend-list">
            <div v-for="item in stats.applicationTrend" :key="item.date" class="trend-item">
              <span class="date">{{ item.date }}</span>
              <span class="count">{{ item.count }} 份</span>
            </div>
          </div>
        </div>
      </div>

      <div class="quick-actions">
        <h2>快捷操作</h2>
        <div class="action-buttons">
          <button class="action-btn">发布新职位</button>
          <button class="action-btn">查看待处理简历</button>
          <button class="action-btn">安排面试</button>
          <button class="action-btn">导出数据</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-page h1 {
  margin: 0 0 24px;
  font-size: 24px;
  color: #333;
}

.loading {
  text-align: center;
  padding: 60px 0;
  color: #999;
}

.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
}

.stat-card {
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 16px;
  border: 1px solid #f0f0f0;
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 32px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #999;
}

.chart-section {
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
}

.chart-section h2 {
  margin: 0 0 20px;
  font-size: 18px;
  color: #333;
}

.chart-placeholder {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fafafa;
  border-radius: 4px;
}

.trend-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.trend-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 16px;
  background: #fff;
  border-radius: 4px;
}

.trend-item .date {
  color: #666;
}

.trend-item .count {
  color: #1890ff;
  font-weight: 500;
}

.quick-actions {
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
}

.quick-actions h2 {
  margin: 0 0 20px;
  font-size: 18px;
  color: #333;
}

.action-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
}

.action-btn {
  padding: 12px;
  background: #f5f5f5;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.action-btn:hover {
  background: #1890ff;
  color: #fff;
  border-color: #1890ff;
}
</style>