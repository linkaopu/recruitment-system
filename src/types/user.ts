// ==================== 用户相关 ====================
// 用户类型枚举
export enum UserRole {
    CANDIDATE = 'candidate', // 求职者
    HR = 'hr',               // HR
    ADMIN = 'admin'          // 管理员
}

// 用户信息
export interface User {
    id: number
    username: string
    email: string
    phone: string
    role: UserRole  // 用户角色
    avatar?: string // 头像URL
    createdAt: string // 创建时间
    updatedAt: string // 更新时间
}

// 登录参数
export interface LoginParams {
    username: string
    password: string
    type?: 'account' | 'phone' // 账号密码或手机验证码
    code?: string // 验证码
}

// 注册参数
export interface RegisterParams {
    username: string
    password: string
    email: string
    phone: string
    role: UserRole  // 用户角色
    code?: string // 验证码
}


// 登录响应
export interface LoginResponse {
    token: string
    user: User
}
