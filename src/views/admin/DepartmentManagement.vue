<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getDepartments, createDepartment, updateDepartment, deleteDepartment } from '@/api/admin'
import type { Department } from '@/types'

const departments = ref<Department[]>([])
const loading = ref(false)
const showCreateDialog = ref(false)
const editingDept = ref<Department | null>(null)

const formData = ref({
  name: '',
  code: '',
  description: ''
})

onMounted(() => {
  fetchDepartments()
})

async function fetchDepartments() {
  loading.value = true
  try {
    const res = await getDepartments()
    departments.value = res.data
  } finally {
    loading.value = false
  }
}

async function handleCreateDepartment() {
  await createDepartment(formData.value)
  showCreateDialog.value = false
  resetForm()
  fetchDepartments()
}

async function handleUpdateDepartment() {
  if (editingDept.value) {
    await updateDepartment(editingDept.value.id, formData.value)
    editingDept.value = null
    resetForm()
    fetchDepartments()
  }
}

async function handleDeleteDepartment(id: number) {
  if (confirm('确定要删除该部门吗？')) {
    await deleteDepartment(id)
    departments.value = departments.value.filter(d => d.id !== id)
  }
}

function openCreateDialog() {
  resetForm()
  showCreateDialog.value = true
}

function openEditDialog(dept: Department) {
  editingDept.value = dept
  formData.value = {
    name: dept.name,
    code: dept.code,
    description: dept.description || ''
  }
  showCreateDialog.value = true
}

function resetForm() {
  formData.value = {
    name: '',
    code: '',
    description: ''
  }
}
</script>

<template>
  <div class="department-management-page">
    <div class="page-header">
      <h1>部门管理</h1>
      <button class="btn-primary" @click="openCreateDialog">添加部门</button>
    </div>

    <div v-if="loading" class="loading">加载中...</div>

    <div v-else class="department-list">
      <div v-for="dept in departments" :key="dept.id" class="department-card">
        <div class="dept-header">
          <div class="dept-info">
            <h3>{{ dept.name }}</h3>
            <span class="code">{{ dept.code }}</span>
          </div>
          <div class="dept-actions">
            <button class="btn-link" @click="openEditDialog(dept)">编辑</button>
            <button class="btn-link btn-danger" @click="handleDeleteDepartment(dept.id)">删除</button>
          </div>
        </div>
        <div v-if="dept.description" class="dept-description">
          {{ dept.description }}
        </div>
      </div>

      <div v-if="departments.length === 0" class="empty-state">
        暂无部门数据
      </div>
    </div>

    <div v-if="showCreateDialog" class="dialog-overlay" @click.self="showCreateDialog = false">
      <div class="dialog">
        <div class="dialog-header">
          <h2>{{ editingDept ? '编辑部门' : '添加部门' }}</h2>
          <button class="close-btn" @click="showCreateDialog = false">×</button>
        </div>
        <div class="dialog-body">
          <div class="form-group">
            <label>部门名称 <span class="required">*</span></label>
            <input v-model="formData.name" type="text" placeholder="请输入部门名称" />
          </div>
          <div class="form-group">
            <label>部门代码 <span class="required">*</span></label>
            <input v-model="formData.code" type="text" placeholder="如：TECH" />
          </div>
          <div class="form-group">
            <label>部门描述</label>
            <textarea v-model="formData.description" placeholder="请输入部门描述" rows="3"></textarea>
          </div>
        </div>
        <div class="dialog-footer">
          <button class="btn-secondary" @click="showCreateDialog = false">取消</button>
          <button class="btn-primary" @click="editingDept ? handleUpdateDepartment() : handleCreateDepartment()">
            {{ editingDept ? '保存' : '创建' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.department-management-page h1 {
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

.department-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.department-card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #f0f0f0;
}

.dept-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.dept-info h3 {
  margin: 0 0 4px;
  font-size: 18px;
  color: #333;
}

.dept-info .code {
  display: inline-block;
  padding: 2px 8px;
  background: #f5f5f5;
  color: #999;
  border-radius: 4px;
  font-size: 12px;
}

.dept-actions {
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

.dept-description {
  color: #666;
  font-size: 14px;
  line-height: 1.6;
}

.empty-state {
  grid-column: 1 / -1;
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
  width: 450px;
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

.required {
  color: #f5222d;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
}

.form-group input:focus,
.form-group textarea:focus {
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