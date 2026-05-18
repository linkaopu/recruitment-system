<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const route = useRoute()

const handleLogout = () => {
  userStore.logout()
}
</script>

<template>
  <div class="candidate-layout">
    <header class="header">
      <div class="container">
        <div class="header-inner">
          <RouterLink to="/" class="logo">
            <h1>招聘系统</h1>
          </RouterLink>
          <nav class="nav">
            <RouterLink to="/" :class="{ active: route.path === '/' }">首页</RouterLink>
            <RouterLink to="/jobs" :class="{ active: route.path.startsWith('/jobs') && route.path !== '/jobs' }">职位列表</RouterLink>
          </nav>
          <div class="header-actions">
            <template v-if="userStore.isLoggedIn">
              <RouterLink to="/center" class="btn-outline">个人中心</RouterLink>
              <button @click="handleLogout" class="btn-text">退出</button>
            </template>
            <template v-else>
              <RouterLink to="/login" class="btn-outline">登录</RouterLink>
              <RouterLink to="/register" class="btn-primary">注册</RouterLink>
            </template>
          </div>
        </div>
      </div>
    </header>
    <main class="main">
      <RouterView />
    </main>
    <footer class="footer">
      <div class="container">
        <p>&copy; 2024 招聘系统. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.candidate-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.logo {
  text-decoration: none;
}

.logo h1 {
  margin: 0;
  font-size: 24px;
  color: #1890ff;
}

.nav {
  display: flex;
  gap: 32px;
}

.nav a {
  text-decoration: none;
  color: #333;
  font-size: 16px;
  padding: 8px 0;
  border-bottom: 2px solid transparent;
  transition: all 0.3s;
}

.nav a:hover,
.nav a.active {
  color: #1890ff;
  border-bottom-color: #1890ff;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.btn-outline,
.btn-primary,
.btn-text {
  padding: 8px 20px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
  text-decoration: none;
  border: 1px solid transparent;
}

.btn-outline {
  color: #1890ff;
  border-color: #1890ff;
  background: transparent;
}

.btn-outline:hover {
  background: #e6f7ff;
}

.btn-primary {
  color: #fff;
  background: #1890ff;
}

.btn-primary:hover {
  background: #40a9ff;
}

.btn-text {
  color: #666;
  background: transparent;
  border: none;
}

.btn-text:hover {
  color: #1890ff;
}

.main {
  flex: 1;
  padding: 24px 0;
}

.footer {
  background: #f5f5f5;
  padding: 24px 0;
  text-align: center;
  color: #666;
}

.footer p {
  margin: 0;
}
</style>