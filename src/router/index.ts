import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // ==================== 求职者端 ====================
    {
      path: '/',
      component: () => import('@/layouts/CandidateLayout.vue'),
      children: [
        {
          path: '',
          name: 'Home',
          component: () => import('@/views/candidate/Home.vue'),
          meta: { title: '首页' }
        },
        {
          path: 'jobs',
          name: 'JobList',
          component: () => import('@/views/candidate/JobList.vue'),
          meta: { title: '职位列表' }
        },
        {
          path: 'jobs/:id',
          name: 'JobDetail',
          component: () => import('@/views/candidate/JobDetail.vue'),
          meta: { title: '职位详情' }
        },
        {
          path: 'apply/:jobId',
          name: 'JobApply',
          component: () => import('@/views/candidate/JobApply.vue'),
          meta: { title: '申请职位', requiresAuth: true }
        },
        {
          path: 'resume',
          name: 'Resume',
          component: () => import('@/views/candidate/Resume.vue'),
          meta: { title: '我的简历', requiresAuth: true }
        },
        {
          path: 'center',
          name: 'CandidateCenter',
          component: () => import('@/views/candidate/Center.vue'),
          meta: { title: '个人中心', requiresAuth: true }
        },
      ]
    },
    // ==================== 登录/注册 ====================
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/auth/Login.vue'),
      meta: { title: '登录' }
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/views/auth/Register.vue'),
      meta: { title: '注册' }
    },
    {
      path: '/forgot-password',
      name: 'ForgotPassword',
      component: () => import('@/views/auth/ForgotPassword.vue'),
      meta: { title: '找回密码' }
    },
    // ==================== HR 后台 ====================
    {
      path: '/hr',
      component: () => import('@/layouts/HRLayout.vue'),
      meta: { roles: ['hr', 'admin'] },
      children: [
        {
          path: '',
          redirect: '/hr/dashboard'
        },
        {
          path: 'dashboard',
          name: 'HRDashboard',
          component: () => import('@/views/hr/Dashboard.vue'),
          meta: { title: '数据看板' }
        },
        {
          path: 'jobs',
          name: 'HRJobs',
          component: () => import('@/views/hr/JobManagement.vue'),
          meta: { title: '职位管理' }
        },
        {
          path: 'resumes',
          name: 'HRResumes',
          component: () => import('@/views/hr/ResumeManagement.vue'),
          meta: { title: '简历管理' }
        },
        {
          path: 'interviews',
          name: 'HRInterviews',
          component: () => import('@/views/hr/InterviewManagement.vue'),
          meta: { title: '面试管理' }
        },
      ]
    },
    // ==================== 管理员后台 ====================
    {
      path: '/admin',
      component: () => import('@/layouts/AdminLayout.vue'),
      meta: { roles: ['admin'] },
      children: [
        {
          path: '',
          redirect: '/admin/system'
        },
        {
          path: 'system',
          name: 'AdminSystem',
          component: () => import('@/views/admin/SystemManagement.vue'),
          meta: { title: '系统管理' }
        },
        {
          path: 'users',
          name: 'AdminUsers',
          component: () => import('@/views/admin/UserManagement.vue'),
          meta: { title: '用户管理' }
        },
        {
          path: 'departments',
          name: 'AdminDepartments',
          component: () => import('@/views/admin/DepartmentManagement.vue'),
          meta: { title: '部门管理' }
        },
        {
          path: 'logs',
          name: 'AdminLogs',
          component: () => import('@/views/admin/SystemLogs.vue'),
          meta: { title: '系统日志' }
        },
      ]
    },
    // 404页面
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/error/NotFound.vue'),
      meta: { title: '404' }
    }
  ]
})

// 解决重复点击路由报错问题
const originalPush = router.push
router.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const originalReplace = router.replace
router.replace = function replace(location) {
  return originalReplace.call(this, location).catch(err => err)
}

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title ? `${to.meta.title} - 招聘系统` : '招聘系统'

  // 检查是否需要登录
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth && !token) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
    return
  }

  // 检查角色权限
  const userStr = localStorage.getItem('user')
  if (userStr) {
    const user = JSON.parse(userStr)
    const requiredRoles = to.meta.roles as string[]
    if (requiredRoles && !requiredRoles.includes(user.role)) {
      next({ name: 'Home' })
      return
    }
  }

  next()
})

export default router