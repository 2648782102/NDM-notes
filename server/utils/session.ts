import { randomUUID } from 'node:crypto'
import type { H3Event } from 'h3'
import { getCookie, setCookie, deleteCookie } from 'h3'

export interface SessionUser {
  id: string
  username: string
}

interface SessionData {
  user: SessionUser
  createdAt: number
}

const SESSIONS = new Map<string, SessionData>()
const COOKIE_NAME = 'ndm_session'
const SESSION_TTL = 1000 * 60 * 60 * 24 * 7 // 7 days

export function createSession(event: H3Event, user: SessionUser) {
  const token = randomUUID()
  SESSIONS.set(token, {
    user,
    createdAt: Date.now()
  })

  setCookie(event, COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_TTL / 1000
  })

  return user
}

export function getSessionUser(event: H3Event): SessionUser | null {
  const token = getCookie(event, COOKIE_NAME)
  if (!token) return null

  const session = SESSIONS.get(token)
  if (!session) return null

  if (Date.now() - session.createdAt > SESSION_TTL) {
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
      message: '未登录或会话已过期'
    })
  }
  return user
}


