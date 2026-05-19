import axios from 'axios'
import type { InternalAxiosRequestConfig, AxiosResponse } from 'axios'

const request = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL || '/api',
  timeout: 5000,
})

// 请求拦截器：在请求发送之前做一些处理，比如添加认证信息
request.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token')
    if (token && config.headers) {
        // 在请求头中添加Bearer Token
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器：在接收到响应后做一些处理，比如统一处理错误
request.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default request