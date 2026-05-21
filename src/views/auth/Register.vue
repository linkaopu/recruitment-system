<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { register } from '@/api/auth'
import type { RegisterParams } from '@/types'
import { UserRole } from '@/types'

defineOptions({
  name: 'RegisterView'
})

const router = useRouter()


const form = ref<RegisterParams>({
  username: '',
  password: '',
  email: '',
  phone: '',
  role: UserRole.CANDIDATE
})
const confirmPassword = ref('')
const loading = ref(false)

async function handleRegister() {
  if (form.value.password !== confirmPassword.value) {
    alert('两次输入的密码不一致')
    return
  }

  loading.value = true
  try {
    await register(form.value)
    alert('注册成功，请登录')
    router.push('/login')
  } catch (error) {
    console.error('Register failed:', error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="register-page">
    <div class="register-container">
      <div class="register-header">
        <h1>注册账号</h1>
        <p>加入我们，开启职业新篇章</p>
      </div>

      <form @submit.prevent="handleRegister" class="register-form">
        <div class="form-group">
          <label>用户名</label>
          <input
            v-model="form.username"
            type="text"
            placeholder="请输入用户名"
            required
          />
        </div>

        <div class="form-group">
          <label>手机号</label>
          <input
            v-model="form.phone"
            type="tel"
            placeholder="请输入手机号"
            required
          />
        </div>

        <div class="form-group">
          <label>邮箱</label>
          <input
            v-model="form.email"
            type="email"
            placeholder="请输入邮箱"
            required
          />
        </div>

        <div class="form-group">
          <label>密码</label>
          <input
            v-model="form.password"
            type="password"
            placeholder="请输入密码（至少6位）"
            minlength="6"
            required
          />
        </div>

        <div class="form-group">
          <label>确认密码</label>
          <input
            v-model="confirmPassword"
            type="password"
            placeholder="请再次输入密码"
            minlength="6"
            required
          />
        </div>

        <div class="form-group">
          <label>注册身份</label>
          <div class="role-selector">
            <label class="role-option">
              <input v-model="form.role" type="radio" value="candidate" />
              <span>求职者</span>
            </label>
            <label class="role-option">
              <input v-model="form.role" type="radio" value="hr" />
              <span>HR</span>
            </label>
          </div>
        </div>

        <button type="submit" class="btn-register" :disabled="loading">
          {{ loading ? '注册中...' : '注册' }}
        </button>
      </form>

      <div class="register-footer">
        已有账号? <RouterLink to="/login">立即登录</RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.register-container {
  width: 420px;
  background: #fff;
  border-radius: 12px;
  padding: 48px 40px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.register-header {
  text-align: center;
  margin-bottom: 32px;
}

.register-header h1 {
  margin: 0 0 12px;
  font-size: 28px;
  color: #333;
}

.register-header p {
  margin: 0;
  font-size: 14px;
  color: #999;
}

.register-form {
  margin-bottom: 24px;
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

.form-group input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
  transition: all 0.3s;
}

.form-group input:focus {
  border-color: #1890ff;
}

.role-selector {
  display: flex;
  gap: 24px;
}

.role-option {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.role-option input {
  width: auto;
  cursor: pointer;
}

.btn-register {
  width: 100%;
  padding: 12px;
  background: #1890ff;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-register:hover:not(:disabled) {
  background: #40a9ff;
}

.btn-register:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.register-footer {
  text-align: center;
  font-size: 14px;
  color: #666;
}

.register-footer a {
  color: #1890ff;
  text-decoration: none;
}
</style>