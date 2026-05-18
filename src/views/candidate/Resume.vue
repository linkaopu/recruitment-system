<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { getMyResume, createResume, updateResume, uploadResume } from '@/api/resume'
import type { Resume, CreateResumeParams, WorkExperience, Education, ProjectExperience } from '@/types'

const resume = ref<Resume | null>(null)
const loading = ref(false)
const saving = ref(false)

const formData = ref<CreateResumeParams>({
  name: '',
  phone: '',
  email: '',
  age: undefined,
  gender: undefined,
  education: '',
  workExperience: [],
  educationHistory: [],
  projects: [],
  skills: [],
  selfIntroduction: '',
  attachmentUrl: '',
  attachmentName: ''
})

const skillInput = ref('')

onMounted(async () => {
  await fetchResume()
})

async function fetchResume() {
  loading.value = true
  try {
    const res = await getMyResume()
    resume.value = res.data
    if (res.data) {
      formData.value = {
        name: res.data.name || '',
        phone: res.data.phone || '',
        email: res.data.email || '',
        age: res.data.age,
        gender: res.data.gender,
        education: res.data.education || '',
        workExperience: res.data.workExperience || [],
        educationHistory: res.data.educationHistory || [],
        projects: res.data.projects || [],
        skills: res.data.skills || [],
        selfIntroduction: res.data.selfIntroduction || '',
        attachmentUrl: res.data.attachmentUrl || '',
        attachmentName: res.data.attachmentName || ''
      }
    }
  } finally {
    loading.value = false
  }
}

async function handleSave() {
  saving.value = true
  try {
    if (resume.value?.id) {
      await updateResume(resume.value.id, formData.value)
    } else {
      const res = await createResume(formData.value)
      resume.value = res.data
    }
    alert('保存成功')
  } finally {
    saving.value = false
  }
}

async function handleUpload(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]
    const res = await uploadResume(file)
    formData.value.attachmentUrl = res.data.url
    formData.value.attachmentName = res.data.name
  }
}

function addSkill() {
  if (skillInput.value.trim() && !formData.value.skills.includes(skillInput.value.trim())) {
    formData.value.skills.push(skillInput.value.trim())
    skillInput.value = ''
  }
}

function removeSkill(index: number) {
  formData.value.skills.splice(index, 1)
}

function addWorkExperience() {
  formData.value.workExperience?.push({
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    description: ''
  })
}

function removeWorkExperience(index: number) {
  formData.value.workExperience?.splice(index, 1)
}

function addEducation() {
  formData.value.educationHistory?.push({
    school: '',
    major: '',
    degree: '',
    startDate: '',
    endDate: ''
  })
}

function removeEducation(index: number) {
  formData.value.educationHistory?.splice(index, 1)
}

function addProject() {
  formData.value.projects?.push({
    name: '',
    role: '',
    startDate: '',
    endDate: '',
    description: '',
    technologies: []
  })
}

function removeProject(index: number) {
  formData.value.projects?.splice(index, 1)
}
</script>

<template>
  <div class="resume-page">
    <div class="container">
      <div class="page-header">
        <h1>{{ resume ? '编辑简历' : '创建简历' }}</h1>
        <RouterLink to="/center" class="btn-secondary">返回个人中心</RouterLink>
      </div>

      <div v-if="loading" class="loading">加载中...</div>

      <form v-else @submit.prevent="handleSave" class="resume-form">
        <section class="form-section">
          <h2>基本信息</h2>
          <div class="form-grid">
            <div class="form-item">
              <label>姓名 <span class="required">*</span></label>
              <input v-model="formData.name" type="text" required placeholder="请输入姓名" />
            </div>
            <div class="form-item">
              <label>电话 <span class="required">*</span></label>
              <input v-model="formData.phone" type="tel" required placeholder="请输入电话" />
            </div>
            <div class="form-item">
              <label>邮箱 <span class="required">*</span></label>
              <input v-model="formData.email" type="email" required placeholder="请输入邮箱" />
            </div>
            <div class="form-item">
              <label>年龄</label>
              <input v-model.number="formData.age" type="number" placeholder="请输入年龄" />
            </div>
            <div class="form-item">
              <label>性别</label>
              <select v-model="formData.gender">
                <option value="">请选择</option>
                <option value="male">男</option>
                <option value="female">女</option>
              </select>
            </div>
            <div class="form-item">
              <label>最高学历 <span class="required">*</span></label>
              <select v-model="formData.education" required>
                <option value="">请选择</option>
                <option value="大专">大专</option>
                <option value="本科">本科</option>
                <option value="硕士">硕士</option>
                <option value="博士">博士</option>
              </select>
            </div>
          </div>
        </section>

        <section class="form-section">
          <h2>工作经历</h2>
          <div v-for="(exp, index) in formData.workExperience" :key="index" class="experience-item">
            <div class="form-grid">
              <div class="form-item">
                <label>公司名称</label>
                <input v-model="exp.company" type="text" placeholder="请输入公司名称" />
              </div>
              <div class="form-item">
                <label>职位</label>
                <input v-model="exp.position" type="text" placeholder="请输入职位" />
              </div>
              <div class="form-item">
                <label>开始时间</label>
                <input v-model="exp.startDate" type="month" />
              </div>
              <div class="form-item">
                <label>结束时间</label>
                <input v-model="exp.endDate" type="month" :disabled="exp.isCurrent" />
              </div>
              <div class="form-item checkbox-item">
                <label>
                  <input v-model="exp.isCurrent" type="checkbox" />
                  至今
                </label>
              </div>
            </div>
            <div class="form-item full-width">
              <label>工作描述</label>
              <textarea v-model="exp.description" placeholder="请描述您的工作内容" rows="3"></textarea>
            </div>
            <button type="button" class="btn-remove" @click="removeWorkExperience(index)">删除</button>
          </div>
          <button type="button" class="btn-add" @click="addWorkExperience">+ 添加工作经历</button>
        </section>

        <section class="form-section">
          <h2>教育经历</h2>
          <div v-for="(edu, index) in formData.educationHistory" :key="index" class="experience-item">
            <div class="form-grid">
              <div class="form-item">
                <label>学校名称</label>
                <input v-model="edu.school" type="text" placeholder="请输入学校名称" />
              </div>
              <div class="form-item">
                <label>专业</label>
                <input v-model="edu.major" type="text" placeholder="请输入专业" />
              </div>
              <div class="form-item">
                <label>学历</label>
                <input v-model="edu.degree" type="text" placeholder="如：本科" />
              </div>
              <div class="form-item">
                <label>开始时间</label>
                <input v-model="edu.startDate" type="month" />
              </div>
              <div class="form-item">
                <label>结束时间</label>
                <input v-model="edu.endDate" type="month" />
              </div>
            </div>
            <button type="button" class="btn-remove" @click="removeEducation(index)">删除</button>
          </div>
          <button type="button" class="btn-add" @click="addEducation">+ 添加教育经历</button>
        </section>

        <section class="form-section">
          <h2>项目经历</h2>
          <div v-for="(proj, index) in formData.projects" :key="index" class="experience-item">
            <div class="form-grid">
              <div class="form-item">
                <label>项目名称</label>
                <input v-model="proj.name" type="text" placeholder="请输入项目名称" />
              </div>
              <div class="form-item">
                <label>担任角色</label>
                <input v-model="proj.role" type="text" placeholder="请输入角色" />
              </div>
              <div class="form-item">
                <label>开始时间</label>
                <input v-model="proj.startDate" type="month" />
              </div>
              <div class="form-item">
                <label>结束时间</label>
                <input v-model="proj.endDate" type="month" />
              </div>
            </div>
            <div class="form-item full-width">
              <label>项目描述</label>
              <textarea v-model="proj.description" placeholder="请描述项目内容" rows="3"></textarea>
            </div>
            <button type="button" class="btn-remove" @click="removeProject(index)">删除</button>
          </div>
          <button type="button" class="btn-add" @click="addProject">+ 添加项目经历</button>
        </section>

        <section class="form-section">
          <h2>技能标签</h2>
          <div class="skill-input">
            <input
              v-model="skillInput"
              type="text"
              placeholder="输入技能后按回车添加"
              @keyup.enter="addSkill"
            />
            <button type="button" @click="addSkill">添加</button>
          </div>
          <div v-if="formData.skills.length > 0" class="skill-tags">
            <span v-for="(skill, index) in formData.skills" :key="index" class="skill-tag">
              {{ skill }}
              <button type="button" @click="removeSkill(index)">×</button>
            </span>
          </div>
        </section>

        <section class="form-section">
          <h2>附件简历</h2>
          <div class="file-upload">
            <input type="file" accept=".pdf,.doc,.docx" @change="handleUpload" />
            <div v-if="formData.attachmentName" class="file-name">
              已上传：{{ formData.attachmentName }}
            </div>
          </div>
        </section>

        <section class="form-section">
          <h2>自我介绍</h2>
          <div class="form-item full-width">
            <textarea
              v-model="formData.selfIntroduction"
              placeholder="请介绍一下自己..."
              rows="5"
            ></textarea>
          </div>
        </section>

        <div class="form-actions">
          <button type="button" class="btn-secondary" @click="$router.push('/center')">
            取消
          </button>
          <button type="submit" class="btn-primary" :disabled="saving">
            {{ saving ? '保存中...' : '保存' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.resume-page {
  min-height: calc(100vh - 200px);
}

.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.page-header h1 {
  margin: 0;
  font-size: 28px;
  color: #333;
}

.loading {
  text-align: center;
  padding: 60px 0;
  color: #999;
}

.resume-form {
  background: #fff;
  border-radius: 8px;
  padding: 32px;
}

.form-section {
  padding-bottom: 32px;
  border-bottom: 1px solid #f0f0f0;
}

.form-section:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.form-section h2 {
  margin: 0 0 24px;
  font-size: 20px;
  color: #333;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-item.full-width {
  grid-column: span 2;
}

.form-item label {
  font-size: 14px;
  color: #333;
}

.required {
  color: #f5222d;
}

.form-item input,
.form-item select,
.form-item textarea {
  padding: 10px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s;
}

.form-item input:focus,
.form-item select:focus,
.form-item textarea:focus {
  border-color: #1890ff;
}

.checkbox-item {
  flex-direction: row;
  align-items: center;
}

.checkbox-item input {
  margin-right: 8px;
}

.experience-item {
  background: #fafafa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 16px;
}

.btn-add {
  padding: 10px 20px;
  background: #fff;
  border: 1px dashed #d9d9d9;
  color: #666;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.btn-add:hover {
  border-color: #1890ff;
  color: #1890ff;
}

.btn-remove {
  margin-top: 12px;
  padding: 6px 12px;
  background: #fff1f0;
  border: 1px solid #ffa39e;
  color: #f5222d;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn-remove:hover {
  background: #ffccc7;
}

.skill-input {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.skill-input input {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
}

.skill-input button {
  padding: 10px 20px;
  background: #1890ff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skill-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: #e6f7ff;
  color: #1890ff;
  border-radius: 4px;
  font-size: 14px;
}

.skill-tag button {
  background: none;
  border: none;
  color: #1890ff;
  cursor: pointer;
  font-size: 16px;
  padding: 0;
}

.file-upload {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.file-name {
  font-size: 14px;
  color: #52c41a;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  padding-top: 24px;
}

.btn-primary,
.btn-secondary {
  padding: 10px 32px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background: #1890ff;
  color: #fff;
}

.btn-primary:hover:not(:disabled) {
  background: #40a9ff;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: #fff;
  color: #666;
  border: 1px solid #d9d9d9;
}

.btn-secondary:hover {
  color: #1890ff;
  border-color: #1890ff;
}
</style>