import axios, { type AxiosRequestConfig } from 'axios'
import { env } from '@/lib/env.ts'

const BASE_URL = env.VITE_API_URL + '/' + env.VITE_API_VERSION + '/'

let accessToken: string | null = null
let onAuthFailure: (() => void) | null = null

export function setAccessToken(token: string | null) {
  accessToken = token
}

export function getAccessToken() {
  return accessToken
}

export function setOnAuthFailure(cb: (() => void) | null) {
  onAuthFailure = cb
}

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

const AUTH_ENDPOINTS = ['/auth/login/', '/auth/refresh/', '/auth/register/']

let refreshPromise: Promise<string> | null = null

async function refreshAccessToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = api
      .post<{ access: string }>('/auth/refresh/')
      .then((res) => {
        setAccessToken(res.data.access)
        return res.data.access
      })
      .finally(() => {
        refreshPromise = null
      })
  }
  return refreshPromise
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    const requestUrl: string = original?.url ?? ''
    const isAuthEndpoint = AUTH_ENDPOINTS.some((path) => requestUrl.includes(path))

    if (error.response?.status === 401 && !original._retry && !isAuthEndpoint) {
      original._retry = true
      try {
        const newToken = await refreshAccessToken()
        original.headers = original.headers ?? {}
        original.headers.Authorization = `Bearer ${newToken}`
        return api(original)
      } catch (refreshError) {
        setAccessToken(null)
        onAuthFailure?.()
        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(error)
  }
)

export async function makeRequest<T = unknown>(
  url: string,
  options?: AxiosRequestConfig
): Promise<T> {
  return api(url, options).then((response) => response.data)
}
