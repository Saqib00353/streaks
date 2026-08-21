import { makeRequest } from "@/lib/http";

export function fetchUsers() {
    return makeRequest('/users/')
}