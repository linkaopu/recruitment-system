// ==================== 通知相关 ====================
// 通知信息
export interface Notification {
    id: number
    userId: number
    title: string
    content: string
    type: 'interview' | 'application' | 'system' // 通知类型
    isRead: boolean
    createdAt: string
}