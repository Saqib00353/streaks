import axios, { type AxiosRequestConfig } from 'axios'
import { env } from '@/lib/env.ts'

const BASE_URL = env.VITE_API_URL + '/' + env.VITE_API_VERSION + '/'

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
})

export async function makeRequest(
    url: string,
    options?: AxiosRequestConfig
) {
    return api(url, options).then(response => response.data)
}