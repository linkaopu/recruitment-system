// ==================== 申请记录相关 ====================
import type { Job } from './job'
import type { Resume } from './resume'
import { ResumeStatus } from './resume'
export interface Application {
    id: number
    jobId: number
    jobTitle: string
    resumeId: number // 使用的简历ID
    userId: number
    userName: string
    status: ResumeStatus
    appliedAt: string
    updatedAt: string
    job?: Job
    resume?: Resume // 可选，申请记录中可能包含职位和简历的详细信息
    rejectReason?: string // 拒绝原因
}

// 申请记录查询参数
export interface ApplicationQueryParams {
    userId?: number
    jobId?: number
    status?: ResumeStatus // 申请状态
    page: number
    pageSize: number
}