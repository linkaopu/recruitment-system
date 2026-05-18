<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ref, onMounted } from 'vue'
import { getHotJobs, getLatestJobs } from '@/api/job'
import type { Job } from '@/types'

const hotJobs = ref<Job[]>([])
const latestJobs = ref<Job[]>([])
const searchKeyword = ref('')

onMounted(async () => {
  const [hotRes, latestRes] = await Promise.all([
    getHotJobs(),
    getLatestJobs()
  ])
  hotJobs.value = hotRes.data
  latestJobs.value = latestRes.data
})

const handleSearch = () => {
  // 跳转到职位列表页面并带上搜索关键词
}
</script>

<template>
  <div class="home-page">
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title">加入我们，共创未来</h1>
        <p class="hero-subtitle">寻找你的理想职业机会</p>
        <div class="search-box">
          <input v-model="searchKeyword" type="text" placeholder="搜索职位名称、地点、部门..." />
          <button @click="handleSearch">搜索</button>
        </div>
      </div>
    </section>

    <section class="hot-jobs">
      <div class="container">
        <h2 class="section-title">热门职位</h2>
        <div class="job-grid">
          <RouterLink
            v-for="job in hotJobs"
            :key="job.id"
            :to="`/jobs/${job.id}`"
            class="job-card"
          >
            <div class="job-title">{{ job.title }}</div>
            <div class="job-info">
              <span>{{ job.department }}</span>
              <span>{{ job.location }}</span>
              <span class="salary">{{ job.salaryDisplay }}</span>
            </div>
          </RouterLink>
        </div>
      </div>
    </section>

    <section class="latest-jobs">
      <div class="container">
        <h2 class="section-title">最新发布</h2>
        <div class="job-list">
          <div v-for="job in latestJobs" :key="job.id" class="job-item">
            <RouterLink :to="`/jobs/${job.id}`" class="job-item-link">
              <div class="job-item-title">{{ job.title }}</div>
              <div class="job-item-info">
                <span>{{ job.department }}</span>
                <span>{{ job.location }}</span>
                <span class="experience">{{ job.experience }}</span>
                <span class="salary">{{ job.salaryDisplay }}</span>
              </div>
              <div class="job-item-time">{{ job.createdAt }}</div>
            </RouterLink>
          </div>
        </div>
        <div class="more-link">
          <RouterLink to="/jobs">查看更多职位</RouterLink>
        </div>
      </div>
    </section>

    <section class="company-info">
      <div class="container">
        <h2 class="section-title">关于我们</h2>
        <div class="info-content">
          <p>我们是一家致力于创新与发展的企业，始终坚持以人为本的理念。</p>
          <p>如果你有梦想、有能力、有激情，欢迎加入我们的团队！</p>
          <div class="contact-info">
            <div>联系电话：400-123-4567</div>
            <div>邮箱：hr@company.com</div>
            <div>地址：北京市朝阳区xxx大厦</div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-page {
  background: #f5f7fa;
}

.hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 100px 0;
  text-align: center;
  color: #fff;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: 48px;
  margin: 0 0 16px;
}

.hero-subtitle {
  font-size: 20px;
  margin: 0 0 40px;
  opacity: 0.9;
}

.search-box {
  display: flex;
  max-width: 600px;
  margin: 0 auto;
  gap: 12px;
}

.search-box input {
  flex: 1;
  padding: 14px 20px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
}

.search-box button {
  padding: 14px 32px;
  background: #fff;
  color: #667eea;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.search-box button:hover {
  background: #f0f0f0;
}

.section-title {
  font-size: 28px;
  text-align: center;
  margin: 0 0 32px;
  color: #333;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.hot-jobs,
.latest-jobs,
.company-info {
  padding: 60px 0;
}

.job-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.job-card {
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.3s;
  border: 1px solid #e8e8e8;
}

.job-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-4px);
}

.job-title {
  font-size: 18px;
  font-weight: 500;
  color: #333;
  margin-bottom: 12px;
}

.job-info {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 14px;
  color: #666;
}

.job-info .salary {
  color: #f5222d;
  font-weight: 500;
  margin-left: auto;
}

.job-list {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
}

.job-item {
  border-bottom: 1px solid #f0f0f0;
}

.job-item:last-child {
  border-bottom: none;
}

.job-item-link {
  display: block;
  padding: 20px 24px;
  text-decoration: none;
  transition: background 0.3s;
}

.job-item-link:hover {
  background: #fafafa;
}

.job-item-title {
  font-size: 18px;
  color: #333;
  margin-bottom: 8px;
}

.job-item-info {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.job-item-info .salary {
  color: #f5222d;
  font-weight: 500;
}

.job-item-time {
  font-size: 13px;
  color: #999;
}

.more-link {
  text-align: center;
  margin-top: 24px;
}

.more-link a {
  color: #1890ff;
  text-decoration: none;
  font-size: 16px;
}

.more-link a:hover {
  text-decoration: underline;
}

.info-content {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.info-content p {
  font-size: 16px;
  color: #666;
  line-height: 1.8;
  margin: 0 0 16px;
}

.contact-info {
  margin-top: 32px;
  padding-top: 32px;
  border-top: 1px solid #e8e8e8;
}

.contact-info div {
  font-size: 16px;
  color: #333;
  margin-bottom: 12px;
}
</style>