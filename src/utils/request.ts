import axios from "axios"

const requst = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_URL,
    timeout: 5000,
})

requst.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    return config
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
})

requst.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    const res = response.data
    return res
}, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error)
})
   

export default requst