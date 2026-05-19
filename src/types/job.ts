// ==================== 职位相关 ====================
// 职位信息
export interface Job {
    id: number
    title: string // 职位名称
    department: string // 部门
    location: string // 地点
    salaryMin: number // 最低薪资
    salaryMax: number // 最高薪资
    salaryDisplay: string // 显示的薪资文本
    education: string // 学历要求
    experience: string // 工作经验要求
    headcount: number // 招聘人数
    description: string // 岗位职责
    requirements: string // 任职要求
    benefits: string // 福利待遇
    status: 'active' | 'inactive' // 上架/下架
    viewCount: number // 浏览数
    applyCount: number // 申请数
    isHot: boolean // 是否热门
    createdAt: string
    updatedAt: string
}

// 创建职位参数
export interface JobQueryParams {
    keyword?: string // 搜索关键词
    department?: string // 部门
    location?: string // 地点
    salaryMin?: number // 最低薪资
    salaryMax?: number // 最高薪资
    education?: string // 学历要求
    experience?: string // 工作经验要求
    sortBy?: 'latest' | 'salary' | 'hot' // 排序方式
    page: number // 页码
    pageSize: number // 每页数量
}

// 职位列表响应
export interface JobListResponse {
    list: Job[] // 职位列表
    total: number // 总数
    page: number // 页码
    pageSize: number // 每页数量
}