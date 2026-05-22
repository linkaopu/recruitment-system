<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getUsers, createUser, updateUser, deleteUser } from '@/api/admin'
import type { User } from '@/types'
import type { ApiResponse, PageResponse } from '@/types'
import { UserRole } from '@/types'

const users = ref<User[]>([])
const loading = ref(false)
const showCreateDialog = ref(false)
const editingUser = ref<User | null>(null)

const formData = ref({
  username: '',
  email: '',
  phone: '',
  role: UserRole.CANDIDATE
})

onMounted(() => {
  fetchUsers()
})

async function fetchUsers() {
  loading.value = true
  try {
    const res = (await getUsers({ page: 1, pageSize: 100 })) as unknown as ApiResponse<PageResponse<User>>
    users.value = res.data.list
  } finally {
    loading.value = false
  }
}

async function handleCreateUser() {
  await createUser(formData.value)
  showCreateDialog.value = false
  resetForm()
  fetchUsers()
}

async function handleUpdateUser() {
  if (editingUser.value) {
    await updateUser(editingUser.value.id, formData.value)
    editingUser.value = null
    resetForm()
    fetchUsers()
  }
}

async function handleDeleteUser(id: number) {
  if (confirm('确定要删除该用户吗？')) {
    await deleteUser(id)
    users.value = users.value.filter(u => u.id !== id)
  }
}

function openCreateDialog() {
  resetForm()
  showCreateDialog.value = true
}

function openEditDialog(user: User) {
  editingUser.value = user
  formData.value = {
    username: user.username,
    email: user.email,
    phone: user.phone,
    role: user.role
  }
  showCreateDialog.value = true
}

function resetForm() {
  formData.value = {
    username: '',
    email: '',
    phone: '',
    role: UserRole.CANDIDATE
  }
}

function getRoleText(role: UserRole) {
  const map: Record<UserRole, string> = {
    [UserRole.CANDIDATE]: '求职者',
    [UserRole.HR]: 'HR',
    [UserRole.ADMIN]: '管理员'
  }
  return map[role] || role
}
</script>

<template>
  <div class="user-management-page">
    <div class="page-header">
      <h1>用户管理</h1>
      <button class="btn-primary" @click="openCreateDialog">添加用户</button>
    </div>

    <div v-if="loading" class="loading">加载中...</div>

    <div v-else class="user-table-container">
      <table class="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>用户名</th>
            <th>邮箱</th>
            <th>手机号</th>
            <th>角色</th>
            <th>注册时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.username }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.phone }}</td>
            <td>{{ getRoleText(user.role) }}</td>
            <td>{{ user.createdAt }}</td>
            <td class="actions">
              <button class="btn-link" @click="openEditDialog(user)">编辑</button>
              <button class="btn-link btn-danger" @click="handleDeleteUser(user.id)">删除</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="users.length === 0" class="empty-state">
        暂无用户数据
      </div>
    </div>

    <div v-if="showCreateDialog" class="dialog-overlay" @click.self="showCreateDialog = false">
      <div class="dialog">
        <div class="dialog-header">
          <h2>{{ editingUser ? '编辑用户' : '添加用户' }}</h2>
          <button class="close-btn" @click="showCreateDialog = false">×</button>
        </div>
        <div class="dialog-body">
          <div class="form-group">
            <label>用户名 <span class="required">*</span></label>
            <input v-model="formData.username" type="text" placeholder="请输入用户名" />
          </div>
          <div class="form-group">
            <label>邮箱 <span class="required">*</span></label>
            <input v-model="formData.email" type="email" placeholder="请输入邮箱" />
          </div>
          <div class="form-group">
            <label>手机号 <span class="required">*</span></label>
            <input v-model="formData.phone" type="tel" placeholder="请输入手机号" />
          </div>
          <div class="form-group">
            <label>角色 <span class="required">*</span></label>
            <select v-model="formData.role">
              <option :value="UserRole.CANDIDATE">求职者</option>
              <option :value="UserRole.HR">HR</option>
              <option :value="UserRole.ADMIN">管理员</option>
            </select>
          </div>
        </div>
        <div class="dialog-footer">
          <button class="btn-secondary" @click="showCreateDialog = false">取消</button>
          <button class="btn-primary" @click="editingUser ? handleUpdateUser() : handleCreateUser()">
            {{ editingUser ? '保存' : '创建' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.user-management-page h1 {
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

.user-table-container {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
}

.user-table {
  width: 100%;
  border-collapse: collapse;
}

.user-table th {
  padding: 16px;
  text-align: left;
  background: #fafafa;
  font-weight: 500;
  color: #333;
  border-bottom: 1px solid #f0f0f0;
}

.user-table td {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  color: #666;
}

.user-table tr:last-child td {
  border-bottom: none;
}

.actions {
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