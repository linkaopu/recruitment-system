<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function goHome() {
  router.push('/')
}
</script>

<template>
  <div class="not-found-page">
    <div class="content">
      <div class="error-code">404</div>
      <h1>页面不存在</h1>
      <p>抱歉，您访问的页面不存在或已被移除</p>
      <button class="btn-primary" @click="goHome">返回首页</button>
    </div>
  </div>
</template>

<style scoped>
.not-found-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
}

.content {
  text-align: center;
  padding: 40px;
}

.error-code {
  font-size: 120px;
  font-weight: 700;
  color: #1890ff;
  line-height: 1;
  margin-bottom: 24px;
}

.content h1 {
  margin: 0 0 16px;
  font-size: 28px;
  color: #333;
}

.content p {
  margin: 0 0 32px;
  font-size: 16px;
  color: #999;
}

.btn-primary {
  padding: 12px 32px;
  background: #1890ff;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary:hover {
  background: #40a9ff;
}
</style>