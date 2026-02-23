import axios from 'axios'

const http = axios.create({
  // 默认走同源，避免本地部署时出现跨域预检(OPTIONS 405)
  baseURL: import.meta.env.VITE_API_BASE_URL || '/',
  timeout: 10000,
})

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem('token')
      const current = window.location.pathname
      if (current !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)

export default http
