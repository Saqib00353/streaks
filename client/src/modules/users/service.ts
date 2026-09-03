import { makeRequest } from "@/lib/http";

export type AuthTokenResponse = { access: string };
export type SubscriptionTier = 'free' | 'premium';
export type SubscriptionStatus = 'active' | 'past_due' | 'canceled' | 'incomplete' | 'trialing' | null;
export type MeResponse = {
    username: string;
    email: string;
    subscription_tier: SubscriptionTier;
    subscription_status: SubscriptionStatus;
    subscription_current_period_end: string | null;
    is_premium: boolean;
};

export function login(data: { username: string; password: string }) {
    return makeRequest<AuthTokenResponse>('/auth/login/', { data, method: 'POST' })
}

export function register(data: { username: string; email: string; password: string }) {
    return makeRequest<MeResponse>('/auth/register/', { data, method: 'POST' })
}

export function refresh() {
    return makeRequest<AuthTokenResponse>('/auth/refresh/', { method: 'POST' })
}

export function logout() {
    return makeRequest<void>('/auth/logout/', { method: 'POST' })
}

export function getMe() {
    return makeRequest<MeResponse>('/auth/me/')
}
