<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getSystemLogs } from '@/api/admin'
import type { SystemLog } from '@/types'
import type { ApiResponse, PageResponse } from '@/types'

const logs = ref<SystemLog[]>([])
const loading = ref(false)

const filters = ref({
  keyword: '',
  action: '',
  dateRange: ''
})

onMounted(() => {
  fetchLogs()
})

async function fetchLogs() {
  loading.value = true
  try {
    const res = (await getSystemLogs({
      ...filters.value,
      page: 1,
      pageSize: 100
    })) as unknown as ApiResponse<PageResponse<SystemLog>>
    logs.value = res.data.list
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  fetchLogs()
}
</script>

<template>
  <div class="system-logs-page">
    <h1>系统日志</h1>

    <div class="toolbar">
      <div class="filter-item">
        <label>搜索</label>
        <input v-model="filters.keyword" type="text" placeholder="用户名/IP地址" @keyup.enter="handleSearch" />
      </div>
      <div class="filter-item">
        <label>操作类型</label>
        <select v-model="filters.action">
          <option value="">全部</option>
          <option value="login">登录</option>
          <option value="logout">登出</option>
          <option value="create">创建</option>
          <option value="update">更新</option>
          <option value="delete">删除</option>
        </select>
      </div>
      <button class="btn-primary" @click="handleSearch">查询</button>
    </div>

    <div v-if="loading" class="loading">加载中...</div>

    <div v-else class="logs-container">
      <table class="logs-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>用户</th>
            <th>操作</th>
            <th>IP地址</th>
            <th>User Agent</th>
            <th>时间</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="log in logs" :key="log.id">
            <td>{{ log.id }}</td>
            <td>{{ log.username }}</td>
            <td>{{ log.action }}</td>
            <td>{{ log.ip }}</td>
            <td class="user-agent">{{ log.userAgent }}</td>
            <td>{{ log.createdAt }}</td>
          </tr>
        </tbody>
      </table>

      <div v-if="logs.length === 0" class="empty-state">
        暂无日志数据
      </div>
    </div>
  </div>
</template>

<style scoped>
.system-logs-page h1 {
  margin: 0 0 24px;
  font-size: 24px;
  color: #333;
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

.btn-primary {
  padding: 8px 20px;
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

.loading {
  text-align: center;
  padding: 40px 0;
  color: #999;
}

.logs-container {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
}

.logs-table {
  width: 100%;
  border-collapse: collapse;
}

.logs-table th {
  padding: 16px;
  text-align: left;
  background: #fafafa;
  font-weight: 500;
  color: #333;
  border-bottom: 1px solid #f0f0f0;
}

.logs-table td {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  color: #666;
  font-size: 14px;
}

.logs-table tr:last-child td {
  border-bottom: none;
}

.logs-table .user-agent {
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.empty-state {
  padding: 60px 20px;
  text-align: center;
  color: #999;
}
</style>