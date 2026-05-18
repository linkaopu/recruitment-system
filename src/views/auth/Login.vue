<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import type { LoginParams } from '@/types'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const loginType = ref<'account' | 'phone'>('account')
const form = ref<LoginParams>({
  username: '',
  password: '',
  type: 'account'
})
const loading = ref(false)

async function handleLogin() {
  loading.value = true
  try {
    form.value.type = loginType.value
    await userStore.login(form.value)
    const redirect = (route.query.redirect as string) || '/'
    router.push(redirect)
  } catch (error) {
    console.error('Login failed:', error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-header">
        <h1>欢迎登录</h1>
        <p>招聘系统 · 开启职业新篇章</p>
      </div>

      <div class="login-tabs">
        <button :class="{ active: loginType === 'account' }" @click="loginType = 'account'">
          账号登录
        </button>
        <button :class="{ active: loginType === 'phone' }" @click="loginType = 'phone'">
          手机登录
        </button>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div v-if="loginType === 'account'" class="form-group">
          <input
            v-model="form.username"
            type="text"
            placeholder="请输入用户名"
            required
          />
        </div>
        <div v-else class="form-group">
          <input
            v-model="form.username"
            type="tel"
            placeholder="请输入手机号"
            required
          />
        </div>

        <div v-if="loginType === 'account'" class="form-group">
          <input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            required
          />
        </div>
        <div v-else class="form-group code-group">
          <input
            v-model="form.code"
            type="text"
            placeholder="请输入验证码"
            required
          />
          <button type="button" class="code-btn">获取验证码</button>
        </div>

        <button type="submit" class="btn-login" :disabled="loading">
          {{ loading ? '登录中...' : '登录' }}
        </button>
      </form>

      <div class="login-footer">
        <RouterLink to="/forgot-password" class="forgot-link">忘记密码?</RouterLink>
        <div class="register-link">
          还没有账号? <RouterLink to="/register">立即注册</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-container {
  width: 400px;
  background: #fff;
  border-radius: 12px;
  padding: 48px 40px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.login-header h1 {
  margin: 0 0 12px;
  font-size: 28px;
  color: #333;
}

.login-header p {
  margin: 0;
  font-size: 14px;
  color: #999;
}

.login-tabs {
  display: flex;
  margin-bottom: 24px;
  border-bottom: 1px solid #f0f0f0;
}

.login-tabs button {
  flex: 1;
  padding: 14px 0;
  background: none;
  border: none;
  font-size: 16px;
  color: #666;
  cursor: pointer;
  position: relative;
}

.login-tabs button.active {
  color: #1890ff;
}

.login-tabs button.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background: #1890ff;
}

.login-form {
  margin-bottom: 24px;
}

.form-group {
  margin-bottom: 20px;
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

.code-group {
  display: flex;
  gap: 12px;
}

.code-group input {
  flex: 1;
}

.code-btn {
  padding: 12px 16px;
  background: #f5f5f5;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.3s;
}

.code-btn:hover {
  background: #e6e6e6;
}

.btn-login {
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

.btn-login:hover:not(:disabled) {
  background: #40a9ff;
}

.btn-login:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.login-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.forgot-link {
  color: #1890ff;
  text-decoration: none;
}

.register-link {
  color: #666;
}

.register-link a {
  color: #1890ff;
  text-decoration: none;
}
</style>