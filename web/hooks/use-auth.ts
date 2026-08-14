'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

interface AuthUser {
  _id?: string
  name?: string
  email?: string
  role?: string
}

interface MeResponse {
  success?: boolean
  user?: AuthUser
  message?: string
}

const baseUrl = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:4000'

export function useAuth() {
  const [status, setStatus] = useState<AuthStatus>('loading')
  const [user, setUser] = useState<AuthUser | null>(null)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setStatus('loading')
    setError(null)

    try {
      const response = await fetch(`${baseUrl}/user/me`, {
        method: 'GET',
        credentials: 'include',
      })

      if (!response.ok) {
        setUser(null)
        setStatus('unauthenticated')
        return
      }

      const data = (await response.json()) as MeResponse

      if (!data?.user) {
        setUser(null)
        setStatus('unauthenticated')
        return
      }

      setUser(data.user)
      setStatus('authenticated')
    } catch (err) {
      setUser(null)
      setStatus('unauthenticated')
      setError(err instanceof Error ? err.message : 'Failed to fetch current user')
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  return {
    status,
    user,
    error,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
    refresh,
  }
}

export function useRequireAuth(redirectTo = '/login') {
  const router = useRouter()
  const auth = useAuth()

  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      router.replace(redirectTo)
    }
  }, [auth.isLoading, auth.isAuthenticated, redirectTo, router])

  return auth
}
