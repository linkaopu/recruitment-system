// ==================== 收藏相关 ====================
import type { Job } from './job'
// 收藏信息
export interface Favorite {
    id: number
    userId: number
    jobId: number
    job: Job
    createdAt: string
}