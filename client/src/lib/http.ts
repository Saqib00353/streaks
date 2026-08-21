import axios, { type AxiosRequestConfig } from 'axios'
import { env } from '@/lib/env.ts'

const api = axios.create({
    baseURL: env.VITE_API_URL,
    withCredentials: true,
})

export function makeRequest(
    url: string,
    options?: AxiosRequestConfig
) {
    return api(url, options).then(response => response.data)
}