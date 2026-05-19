// ==================== 系统管理相关 ====================
// 系统设置
export interface Department {
    id: number
    name: string
    code: string
    description?: string
    createdAt: string
    updatedAt: string
}

// 系统日志
export interface SystemLog {
    id: number
    userId: number
    username: string
    action: string
    ip: string
    userAgent: string
    createdAt: string
}

// 仪表盘统计数据
export interface DashboardStats {
    todayApplications: number // 今日申请数
    totalJobs: number // 总职位数
    pendingResumes: number // 待处理简历数
    pendingInterviews: number // 待安排面试数
    applicationTrend: Array<{
        date: string
        count: number
    }> // 近7天申请趋势
}