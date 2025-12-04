import { randomUUID } from 'node:crypto'
import type { H3Event } from 'h3'
import { getCookie, setCookie, deleteCookie, createError } from 'h3'

export interface SessionUser {
  id: string
  username: string
}

interface SessionData {
  user: SessionUser
  createdAt: number
}

// 在开发环境中使用内存存储，避免文件系统问题
// 生产环境中应该使用真正的数据库或持久化存储
const SESSIONS = new Map<string, SessionData>()
const COOKIE_NAME = 'ndm_session'
const SESSION_TTL = 1000 * 60 * 60 * 24 * 7 // 7 days

// 定期清理过期会话
setInterval(() => {
  const now = Date.now()
  for (const [token, session] of SESSIONS.entries()) {
    if (now - session.createdAt > SESSION_TTL) {
      SESSIONS.delete(token)
    }
  }
}, 1000 * 60 * 60) // 每小时清理一次

export function createSession(event: H3Event, user: SessionUser) {
  const token = randomUUID()
  const sessionData: SessionData = {
    user,
    createdAt: Date.now()
  }

  // 将会话数据存储在内存中
  SESSIONS.set(token, sessionData)
  console.log('Session created for user:', user.username, 'token:', token)

  // 优化 cookie 设置，确保它能够在刷新页面后仍然存在
  setCookie(event, COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false, // 开发环境中使用 http，生产环境中应该使用 https
    path: '/',
    maxAge: SESSION_TTL / 1000,
    // 确保 cookie 在所有子域名下都可用
    domain: undefined,
    // 确保 cookie 不会被浏览器自动删除
    expires: new Date(Date.now() + SESSION_TTL)
  })

  return user
}

export function getSessionUser(event: H3Event): SessionUser | null {
  const token = getCookie(event, COOKIE_NAME)
  if (!token) {
    console.log('No session cookie found')
    return null
  }

  const session = SESSIONS.get(token)
  if (!session) {
    console.log('Session not found in memory for token:', token)
    return null
  }

  if (Date.now() - session.createdAt > SESSION_TTL) {
    console.log('Session expired, removing from memory:', token)
    SESSIONS.delete(token)
    return null
  }

  return session.user
}

export function destroySession(event: H3Event) {
  const token = getCookie(event, COOKIE_NAME)
  if (token) {
    SESSIONS.delete(token)
  }
  deleteCookie(event, COOKIE_NAME, { path: '/' })
}

export function requireUser(event: H3Event): SessionUser {
  const user = getSessionUser(event)
  if (!user) {
  throw createError({
    statusCode: 401,
    message: '未认证用户'
  })
}
  return user
}
