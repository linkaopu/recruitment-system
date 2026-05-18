<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getSystemSettings, updateSystemSettings } from '@/api/admin'

const settings = ref({
  siteName: '招聘系统',
  companyName: 'xxx公司',
  contactPhone: '400-123-4567',
  contactEmail: 'hr@company.com',
  address: '北京市朝阳区xxx大厦',
  description: '我们是一家致力于创新与发展的企业'
})
const saving = ref(false)

onMounted(async () => {
  const res = await getSystemSettings()
  if (res.data) {
    settings.value = { ...settings.value, ...res.data }
  }
})

async function handleSave() {
  saving.value = true
  try {
    await updateSystemSettings(settings.value)
    alert('保存成功')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="system-management-page">
    <h1>系统设置</h1>

    <div class="settings-container">
      <div class="setting-section">
        <h2>基础信息</h2>
        <div class="form-grid">
          <div class="form-group">
            <label>网站名称</label>
            <input v-model="settings.siteName" type="text" />
          </div>
          <div class="form-group">
            <label>公司名称</label>
            <input v-model="settings.companyName" type="text" />
          </div>
          <div class="form-group">
            <label>联系电话</label>
            <input v-model="settings.contactPhone" type="text" />
          </div>
          <div class="form-group">
            <label>联系邮箱</label>
            <input v-model="settings.contactEmail" type="text" />
          </div>
          <div class="form-group full-width">
            <label>公司地址</label>
            <input v-model="settings.address" type="text" />
          </div>
          <div class="form-group full-width">
            <label>公司简介</label>
            <textarea v-model="settings.description" rows="4"></textarea>
          </div>
        </div>
      </div>

      <div class="actions">
        <button class="btn-primary" :disabled="saving" @click="handleSave">
          {{ saving ? '保存中...' : '保存设置' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.system-management-page h1 {
  margin: 0 0 24px;
  font-size: 24px;
  color: #333;
}

.settings-container {
  background: #fff;
  border-radius: 8px;
  padding: 32px;
}

.setting-section {
  margin-bottom: 32px;
}

.setting-section h2 {
  margin: 0 0 20px;
  font-size: 18px;
  color: #333;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group.full-width {
  grid-column: span 2;
}

.form-group label {
  font-size: 14px;
  color: #666;
}

.form-group input,
.form-group textarea {
  padding: 10px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: #1890ff;
}

.actions {
  display: flex;
  justify-content: flex-end;
  padding-top: 24px;
  border-top: 1px solid #f0f0f0;
}

.btn-primary {
  padding: 10px 32px;
  background: #1890ff;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary:hover:not(:disabled) {
  background: #40a9ff;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>