<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getInterviews, createInterview, updateInterviewResult } from '@/api/interview'
import type { Interview } from '@/types'

const interviews = ref<Interview[]>([])
const loading = ref(false)
const showCreateDialog = ref(false)

const newInterview = ref({
  applicationId: 0,
  interviewer: '',
  interviewTime: '',
  location: '',
  method: 'online' as 'online' | 'offline'
})

onMounted(() => {
  fetchInterviews()
})

async function fetchInterviews() {
  loading.value = true
  try {
    const res = await getInterviews({ page: 1, pageSize: 100 })
    interviews.value = res.data.list
  } finally {
    loading.value = false
  }
}

async function handleCreateInterview() {
  await createInterview(newInterview.value)
  showCreateDialog.value = false
  fetchInterviews()
}

async function handleUpdateResult(interview: Interview, result: 'pending' | 'pass' | 'fail') {
  await updateInterviewResult(interview.id, result)
  interview.result = result
}

function handleSendNotification(interview: Interview) {
  // 发送面试通知
}
</script>

<template>
  <div class="interview-management-page">
    <div class="page-header">
      <h1>面试管理</h1>
      <button class="btn-primary" @click="showCreateDialog = true">安排面试</button>
    </div>

    <div v-if="loading" class="loading">加载中...</div>

    <div v-else class="interview-list-container">
      <div v-for="interview in interviews" :key="interview.id" class="interview-card">
        <div class="interview-header">
          <div class="candidate-info">
            <div class="name">{{ interview.userName }}</div>
            <div class="position">{{ interview.jobTitle }}</div>
          </div>
          <div class="result-badge" :class="interview.result">
            {{ interview.result === 'pending' ? '待定' : interview.result === 'pass' ? '通过' : '不通过' }}
          </div>
        </div>

        <div class="interview-details">
          <div class="detail-item">
            <span class="label">面试官：</span>
            <span>{{ interview.interviewer }}</span>
          </div>
          <div class="detail-item">
            <span class="label">面试时间：</span>
            <span>{{ interview.interviewTime }}</span>
          </div>
          <div class="detail-item">
            <span class="label">面试地点：</span>
            <span>{{ interview.location }}</span>
          </div>
          <div class="detail-item">
            <span class="label">面试方式：</span>
            <span>{{ interview.method === 'online' ? '线上面试' : '线下面试' }}</span>
          </div>
        </div>

        <div class="interview-actions">
          <button
            v-if="interview.result === 'pending'"
            class="btn-result btn-pass"
            @click="handleUpdateResult(interview, 'pass')"
          >
            通过
          </button>
          <button
            v-if="interview.result === 'pending'"
            class="btn-result btn-fail"
            @click="handleUpdateResult(interview, 'fail')"
          >
            不通过
          </button>
          <button
            v-if="!interview.notified"
            class="btn-notify"
            @click="handleSendNotification(interview)"
          >
            发送通知
          </button>
          <span v-else class="notified-badge">已通知</span>
        </div>
      </div>

      <div v-if="interviews.length === 0" class="empty-state">
        暂无面试安排
      </div>
    </div>

    <div v-if="showCreateDialog" class="dialog-overlay" @click.self="showCreateDialog = false">
      <div class="dialog">
        <div class="dialog-header">
          <h2>安排面试</h2>
          <button class="close-btn" @click="showCreateDialog = false">×</button>
        </div>
        <div class="dialog-body">
          <div class="form-group">
            <label>申请ID</label>
            <input v-model.number="newInterview.applicationId" type="number" placeholder="请输入申请ID" />
          </div>
          <div class="form-group">
            <label>面试官</label>
            <input v-model="newInterview.interviewer" type="text" placeholder="请输入面试官姓名" />
          </div>
          <div class="form-group">
            <label>面试时间</label>
            <input v-model="newInterview.interviewTime" type="datetime-local" />
          </div>
          <div class="form-group">
            <label>面试地点</label>
            <input v-model="newInterview.location" type="text" placeholder="请输入面试地点" />
          </div>
          <div class="form-group">
            <label>面试方式</label>
            <select v-model="newInterview.method">
              <option value="online">线上面试</option>
              <option value="offline">线下面试</option>
            </select>
          </div>
        </div>
        <div class="dialog-footer">
          <button class="btn-secondary" @click="showCreateDialog = false">取消</button>
          <button class="btn-primary" @click="handleCreateInterview">确认安排</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.interview-management-page h1 {
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

.loading {
  text-align: center;
  padding: 40px 0;
  color: #999;
}

.interview-list-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.interview-card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #f0f0f0;
}

.interview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.candidate-info .name {
  font-size: 18px;
  font-weight: 500;
  color: #333;
}

.candidate-info .position {
  font-size: 14px;
  color: #999;
  margin-top: 4px;
}

.result-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 14px;
}

.result-badge.pending {
  background: #fff7e6;
  color: #fa8c16;
}

.result-badge.pass {
  background: #f6ffed;
  color: #52c41a;
}

.result-badge.fail {
  background: #fff1f0;
  color: #ff4d4f;
}

.interview-details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 16px;
  padding: 16px;
  background: #fafafa;
  border-radius: 4px;
}

.detail-item {
  font-size: 14px;
}

.detail-item .label {
  color: #999;
  margin-right: 8px;
}

.interview-actions {
  display: flex;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid #f5f5f5;
}

.btn-result {
  padding: 8px 20px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.btn-result.btn-pass {
  background: #f6ffed;
  color: #52c41a;
  border: 1px solid #b7eb8f;
}

.btn-result.btn-pass:hover {
  background: #52c41a;
  color: #fff;
}

.btn-result.btn-fail {
  background: #fff1f0;
  color: #ff4d4f;
  border: 1px solid #ffa39e;
}

.btn-result.btn-fail:hover {
  background: #ff4d4f;
  color: #fff;
}

.btn-notify {
  padding: 8px 20px;
  background: #1890ff;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.btn-notify:hover {
  background: #40a9ff;
}

.notified-badge {
  padding: 8px 20px;
  background: #f5f5f5;
  color: #999;
  border-radius: 4px;
  font-size: 14px;
}

.empty-state {
  padding: 60px 20px;
  text-align: center;
  color: #999;
}

.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.dialog {
  background: #fff;
  border-radius: 8px;
  width: 500px;
  max-width: 90vw;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
}

.dialog-header h2 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #999;
  cursor: pointer;
  line-height: 1;
}

.dialog-body {
  padding: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #666;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #1890ff;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid #f0f0f0;
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
</style>