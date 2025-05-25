// utils/api.ts
import axios from 'axios'
import Cookies from 'js-cookie'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')

  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `${token}`,
    }
  }
  return config
})

let isRefreshing = false
type FailedRequest = {
  resolve: (token: string | null) => void
  reject: (error: unknown) => void
}

let failedQueue: FailedRequest[] = []

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = `${token}`
            return api(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }
      originalRequest._retry = true
      isRefreshing = true
      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh-token`,
          { token: Cookies.get('refreshToken') },
          { withCredentials: true },
        )
        const newAccessToken = res.data.accessToken
        api.defaults.headers.common['Authorization'] = `${newAccessToken}`
        Cookies.set('accessToken', newAccessToken)
        processQueue(null, newAccessToken)
        return api(originalRequest)
      } catch (err) {
        processQueue(err, null)
        Cookies.remove('accessToken')
        Cookies.remove('refreshToken')
        window.location.href = '/login'
        return Promise.reject(err)
      } finally {
        isRefreshing = false
      }
    }
    return Promise.reject(error)
  },
)

export default api
