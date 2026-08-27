import { makeRequest } from "@/lib/http";

export function login(data: {username: string, password: string}) {
    return makeRequest('/auth/login/', { data, method: 'POST' })
}