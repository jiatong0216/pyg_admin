// 导出一个已经配置好的axios
import axios from 'axios'

// 全局使用 必须依赖 vue 在main.js中使用
// baseURL 配置
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
// 添加请求拦截器
// 给config添加新的信息  config可以给请求头追加属性
axios.interceptors.request.use(config => {
    config.headers.Authorization = sessionStorage.getItem('token')
    return config
})

// 添加响应拦截器
// 判断token是否失效
axios.interceptors.response.use(res => {
    if (res.data.meta.status === 401) {
        location.href = '#/login'
    } else {
        return res
    }
})
export default axios
