<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ref } from 'vue'

const userStore = useUserStore()
const route = useRoute()

const collapsed = ref(false)

const menuItems = [
  { path: '/admin/system', name: 'AdminSystem', label: '系统设置', icon: 'Settings' },
  { path: '/admin/users', name: 'AdminUsers', label: '用户管理', icon: 'User' },
  { path: '/admin/departments', name: 'AdminDepartments', label: '部门管理', icon: 'Office' },
  { path: '/admin/logs', name: 'AdminLogs', label: '系统日志', icon: 'Document' },
]

const handleLogout = () => {
  userStore.logout()
}
</script>

<template>
  <div class="admin-layout" :class="{ collapsed }">
    <aside class="sidebar">
      <div class="sidebar-header">
        <RouterLink to="/" class="logo">
          <h1>系统管理</h1>
        </RouterLink>
      </div>
      <nav class="sidebar-nav">
        <RouterLink
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          class="nav-item"
          :class="{ active: route.path === item.path }"
        >
          <span class="nav-text">{{ item.label }}</span>
        </RouterLink>
      </nav>
    </aside>
    <div class="main-content">
      <header class="header">
        <div class="header-left">
          <button class="collapse-btn" @click="collapsed = !collapsed">
            <span v-if="!collapsed">收起</span>
            <span v-else>展开</span>
          </button>
        </div>
        <div class="header-right">
          <span class="user-name">{{ userStore.user?.username }}</span>
          <button @click="handleLogout" class="btn-logout">退出</button>
        </div>
      </header>
      <main class="main">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 240px;
  background: #2c3e50;
  color: #fff;
  transition: width 0.3s;
  flex-shrink: 0;
}

.admin-layout.collapsed .sidebar {
  width: 64px;
}

.sidebar-header {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo {
  text-decoration: none;
  color: #fff;
}

.logo h1 {
  margin: 0;
  font-size: 20px;
}

.admin-layout.collapsed .logo h1 {
  font-size: 16px;
}

.sidebar-nav {
  padding: 16px 0;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 12px 24px;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: all 0.3s;
}

.admin-layout.collapsed .nav-item {
  padding: 12px;
  justify-content: center;
}

.nav-item:hover,
.nav-item.active {
  background: #34495e;
  color: #fff;
}

.nav-text {
  white-space: nowrap;
}

.admin-layout.collapsed .nav-text {
  font-size: 12px;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #f0f2f5;
}

.header {
  height: 64px;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
}

.header-left {
  display: flex;
  align-items: center;
}

.collapse-btn {
  padding: 8px 12px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 14px;
  color: #666;
}

.collapse-btn:hover {
  color: #1890ff;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-name {
  color: #333;
  font-size: 14px;
}

.btn-logout {
  padding: 6px 16px;
  border: 1px solid #d9d9d9;
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.btn-logout:hover {
  color: #1890ff;
  border-color: #1890ff;
}

.main {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}
</style>