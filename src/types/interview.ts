// ==================== 面试相关 ====================
// 面试方式
export enum InterviewMethod {
    ONLINE = 'online',     // 线上
    OFFLINE = 'offline'    // 线下
}

// 面试结果
export enum InterviewResult {
    PENDING = 'pending',   // 待定
    PASS = 'pass',         // 通过
    FAIL = 'fail'          // 不通过
}



// 面试信息
export interface Interview {
    id: number
    applicationId: number
    jobId: number
    jobTitle: string
    userId: number
    userName: string
    resumeId: number
    interviewer: string // 面试官
    interviewTime: string // 面试时间
    location: string // 面试地点
    method: InterviewMethod // 面试方式
    result: InterviewResult // 面试结果
    notes?: string // 面试备注
    notified: boolean // 是否已发送通知
    createdAt: string
    updatedAt: string
}

// 创建面试参数
export interface CreateInterviewParams {
    applicationId: number // 申请记录ID
    interviewer: string // 面试官
    interviewTime: string // 面试时间
    location: string // 面试地点
    method: InterviewMethod // 面试方式
}