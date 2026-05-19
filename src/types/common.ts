// ==================== 通用响应类型 ====================
// API响应格式
export interface ApiResponse<T = any> {
    code: number
    message: string
    data: T
}

// 分页响应格式
export interface PageResponse<T> {
    list: T[]
    total: number
    page: number
    pageSize: number
}