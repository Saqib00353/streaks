import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import {
  getMe,
  login as loginRequest,
  logout as logoutRequest,
  register as registerRequest,
  refresh as refreshRequest,
  type MeResponse,
} from '@/modules/users/service'
import { setAccessToken, setOnAuthFailure } from '@/lib/http'

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'
type AuthUser = MeResponse | null

type AuthContextValue = {
  status: AuthStatus
  user: AuthUser
  login: (data: { username: string; password: string }) => Promise<void>
  register: (data: { username: string; email: string; password: string }) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('loading')
  const [user, setUser] = useState<AuthUser>(null)

  useEffect(() => {
    setOnAuthFailure(() => {
      setAccessToken(null)
      setUser(null)
      setStatus('unauthenticated')
    })

    refreshRequest()
      .then(async (res) => {
        setAccessToken(res.access)
        const me = await getMe()
        setUser(me)
        setStatus('authenticated')
      })
      .catch(() => {
        setStatus('unauthenticated')
      })

    return () => setOnAuthFailure(null)
  }, [])

  async function login(data: { username: string; password: string }) {
    const res = await loginRequest(data)
    setAccessToken(res.access)
    const me = await getMe()
    setUser(me)
    setStatus('authenticated')
  }

  async function register(data: { username: string; email: string; password: string }) {
    await registerRequest(data)
    await login({ username: data.username, password: data.password })
  }

  async function logout() {
    try {
      await logoutRequest()
    } finally {
      setAccessToken(null)
      setUser(null)
      setStatus('unauthenticated')
    }
  }

  return (
    <AuthContext.Provider value={{ status, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
