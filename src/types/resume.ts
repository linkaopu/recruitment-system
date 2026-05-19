// ==================== 简历相关 ====================
// 简历状态枚举
export enum ResumeStatus {
    PENDING = 'pending',       // 待查看
    SCREENED = 'screened',     // 已初筛
    INTERVIEW = 'interview',   // 面试
    HIRED = 'hired',           // 录用
    REJECTED = 'rejected'      // 不匹配
}

// 工作经历
export interface WorkExperience {
  company: string // 公司名称
  position: string // 职位名称
  startDate: string // 开始日期
  endDate?: string // 结束日期，当前工作可不填
  isCurrent: boolean // 是否当前工作
  description: string // 工作内容描述
}

// 教育经历
export interface Education {
  school: string // 学校名称
  major: string // 专业
  degree: string // 学位
  startDate: string // 开始日期
  endDate: string // 结束日期
}

// 项目经历
export interface ProjectExperience {
  name: string // 项目名称
  role: string // 在项目中的角色
  startDate: string // 开始日期
  endDate?: string // 结束日期，当前项目可不填
  description: string // 项目内容描述
  technologies: string[] // 使用的技术栈
}

// 简历信息
export interface Resume {
  id: number
  userId: number
  name: string // 姓名
  phone: string // 电话
  email: string // 邮箱
  age?: number // 年龄
  gender?: 'male' | 'female' // 性别
  education: string // 学历
  avatar?: string // 头像
  workExperience?: WorkExperience[] // 工作经历
  educationHistory?: Education[] // 教育经历
  projects?: ProjectExperience[] // 项目经历
  skills: string[] // 技能标签
  attachmentUrl?: string // 附件简历URL
  attachmentName?: string // 附件简历名称
  selfIntroduction?: string // 自我介绍
  createdAt: string
  updatedAt: string
}

// 创建简历参数
export interface CreateResumeParams {
  name: string
  phone: string
  email: string
  age?: number
  gender?: 'male' | 'female'
  education: string
  avatar?: string // 头像URL
  workExperience?: WorkExperience[] // 工作经历
  educationHistory?: Education[] // 教育经历
  projects?: ProjectExperience[] // 项目经历
  skills: string[]
  attachmentUrl?: string // 附件简历URL
  attachmentName?: string // 附件简历名称
  selfIntroduction?: string // 自我介绍
}