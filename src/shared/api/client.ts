import axios, { type AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'
import { ApiError } from '@/shared/types/api/response'

const ACCESS_KEY = 'store.access_token'
const REFRESH_KEY = 'store.refresh_token'

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_KEY)
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_KEY)
}

export function setTokens(access: string, refresh: string): void {
  localStorage.setItem(ACCESS_KEY, access)
  localStorage.setItem(REFRESH_KEY, refresh)
}

export function clearTokens(): void {
  localStorage.removeItem(ACCESS_KEY)
  localStorage.removeItem(REFRESH_KEY)
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

let isRefreshing = false
let pendingQueue: Array<(token: string | null) => void> = []

function flushQueue(error: boolean): void {
  pendingQueue.forEach((cb) => cb(error ? null : getAccessToken()))
  pendingQueue = []
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    if (original && !original._retry && error.response?.status === 401 && getRefreshToken()) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push((token) => {
            if (!token) return reject(error)
            original.headers.Authorization = `Bearer ${token}`
            resolve(apiClient(original))
          })
        })
      }

      original._retry = true
      isRefreshing = true

      try {
        const { data } = await axios.post(
          `${apiClient.defaults.baseURL}/auth/refresh`,
          { refresh_token: getRefreshToken() },
          { headers: { 'Content-Type': 'application/json' } },
        )
        const payload = data as { data: { access_token: string; refresh_token: string } }
        setTokens(payload.data.access_token, payload.data.refresh_token)
        flushQueue(false)
        original.headers.Authorization = `Bearer ${payload.data.access_token}`
        return apiClient(original)
      } catch {
        flushQueue(true)
        clearTokens()
        window.location.assign('/login')
        return Promise.reject(error)
      } finally {
        isRefreshing = false
      }
    }

    const status = error.response?.status ?? 0
    const body = error.response?.data as { message?: string; code?: number } | undefined
    const message = body?.message ?? error.message ?? 'Request failed'
    const code = body?.code ?? status
    return Promise.reject(new ApiError(message, code, status, body))
  },
)