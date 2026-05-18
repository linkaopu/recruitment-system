<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { resetPassword, sendCode } from '@/api/auth'

const router = useRouter()

const step = ref(1)
const phone = ref('')
const code = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const countdown = ref(0)

async function handleSendCode() {
  if (!phone.value) {
    alert('请输入手机号')
    return
  }

  try {
    await sendCode(phone.value)
    countdown.value = 60
    const timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)
    step.value = 2
  } catch (error) {
    console.error('Send code failed:', error)
  }
}

async function handleVerifyCode() {
  if (!code.value) {
    alert('请输入验证码')
    return
  }
  step.value = 3
}

async function handleResetPassword() {
  if (newPassword.value !== confirmPassword.value) {
    alert('两次输入的密码不一致')
    return
  }

  loading.value = true
  try {
    await resetPassword({ phone: phone.value, code: code.value, password: newPassword.value })
    alert('密码重置成功，请重新登录')
    router.push('/login')
  } catch (error) {
    console.error('Reset password failed:', error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="forgot-password-page">
    <div class="forgot-container">
      <div class="header">
        <h1>找回密码</h1>
        <p>重置您的登录密码</p>
      </div>

      <div class="steps">
        <div class="step" :class="{ active: step >= 1, completed: step > 1 }">
          <span class="step-num">1</span>
          <span class="step-text">验证手机</span>
        </div>
        <div class="step" :class="{ active: step >= 2, completed: step > 2 }">
          <span class="step-num">2</span>
          <span class="step-text">输入验证码</span>
        </div>
        <div class="step" :class="{ active: step >= 3, completed: step > 3 }">
          <span class="step-num">3</span>
          <span class="step-text">重置密码</span>
        </div>
      </div>

      <form @submit.prevent class="form">
        <div v-if="step === 1" class="form-group">
          <label>手机号</label>
          <input v-model="phone" type="tel" placeholder="请输入注册手机号" />
          <button type="button" class="btn-primary" @click="handleSendCode">下一步</button>
        </div>

        <div v-if="step === 2" class="form-group">
          <label>验证码</label>
          <div class="code-group">
            <input v-model="code" type="text" placeholder="请输入验证码" />
            <button type="button" class="code-btn" :disabled="countdown > 0">
              {{ countdown > 0 ? `${countdown}s` : '重新发送' }}
            </button>
          </div>
          <button type="button" class="btn-primary" @click="handleVerifyCode">下一步</button>
        </div>

        <div v-if="step === 3" class="form-group">
          <label>新密码</label>
          <input v-model="newPassword" type="password" placeholder="请输入新密码（至少6位）" />
          <label style="margin-top: 16px">确认新密码</label>
          <input v-model="confirmPassword" type="password" placeholder="请再次输入新密码" />
          <button type="button" class="btn-primary" :disabled="loading" @click="handleResetPassword">
            {{ loading ? '重置中...' : '重置密码' }}
          </button>
        </div>
      </form>

      <div class="footer">
        <RouterLink to="/login">返回登录</RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.forgot-password-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.forgot-container {
  width: 400px;
  background: #fff;
  border-radius: 12px;
  padding: 48px 40px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.header {
  text-align: center;
  margin-bottom: 32px;
}

.header h1 {
  margin: 0 0 12px;
  font-size: 28px;
  color: #333;
}

.header p {
  margin: 0;
  font-size: 14px;
  color: #999;
}

.steps {
  display: flex;
  justify-content: space-between;
  margin-bottom: 32px;
  position: relative;
}

.steps::before {
  content: '';
  position: absolute;
  top: 16px;
  left: 20px;
  right: 20px;
  height: 2px;
  background: #f0f0f0;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  position: relative;
  z-index: 1;
}

.step-num {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #f0f0f0;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.step.active .step-num {
  background: #1890ff;
  color: #fff;
}

.step.completed .step-num {
  background: #52c41a;
  color: #fff;
}

.step-text {
  font-size: 12px;
  color: #999;
}

.step.active .step-text,
.step.completed .step-text {
  color: #333;
}

.form {
  margin-bottom: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.form-group label {
  font-size: 14px;
  color: #666;
}

.form-group input {
  padding: 12px 16px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
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
}

.code-btn:disabled {
  color: #999;
  cursor: not-allowed;
}

.btn-primary {
  padding: 12px;
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

.footer {
  text-align: center;
}

.footer a {
  color: #1890ff;
  text-decoration: none;
  font-size: 14px;
}
</style>