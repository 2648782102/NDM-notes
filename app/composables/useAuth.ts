import { onNuxtReady } from '#app'
import { createError } from 'h3'
import { watch } from 'vue'

export interface AuthUser {
  id: string
  username: string
}

export function useAuth() {
  // 从 localStorage 中恢复用户信息（如果存在）
  const initialUser = process.client ? JSON.parse(localStorage.getItem('auth:user') || 'null') : null
  const user = useState<AuthUser | null>('auth:user', () => initialUser)
  
  const status = useState<'idle' | 'loading' | 'authenticated'>(
    'auth:status',
    () => initialUser ? 'authenticated' : 'idle'
  )

  // 监听用户状态变化，自动保存到 localStorage
  watch(user, (newUser) => {
    if (process.client) {
      localStorage.setItem('auth:user', JSON.stringify(newUser))
    }
  }, { deep: true })

  const fetchMe = async () => {
    // 如果已经在加载中，避免重复调用
    if (status.value === 'loading') {
      return
    }
    
    status.value = 'loading'
    try {
      const data = await $fetch<AuthUser | null>('/api/auth/me', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      user.value = data ?? null
      status.value = user.value ? 'authenticated' : 'idle'
    } catch (error) {
      console.error('Authentication check failed:', error)
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
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      // 直接设置用户状态，不依赖 cookie
      user.value = data
      status.value = 'authenticated'
      return data
    } catch (error: any) {
      status.value = 'idle'
      // 确保错误对象有 message 属性
      if (error instanceof Error) {
        throw error
      } else {
        throw new Error(error.message || '登录失败')
      }
    }
  }

  const logout = async () => {
    try {
      await $fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
    } catch (error) {
      // 忽略退出登录错误，因为即使失败也应该重置状态
      console.error('Logout failed:', error)
    } finally {
      user.value = null
      status.value = 'idle'
      // 清除 localStorage 中的用户信息
      if (process.client) {
        localStorage.removeItem('auth:user')
      }
    }
  }

  // 在客户端加载时，如果有 localStorage 中的用户信息，直接设置为已认证状态
  // 这样即使刷新页面，用户也不会被重定向到登录页面
  if (process.client && initialUser) {
    user.value = initialUser
    status.value = 'authenticated'
  } else if (process.client && status.value === 'idle' && !user.value) {
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


