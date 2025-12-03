export interface AuthUser {
  id: string
  username: string
}

export function useAuth() {
  const user = useState<AuthUser | null>('auth:user', () => null)
  const status = useState<'idle' | 'loading' | 'authenticated'>(
    'auth:status',
    () => 'idle'
  )

  const fetchMe = async () => {
    status.value = 'loading'
    try {
      const data = await $fetch<AuthUser | null>('/api/auth/me', {
        credentials: 'include'
      })
      user.value = data ?? null
      status.value = user.value ? 'authenticated' : 'idle'
    } catch {
      user.value = null
      status.value = 'idle'
    }
  }

  const login = async (payload: { username: string; password: string }) => {
    status.value = 'loading'
    try {
      const data = await $fetch<AuthUser>('/api/auth/login', {
        method: 'POST',
        body: payload,
        credentials: 'include'
      })
      user.value = data
      status.value = 'authenticated'
    } catch (error: any) {
      status.value = 'idle'
      throw createError(error)
    }
  }

  const logout = async () => {
    await $fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include'
    })
    user.value = null
    status.value = 'idle'
  }

  // 应用加载时自动获取当前用户（仅在客户端且状态为 idle 时）
  if (process.client && status.value === 'idle' && !user.value) {
    // 避免在 SSR 期间重复调用，也避免在中间件已经调用后重复调用
    fetchMe()
  }

  return {
    user,
    status,
    fetchMe,
    login,
    logout
  }
}


